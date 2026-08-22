from fastapi import FastAPI

from app.database import Base, engine

from app.models import Meeting, ActionItem

from app.routes.transcription import router as transcription_router
from app.routes.analysis import router as analysis_router
from app.routes.meetings import router as meetings_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MeetMind API",
    description="AI-powered meeting intelligence platform",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "MeetMind API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


app.include_router(transcription_router)
app.include_router(analysis_router)
app.include_router(meetings_router)
