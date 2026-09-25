"""
Database Models - SQLAlchemy ORM
MediAI Intelligent Medical Diagnosis System
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.utils.database import Base
import enum


class UserRole(str, enum.Enum):
    patient = "patient"
    doctor  = "doctor"
    admin   = "admin"


class RiskLevel(str, enum.Enum):
    low      = "low"
    moderate = "moderate"
    high     = "high"
    critical = "critical"


class AppointmentStatus(str, enum.Enum):
    pending   = "pending"
    confirmed = "confirmed"
    completed = "completed"
    cancelled = "cancelled"


# =====================================================================
# USER
# =====================================================================
class User(Base):
    __tablename__ = "users"

    id             = Column(Integer, primary_key=True, index=True)
    email          = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password= Column(String(255), nullable=False)
    first_name     = Column(String(100), nullable=False)
    last_name      = Column(String(100), nullable=False)
    role           = Column(Enum(UserRole), default=UserRole.patient)
    is_active      = Column(Boolean, default=True)
    is_verified    = Column(Boolean, default=False)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())
    updated_at     = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    patient_profile = relationship("PatientProfile", back_populates="user", uselist=False)
    doctor_profile  = relationship("DoctorProfile",  back_populates="user", uselist=False)
    diagnoses       = relationship("Diagnosis", back_populates="patient")
    appointments    = relationship("Appointment", back_populates="patient", foreign_keys="Appointment.patient_id")
    chat_sessions   = relationship("ChatSession", back_populates="user")


# =====================================================================
# PATIENT PROFILE
# =====================================================================
class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id            = Column(Integer, primary_key=True, index=True)
    user_id       = Column(Integer, ForeignKey("users.id"), unique=True)
    date_of_birth = Column(String(20))
    gender        = Column(String(20))
    blood_type    = Column(String(10))
    height_cm     = Column(Float)
    weight_kg     = Column(Float)
    phone         = Column(String(20))
    address       = Column(Text)
    emergency_contact = Column(String(255))
    allergies     = Column(Text)
    existing_conditions = Column(Text)
    family_history= Column(Text)
    smoking       = Column(Boolean, default=False)
    alcohol       = Column(Boolean, default=False)
    health_score  = Column(Float, default=70.0)
    bmi           = Column(Float)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())

    user          = relationship("User", back_populates="patient_profile")
    medications   = relationship("Medication", back_populates="patient")
    lab_reports   = relationship("LabReport",  back_populates="patient")
    vaccinations  = relationship("Vaccination", back_populates="patient")


# =====================================================================
# DOCTOR PROFILE
# =====================================================================
class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"

    id             = Column(Integer, primary_key=True, index=True)
    user_id        = Column(Integer, ForeignKey("users.id"), unique=True)
    specialty      = Column(String(100))
    license_number = Column(String(100))
    hospital       = Column(String(255))
    experience_years = Column(Integer, default=0)
    bio            = Column(Text)
    available      = Column(Boolean, default=True)
    rating         = Column(Float, default=5.0)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())

    user           = relationship("User", back_populates="doctor_profile")
    prescriptions  = relationship("Prescription", back_populates="doctor")


# =====================================================================
# DIAGNOSIS
# =====================================================================
class Diagnosis(Base):
    __tablename__ = "diagnoses"

    id               = Column(Integer, primary_key=True, index=True)
    patient_id       = Column(Integer, ForeignKey("users.id"))
    symptoms         = Column(Text, nullable=False)  # JSON string
    predicted_disease= Column(String(255))
    confidence_score = Column(Float)
    risk_level       = Column(Enum(RiskLevel), default=RiskLevel.low)
    ai_recommendation= Column(Text)
    model_used       = Column(String(100), default="ensemble")
    raw_results      = Column(Text)  # JSON
    age              = Column(Integer)
    gender           = Column(String(20))
    bmi              = Column(Float)
    blood_pressure   = Column(String(20))
    sugar_level      = Column(Float)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())

    patient          = relationship("User", back_populates="diagnoses")


# =====================================================================
# APPOINTMENT
# =====================================================================
class Appointment(Base):
    __tablename__ = "appointments"

    id           = Column(Integer, primary_key=True, index=True)
    patient_id   = Column(Integer, ForeignKey("users.id"))
    doctor_id    = Column(Integer, ForeignKey("users.id"))
    date         = Column(String(20), nullable=False)
    time         = Column(String(20), nullable=False)
    type         = Column(String(50), default="In-Person")  # Video Call / In-Person
    reason       = Column(Text)
    status       = Column(Enum(AppointmentStatus), default=AppointmentStatus.pending)
    notes        = Column(Text)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    patient      = relationship("User", back_populates="appointments",   foreign_keys=[patient_id])
    doctor       = relationship("User", back_populates=None,             foreign_keys=[doctor_id])


# =====================================================================
# MEDICATION
# =====================================================================
class Medication(Base):
    __tablename__ = "medications"

    id          = Column(Integer, primary_key=True, index=True)
    patient_id  = Column(Integer, ForeignKey("patient_profiles.id"))
    name        = Column(String(255), nullable=False)
    dosage      = Column(String(100))
    frequency   = Column(String(100))
    start_date  = Column(String(20))
    end_date    = Column(String(20))
    prescribed_by = Column(String(255))
    notes       = Column(Text)
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    patient     = relationship("PatientProfile", back_populates="medications")


# =====================================================================
# LAB REPORT
# =====================================================================
class LabReport(Base):
    __tablename__ = "lab_reports"

    id          = Column(Integer, primary_key=True, index=True)
    patient_id  = Column(Integer, ForeignKey("patient_profiles.id"))
    test_name   = Column(String(255), nullable=False)
    lab_name    = Column(String(255))
    test_date   = Column(String(20))
    result      = Column(Text)
    status      = Column(String(50), default="Normal")
    file_url    = Column(String(500))  # Cloudinary URL
    ai_analysis = Column(Text)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    patient     = relationship("PatientProfile", back_populates="lab_reports")


# =====================================================================
# PRESCRIPTION
# =====================================================================
class Prescription(Base):
    __tablename__ = "prescriptions"

    id          = Column(Integer, primary_key=True, index=True)
    patient_id  = Column(Integer, ForeignKey("users.id"))
    doctor_id   = Column(Integer, ForeignKey("doctor_profiles.id"))
    diagnosis   = Column(String(255))
    medicines   = Column(Text)  # JSON
    instructions= Column(Text)
    valid_until = Column(String(20))
    file_url    = Column(String(500))
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    doctor      = relationship("DoctorProfile", back_populates="prescriptions")


# =====================================================================
# VACCINATION
# =====================================================================
class Vaccination(Base):
    __tablename__ = "vaccinations"

    id          = Column(Integer, primary_key=True, index=True)
    patient_id  = Column(Integer, ForeignKey("patient_profiles.id"))
    vaccine_name= Column(String(255))
    date_given  = Column(String(20))
    next_due    = Column(String(20))
    administered_by = Column(String(255))
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    patient     = relationship("PatientProfile", back_populates="vaccinations")


# =====================================================================
# CHAT SESSION
# =====================================================================
class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id"))
    title       = Column(String(255))
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    user        = relationship("User", back_populates="chat_sessions")
    messages    = relationship("ChatMessage", back_populates="session")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id          = Column(Integer, primary_key=True, index=True)
    session_id  = Column(Integer, ForeignKey("chat_sessions.id"))
    role        = Column(String(20))  # user / assistant
    content     = Column(Text)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    session     = relationship("ChatSession", back_populates="messages")
