from fastapi import HTTPException

MAX_CODE_LENGTH = 50000  # Maximum characters allowed

def validate_code(code: str) -> None:
    """
    Validate code input to prevent abuse
    
    Args:
        code: The code string to validate
        
    Raises:
        HTTPException: If validation fails
    """
    if not code or not code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")
    
    if len(code) > MAX_CODE_LENGTH:
        raise HTTPException(
            status_code=400, 
            detail=f"Code exceeds maximum length of {MAX_CODE_LENGTH} characters"
        )
