"""MediAI — FastAPI Backend Entry Point"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.api import auth, users, diagnosis, predictions, appointments, chat, analytics, admin, documents
import uvicorn

app = FastAPI(
    title="MediAI API",
    description="Intelligent Medical Diagnosis System REST API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.add_middleware(GZipMiddleware, minimum_size=1000)

app.include_router(auth.router,         prefix="/api/auth",         tags=["Auth"])
app.include_router(users.router,        prefix="/api/users",        tags=["Users"])
app.include_router(diagnosis.router,    prefix="/api/diagnosis",    tags=["Diagnosis"])
app.include_router(predictions.router,  prefix="/api/predictions",  tags=["Predictions"])
app.include_router(appointments.router, prefix="/api/appointments",  tags=["Appointments"])
app.include_router(chat.router,         prefix="/api/chat",         tags=["AI Chat"])
app.include_router(analytics.router,    prefix="/api/analytics",    tags=["Analytics"])
app.include_router(admin.router,        prefix="/api/admin",        tags=["Admin"])
app.include_router(documents.router,    prefix="/api/documents",    tags=["Documents"])

@app.get("/")
async def root(): return {"status":"ok","service":"MediAI API","version":"1.0.0"}

@app.get("/api/health")
async def health(): return {"status":"healthy","db":"connected","ai":"ready"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
