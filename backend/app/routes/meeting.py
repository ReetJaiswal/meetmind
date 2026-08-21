import os
import tempfile

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.transcription import TranscriptionService
from app.services.ai import LLMService


router = APIRouter(
    prefix="/api/meetings",
    tags=["Meetings"]
)


@router.post("/analyze")
async def analyze_meeting(file: UploadFile = File(...)):
    """
    Complete MeetMind pipeline:

    Audio
      ↓
    Faster-Whisper
      ↓
    Transcript
      ↓
    Ollama + Qwen3:4b
      ↓
    Meeting Analysis
    """

    temp_path = None

    try:
        # 1. Validate uploaded file
        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="No file provided"
            )

        # 2. Read uploaded audio
        audio_data = await file.read()

        if not audio_data:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty"
            )

        # 3. Preserve original extension
        _, extension = os.path.splitext(file.filename)

        if not extension:
            extension = ".wav"

        # 4. Save audio temporarily
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension
        ) as temp_file:

            temp_file.write(audio_data)
            temp_path = temp_file.name

        # 5. Transcribe using Faster-Whisper
        transcription_service = TranscriptionService()

        transcription = transcription_service.transcribe(
            temp_path
        )

        transcript_text = transcription["text"]

        if not transcript_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract any speech from the audio"
            )

        # 6. Analyze transcript using Qwen3:4b
        llm_service = LLMService()

        analysis = await llm_service.analyze_meeting(
            transcript_text
        )

        # 7. Return complete result
        return {
            "filename": file.filename,
            "transcription": transcription,
            "analysis": analysis
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Meeting analysis failed: {str(error)}"
        )

    finally:
        # 8. Delete temporary audio file
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)