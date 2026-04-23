from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
class VerifyRequest(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=6, max_length=6)
class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
class LogoutRequest(BaseModel):
    token: str | None = None
class MessageResponse(BaseModel):
    message: str
class AuthUserResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime
class AuthTokenResponse(BaseModel):
    message: str
    access_token: str
    token_type: str = "bearer"
    user: AuthUserResponse