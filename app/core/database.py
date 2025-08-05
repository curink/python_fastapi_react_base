# app/core/database.py

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Konfigurasi connect_args dinamis sesuai dialect
connect_args = {}
if settings.DATABASE_URL.startswith("postgresql+asyncpg://"):
    connect_args = {"statement_cache_size": 0}
elif settings.DATABASE_URL.startswith("sqlite+aiosqlite://"):
    connect_args = {"check_same_thread": False}

# Create engine for async database
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    connect_args=connect_args,
    pool_pre_ping=True)

# Session factory for async session
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)

Base = declarative_base()

# Dependency
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session