from fastapi import APIRouter, Depends
from app.schemas.rag import RAGQueryRequest, RAGQueryResponse
from app.services.rag_service import rag_service
from app.core.security import verify_service_key

router = APIRouter()

@router.post("/query", response_model=RAGQueryResponse)
async def query_policies(
    request: RAGQueryRequest,
    _authorized: bool = Depends(verify_service_key)
):
    return await rag_service.query(request)
