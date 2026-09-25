"""
Admin-only routes — User database management & Payment configuration
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import Optional

from app.services.user_db_service import user_db_service

router = APIRouter()
security = HTTPBearer()

class AdminCreateUserRequest(BaseModel):
    role:       str  # patient | doctor
    name:       str
    age:        int = 30
    year:       str = "2025"
    username:   str
    password:   str = Field(..., min_length=4)
    department: str = "General Medicine"
    email:      Optional[str] = None

class PaymentConfigRequest(BaseModel):
    account_name:    Optional[str] = None
    account_number:  Optional[str] = None
    ifsc_code:       Optional[str] = None
    upi_id:          Optional[str] = None
    consultation_fee: Optional[int] = None
    status:          Optional[str] = None

@router.get("/stats")
async def admin_stats():
    users = user_db_service.get_all_users()
    doctors = [u for u in users if u["role"] == "doctor"]
    patients = [u for u in users if u["role"] == "patient"]
    return {
        "total_users": len(users),
        "doctors": len(doctors),
        "patients": len(patients),
        "diagnoses": 8432,
        "accuracy": 96.8
    }

@router.get("/users")
async def list_users(role: Optional[str] = None):
    users = user_db_service.get_all_users(role)
    # Strip salt & password_hash for API safety
    safe_users = [{k: v for k, v in u.items() if k not in ("salt", "password_hash")} for u in users]
    return {"users": safe_users, "total": len(safe_users)}

@router.post("/users", status_code=201)
async def create_user_by_admin(body: AdminCreateUserRequest):
    """Admin creates a new Patient or Doctor with Username, Password, Name, Age, Year, and Department."""
    try:
        user = user_db_service.add_user_by_admin(
            role=body.role,
            name=body.name,
            age=body.age,
            year=body.year,
            username=body.username,
            password=body.password,
            department=body.department,
            email=body.email
        )
        safe_user = {k: v for k, v in user.items() if k not in ("salt", "password_hash")}
        return {"message": f"Successfully created {body.role} account for {body.name}", "user": safe_user}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/payments")
async def get_payment_details():
    """Retrieve hospital payment QR and Bank Account details."""
    return user_db_service.payment_config

@router.post("/payments")
async def update_payment_details(body: PaymentConfigRequest):
    """Update hospital payment QR, Bank Account, IFSC, and UPI ID."""
    updates = {k: v for k, v in body.dict().items() if v is not None}
    if "upi_id" in updates:
        updates["qr_code_url"] = f"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa={updates['upi_id']}&pn=MediAI%20Hospital"
    updated = user_db_service.update_payment_config(updates)
    return {"message": "Payment account details updated successfully", "payment_config": updated}
