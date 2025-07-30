# /app/schemas/token.py

from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginInput(BaseModel):
    identifier: str  # username atau email
    password: str