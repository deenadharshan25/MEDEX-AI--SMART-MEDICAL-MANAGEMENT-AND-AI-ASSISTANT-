# 📡 MediAI REST API Documentation

Base URL: `http://localhost:8000`
Interactive Docs: `http://localhost:8000/api/docs`

All protected routes require: `Authorization: Bearer <access_token>`

---

## Authentication

### POST /api/auth/register
```json
Request:  {"first_name":"John","last_name":"Doe","email":"j@e.com","password":"Pass123!","role":"patient"}
Response: {"access_token":"...","refresh_token":"...","expires_in":86400,"user":{...}}
```

### POST /api/auth/login
```json
Request:  {"email":"j@e.com","password":"Pass123!","remember_me":false}
Response: {"access_token":"...","refresh_token":"...","user":{"id":"...","role":"patient"}}
```

### POST /api/auth/forgot-password
```json
Request:  {"email":"j@e.com"}
Response: {"message":"Reset link sent"}
```

---

## Predictions (ML)

### POST /api/predictions/diabetes
```json
Request: {"pregnancies":2,"glucose":148,"blood_pressure":72,"skin_thickness":35,"insulin":0,"bmi":33.6,"dpf":0.627,"age":45}
Response: {"disease":"Type 2 Diabetes","probability":62.3,"confidence_score":91.4,"risk_level":"High","explanation":"...","recommendations":[...],"suggested_specialist":"Endocrinologist"}
```

### POST /api/predictions/heart-disease
```json
Request: {"age":55,"sex":1,"cp":2,"trestbps":140,"chol":260,"fbs":0,"restecg":0,"thalach":140,"exang":1,"oldpeak":2.3,"slope":1,"ca":1,"thal":2}
Response: {"disease":"Coronary Heart Disease","probability":71.5,"risk_level":"High",...}
```

### POST /api/predictions/symptoms
```json
Request: {"symptoms":["fever","headache","cough"],"age":30,"gender":"male","weight":70,"height":170}
Response: [{"disease":"Influenza","probability":78.4,"confidence_score":89.1,...},...]
```

### POST /api/predictions/bmi
```json
Request: {"weight_kg":70,"height_cm":175,"age":30,"gender":"male"}
Response: {"bmi":22.86,"category":"Normal","ideal_weight_range_kg":[56.6,76.3],"health_risk":"Low"}
```

---

## Appointments

### GET /api/appointments/
Returns list of appointments for authenticated user.

### POST /api/appointments/
```json
Request:  {"doctor_id":"doc1","date":"2025-09-10","time":"10:30","type":"video","reason":"Check-up"}
Response: {"message":"Appointment booked","appointment":{...}}
```

### GET /api/appointments/doctors?specialty=Cardiologist
Returns list of available doctors filtered by specialty.

---

## AI Chat

### POST /api/chat/message
```json
Request:  {"message":"What causes diabetes?","model":"claude","history":[]}
Response: {"role":"assistant","content":"Diabetes is caused by...","model":"claude","timestamp":"..."}
```

---

## Analytics

### GET /api/analytics/overview
Returns: `{total_diagnoses, appointments, health_score_avg, medications}`

### GET /api/analytics/health-score-trend
Returns: `{labels:["Jan",...], values:[72,75,...]}`

---

## Admin (Admin role required)

### GET /api/admin/stats
Returns: `{total_users:1247, doctors:89, diagnoses:8432, accuracy:96.8}`

### GET /api/admin/users?page=1&limit=20&role=patient
Returns paginated user list.

### GET /api/admin/models
Returns AI model status and accuracy metrics.
