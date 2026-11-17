from pydantic import BaseModel, Field
from typing import Optional, List

class RAGQueryRequest(BaseModel):
    query: str = Field(..., description="Employee policy or handbook question")
    tenant_id: Optional[str] = Field(None, description="Tenant ID context")
    context: Optional[str] = Field(None, description="Optional extra policy context")
    top_k: int = Field(3, description="Number of document citations to retrieve")

class Citation(BaseModel):
    title: str
    section: str
    relevance_score: float

class RAGQueryResponse(BaseModel):
    answer: str
    citations: List[Citation]
    confidence: float
    model: str
    fallback_used: bool
