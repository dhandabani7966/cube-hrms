from fastapi import APIRouter, Depends
from app.schemas.intake import ResumeParseRequest, ResumeParseResponse
from app.services.intake_service import intake_service
from app.core.security import verify_service_key

router = APIRouter()

@router.post("/parse", response_model=ResumeParseResponse)
async def parse_resume(
    request: ResumeParseRequest,
    _authorized: bool = Depends(verify_service_key)
):
    return await intake_service.parse_resume(request)
