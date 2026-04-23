from datetime import UTC, datetime, timedelta
from typing import Any, Dict, Optional
import jwt
from fastapi import Depends, Header, HTTPException, status
from jwt import InvalidTokenError
from sqlalchemy.orm import Session
from config.database import get_db
from config.settings import settings
from services.email_service import send_otp_email
from utils.hash import hash_password, verify_password
from utils.otpGenerator import generate_otp
from .auth_model import BlacklistedToken, PendingRegistration, UserRegistration
from .auth_schema import LoginRequest, UserCreate, VerifyRequest
def _utcnow() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)
def _normalize_email(email: str) -> str:
    return email.strip().lower()
def _user_to_response(user: UserRegistration) -> Dict[str, Any]:
    return {
        "id": user.id,
        "email": user.email,
        "created_at": user.created_at,
    }
def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = _utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except InvalidTokenError:
        return None
def is_token_blacklisted(token: str, db: Session) -> bool:
    return db.query(BlacklistedToken).filter(BlacklistedToken.token == token).first() is not None
def _build_auth_token_response(user: UserRegistration, message: str) -> Dict[str, Any]:
    access_token = create_access_token({"sub": user.email, "user_id": user.id})
    return {
        "message": message,
        "access_token": access_token,
        "token_type": "bearer",
        "user": _user_to_response(user),
    }
def register_user(db: Session, payload: UserCreate) -> Dict[str, Any]:
    email = _normalize_email(payload.email)
    existing_user = db.query(UserRegistration).filter(UserRegistration.email == email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists")
    otp = generate_otp()
    otp_expires_at = _utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
    password_hash = hash_password(payload.password)
    pending = db.query(PendingRegistration).filter(PendingRegistration.email == email).first()
    if pending:
        db.delete(pending)
        db.flush()
    pending = PendingRegistration(
        email=email,
        hashed_password=password_hash,
        otp=otp,
        otp_expires_at=otp_expires_at,
    )
    db.add(pending)
    db.flush()
    try:
        send_otp_email(email=email, otp=otp)
        db.commit()
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to send OTP email: {exc}",
        ) from exc
    return {
        "message": "OTP sent to your email address",
    }
def verify_user(db: Session, payload: VerifyRequest) -> Dict[str, Any]:
    email = _normalize_email(payload.email)
    pending = db.query(PendingRegistration).filter(PendingRegistration.email == email).first()
    if not pending:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No pending registration found for this email",
        )
    if pending.otp_expires_at < _utcnow():
        db.delete(pending)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired. Please request a new one.",
        )
    if pending.otp != payload.otp.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP",
        )
    existing_user = db.query(UserRegistration).filter(UserRegistration.email == email).first()
    if existing_user:
        db.delete(pending)
        db.commit()
        return _build_auth_token_response(existing_user, "Email already verified")
    user = UserRegistration(
        email=email,
        hashed_password=pending.hashed_password,
    )
    db.add(user)
    db.delete(pending)
    db.flush()
    db.commit()
    db.refresh(user)
    return _build_auth_token_response(user, "Email verified successfully")
def login_user(db: Session, payload: LoginRequest) -> Dict[str, Any]:
    email = _normalize_email(payload.email)
    user = db.query(UserRegistration).filter(UserRegistration.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found. Please register first.",
        )
    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return _build_auth_token_response(user, "Login successful")
def logout_user(db: Session, token: str) -> Dict[str, Any]:
    token_data = decode_access_token(token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    expires_at_value = token_data.get("exp")
    expires_at = datetime.fromtimestamp(expires_at_value) if isinstance(expires_at_value, (int, float)) else _utcnow()
    if is_token_blacklisted(token, db):
        return {"message": "Already logged out"}
    db.add(BlacklistedToken(token=token, expires_at=expires_at))
    db.commit()
    return {"message": "Logged out successfully"}
def ensure_token_is_active(db: Session, token: str) -> Dict[str, Any]:
    if is_token_blacklisted(token, db):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked",
        )
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    return payload
def require_authenticated_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
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
    return ensure_token_is_active(db, token)