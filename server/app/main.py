from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.code_review import router

app = FastAPI(
    title="AI Code Reviewer API",
    description="An AI-powered code review and refactoring service",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite and common dev ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "message": "AI Code Reviewer API",
        "status": "running",
        "docs": "/docs"
    }
