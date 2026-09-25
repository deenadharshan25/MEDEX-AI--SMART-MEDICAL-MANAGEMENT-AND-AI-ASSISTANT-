"""Database connection and session management"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./medai.db"
)

# Add connect_args for SQLite to avoid thread errors
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    from app.models.models import (
        User, PatientProfile, DoctorProfile, Diagnosis,
        Appointment, Medication, LabReport, Prescription,
        Vaccination, ChatSession, ChatMessage
    )
    Base.metadata.create_all(bind=engine)
    print("Database tables created")
