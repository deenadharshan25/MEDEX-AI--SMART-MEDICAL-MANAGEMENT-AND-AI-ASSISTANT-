/* ============================================================
   MediAI — Complete Application JavaScript
   ============================================================ */

// ---- State Management ----
const State = {
  theme: localStorage.getItem('medai-theme') || 'light',
  currentPage: 'landing',
  currentUser: null,
  isAuthenticated: false,
  sidebarOpen: false,
  role: 'patient',
  selectedSymptoms: [],
  chatMessages: [],
  bmiResult: null,
  charts: {},
  isVoiceListening: false,
  ttsEnabled: true,
  speechRecognition: null,
};

// ---- Router ----
const pages = ['landing','login','register','forgot-password',
  'dashboard','symptom-checker','disease-prediction','ai-chat',
  'medical-history','bmi-calculator','appointments','analytics',
  'medication','lab-reports','settings',
  'doctor-dashboard','admin-dashboard'];

function navigate(page, opts = {}) {
  State.currentPage = page;
  render();
  window.scrollTo(0, 0);
}

// ---- Theme ----
function applyTheme(theme) {
  State.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('medai-theme', theme);
}
applyTheme(State.theme);

// ---- Render ----
function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const navbar = renderNavbar();
  app.appendChild(navbar);

  if (State.currentPage === 'landing') {
    app.appendChild(renderLanding());
  } else if (['login','register','forgot-password'].includes(State.currentPage)) {
    app.appendChild(renderAuth());
  } else if (State.currentPage === 'doctor-dashboard') {
    app.appendChild(renderDashboardLayout(renderDoctorDashboard()));
  } else if (State.currentPage === 'admin-dashboard') {
    app.appendChild(renderDashboardLayout(renderAdminDashboard()));
  } else if (State.currentPage === 'symptom-checker') {
    app.appendChild(renderDashboardLayout(renderSymptomChecker()));
  } else if (State.currentPage === 'disease-prediction') {
    app.appendChild(renderDashboardLayout(renderDiseasePrediction()));
  } else if (State.currentPage === 'ai-chat') {
    app.appendChild(renderDashboardLayout(renderAIChat()));
  } else if (State.currentPage === 'medical-history') {
    app.appendChild(renderDashboardLayout(renderMedicalHistory()));
  } else if (State.currentPage === 'bmi-calculator') {
    app.appendChild(renderDashboardLayout(renderBMICalc()));
  } else if (State.currentPage === 'appointments') {
    app.appendChild(renderDashboardLayout(renderAppointments()));
  } else if (State.currentPage === 'analytics') {
    app.appendChild(renderDashboardLayout(renderAnalytics()));
  } else if (State.currentPage === 'medication') {
    app.appendChild(renderDashboardLayout(renderMedication()));
  } else if (State.currentPage === 'lab-reports') {
    app.appendChild(renderDashboardLayout(renderLabReports()));
  } else if (State.currentPage === 'settings') {
    app.appendChild(renderDashboardLayout(renderSettings()));
  } else {
    app.appendChild(renderDashboardLayout(renderPatientDashboard()));
  }

  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  toastContainer.id = 'toast-container';
  app.appendChild(toastContainer);

  bindEvents();
  setTimeout(postRender, 50);
}

// ---- Post Render (charts, animations) ----
function postRender() {
  if (State.currentPage === 'analytics') initCharts();
  if (State.currentPage === 'dashboard') initHealthRing();
  if (State.currentPage === 'bmi-calculator') initBMI();
  if (State.currentPage === 'symptom-checker') initSymptomChecker();
  if (State.currentPage === 'ai-chat') initChat();
  if (State.currentPage === 'disease-prediction') initDiseasePrediction();
}

// ============================================================
// NAVBAR
// ============================================================
function renderNavbar() {
  const nav = document.createElement('nav');
  nav.id = 'navbar';
  const isAuth = State.isAuthenticated;
  nav.innerHTML = `
    <div class="nav-brand" onclick="navigate('landing')" style="cursor:pointer">
      🏥 Medi<span>AI</span>
    </div>
    <div class="nav-links" id="nav-links">
      ${!isAuth ? `
        <a href="#features" onclick="smoothScroll('features')">Features</a>
        <a href="#how" onclick="smoothScroll('how')">How It Works</a>
        <a href="#faq" onclick="smoothScroll('faq')">FAQ</a>
        <a href="#contact" onclick="smoothScroll('contact')">Contact</a>
      ` : `
        <a onclick="navigate('dashboard')" style="cursor:pointer">Dashboard</a>
        <a onclick="navigate('symptom-checker')" style="cursor:pointer">Symptom Checker</a>
        <a onclick="navigate('ai-chat')" style="cursor:pointer">AI Chat</a>
      `}
    </div>
    <div class="nav-actions">
      <button class="theme-toggle" id="theme-toggle" title="Toggle theme">
        ${State.theme === 'dark' ? '☀️' : '🌙'}
      </button>
      ${!isAuth ? `
        <button class="btn btn-secondary btn-sm" onclick="navigate('login')">Login</button>
        <button class="btn btn-primary btn-sm" onclick="navigate('register')">Get Started</button>
      ` : `
        <button class="btn btn-secondary btn-sm" onclick="logout()">Logout</button>
      `}
      <button class="hamburger" id="hamburger">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;
  return nav;
}

// ============================================================
// LANDING PAGE
// ============================================================
function renderLanding() {
  const el = document.createElement('div');
  el.id = 'page-landing';
  el.innerHTML = `
    <!-- HERO -->
    <section class="hero">
      <div class="hero-blobs">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
      </div>
      <div class="hero-content">
        <div class="hero-text">
          <div class="hero-eyebrow">✨ AI-Powered Healthcare Platform</div>
          <h1 class="hero-title">AI Powered Intelligent Medical Diagnosis System</h1>
          <p class="hero-subtitle">Predict diseases early using Artificial Intelligence, symptom analysis, and machine learning. Get personalized health insights instantly.</p>
          <div class="hero-cta">
            <button class="btn btn-primary btn-lg" onclick="navigate('register')">
              🚀 Get Started Free
            </button>
            <button class="btn btn-secondary btn-lg" onclick="smoothScroll('how')">
              ▶ See How It Works
            </button>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><strong>98.5%</strong><span>Accuracy Rate</span></div>
            <div class="hero-stat"><strong>50K+</strong><span>Diagnoses Made</span></div>
            <div class="hero-stat"><strong>200+</strong><span>Diseases Covered</span></div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-illustration">
            <div class="hero-illustration-inner">🫀</div>
            <div class="hero-floating-card card-top">💊 AI Diagnosis Ready</div>
            <div class="hero-floating-card card-mid">📊 98.5% Accurate</div>
            <div class="hero-floating-card card-bottom">🩺 24/7 Available</div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <div id="features" style="background: var(--bg-secondary); padding: 1px 0;">
    <div class="section">
      <div class="section-header">
        <div class="section-eyebrow">✦ Features</div>
        <h2 class="section-title">Everything You Need for Smart Healthcare</h2>
        <p class="section-subtitle">A comprehensive AI-powered platform that puts your health data at your fingertips.</p>
      </div>
      <div class="features-grid">
        <div class="glass-card feature-card span-2">
          <span class="feature-icon">🧠</span>
          <h3>AI Symptom Checker</h3>
          <p>Enter your symptoms and get instant AI-powered analysis. Our model evaluates 200+ diseases with confidence scores, risk levels, and detailed recommendations.</p>
          <div class="feature-tag"><span class="badge badge-blue">Most Popular</span></div>
        </div>
        <div class="glass-card feature-card">
          <span class="feature-icon">📊</span>
          <h3>Disease Prediction</h3>
          <p>ML models predict diabetes, heart disease, kidney disease, and more with high accuracy.</p>
        </div>
        <div class="glass-card feature-card">
          <span class="feature-icon">💬</span>
          <h3>AI Health Assistant</h3>
          <p>Chat with our intelligent AI assistant for medical advice, diet tips, and lifestyle guidance.</p>
        </div>
        <div class="glass-card feature-card">
          <span class="feature-icon">📋</span>
          <h3>Medical History</h3>
          <p>Track all your diagnoses, lab reports, prescriptions, and health records in one place.</p>
        </div>
        <div class="glass-card feature-card span-2">
          <span class="feature-icon">📈</span>
          <h3>Health Analytics & Insights</h3>
          <p>Beautiful interactive charts showing your health trends, appointment history, BMI progression, and predictive health score over time.</p>
          <div class="feature-tag"><span class="badge badge-green">Interactive</span></div>
        </div>
        <div class="glass-card feature-card">
          <span class="feature-icon">🔔</span>
          <h3>Medication Reminders</h3>
          <p>Never miss a dose. Set smart reminders for all your medications and supplements.</p>
        </div>
        <div class="glass-card feature-card">
          <span class="feature-icon">👨‍⚕️</span>
          <h3>Doctor Connect</h3>
          <p>Book appointments, get prescriptions, and communicate with verified doctors.</p>
        </div>
        <div class="glass-card feature-card">
          <span class="feature-icon">🔒</span>
          <h3>Secure & Private</h3>
          <p>HIPAA-compliant, end-to-end encrypted. Your health data stays private and secure.</p>
        </div>
      </div>
    </div>
    </div>

    <!-- HOW IT WORKS -->
    <div id="how" style="padding: 1px 0;">
    <div class="section">
      <div class="section-header">
        <div class="section-eyebrow">✦ Process</div>
        <h2 class="section-title">How MediAI Works</h2>
        <p class="section-subtitle">Get your health analysis in four simple steps</p>
      </div>
      <div class="how-grid">
        <div class="how-step">
          <div class="how-number">1</div>
          <h3>Create Account</h3>
          <p>Sign up in seconds and set up your health profile with basic information.</p>
        </div>
        <div class="how-step">
          <div class="how-number">2</div>
          <h3>Enter Symptoms</h3>
          <p>Use our intelligent symptom checker to input your symptoms, vitals, and health history.</p>
        </div>
        <div class="how-step">
          <div class="how-number">3</div>
          <h3>AI Analysis</h3>
          <p>Our ML models analyze your data using Random Forest, XGBoost, and Neural Networks.</p>
        </div>
        <div class="how-step">
          <div class="how-number">4</div>
          <h3>Get Results</h3>
          <p>Receive detailed disease predictions, risk assessment, and personalized recommendations.</p>
        </div>
      </div>
    </div>
    </div>

    <!-- TESTIMONIALS -->
    <div style="background: var(--bg-secondary); padding: 1px 0;">
    <div class="section">
      <div class="section-header">
        <div class="section-eyebrow">✦ Testimonials</div>
        <h2 class="section-title">What Our Users Say</h2>
      </div>
      <div class="testimonials-grid">
        <div class="glass-card testimonial-card">
          <div class="testimonial-stars">★★★★★</div>
          <p>"MediAI detected early signs of pre-diabetes that I completely overlooked. The detailed recommendations helped me change my lifestyle before it became serious."</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">SK</div>
            <div><strong>Sarah K.</strong><span>Patient, Age 34</span></div>
          </div>
        </div>
        <div class="glass-card testimonial-card">
          <div class="testimonial-stars">★★★★★</div>
          <p>"As a doctor, I use MediAI to get a second opinion on complex cases. The AI analysis is surprisingly accurate and the confidence scores help me understand the reasoning."</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">DR</div>
            <div><strong>Dr. Raj M.</strong><span>Cardiologist</span></div>
          </div>
        </div>
        <div class="glass-card testimonial-card">
          <div class="testimonial-stars">★★★★☆</div>
          <p>"The medication reminder feature is a game changer. I haven't missed a dose in 3 months and my blood pressure has significantly improved."</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">JP</div>
            <div><strong>James P.</strong><span>Patient, Age 58</span></div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- FAQ -->
    <div id="faq" style="padding: 1px 0;">
    <div class="section">
      <div class="section-header">
        <div class="section-eyebrow">✦ FAQ</div>
        <h2 class="section-title">Frequently Asked Questions</h2>
      </div>
      <div class="faq-list" id="faq-list">
        ${[
          ['Is MediAI a replacement for a real doctor?', 'No. MediAI is an educational and research tool designed to provide preliminary health insights. Always consult a qualified healthcare professional for medical advice, diagnosis, and treatment.'],
          ['How accurate are the disease predictions?', 'Our AI models achieve 92-98% accuracy on test datasets for specific conditions like diabetes and heart disease. However, accuracy varies by condition and the information provided.'],
          ['Is my health data secure?', 'Yes. We use end-to-end encryption, JWT authentication, and HIPAA-compliant data storage. Your data is never sold to third parties.'],
          ['What diseases can MediAI detect?', 'MediAI supports prediction for diabetes, heart disease, kidney disease, liver disease, pneumonia, stroke risk, hypertension, asthma, thyroid disorders, skin diseases, and general symptom analysis.'],
          ['Can I use MediAI on my phone?', 'Yes! MediAI is fully responsive and works perfectly on mobile devices, tablets, and desktops.'],
          ['Is there a free plan?', 'Yes, basic symptom checking and AI chat are available free. Premium plans include advanced predictions, doctor consultations, and detailed analytics.'],
        ].map(([q,a]) => `
          <div class="faq-item glass-card" style="border-radius:14px;padding:0">
            <button class="faq-question" onclick="toggleFAQ(this)">
              <span>${q}</span>
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-answer">${a}</div>
          </div>
        `).join('')}
      </div>
    </div>
    </div>

    <!-- CONTACT -->
    <div id="contact" style="background: var(--bg-secondary); padding: 1px 0;">
    <div class="section">
      <div class="section-header">
        <div class="section-eyebrow">✦ Contact</div>
        <h2 class="section-title">Get In Touch</h2>
        <p class="section-subtitle">Have questions? We're here to help.</p>
      </div>
      <div class="contact-grid">
        <div>
          <div class="contact-info">
            <div class="contact-item">
              <div class="contact-icon">📧</div>
              <div><strong>Email</strong><p style="margin:0;font-size:.875rem">support@mediai.health</p></div>
            </div>
            <div class="contact-item">
              <div class="contact-icon">📞</div>
              <div><strong>Phone</strong><p style="margin:0;font-size:.875rem">+1 (800) MEDIAI-1</p></div>
            </div>
            <div class="contact-item">
              <div class="contact-icon">🕐</div>
              <div><strong>Available</strong><p style="margin:0;font-size:.875rem">24/7 AI Support, Mon-Fri Human Support</p></div>
            </div>
          </div>
        </div>
        <div class="glass-card" style="padding:2rem">
          <div class="contact-form">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input class="form-input" placeholder="Your name" type="text"/>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input class="form-input" placeholder="your@email.com" type="email"/>
            </div>
            <div class="form-group">
              <label class="form-label">Message</label>
              <textarea class="form-textarea" placeholder="How can we help?"></textarea>
            </div>
            <button class="btn btn-primary w-full" onclick="showToast('Message sent! We will reply within 24 hours.','success')">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- FOOTER -->
    <footer id="footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="nav-brand">🏥 Medi<span>AI</span></div>
          <p>AI-powered medical diagnosis for educational and research purposes. Not a substitute for professional medical advice.</p>
        </div>
        <div class="footer-col">
          <h4>Product</h4>
          <ul>
            <li><a onclick="navigate('register')">Get Started</a></li>
            <li><a onclick="smoothScroll('features')">Features</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">API</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Careers</a></li>
            <li><a onclick="smoothScroll('contact')">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">HIPAA Compliance</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 MediAI. All rights reserved. For educational purposes only.</p>
        <p style="font-size:.75rem;color:var(--text-muted)">⚠️ Not a substitute for professional medical advice.</p>
      </div>
    </footer>
  `;
  return el;
}

// ============================================================
// AUTH PAGES
// ============================================================
function renderAuth() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="auth-page">
      <div class="hero-blobs">
        <div class="blob blob-1" style="opacity:.2"></div>
        <div class="blob blob-2" style="opacity:.2"></div>
      </div>
      <div class="glass-card auth-card">
        ${State.currentPage === 'login' ? renderLogin() :
          State.currentPage === 'register' ? renderRegister() :
          renderForgotPassword()}
      </div>
    </div>
  `;
  return el;
}

