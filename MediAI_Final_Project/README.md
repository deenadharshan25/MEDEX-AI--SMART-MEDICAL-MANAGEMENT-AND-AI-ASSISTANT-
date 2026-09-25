# 🏥 MediAI — Intelligent Medical Diagnosis System

> **⚠️ Disclaimer:** This system is designed for **educational and research purposes only**. It does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.

---

## 🌟 Features

| Category | Features |
|----------|----------|
| 🧠 AI Diagnosis | Symptom checker, Disease prediction (10+ diseases), Risk assessment |
| 📊 Dashboard | Health score, BMI, Vitals tracking, Analytics charts |
| 💬 AI Chat | 24/7 health assistant with voice input/output |
| 👨‍⚕️ Doctor Portal | Patient management, prescriptions, appointments |
| 🔧 Admin Panel | User management, AI model monitoring, analytics |
| 🔒 Security | JWT auth, bcrypt, RBAC, rate limiting, XSS/CSRF protection |

---

## 🚀 Quick Start

### Option 1 — Open Directly (No Server Needed)
```bash
# Just double-click or open in browser:
open frontend/index.html
```
> All demo features work without any server. Uses localStorage for state.

---

### Option 2 — Full Stack with Docker (Recommended)

**Prerequisites:** Docker Desktop installed

```bash
# 1. Clone / extract project
cd medai

# 2. Copy environment config
cp backend/.env.example backend/.env
# Edit backend/.env and add your API keys

# 3. Start everything
docker-compose up -d

# 4. Open the app
open http://localhost:3000
# API docs: http://localhost:8000/api/docs
```

---

### Option 3 — Manual Setup

#### Backend (Python/FastAPI)
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database URL and API keys

# Run database migrations
# psql -U medai -d medaidb -f ../docs/database_schema.sql

# Start server
uvicorn main:app --reload --port 8000
```

#### Frontend
```bash
# Open directly in browser (no build needed for demo)
open frontend/index.html

# Or serve with any HTTP server:
cd frontend && python -m http.server 3000
```

---

## 🔐 Demo Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Patient | patient@mediai.com | password123 | Full patient features |
| Doctor | doctor@mediai.com | password123 | Doctor dashboard |
| Admin | admin@mediai.com | password123 | Admin panel |

> Click the role buttons on the login screen for instant demo access.

---

## 🏗️ Project Structure

```
medai/
├── frontend/
│   ├── index.html          # App entry point
│   ├── app.js              # Complete SPA (all pages & logic)
│   └── styles/
│       └── main.css        # Full stylesheet (glassmorphism UI)
│
├── backend/
│   ├── main.py             # FastAPI app entry point
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Container config
│   ├── .env.example        # Environment variables template
│   └── app/
│       └── api/
│           ├── auth.py         # JWT authentication
│           ├── users.py        # User profiles & health data
│           ├── diagnosis.py    # Symptom checker
│           ├── predictions.py  # ML disease predictions
│           ├── appointments.py # Booking system
│           ├── chat.py         # AI chat (OpenAI/Gemini/Claude)
│           ├── analytics.py    # Dashboard analytics
│           └── admin.py        # Admin management
│
├── docs/
│   ├── database_schema.sql # Complete PostgreSQL schema
│   └── api_docs.md         # REST API documentation
│
├── docker-compose.yml      # Full stack Docker setup
├── nginx.conf              # Nginx reverse proxy config
└── README.md               # This file
```

---

## 🤖 AI Integration

The modular AI service supports switching between providers:

```python
# In backend/.env
DEFAULT_AI_MODEL=claude   # Options: claude | openai | gemini

# Claude API
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI
OPENAI_API_KEY=sk-...

# Google Gemini
GOOGLE_GEMINI_API_KEY=AIza...
```

---

## 🧬 ML Models Included

| Disease | Algorithm | Dataset |
|---------|-----------|---------|
| Diabetes | Random Forest | Pima Indians Diabetes |
| Heart Disease | XGBoost | UCI Heart Disease |
| Kidney Disease | Logistic Regression | CKD Dataset |
| Symptom Classification | Neural Network | Custom symptom KB |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Get JWT token |
| GET | `/api/users/me` | Get profile |
| POST | `/api/predictions/diabetes` | Diabetes ML prediction |
| POST | `/api/predictions/heart-disease` | Heart disease ML |
| POST | `/api/predictions/symptoms` | General symptom analysis |
| POST | `/api/predictions/bmi` | BMI calculation |
| GET | `/api/appointments/` | List appointments |
| POST | `/api/chat/message` | AI chat message |
| GET | `/api/analytics/overview` | Dashboard stats |

Full docs: `http://localhost:8000/api/docs` (Swagger UI)

---

## 🛡️ Security

- ✅ JWT authentication (access + refresh tokens)
- ✅ bcrypt password hashing
- ✅ Role-based access control (Patient / Doctor / Admin)
- ✅ Rate limiting via SlowAPI
- ✅ CORS protection
- ✅ Input validation (Pydantic)
- ✅ SQL injection protection (SQLAlchemy ORM)
- ✅ XSS protection headers

---

## 📦 Tech Stack

**Frontend:** Vanilla JS SPA, CSS3 (Glassmorphism), Chart.js
**Backend:** Python 3.11, FastAPI, SQLAlchemy
**Database:** PostgreSQL 16
**Auth:** JWT (python-jose)
**AI:** Anthropic Claude / OpenAI / Google Gemini
**ML:** scikit-learn, XGBoost
**Storage:** Cloudinary
**Deploy:** Docker + Nginx

---

## 📄 License

MIT License — Free for educational and research use.

**Built for Final Year Computer Science Project**
