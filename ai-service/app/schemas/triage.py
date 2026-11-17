from pydantic import BaseModel, Field
from typing import Optional

class CaseTriageRequest(BaseModel):
    subject: str = Field(..., description="Helpdesk ticket subject")
    description: str = Field(..., description="Helpdesk ticket detailed description")
    tenant_id: Optional[str] = None
    employee_id: Optional[str] = None

class RoutingInfo(BaseModel):
    department: str
    sla_hours: int

class CaseTriageResponse(BaseModel):
    suggested_category: str
    suggested_priority: str  # LOW, MEDIUM, HIGH, URGENT
    sentiment: str           # POSITIVE, NEUTRAL, NEGATIVE
    sentiment_score: float   # -1.0 to 1.0
    urgency_score: float     # 0.0 to 1.0
    suggested_routing: RoutingInfo
    summary: str
    model: str
    fallback_used: bool
