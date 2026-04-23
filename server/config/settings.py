from functools import lru_cache
from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[1] / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    GROQ_API_KEY: str = ""
    MODEL_NAME: str = "llama-3.3-70b-versatile"
    RESEND_API_KEY: str = ""
    AUTH_FROM_EMAIL: str = "onboarding@resend.dev"
    RESEND_FROM_EMAIL: str = ""
    DATABASE_URL: str = ""
    SECRET_KEY: str = "change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    OTP_EXPIRE_MINUTES: int = 10
    FRONTEND_ORIGINS: str = Field(
        default="http://localhost:5173,http://localhost:3000,http://localhost"
    )

    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.FRONTEND_ORIGINS.split(",")
            if origin.strip()
        ]

    @field_validator(
        "GROQ_API_KEY",
        "MODEL_NAME",
        "RESEND_API_KEY",
        "AUTH_FROM_EMAIL",
        "RESEND_FROM_EMAIL",
        "DATABASE_URL",
        "SECRET_KEY",
        "ALGORITHM",
        "FRONTEND_ORIGINS",
        mode="before",
    )
    @classmethod
    def strip_string_values(cls, value):
        if isinstance(value, str):
            return value.strip().strip('"').strip("'")
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