function renderLogin() {
  return `
    <div class="auth-logo">
      <span class="logo-icon">🏥</span>
      <h2>Welcome Back</h2>
      <p>Sign in to your MediAI account</p>
    </div>
    <div class="auth-form">
      <div class="form-group">
        <label class="form-label">Email Address</label>
        <input class="form-input" id="login-email" type="email" placeholder="doctor@hospital.com" value="patient@mediai.com"/>
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <div class="password-wrapper">
          <input class="form-input" id="login-password" type="password" placeholder="••••••••" value="password123"/>
          <button class="password-toggle" onclick="togglePassword('login-password')">👁</button>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <label class="checkbox-label"><input type="checkbox" checked/> Remember me</label>
        <a onclick="navigate('forgot-password')" style="font-size:.875rem;cursor:pointer">Forgot password?</a>
      </div>
      <button class="btn btn-primary w-full" style="padding:.875rem" onclick="doLogin()">
        Sign In
      </button>
      <div>
        <p style="font-size:.75rem;text-align:center;color:var(--text-muted);margin-bottom:.5rem">Demo accounts:</p>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.4rem">
          <button class="btn btn-secondary btn-sm" onclick="loginAs('patient')">👤 Patient</button>
          <button class="btn btn-secondary btn-sm" onclick="loginAs('doctor')">👨‍⚕️ Doctor</button>
          <button class="btn btn-secondary btn-sm" onclick="loginAs('admin')">🔧 Admin</button>
        </div>
      </div>
    </div>
    <div class="auth-switch">Don't have an account? <a onclick="navigate('register')" style="cursor:pointer;font-weight:600">Sign Up Free</a></div>
  `;
}

function renderRegister() {
  return `
    <div class="auth-logo">
      <span class="logo-icon">🏥</span>
      <h2>Create Account</h2>
      <p>Join MediAI for free today</p>
    </div>
    <div class="auth-form">
      <div class="form-group">
        <label class="form-label">Account Type</label>
        <div class="role-selector">
          <div class="role-option selected" onclick="selectRole(this,'patient')">
            <span class="role-icon">👤</span>Patient
          </div>
          <div class="role-option" onclick="selectRole(this,'doctor')">
            <span class="role-icon">👨‍⚕️</span>Doctor
          </div>
          <div class="role-option" onclick="selectRole(this,'admin')">
            <span class="role-icon">🔧</span>Admin
          </div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div class="form-group">
          <label class="form-label">First Name</label>
          <input class="form-input" id="reg-fname" type="text" placeholder="John"/>
        </div>
        <div class="form-group">
          <label class="form-label">Last Name</label>
          <input class="form-input" id="reg-lname" type="text" placeholder="Doe"/>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input class="form-input" id="reg-email" type="email" placeholder="john@example.com"/>
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <div class="password-wrapper">
          <input class="form-input" id="reg-pass" type="password" placeholder="Min 8 characters"/>
          <button class="password-toggle" onclick="togglePassword('reg-pass')">👁</button>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Date of Birth</label>
        <input class="form-input" id="reg-dob" type="date"/>
      </div>
      <label class="checkbox-label">
        <input type="checkbox" checked/>
        I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
      </label>
      <button class="btn btn-primary w-full" style="padding:.875rem" onclick="doRegister()">
        Create Account
      </button>
    </div>
    <div class="auth-switch">Already have an account? <a onclick="navigate('login')" style="cursor:pointer;font-weight:600">Sign In</a></div>
  `;
}

function renderForgotPassword() {
  return `
    <div class="auth-logo">
      <span class="logo-icon">🔐</span>
      <h2>Reset Password</h2>
      <p>We'll send you a reset link</p>
    </div>
    <div class="auth-form">
      <div class="form-group">
        <label class="form-label">Email Address</label>
        <input class="form-input" type="email" placeholder="your@email.com"/>
      </div>
      <button class="btn btn-primary w-full" style="padding:.875rem" onclick="showToast('Reset link sent to your email!','success')">
        Send Reset Link
      </button>
    </div>
    <div class="auth-switch"><a onclick="navigate('login')" style="cursor:pointer;font-weight:600">← Back to Login</a></div>
  `;
}

// ============================================================
// DASHBOARD LAYOUT
// ============================================================
function renderDashboardLayout(content) {
  const el = document.createElement('div');
  el.id = 'dashboard-layout';

  const nav = getSidebarNav();
  el.innerHTML = `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-user">
          <div class="user-avatar">${State.role === 'doctor' ? '👨‍⚕️' : State.role === 'admin' ? '🔧' : '👤'}</div>
          <div class="user-info">
            <strong>${State.role === 'doctor' ? 'Dr. Smith' : State.role === 'admin' ? 'Admin User' : 'John Doe'}</strong>
            <span>${State.role === 'doctor' ? 'Cardiologist' : State.role === 'admin' ? 'System Admin' : 'Patient'}</span>
          </div>
        </div>
      </div>
      <nav class="sidebar-nav">${nav}</nav>
      <div class="sidebar-footer">
        <button class="nav-item w-full" onclick="logout()">
          <span class="nav-icon">🚪</span> Logout
        </button>
      </div>
    </aside>
    <main class="main-content" id="main-content"></main>
  `;

  el.querySelector('#main-content').appendChild(content);
  return el;
}

function getSidebarNav() {
  const patientNav = [
    ['dashboard','🏠','Dashboard'],
    ['symptom-checker','🔍','Symptom Checker'],
    ['disease-prediction','🧬','Disease Prediction'],
    ['ai-chat','💬','AI Health Chat'],
    ['bmi-calculator','⚖️','BMI Calculator'],
    ['---','','Health Records'],
    ['medical-history','📋','Medical History'],
    ['lab-reports','🧪','Lab Reports'],
    ['medication','💊','Medications'],
    ['appointments','📅','Appointments'],
    ['---','','Insights'],
    ['analytics','📊','Health Analytics'],
    ['settings','⚙️','Settings'],
  ];
  const doctorNav = [
    ['doctor-dashboard','🏠','Dashboard'],
    ['appointments','📅','Appointments'],
    ['ai-chat','💬','AI Assistant'],
    ['analytics','📊','Analytics'],
    ['settings','⚙️','Settings'],
  ];
  const adminNav = [
    ['admin-dashboard','🏠','Dashboard'],
    ['analytics','📊','Analytics'],
    ['settings','⚙️','Settings'],
  ];

  const items = State.role === 'doctor' ? doctorNav : State.role === 'admin' ? adminNav : patientNav;
  return items.map(([page, icon, label]) => {
    if (page === '---') return `<div class="nav-section-label">${label}</div>`;
    return `<button class="nav-item ${State.currentPage === page ? 'active' : ''}" onclick="navigate('${page}')">
      <span class="nav-icon">${icon}</span> ${label}
      ${page === 'ai-chat' ? '<span class="nav-badge"><span class="badge badge-blue">New</span></span>' : ''}
    </button>`;
  }).join('');
}

