"""Analytics & dashboard stats routes"""
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter()
security = HTTPBearer()

@router.get("/overview")
async def analytics_overview(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return {
        "total_diagnoses": 12, "appointments": 8,
        "health_score_avg": 87, "medications": 5,
        "active_conditions": 2,
    }

@router.get("/health-score-trend")
async def health_score_trend(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return {"labels":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"],
            "values":[72,75,70,78,80,82,85,87]}

@router.get("/disease-distribution")
async def disease_distribution(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return {"labels":["Respiratory","Diabetes","Hypertension","Cardiovascular","Others"],
            "values":[28,22,18,15,17]}

@router.get("/appointments-trend")
async def appointments_trend(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return {"labels":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"],
            "values":[3,5,2,6,4,8,5,3]}

@router.get("/vitals-radar")
async def vitals_radar(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return {
        "labels":["Heart Rate","Blood Pressure","Blood Sugar","BMI","Cholesterol","SpO2"],
        "current":[85,90,95,88,72,98],
        "optimal":[90,90,90,90,90,99],
    }
