# /app/crud/user.py

from typing import List, Optional

from sqlalchemy import select, update as sql_update, delete as sql_delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


async def get_user_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_user_by_username_or_email(db: AsyncSession, value: str) -> Optional[User]:
    stmt = select(User).where((User.username == value) | (User.email == value))
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_all_users(db: AsyncSession) -> List[User]:
    stmt = select(User)
    result = await db.execute(stmt)
    return result.scalars().all()


async def create_user(db: AsyncSession, user_data: UserCreate) -> User:
    hashed_pw = hash_password(user_data.password)
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_pw,
        role=user_data.role,
    )
    try:
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user
    except IntegrityError:
        await db.rollback()
        raise


async def update_user(db: AsyncSession, user_id: int, user_update: UserUpdate) -> Optional[User]:
    user = await get_user_by_id(db, user_id)
    if not user:
        return None

    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        if key == "password":
            setattr(user, "hashed_password", hash_password(value))
        elif hasattr(user, key):
            setattr(user, key, value)

    await db.commit()
    await db.refresh(user)
    return user


async def delete_user(db: AsyncSession, user_id: int) -> Optional[User]:
    user = await get_user_by_id(db, user_id)
    if user:
        await db.delete(user)
        await db.commit()
    return user