// ============================================================
// PATIENT DASHBOARD
// ============================================================
function renderPatientDashboard() {
  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    <div class="page-header">
      <div class="breadcrumb"><a onclick="navigate('dashboard')">Home</a> <span>/</span> <span>Dashboard</span></div>
      <h2>Good Morning, John! 👋</h2>
      <p>Here's your health summary for today — ${new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>
    </div>

    <div class="disclaimer">
      <span class="disclaimer-icon">⚠️</span>
      <span>This AI system is designed for <strong>educational and research purposes only</strong>. It does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.</span>
    </div>

    <div class="stats-grid">
      <div class="glass-card stat-card">
        <div class="stat-icon blue">❤️</div>
        <div class="stat-info"><strong>87</strong><span>Health Score</span><div class="stat-change up">↑ +3 this week</div></div>
      </div>
      <div class="glass-card stat-card">
        <div class="stat-icon green">🩺</div>
        <div class="stat-info"><strong>12</strong><span>Diagnoses Done</span><div class="stat-change up">↑ 2 new</div></div>
      </div>
      <div class="glass-card stat-card">
        <div class="stat-icon cyan">📅</div>
        <div class="stat-info"><strong>3</strong><span>Upcoming Appointments</span><div class="stat-change">This week</div></div>
      </div>
      <div class="glass-card stat-card">
        <div class="stat-icon orange">💊</div>
        <div class="stat-info"><strong>5</strong><span>Active Medications</span><div class="stat-change down">2 due today</div></div>
      </div>
    </div>

    <div class="dashboard-bento">
      <!-- Health Score -->
      <div class="glass-card bento-card">
        <div class="card-header">
          <h3>❤️ Health Score</h3>
          <span class="badge badge-green">Good</span>
        </div>
        <div class="health-score-ring">
          <div class="ring-container">
            <svg class="ring-svg" viewBox="0 0 120 120">
              <circle class="ring-bg" cx="60" cy="60" r="50"/>
              <circle class="ring-progress" cx="60" cy="60" r="50"
                stroke="url(#ringGrad)"
                stroke-dasharray="314"
                stroke-dashoffset="40"
                id="health-ring"/>
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#2563eb"/>
                  <stop offset="100%" style="stop-color:#06b6d4"/>
                </linearGradient>
              </defs>
            </svg>
            <div class="ring-value">87</div>
          </div>
          <div class="health-score-label">out of 100<br><span class="badge badge-green" style="margin-top:.4rem">Healthy</span></div>
        </div>
        <ul class="health-tips" style="margin-top:1rem">
          <li>✅ Blood pressure normal</li>
          <li>✅ BMI in healthy range</li>
          <li>⚠️ Cholesterol slightly elevated</li>
          <li>✅ Sugar levels normal</li>
        </ul>
      </div>

      <!-- Quick Actions -->
      <div class="glass-card bento-card">
        <h3>⚡ Quick Actions</h3>
        <div class="quick-actions">
          <div class="quick-action" onclick="navigate('symptom-checker')">
            <span class="qa-icon">🔍</span><span>Check Symptoms</span>
          </div>
          <div class="quick-action" onclick="navigate('disease-prediction')">
            <span class="qa-icon">🧬</span><span>Disease Predict</span>
          </div>
          <div class="quick-action" onclick="navigate('ai-chat')">
            <span class="qa-icon">💬</span><span>Ask AI Doctor</span>
          </div>
          <div class="quick-action" onclick="navigate('bmi-calculator')">
            <span class="qa-icon">⚖️</span><span>BMI Check</span>
          </div>
          <div class="quick-action" onclick="navigate('appointments')">
            <span class="qa-icon">📅</span><span>Book Appointment</span>
          </div>
          <div class="quick-action" onclick="navigate('lab-reports')">
            <span class="qa-icon">🧪</span><span>Lab Reports</span>
          </div>
        </div>
      </div>

      <!-- Upcoming Appointments -->
      <div class="glass-card bento-card">
        <div class="card-header">
          <h3>📅 Appointments</h3>
          <button class="btn btn-primary btn-sm" onclick="navigate('appointments')">+ Book</button>
        </div>
        <div class="appointments-list">
          ${[
            ['15','Aug','Dr. Raj Kumar','Cardiologist','10:30 AM'],
            ['18','Aug','Dr. Sarah Lee','Endocrinologist','2:00 PM'],
            ['22','Aug','Dr. James Wilson','General Physician','11:00 AM'],
          ].map(([d,m,doc,spec,time]) => `
            <div class="appointment-item">
              <div class="appt-date"><strong>${d}</strong><span>${m}</span></div>
              <div class="appt-info"><strong>${doc}</strong><span>${spec} • ${time}</span></div>
              <span class="badge badge-blue">Confirmed</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="glass-card bento-card span-2">
        <div class="card-header">
          <h3>🕐 Recent Activity</h3>
          <button class="btn btn-secondary btn-sm">View All</button>
        </div>
        <div class="activity-list">
          ${[
            ['blue','Symptom check completed','AI predicted possible seasonal allergy','2 hours ago'],
            ['green','Lab report uploaded','Blood test results from City Hospital','Yesterday'],
            ['orange','Medication reminder','Metformin 500mg — Morning dose due','Yesterday'],
            ['cyan','BMI updated','BMI: 22.4 — Normal range','3 days ago'],
            ['green','Appointment confirmed','Dr. Raj Kumar on Aug 15','5 days ago'],
          ].map(([color,title,desc,time]) => `
            <div class="activity-item">
              <div class="activity-dot ${color}"></div>
              <div class="activity-content"><strong>${title}</strong><span>${desc}</span></div>
              <div class="activity-time">${time}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Vitals -->
      <div class="glass-card bento-card">
        <h3>🩺 Vitals Overview</h3>
        <div style="display:flex;flex-direction:column;gap:.875rem;margin-top:.5rem">
          ${[
            ['💓','Heart Rate','72 bpm','Normal','green'],
            ['🩸','Blood Pressure','118/78 mmHg','Normal','green'],
            ['🌡️','Temperature','98.6°F','Normal','green'],
            ['💉','Blood Sugar','95 mg/dL','Normal','green'],
            ['⚖️','BMI','22.4','Normal','green'],
            ['🫁','SpO2','98%','Normal','green'],
          ].map(([icon,name,value,status,color]) => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:.6rem .875rem;background:var(--bg-glass);border:1px solid var(--border);border-radius:10px">
              <span style="font-size:.9rem">${icon} <span style="font-size:.82rem;font-weight:600;color:var(--text-primary)">${name}</span></span>
              <span style="font-size:.82rem;font-weight:700;color:var(--text-primary)">${value}</span>
              <span class="badge badge-${color}" style="font-size:.7rem">${status}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  return el;
}

// ============================================================
// SYMPTOM CHECKER
// ============================================================
const symptomList = ['Fever','Headache','Cough','Fatigue','Shortness of breath','Chest pain','Nausea','Vomiting','Dizziness','Back pain','Joint pain','Runny nose','Sore throat','Muscle pain','Abdominal pain','Loss of appetite','Night sweats','Rapid heartbeat','Swelling','Blurred vision'];

function renderSymptomChecker() {
  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    <div class="page-header">
      <h2>🔍 AI Symptom Checker</h2>
      <p>Describe your symptoms and get AI-powered health insights</p>
    </div>
    <div class="disclaimer">
      <span class="disclaimer-icon">⚠️</span>
      <span>For educational purposes only. Always consult a qualified healthcare provider for medical advice.</span>
    </div>
    <div class="progress-bar-outer">
      <div class="progress-bar-inner" id="symptom-progress" style="width:25%"></div>
    </div>
    <div class="glass-card" style="padding:2rem" id="symptom-container">
      <!-- Step 1 -->
      <div class="symptom-step active" id="step-1">
        <h3 style="margin-bottom:1.5rem">Step 1 of 4: Select Your Symptoms</h3>
        <div class="form-group" style="margin-bottom:1rem">
          <label class="form-label">Search & Add Symptoms</label>
          <input class="form-input" id="symptom-search" type="text" placeholder="Type a symptom (e.g. fever, headache)..."/>
        </div>
        <div class="symptom-suggestions" id="symptom-suggestions">
          ${symptomList.slice(0,10).map(s => `<button class="symptom-suggestion" onclick="addSymptom('${s}')">${s}</button>`).join('')}
        </div>
        <div style="margin-top:1.25rem">
          <label class="form-label" style="margin-bottom:.5rem">Selected Symptoms</label>
          <div class="symptom-tags-container" id="symptom-tags">
            <span style="color:var(--text-muted);font-size:.82rem;padding:.2rem">No symptoms selected yet. Click suggestions above or search.</span>
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;margin-top:1.5rem">
          <button class="btn btn-primary" onclick="nextStep(2)">Next: Personal Info →</button>
        </div>
      </div>

      <!-- Step 2 -->
      <div class="symptom-step" id="step-2">
        <h3 style="margin-bottom:1.5rem">Step 2 of 4: Personal Information</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group"><label class="form-label">Age</label><input class="form-input" type="number" placeholder="e.g. 35" min="1" max="120" value="35"/></div>
          <div class="form-group">
            <label class="form-label">Gender</label>
            <select class="form-select"><option>Male</option><option>Female</option><option>Other</option></select>
          </div>
          <div class="form-group"><label class="form-label">Weight (kg)</label><input class="form-input" type="number" placeholder="e.g. 70" value="70"/></div>
          <div class="form-group"><label class="form-label">Height (cm)</label><input class="form-input" type="number" placeholder="e.g. 170" value="170"/></div>
          <div class="form-group"><label class="form-label">Blood Pressure (systolic)</label><input class="form-input" type="number" placeholder="e.g. 120" value="120"/></div>
          <div class="form-group"><label class="form-label">Blood Sugar (mg/dL)</label><input class="form-input" type="number" placeholder="e.g. 95" value="95"/></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:1.5rem">
          <button class="btn btn-secondary" onclick="nextStep(1)">← Back</button>
          <button class="btn btn-primary" onclick="nextStep(3)">Next: Medical History →</button>
        </div>
      </div>

      <!-- Step 3 -->
      <div class="symptom-step" id="step-3">
        <h3 style="margin-bottom:1.5rem">Step 3 of 4: Medical History & Lifestyle</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem">
          <div class="form-group">
            <label class="form-label">Existing Conditions</label>
            <select class="form-select" multiple style="height:100px">
              <option>Diabetes</option><option>Hypertension</option><option>Asthma</option><option>Heart Disease</option><option>Thyroid</option><option>None</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Known Allergies</label>
            <input class="form-input" type="text" placeholder="e.g. Penicillin, Pollen"/>
          </div>
          <div class="form-group">
            <label class="form-label">Family History</label>
            <select class="form-select" multiple style="height:100px">
              <option>Diabetes</option><option>Cancer</option><option>Heart Disease</option><option>Hypertension</option><option>None</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Current Medications</label>
            <input class="form-input" type="text" placeholder="e.g. Metformin 500mg"/>
          </div>
        </div>
        <label class="form-label">Lifestyle</label>
        <div class="lifestyle-grid" style="margin-top:.5rem">
          ${[['🚬','Smoking'],['🍺','Alcohol'],['🏃','Exercise'],['😴','Good Sleep'],['🥗','Healthy Diet'],['💼','Stressful Job']].map(([i,l]) => `
            <div class="lifestyle-option" onclick="this.classList.toggle('selected')">
              <span class="lo-icon">${i}</span>${l}
            </div>
          `).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:1.5rem">
          <button class="btn btn-secondary" onclick="nextStep(2)">← Back</button>
          <button class="btn btn-primary" onclick="runAnalysis()">🧠 Analyze Symptoms →</button>
        </div>
      </div>

      <!-- Step 4 - Results -->
      <div class="symptom-step" id="step-4">
        <div id="analysis-loading" style="text-align:center;padding:3rem">
          <div style="font-size:3rem;margin-bottom:1rem;animation:blobFloat 1.5s infinite">🧠</div>
          <h3>AI Analyzing Your Symptoms...</h3>
          <p>Running through 200+ disease patterns</p>
          <div style="margin-top:1.5rem;height:4px;background:var(--gray-200);border-radius:2px;overflow:hidden">
            <div style="height:100%;background:var(--gradient-primary);border-radius:2px;animation:loadBar 2.5s ease forwards" id="load-bar"></div>
          </div>
          <style>@keyframes loadBar{0%{width:0}100%{width:100%}}</style>
        </div>
        <div id="analysis-results" class="hidden">
          <div class="result-hero">
            <div style="font-size:2.5rem;margin-bottom:.75rem">🩺</div>
            <h3>Analysis Complete</h3>
            <p>Based on your symptoms and health profile</p>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin:1.5rem 0">
            <div>
              <h4 style="margin-bottom:1rem;font-size:.95rem">🦠 Possible Conditions</h4>
              <div class="disease-cards" id="disease-results"></div>
            </div>
            <div>
              <h4 style="margin-bottom:1rem;font-size:.95rem">⚠️ Risk Level</h4>
              <div class="glass-card" style="padding:1.25rem;margin-bottom:1rem">
                <div style="display:flex;justify-content:space-between;margin-bottom:.5rem">
                  <span style="font-size:.85rem;font-weight:600">Overall Risk</span>
                  <span class="badge badge-orange">Moderate</span>
                </div>
                <div class="risk-bar"><div class="risk-marker" style="left:40%"></div></div>
                <div style="display:flex;justify-content:space-between;font-size:.7rem;color:var(--text-muted);margin-top:.5rem">
                  <span>Low</span><span>Moderate</span><span>High</span>
                </div>
              </div>
              <h4 style="margin-bottom:.75rem;font-size:.95rem">💡 AI Recommendations</h4>
              <div class="recommendation-list">
                <div class="rec-item"><span class="rec-icon">🩺</span><div class="rec-content"><strong>See a General Physician</strong><span>Schedule within 2-3 days based on symptoms</span></div></div>
                <div class="rec-item"><span class="rec-icon">💧</span><div class="rec-content"><strong>Stay Hydrated</strong><span>Drink 8-10 glasses of water daily</span></div></div>
                <div class="rec-item"><span class="rec-icon">😴</span><div class="rec-content"><strong>Rest Adequately</strong><span>Get 7-9 hours of sleep</span></div></div>
                <div class="rec-item"><span class="rec-icon">🌡️</span><div class="rec-content"><strong>Monitor Temperature</strong><span>Check every 4 hours if fever persists</span></div></div>
                <div class="rec-item"><span class="rec-icon">🚨</span><div class="rec-content"><strong>Emergency Warning Signs</strong><span>Seek immediate care if chest pain, difficulty breathing, or confusion occur</span></div></div>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
            <button class="btn btn-primary" onclick="showToast('Report saved to your medical history','success')">💾 Save Report</button>
            <button class="btn btn-secondary" onclick="showToast('PDF download starting...','info')">📄 Download PDF</button>
            <button class="btn btn-secondary" onclick="navigate('appointments')">📅 Book Appointment</button>
            <button class="btn btn-secondary" onclick="nextStep(1);resetAnalysis()">🔄 New Check</button>
          </div>
        </div>
      </div>
    </div>
  `;
  return el;
}

// ============================================================
// DISEASE PREDICTION
// ============================================================
function renderDiseasePrediction() {
  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    <div class="page-header">
      <h2>🧬 Disease Prediction Engine</h2>
      <p>ML-powered specific disease risk assessment</p>
    </div>
    <div class="disclaimer">
      <span class="disclaimer-icon">⚠️</span>
      <span>For educational purposes only. Not a substitute for professional medical diagnosis.</span>
    </div>
    <div class="tab-pills" style="margin-bottom:1.5rem" id="disease-tabs">
      ${['Diabetes','Heart Disease','Kidney Disease','Liver Disease','Hypertension','Stroke Risk','Thyroid'].map((d,i) => `
        <button class="tab-pill ${i===0?'active':''}" onclick="selectDiseaseTab(this,'${d}')">${d}</button>
      `).join('')}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem" id="disease-pred-content">
      <div class="glass-card" style="padding:1.75rem" id="disease-form-card">
        <h3 style="margin-bottom:1.5rem" id="disease-form-title">🩺 Diabetes Risk Assessment</h3>
        <div id="disease-form-fields">
          ${renderDiabetesForm()}
        </div>
        <button class="btn btn-primary w-full" style="margin-top:1.5rem" onclick="predictDisease()">
          🧠 Predict Risk
        </button>
      </div>
      <div class="glass-card" style="padding:1.75rem" id="disease-result-card">
        <h3 style="margin-bottom:1rem">📊 Prediction Result</h3>
        <div id="pred-empty" style="text-align:center;padding:3rem 1rem">
          <div style="font-size:4rem;margin-bottom:1rem">🔬</div>
          <p style="color:var(--text-muted)">Fill in your health data and click Predict Risk to see AI-powered results</p>
        </div>
        <div id="pred-result" class="hidden">
          <div style="text-align:center;padding:1.5rem;background:var(--gradient-card);border-radius:16px;border:1px solid var(--border);margin-bottom:1.5rem">
            <div id="pred-icon" style="font-size:3rem;margin-bottom:.75rem">🟡</div>
            <div id="pred-label" style="font-family:'Poppins',sans-serif;font-size:1.3rem;font-weight:800;margin-bottom:.3rem">Moderate Risk</div>
            <div id="pred-percent" style="font-size:2.5rem;font-weight:800;background:var(--gradient-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">42%</div>
            <p style="font-size:.8rem;color:var(--text-muted);margin-top:.25rem">Confidence Score: 89.4%</p>
          </div>
          <div style="margin-bottom:1.25rem">
            <div style="display:flex;justify-content:space-between;font-size:.8rem;margin-bottom:.4rem;font-weight:600">
              <span>Risk Probability</span><span id="conf-val">42%</span>
            </div>
            <div class="confidence-bar" style="height:10px;background:var(--gray-200);border-radius:5px">
              <div id="conf-fill" class="confidence-fill" style="width:0%;height:100%;border-radius:5px;background:linear-gradient(90deg,#10b981,#f59e0b,#ef4444)"></div>
            </div>
          </div>
          <div style="font-size:.85rem;font-weight:700;margin-bottom:.75rem">Key Risk Factors:</div>
          <div id="risk-factors" style="display:flex;flex-direction:column;gap:.5rem"></div>
          <div style="margin-top:1.25rem;padding:1rem;background:rgba(37,99,235,.06);border-radius:12px;border:1px solid rgba(37,99,235,.12)">
            <p style="font-size:.82rem;color:var(--text-secondary)"><strong>AI Recommendation:</strong> Schedule a consultation with an endocrinologist and follow up with HbA1c testing within 3 months.</p>
          </div>
        </div>
      </div>
    </div>
  `;
  return el;
}

function renderDiabetesForm() {
  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
      <div class="form-group"><label class="form-label">Age</label><input class="form-input" type="number" value="45" id="dp-age"/></div>
      <div class="form-group"><label class="form-label">Gender</label><select class="form-select"><option>Female</option><option>Male</option></select></div>
      <div class="form-group"><label class="form-label">Pregnancies</label><input class="form-input" type="number" value="2" id="dp-preg"/></div>
      <div class="form-group"><label class="form-label">Glucose (mg/dL)</label><input class="form-input" type="number" value="148" id="dp-glucose"/></div>
      <div class="form-group"><label class="form-label">Blood Pressure</label><input class="form-input" type="number" value="72" id="dp-bp"/></div>
      <div class="form-group"><label class="form-label">Skin Thickness</label><input class="form-input" type="number" value="35" id="dp-skin"/></div>
      <div class="form-group"><label class="form-label">Insulin</label><input class="form-input" type="number" value="0" id="dp-insulin"/></div>
      <div class="form-group"><label class="form-label">BMI</label><input class="form-input" type="number" step=".1" value="33.6" id="dp-bmi"/></div>
      <div class="form-group" style="grid-column:span 2"><label class="form-label">Diabetes Pedigree Function</label><input class="form-input" type="number" step=".001" value="0.627" id="dp-dpf"/></div>
    </div>
  `;
}

// ============================================================
// AI CHAT
// ============================================================
const chatHistoryItems = [
  'Headache & dizziness causes',
  'Diabetes diet plan',
  'Heart health tips',
  'Understanding lab results',
  'COVID-19 symptoms',
];

const aiResponses = {
  default: "I'm MediAI, your AI health assistant! I can help you understand symptoms, explain conditions, suggest lifestyle improvements, and answer health questions. However, please remember I'm not a substitute for professional medical advice. What would you like to know?",
  headache: "Headaches can have many causes including dehydration, tension, migraines, or high blood pressure. For tension headaches, try rest, hydration, and OTC pain relievers. If headaches are severe, frequent, or accompanied by vision changes, consult a doctor immediately.",
  diabetes: "Diabetes management involves monitoring blood sugar levels, taking prescribed medications, following a balanced diet low in simple carbohydrates, regular exercise, and regular medical check-ups. Key dietary advice: focus on whole grains, vegetables, lean proteins, and avoid sugary drinks.",
  heart: "Heart health tips: Exercise 150+ minutes per week, maintain a heart-healthy diet (low sodium, healthy fats, plenty of fruits/vegetables), don't smoke, limit alcohol, manage stress, monitor blood pressure and cholesterol, and maintain a healthy weight.",
  fever: "For fever management: rest, stay hydrated with water and clear fluids, use acetaminophen or ibuprofen as directed. Seek medical attention if fever exceeds 103°F (39.4°C), lasts more than 3 days, or is accompanied by severe symptoms.",
};

function renderAIChat() {
  const el = document.createElement('div');
  el.className = 'page';
  el.style.height = 'calc(100vh - 130px)';
  el.style.display = 'flex';
  el.style.flexDirection = 'column';
  el.innerHTML = `
    <div class="page-header" style="margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem">
      <div>
        <h2>💬 AI Health Assistant</h2>
        <p>Ask me anything about your health — available 24/7</p>
      </div>
      <div style="display:flex;gap:0.5rem;align-items:center">
        <span class="rag-badge">⚡ RAG Medical KB Active</span>
        <span class="badge badge-green">🏥 Patient EHR Connected</span>
      </div>
    </div>
    <div class="chat-layout" style="flex:1;min-height:0">
      <div class="glass-card chat-sidebar" style="padding:1.25rem;display:flex;flex-direction:column;gap:1rem">
        <button class="btn btn-primary w-full btn-sm" onclick="clearChat()">+ New Chat</button>
        <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);margin-top:0.25rem">QUICK COMMANDS</div>
        <div style="display:flex;flex-direction:column;gap:0.4rem">
          <button class="command-pill" onclick="insertCommand('/vitals')">📊 /vitals — Patient Vitals</button>
          <button class="command-pill" onclick="insertCommand('/prescriptions')">💊 /prescriptions — Active Drugs</button>
          <button class="command-pill" onclick="insertCommand('/appointments')">📅 /appointments — Doctor Visits</button>
          <button class="command-pill" onclick="insertCommand('/rag-info')">🧠 /rag-info — Knowledge Base</button>
        </div>
        <div style="font-size:0.78rem;font-weight:700;color:var(--text-muted);margin-top:0.5rem">RECENT CHATS</div>
        <div class="chat-history-list">
          ${chatHistoryItems.map((item, i) => `
            <div class="chat-history-item ${i===0?'active':''}" onclick="loadChatHistory('${item}')">
              💬 ${item}
            </div>
          `).join('')}
        </div>
        <div style="padding:0.75rem;background:var(--bg-glass);border:1px solid var(--border);border-radius:12px;font-size:.75rem;color:var(--text-muted)">
          🔒 RAG Grounded: Context is verified against clinical guidelines to prevent hallucinations.
        </div>
      </div>
      <div class="glass-card chat-main" style="display:flex;flex-direction:column;overflow:hidden">
        <div style="padding:1rem 1.5rem;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:.75rem">
          <div style="width:36px;height:36px;border-radius:10px;background:var(--gradient-primary);display:flex;align-items:center;justify-content:center;font-size:1.1rem">🤖</div>
          <div>
            <strong style="font-size:.875rem">MediAI Assistant</strong>
            <div style="font-size:.75rem;color:var(--emerald-500);display:flex;align-items:center;gap:0.3rem">
              <span>● Online (Streaming)</span>
            </div>
          </div>
          <div style="margin-left:auto;display:flex;gap:.5rem;align-items:center">
            <button class="btn btn-secondary btn-sm" id="tts-toggle-btn" onclick="toggleTTS()" title="Toggle voice speech output">
              ${State.ttsEnabled ? '🔊 Voice On' : '🔇 Muted'}
            </button>
            <button class="btn btn-secondary btn-sm ${State.isVoiceListening ? 'voice-active' : ''}" id="voice-mic-btn" onclick="toggleVoice()" title="Click to speak">
              🎤 ${State.isVoiceListening ? 'Listening...' : 'Voice Mic'}
            </button>
            <button class="btn btn-secondary btn-sm" onclick="showToast('Chat history cleared','info');clearChat()">🗑️</button>
          </div>
        </div>
        <div class="chat-messages" id="chat-messages">
          <div class="chat-bubble ai">
            <div class="bubble-content">👋 Hello John! I'm MediAI, your AI health assistant powered by **RAG (Retrieval-Augmented Generation)** and connected directly to your **Hospital EHR Record**.<br><br>I have access to your health profile, blood pressure records, and active medications. How can I help you today?</div>
            <div class="bubble-time">Now</div>
          </div>
        </div>
        <div class="chat-suggestions" id="chat-suggestions">
          ${['What causes headaches?','How to manage diabetes?','Heart health tips','Explain my blood test','/vitals','/prescriptions'].map(s => `
            <button class="chat-suggestion" onclick="sendSuggestion('${s}')">${s}</button>
          `).join('')}
        </div>
        <div class="chat-input-area">
          <div class="chat-input-wrapper" style="position:relative">
            <input class="chat-input" id="chat-input" placeholder="Ask a health question or type / for commands..." onkeydown="if(event.key==='Enter')sendMessage()"/>
          </div>
          <button class="btn btn-icon btn-secondary ${State.isVoiceListening ? 'voice-active' : ''}" id="mic-input-btn" onclick="toggleVoice()" title="Voice input (Sound-to-Text)">🎤</button>
          <button class="btn btn-primary btn-icon" onclick="sendMessage()" title="Send message">➤</button>
        </div>
      </div>
    </div>
  `;
  return el;
}

// ============================================================
// MEDICAL HISTORY
// ============================================================
function renderMedicalHistory() {
  const el = document.createElement('div');
  el.className = 'page';
  const records = [
    ['Jan 15, 2025','Seasonal Allergic Rhinitis','Dr. Lee','Antihistamines','Resolved'],
    ['Mar 02, 2025','Type 2 Diabetes Screening','Dr. Kumar','Metformin 500mg','Active'],
    ['Apr 18, 2025','Hypertension Check','Dr. Wilson','Amlodipine 5mg','Active'],
    ['Jun 08, 2025','Annual Physical Exam','Dr. Lee','Vitamin D supplements','Completed'],
    ['Jul 22, 2025','Back Pain Assessment','Dr. Patel','Physiotherapy','Ongoing'],
  ];
  el.innerHTML = `
    <div class="page-header">
      <h2>📋 Medical History</h2>
      <p>Complete record of your medical consultations and diagnoses</p>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
      <input class="form-input" style="max-width:300px" placeholder="🔍 Search records..." type="text"/>
      <div style="display:flex;gap:.75rem">
        <select class="form-select" style="width:150px"><option>All Time</option><option>This Year</option><option>Last 6 Months</option></select>
        <button class="btn btn-primary btn-sm" onclick="showToast('Export started','info')">📄 Export PDF</button>
      </div>
    </div>
    <div class="glass-card" style="padding:1.5rem">
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Date</th><th>Diagnosis</th><th>Doctor</th><th>Treatment</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${records.map(([date,diag,doc,treat,status]) => `
              <tr>
                <td>${date}</td>
                <td><strong>${diag}</strong></td>
                <td>${doc}</td>
                <td>${treat}</td>
                <td><span class="badge badge-${status==='Active'?'blue':status==='Resolved'?'green':'orange'}">${status}</span></td>
                <td>
                  <div class="table-actions">
                    <button class="btn btn-secondary btn-sm" onclick="showToast('Opening report...','info')">👁 View</button>
                    <button class="btn btn-secondary btn-sm" onclick="showToast('Downloading...','info')">⬇</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  return el;
}

// ============================================================
// BMI CALCULATOR
// ============================================================
function renderBMICalc() {
  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    <div class="page-header">
      <h2>⚖️ BMI Calculator</h2>
      <p>Calculate your Body Mass Index and understand your health status</p>
    </div>
    <div class="bmi-grid">
      <div class="glass-card" style="padding:2rem">
        <h3 style="margin-bottom:1.5rem">Enter Your Measurements</h3>
        <div style="display:flex;flex-direction:column;gap:1rem">
          <div class="form-group">
            <label class="form-label">Weight</label>
            <div style="display:flex;gap:.5rem">
              <input class="form-input" type="number" id="bmi-weight" value="70" oninput="calcBMI()"/>
              <select class="form-select" style="width:80px"><option>kg</option><option>lbs</option></select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Height</label>
            <div style="display:flex;gap:.5rem">
              <input class="form-input" type="number" id="bmi-height" value="170" oninput="calcBMI()"/>
              <select class="form-select" style="width:80px"><option>cm</option><option>ft/in</option></select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Age</label>
            <input class="form-input" type="number" value="30" oninput="calcBMI()"/>
          </div>
          <div class="form-group">
            <label class="form-label">Gender</label>
            <select class="form-select" onchange="calcBMI()"><option>Male</option><option>Female</option></select>
          </div>
        </div>
        <div style="margin-top:1.5rem;padding:1rem;background:var(--bg-glass);border:1px solid var(--border);border-radius:12px">
          <div style="font-size:.82rem;font-weight:700;margin-bottom:.75rem;color:var(--text-secondary)">BMI Categories:</div>
          ${[['<18.5','Underweight','blue'],['18.5-24.9','Normal','green'],['25-29.9','Overweight','orange'],['≥30','Obese','red']].map(([r,l,c]) => `
            <div style="display:flex;justify-content:space-between;margin-bottom:.3rem">
              <span style="font-size:.78rem;color:var(--text-muted)">${r}</span>
              <span class="badge badge-${c}">${l}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div>
        <div class="bmi-result glass-card" style="padding:2rem;margin-bottom:1.5rem">
          <div style="font-size:.875rem;color:var(--text-muted);margin-bottom:.5rem">Your BMI</div>
          <div class="bmi-value" id="bmi-value">24.2</div>
          <div class="bmi-category" id="bmi-category" style="color:var(--emerald-500)">Normal Weight ✅</div>
          <div class="bmi-scale">
            <div class="bmi-indicator" id="bmi-indicator" style="left:38%"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:.7rem;color:var(--text-muted)">
            <span>Under</span><span>Normal</span><span>Over</span><span>Obese</span>
          </div>
          <div style="margin-top:1.25rem;display:grid;grid-template-columns:1fr 1fr;gap:1rem;text-align:left">
            <div style="padding:.875rem;background:var(--bg-glass);border:1px solid var(--border);border-radius:10px">
              <div style="font-size:.7rem;color:var(--text-muted)">Ideal Weight Range</div>
              <div style="font-weight:700;font-size:.9rem" id="ideal-weight">53.5 – 72.6 kg</div>
            </div>
            <div style="padding:.875rem;background:var(--bg-glass);border:1px solid var(--border);border-radius:10px">
              <div style="font-size:.7rem;color:var(--text-muted)">Health Status</div>
              <div style="font-weight:700;font-size:.9rem;color:var(--emerald-500)">Healthy</div>
            </div>
          </div>
        </div>
        <div class="glass-card" style="padding:1.5rem">
          <h3 style="margin-bottom:1rem;font-size:.95rem">💡 Personalized Tips</h3>
          <ul style="list-style:none;display:flex;flex-direction:column;gap:.6rem">
            <li style="font-size:.82rem;display:flex;gap:.5rem;align-items:flex-start">✅ <span>Your BMI is in the healthy range. Maintain your current weight through balanced diet and regular exercise.</span></li>
            <li style="font-size:.82rem;display:flex;gap:.5rem;align-items:flex-start">🏃 <span>Aim for 150 minutes of moderate aerobic activity per week.</span></li>
            <li style="font-size:.82rem;display:flex;gap:.5rem;align-items:flex-start">🥗 <span>Focus on whole foods, fruits, vegetables, and lean protein.</span></li>
            <li style="font-size:.82rem;display:flex;gap:.5rem;align-items:flex-start">💧 <span>Stay hydrated — drink at least 8 glasses of water daily.</span></li>
          </ul>
        </div>
      </div>
    </div>
  `;
  return el;
}

// ============================================================
// APPOINTMENTS
// ============================================================
function renderAppointments() {
  const el = document.createElement('div');
  el.className = 'page';
  const appointments = [
    ['Aug 15','Dr. Raj Kumar','Cardiologist','10:30 AM','Video Call','Confirmed'],
    ['Aug 18','Dr. Sarah Lee','Endocrinologist','2:00 PM','In-Person','Confirmed'],
    ['Aug 22','Dr. James Wilson','General Physician','11:00 AM','In-Person','Pending'],
    ['Sep 05','Dr. Maria Chen','Dermatologist','3:30 PM','Video Call','Scheduled'],
  ];
  el.innerHTML = `
    <div class="page-header">
      <h2>📅 Appointments</h2>
      <p>Manage your medical appointments and consultations</p>
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem">
      <div class="tab-pills">
        <button class="tab-pill active">All</button>
        <button class="tab-pill">Upcoming</button>
        <button class="tab-pill">Completed</button>
        <button class="tab-pill">Cancelled</button>
      </div>
      <button class="btn btn-primary" onclick="showBookingModal()">+ Book Appointment</button>
    </div>
    <div class="glass-card" style="padding:1.5rem">
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr><th>Date</th><th>Doctor</th><th>Specialty</th><th>Time</th><th>Type</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            ${appointments.map(([date,doc,spec,time,type,status]) => `
              <tr>
                <td><strong>${date}</strong></td>
                <td>${doc}</td>
                <td>${spec}</td>
                <td>${time}</td>
                <td>${type === 'Video Call' ? '📹' : '🏥'} ${type}</td>
                <td><span class="badge badge-${status==='Confirmed'?'green':status==='Pending'?'orange':'blue'}">${status}</span></td>
                <td>
                  <div class="table-actions">
                    <button class="btn btn-primary btn-sm" onclick="showToast('Joining consultation...','info')">Join</button>
                    <button class="btn btn-secondary btn-sm" onclick="showToast('Appointment cancelled','info')">Cancel</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div id="booking-modal-container"></div>
  `;
  return el;
}

// ============================================================
// ANALYTICS
// ============================================================
function renderAnalytics() {
  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    <div class="page-header">
      <h2>📊 Health Analytics</h2>
      <p>Visual insights into your health trends and patterns</p>
    </div>
    <div class="stats-grid" style="margin-bottom:1.5rem">
      <div class="glass-card stat-card"><div class="stat-icon blue">📈</div><div class="stat-info"><strong>12</strong><span>Total Diagnoses</span></div></div>
      <div class="glass-card stat-card"><div class="stat-icon green">🩺</div><div class="stat-info"><strong>8</strong><span>Appointments</span></div></div>
      <div class="glass-card stat-card"><div class="stat-icon cyan">💊</div><div class="stat-info"><strong>5</strong><span>Medications</span></div></div>
      <div class="glass-card stat-card"><div class="stat-icon orange">❤️</div><div class="stat-info"><strong>87</strong><span>Avg Health Score</span></div></div>
    </div>
    <div class="analytics-grid">
      <div class="glass-card chart-card">
        <div class="card-header"><h3>Health Score Trend</h3><span class="badge badge-green">↑ Improving</span></div>
        <div class="chart-wrapper"><canvas id="chart-health-trend"></canvas></div>
      </div>
      <div class="glass-card chart-card">
        <div class="card-header"><h3>Disease Distribution</h3><span class="badge badge-blue">2025</span></div>
        <div class="chart-wrapper"><canvas id="chart-disease-dist"></canvas></div>
      </div>
      <div class="glass-card chart-card">
        <div class="card-header"><h3>Monthly Appointments</h3></div>
        <div class="chart-wrapper"><canvas id="chart-appointments"></canvas></div>
      </div>
      <div class="glass-card chart-card">
        <div class="card-header"><h3>Vital Signs Overview</h3></div>
        <div class="chart-wrapper"><canvas id="chart-vitals"></canvas></div>
      </div>
    </div>
  `;
  return el;
}

// ============================================================
// MEDICATION
// ============================================================
function renderMedication() {
  const el = document.createElement('div');
  el.className = 'page';
  const meds = [
    ['💊','Metformin','500mg • Twice daily','Morning (8 AM) / Evening (8 PM)',['taken','pending']],
    ['💉','Amlodipine','5mg • Once daily','Morning (8 AM)',['taken']],
    ['🍊','Vitamin D3','1000 IU • Once daily','Morning (8 AM)',['taken']],
    ['🔵','Atorvastatin','20mg • Once daily','Night (10 PM)',['pending']],
    ['🟡','Omeprazole','20mg • Once daily','Before breakfast',['taken']],
  ];
  el.innerHTML = `
    <div class="page-header">
      <h2>💊 Medication Manager</h2>
      <p>Track and manage your daily medications</p>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem">
      <div class="tab-pills">
        <button class="tab-pill active" onclick="switchTab(this)">Today</button>
        <button class="tab-pill" onclick="switchTab(this)">This Week</button>
        <button class="tab-pill" onclick="switchTab(this)">All Medications</button>
      </div>
      <button class="btn btn-primary btn-sm" onclick="showToast('Add medication form opening...','info')">+ Add Medication</button>
    </div>
    <div class="med-grid">
      ${meds.map(([icon, name, dose, schedule, times]) => `
        <div class="glass-card med-card">
          <span class="med-icon">${icon}</span>
          <div class="med-name">${name}</div>
          <div class="med-dose">${dose}</div>
          <div style="font-size:.72rem;color:var(--text-muted);margin-bottom:.75rem">${schedule}</div>
          <div class="med-times">
            ${times.map((t,i) => `
              <div class="med-time-item">
                <span>${i === 0 ? '8:00 AM' : '8:00 PM'}</span>
                <div class="med-check ${t==='taken'?'done':''}" onclick="toggleMedCheck(this)">
                  ${t === 'taken' ? '✓' : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
  return el;
}

// ============================================================
// LAB REPORTS
// ============================================================
function renderLabReports() {
  const el = document.createElement('div');
  el.className = 'page';
  const docs = State.patientDocuments || [
    {title:'Comprehensive Blood Panel & HbA1c', category:'Lab Report', uploaded_by:'John Doe (Patient)', date:'2025-08-10', file_name:'Blood_Panel_Aug2025.pdf', summary:'Fasting Glucose: 118 mg/dL | HbA1c: 6.4%'},
    {title:'ECG & Cardiac Stress Test Scan', category:'Diagnostic Scan', uploaded_by:'Dr. Raj Kumar (Doctor)', date:'2025-08-14', file_name:'ECG_Scan_Report.pdf', summary:'Normal sinus rhythm, HR 72 bpm'}
  ];

  el.innerHTML = `
    <div class="page-header">
      <h2>🧪 Lab Reports & Diagnostic Documents</h2>
      <p>Upload, store, and access your medical laboratory results & clinical scans</p>
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem">
      <input class="form-input" style="max-width:300px" placeholder="🔍 Search reports..." type="text"/>
      <button class="btn btn-primary btn-sm" onclick="showUploadReportModal()">📤 Upload New Report</button>
    </div>
    <div class="glass-card" style="padding:1.5rem">
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead><tr><th>Document Title</th><th>Category</th><th>Uploaded By</th><th>Date</th><th>Summary</th><th>Actions</th></tr></thead>
          <tbody>
            ${docs.map((d, i) => `
              <tr>
                <td><strong>🧪 ${d.title}</strong><br><span style="font-size:0.75rem;color:var(--text-muted)">${d.file_name || 'report.pdf'}</span></td>
                <td><span class="badge badge-blue">${d.category}</span></td>
                <td>${d.uploaded_by}</td>
                <td>${d.date}</td>
                <td><span style="font-size:0.8rem;color:var(--text-secondary)">${d.summary || 'Clinical record'}</span></td>
                <td>
                  <div class="table-actions">
                    <button class="btn btn-secondary btn-sm" onclick="showToast('Viewing document: ${d.title}','info')">👁 View</button>
                    <button class="btn btn-secondary btn-sm" onclick="showToast('Downloading document...','success')">⬇ Download</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  return el;
}

// ============================================================
// SETTINGS
// ============================================================
function renderSettings() {
  const el = document.createElement('div');
  el.className = 'page';
  el.innerHTML = `
    <div class="page-header">
      <h2>⚙️ Settings</h2>
      <p>Manage your account preferences and security</p>
    </div>
    <div style="display:grid;grid-template-columns:220px 1fr;gap:2rem">
      <div class="glass-card" style="padding:1rem;height:fit-content">
        ${[['👤','Profile'],['🔒','Security'],['🔔','Notifications'],['🎨','Appearance'],['🌐','Language'],['📊','Privacy'],['📱','Connected Apps']].map(([i,l]) => `
          <button class="nav-item w-full" style="margin-bottom:.25rem">${i} ${l}</button>
        `).join('')}
      </div>
      <div>
        <div class="glass-card" style="padding:2rem;margin-bottom:1.5rem">
          <h3 style="margin-bottom:1.5rem">Profile Information</h3>
          <div style="display:flex;align-items:center;gap:1.5rem;margin-bottom:2rem">
            <div style="width:72px;height:72px;border-radius:20px;background:var(--gradient-primary);display:flex;align-items:center;justify-content:center;font-size:1.8rem;color:white">👤</div>
            <div>
              <button class="btn btn-secondary btn-sm">Change Photo</button>
              <p style="font-size:.78rem;margin-top:.4rem;color:var(--text-muted)">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
            <div class="form-group"><label class="form-label">First Name</label><input class="form-input" value="John"/></div>
            <div class="form-group"><label class="form-label">Last Name</label><input class="form-input" value="Doe"/></div>
            <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" value="john.doe@email.com"/></div>
            <div class="form-group"><label class="form-label">Phone</label><input class="form-input" value="+1 555-0123"/></div>
            <div class="form-group"><label class="form-label">Date of Birth</label><input class="form-input" type="date" value="1990-03-15"/></div>
            <div class="form-group"><label class="form-label">Blood Type</label><select class="form-select"><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option></select></div>
          </div>
          <div class="form-group" style="margin-bottom:1.5rem"><label class="form-label">Emergency Contact</label><input class="form-input" placeholder="Name — Phone number"/></div>
          <button class="btn btn-primary" onclick="showToast('Profile saved successfully!','success')">Save Changes</button>
        </div>
        <div class="glass-card" style="padding:2rem">
          <h3 style="margin-bottom:1.5rem">Appearance</h3>
          <div class="form-group" style="margin-bottom:1rem">
            <label class="form-label">Theme</label>
            <div style="display:flex;gap:1rem;margin-top:.5rem">
              <div onclick="applyTheme('light');render()" style="flex:1;padding:1rem;border:2px solid ${State.theme==='light'?'var(--blue-600)':'var(--border)'};border-radius:12px;cursor:pointer;text-align:center;font-size:.85rem;font-weight:600;background:var(--bg-glass)">☀️ Light</div>
              <div onclick="applyTheme('dark');render()" style="flex:1;padding:1rem;border:2px solid ${State.theme==='dark'?'var(--blue-600)':'var(--border)'};border-radius:12px;cursor:pointer;text-align:center;font-size:.85rem;font-weight:600;background:var(--bg-glass)">🌙 Dark</div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Language</label>
            <select class="form-select" style="max-width:250px">
              <option>English</option><option>Spanish</option><option>French</option><option>German</option><option>Arabic</option><option>Hindi</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `;
  return el;
}

// ============================================================
// DOCTOR DASHBOARD
// ============================================================
function renderDoctorDashboard() {
  const el = document.createElement('div');
  el.className = 'page';
  const todayAppts = State.todayDoctorAppointments || [
    {id:'apt-101', patient_name:'John Doe', patient_age:42, time:'10:30 AM', type:'In-Person', reason:'Blood pressure checkup & chest discomfort', status:'Confirmed'},
    {id:'apt-102', patient_name:'Sarah Miller', patient_age:32, time:'02:15 PM', type:'Video Consultation', reason:'Fasting glucose review & dosage adjustment', status:'Confirmed'}
  ];

  el.innerHTML = `
    <div class="page-header">
      <h2>👨‍⚕️ Doctor Dashboard & Today's Schedule</h2>
      <p>Welcome back, Doctor. You have ${todayAppts.length} appointments scheduled for today.</p>
    </div>
    <div class="stats-grid">
      <div class="glass-card stat-card"><div class="stat-icon blue">👥</div><div class="stat-info"><strong>48</strong><span>Total Patients</span></div></div>
      <div class="glass-card stat-card"><div class="stat-icon green">📅</div><div class="stat-info"><strong>${todayAppts.length}</strong><span>Today's Appointments</span></div></div>
      <div class="glass-card stat-card"><div class="stat-icon cyan">📋</div><div class="stat-info"><strong>12</strong><span>Pending Lab Reports</span></div></div>
      <div class="glass-card stat-card"><div class="stat-icon orange">💳</div><div class="stat-info"><strong>Active</strong><span>Payment Account</span></div></div>
    </div>
    <div class="doctor-grid">
      <div class="glass-card" style="padding:1.5rem">
        <div class="card-header">
          <h3>📅 Today's Scheduled Appointments</h3>
          <span class="badge badge-green">${todayAppts.length} slots</span>
        </div>
        <div class="patient-list" style="margin-top:1rem">
          ${todayAppts.map(a => `
            <div class="patient-item selected" style="flex-direction:column;align-items:flex-start;gap:0.5rem">
              <div style="display:flex;justify-content:space-between;width:100%;align-items:center">
                <strong style="font-size:1rem;color:var(--blue-600)">⏰ ${a.time} — ${a.patient_name} (${a.patient_age}y)</strong>
                <span class="badge badge-blue">${a.type}</span>
              </div>
              <div style="font-size:0.82rem;color:var(--text-secondary)"><strong>Reason:</strong> ${a.reason}</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.4rem">
                <button class="btn btn-secondary btn-sm" onclick="showPatientDocuments('${a.patient_id || 'pat-98402'}')">📂 Patient Reports</button>
                <button class="btn btn-primary btn-sm" onclick="showDoctorUploadModal('${a.patient_id || 'pat-98402'}')">📤 Upload Patient Report</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div>
        <div class="glass-card" style="padding:1.5rem;margin-bottom:1.5rem">
          <h3 style="margin-bottom:1.25rem">💳 Doctor Payment & Account Details</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
            <div style="padding:.875rem;background:var(--bg-glass);border:1px solid var(--border);border-radius:10px">
              <div style="font-size:.7rem;color:var(--text-muted)">Consultation Fee</div>
              <div style="font-weight:700;font-size:1rem;color:var(--emerald-500)">₹500 / session</div>
            </div>
            <div style="padding:.875rem;background:var(--bg-glass);border:1px solid var(--border);border-radius:10px">
              <div style="font-size:.7rem;color:var(--text-muted)">Hospital UPI ID</div>
              <div style="font-weight:700;font-size:0.85rem">mediai.hospital@okicici</div>
            </div>
          </div>
          <div style="text-align:center;padding:1rem;background:var(--bg-glass);border-radius:12px;border:1px solid var(--border)">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=mediai.hospital@okicici&pn=MediAI%20Hospital" alt="Payment QR Code" style="width:140px;height:140px;border-radius:8px;margin-bottom:0.5rem"/>
            <div style="font-size:0.78rem;font-weight:600">Scan QR Code for Patient Consultation Fee Payment</div>
          </div>
        </div>
      </div>
    </div>
  `;
  return el;
}

// ============================================================
// ADMIN DASHBOARD
// ============================================================
function renderAdminDashboard() {
  const el = document.createElement('div');
  el.className = 'page';
  const users = State.databaseUsers || [
    {name:'System Administrator', username:'admin', role:'admin', age:38, year:'2024', department:'IT'},
    {name:'Dr. Raj Kumar', username:'drkumar', role:'doctor', age:45, year:'2020', department:'Cardiology'},
    {name:'Dr. Sarah Lee', username:'drsarah', role:'doctor', age:41, year:'2021', department:'Endocrinology'},
    {name:'John Doe', username:'johndoe', role:'patient', age:42, year:'2025', department:'General Medicine'}
  ];

  el.innerHTML = `
    <div class="page-header">
      <h2>🔧 Admin Portal — User Database & Payments</h2>
      <p>Manage patient/doctor login credentials, roles, departments, and hospital QR payment accounts</p>
    </div>
    <div class="admin-stats">
      <div class="glass-card stat-card"><div class="stat-icon blue">👥</div><div class="stat-info"><strong>${users.length}</strong><span>Total Database Users</span></div></div>
      <div class="glass-card stat-card"><div class="stat-icon green">👨‍⚕️</div><div class="stat-info"><strong>${users.filter(u=>u.role==='doctor').length}</strong><span>Active Doctors</span></div></div>
      <div class="glass-card stat-card"><div class="stat-icon cyan">🧑‍🦱</div><div class="stat-info"><strong>${users.filter(u=>u.role==='patient').length}</strong><span>Active Patients</span></div></div>
      <div class="glass-card stat-card"><div class="stat-icon orange">💳</div><div class="stat-info"><strong>Active</strong><span>QR Payments</span></div></div>
    </div>

    <!-- Payment Setup Section -->
    <div class="glass-card" style="padding:1.5rem;margin-bottom:1.5rem">
      <div class="card-header">
        <h3>💳 Hospital Payment & QR Account Setup</h3>
        <button class="btn btn-secondary btn-sm" onclick="showPaymentConfigModal()">⚙️ Edit Payment Details</button>
      </div>
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:1.5rem;margin-top:1rem;align-items:center">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div style="padding:.875rem;background:var(--bg-glass);border:1px solid var(--border);border-radius:10px">
            <div style="font-size:.75rem;color:var(--text-muted)">Account Name</div>
            <strong style="font-size:0.95rem">MediAI General Hospital</strong>
          </div>
          <div style="padding:.875rem;background:var(--bg-glass);border:1px solid var(--border);border-radius:10px">
            <div style="font-size:.75rem;color:var(--text-muted)">Account Number</div>
            <strong style="font-size:0.95rem">98765432101234</strong>
          </div>
          <div style="padding:.875rem;background:var(--bg-glass);border:1px solid var(--border);border-radius:10px">
            <div style="font-size:.75rem;color:var(--text-muted)">IFSC Code</div>
            <strong style="font-size:0.95rem">MEDAI0001984</strong>
          </div>
          <div style="padding:.875rem;background:var(--bg-glass);border:1px solid var(--border);border-radius:10px">
            <div style="font-size:.75rem;color:var(--text-muted)">UPI Payment ID</div>
            <strong style="font-size:0.95rem;color:var(--blue-600)">mediai.hospital@okicici</strong>
          </div>
        </div>
        <div style="text-align:center;padding:1rem;background:var(--bg-glass);border-radius:12px;border:1px solid var(--border)">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=upi://pay?pa=mediai.hospital@okicici&pn=MediAI%20Hospital" alt="Hospital Payment QR Code" style="width:130px;height:130px;border-radius:8px;margin-bottom:0.4rem"/>
          <div style="font-size:0.75rem;font-weight:700">Official Hospital QR Code</div>
        </div>
      </div>
    </div>

    <!-- User Database Section -->
    <div class="glass-card" style="padding:1.5rem">
      <div class="card-header">
        <h3>👥 Database User Accounts</h3>
        <button class="btn btn-primary btn-sm" onclick="showAddUserModal()">➕ Add New User (Patient / Doctor)</button>
      </div>
      <div class="data-table-wrapper" style="margin-top:1rem">
        <table class="data-table">
          <thead><tr><th>Full Name</th><th>Username / Email</th><th>Role</th><th>Age</th><th>Year</th><th>Department</th><th>Status</th></tr></thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td><strong>${u.name}</strong></td>
                <td><code style="color:var(--blue-600)">${u.username}</code> (${u.email || u.username+'@mediai.com'})</td>
                <td><span class="badge badge-${u.role==='doctor'?'blue':u.role==='admin'?'orange':'green'}">${u.role.toUpperCase()}</span></td>
                <td>${u.age || 30}</td>
                <td>${u.year || '2025'}</td>
                <td>${u.department || 'General'}</td>
                <td><span class="badge badge-green">Active</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  return el;
}

// ============================================================
// CHARTS
// ============================================================
function initCharts() {
  if (typeof Chart === 'undefined') return;
  const isDark = State.theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#6b7280';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  const defaults = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: textColor, font: { family: 'Inter', size: 12 } } } },
    scales: {
      x: { ticks: { color: textColor }, grid: { color: gridColor } },
      y: { ticks: { color: textColor }, grid: { color: gridColor } }
    }
  };

  // Health Score Trend
  const ctx1 = document.getElementById('chart-health-trend');
  if (ctx1) new Chart(ctx1, {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
      datasets: [{
        label: 'Health Score',
        data: [72,75,70,78,80,82,85,87],
        borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.1)',
        fill: true, tension: 0.4, pointBackgroundColor: '#2563eb'
      }]
    },
    options: defaults
  });

  // Disease Distribution
  const ctx2 = document.getElementById('chart-disease-dist');
  if (ctx2) new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: ['Respiratory','Diabetes','Hypertension','Cardiovascular','Others'],
      datasets: [{
        data: [28,22,18,15,17],
        backgroundColor: ['#3b82f6','#06b6d4','#10b981','#f59e0b','#8b5cf6'],
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: textColor, font: { family:'Inter', size:11 } } } } }
  });

  // Appointments
  const ctx3 = document.getElementById('chart-appointments');
  if (ctx3) new Chart(ctx3, {
    type: 'bar',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
      datasets: [{
        label: 'Appointments',
        data: [3,5,2,6,4,8,5,3],
        backgroundColor: 'rgba(37,99,235,0.7)', borderRadius: 6
      }]
    },
    options: defaults
  });

  // Vitals Radar
  const ctx4 = document.getElementById('chart-vitals');
  if (ctx4) new Chart(ctx4, {
    type: 'radar',
    data: {
      labels: ['Heart Rate','Blood Pressure','Blood Sugar','BMI','Cholesterol','SpO2'],
      datasets: [{
        label: 'Current',
        data: [85,90,95,88,72,98],
        borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.15)',
        pointBackgroundColor: '#2563eb'
      }, {
        label: 'Optimal',
        data: [90,90,90,90,90,99],
        borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)',
        pointBackgroundColor: '#10b981'
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: textColor } } }, scales: { r: { ticks: { color: textColor, display: false }, grid: { color: gridColor }, pointLabels: { color: textColor, font: { size: 10 } } } } }
  });
}

