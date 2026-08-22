import json
import os
import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.meeting import Meeting
from app.models.action_item import ActionItem

from app.services.transcription import transcription_service
from app.services.ai import LLMService


router = APIRouter(
    prefix="/api/meetings",
    tags=["Meetings"]
)


# Initialize LLM service once
llm_service = LLMService()


# Supported audio/video formats
ALLOWED_EXTENSIONS = {
    ".mp3",
    ".wav",
    ".m4a",
    ".mp4",
    ".webm"
}


@router.post("/analyze")
async def analyze_meeting(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Complete MeetMind pipeline:

    Audio
        ↓
    Faster Whisper
        ↓
    Transcript
        ↓
    Ollama / Qwen3
        ↓
    SQLite Database
        ↓
    Meeting Insights
    """

    filename = file.filename or ""

    # ---------------------------------------------
    # 1. Validate file extension
    # ---------------------------------------------

    extension = os.path.splitext(filename)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported audio format. "
                "Supported formats: MP3, WAV, M4A, MP4, WEBM."
            )
        )

    # ---------------------------------------------
    # 2. Create temporary upload path
    # ---------------------------------------------

    unique_filename = f"{uuid.uuid4()}{extension}"

    upload_directory = "uploads"

    os.makedirs(
        upload_directory,
        exist_ok=True
    )

    file_path = os.path.join(
        upload_directory,
        unique_filename
    )

    try:

        # ---------------------------------------------
        # 3. Save uploaded file temporarily
        # ---------------------------------------------

        content = await file.read()

        if not content:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty."
            )

        with open(file_path, "wb") as buffer:
            buffer.write(content)

        # ---------------------------------------------
        # 4. Transcription
        # ---------------------------------------------

        transcription = transcription_service.transcribe(
            file_path
        )

        transcript_text = transcription.get(
            "text",
            ""
        )

        if not transcript_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract speech from the audio."
            )

        # ---------------------------------------------
        # 5. LLM analysis
        # ---------------------------------------------

        analysis = await llm_service.analyze_meeting(
            transcript_text
        )

        if not isinstance(analysis, dict):
            raise HTTPException(
                status_code=500,
                detail="LLM returned an invalid response."
            )

        # ---------------------------------------------
        # 6. Create Meeting database record
        # ---------------------------------------------

        meeting = Meeting(
            title=os.path.splitext(filename)[0],
            filename=filename,
            language=transcription.get("language"),
            transcript=transcript_text,
            summary=analysis.get("summary", ""),
            key_decisions=json.dumps(
                analysis.get("key_decisions", [])
            ),
            topics=json.dumps(
                analysis.get("topics", [])
            )
        )

        db.add(meeting)

        db.commit()
        db.refresh(meeting)

        # ---------------------------------------------
        # 7. Save action items
        # ---------------------------------------------

        action_items = analysis.get(
            "action_items",
            []
        )

        saved_action_items = []

        for item in action_items:

            # Make sure item is a dictionary
            if not isinstance(item, dict):
                continue

            action_item = ActionItem(
                meeting_id=meeting.id,
                task=item.get("task", ""),
                owner=item.get("owner"),
                deadline=item.get("deadline"),
                priority=item.get("priority")
            )

            db.add(action_item)

            saved_action_items.append(action_item)

        db.commit()

        # ---------------------------------------------
        # 8. Return complete response
        # ---------------------------------------------

        return {
            "meeting_id": meeting.id,
            "filename": filename,

            "transcription": transcription,

            "analysis": analysis,

            "message": (
                "Meeting analyzed and saved successfully."
            )
        }

    except HTTPException:
        db.rollback()
        raise

    except Exception as error:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Meeting analysis failed: {str(error)}"
        )

    finally:

        # ---------------------------------------------
        # 9. Delete temporary uploaded audio
        # ---------------------------------------------

        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass


# =====================================================
# GET ALL MEETINGS
# =====================================================

@router.get("/")
def get_meetings(
    db: Session = Depends(get_db)
):
    """
    Return all saved meetings.
    """

    meetings = (
        db.query(Meeting)
        .order_by(Meeting.created_at.desc())
        .all()
    )

    results = []

    for meeting in meetings:

        results.append({
            "id": meeting.id,
            "title": meeting.title,
            "filename": meeting.filename,
            "language": meeting.language,
            "summary": meeting.summary,

            "topics": json.loads(
                meeting.topics or "[]"
            ),

            "key_decisions": json.loads(
                meeting.key_decisions or "[]"
            ),

            "created_at": (
                meeting.created_at.isoformat()
                if meeting.created_at
                else None
            )
        })

    return {
        "meetings": results
    }


# =====================================================
# GET SINGLE MEETING
# =====================================================

@router.get("/{meeting_id}")
def get_meeting(
    meeting_id: int,
    db: Session = Depends(get_db)
):
    """
    Return complete meeting details.
    """

    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found."
        )

    action_items = (
        db.query(ActionItem)
        .filter(
            ActionItem.meeting_id == meeting_id
        )
        .all()
    )

    return {

        "id": meeting.id,

        "title": meeting.title,

        "filename": meeting.filename,

        "language": meeting.language,

        "transcript": meeting.transcript,

        "summary": meeting.summary,

        "key_decisions": json.loads(
            meeting.key_decisions or "[]"
        ),

        "topics": json.loads(
            meeting.topics or "[]"
        ),

        "action_items": [

            {
                "id": item.id,
                "task": item.task,
                "owner": item.owner,
                "deadline": item.deadline,
                "priority": item.priority
            }

            for item in action_items
        ],

        "created_at": (
            meeting.created_at.isoformat()
            if meeting.created_at
            else None
        )
    }


# =====================================================
# DELETE MEETING
# =====================================================

@router.delete("/{meeting_id}")
def delete_meeting(
    meeting_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a meeting and its associated action items.
    """

    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found."
        )

    # Delete associated action items first
    db.query(ActionItem).filter(
        ActionItem.meeting_id == meeting_id
    ).delete(
        synchronize_session=False
    )

    # Delete meeting
    db.delete(meeting)

    db.commit()

    return {
        "message": "Meeting deleted successfully."
    }