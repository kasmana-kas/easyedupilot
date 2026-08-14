from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.department import router as department_router
from app.core.config import settings
from app.database.init_db import init_db
from app.routers.module import router as module_router
from app.routers.user import router as user_router
from app.routers.quiz import router as quiz_router
from app.routers.question import router as question_router
from app.routers.ai_materials import router as ai_materials_router
from app.routers.note import router as note_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)


# ==============================
# CORS CONFIGURATION
# ==============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================
# ROUTERS
# ==============================

app.include_router(user_router)
app.include_router(quiz_router)
app.include_router(department_router)
app.include_router(module_router)
app.include_router(question_router)
app.include_router(ai_materials_router)
app.include_router(note_router)

# ==============================
# DATABASE STARTUP
# ==============================

@app.on_event("startup")
def startup():
    init_db()


# ==============================
# HOME
# ==============================

@app.get("/")
def home():
    return {
        "project": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running"
    }


# ==============================
# HEALTH CHECK
# ==============================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }