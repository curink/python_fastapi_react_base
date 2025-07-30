# /app/api/config.py

from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get("/config")
def get_config():
    return {"app_name": settings.APP_NAME}
