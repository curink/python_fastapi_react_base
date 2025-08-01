# /app/main.py

import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
from jinja2 import Environment, FileSystemLoader

from app.api import router as api_router
from app.core.config import settings
from app.core.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    #docs_url=None,
    redoc_url=None,
    #openapi_url=None
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Router API
app.include_router(api_router, prefix="/api")

# ✅ Static files untuk assets React
app.mount("/assets", StaticFiles(directory="app/frontend/dist/assets"), name="assets")


# ✅ Optional: favicon/robots
@app.get("/favicon.ico", include_in_schema=False)
@app.get("/robots.txt", include_in_schema=False)
async def static_404():
    return JSONResponse(status_code=404, content={"detail": "Not Found"})


# ✅ Fallback ke index.html hanya jika bukan API/assets/favicon
templates = Environment(loader=FileSystemLoader("app/frontend/dist"))
@app.exception_handler(StarletteHTTPException)
async def spa_fallback_handler(request: Request, exc: StarletteHTTPException):
    if (
        exc.status_code == 404
        and not request.url.path.startswith("/api")
        and not request.url.path.startswith("/assets")
        and not request.url.path.startswith("/favicon.ico")
    ):
        # index_path = os.path.join("app", "frontend", "dist", "index.html")
        # return FileResponse(index_path, media_type="text/html")
        template = templates.get_template("index.html")
        rendered = template.render({
            "app_name": settings.APP_NAME,
        })
        return HTMLResponse(content=rendered)

    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
