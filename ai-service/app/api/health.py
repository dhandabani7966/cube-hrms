from fastapi import APIRouter
from app.config import settings
from app.services.ollama_client import ollama_client

router = APIRouter()

@router.get("/health")
async def health_check():
    ollama_ready = await ollama_client.is_available()
    return {
        "status": "ok",
        "service": "cubeai-hrms-ai-service",
        "version": settings.APP_VERSION,
        "ollama_connected": ollama_ready,
        "mock_fallback_enabled": settings.AI_MOCK_FALLBACK
    }