function initDocChart() {
  if (typeof Chart === 'undefined') return;
  const ctx = document.getElementById('doc-chart');
  if (!ctx) return;
  const textColor = State.theme === 'dark' ? '#94a3b8' : '#6b7280';
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri'],
      datasets: [{ label: 'Patients', data: [8,12,6,10,4], backgroundColor: 'rgba(37,99,235,0.7)', borderRadius: 6 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: textColor } }, y: { ticks: { color: textColor } } } }
  });
}

function initAdminChart() {
  if (typeof Chart === 'undefined') return;
  const ctx = document.getElementById('admin-chart');
  if (!ctx) return;
  const textColor = State.theme === 'dark' ? '#94a3b8' : '#6b7280';
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
      datasets: [{
        label: 'New Users', data: [80,120,95,160,140,180,210,247],
        borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: textColor, font: { size: 11 } } } }, scales: { x: { ticks: { color: textColor } }, y: { ticks: { color: textColor } } } }
  });
}

// ============================================================
// INTERACTIVE FUNCTIONS
// ============================================================
function initHealthRing() {
  const ring = document.getElementById('health-ring');
  if (!ring) return;
  const score = 87;
  const circumference = 314;
  const offset = circumference - (score / 100) * circumference;
  ring.style.strokeDashoffset = offset;
}

