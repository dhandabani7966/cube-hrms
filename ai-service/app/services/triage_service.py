from app.schemas.triage import CaseTriageRequest, CaseTriageResponse, RoutingInfo

class TriageService:
    async def triage_case(self, req: CaseTriageRequest) -> CaseTriageResponse:
        content = f"{req.subject} {req.description}".lower()

        # Keyword mapping
        if any(w in content for w in ["salary", "payroll", "payslip", "bonus", "tax", "uncredited"]):
            category = "Payroll & Compensation"
            priority = "URGENT" if any(w in content for w in ["urgent", "rent", "delayed", "not credited"]) else "HIGH"
            routing = RoutingInfo(department="Finance & Payroll", sla_hours=4 if priority == "URGENT" else 8)
            sentiment = "NEGATIVE"
            sentiment_score = -0.82
            urgency_score = 0.90
        elif any(w in content for w in ["laptop", "hardware", "wifi", "vpn", "password", "monitor"]):
            category = "IT Support & Infrastructure"
            priority = "HIGH" if "broken" in content or "blocked" in content else "MEDIUM"
            routing = RoutingInfo(department="IT Infrastructure", sla_hours=8)
            sentiment = "NEUTRAL"
            sentiment_score = -0.15
            urgency_score = 0.65
        elif any(w in content for w in ["harassment", "posh", "ethics", "discrimination", "grievance"]):
            category = "Employee Relations & Grievance"
            priority = "URGENT"
            routing = RoutingInfo(department="Ethics & HR Compliance", sla_hours=2)
            sentiment = "NEGATIVE"
            sentiment_score = -0.95
            urgency_score = 0.98
        elif any(w in content for w in ["leave", "holiday", "attendance", "regularize"]):
            category = "Leave & Attendance"
            priority = "LOW"
            routing = RoutingInfo(department="HR Operations", sla_hours=24)
            sentiment = "NEUTRAL"
            sentiment_score = 0.10
            urgency_score = 0.30
        else:
            category = "General HR Inquiries"
            priority = "MEDIUM"
            routing = RoutingInfo(department="HR Help Desk", sla_hours=12)
            sentiment = "NEUTRAL"
            sentiment_score = 0.0
            urgency_score = 0.50

        summary = f"Classified ticket '{req.subject}' under {category} with {priority} priority."

        return CaseTriageResponse(
            suggested_category=category,
            suggested_priority=priority,
            sentiment=sentiment,
            sentiment_score=sentiment_score,
            urgency_score=urgency_score,
            suggested_routing=routing,
            summary=summary,
            model="mock-deterministic-v1",
            fallback_used=True
        )

triage_service = TriageService()
