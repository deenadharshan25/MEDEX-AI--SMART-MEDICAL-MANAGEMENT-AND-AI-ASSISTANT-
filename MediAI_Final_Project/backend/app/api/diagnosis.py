"""Diagnosis & symptom checker routes"""
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import uuid, datetime

router = APIRouter()
security = HTTPBearer()

class DiagnosisCreate(BaseModel):
    symptoms: List[str]
    age: int
    gender: str
    notes: Optional[str] = None

@router.post("/")
async def create_diagnosis(body: DiagnosisCreate,
                           credentials: HTTPAuthorizationCredentials = Depends(security)):
    return {
        "id": str(uuid.uuid4()),
        "created_at": datetime.datetime.utcnow().isoformat(),
        "status": "pending",
        "symptoms": body.symptoms,
        "message": "Diagnosis submitted. AI analysis in progress.",
    }

@router.get("/history")
async def diagnosis_history(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return {"diagnoses": [
        {"id": "dx1", "date": "2025-08-01", "symptoms": ["Fever","Headache"],
         "top_prediction": "Influenza", "confidence": 78.4, "risk": "Moderate"},
        {"id": "dx2", "date": "2025-07-20", "symptoms": ["Cough","Runny nose"],
         "top_prediction": "Allergic Rhinitis", "confidence": 82.1, "risk": "Low"},
    ]}

@router.get("/{diagnosis_id}")
async def get_diagnosis(diagnosis_id: str,
                        credentials: HTTPAuthorizationCredentials = Depends(security)):
    return {"id": diagnosis_id, "status": "completed",
            "predictions": [{"disease": "Influenza", "probability": 78.4, "risk": "Moderate"}]}