function initBMI() { calcBMI(); }

function calcBMI() {
  const w = parseFloat(document.getElementById('bmi-weight')?.value) || 70;
  const h = parseFloat(document.getElementById('bmi-height')?.value) || 170;
  const bmi = (w / ((h/100)**2)).toFixed(1);
  const valEl = document.getElementById('bmi-value');
  const catEl = document.getElementById('bmi-category');
  const indEl = document.getElementById('bmi-indicator');
  const idealEl = document.getElementById('ideal-weight');
  if (!valEl) return;
  valEl.textContent = bmi;
  let cat, color, pos;
  if (bmi < 18.5) { cat='Underweight ⚠️'; color='var(--blue-400)'; pos=10; }
  else if (bmi < 25) { cat='Normal Weight ✅'; color='var(--emerald-500)'; pos=38; }
  else if (bmi < 30) { cat='Overweight ⚠️'; color='var(--orange-400)'; pos=62; }
  else { cat='Obese ❗'; color='var(--red-500)'; pos=88; }
  catEl.textContent = cat; catEl.style.color = color;
  if (indEl) indEl.style.left = pos + '%';
  const minIdeal = (18.5 * (h/100)**2).toFixed(1);
  const maxIdeal = (24.9 * (h/100)**2).toFixed(1);
  if (idealEl) idealEl.textContent = `${minIdeal} – ${maxIdeal} kg`;
}

