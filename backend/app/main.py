from fastapi import FastAPI

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