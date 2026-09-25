"""
Appointment management routes — connects to User Database Service
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
from app.services.user_db_service import user_db_service

router = APIRouter()
security = HTTPBearer()

class AppointmentCreate(BaseModel):
    patient_id:   Optional[str] = "pat-98402"
    patient_name: Optional[str] = "John Doe"
    doctor_id:    str
    date:         str  # YYYY-MM-DD
    time:         str  # 10:30 AM
    type:         str = "In-Person"  # In-Person | Video Consultation
    reason:       Optional[str] = "Routine consultation"

@router.get("/")
async def list_appointments(patient_id: Optional[str] = None):
    if patient_id:
        appts = user_db_service.get_patient_appointments(patient_id)
    else:
        appts = user_db_service.appointments
    return {"appointments": appts}

@router.get("/today")
async def today_appointments_doctor(doctor_id: Optional[str] = None):
    """Doctor view today's scheduled appointments and time slots."""
    appts = user_db_service.get_doctor_today_appointments(doctor_id)
    return {"today_appointments": appts, "total": len(appts)}

@router.post("/", status_code=201)
async def book_appointment(body: AppointmentCreate):
    apt = user_db_service.book_appointment(
        patient_id=body.patient_id or "pat-98402",
        patient_name=body.patient_name or "John Doe",
        doctor_id=body.doctor_id,
        date=body.date,
        time=body.time,
        appt_type=body.type,
        reason=body.reason or "Routine checkup"
    )
    return {"message": "Appointment booked successfully", "appointment": apt}

@router.get("/doctors")
async def list_doctors():
    doctors = user_db_service.get_doctors()
    safe_docs = []
    for d in doctors:
        safe_docs.append({
            "id": d["id"],
            "name": d["name"],
            "department": d.get("department", "Cardiology"),
            "specialty": d.get("specialty", d.get("department", "Specialist")),
            "available": True,
            "rating": 4.9
        })
    return {"doctors": safe_docs}