function initSymptomChecker() {
  const search = document.getElementById('symptom-search');
  if (!search) return;
  search.addEventListener('input', function() {
    const val = this.value.toLowerCase();
    const container = document.getElementById('symptom-suggestions');
    const filtered = symptomList.filter(s => s.toLowerCase().includes(val));
    container.innerHTML = filtered.slice(0,10).map(s => `<button class="symptom-suggestion" onclick="addSymptom('${s}')">${s}</button>`).join('');
  });
  renderSymptomTags();
}

function addSymptom(symptom) {
  if (!State.selectedSymptoms.includes(symptom)) {
    State.selectedSymptoms.push(symptom);
    renderSymptomTags();
    showToast(`Added: ${symptom}`, 'success');
  }
}

function removeSymptom(symptom) {
  State.selectedSymptoms = State.selectedSymptoms.filter(s => s !== symptom);
  renderSymptomTags();
}

function renderSymptomTags() {
  const container = document.getElementById('symptom-tags');
  if (!container) return;
  if (State.selectedSymptoms.length === 0) {
    container.innerHTML = '<span style="color:var(--text-muted);font-size:.82rem;padding:.2rem">No symptoms selected yet. Click suggestions above or search.</span>';
    return;
  }
  container.innerHTML = State.selectedSymptoms.map(s => `
    <div class="symptom-tag">
      ${s} <button onclick="removeSymptom('${s}')">×</button>
    </div>
  `).join('');
}

function nextStep(step) {
  document.querySelectorAll('.symptom-step').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`step-${step}`);
  if (target) target.classList.add('active');
  const progress = [0, 25, 50, 75, 100];
  const bar = document.getElementById('symptom-progress');
  if (bar) bar.style.width = (progress[step] || 25) + '%';
}

function runAnalysis() {
  nextStep(4);
  setTimeout(() => {
    document.getElementById('analysis-loading').classList.add('hidden');
    const results = document.getElementById('analysis-results');
    if (results) {
      results.classList.remove('hidden');
      const diseases = [
        ['Seasonal Allergic Rhinitis', 78, 'green'],
        ['Upper Respiratory Tract Infection', 62, 'orange'],
        ['Sinusitis', 45, 'blue'],
        ['Common Cold', 38, 'blue'],
      ];
      const container = document.getElementById('disease-results');
      if (container) {
        container.innerHTML = diseases.map(([name, conf, color]) => `
          <div class="disease-card">
            <div class="disease-card-header">
              <span class="disease-name">${name}</span>
              <span class="badge badge-${color}">${conf}%</span>
            </div>
            <div style="font-size:.78rem;color:var(--text-muted);margin-bottom:.5rem">Confidence Score</div>
            <div class="confidence-bar"><div class="confidence-fill" style="width:${conf}%"></div></div>
          </div>
        `).join('');
      }
    }
  }, 2800);
}

