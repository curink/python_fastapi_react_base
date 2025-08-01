from app.core.database import SessionLocal, engine
from app.core.security import hash_password
from app.models.user import User
from app.core.database import Base

# ✅ Membuat semua tabel jika belum ada
Base.metadata.create_all(bind=engine)


def create_admin_user():
    db = SessionLocal()
    try:
        username = "admin"
        email = "admin@example.com"
        password = "admin123"
        role = "admin"

        existing = (
            db.query(User)
            .filter((User.username == username) | (User.email == email))
            .first()
        )

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
        db.commit()
        print("✅ Admin user created successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    create_admin_user()