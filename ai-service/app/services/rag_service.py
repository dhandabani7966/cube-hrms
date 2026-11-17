from app.schemas.rag import RAGQueryRequest, RAGQueryResponse, Citation
from app.services.ollama_client import ollama_client
from app.core.logger import logger

class RAGService:
    async def query(self, req: RAGQueryRequest) -> RAGQueryResponse:
        # Check Ollama connection
        if await ollama_client.is_available():
            try:
                prompt = f"Context: {req.context}\nQuestion: {req.query}\nAnswer as an expert HR policy assistant."
                answer = await ollama_client.generate(prompt=prompt)
                return RAGQueryResponse(
                    answer=answer,
                    citations=[Citation(title="CubeAI Employee Handbook", section="General Policy", relevance_score=0.92)],
                    confidence=0.90,
                    model="llama3.2:3b",
                    fallback_used=False
                )
            except Exception as e:
                logger.warning(f"Ollama generation failed ({e}), falling back to deterministic mock.")

        # Deterministic Mock Fallback
        q = req.query.lower()
        if any(w in q for w in ["leave", "vacation", "pto", "holiday"]):
            answer = ("According to the CubeAI Leave Policy, active full-time employees are entitled to 20 days "
                      "of Annual Paid Leave and 10 days of Sick/Casual Leave per calendar year. A maximum of 5 days "
                      "of unused annual leave may be carried forward into the next calendar year.")
            citations = [
                Citation(title="CubeAI Global Leave & Attendance Policy", section="Section 3.1: Annual Leave Entitlements", relevance_score=0.96),
                Citation(title="CubeAI Global Leave & Attendance Policy", section="Section 3.4: Leave Carryover & Encashment", relevance_score=0.91)
            ]
        elif any(w in q for w in ["notice", "resignation", "exit", "offboard"]):
            answer = ("The CubeAI Separation Policy stipulates a standard 60-day notice period for permanent employees. "
                      "All company assets (laptops, security badges) must be cleared through IT, Admin, and Finance "
                      "prior to the calculated Last Working Day (LWD).")
            citations = [
                Citation(title="CubeAI Separation & Exit Management Guidelines", section="Section 2.1: Notice Period Protocols", relevance_score=0.98),
                Citation(title="CubeAI Separation & Exit Management Guidelines", section="Section 4.0: Departmental Clearances", relevance_score=0.93)
            ]
        elif any(w in q for w in ["probation", "confirmation"]):
            answer = ("New employees undergo a 90-day probation period with structured performance checkpoints at "
                      "30 and 60 days, concluding with a formal confirmation review by the reporting manager.")
            citations = [
                Citation(title="CubeAI Onboarding & Probation Guidelines", section="Section 5.2: Confirmation Workflow", relevance_score=0.94)
            ]
        else:
            answer = ("CubeAI HRMS central policy repository confirms that all employees must uphold the Code of Business "
                      "Conduct, complete mandatory security signoffs within 14 days of joining, and submit inquiries through the HR Help Desk.")
            citations = [
                Citation(title="CubeAI Code of Business Conduct & Ethics", section="Section 1.0: Core Values & Compliance", relevance_score=0.88)
            ]

        return RAGQueryResponse(
            answer=answer,
            citations=citations,
            confidence=0.95,
            model="mock-deterministic-v1",
            fallback_used=True
        )

rag_service = RAGService()
