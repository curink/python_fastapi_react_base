# /app/api/__init__.py

import os
import importlib
from fastapi import APIRouter

router = APIRouter()

# Ambil nama file di direktori saat ini
current_dir = os.path.dirname(__file__)
for filename in os.listdir(current_dir):
    # Lewati __init__.py dan file non-py
    if filename.endswith(".py") and filename != "__init__.py":
        modulename = filename[:-3]  # hilangkan ".py"
        module = importlib.import_module(f"app.api.{modulename}")
        # Jika modul punya `router`, kita include
        if hasattr(module, "router"):
            router.include_router(module.router)
