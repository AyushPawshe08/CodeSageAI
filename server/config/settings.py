from functools import lru_cache
from pathlib import Path

from pydantic import AliasChoices, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[1] / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    GROQ_API_KEY: str = ""
    MODEL_NAME: str = "llama-3.3-70b-versatile"
    DATABASE_URL: str = ""
    SECRET_KEY: str = "change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    OTP_EXPIRE_MINUTES: int = 10
    FRONTEND_ORIGINS: str = Field(
        default="http://localhost:5173,http://localhost:3000,http://localhost,https://code-sage-ai-two.vercel.app"
    )

    EMAIL_HOST: str = Field(
        default="",
        validation_alias=AliasChoices("EMAIL_HOST", "SMTP_HOST", "SMTP_SERVER", "SMTP"),
    )
    EMAIL_PORT: int = Field(default=587, validation_alias=AliasChoices("EMAIL_PORT", "SMTP_PORT"))
    EMAIL_USER: str = Field(default="", validation_alias=AliasChoices("EMAIL_USER", "SMTP_USERNAME", "SMTP_USER"))
    EMAIL_PASSWORD: str = Field(default="", validation_alias=AliasChoices("EMAIL_PASSWORD", "SMTP_PASSWORD", "SMTP_PASS"))
    EMAIL_FROM: str = Field(default="", validation_alias=AliasChoices("EMAIL_FROM", "SMTP_FROM_EMAIL", "SMTP_FROM"))
    EMAIL_USE_TLS: bool = Field(default=True, validation_alias=AliasChoices("EMAIL_USE_TLS", "SMTP_USE_TLS", "SMTP_TLS"))

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
        "DATABASE_URL",
        "SECRET_KEY",
        "ALGORITHM",
        "FRONTEND_ORIGINS",
        "EMAIL_HOST",
        "EMAIL_USER",
        "EMAIL_PASSWORD",
        "EMAIL_FROM",
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
