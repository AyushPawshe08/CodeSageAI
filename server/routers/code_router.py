from fastapi import APIRouter, Depends, HTTPException
from models.code_model import CodeRequest, CodeResponse
from services.llm_service import refactor_code_llm, review_code_llm
from utils.token_guard import validate_code
from auth.auth_handler import require_authenticated_user
router = APIRouter(tags=["AI Code Reviewer"])
@router.post("/review", response_model=CodeResponse)
async def review_code(request: CodeRequest, _current_user: dict = Depends(require_authenticated_user)):
    """
    Review code for bugs, security issues, and best practices
    """
    try:
        validate_code(request.code)
        result = review_code_llm(request.code, request.language)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.post("/refactor", response_model=CodeResponse)
async def refactor_code(request: CodeRequest, _current_user: dict = Depends(require_authenticated_user)):
    """
    Refactor code for better readability and best practices
    """
    try:
        validate_code(request.code)
        result = refactor_code_llm(request.code, request.language)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))