# /app/crud/user.py

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import hash_password


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_username_or_email(db: Session, value: str) -> Optional[User]:
    return db.query(User).filter((User.username == value) | (User.email == value)).first()


def get_all_users(db: Session) -> List[User]:
    return db.query(User).all()


def create_user(db: Session, user_data: UserCreate) -> User:
    hashed_pw = hash_password(user_data.password)
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_pw,
        role=user_data.role
    )
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError:
        db.rollback()
        raise


def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
    user = get_user_by_id(db, user_id)
    if not user:
        return None

    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        if key == "password":
            setattr(user, "hashed_password", hash_password(value))
        elif hasattr(user, key):
            setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user_id: int) -> Optional[User]:
    user = get_user_by_id(db, user_id)
    if user:
        db.delete(user)
        db.commit()
    return user