import os
import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.transcription import TranscriptionService
from app.services.ai import LLMService


router = APIRouter(
    prefix="/api/transcription",
    tags=["Transcription"]
)


# Initialize services once when the application starts.
transcription_service = TranscriptionService()
llm_service = LLMService()


@router.post("/")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Upload an audio file, transcribe it using Faster Whisper,
    and analyze the transcript using Ollama.
    """

    allowed_extensions = {
        ".mp3",
        ".wav",
        ".m4a",
        ".mp4",
        ".webm"
    }

    filename = file.filename or ""

    extension = os.path.splitext(filename)[1].lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Unsupported audio format."
        )

    # Generate a unique filename.
    unique_filename = f"{uuid.uuid4()}{extension}"

    upload_directory = "uploads"

    os.makedirs(upload_directory, exist_ok=True)

    file_path = os.path.join(
        upload_directory,
        unique_filename
    )

    try:

        # ------------------------------------------------
        # STEP 1: Save uploaded audio
        # ------------------------------------------------

        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # ------------------------------------------------
        # STEP 2: Transcribe audio using Faster Whisper
        # ------------------------------------------------

        transcription = transcription_service.transcribe(
            file_path
        )

        # ------------------------------------------------
        # STEP 3: Analyze transcript using Ollama
        # ------------------------------------------------

        analysis = await llm_service.analyze_meeting(
            transcription["text"]
        )

        # ------------------------------------------------
        # STEP 4: Return complete meeting intelligence
        # ------------------------------------------------

        return {
            "filename": filename,

            "transcription": transcription,

            "analysis": analysis
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Meeting processing failed: {str(error)}"
        )

    finally:

        # Delete temporary audio file.
        if os.path.exists(file_path):
            os.remove(file_path)