from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.app.models import ChatRequest, ChatResponse
from backend.app.gemini import GeminiService

app = FastAPI(
    title="Sensei API",
    version="1.0.0",
    description="Backend API for the Sensei Voice Assistant"
)

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # We'll restrict this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gemini_service = GeminiService()


@app.get("/")
def home():
    return {
        "message": "Welcome to Sensei API!",
        "status": "Running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/api/v1/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    try:
        reply = gemini_service.generate_response(request.message)

        return ChatResponse(
            response=reply
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )