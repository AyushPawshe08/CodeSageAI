from datetime import datetime
from uuid import UUID
from pydantic import BaseModel
from pydantic import ConfigDict
class HistoryListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    filename: str
    created_at: datetime
class HistoryDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    original_code: str
    review_output: str
    refactored_code: str
    filename: str
    language: str
    file_size: int
    created_at: datetime
class ReviewStoredResponse(BaseModel):
    id: UUID
    message: str