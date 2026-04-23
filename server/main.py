from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.auth_router import router as auth_router
from config.database import Base, engine
from config.settings import settings
from routers.code_router import router as code_router
from routers.review_router import router as review_router
from auth import auth_model
from models import history_model
app = FastAPI(
    title="CodeSage AI API",
    description="AI code review, refactoring, and auth service",
    version="1.1.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)
app.include_router(code_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(review_router, prefix="/api")
@app.get("/")
def read_root():
    return {
        "message": "CodeSage AI API",
        "status": "running",
        "docs": "/docs",
    }