// MEAN Stack Admission System - Client Application Engine
const API_BASE = window.location.origin.includes('localhost')
  ? `${window.location.origin}/api`
  : '/api';

// Application State
const state = {
  token: localStorage.getItem('admission_token') || null,
  user: JSON.parse(localStorage.getItem('admission_user') || 'null'),
  currentView: 'home', // 'home', 'login', 'register', 'apply', 'my-status', 'admin-dashboard', 'admin-applicants'
  myApplication: null,
  adminStats: null,
  adminApplicants: [],
  filters: { department: 'All', status: 'All', search: '' },
  selectedApplicant: null,
  alert: null
};

// Helper: Show temporary alert
function showAlert(message, type = 'info', timeout = 4000) {
  state.alert = { message, type };
  render();
  if (timeout > 0) {
    setTimeout(() => {
      if (state.alert?.message === message) {
        state.alert = null;
        render();
      }
    }, timeout);
  }
}

// API Service Call Wrapper with JWT Auth header
async function apiCall(endpoint, options = {}) {
  const headers = options.headers || {};
  if (state.token) {
    headers['Authorization'] = `Bearer ${state.token}`;
  }

  // Do not set Content-Type if payload is FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

// Auth Handlers
async function handleLogin(email, password) {
  try {
    const res = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    state.token = res.token;
    state.user = res.user;
    localStorage.setItem('admission_token', res.token);
    localStorage.setItem('admission_user', JSON.stringify(res.user));

    showAlert(`Welcome back, ${res.user.name}!`, 'success');
    if (res.user.role === 'admin') {
      navigateTo('admin-dashboard');
    } else {
      navigateTo('my-status');
    }
  } catch (err) {
    showAlert(err.message, 'error');
  }
}

async function handleRegister(name, email, password, role = 'applicant') {
  try {
    const res = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });

    state.token = res.token;
    state.user = res.user;
    localStorage.setItem('admission_token', res.token);
    localStorage.setItem('admission_user', JSON.stringify(res.user));

    showAlert('Registration successful!', 'success');
    if (role === 'admin') {
      navigateTo('admin-dashboard');
    } else {
      navigateTo('apply');
    }
  } catch (err) {
    showAlert(err.message, 'error');
  }
}

function handleLogout() {
  state.token = null;
  state.user = null;
  state.myApplication = null;
  localStorage.removeItem('admission_token');
  localStorage.removeItem('admission_user');
  showAlert('You have been logged out.', 'info');
  navigateTo('home');
}

// Navigation router
async function navigateTo(view) {
  state.currentView = view;
  state.alert = null;

  if (view === 'my-status' && state.token) {
    try {
      const res = await apiCall('/applications/my');
      state.myApplication = res.application;
    } catch (err) {
      // If 404, applicant has not submitted yet
      state.myApplication = null;
      if (err.message.includes('No application found')) {
        state.currentView = 'apply';
      }
    }
  }

  if (view === 'admin-dashboard' && state.user?.role === 'admin') {
    try {
      const res = await apiCall('/applications/stats/summary');
      state.adminStats = res;
    } catch (err) {
      showAlert(err.message, 'error');
    }
  }

  if (view === 'admin-applicants' && state.user?.role === 'admin') {
    await fetchAdminApplicants();
  }

  render();
}

async function fetchAdminApplicants() {
  try {
    const params = new URLSearchParams();
    if (state.filters.department !== 'All') params.append('department', state.filters.department);
    if (state.filters.status !== 'All') params.append('status', state.filters.status);
    if (state.filters.search) params.append('search', state.filters.search);

    const res = await apiCall(`/applications?${params.toString()}`);
    state.adminApplicants = res.applications || [];
    render();
  } catch (err) {
    showAlert(err.message, 'error');
  }
}

// Submission Handler for Admission Form with Multer file upload
async function handleApplicationSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const fileInput = form.querySelector('input[name="document"]');
  if (!fileInput.files.length) {
    showAlert('Please select your marksheet or certificate document.', 'error');
    return;
  }

  try {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerText = 'Uploading and Submitting...';

    const res = await apiCall('/applications', {
      method: 'POST',
      body: formData
    });

    state.myApplication = res.application;
    showAlert('Application successfully submitted!', 'success');
    navigateTo('my-status');
  } catch (err) {
    showAlert(err.message, 'error');
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Submit Admission Application';
    }
  }
}

