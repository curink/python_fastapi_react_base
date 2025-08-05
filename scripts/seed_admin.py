# /scripts/seed_admin.py

import asyncio

from sqlalchemy.future import select

from app.core.security import hash_password
from app.models.user import User
from app.core.database import Base, engine, AsyncSessionLocal


async def create_admin_user():
    async with AsyncSessionLocal() as db:
        # Buat semua tabel
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        username = "admin"
        email = "admin@example.com"
        password = "admin123"
        role = "admin"

        result = await db.execute(
            select(User).where((User.username == username) | (User.email == email))
        )
        existing = result.scalar_one_or_none()

        if existing:
            print("ℹ️ Admin user already exists.")
            return

        admin_user = User(
            username=username,
            email=email,
            hashed_password=hash_password(password),
            role=role,
        )
        db.add(admin_user)
        await db.commit()
        print("✅ Admin user created successfully.")


if __name__ == "__main__":
    asyncio.run(create_admin_user())