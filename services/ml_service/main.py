"""
AgriLink ML Service — FastAPI
Exposes: crop price prediction, Bhoomi RTC fetch, OCR extraction, govt schemes
"""
from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os, uvicorn, logging
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

from contextlib import asynccontextmanager
from db import init_db, close_db

from routers import predict, bhoomi, ocr, schemes

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ml-service")

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()

app = FastAPI(
    title="AgriLink ML Service",
    version="2.0.0",
    description="Crop price prediction, OCR extraction, Bhoomi scraping, govt schemes",
    lifespan=lifespan
)

# ── Security & CORS ──────────────────────────────────────────
# Restricted origins for production security
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:8080").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from auth import get_current_user, require_role, require_any_role

# ── Routers ───────────────────────────────────────────────────
app.include_router(
    predict.router, 
    prefix="/ml/predict", 
    tags=["Prediction"]
)
app.include_router(
    bhoomi.router, 
    prefix="/ml/bhoomi", 
    tags=["Bhoomi"],
    dependencies=[Depends(require_any_role("admin", "farmer"))]
)
app.include_router(
    ocr.router, 
    prefix="/ml/ocr", 
    tags=["OCR"],
    dependencies=[Depends(require_any_role("admin", "farmer"))]
)
app.include_router(
    schemes.router, 
    prefix="/ml/schemes", 
    tags=["Schemes"],
    dependencies=[Depends(get_current_user)]
)

# ── Static File Server (Limited to Assets) ────────────────────
from fastapi.staticfiles import StaticFiles
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static/assets")
os.makedirs(static_dir, exist_ok=True)
app.mount("/ml/static", StaticFiles(directory=static_dir), name="static")

@app.get("/ml/health")
async def health():
    return {"status": "ok", "service": "ml", "version": "2.0.0"}

if __name__ == "__main__":
    port = int(os.getenv("ML_PORT", 4006))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
