import re
from app.schemas.intake import ResumeParseRequest, ResumeParseResponse, CandidateProfile, EducationItem
from app.core.logger import logger

class IntakeService:
    async def parse_resume(self, req: ResumeParseRequest) -> ResumeParseResponse:
        text = req.raw_text or ""
        
        # Heuristic extraction for skills
        known_skills = [
            "React", "TypeScript", "JavaScript", "Python", "NestJS", "Node.js", 
            "Docker", "PostgreSQL", "Redis", "FastAPI", "Tailwind CSS", "Git", "REST APIs", "AWS"
        ]
        found_skills = [skill for skill in known_skills if re.search(r'\b' + re.escape(skill) + r'\b', text, re.IGNORECASE)]
        if not found_skills:
            found_skills = ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"]

        # Email detection
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
        email = email_match.group(0) if email_match else "candidate@cubeai.internal"

        # Phone detection
        phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
        phone = phone_match.group(0) if phone_match else "+91 98765 43210"

        # Experience extraction
        exp_match = re.search(r'(\d+(?:\.\d+)?)\+?\s*(?:years|yrs)', text, re.IGNORECASE)
        experience_years = float(exp_match.group(1)) if exp_match else 4.5

        profile = CandidateProfile(
            first_name="Alex",
            last_name="Mercer",
            email=email,
            phone=phone,
            current_title="Senior Software Engineer",
            experience_years=experience_years,
            skills=found_skills,
            education=[EducationItem(degree="B.Tech in Computer Science", institution="National Institute of Technology", graduation_year=2020)],
            summary=f"Experienced software professional with {experience_years} years in fullstack engineering and cloud-native systems."
        )

        return ResumeParseResponse(
            candidate_profile=profile,
            extraction_confidence=0.94,
            model="mock-deterministic-v1",
            fallback_used=True
        )

intake_service = IntakeService()
