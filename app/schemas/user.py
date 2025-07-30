# /app/schemas/user.py

from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    username: Optional[str]
    email: Optional[EmailStr]
    role: Optional[str]


class UserCreate(UserBase):
    username: str
    email: EmailStr
    password: str
    role: str


class UserUpdate(BaseModel):
    username: Optional[str]
    email: Optional[EmailStr]
    role: Optional[str]
    password: Optional[str] = None


class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True
