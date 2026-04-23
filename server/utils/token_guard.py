from fastapi import HTTPException, status
MAX_CODE_LENGTH = 50000
def validate_code(code: str) -> None:
    if not code or not code.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Code cannot be empty")
    if len(code) > MAX_CODE_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Code exceeds maximum length of {MAX_CODE_LENGTH} characters",
        )