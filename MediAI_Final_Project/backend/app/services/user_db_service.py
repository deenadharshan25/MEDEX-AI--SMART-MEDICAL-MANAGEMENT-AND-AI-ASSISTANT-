"""
MediAI — User Database, Payment, Appointment & Document Storage Service
Handles hashed password storage, user creation, payments, appointments, and lab document records.
"""

import hashlib
import secrets
import datetime
from typing import Dict, Any, List, Optional

def hash_password(password: str, salt: Optional[str] = None) -> (str, str):
    if not salt:
        salt = secrets.token_hex(16)
    hashed = hashlib.sha256(f"{salt}{password}".encode()).hexdigest()
    return salt, hashed

def verify_password(password: str, salt: str, hashed: str) -> bool:
    return hashlib.sha256(f"{salt}{password}".encode()).hexdigest() == hashed

class UserDatabaseService:
    def __init__(self):
        self.users: Dict[str, Dict[str, Any]] = {}
        self.appointments: List[Dict[str, Any]] = []
        self.documents: List[Dict[str, Any]] = []
        self.payment_config: Dict[str, Any] = {
            "account_name": "MediAI General Hospital",
            "account_number": "98765432101234",
            "ifsc_code": "MEDAI0001984",
            "upi_id": "mediai.hospital@okicici",
            "qr_code_url": "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=mediai.hospital@okicici&pn=MediAI%20Hospital",
            "consultation_fee": 500,
            "status": "Active"
        }
        self._init_default_users()
        self._init_default_appointments()
        self._init_default_documents()

    def _init_default_users(self):
        # Admin User
        s, h = hash_password("admin123")
        self.users["admin@mediai.com"] = {
            "id": "u-admin",
            "username": "admin",
            "email": "admin@mediai.com",
            "salt": s,
            "password_hash": h,
            "name": "System Administrator",
            "role": "admin",
            "age": 38,
            "year": "2024",
            "department": "IT & Administration",
            "status": "Active",
            "created_at": "2025-01-01"
        }

        # Doctor User (Dr. Raj Kumar)
        s, h = hash_password("password123")
        self.users["doctor@mediai.com"] = {
            "id": "doc-101",
            "username": "drkumar",
            "email": "doctor@mediai.com",
            "salt": s,
            "password_hash": h,
            "name": "Dr. Raj Kumar",
            "role": "doctor",
            "age": 45,
            "year": "2020",
            "department": "Cardiology",
            "specialty": "Cardiologist",
            "status": "Active",
            "created_at": "2025-01-10"
        }

        # Doctor User 2 (Dr. Sarah Lee)
        s, h = hash_password("password123")
        self.users["sarah.lee@mediai.com"] = {
            "id": "doc-102",
            "username": "drsarah",
            "email": "sarah.lee@mediai.com",
            "salt": s,
            "password_hash": h,
            "name": "Dr. Sarah Lee",
            "role": "doctor",
            "age": 41,
            "year": "2021",
            "department": "Endocrinology",
            "specialty": "Endocrinologist",
            "status": "Active",
            "created_at": "2025-01-15"
        }

        # Patient User (John Doe)
        s, h = hash_password("password123")
        self.users["patient@mediai.com"] = {
            "id": "pat-98402",
            "username": "johndoe",
            "email": "patient@mediai.com",
            "salt": s,
            "password_hash": h,
            "name": "John Doe",
            "role": "patient",
            "age": 42,
            "year": "2025",
            "department": "General Outpatient",
            "status": "Active",
            "created_at": "2025-02-01"
        }

    def _init_default_appointments(self):
        today_str = datetime.date.today().isoformat()
        self.appointments = [
            {
                "id": "apt-101",
                "patient_id": "pat-98402",
                "patient_name": "John Doe",
                "patient_age": 42,
                "doctor_id": "doc-101",
                "doctor_name": "Dr. Raj Kumar",
                "department": "Cardiology",
                "date": today_str,
                "time": "10:30 AM",
                "type": "In-Person",
                "reason": "Blood pressure checkup & chest discomfort follow-up",
                "status": "Confirmed",
                "payment_status": "Paid (₹500)"
            },
            {
                "id": "apt-102",
                "patient_id": "pat-98402",
                "patient_name": "John Doe",
                "patient_age": 42,
                "doctor_id": "doc-102",
                "doctor_name": "Dr. Sarah Lee",
                "department": "Endocrinology",
                "date": today_str,
                "time": "02:15 PM",
                "type": "Video Consultation",
                "reason": "Fasting glucose review & Metformin dose adjustment",
                "status": "Confirmed",
                "payment_status": "Paid (₹500)"
            }
        ]

    def _init_default_documents(self):
        self.documents = [
            {
                "id": "doc-rec-1",
                "patient_id": "pat-98402",
                "patient_name": "John Doe",
                "title": "Comprehensive Blood Panel & HbA1c",
                "category": "Lab Report",
                "uploaded_by": "John Doe (Patient)",
                "date": "2025-08-10",
                "file_name": "Blood_Panel_Aug2025.pdf",
                "file_size": "1.2 MB",
                "summary": "Fasting Glucose: 118 mg/dL | HbA1c: 6.4% | Cholesterol: 185 mg/dL",
                "download_url": "#"
            },
            {
                "id": "doc-rec-2",
                "patient_id": "pat-98402",
                "patient_name": "John Doe",
                "title": "ECG & Cardiac Stress Test Scan",
                "category": "Diagnostic Scan",
                "uploaded_by": "Dr. Raj Kumar (Doctor)",
                "date": "2025-08-14",
                "file_name": "ECG_Scan_Report.pdf",
                "file_size": "2.8 MB",
                "summary": "Normal sinus rhythm, HR 72 bpm, no acute ischemia noted.",
                "download_url": "#"
            }
        ]

    def authenticate_user(self, identifier: str, password: str) -> Optional[Dict[str, Any]]:
        identifier = identifier.strip().lower()
        user = None
        for u in self.users.values():
            if u["email"].lower() == identifier or u["username"].lower() == identifier:
                user = u
                break
        if not user:
            return None
        if verify_password(password, user["salt"], user["password_hash"]):
            return user
        return None

    def add_user_by_admin(self, role: str, name: str, age: int, year: str,
                          username: str, password: str, department: str,
                          email: Optional[str] = None) -> Dict[str, Any]:
        username = username.strip().lower()
        if not email:
            email = f"{username}@mediai.com"
        else:
            email = email.strip().lower()

        # Check existing
        for u in self.users.values():
            if u["username"].lower() == username or u["email"].lower() == email:
                raise ValueError("Username or Email already exists in user database.")

        salt, pwd_hash = hash_password(password)
        user_id = f"{role[:3]}-{secrets.token_hex(4)}"
        
        user_record = {
            "id": user_id,
            "username": username,
            "email": email,
            "salt": salt,
            "password_hash": pwd_hash,
            "name": name,
            "role": role.lower(),
            "age": age,
            "year": year,
            "department": department,
            "status": "Active",
            "created_at": datetime.date.today().isoformat()
        }
        self.users[email] = user_record
        return user_record

    def get_all_users(self, role: Optional[str] = None) -> List[Dict[str, Any]]:
        res = list(self.users.values())
        if role:
            res = [u for u in res if u["role"].lower() == role.lower()]
        return res

    def get_doctors(self) -> List[Dict[str, Any]]:
        return [u for u in self.users.values() if u["role"] == "doctor"]

    def book_appointment(self, patient_id: str, patient_name: str, doctor_id: str,
                         date: str, time: str, appt_type: str, reason: str) -> Dict[str, Any]:
        doctor = next((u for u in self.users.values() if u["id"] == doctor_id or u["email"] == doctor_id), None)
        doc_name = doctor["name"] if doctor else "Specialist Doctor"
        dept = doctor["department"] if doctor else "General Medicine"

        apt = {
            "id": f"apt-{secrets.token_hex(4)}",
            "patient_id": patient_id,
            "patient_name": patient_name,
            "patient_age": 42,
            "doctor_id": doctor_id,
            "doctor_name": doc_name,
            "department": dept,
            "date": date,
            "time": time,
            "type": appt_type,
            "reason": reason,
            "status": "Confirmed",
            "payment_status": f"Paid (₹{self.payment_config['consultation_fee']})"
        }
        self.appointments.append(apt)
        return apt

    def get_patient_appointments(self, patient_id: str) -> List[Dict[str, Any]]:
        return [a for a in self.appointments if a["patient_id"] == patient_id or patient_id in a["patient_name"].lower()]

    def get_doctor_today_appointments(self, doctor_id: Optional[str] = None) -> List[Dict[str, Any]]:
        today_str = datetime.date.today().isoformat()
        appts = self.appointments
        if doctor_id:
            appts = [a for a in appts if a["doctor_id"] == doctor_id or doctor_id in a["doctor_name"].lower()]
        return appts

    def add_document(self, patient_id: str, patient_name: str, title: str, category: str,
                     uploaded_by: str, file_name: str, file_size: str, summary: str) -> Dict[str, Any]:
        doc = {
            "id": f"doc-{secrets.token_hex(4)}",
            "patient_id": patient_id,
            "patient_name": patient_name,
            "title": title,
            "category": category,
            "uploaded_by": uploaded_by,
            "date": datetime.date.today().isoformat(),
            "file_name": file_name,
            "file_size": file_size,
            "summary": summary,
            "download_url": "#"
        }
        self.documents.append(doc)
        return doc

    def get_patient_documents(self, patient_id: str) -> List[Dict[str, Any]]:
        return [d for d in self.documents if d["patient_id"] == patient_id or patient_id in d["patient_name"].lower()]

    def update_payment_config(self, config: Dict[str, Any]) -> Dict[str, Any]:
        self.payment_config.update(config)
        return self.payment_config

user_db_service = UserDatabaseService()
