from pydantic import BaseModel, Field
from typing import Optional, List

class ResumeParseRequest(BaseModel):
    raw_text: Optional[str] = Field(None, description="Plain text extracted from candidate resume")
    filename: Optional[str] = Field(None, description="Original filename")
    file_base64: Optional[str] = Field(None, description="Optional base64 encoded document")

class EducationItem(BaseModel):
    degree: str
    institution: str
    graduation_year: Optional[int] = None

class CandidateProfile(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    current_title: Optional[str] = None
    experience_years: float = 0.0
    skills: List[str] = []
    education: List[EducationItem] = []
    summary: str

class ResumeParseResponse(BaseModel):
    candidate_profile: CandidateProfile
    extraction_confidence: float
    model: str
    fallback_used: bool
