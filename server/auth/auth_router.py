from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from config.database import get_db
from .auth_handler import login_user, logout_user, register_user, verify_user
from .auth_schema import (
    AuthTokenResponse,
    LoginRequest,
    LogoutRequest,
    MessageResponse,
    UserCreate,
    VerifyRequest,
)
router = APIRouter(prefix="/auth", tags=["Auth"])
def _extract_bearer_token(authorization: str | None) -> str:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization token",
        )
    prefix = "Bearer "
    if not authorization.startswith(prefix):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
        )
    token = authorization[len(prefix):].strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )
    return token
@router.post("/register", response_model=MessageResponse)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    return register_user(db, payload)
@router.post("/verify", response_model=AuthTokenResponse)
def verify(payload: VerifyRequest, db: Session = Depends(get_db)):
    return verify_user(db, payload)
@router.post("/login", response_model=AuthTokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    return login_user(db, payload)
@router.post("/logout", response_model=MessageResponse)
def logout(
    authorization: str | None = Header(default=None),
    token_payload: LogoutRequest | None = None,
    db: Session = Depends(get_db),
):
    token = token_payload.token if token_payload and token_payload.token else _extract_bearer_token(authorization)
    return logout_user(db, token)