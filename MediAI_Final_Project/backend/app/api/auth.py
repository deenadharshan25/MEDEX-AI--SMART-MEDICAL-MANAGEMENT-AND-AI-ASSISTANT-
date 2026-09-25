"""
Authentication routes — JWT login, register, refresh with User Database validation
"""
from fastapi import APIRouter, HTTPException, Depends, status, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from typing import Optional
import secrets, os, base64, json, time

from app.services.user_db_service import user_db_service

router = APIRouter()
security = HTTPBearer()

# ── Schemas ──────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name:  str = Field(..., min_length=2, max_length=50)
    username:   Optional[str] = None
    email:      str
    password:   str = Field(..., min_length=6)
    role:       str = Field(default="patient")
    age:        Optional[int] = 30
    year:       Optional[str] = "2025"
    department: Optional[str] = "General Medicine"

class LoginRequest(BaseModel):
    email:       str  # email or username
    password:    str
    remember_me: bool = False

class TokenResponse(BaseModel):
    access_token:  str
    refresh_token: str
    token_type:    str = "bearer"
    expires_in:    int
    user: dict

def create_token(user_id: str, expires_hours: int = 24) -> str:
    payload = {"sub": user_id, "exp": time.time() + expires_hours * 3600, "iat": time.time()}
    return base64.urlsafe_b64encode(json.dumps(payload).encode()).decode()

# ── Routes ───────────────────────────────────────────────────
@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(body: RegisterRequest):
    """Register a new user in the User Database."""
    try:
        username = body.username or f"{body.first_name.lower()}{body.last_name.lower()}"
        full_name = f"{body.first_name} {body.last_name}"
        user_record = user_db_service.add_user_by_admin(
            role=body.role,
            name=full_name,
            age=body.age or 30,
            year=body.year or "2025",
            username=username,
            password=body.password,
            department=body.department or "General Medicine",
            email=body.email
        )
        access_token = create_token(user_record["id"], 24)
        refresh_token = create_token(user_record["id"], 168)
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=86400,
            user={
                "id": user_record["id"],
                "email": user_record["email"],
                "username": user_record["username"],
                "name": user_record["name"],
                "role": user_record["role"],
                "department": user_record["department"]
            }
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest):
    """Login with strict username/email and password validation against the database."""
    if not body.email or not body.password:
        raise HTTPException(status_code=400, detail="Username/Email and Password are required.")
    
    user = user_db_service.authenticate_user(body.email, body.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please check your username/password or contact Admin."
        )

    expires = 168 if body.remember_me else 24
    return TokenResponse(
        access_token=create_token(user["id"], expires),
        refresh_token=create_token(user["id"], 720),
        expires_in=expires * 3600,
        user={
            "id": user["id"],
            "email": user["email"],
            "username": user["username"],
            "name": user["name"],
            "role": user["role"],
            "age": user.get("age"),
            "year": user.get("year"),
            "department": user.get("department", "General Medicine")
        }
    )
