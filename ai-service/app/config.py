import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "CubeAI Solutions HRMS - AI Microservice"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    PORT: int = 8001
    HOST: str = "0.0.0.0"
    
    # Internal service authentication
    AI_SERVICE_KEY: str = "cubeai_internal_secret_key_2026"
    
    # Ollama integration
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.2:3b"
    OLLAMA_TIMEOUT_SECONDS: float = 10.0
    
    # Mock fallback flag
    AI_MOCK_FALLBACK: bool = True
    
    # CORS
    CORS_ORIGINS: list[str] = ["*"]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
