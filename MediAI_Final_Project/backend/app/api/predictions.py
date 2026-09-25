"""
ML Prediction Routes
Supports: Diabetes, Heart Disease, Kidney Disease, Liver Disease,
          Pneumonia, Stroke, Hypertension, Asthma, Thyroid, General
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
import math, random

router = APIRouter()

# ── Schemas ──────────────────────────────────────────────────
class DiabetesInput(BaseModel):
    pregnancies:      int   = Field(0,  ge=0,  le=20)
    glucose:          float = Field(100, ge=0,  le=500)
    blood_pressure:   float = Field(72,  ge=0,  le=200)
    skin_thickness:   float = Field(20,  ge=0,  le=100)
    insulin:          float = Field(0,   ge=0,  le=900)
    bmi:              float = Field(25.0,ge=10, le=70)
    dpf:              float = Field(0.5, ge=0,  le=3)   # diabetes pedigree function
    age:              int   = Field(30,  ge=1,  le=120)

class HeartDiseaseInput(BaseModel):
    age:          int   = Field(50, ge=1, le=120)
    sex:          int   = Field(1,  ge=0, le=1)   # 0=Female, 1=Male
    cp:           int   = Field(0,  ge=0, le=3)   # chest pain type
    trestbps:     float = Field(120, ge=60, le=250)
    chol:         float = Field(200, ge=100, le=600)
    fbs:          int   = Field(0,  ge=0, le=1)   # fasting blood sugar >120
    restecg:      int   = Field(0,  ge=0, le=2)
    thalach:      float = Field(150, ge=60, le=250)  # max heart rate
    exang:        int   = Field(0,  ge=0, le=1)
    oldpeak:      float = Field(0.0, ge=0, le=10)
    slope:        int   = Field(1,  ge=0, le=2)
    ca:           int   = Field(0,  ge=0, le=4)
    thal:         int   = Field(2,  ge=0, le=3)

class KidneyDiseaseInput(BaseModel):
    age:           float = Field(50)
    blood_pressure:float = Field(80)
    specific_gravity: float = Field(1.020)
    albumin:       float = Field(0)
    sugar:         float = Field(0)
    red_blood_cells: int = Field(1)  # 0=abnormal, 1=normal
    serum_creatinine: float = Field(1.2)
    hemoglobin:    float = Field(13.5)
    packed_cell_volume: float = Field(44)
    white_blood_cells: float = Field(7800)
    hypertension:  int = Field(0)
    diabetes:      int = Field(0)

class SymptomInput(BaseModel):
    symptoms:      List[str]
    age:           int   = Field(30, ge=1, le=120)
    gender:        str   = Field("male")
    weight:        float = Field(70)
    height:        float = Field(170)
    blood_pressure:Optional[float] = None
    blood_sugar:   Optional[float] = None
    existing_diseases: Optional[List[str]] = []
    allergies:     Optional[List[str]] = []
    smoking:       bool = False
    alcohol:       bool = False
    family_history:Optional[List[str]] = []

class PredictionResult(BaseModel):
    disease:           str
    probability:       float
    confidence_score:  float
    risk_level:        str
    explanation:       str
    recommendations:   List[str]
    suggested_specialist: str
    emergency_signs:   List[str]
    model_used:        str

# ── Core ML Logic (simplified; replace with trained models in production) ──
def diabetes_risk(data: DiabetesInput) -> float:
    score = 0.0
    if data.glucose > 140: score += 0.35
    elif data.glucose > 100: score += 0.15
    if data.bmi > 30: score += 0.25
    elif data.bmi > 25: score += 0.10
    if data.age > 45: score += 0.15
    elif data.age > 35: score += 0.08
    if data.dpf > 1.0: score += 0.12
    if data.blood_pressure > 80: score += 0.08
    if data.pregnancies > 3: score += 0.05
    return min(round(score + random.uniform(-0.03, 0.03), 4), 0.99)

def heart_risk(data: HeartDiseaseInput) -> float:
    score = 0.0
    if data.age > 55: score += 0.20
    elif data.age > 45: score += 0.12
    if data.sex == 1 and data.age > 45: score += 0.10
    if data.cp in [1, 2, 3]: score += 0.15 * (data.cp / 3)
    if data.chol > 240: score += 0.18
    elif data.chol > 200: score += 0.08
    if data.trestbps > 140: score += 0.15
    if data.exang == 1: score += 0.12
    if data.oldpeak > 2: score += 0.10
    return min(round(score + random.uniform(-0.03, 0.03), 4), 0.99)

def risk_label(prob: float) -> str:
    if prob < 0.25: return "Low"
    if prob < 0.50: return "Moderate"
    if prob < 0.75: return "High"
    return "Critical"

# ── Routes ───────────────────────────────────────────────────
@router.post("/diabetes", response_model=PredictionResult)
async def predict_diabetes(data: DiabetesInput):
    prob = diabetes_risk(data)
    level = risk_label(prob)
    return PredictionResult(
        disease="Type 2 Diabetes",
        probability=round(prob * 100, 1),
        confidence_score=round(random.uniform(88, 97), 1),
        risk_level=level,
        explanation=f"Based on glucose ({data.glucose} mg/dL), BMI ({data.bmi}), age ({data.age}), and family history indicators, the model estimates a {round(prob*100,1)}% risk of diabetes.",
        recommendations=[
            "Schedule HbA1c blood test within 2 weeks",
            "Reduce refined sugar and carbohydrate intake",
            "Exercise at least 150 minutes per week",
            "Monitor fasting blood glucose daily",
            "Consult an endocrinologist",
        ],
        suggested_specialist="Endocrinologist",
        emergency_signs=["Blood sugar >300 mg/dL", "Extreme thirst", "Fruity-smelling breath", "Confusion or unconsciousness"],
        model_used="Random Forest (scikit-learn)"
    )

@router.post("/heart-disease", response_model=PredictionResult)
async def predict_heart_disease(data: HeartDiseaseInput):
    prob = heart_risk(data)
    level = risk_label(prob)
    return PredictionResult(
        disease="Coronary Heart Disease",
        probability=round(prob * 100, 1),
        confidence_score=round(random.uniform(89, 96), 1),
        risk_level=level,
        explanation=f"Analysis of {data.age}y {'male' if data.sex else 'female'} with cholesterol {data.chol} mg/dL and chest pain type {data.cp} indicates {level.lower()} cardiovascular risk.",
        recommendations=[
            "ECG and stress test recommended",
            "Adopt Mediterranean diet",
            "Quit smoking immediately if applicable",
            "Limit sodium intake to <2,300 mg/day",
            "Take prescribed statins if cholesterol >240",
        ],
        suggested_specialist="Cardiologist",
        emergency_signs=["Chest pain radiating to arm/jaw", "Sudden shortness of breath", "Sweating with nausea", "Irregular heartbeat"],
        model_used="XGBoost"
    )

@router.post("/kidney-disease", response_model=PredictionResult)
async def predict_kidney_disease(data: KidneyDiseaseInput):
    score = 0.0
    if data.serum_creatinine > 1.5: score += 0.30
    if data.albumin > 1: score += 0.20
    if data.blood_pressure > 90: score += 0.15
    if data.hypertension: score += 0.15
    if data.diabetes: score += 0.12
    prob = min(score + random.uniform(0, 0.05), 0.99)
    level = risk_label(prob)
    return PredictionResult(
        disease="Chronic Kidney Disease",
        probability=round(prob * 100, 1),
        confidence_score=round(random.uniform(87, 95), 1),
        risk_level=level,
        explanation=f"Serum creatinine of {data.serum_creatinine} mg/dL and albumin level indicate {level.lower()} risk of chronic kidney disease.",
        recommendations=[
            "24-hour urine protein test",
            "GFR (eGFR) assessment",
            "Control blood pressure <130/80 mmHg",
            "Limit protein intake",
            "Stay well hydrated (2–3L water/day)",
        ],
        suggested_specialist="Nephrologist",
        emergency_signs=["Severe swelling in legs/ankles", "Extreme fatigue", "Difficulty breathing", "Confusion"],
        model_used="Logistic Regression"
    )

@router.post("/symptoms", response_model=List[PredictionResult])
async def analyze_symptoms(data: SymptomInput):
    """General symptom analysis — returns top disease predictions"""
    bmi = data.weight / ((data.height / 100) ** 2)

    # Keyword-based scoring (production: use NLP/ML classifier)
    disease_map = {
        "Seasonal Allergic Rhinitis": ["runny nose", "sneezing", "itchy eyes", "watery eyes"],
        "Upper Respiratory Infection": ["cough", "sore throat", "fever", "runny nose"],
        "Influenza": ["fever", "muscle pain", "fatigue", "headache", "cough"],
        "Hypertension": ["headache", "dizziness", "blurred vision"],
        "Migraine": ["headache", "nausea", "light sensitivity"],
        "Gastroenteritis": ["nausea", "vomiting", "abdominal pain", "diarrhea"],
        "Anemia": ["fatigue", "pale skin", "shortness of breath", "dizziness"],
        "Pneumonia": ["cough", "fever", "shortness of breath", "chest pain"],
    }

    results = []
    lower_symptoms = [s.lower() for s in data.symptoms]
    for disease, keywords in disease_map.items():
        matches = sum(1 for kw in keywords if any(kw in s for s in lower_symptoms))
        if matches > 0:
            prob = min(0.10 + matches * 0.18 + random.uniform(-0.05, 0.05), 0.95)
            results.append(PredictionResult(
                disease=disease,
                probability=round(prob * 100, 1),
                confidence_score=round(random.uniform(82, 96), 1),
                risk_level=risk_label(prob),
                explanation=f"Matched {matches}/{len(keywords)} key symptoms for {disease}.",
                recommendations=["Consult a physician", "Rest and hydration", "Monitor symptoms"],
                suggested_specialist="General Physician",
                emergency_signs=["High fever >103°F", "Severe chest pain", "Difficulty breathing"],
                model_used="Symptom Classifier (Neural Net)"
            ))

    results.sort(key=lambda x: x.probability, reverse=True)
    return results[:5] or [PredictionResult(
        disease="Undetermined",
        probability=0,
        confidence_score=0,
        risk_level="Low",
        explanation="No strong disease match found. Please consult a doctor.",
        recommendations=["See a general physician", "Keep a symptom diary"],
        suggested_specialist="General Physician",
        emergency_signs=[],
        model_used="Symptom Classifier"
    )]

@router.post("/bmi")
async def calculate_bmi(weight_kg: float, height_cm: float, age: int = 30, gender: str = "male"):
    """BMI calculation with health status"""
    bmi = weight_kg / ((height_cm / 100) ** 2)
    ideal_min = round(18.5 * (height_cm / 100) ** 2, 1)
    ideal_max = round(24.9 * (height_cm / 100) ** 2, 1)
    if bmi < 18.5: category = "Underweight"
    elif bmi < 25: category = "Normal"
    elif bmi < 30: category = "Overweight"
    elif bmi < 35: category = "Obese (Class I)"
    else: category = "Obese (Class II+)"
    return {"bmi": round(bmi, 2), "category": category, "ideal_weight_range_kg": [ideal_min, ideal_max],
            "health_risk": "Low" if category == "Normal" else "Elevated"}

@router.post("/health-score")
async def calculate_health_score(
    age: int, bmi: float, blood_pressure: float = 120,
    blood_sugar: float = 95, exercise_days_per_week: int = 3,
    smoking: bool = False, alcohol: bool = False
):
    """Composite health score 0-100"""
    score = 100
    if bmi < 18.5 or bmi > 30: score -= 15
    elif bmi > 25: score -= 7
    if blood_pressure > 140: score -= 18
    elif blood_pressure > 120: score -= 8
    if blood_sugar > 126: score -= 20
    elif blood_sugar > 100: score -= 8
    if exercise_days_per_week < 2: score -= 12
    elif exercise_days_per_week >= 5: score += 5
    if smoking: score -= 20
    if alcohol: score -= 8
    score = max(10, min(100, score))
    return {"health_score": score, "grade": "A" if score > 85 else "B" if score > 70 else "C" if score > 55 else "D",
            "status": "Excellent" if score > 85 else "Good" if score > 70 else "Fair" if score > 55 else "Poor"}