// Admin Status Transition Handler
async function handleStatusChange(applicationId, newStatus, comments) {
  try {
    const res = await apiCall(`/applications/${applicationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus, comments })
    });

    showAlert(`Status updated to '${newStatus}'!`, 'success');
    state.selectedApplicant = null;
    await fetchAdminApplicants();
    // Also update stats if they were loaded
    if (state.currentView === 'admin-dashboard') {
      const stats = await apiCall('/applications/stats/summary');
      state.adminStats = stats;
    }
    render();
  } catch (err) {
    showAlert(err.message, 'error');
  }
}

// Render Components
function renderNavbar() {
  const isAuth = !!state.token;
  const isAdmin = state.user?.role === 'admin';

  return `
    <header>
      <div class="nav-container">
        <div class="brand" onclick="navigateTo('home')">
          <img src="/logo.png" alt="IEM Logo" class="brand-logo" />
          <div class="brand-text">
            <span class="brand-title">IEM Admissions</span>
            <span class="brand-subtext">Institute of Engineering & Management</span>
          </div>
          <span class="brand-badge">MEAN Stack POC</span>
        </div>
        <div class="nav-links">
          ${
            !isAuth
              ? `
            <button class="nav-btn ${state.currentView === 'home' ? 'active' : ''}" onclick="navigateTo('home')">Home</button>
            <button class="nav-btn ${state.currentView === 'login' ? 'active' : ''}" onclick="navigateTo('login')">Sign In</button>
            <button class="nav-btn btn-primary" onclick="navigateTo('register')">Register</button>
          `
              : isAdmin
              ? `
            <button class="nav-btn ${state.currentView === 'admin-dashboard' ? 'active' : ''}" onclick="navigateTo('admin-dashboard')">📊 Analytics</button>
            <button class="nav-btn ${state.currentView === 'admin-applicants' ? 'active' : ''}" onclick="navigateTo('admin-applicants')">📋 Applicants</button>
            <span style="font-size:0.85rem; color:#475569; font-weight:600;">Admin: ${state.user.name}</span>
            <button class="nav-btn btn-outline" onclick="handleLogout()">Sign Out</button>
          `
              : `
            <button class="nav-btn ${state.currentView === 'my-status' ? 'active' : ''}" onclick="navigateTo('my-status')">📄 My Status</button>
            ${!state.myApplication ? `<button class="nav-btn ${state.currentView === 'apply' ? 'active' : ''}" onclick="navigateTo('apply')">📝 Apply Now</button>` : ''}
            <span style="font-size:0.85rem; color:#475569; font-weight:600;">Student: ${state.user.name}</span>
            <button class="nav-btn btn-outline" onclick="handleLogout()">Sign Out</button>
          `
          }
        </div>
      </div>
    </header>
  `;
}

function renderDemoBar() {
  return `
    <div style="background:#1e293b; color:#cbd5e1; padding:0.6rem 1.5rem; font-size:0.82rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <span style="background:#3b82f6; color:#fff; padding:0.15rem 0.4rem; border-radius:4px; font-weight:700; font-size:0.75rem;">DEMO SHORTCUTS</span>
        <span>Quickly switch personas to test in your lab evaluation:</span>
      </div>
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
        <button class="btn-outline" style="padding:0.25rem 0.6rem; font-size:0.75rem; background:#334155; color:#fff; border-color:#475569;" onclick="handleLogin('admin@college.edu', 'admin123')">🔑 Admin (Dean)</button>
        <button class="btn-outline" style="padding:0.25rem 0.6rem; font-size:0.75rem; background:#334155; color:#fff; border-color:#475569;" onclick="handleLogin('aarav@example.com', 'student123')">🎓 Student: Selected</button>
        <button class="btn-outline" style="padding:0.25rem 0.6rem; font-size:0.75rem; background:#334155; color:#fff; border-color:#475569;" onclick="handleLogin('diya@example.com', 'student123')">🔍 Student: Review</button>
        <button class="btn-outline" style="padding:0.25rem 0.6rem; font-size:0.75rem; background:#334155; color:#fff; border-color:#475569;" onclick="handleLogin('rohan@example.com', 'student123')">📥 Student: Submitted</button>
      </div>
    </div>
  `;
}

function renderAlert() {
  if (!state.alert) return '';
  return `
    <div class="alert alert-${state.alert.type}">
      <span>${state.alert.type === 'error' ? '⚠️' : '✅'}</span>
      <span>${state.alert.message}</span>
    </div>
  `;
}

// Views
function renderHome() {
  return `
    <div style="text-align:center; padding:2.5rem 1rem 3rem; max-width:800px; margin:0 auto;">
      <div style="margin-bottom:1.25rem;">
        <img src="/logo.png" alt="Institute of Engineering & Management" style="max-height:100px; width:auto; filter:drop-shadow(0 4px 6px rgba(0,0,0,0.08));" />
      </div>
      <span class="brand-badge" style="font-size:0.85rem; padding:0.35rem 0.85rem;">PCCCS504 Software Engineering Lab POC</span>
      <h1 style="font-size:2.4rem; font-weight:800; margin:1rem 0 0.35rem; color:#0f172a; line-height:1.2;">
        Institute of Engineering & Management
      </h1>
      <h2 style="font-size:1.35rem; font-weight:600; color:#2563eb; margin-bottom:1rem;">
        Online Admission Portal
      </h2>
      <p style="font-size:1.05rem; color:#64748b; line-height:1.6; margin-bottom:2rem;">
        Demonstrating a complete Proof of Concept (POC) built with the <strong>MEAN Stack</strong> (MongoDB, Express.js, Angular Architecture, and Node.js) featuring JWT Authentication, Document Upload with Multer, State Workflow Engine, and Admin Analytics.
      </p>
      
      <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap; margin-bottom:3rem;">
        <button class="nav-btn btn-primary" style="padding:0.75rem 1.75rem; font-size:1rem;" onclick="navigateTo('login')">
          Sign In to Portal
        </button>
        <button class="nav-btn btn-outline" style="padding:0.75rem 1.75rem; font-size:1rem;" onclick="navigateTo('register')">
          New Student Registration
        </button>
      </div>

      <div class="metrics-grid" style="text-align:left;">
        <div class="card" style="margin:0;">
          <h3 style="color:#2563eb; margin-bottom:0.5rem;">📁 Document Upload</h3>
          <p style="font-size:0.85rem; color:#64748b;">Multer middleware stores marksheets on disk while storing reference & metadata in MongoDB.</p>
        </div>
        <div class="card" style="margin:0;">
          <h3 style="color:#16a34a; margin-bottom:0.5rem;">🔒 RBAC & JWT</h3>
          <p style="font-size:0.85rem; color:#64748b;">Separate role controls for Applicants and Admins with bcrypt password hashing and token security.</p>
        </div>
        <div class="card" style="margin:0;">
          <h3 style="color:#d97706; margin-bottom:0.5rem;">⚡ Status Workflow</h3>
          <p style="font-size:0.85rem; color:#64748b;">Rigorous transition validation: Submitted → Under Review → Selected / Rejected with audit logs.</p>
        </div>
        <div class="card" style="margin:0;">
          <h3 style="color:#0284c7; margin-bottom:0.5rem;">📊 Aggregation Stats</h3>
          <p style="font-size:0.85rem; color:#64748b;">Live analytics computed via MongoDB Aggregation Pipelines: counts, cutoffs, and department graphs.</p>
        </div>
      </div>
    </div>
  `;
}

function renderLogin() {
  return `
    <div style="max-width:420px; margin:2rem auto;">
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Sign In</h2>
            <p class="card-subtitle">Access your admission application or admin dashboard</p>
          </div>
        </div>
        <form onsubmit="event.preventDefault(); handleLogin(this.email.value, this.password.value);">
          <div class="form-group" style="margin-bottom:1rem;">
            <label>Email Address</label>
            <input type="email" name="email" required placeholder="e.g. rohan@example.com" />
          </div>
          <div class="form-group" style="margin-bottom:1.5rem;">
            <label>Password</label>
            <input type="password" name="password" required placeholder="••••••••" />
          </div>
          <button type="submit" class="nav-btn btn-primary" style="width:100%; justify-content:center; padding:0.75rem;">
            Sign In
          </button>
        </form>
        <div style="text-align:center; margin-top:1.25rem; font-size:0.85rem; color:#64748b;">
          Don't have an account? <a href="#" style="color:#2563eb; text-decoration:none; font-weight:600;" onclick="navigateTo('register')">Register here</a>
        </div>
      </div>
    </div>
  `;
}

function renderRegister() {
  return `
    <div style="max-width:440px; margin:2rem auto;">
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Register Account</h2>
            <p class="card-subtitle">Create a student profile to start your admission</p>
          </div>
        </div>
        <form onsubmit="event.preventDefault(); handleRegister(this.name.value, this.email.value, this.password.value, this.role.value);">
          <div class="form-group" style="margin-bottom:1rem;">
            <label>Full Name</label>
            <input type="text" name="name" required placeholder="John Doe" />
          </div>
          <div class="form-group" style="margin-bottom:1rem;">
            <label>Email Address</label>
            <input type="email" name="email" required placeholder="john@example.com" />
          </div>
          <div class="form-group" style="margin-bottom:1rem;">
            <label>Password</label>
            <input type="password" name="password" required minlength="6" placeholder="Min 6 characters" />
          </div>
          <div class="form-group" style="margin-bottom:1.5rem;">
            <label>Register As</label>
            <select name="role">
              <option value="applicant">Student / Applicant</option>
              <option value="admin">Administrator / Faculty</option>
            </select>
          </div>
          <button type="submit" class="nav-btn btn-primary" style="width:100%; justify-content:center; padding:0.75rem;">
            Create Account
          </button>
        </form>
        <div style="text-align:center; margin-top:1.25rem; font-size:0.85rem; color:#64748b;">
          Already registered? <a href="#" style="color:#2563eb; text-decoration:none; font-weight:600;" onclick="navigateTo('login')">Sign in</a>
        </div>
      </div>
    </div>
  `;
}

function renderApplyForm() {
  return `
    <div style="max-width:850px; margin:0 auto;">
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">College Admission Application Form</h2>
            <p class="card-subtitle">Complete all sections and upload your marksheet to apply</p>
          </div>
        </div>

        <form onsubmit="handleApplicationSubmit(event)">
          <h3 style="font-size:1rem; font-weight:700; color:#1e293b; margin-bottom:1rem; border-bottom:1px solid #f1f5f9; padding-bottom:0.5rem;">
            1. Personal Details
          </h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" name="fullName" required value="${state.user?.name || ''}" placeholder="Candidate Full Name" />
            </div>
            <div class="form-group">
              <label>Date of Birth *</label>
              <input type="date" name="dob" required />
            </div>
            <div class="form-group">
              <label>Gender *</label>
              <select name="gender" required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label>Phone Number *</label>
              <input type="tel" name="phone" required placeholder="+91 98765 43210" />
            </div>
            <div class="form-group">
              <label>Contact Email *</label>
              <input type="email" name="email" required value="${state.user?.email || ''}" />
            </div>
            <div class="form-group">
              <label>Guardian / Parent Name *</label>
              <input type="text" name="guardianName" required placeholder="Parent or Guardian" />
            </div>
            <div class="form-group full-width">
              <label>Residential Address *</label>
              <textarea name="address" required rows="2" placeholder="Street address, City, State, PIN Code"></textarea>
            </div>
          </div>

          <h3 style="font-size:1rem; font-weight:700; color:#1e293b; margin:1.5rem 0 1rem; border-bottom:1px solid #f1f5f9; padding-bottom:0.5rem;">
            2. Academic Qualification
          </h3>
          <div class="form-grid">
            <div class="form-group">
              <label>10th Board (e.g. CBSE / ICSE) *</label>
              <input type="text" name="tenthBoard" required placeholder="CBSE / State Board" />
            </div>
            <div class="form-group">
              <label>10th Aggregate Percentage (%) *</label>
              <input type="number" step="0.01" min="0" max="100" name="tenthPercentage" required placeholder="e.g. 91.5" />
            </div>
            <div class="form-group">
              <label>12th / Qualifying Board *</label>
              <input type="text" name="twelfthBoard" required placeholder="CBSE / ISC / State Board" />
            </div>
            <div class="form-group">
              <label>12th Aggregate Percentage (%) *</label>
              <input type="number" step="0.01" min="0" max="100" name="twelfthPercentage" required placeholder="e.g. 94.2" />
            </div>
            <div class="form-group full-width">
              <label>Entrance Exam Score / Percentile (Optional)</label>
              <input type="number" step="0.01" min="0" max="100" name="entranceScore" placeholder="e.g. 96.8" />
            </div>
          </div>

          <h3 style="font-size:1rem; font-weight:700; color:#1e293b; margin:1.5rem 0 1rem; border-bottom:1px solid #f1f5f9; padding-bottom:0.5rem;">
            3. Department Choice & Document Upload
          </h3>
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Select Department / Program Applied For *</label>
              <select name="department" required>
                <option value="">Select Department</option>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label>Upload Class 12 Marksheet / Document * (PDF, PNG, JPG - max 5MB)</label>
              <div class="file-upload-zone" onclick="document.getElementById('marksheetInput').click()">
                <div style="font-size:2rem; margin-bottom:0.5rem;">📄</div>
                <div style="font-weight:600; color:#1e293b;">Click to upload marksheet</div>
                <div style="font-size:0.8rem; color:#64748b; margin-top:0.25rem;">Multer will store this securely on the server with DB reference</div>
                <div id="fileSelectionName" style="font-weight:700; color:#2563eb; margin-top:0.75rem;"></div>
              </div>
              <input
                id="marksheetInput"
                type="file"
                name="document"
                accept=".pdf,image/png,image/jpeg,image/jpg"
                style="display:none;"
                onchange="document.getElementById('fileSelectionName').innerText = this.files[0] ? 'Selected: ' + this.files[0].name + ' (' + (this.files[0].size/1024).toFixed(1) + ' KB)' : ''"
                required
              />
            </div>
          </div>

          <div style="margin-top:2rem; display:flex; justify-content:flex-end; gap:1rem;">
            <button type="button" class="nav-btn btn-outline" onclick="navigateTo('home')">Cancel</button>
            <button type="submit" class="nav-btn btn-primary" style="padding:0.75rem 2rem;">
              Submit Admission Application
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderStudentStatus() {
  const app = state.myApplication;
  if (!app) {
    return `
      <div style="text-align:center; padding:3rem 1rem;">
        <h3>No application submitted yet</h3>
        <p style="color:#64748b; margin:1rem 0;">Ready to apply for admission?</p>
        <button class="nav-btn btn-primary" onclick="navigateTo('apply')">Fill Application Form</button>
      </div>
    `;
  }

  const badgeClass =
    app.status === 'Submitted'
      ? 'badge-submitted'
      : app.status === 'Under Review'
      ? 'badge-review'
      : app.status === 'Selected'
      ? 'badge-selected'
      : 'badge-rejected';

  return `
    <div style="max-width:900px; margin:0 auto;">
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Admission Application Status</h2>
            <p class="card-subtitle">Application Ref ID: #${app._id.slice(-8).toUpperCase()}</p>
          </div>
          <div>
            <span class="badge ${badgeClass}" style="font-size:0.95rem; padding:0.5rem 1rem;">
              ● Current Status: ${app.status}
            </span>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1.5rem; margin-bottom:2rem;">
          <div style="background:#f8fafc; padding:1.25rem; border-radius:8px; border:1px solid #e2e8f0;">
            <div style="font-size:0.8rem; text-transform:uppercase; color:#64748b; font-weight:700;">Department Applied</div>
            <div style="font-size:1.1rem; font-weight:700; color:#0f172a; margin-top:0.35rem;">${app.department}</div>
          </div>
          <div style="background:#f8fafc; padding:1.25rem; border-radius:8px; border:1px solid #e2e8f0;">
            <div style="font-size:0.8rem; text-transform:uppercase; color:#64748b; font-weight:700;">Academic Scores</div>
            <div style="font-size:1.1rem; font-weight:700; color:#0f172a; margin-top:0.35rem;">
              10th: ${app.tenthPercentage}% | 12th: ${app.twelfthPercentage}%
            </div>
          </div>
          <div style="background:#f8fafc; padding:1.25rem; border-radius:8px; border:1px solid #e2e8f0;">
            <div style="font-size:0.8rem; text-transform:uppercase; color:#64748b; font-weight:700;">Uploaded Document</div>
            <div style="margin-top:0.35rem;">
              <a href="${app.document.path}" target="_blank" style="color:#2563eb; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:0.35rem;">
                📎 ${app.document.originalName}
              </a>
            </div>
          </div>
        </div>

        <h3 style="font-size:1.1rem; font-weight:700; color:#1e293b; margin-bottom:1rem;">
          Application Workflow Timeline
        </h3>
        
        <div class="timeline">
          ${(app.statusHistory || [])
            .map(
              (hist, i) => `
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <strong>${hist.status}</strong>
                  <span style="font-size:0.8rem; color:#64748b;">${new Date(hist.timestamp).toLocaleDateString()} ${new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div style="font-size:0.9rem; color:#475569;">${hist.comments || 'Status update logged.'}</div>
                ${hist.updatedBy ? `<div style="font-size:0.75rem; color:#94a3b8; margin-top:0.25rem;">Handled by: ${hist.updatedBy.name || 'Admissions Committee'}</div>` : ''}
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </div>
  `;
}

function renderAdminDashboard() {
  const stats = state.adminStats;
  if (!stats) {
    return `<div style="text-align:center; padding:3rem;">Loading analytics dashboard...</div>`;
  }

  const maxDept = Math.max(...Object.values(stats.departmentCounts || {}), 1);

  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h1 style="font-size:1.75rem; font-weight:800; color:#0f172a;">Admissions Analytics Dashboard</h1>
          <p style="color:#64748b; font-size:0.9rem;">Aggregated insights powered by MongoDB Aggregation Pipeline</p>
        </div>
        <div>
          <button class="nav-btn btn-primary" onclick="navigateTo('admin-applicants')">
            Manage All Applicants
          </button>
        </div>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon" style="background:#eff6ff; color:#2563eb;">👥</div>
          <div>
            <div class="metric-val">${stats.total}</div>
            <div class="metric-label">Total Applicants</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon" style="background:#fffbeb; color:#d97706;">⏳</div>
          <div>
            <div class="metric-val">${stats.statusCounts['Submitted'] || 0}</div>
            <div class="metric-label">New Submissions</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon" style="background:#f0f9ff; color:#0284c7;">🔍</div>
          <div>
            <div class="metric-val">${stats.statusCounts['Under Review'] || 0}</div>
            <div class="metric-label">Under Review</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon" style="background:#f0fdf4; color:#16a34a;">🎓</div>
          <div>
            <div class="metric-val">${stats.statusCounts['Selected'] || 0}</div>
            <div class="metric-label">Selected</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon" style="background:#fef2f2; color:#dc2626;">❌</div>
          <div>
            <div class="metric-val">${stats.statusCounts['Rejected'] || 0}</div>
            <div class="metric-label">Rejected</div>
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(360px, 1fr)); gap:1.5rem;">
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Department Distribution</h3>
              <p class="card-subtitle">Volume of applications per engineering branch</p>
            </div>
          </div>
          <div>
            ${
              Object.keys(stats.departmentCounts || {}).length === 0
                ? `<p style="color:#64748b;">No department records yet.</p>`
                : Object.entries(stats.departmentCounts)
                    .map(([dept, count]) => {
                      const pct = Math.round((count / maxDept) * 100);
                      return `
                  <div class="dept-bar">
                    <div class="dept-bar-label">${dept}</div>
                    <div class="dept-bar-track">
                      <div class="dept-bar-fill" style="width:${pct}%;"></div>
                    </div>
                    <div style="font-weight:700; font-size:0.85rem; width:30px; text-align:right;">${count}</div>
                  </div>
                `;
                    })
                    .join('')
            }
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Academic Merit Summary</h3>
              <p class="card-subtitle">Candidate benchmark metrics</p>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:1.25rem;">
            <div style="background:#f8fafc; padding:1.25rem; border-radius:8px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:600; color:#334155;">Average Class 10th Aggregate</div>
                <div style="font-size:0.8rem; color:#64748b;">Across all submitted applications</div>
              </div>
              <div style="font-size:1.75rem; font-weight:800; color:#2563eb;">${stats.averages?.avgTenth || 0}%</div>
            </div>

            <div style="background:#f8fafc; padding:1.25rem; border-radius:8px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:600; color:#334155;">Average Class 12th Aggregate</div>
                <div style="font-size:0.8rem; color:#64748b;">Primary qualification cutoff benchmark</div>
              </div>
              <div style="font-size:1.75rem; font-weight:800; color:#16a34a;">${stats.averages?.avgTwelfth || 0}%</div>
            </div>

            <div style="background:#f8fafc; padding:1rem; border-radius:8px; border:1px solid #e2e8f0; font-size:0.85rem; color:#475569;">
              💡 <strong>Lab Feature:</strong> Computed in real-time on MongoDB using <code>$facet</code>, <code>$group</code>, and <code>$avg</code>.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderAdminApplicants() {
  const applicants = state.adminApplicants;

  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h1 style="font-size:1.75rem; font-weight:800; color:#0f172a;">Applicant Review Portal</h1>
          <p style="color:#64748b; font-size:0.9rem;">Filter applicants, inspect marksheets, and update admission workflow</p>
        </div>
        <div>
          <button class="nav-btn btn-outline" onclick="navigateTo('admin-dashboard')">
            ← Back to Analytics
          </button>
        </div>
      </div>

      <div class="card" style="margin-bottom:1.5rem; padding:1.25rem;">
        <div style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center;">
          <div style="flex:1; min-width:220px;">
            <input
              type="text"
              placeholder="🔍 Search candidate name, email, or phone..."
              value="${state.filters.search}"
              style="width:100%;"
              oninput="state.filters.search = this.value; fetchAdminApplicants();"
            />
          </div>
          <div>
            <select onchange="state.filters.department = this.value; fetchAdminApplicants();">
              <option value="All" ${state.filters.department === 'All' ? 'selected' : ''}>All Departments</option>
              <option value="Computer Science & Engineering" ${state.filters.department === 'Computer Science & Engineering' ? 'selected' : ''}>Computer Science & Engineering</option>
              <option value="Information Technology" ${state.filters.department === 'Information Technology' ? 'selected' : ''}>Information Technology</option>
              <option value="Electronics & Communication Engineering" ${state.filters.department === 'Electronics & Communication Engineering' ? 'selected' : ''}>Electronics & Communication</option>
              <option value="Mechanical Engineering" ${state.filters.department === 'Mechanical Engineering' ? 'selected' : ''}>Mechanical Engineering</option>
              <option value="Civil Engineering" ${state.filters.department === 'Civil Engineering' ? 'selected' : ''}>Civil Engineering</option>
            </select>
          </div>
          <div>
            <select onchange="state.filters.status = this.value; fetchAdminApplicants();">
              <option value="All" ${state.filters.status === 'All' ? 'selected' : ''}>All Statuses</option>
              <option value="Submitted" ${state.filters.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
              <option value="Under Review" ${state.filters.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
              <option value="Selected" ${state.filters.status === 'Selected' ? 'selected' : ''}>Selected</option>
              <option value="Rejected" ${state.filters.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div class="card" style="padding:0; overflow:hidden;">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Department</th>
                <th>10th / 12th %</th>
                <th>Document</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${
                applicants.length === 0
                  ? `<tr><td colspan="6" style="text-align:center; padding:2.5rem; color:#64748b;">No applicants match the current filter criteria.</td></tr>`
                  : applicants
                      .map(
                        app => `
                <tr>
                  <td>
                    <div style="font-weight:700; color:#0f172a;">${app.fullName}</div>
                    <div style="font-size:0.8rem; color:#64748b;">${app.email} | ${app.phone}</div>
                  </td>
                  <td>
                    <span style="font-size:0.85rem; font-weight:600; color:#334155;">${app.department}</span>
                  </td>
                  <td>
                    <div style="font-size:0.85rem;"><strong>10th:</strong> ${app.tenthPercentage}%</div>
                    <div style="font-size:0.85rem;"><strong>12th:</strong> ${app.twelfthPercentage}%</div>
                  </td>
                  <td>
                    <a href="${app.document?.path}" target="_blank" style="color:#2563eb; text-decoration:none; font-weight:600; font-size:0.85rem; display:inline-flex; align-items:center; gap:0.25rem;">
                      📄 Marksheet
                    </a>
                  </td>
                  <td>
                    <span class="badge ${
                      app.status === 'Submitted'
                        ? 'badge-submitted'
                        : app.status === 'Under Review'
                        ? 'badge-review'
                        : app.status === 'Selected'
                        ? 'badge-selected'
                        : 'badge-rejected'
                    }">
                      ${app.status}
                    </span>
                  </td>
                  <td>
                    <button class="nav-btn btn-outline" style="padding:0.4rem 0.8rem; font-size:0.8rem;" onclick="state.selectedApplicant = ${JSON.stringify(app).replace(/"/g, '&quot;')}; render();">
                      Review & Decide
                    </button>
                  </td>
                </tr>
              `
                      )
                      .join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderReviewModal() {
  const app = state.selectedApplicant;
  if (!app) return '';

  const allowedNextStatuses = {
    Submitted: ['Under Review'],
    'Under Review': ['Selected', 'Rejected'],
    Selected: ['Under Review'],
    Rejected: ['Under Review']
  }[app.status] || [];

  return `
    <div class="modal-overlay" onclick="if(event.target === this) { state.selectedApplicant = null; render(); }">
      <div class="modal">
        <div class="card-header">
          <div>
            <h3 class="card-title">Review Applicant: ${app.fullName}</h3>
            <p class="card-subtitle">Current Status: <strong style="color:#2563eb;">${app.status}</strong></p>
          </div>
          <button class="nav-btn" style="padding:0.25rem 0.5rem;" onclick="state.selectedApplicant = null; render();">✕</button>
        </div>

        <div style="margin-bottom:1.5rem; font-size:0.9rem; line-height:1.6;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; background:#f8fafc; padding:1rem; border-radius:8px;">
            <div><strong>Email:</strong> ${app.email}</div>
            <div><strong>Phone:</strong> ${app.phone}</div>
            <div><strong>Gender / DOB:</strong> ${app.gender} (${new Date(app.dob).toLocaleDateString()})</div>
            <div><strong>Guardian:</strong> ${app.guardianName}</div>
            <div><strong>10th Board:</strong> ${app.tenthBoard} (${app.tenthPercentage}%)</div>
            <div><strong>12th Board:</strong> ${app.twelfthBoard} (${app.twelfthPercentage}%)</div>
            <div style="grid-column:1 / -1;"><strong>Department:</strong> ${app.department}</div>
            <div style="grid-column:1 / -1;"><strong>Address:</strong> ${app.address}</div>
            <div style="grid-column:1 / -1;">
              <strong>Marksheet:</strong> 
              <a href="${app.document?.path}" target="_blank" style="color:#2563eb; font-weight:600;">
                📎 Open ${app.document?.originalName} in new tab
              </a>
            </div>
          </div>
        </div>

        <div style="border-top:1px solid #e2e8f0; padding-top:1.25rem;">
          <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:0.75rem; color:#0f172a;">
            Transition Application Status (Workflow Engine)
          </h4>
          
          ${
            allowedNextStatuses.length === 0
              ? `<p style="color:#64748b; font-size:0.85rem;">No further status transitions allowed from '${app.status}'.</p>`
              : `
            <form onsubmit="event.preventDefault(); handleStatusChange('${app._id}', this.nextStatus.value, this.comments.value);">
              <div class="form-group" style="margin-bottom:1rem;">
                <label>Next Valid State</label>
                <select name="nextStatus" required>
                  ${allowedNextStatuses.map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>
              </div>

              <div class="form-group" style="margin-bottom:1.25rem;">
                <label>Review Notes / Committee Feedback</label>
                <textarea name="comments" rows="2" placeholder="e.g. Verified marksheets and cutoffs. Approved."></textarea>
              </div>

              <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
                <button type="button" class="nav-btn btn-outline" onclick="state.selectedApplicant = null; render();">Cancel</button>
                <button type="submit" class="nav-btn btn-primary">Save & Apply Status</button>
              </div>
            </form>
          `
          }
        </div>
      </div>
    </div>
  `;
}

// Master Render Function
function render() {
  const root = document.getElementById('app');
  let viewHtml = '';

  switch (state.currentView) {
    case 'home':
      viewHtml = renderHome();
      break;
    case 'login':
      viewHtml = renderLogin();
      break;
    case 'register':
      viewHtml = renderRegister();
      break;
    case 'apply':
      viewHtml = renderApplyForm();
      break;
    case 'my-status':
      viewHtml = renderStudentStatus();
      break;
    case 'admin-dashboard':
      viewHtml = renderAdminDashboard();
      break;
    case 'admin-applicants':
      viewHtml = renderAdminApplicants();
      break;
    default:
      viewHtml = renderHome();
  }

  root.innerHTML = `
    ${renderNavbar()}
    ${renderDemoBar()}
    <main class="main-content">
      ${renderAlert()}
      ${viewHtml}
    </main>
    ${renderReviewModal()}
    <footer>
      <div style="display:flex; align-items:center; justify-content:center; gap:0.5rem; margin-bottom:0.35rem;">
        <img src="/logo.png" alt="IEM" style="height:22px; vertical-align:middle;" />
        <strong style="color:#1e293b;">Institute of Engineering & Management (IEM)</strong>
      </div>
      <span>Online Admission System (POC) &bull; Software Engineering Lab (PCCCS504) &bull; MEAN Stack Architecture</span>
    </footer>
  `;
}

// Global exposure for inline events
window.navigateTo = navigateTo;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.handleApplicationSubmit = handleApplicationSubmit;
window.handleStatusChange = handleStatusChange;
window.fetchAdminApplicants = fetchAdminApplicants;
window.state = state;
window.render = render;

// Auto-navigate if already authenticated on initial page load
if (state.token && state.user) {
  if (state.user.role === 'admin') {
    navigateTo('admin-dashboard');
  } else {
    navigateTo('my-status');
  }
} else {
  render();
}

