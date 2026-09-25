"""
Document Management routes — upload lab reports, diagnostic scans, and medical files
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
from app.services.user_db_service import user_db_service

router = APIRouter()
security = HTTPBearer()

class DocumentUploadRequest(BaseModel):
    patient_id:   str
    patient_name: str
    title:        str
    category:     str  # Lab Report | Diagnostic Scan | Prescription | Discharge Summary
    uploaded_by:  str  # Patient | Doctor
    file_name:    str
    file_size:    str = "1.5 MB"
    summary:      Optional[str] = "Clinical test results attached."

@router.post("/upload", status_code=201)
async def upload_document(body: DocumentUploadRequest):
    """Upload a new lab report or document to patient record."""
    doc = user_db_service.add_document(
        patient_id=body.patient_id,
        patient_name=body.patient_name,
        title=body.title,
        category=body.category,
        uploaded_by=body.uploaded_by,
        file_name=body.file_name,
        file_size=body.file_size,
        summary=body.summary or "Document uploaded successfully."
    )
    return {"message": "Document uploaded and saved to database successfully", "document": doc}

@router.get("/patient/{patient_id}")
async def get_patient_documents(patient_id: str):
    """Get all lab reports and uploaded documents for a patient."""
    docs = user_db_service.get_patient_documents(patient_id)
    return {"documents": docs, "total": len(docs)}
