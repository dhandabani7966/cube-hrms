from fastapi import APIRouter, Depends
from app.schemas.triage import CaseTriageRequest, CaseTriageResponse
from app.services.triage_service import triage_service
from app.core.security import verify_service_key

router = APIRouter()

@router.post("/triage", response_model=CaseTriageResponse)
async def triage_case(
    request: CaseTriageRequest,
    _authorized: bool = Depends(verify_service_key)
):
    return await triage_service.triage_case(request)
