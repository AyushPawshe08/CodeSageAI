from fastapi import APIRouter, HTTPException
from app.models.code_model import CodeRequest, CodeResponse
from app.services.llm_service import review_code_llm, refactor_code_llm
from app.utils.token_guard import validate_code

router = APIRouter(tags=["AI Code Reviewer"])

@router.post("/review", response_model=CodeResponse)
async def review_code(request: CodeRequest):
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
async def refactor_code(request: CodeRequest):
    """
    Refactor code for better readability and best practices
    """
    try:
        validate_code(request.code)
        result = refactor_code_llm(request.code, request.language)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
