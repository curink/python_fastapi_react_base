# /app/api/auth.py

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.core.database import SessionLocal
from app.core.security import (
    create_access_token,
    create_refresh_token,
    verify_password,
    verify_refresh_token,
)
from app.crud.user import get_user_by_id, get_user_by_username_or_email
from app.models.user import User

router = APIRouter(tags=["Api Auth"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/login")
def login(
    response: Response,
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = get_user_by_username_or_email(db, form.username)
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(user.id)

    # Simpan refresh_token di cookie HttpOnly
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="lax",
        max_age=7 * 24 * 60 * 60,  # 7 hari
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/refresh-token")
def refresh_token(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")

    user_id = verify_refresh_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token}


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
    }
