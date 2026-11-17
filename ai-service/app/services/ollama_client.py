import httpx
from app.config import settings
from app.core.logger import logger

class OllamaClient:
    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL.rstrip('/')
        self.timeout = settings.OLLAMA_TIMEOUT_SECONDS

    async def is_available(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                res = await client.get(f"{self.base_url}/api/tags")
                return res.status_code == 200
        except Exception:
            return False

    async def generate(self, prompt: str, system: str = "") -> str:
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            payload = {
                "model": settings.OLLAMA_MODEL,
                "prompt": prompt,
                "system": system,
                "stream": False
            }
            res = await client.post(f"{self.base_url}/api/generate", json=payload)
            res.raise_for_status()
            data = res.json()
            return data.get("response", "")

ollama_client = OllamaClient()