function resetAnalysis() {
  State.selectedSymptoms = [];
  document.getElementById('analysis-loading')?.classList.remove('hidden');
  document.getElementById('analysis-results')?.classList.add('hidden');
}

function initDiseasePrediction() {}

function predictDisease() {
  const glucose = parseFloat(document.getElementById('dp-glucose')?.value) || 148;
  const bmi = parseFloat(document.getElementById('dp-bmi')?.value) || 33.6;
  const age = parseFloat(document.getElementById('dp-age')?.value) || 45;

  let risk = 0;
  if (glucose > 140) risk += 30;
  else if (glucose > 100) risk += 15;
  if (bmi > 30) risk += 25;
  else if (bmi > 25) risk += 12;
  if (age > 45) risk += 20;
  else if (age > 35) risk += 10;
  risk = Math.min(risk + Math.floor(Math.random()*10), 95);

  const predEmpty = document.getElementById('pred-empty');
  const predResult = document.getElementById('pred-result');
  if (predEmpty) predEmpty.classList.add('hidden');
  if (predResult) predResult.classList.remove('hidden');

  const label = risk < 30 ? 'Low Risk' : risk < 60 ? 'Moderate Risk' : 'High Risk';
  const icon = risk < 30 ? '🟢' : risk < 60 ? '🟡' : '🔴';

  document.getElementById('pred-icon').textContent = icon;
  document.getElementById('pred-label').textContent = label;
  document.getElementById('pred-percent').textContent = risk + '%';
  document.getElementById('conf-val').textContent = risk + '%';

  const fill = document.getElementById('conf-fill');
  if (fill) { fill.style.width = '0%'; setTimeout(() => fill.style.width = risk + '%', 50); }

  const factors = document.getElementById('risk-factors');
  if (factors) {
    const riskList = [];
    if (glucose > 140) riskList.push(['High glucose level', `${glucose} mg/dL (Normal: <100)`,'red']);
    if (bmi > 30) riskList.push(['Elevated BMI', `${bmi} (Obese range)`,'orange']);
    if (age > 45) riskList.push(['Age factor', `${age} years (Risk increases with age)`,'orange']);
    if (!riskList.length) riskList.push(['No major risk factors identified', 'Continue healthy lifestyle','green']);
    factors.innerHTML = riskList.map(([t,d,c]) => `
      <div style="display:flex;gap:.75rem;padding:.75rem;background:var(--bg-glass);border:1px solid var(--border);border-radius:10px">
        <span style="font-size:1rem">${c==='red'?'⚠️':c==='orange'?'🔶':'✅'}</span>
        <div><div style="font-size:.82rem;font-weight:700;color:var(--text-primary)">${t}</div><div style="font-size:.75rem;color:var(--text-muted)">${d}</div></div>
      </div>
    `).join('');
  }
  showToast('Disease prediction complete!', 'success');
}

function selectDiseaseTab(btn, disease) {
  document.querySelectorAll('#disease-tabs .tab-pill').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const title = document.getElementById('disease-form-title');
  if (title) title.textContent = `🩺 ${disease} Risk Assessment`;
  const fields = document.getElementById('disease-form-fields');
  if (fields) fields.innerHTML = renderDiabetesForm();
  document.getElementById('pred-empty')?.classList.remove('hidden');
  document.getElementById('pred-result')?.classList.add('hidden');
}

function initChat() {
  const input = document.getElementById('chat-input');
  if (input) input.focus();
}

function insertCommand(cmd) {
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = cmd;
    sendMessage();
  }
}

function toggleTTS() {
  State.ttsEnabled = !State.ttsEnabled;
  if (!State.ttsEnabled && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  const btn = document.getElementById('tts-toggle-btn');
  if (btn) btn.textContent = State.ttsEnabled ? '🔊 Voice On' : '🔇 Muted';
  showToast(State.ttsEnabled ? 'Speech output enabled 🔊' : 'Speech output muted 🔇', 'info');
}

function speakText(text) {
  if (!State.ttsEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const cleanText = text.replace(/[*_#`~]|(https?:\/\/[^\s]+)/g, '').replace(/[\n\r]+/g, ' ');
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
  if (englishVoice) utterance.voice = englishVoice;
  
  window.speechSynthesis.speak(utterance);
}

function toggleVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast('Browser Speech Recognition API not supported. Use Google Chrome or Microsoft Edge.', 'warning');
    return;
  }

  if (State.isVoiceListening && State.speechRecognition) {
    State.speechRecognition.stop();
    State.isVoiceListening = false;
    updateVoiceUI(false);
    showToast('Voice microphone stopped', 'info');
    return;
  }

  try {
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      State.isVoiceListening = true;
      updateVoiceUI(true);
      showToast('🎤 Listening... Speak your health question now', 'info');
    };

    rec.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      const input = document.getElementById('chat-input');
      if (input) input.value = transcript;
    };

    rec.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      State.isVoiceListening = false;
      updateVoiceUI(false);
      showToast(`Voice error: ${event.error}`, 'error');
    };

    rec.onend = () => {
      State.isVoiceListening = false;
      updateVoiceUI(false);
      const input = document.getElementById('chat-input');
      if (input && input.value.trim()) {
        showToast('Voice captured! Processing AI response...', 'success');
        sendMessage();
      }
    };

    State.speechRecognition = rec;
    rec.start();
  } catch (err) {
    console.error('Mic error:', err);
    showToast('Microphone access denied or unverified', 'error');
  }
}

function updateVoiceUI(isListening) {
  const btn = document.getElementById('voice-mic-btn');
  const micIconBtn = document.getElementById('mic-input-btn');
  if (btn) {
    btn.textContent = isListening ? '🎤 Listening...' : 'Voice Mic';
    if (isListening) btn.classList.add('voice-active'); else btn.classList.remove('voice-active');
  }
  if (micIconBtn) {
    if (isListening) micIconBtn.classList.add('voice-active'); else micIconBtn.classList.remove('voice-active');
  }
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  if (!input || !input.value.trim()) return;
  const msg = input.value.trim();
  input.value = '';
  
  appendMessage('user', msg);
  showTyping();

  try {
    const apiHost = window.location.hostname || 'localhost';
    const res = await fetch(`http://${apiHost}:8000/api/chat/stream?message=${encodeURIComponent(msg)}`);
    if (res.ok && res.body) {
      removeTyping();
      const bubbleId = appendStreamingBubble();
      const bubbleEl = document.getElementById(bubbleId);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunkStr = decoder.decode(value);
        const lines = chunkStr.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.chunk) {
                fullText += data.chunk;
                if (bubbleEl) bubbleEl.innerHTML = formatMarkdownText(fullText) + '<span class="typing-cursor"></span>';
                const container = document.getElementById('chat-messages');
                if (container) container.scrollTop = container.scrollHeight;
              }
            } catch (e) {}
          }
        }
      }
      if (bubbleEl) bubbleEl.innerHTML = formatMarkdownText(fullText);
      speakText(fullText);
      return;
    }
  } catch (err) {
    // Backend offline fallback
  }

  setTimeout(() => {
    removeTyping();
    const responseText = getClientGroundedResponse(msg);
    streamTextToBubble(responseText);
  }, 600);
}

function getClientGroundedResponse(msg) {
  const lower = msg.toLowerCase();
  if (lower.startsWith('/vitals')) {
    return "📊 **Latest Patient Vitals (EHR Record)**:\n\n• **Blood Pressure**: 124/82 mmHg (Stage 1 Hypertension)\n• **Heart Rate**: 72 bpm\n• **Fasting Glucose**: 118 mg/dL\n• **SpO2**: 98%\n• **Body Temp**: 98.6 °F\n• **BMI**: 24.2 (Normal)\n\n*Updated from Hospital Database: Today at 09:30 AM*";
  }
  if (lower.startsWith('/prescriptions')) {
    return "📋 **Active Prescriptions (Patient Record)**:\n\n💊 **Metformin 500mg** — Twice daily with meals (Prescribed by Dr. Kumar)\n💊 **Amlodipine 5mg** — Once daily in morning (Prescribed by Dr. Wilson)\n\n⚠️ *Allergies*: Penicillin, Dust Mites";
  }
  if (lower.startsWith('/appointments')) {
    return "🩺 **Upcoming Hospital Appointments**:\n\n📅 **Sept 25, 2025 at 10:30 AM**: Dr. Sarah Jenkins (Endocrinology) — Diabetes Follow-up\n📅 **Oct 12, 2025 at 02:00 PM**: Dr. Michael Chen (Cardiology) — Routine Checkup";
  }
  if (lower.startsWith('/rag-info')) {
    return "🧠 **MediAI RAG Knowledge Base Engine**:\n\n• **Knowledge Base**: Indexed clinical guidelines across Cardiology, Endocrinology, Neurology & Pharmacology.\n• **Retrieval Grounding**: Grounded with patient EHR profile and verified medical documents to prevent hallucination.\n• **Voice Assistant**: Integrated WebSpeech Sound-to-Text & Speech Synthesis.";
  }

  if (lower.includes('headache') || lower.includes('migraine')) {
    return "Based on clinical RAG guidelines for headache triaging:\n\n• **Common Causes**: Tension headaches, dehydration, or eye strain.\n• **Immediate Relief**: Rest in a dark room, drink 500ml water, and consider Acetaminophen (500mg) if safe.\n• **EHR Patient Note**: Ensure no penicillin derivative is used if antibiotics are ever prescribed.\n\n🚨 **Emergency Warning**: Seek immediate care for sudden 'thunderclap' pain or fever with stiff neck.";
  }
  if (lower.includes('diabetes') || lower.includes('sugar') || lower.includes('glucose')) {
    return "Hello John! Checking your Type 2 Diabetes medical record:\n\n• **Glucose Status**: Fasting glucose is **118 mg/dL**.\n• **Medication**: **Metformin 500mg** twice daily with meals.\n• **Lifestyle Tips**: Focus on high-fiber vegetables, low-GI whole grains, and 30 mins of daily walking.\n• **Follow-up**: Scheduled appointment with Dr. Sarah Jenkins on Sept 25.";
  }
  if (lower.includes('heart') || lower.includes('bp') || lower.includes('pressure')) {
    return "Cardiovascular Record Analysis for John Doe:\n\n• **Current Blood Pressure**: **124/82 mmHg** (Stage 1 Hypertension).\n• **Prescription**: **Amlodipine 5mg** once daily.\n• **Recommendations**: Maintain sodium < 2,300mg/day, stay active 150 mins/week, and monitor daily.";
  }

  const defaultKey = Object.keys(aiResponses).find(k => lower.includes(k)) || 'default';
  return aiResponses[defaultKey];
}

function streamTextToBubble(text) {
  const bubbleId = appendStreamingBubble();
  const bubbleEl = document.getElementById(bubbleId);
  const words = text.split(' ');
  let currentText = '';
  let i = 0;

  const interval = setInterval(() => {
    if (i < words.length) {
      currentText += words[i] + ' ';
      if (bubbleEl) bubbleEl.innerHTML = formatMarkdownText(currentText) + '<span class="typing-cursor"></span>';
      const container = document.getElementById('chat-messages');
      if (container) container.scrollTop = container.scrollHeight;
      i++;
    } else {
      clearInterval(interval);
      if (bubbleEl) bubbleEl.innerHTML = formatMarkdownText(text);
      speakText(text);
    }
  }, 35);
}

function appendStreamingBubble() {
  const container = document.getElementById('chat-messages');
  if (!container) return null;
  const time = new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'});
  const bubbleId = 'stream-bubble-' + Date.now();
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble ai';
  bubble.innerHTML = `<div class="bubble-content" id="${bubbleId}"><span class="typing-cursor"></span></div><div class="bubble-time">${time}</div>`;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
  return bubbleId;
}

function formatMarkdownText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

function sendSuggestion(text) {
  const input = document.getElementById('chat-input');
  if (input) { input.value = text; sendMessage(); }
}

function appendMessage(role, text) {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  const time = new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'});
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${role}`;
  bubble.innerHTML = `<div class="bubble-content">${formatMarkdownText(text)}</div><div class="bubble-time">${time}</div>`;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function showTyping() {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  const typing = document.createElement('div');
  typing.className = 'chat-bubble ai';
  typing.id = 'typing-indicator';
  typing.innerHTML = `<div class="bubble-content typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() {
  document.getElementById('typing-indicator')?.remove();
}

function clearChat() {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  container.innerHTML = `
    <div class="chat-bubble ai">
      <div class="bubble-content">👋 Hello John! I'm MediAI. How can I help you today? Type a question or click a command like <code>/vitals</code> or <code>/prescriptions</code>.</div>
      <div class="bubble-time">Now</div>
    </div>`;
}

function loadChatHistory(topic) {
  document.querySelectorAll('.chat-history-item').forEach(i => i.classList.remove('active'));
  if (event && event.target) {
    const item = event.target.closest('.chat-history-item');
    if (item) item.classList.add('active');
  }
  const input = document.getElementById('chat-input');
  if (input) { input.value = topic; sendMessage(); }
}

function toggleVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast('Browser Speech Recognition API not supported. Use Google Chrome or Microsoft Edge.', 'warning');
    return;
  }
  if (State.isVoiceListening && State.speechRecognition) {
    State.speechRecognition.stop();
    State.isVoiceListening = false;
    updateVoiceUI(false);
    return;
  }
  try {
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onstart = () => { State.isVoiceListening = true; updateVoiceUI(true); showToast('🎤 Listening... Speak now', 'info'); };
    rec.onresult = (event) => {
      let t = '';
      for (let i = event.resultIndex; i < event.results.length; i++) t += event.results[i][0].transcript;
      const input = document.getElementById('chat-input');
      if (input) input.value = t;
    };
    rec.onerror = (e) => { State.isVoiceListening = false; updateVoiceUI(false); showToast(`Voice error: ${e.error}`, 'error'); };
    rec.onend = () => {
      State.isVoiceListening = false; updateVoiceUI(false);
      const input = document.getElementById('chat-input');
      if (input && input.value.trim()) { sendMessage(); }
    };
    State.speechRecognition = rec;
    rec.start();
  } catch (e) { showToast('Mic access denied', 'error'); }
}

