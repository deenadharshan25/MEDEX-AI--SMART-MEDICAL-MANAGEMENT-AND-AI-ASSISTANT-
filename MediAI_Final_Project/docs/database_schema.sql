-- ============================================================
-- MediAI — PostgreSQL Database Schema
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for fuzzy search

-- ── USERS ────────────────────────────────────────────────────
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    role            VARCHAR(20)  NOT NULL DEFAULT 'patient'
                    CHECK (role IN ('patient','doctor','admin')),
    is_active       BOOLEAN DEFAULT TRUE,
    is_verified     BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role  ON users(role);

-- ── PATIENT PROFILES ─────────────────────────────────────────
CREATE TABLE patient_profiles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    date_of_birth   DATE,
    gender          VARCHAR(10),
    blood_type      VARCHAR(5),
    height_cm       NUMERIC(5,1),
    weight_kg       NUMERIC(5,1),
    allergies       TEXT[],
    existing_conditions TEXT[],
    emergency_contact   VARCHAR(255),
    profile_photo_url   TEXT,
    qr_code_url         TEXT,
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ── DOCTOR PROFILES ──────────────────────────────────────────
CREATE TABLE doctor_profiles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    specialty       VARCHAR(100),
    license_number  VARCHAR(100),
    hospital        VARCHAR(255),
    experience_years INT DEFAULT 0,
    rating          NUMERIC(3,2) DEFAULT 0,
    bio             TEXT,
    available       BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id)
);

-- ── VITALS ───────────────────────────────────────────────────
CREATE TABLE vitals (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    heart_rate      NUMERIC(5,1),
    systolic_bp     NUMERIC(5,1),
    diastolic_bp    NUMERIC(5,1),
    blood_sugar     NUMERIC(6,2),
    temperature_f   NUMERIC(5,2),
    spo2            NUMERIC(5,2),
    bmi             NUMERIC(5,2),
    health_score    NUMERIC(5,2),
    recorded_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_vitals_user ON vitals(user_id, recorded_at DESC);

-- ── DIAGNOSES ────────────────────────────────────────────────
CREATE TABLE diagnoses (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    doctor_id       UUID REFERENCES users(id),
    symptoms        TEXT[],
    notes           TEXT,
    status          VARCHAR(20) DEFAULT 'pending'
                    CHECK (status IN ('pending','processing','completed','reviewed')),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at     TIMESTAMPTZ
);

CREATE TABLE diagnosis_predictions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diagnosis_id    UUID REFERENCES diagnoses(id) ON DELETE CASCADE,
    disease         VARCHAR(255) NOT NULL,
    probability     NUMERIC(5,2),
    confidence      NUMERIC(5,2),
    risk_level      VARCHAR(20),
    explanation     TEXT,
    recommendations TEXT[],
    suggested_specialist VARCHAR(100),
    emergency_signs TEXT[],
    model_used      VARCHAR(100),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_diag_user ON diagnoses(user_id, created_at DESC);

-- ── DISEASE PREDICTIONS (specific ML models) ─────────────────
CREATE TABLE disease_predictions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    disease_type    VARCHAR(50) NOT NULL,  -- diabetes, heart, kidney, etc
    input_data      JSONB NOT NULL,
    probability     NUMERIC(5,2),
    confidence      NUMERIC(5,2),
    risk_level      VARCHAR(20),
    model_used      VARCHAR(100),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_dp_user ON disease_predictions(user_id, created_at DESC);

-- ── APPOINTMENTS ─────────────────────────────────────────────
CREATE TABLE appointments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    doctor_id       UUID REFERENCES users(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    type            VARCHAR(20) DEFAULT 'in-person'
                    CHECK (type IN ('in-person','video','phone')),
    reason          TEXT,
    status          VARCHAR(20) DEFAULT 'pending'
                    CHECK (status IN ('pending','confirmed','completed','cancelled')),
    meeting_url     TEXT,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_apt_patient ON appointments(patient_id, appointment_date);
CREATE INDEX idx_apt_doctor  ON appointments(doctor_id,  appointment_date);

-- ── MEDICAL HISTORY ──────────────────────────────────────────
CREATE TABLE medical_history (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    date            DATE NOT NULL,
    diagnosis       VARCHAR(255),
    doctor_name     VARCHAR(255),
    hospital        VARCHAR(255),
    treatment       TEXT,
    prescription_id UUID,
    status          VARCHAR(30) DEFAULT 'Active',
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── LAB REPORTS ──────────────────────────────────────────────
CREATE TABLE lab_reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    lab_name        VARCHAR(255),
    date            DATE,
    status          VARCHAR(30) DEFAULT 'Normal',
    file_url        TEXT,
    ai_analysis     TEXT,
    uploaded_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── MEDICATIONS ──────────────────────────────────────────────
CREATE TABLE medications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    dose            VARCHAR(100),
    frequency       VARCHAR(100),
    times           TEXT[],
    start_date      DATE,
    end_date        DATE,
    is_active       BOOLEAN DEFAULT TRUE,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE medication_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medication_id   UUID REFERENCES medications(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    scheduled_time  TIMESTAMPTZ,
    taken_at        TIMESTAMPTZ,
    status          VARCHAR(20) DEFAULT 'pending'
                    CHECK (status IN ('taken','missed','pending','skipped'))
);

-- ── CHAT SESSIONS ────────────────────────────────────────────
CREATE TABLE chat_sessions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(255),
    model_used      VARCHAR(50) DEFAULT 'claude',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id      UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role            VARCHAR(10) CHECK (role IN ('user','assistant')),
    content         TEXT NOT NULL,
    tokens_used     INT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_chat_session ON chat_messages(session_id, created_at);

-- ── NOTIFICATIONS ────────────────────────────────────────────
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    type            VARCHAR(50),  -- appointment, medication, report, system
    title           VARCHAR(255),
    body            TEXT,
    is_read         BOOLEAN DEFAULT FALSE,
    action_url      TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notif_user ON notifications(user_id, is_read, created_at DESC);

-- ── AUDIT LOG ────────────────────────────────────────────────
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id),
    action          VARCHAR(100),
    resource        VARCHAR(100),
    resource_id     VARCHAR(255),
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── SEED DATA ────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, is_verified)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'patient@mediai.com',
   'demo:8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
   'GANESH','SHANKAR','patient', TRUE, TRUE),
  ('00000000-0000-0000-0000-000000000002', 'doctor@mediai.com',
   'demo:8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
   'Raj','Kumar','doctor', TRUE, TRUE),
  ('00000000-0000-0000-0000-000000000003', 'admin@mediai.com',
   'demo:8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
   'Admin','User','admin', TRUE, TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO patient_profiles (user_id, date_of_birth, gender, blood_type, height_cm, weight_kg, allergies, existing_conditions)
VALUES ('00000000-0000-0000-0000-000000000001', '1990-03-15', 'male', 'O+', 175, 68,
        ARRAY['Penicillin'], ARRAY['Mild Hypertension'])
ON CONFLICT DO NOTHING;
