from pydantic import BaseModel, Field

class CodeRequest(BaseModel):
    code: str = Field(..., description="The code to review or refactor")
    language: str = Field(..., description="Programming language of the code")

class CodeResponse(BaseModel):
    result: str = Field(..., description="The review or refactored code result")
