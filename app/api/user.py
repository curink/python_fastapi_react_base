# /app/api/user.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserOut, UserUpdate
from app.core.database import SessionLocal
from app.crud import user as crud
from app.auth import get_current_user, get_current_admin
from app.models.user import User
from typing import List

router = APIRouter(prefix="/users", tags=["Api users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    return crud.get_all_users(db)

@router.get("/{user_id}", response_model=UserOut)
def get_user_by_id(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return user

@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    existing = crud.get_user_by_username_or_email(db, user.username) or crud.get_user_by_username_or_email(db, user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    return crud.create_user(db, user)


@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    updated = crud.update_user(db, user_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can delete users")
    deleted = crud.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted"}