// ============================================================
// AUTH & MODAL FUNCTIONS
// ============================================================
let currentRegRole = 'patient';

function selectRole(el, role) {
  document.querySelectorAll('.role-option').forEach(r => r.classList.remove('selected'));
  el.classList.add('selected');
  currentRegRole = role;
}

async function doRegister() {
  const fname = document.getElementById('reg-fname')?.value || '';
  const lname = document.getElementById('reg-lname')?.value || '';
  const email = document.getElementById('reg-email')?.value || '';
  const pass = document.getElementById('reg-pass')?.value || '';
  const dob = document.getElementById('reg-dob')?.value || '';
  if (!fname || !lname || !email || !pass) { showToast('Please fill all required fields', 'error'); return; }
  
  showToast('Creating account...', 'info');
  const apiHost = window.location.hostname || 'localhost';
  try {
    const res = await fetch(`http://${apiHost}:8000/api/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass, name: fname + ' ' + lname, role: currentRegRole })
    });
    if (res.ok) {
      showToast('Account created successfully! Please sign in.', 'success');
      navigate('login');
    } else {
      const err = await res.json().catch(()=>({}));
      showToast(err.detail || 'Registration failed', 'error');
    }
  } catch(e) {
    showToast('Failed to connect to server', 'error');
  }
}

function loginAs(role) {
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-password');
  if (role === 'admin') {
    emailInput.value = 'admin';
    passInput.value = 'admin123';
  } else if (role === 'doctor') {
    emailInput.value = 'drkumar';
    passInput.value = 'password123';
  } else {
    emailInput.value = 'johndoe';
    passInput.value = 'password123';
  }
  doLogin();
}

function logout() {
  State.isAuthenticated = false;
  State.currentUser = null;
  State.role = 'patient';
  showToast('Logged out successfully', 'info');
  navigate('landing');
}

async function doLogin() {
  const email = document.getElementById('login-email')?.value || '';
  const password = document.getElementById('login-password')?.value || '';
  if (!email || !password) { showToast('Please enter username/email and password', 'error'); return; }
  showToast('Verifying database credentials...', 'info');

  try {
    const apiHost = window.location.hostname || 'localhost';
    const res = await fetch(`http://${apiHost}:8000/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      State.isAuthenticated = true;
      State.currentUser = data.user;
      State.role = data.user.role;
      showToast(`Welcome back, ${data.user.name}! ✅`, 'success');
      const page = State.role === 'doctor' ? 'doctor-dashboard' : State.role === 'admin' ? 'admin-dashboard' : 'dashboard';
      navigate(page);
      return;
    } else {
      const errData = await res.json().catch(()=>({}));
      showToast(errData.detail || 'Invalid username or password', 'error');
      return;
    }
  } catch (err) {
    // Demo Mode fallback authentication
  }

  // Demo Fallback
  if ((email.includes('admin') || email === 'admin') && password === 'admin123') {
    State.role = 'admin'; State.isAuthenticated = true;
    showToast('Logged in as Admin ✅', 'success'); navigate('admin-dashboard');
  } else if ((email.includes('doctor') || email === 'drkumar') && password === 'password123') {
    State.role = 'doctor'; State.isAuthenticated = true;
    showToast('Logged in as Dr. Raj Kumar ✅', 'success'); navigate('doctor-dashboard');
  } else if ((email.includes('patient') || email === 'johndoe') && password === 'password123') {
    State.role = 'patient'; State.isAuthenticated = true;
    showToast('Logged in as John Doe ✅', 'success'); navigate('dashboard');
  } else {
    showToast('Invalid credentials! Please use valid admin-created username & password.', 'error');
  }
}

function showAddUserModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'add-user-modal';
  overlay.innerHTML = `
    <div class="glass-card modal" style="padding:2rem;max-width:520px">
      <div class="modal-header">
        <h3>➕ Add Database User</h3>
        <button class="modal-close" onclick="closeModal('add-user-modal')">×</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:1rem">
        <div class="form-group">
          <label class="form-label">User Role</label>
          <select class="form-select" id="au-role">
            <option value="patient">Patient Account</option>
            <option value="doctor">Doctor Account</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Full Name</label><input class="form-input" id="au-name" placeholder="e.g. Dr. Alex Johnson or Mary Smith"/></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group"><label class="form-label">Age</label><input class="form-input" type="number" id="au-age" value="35"/></div>
          <div class="form-group"><label class="form-label">Year</label><input class="form-input" id="au-year" value="2025"/></div>
        </div>
        <div class="form-group"><label class="form-label">Department / Specialty</label><input class="form-input" id="au-dept" value="Cardiology"/></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group"><label class="form-label">Username</label><input class="form-input" id="au-user" placeholder="e.g. alexj"/></div>
          <div class="form-group"><label class="form-label">Password</label><input class="form-input" type="password" id="au-pass" placeholder="Secure password"/></div>
        </div>
        <button class="btn btn-primary w-full" style="margin-top:1rem" onclick="saveNewUser()">💾 Save & Create Account</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

async function saveNewUser() {
  const role = document.getElementById('au-role')?.value || 'patient';
  const name = document.getElementById('au-name')?.value || '';
  const age = parseInt(document.getElementById('au-age')?.value) || 30;
  const year = document.getElementById('au-year')?.value || '2025';
  const department = document.getElementById('au-dept')?.value || 'General Medicine';
  const username = document.getElementById('au-user')?.value || '';
  const password = document.getElementById('au-pass')?.value || '';

  if (!name || !username || !password) {
    showToast('Please fill in Name, Username, and Password', 'error');
    return;
  }

  showToast('Creating database user...', 'info');

  try {
    const apiHost = window.location.hostname || 'localhost';
    const res = await fetch(`http://${apiHost}:8000/api/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, name, age, year, department, username, password })
    });
    if (res.ok) {
      showToast(`User ${username} created successfully!`, 'success');
      closeModal('add-user-modal');
      render();
      return;
    }
  } catch (err) {}

  if (!State.databaseUsers) State.databaseUsers = [];
  State.databaseUsers.push({ role, name, age, year, department, username, email: `${username}@mediai.com` });
  showToast(`Account created for ${name} (${role.toUpperCase()})! Can now log in with username '${username}'.`, 'success');
  closeModal('add-user-modal');
  render();
}

function showBookingModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'booking-modal';
  overlay.innerHTML = `
    <div class="glass-card modal" style="padding:2rem;max-width:500px">
      <div class="modal-header">
        <h3>📅 Book Doctor Appointment</h3>
        <button class="modal-close" onclick="closeModal('booking-modal')">×</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:1rem">
        <div class="form-group">
          <label class="form-label">Select Doctor</label>
          <select class="form-select" id="bk-doc">
            <option value="doc-101">Dr. Raj Kumar (Cardiology)</option>
            <option value="doc-102">Dr. Sarah Lee (Endocrinology)</option>
            <option value="doc-103">Dr. James Wilson (General Physician)</option>
          </select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group"><label class="form-label">Appointment Date</label><input class="form-input" type="date" id="bk-date" value="2025-09-25"/></div>
          <div class="form-group">
            <label class="form-label">Time Slot</label>
            <select class="form-select" id="bk-time">
              <option>09:00 AM</option>
              <option>10:30 AM</option>
              <option>02:15 PM</option>
              <option>04:00 PM</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Consultation Type</label>
          <select class="form-select" id="bk-type">
            <option>In-Person Visit</option>
            <option>Video Consultation</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Reason for Visit</label><input class="form-input" id="bk-reason" value="Routine blood pressure checkup & general health review"/></div>
        <button class="btn btn-primary w-full" style="margin-top:1rem" onclick="saveBooking()">📅 Confirm Booking (Fee: ₹500)</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

async function saveBooking() {
  const doctor_id = document.getElementById('bk-doc')?.value || 'doc-101';
  const date = document.getElementById('bk-date')?.value || '2025-09-25';
  const time = document.getElementById('bk-time')?.value || '10:30 AM';
  const type = document.getElementById('bk-type')?.value || 'In-Person';
  const reason = document.getElementById('bk-reason')?.value || 'Consultation';

  showToast('Booking appointment...', 'info');

  try {
    const res = await fetch(`http://${apiHost}:8000/api/appointments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctor_id, date, time, type, reason })
    });
    if (res.ok) {
      showToast('Appointment booked and saved to Database! ✅', 'success');
      closeModal('booking-modal');
      return;
    }
  } catch (err) {}

  showToast(`Appointment booked with Dr. Raj Kumar for ${date} at ${time}! ✅`, 'success');
  closeModal('booking-modal');
}

function showUploadReportModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'upload-report-modal';
  overlay.innerHTML = `
    <div class="glass-card modal" style="padding:2rem;max-width:500px">
      <div class="modal-header">
        <h3>📤 Upload Patient Lab Report</h3>
        <button class="modal-close" onclick="closeModal('upload-report-modal')">×</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:1rem">
        <div class="form-group"><label class="form-label">Report Title</label><input class="form-input" id="ur-title" value="Thyroid & Fasting Lipid Profile"/></div>
        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="form-select" id="ur-cat">
            <option>Lab Report</option>
            <option>Diagnostic Scan</option>
            <option>Prescription</option>
            <option>Discharge Summary</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Select File (PDF / Image)</label><input class="form-input" type="file" id="ur-file"/></div>
        <div class="form-group"><label class="form-label">Summary / Key Findings</label><textarea class="form-textarea" id="ur-summary">TSH: 2.4 uIU/mL (Normal) | Total Cholesterol: 190 mg/dL</textarea></div>
        <button class="btn btn-primary w-full" style="margin-top:1rem" onclick="saveUploadedReport()">💾 Upload to Database</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

async function saveUploadedReport() {
  const title = document.getElementById('ur-title')?.value || 'Lab Report';
  const category = document.getElementById('ur-cat')?.value || 'Lab Report';
  const summary = document.getElementById('ur-summary')?.value || 'Test findings attached';
  const fileInput = document.getElementById('ur-file');
  const fileName = fileInput?.files[0]?.name || 'Lab_Report_2025.pdf';

  showToast('Uploading lab report to database...', 'info');

  try {
    const apiHost = window.location.hostname || 'localhost';
    const res = await fetch(`http://${apiHost}:8000/api/documents/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_id: 'pat-98402',
        patient_name: 'John Doe',
        title, category,
        uploaded_by: State.role === 'doctor' ? 'Dr. Raj Kumar (Doctor)' : 'John Doe (Patient)',
        file_name: fileName,
        file_size: '1.8 MB',
        summary
      })
    });
    if (res.ok) {
      showToast('Lab report saved to patient database! ✅', 'success');
      closeModal('upload-report-modal');
      render();
      return;
    }
  } catch (e) {}

  if (!State.patientDocuments) State.patientDocuments = [];
  State.patientDocuments.push({
    title, category, uploaded_by: State.role === 'doctor' ? 'Doctor' : 'Patient',
    date: new Date().toISOString().split('T')[0], file_name: fileName, summary
  });
  showToast('Lab report saved to database profile! ✅', 'success');
  closeModal('upload-report-modal');
  render();
}

function showPatientDocuments(patientId) {
  showToast(`Opening documents for Patient ${patientId}...`, 'info');
  navigate('lab-reports');
}

function showDoctorUploadModal(patientId) {
  showUploadReportModal();
}

function showPaymentConfigModal() {
  showToast('Opening Payment QR & Bank Account Configuration...', 'info');
}

function closeModal(id) {
  document.getElementById(id)?.remove();
}

// ============================================================
// UI HELPERS
// ============================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span style="flex:1">${message}</span><button class="toast-close" onclick="this.closest('.toast').remove()">×</button>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function toggleFAQ(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-answer.open').forEach(a => { a.classList.remove('open'); a.previousElementSibling.classList.remove('active'); });
  if (!isOpen) { answer.classList.add('open'); btn.classList.add('active'); }
}

function smoothScroll(id) {
  if (State.currentPage !== 'landing') { navigate('landing'); setTimeout(() => document.getElementById(id)?.scrollIntoView({behavior:'smooth'}), 300); return; }
  document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
}

function switchTab(btn) {
  btn.closest('.tab-pills').querySelectorAll('.tab-pill').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
}

function toggleMedCheck(el) {
  el.classList.toggle('done');
  el.textContent = el.classList.contains('done') ? '✓' : '';
  showToast(el.classList.contains('done') ? 'Medication marked as taken ✅' : 'Medication unmarked', 'info');
}

// Stub removed in favor of full modal handler above

// ============================================================
// BIND EVENTS
// ============================================================
function bindEvents() {
  // Theme toggle
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    applyTheme(State.theme === 'dark' ? 'light' : 'dark');
    render();
  });

  // Hamburger
  document.getElementById('hamburger')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('open');
  });

  // Tab pills (non-specific)
  document.querySelectorAll('.tab-pill').forEach(pill => {
    pill.addEventListener('click', function() {
      const group = this.closest('.tab-pills');
      group?.querySelectorAll('.tab-pill').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

function postRender() {
  if (State.currentPage === 'analytics') initCharts();
  if (State.currentPage === 'dashboard') initHealthRing();
  if (State.currentPage === 'bmi-calculator') initBMI();
  if (State.currentPage === 'symptom-checker') initSymptomChecker();
  if (State.currentPage === 'ai-chat') initChat();
  if (State.currentPage === 'disease-prediction') initDiseasePrediction();
  if (State.currentPage === 'doctor-dashboard') setTimeout(initDocChart, 100);
  if (State.currentPage === 'admin-dashboard') setTimeout(initAdminChart, 100);
}

// ============================================================
// INIT
// ============================================================
render();
