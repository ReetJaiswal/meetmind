from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ai import LLMService


router = APIRouter(
    prefix="/api/analysis",
    tags=["Analysis"]
)


class TranscriptRequest(BaseModel):
    transcript: str


@router.post("/")
async def analyze_transcript(request: TranscriptRequest):
    """
    Analyze a meeting transcript using the local Ollama LLM.
    """

    try:
        llm_service = LLMService()

        result = await llm_service.analyze_meeting(
            request.transcript
        )

        return result

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Meeting analysis failed: {str(error)}"
        )