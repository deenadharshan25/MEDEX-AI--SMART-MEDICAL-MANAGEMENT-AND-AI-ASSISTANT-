"""User profile routes"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date

router = APIRouter()
security = HTTPBearer()

class UserProfile(BaseModel):
    first_name: str
    last_name:  str
    email:      Optional[EmailStr] = None
    phone:      Optional[str] = None
    date_of_birth: Optional[str] = None
    gender:     Optional[str] = None
    blood_type: Optional[str] = None
    height_cm:  Optional[float] = None
    weight_kg:  Optional[float] = None
    allergies:  Optional[List[str]] = []
    existing_conditions: Optional[List[str]] = []
    emergency_contact: Optional[str] = None

DEMO_USER = {
    "id": "usr_demo1", "first_name": "John", "last_name": "Doe",
    "email": "john@example.com", "phone": "+1-555-0123",
    "role": "patient", "health_score": 87, "bmi": 22.4,
    "date_of_birth": "1990-03-15", "gender": "male", "blood_type": "O+",
    "height_cm": 175, "weight_kg": 68, "allergies": ["Penicillin"],
    "existing_conditions": ["Mild Hypertension"],
    "emergency_contact": "Jane Doe — +1-555-0124",
    "created_at": "2025-01-01T00:00:00Z"
}

@router.get("/me")
async def get_profile(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return DEMO_USER

@router.put("/me")
async def update_profile(profile: UserProfile,
                         credentials: HTTPAuthorizationCredentials = Depends(security)):
    DEMO_USER.update(profile.dict(exclude_none=True))
    return {"message": "Profile updated", "user": DEMO_USER}

@router.get("/me/vitals")
async def get_vitals(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return {
        "heart_rate": 72, "blood_pressure": "118/78",
        "blood_sugar": 95, "temperature": 98.6,
        "spo2": 98, "bmi": 22.4, "recorded_at": "2025-08-04T08:00:00Z"
    }

@router.put("/me/vitals")
async def update_vitals(vitals: dict,
                        credentials: HTTPAuthorizationCredentials = Depends(security)):
    return {"message": "Vitals updated", "vitals": vitals}

@router.get("/me/medical-history")
async def medical_history(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return {"records": [
        {"id": "mh1", "date": "2025-07-15", "diagnosis": "Hypertension Check",
         "doctor": "Dr. Raj Kumar", "treatment": "Amlodipine 5mg", "status": "Active"},
        {"id": "mh2", "date": "2025-06-08", "diagnosis": "Annual Physical",
         "doctor": "Dr. Sarah Lee", "treatment": "Vitamin D supplement", "status": "Completed"},
    ]}

@router.get("/me/medications")
async def medications(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return {"medications": [
        {"id": "med1", "name": "Metformin", "dose": "500mg", "frequency": "Twice daily", "times": ["08:00","20:00"]},
        {"id": "med2", "name": "Amlodipine", "dose": "5mg", "frequency": "Once daily", "times": ["08:00"]},
        {"id": "med3", "name": "Vitamin D3", "dose": "1000 IU", "frequency": "Once daily", "times": ["08:00"]},
    ]}

@router.get("/me/lab-reports")
async def lab_reports(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return {"reports": [
        {"id": "lr1", "name": "Complete Blood Count", "lab": "City Lab", "date": "2025-07-28", "status": "Normal"},
        {"id": "lr2", "name": "HbA1c", "lab": "Quest", "date": "2025-07-15", "status": "Attention"},
    ]}
