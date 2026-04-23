from pydantic import BaseModel, Field
class CodeRequest(BaseModel):
    code: str = Field(min_length=1)
    language: str = Field(min_length=1)
class CodeResponse(BaseModel):
    result: str