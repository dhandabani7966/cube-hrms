from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.core.logger import logger
from app.api import health, rag, intake, triage

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION} on {settings.HOST}:{settings.PORT}")
    logger.info(f"Ollama base URL: {settings.OLLAMA_BASE_URL} (Fallback enabled: {settings.AI_MOCK_FALLBACK})")
    yield
    logger.info("Shutting down AI Microservice")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="CubeAI Solutions HRMS AI Microservice (RAG, Resume Intake, Case Triage)",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(health.router, tags=["Health"])
app.include_router(rag.router, prefix="/ai/v1/rag", tags=["RAG Knowledge Engine"])
app.include_router(intake.router, prefix="/ai/v1/resume", tags=["Talent Intake"])
app.include_router(triage.router, prefix="/ai/v1/cases", tags=["Case Triage"])
