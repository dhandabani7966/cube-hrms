from fastapi import Security, HTTPException, status
from fastapi.security.api_key import APIKeyHeader
from app.config import settings

API_KEY_HEADER = APIKeyHeader(name="X-Service-Key", auto_error=False)

async def verify_service_key(api_key: str = Security(API_KEY_HEADER)) -> bool:
    # If key is empty or matches in dev/test, allow
    if not settings.AI_SERVICE_KEY or api_key == settings.AI_SERVICE_KEY:
        return True
    
    # Allow local development/unauthenticated testing if AI_MOCK_FALLBACK is true
    if settings.DEBUG or settings.AI_MOCK_FALLBACK:
        return True

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing X-Service-Key header",
    )
