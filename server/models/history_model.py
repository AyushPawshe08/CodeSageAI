import uuid
from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func
from sqlalchemy.types import TypeDecorator, CHAR
from config.database import Base
class GUID(TypeDecorator):
    """Platform-independent UUID type.
    Stores UUIDs as CHAR(36) on SQLite and native UUID on PostgreSQL when available.
    """
    impl = CHAR
    cache_ok = True
    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            from sqlalchemy.dialects.postgresql import UUID
            return dialect.type_descriptor(UUID(as_uuid=True))
        return dialect.type_descriptor(CHAR(36))
    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        if isinstance(value, uuid.UUID):
            return value
        return uuid.UUID(str(value))
    def process_result_value(self, value, dialect):
        if value is None:
            return value
        if isinstance(value, uuid.UUID):
            return value
        return uuid.UUID(str(value))
class CodeReviewHistory(Base):
    __tablename__ = "code_review_history"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    original_code = Column(Text, nullable=False)
    review_output = Column(Text, nullable=False)
    refactored_code = Column(Text, nullable=False)
    filename = Column(String(255), nullable=False)
    language = Column(String(64), nullable=False)
    file_size = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())