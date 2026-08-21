import os
import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.transcription import TranscriptionService


router = APIRouter(
    prefix="/api/transcription",
    tags=["Transcription"]
)


# Initialize the transcription service once.
# Loading Whisper for every request would be extremely inefficient.
transcription_service = TranscriptionService()


@router.post("/")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Upload an audio file and return its transcription.
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

    # Generate a unique filename to avoid collisions.
    unique_filename = f"{uuid.uuid4()}{extension}"

    upload_directory = "uploads"

    os.makedirs(upload_directory, exist_ok=True)

    file_path = os.path.join(
        upload_directory,
        unique_filename
    )

    try:

        # Save uploaded audio
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Transcribe audio
        result = transcription_service.transcribe(
            file_path
        )

        return {
            "filename": filename,
            "transcription": result
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Transcription failed: {str(error)}"
        )

    finally:

        # Delete temporary audio file
        if os.path.exists(file_path):
            os.remove(file_path)