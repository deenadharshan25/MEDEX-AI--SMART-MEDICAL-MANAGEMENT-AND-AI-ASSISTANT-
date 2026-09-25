"""
MediAI — Hospital Database & Patient Profile Context Service
Fetches EHR details, active vitals, prescriptions, and appointment records for LLM context grounding.
"""

from typing import Dict, Any, List
import datetime

MOCK_PATIENT_DATABASE = {
    "patient@mediai.com": {
        "id": "PAT-98402",
        "name": "John Doe",
        "age": 42,
        "gender": "Male",
        "blood_group": "O+",
        "height_cm": 175,
        "weight_kg": 74.2,
        "bmi": 24.2,
        "allergies": ["Penicillin", "Dust Mites"],
        "chronic_conditions": ["Type 2 Diabetes (Controlled)", "Hypertension (Stage 1)"],
        "active_prescriptions": [
            {"drug": "Metformin", "dose": "500mg", "freq": "Twice daily with meals", "prescribed_by": "Dr. Kumar"},
            {"drug": "Amlodipine", "dose": "5mg", "freq": "Once daily (Morning)", "prescribed_by": "Dr. Wilson"}
        ],
        "vitals_history": {
            "blood_pressure": "124/82 mmHg",
            "heart_rate": "72 bpm",
            "blood_glucose_fasting": "118 mg/dL",
            "spo2": "98%",
            "temperature": "98.6 °F",
            "last_updated": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
        },
        "upcoming_appointments": [
            {"date": "2025-09-25 10:30 AM", "doctor": "Dr. Sarah Jenkins", "department": "Endocrinology", "type": "Follow-up"},
            {"date": "2025-10-12 02:00 PM", "doctor": "Dr. Michael Chen", "department": "Cardiology", "type": "Routine Checkup"}
        ]
    }
}

class PatientService:
    def get_patient_profile(self, user_email: str = "patient@mediai.com") -> Dict[str, Any]:
        """Fetch patient EHR record by email."""
        return MOCK_PATIENT_DATABASE.get(user_email, MOCK_PATIENT_DATABASE["patient@mediai.com"])

    def build_patient_prompt_context(self, user_email: str = "patient@mediai.com") -> str:
        """Format patient health record into LLM prompt context."""
        p = self.get_patient_profile(user_email)
        context = "🏥 [ACTIVE PATIENT EHR & HOSPITAL DATABASE RECORD]\n"
        context += f"• Patient: {p['name']} | Age: {p['age']} | Gender: {p['gender']} | Blood Group: {p['blood_group']}\n"
        context += f"• Vitals: BP: {p['vitals_history']['blood_pressure']} | HR: {p['vitals_history']['heart_rate']} | Glucose: {p['vitals_history']['blood_glucose_fasting']} | SpO2: {p['vitals_history']['spo2']}\n"
        context += f"• Chronic Conditions: {', '.join(p['chronic_conditions'])}\n"
        context += f"• Allergies: {', '.join(p['allergies'])}\n"
        context += f"• Active Prescriptions: " + "; ".join([f"{rx['drug']} {rx['dose']} ({rx['freq']})" for rx in p['active_prescriptions']]) + "\n"
        return context

patient_service = PatientService()
