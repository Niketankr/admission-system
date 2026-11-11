// IEM Admissions Portal Engine - Institute of Engineering & Management, Kolkata
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
  selectedBranchForApply: null,
  alert: null,
  showStaffModal: false
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
    state.showStaffModal = false;
    localStorage.setItem('admission_token', res.token);
    localStorage.setItem('admission_user', JSON.stringify(res.user));

    showAlert(`Welcome, ${res.user.name}!`, 'success');
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

    showAlert('Student registration successful!', 'success');
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
  showAlert('You have been signed out successfully.', 'info');
  navigateTo('home');
}

// Navigation router
async function navigateTo(view, targetId = null) {
  state.currentView = view;
  state.alert = null;

  if (view === 'my-status' && state.token) {
    try {
      const res = await apiCall('/applications/my');
      state.myApplication = res.application;
    } catch (err) {
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

  if (view === 'home' && targetId) {
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
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
    showAlert('Please upload your Class 12 marksheet or qualifying rankcard document.', 'error');
    return;
  }

  try {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerText = 'Submitting Application...';

    const res = await apiCall('/applications', {
      method: 'POST',
      body: formData
    });

    state.myApplication = res.application;
    showAlert('Application successfully registered and submitted for verification!', 'success');
    navigateTo('my-status');
  } catch (err) {
    showAlert(err.message, 'error');
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Submit B.Tech Admission Application';
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
            <span class="brand-title">IEM Admissions 2026–27</span>
            <span class="brand-subtext">Institute of Engineering & Management, Kolkata</span>
          </div>
        </div>
        
        <div class="nav-links">
          ${
            !isAuth
              ? `
            <a class="nav-link-item" onclick="navigateTo('home')">Home</a>
            <a class="nav-link-item" onclick="navigateTo('home', 'programmes')">Programmes & Fees</a>
            <a class="nav-link-item" onclick="navigateTo('home', 'placements')">Placements</a>
            <a class="nav-link-item" onclick="navigateTo('home', 'process')">Application Process</a>
            <a class="nav-link-item" onclick="navigateTo('home', 'about')">About IEM</a>
            <a class="nav-link-item" onclick="navigateTo('home', 'contact')">Contact</a>
            <button class="nav-btn btn-outline" style="margin-left:0.5rem;" onclick="navigateTo('login')">Login</button>
            <button class="nav-btn btn-primary" onclick="navigateTo('register')">Apply Now</button>
          `
              : isAdmin
              ? `
            <button class="nav-btn ${state.currentView === 'admin-dashboard' ? 'btn-primary' : 'btn-outline'}" onclick="navigateTo('admin-dashboard')">📊 Admissions Analytics</button>
            <button class="nav-btn ${state.currentView === 'admin-applicants' ? 'btn-primary' : 'btn-outline'}" onclick="navigateTo('admin-applicants')">📋 Review Applicants</button>
            <span style="font-size:0.85rem; color:#1e293b; font-weight:700; background:#f1f5f9; padding:0.35rem 0.75rem; border-radius:9999px;">
              Prof. Dr. Satyajit Chakraborty
            </span>
            <button class="nav-btn btn-outline" onclick="handleLogout()">Sign Out</button>
          `
              : `
            <button class="nav-btn ${state.currentView === 'my-status' ? 'btn-primary' : 'btn-outline'}" onclick="navigateTo('my-status')">📄 My Application Status</button>
            ${!state.myApplication ? `<button class="nav-btn btn-primary" onclick="navigateTo('apply')">📝 Fill Form</button>` : ''}
            <span style="font-size:0.85rem; color:#1e293b; font-weight:700; background:#f1f5f9; padding:0.35rem 0.75rem; border-radius:9999px;">
              Student: ${state.user.name}
            </span>
            <button class="nav-btn btn-outline" onclick="handleLogout()">Sign Out</button>
          `
          }
        </div>
      </div>
    </header>
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

// B.Tech Programme Data (from Screenshot 2)
const BTECH_PROGRAMMES = [
  {
    code: 'BTECH-CSE',
    title: 'B.Tech - CSE',
    deptName: 'B.Tech - Computer Science & Engineering (CSE)',
    subtitle: 'Computer Science & Engineering (CSE)',
    desc: 'NBA Accredited • Core Computing, Cloud Systems & Software Engineering',
    semesterFee: '₹92,000',
    totalFee: '₹761,000',
    campus: 'Salt Lake Sector V (Gurukul Campus)'
  },
  {
    code: 'BTECH-AIML',
    title: 'B.Tech - CSE (AI & ML)',
    deptName: 'B.Tech - CSE (AI & ML)',
    subtitle: 'Computer Science & Engineering (AI & ML)',
    desc: 'Deep Learning, Generative AI, Computer Vision & Data Engineering Labs',
    semesterFee: '₹95,000',
    totalFee: '₹785,000',
    campus: 'Salt Lake Sector V (Gurukul Campus)'
  },
  {
    code: 'BTECH-ECE',
    title: 'B.Tech - ECE',
    deptName: 'B.Tech - Electronics & Communication Engineering (ECE)',
    subtitle: 'Electronics & Communication Engineering (ECE)',
    desc: 'NBA Accredited • VLSI Design, Embedded Systems, 5G & IoT Networks',
    semesterFee: '₹86,000',
    totalFee: '₹713,000',
    campus: 'Salt Lake Sector V (Gurukul Campus)'
  },
  {
    code: 'BTECH-IT',
    title: 'B.Tech - IT',
    deptName: 'B.Tech - Information Technology (IT)',
    subtitle: 'Information Technology (IT)',
    desc: 'Enterprise Architecture, Cybersecurity, Full-Stack & DevOps Engineering',
    semesterFee: '₹88,000',
    totalFee: '₹729,000',
    campus: 'Salt Lake Sector V (Management House)'
  },
  {
    code: 'BTECH-CSBS',
    title: 'B.Tech - CSBS',
    deptName: 'B.Tech - Computer Science & Business Systems (CSBS)',
    subtitle: 'Computer Science & Business Systems (CSBS)',
    desc: 'Industry-Aligned Curriculum in Analytics, FinTech & Enterprise Systems',
    semesterFee: '₹88,000',
    totalFee: '₹729,000',
    campus: 'Salt Lake Sector V (Management House)'
  },
  {
    code: 'BTECH-ME',
    title: 'B.Tech - Mechanical',
    deptName: 'B.Tech - Mechanical Engineering (ME)',
    subtitle: 'Mechanical Engineering (ME)',
    desc: 'Robotics, Automation, CAD/CAM, Thermal Systems & Electric Vehicles',
    semesterFee: '₹82,000',
    totalFee: '₹685,000',
    campus: 'Salt Lake Sector V (Gurukul Campus)'
  }
];

// Views
function renderHome() {
  return `
    <div>
      <!-- Hero Section (Screenshot 1) -->
      <section class="hero-wrapper">
        <div>
          <div class="announcement-pill">
            <span class="pill-dot"></span>
            <span>Undergraduate B.Tech Admissions Open for the 2026–27 Academic Session</span>
          </div>

          <h1 class="hero-title">
            Institute of Engineering & Management (IEM), Kolkata
          </h1>
          <div class="hero-subtitle">
            Online Undergraduate Admission Portal
          </div>
          <p class="hero-desc">
            Welcome to the centralized online admission portal of the Institute of Engineering & Management, Salt Lake Sector V, Kolkata. Prospective students can apply online for AICTE-approved 4-Year B.Tech degree programmes, upload academic transcripts, confirm application fee payment, and track admission status through a unified portal.
          </p>

          <div class="hero-actions">
            <button class="nav-btn btn-primary" style="padding:0.75rem 2rem; font-size:1rem;" onclick="${state.token ? "navigateTo('apply')" : "navigateTo('register')"}">
              Apply Now
            </button>
            <button class="nav-btn btn-outline" style="padding:0.75rem 1.75rem; font-size:1rem;" onclick="${state.token ? (state.user?.role === 'admin' ? "navigateTo('admin-dashboard')" : "navigateTo('my-status')") : "navigateTo('login')"}">
              Login to Portal
            </button>
          </div>

          <div class="trust-badges">
            <div class="trust-badge-item">
              <strong>NAAC 'A' Grade</strong>
              <span>Accredited Institution</span>
            </div>
            <div class="trust-badge-item">
              <strong>NBA Accredited</strong>
              <span>Flagship B.Tech Programmes</span>
            </div>
            <div class="trust-badge-item">
              <strong>Salt Lake Sector V</strong>
              <span>Gurukul & Management House Campuses</span>
            </div>
          </div>
        </div>

        <!-- Right Card: Key Information (Screenshot 1) -->
        <div>
          <div class="key-info-card">
            <div class="key-info-header">
              <span class="key-info-session">ACADEMIC SESSION 2026–27</span>
              <span class="admissions-open-badge">Admissions Open</span>
            </div>
            <h2 class="key-info-title">Admission Key Information</h2>

            <table class="info-table">
              <tbody>
                <tr class="info-row">
                  <td class="info-label">Qualifying Examination</td>
                  <td class="info-value">10+2 (CBSE / ISC / WBCHSE or Equivalent)</td>
                </tr>
                <tr class="info-row">
                  <td class="info-label">Accepted Entrance Exams</td>
                  <td class="info-value">IEMJEE / WBJEE / JEE (Main)</td>
                </tr>
                <tr class="info-row">
                  <td class="info-label">Minimum Qualifying Marks</td>
                  <td class="info-value">45% in Class XII (Physics + Maths)</td>
                </tr>
                <tr class="info-row">
                  <td class="info-label">Minimum Entrance Cutoff</td>
                  <td class="info-value">40 / 100</td>
                </tr>
                <tr class="info-row">
                  <td class="info-label">Application Processing Fee</td>
                  <td class="info-value">₹1500 (One-Time)</td>
                </tr>
              </tbody>
            </table>

            <div style="margin-top:1.5rem;">
              <button class="nav-btn btn-primary" style="width:100%; justify-content:center; padding:0.75rem;" onclick="${state.token ? "navigateTo('apply')" : "navigateTo('register')"}">
                Start B.Tech Online Application
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Programmes & Fees Section (Screenshot 2) -->
      <section id="programmes" class="section-wrapper">
        <div class="section-header">
          <span class="section-tag">Programmes Offered</span>
          <h2 class="section-title">Programmes & Fee Structure (B.Tech Only)</h2>
          <p class="section-subtitle">AICTE Approved 4-Year Full-Time Degree Programmes affiliated to MAKAUT, Autonomous Curriculum</p>
        </div>

        <div class="programmes-grid">
          ${BTECH_PROGRAMMES.map(
            prog => `
            <div class="programme-card">
              <div class="prog-badges">
                <span class="prog-badge-code">${prog.code}</span>
                <span class="prog-badge-duration">4 Years (8 Semesters)</span>
              </div>
              <h3 class="prog-title">${prog.title}</h3>
              <div class="prog-subtitle">${prog.subtitle}</div>
              <p class="prog-desc">${prog.desc}</p>
              
              <div class="prog-fees-box">
                <div>
                  <div class="fee-item-label">Semester Tuition</div>
                  <div class="fee-item-val">${prog.semesterFee}</div>
                </div>
                <div>
                  <div class="fee-item-label">Total Programme Fee</div>
                  <div class="fee-item-val">${prog.totalFee}</div>
                </div>
                <div>
                  <div class="fee-item-label">Campus</div>
                  <div class="fee-item-campus">${prog.campus}</div>
                </div>
              </div>

              <button class="nav-btn btn-outline" style="width:100%; justify-content:center; font-weight:600;" onclick="selectBranchAndApply('${prog.deptName}')">
                Apply for this Branch →
              </button>
            </div>
          `
          ).join('')}
        </div>
      </section>

      <!-- Placements Statistics Section -->
      <section id="placements" class="section-wrapper">
        <div class="section-header">
          <span class="section-tag">Career Outcomes</span>
          <h2 class="section-title">Placement Statistics (Batch 2025–26)</h2>
          <p class="section-subtitle">Consistently ranked among the highest placement conversion rates in Eastern India</p>
        </div>

        <div class="placement-kpis">
          <div class="kpi-card">
            <div class="kpi-number" style="color:#2563eb;">₹72 LPA</div>
            <div class="kpi-label">Highest International CTC</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-number" style="color:#16a34a;">₹9.2 LPA</div>
            <div class="kpi-label">Average B.Tech CTC Across Branches</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-number" style="color:#0284c7;">98.4%</div>
            <div class="kpi-label">Placement Record</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-number" style="color:#d97706;">1,450+</div>
            <div class="kpi-label">Campus Placement Offers</div>
          </div>
        </div>

        <div class="card" style="padding:0; overflow:hidden; margin-bottom:2rem;">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>B.Tech Branch</th>
                  <th>Placement Rate</th>
                  <th>Highest Package</th>
                  <th>Average Package</th>
                  <th>Key Corporate Recruiters</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Computer Science & Engineering (CSE)</strong></td>
                  <td><span class="badge badge-selected">99.4%</span></td>
                  <td><strong>₹72 LPA</strong></td>
                  <td>₹10.8 LPA</td>
                  <td>Google, Microsoft, Amazon, Oracle, Adobe</td>
                </tr>
                <tr>
                  <td><strong>CSE (Artificial Intelligence & Machine Learning)</strong></td>
                  <td><span class="badge badge-selected">99.1%</span></td>
                  <td><strong>₹48 LPA</strong></td>
                  <td>₹10.4 LPA</td>
                  <td>Microsoft, Amazon, AMD, Intel, NVIDIA</td>
                </tr>
                <tr>
                  <td><strong>Information Technology (IT)</strong></td>
                  <td><span class="badge badge-selected">98.7%</span></td>
                  <td><strong>₹42 LPA</strong></td>
                  <td>₹9.8 LPA</td>
                  <td>Cisco, Adobe, Morgan Stanley, PwC</td>
                </tr>
                <tr>
                  <td><strong>Computer Science & Business Systems (CSBS)</strong></td>
                  <td><span class="badge badge-selected">98.2%</span></td>
                  <td><strong>₹36 LPA</strong></td>
                  <td>₹9.4 LPA</td>
                  <td>TCS Digital, Deloitte, Goldman Sachs</td>
                </tr>
                <tr>
                  <td><strong>Electronics & Communication Engineering (ECE)</strong></td>
                  <td><span class="badge badge-selected">96.8%</span></td>
                  <td><strong>₹28 LPA</strong></td>
                  <td>₹8.6 LPA</td>
                  <td>Qualcomm, Texas Instruments, Intel, Samsung</td>
                </tr>
                <tr>
                  <td><strong>Mechanical Engineering (ME)</strong></td>
                  <td><span class="badge badge-selected">94.5%</span></td>
                  <td><strong>₹18 LPA</strong></td>
                  <td>₹7.4 LPA</td>
                  <td>Tata Motors, L&T, Siemens, Hero MotoCorp</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style="text-align:center;">
          <span style="font-size:0.85rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">
            Major Campus Recruiters
          </span>
          <div class="recruiters-marquee">
            <span class="recruiter-pill">Google</span>
            <span class="recruiter-pill">Microsoft</span>
            <span class="recruiter-pill">Amazon</span>
            <span class="recruiter-pill">Adobe</span>
            <span class="recruiter-pill">Oracle</span>
            <span class="recruiter-pill">Cisco</span>
            <span class="recruiter-pill">Deloitte</span>
            <span class="recruiter-pill">PwC</span>
            <span class="recruiter-pill">Goldman Sachs</span>
            <span class="recruiter-pill">TCS Digital</span>
            <span class="recruiter-pill">Infosys</span>
            <span class="recruiter-pill">Cognizant</span>
            <span class="recruiter-pill">Capgemini</span>
            <span class="recruiter-pill">LTI Mindtree</span>
            <span class="recruiter-pill">Qualcomm</span>
            <span class="recruiter-pill">Samsung</span>
          </div>
        </div>
      </section>

      <!-- Application Process Section -->
      <section id="process" class="section-wrapper">
        <div class="section-header">
          <span class="section-tag">Step-by-Step Flow</span>
          <h2 class="section-title">Undergraduate Admission Process</h2>
          <p class="section-subtitle">Centralized online procedure for B.Tech admission counselling & allotment</p>
        </div>

        <div class="process-grid">
          <div class="process-step-card">
            <div class="process-step-num">1</div>
            <h4 class="process-step-title">Online Registration</h4>
            <p class="process-step-desc">Register with a valid email ID and mobile number to generate your candidate profile.</p>
          </div>
          <div class="process-step-card">
            <div class="process-step-num">2</div>
            <h4 class="process-step-title">Application Form</h4>
            <p class="process-step-desc">Provide Class 10 & 12 board marks, entrance examination rank, and branch preferences.</p>
          </div>
          <div class="process-step-card">
            <div class="process-step-num">3</div>
            <h4 class="process-step-title">Upload Documents</h4>
            <p class="process-step-desc">Upload scanned Class 12 marksheet and entrance rankcard in PDF/image format.</p>
          </div>
          <div class="process-step-card">
            <div class="process-step-num">4</div>
            <h4 class="process-step-title">Merit Scrutiny</h4>
            <p class="process-step-desc">Admissions Committee headed by Prof. Dr. Satyajit Chakraborty evaluates eligibility.</p>
          </div>
          <div class="process-step-card">
            <div class="process-step-num">5</div>
            <h4 class="process-step-title">Seat Allotment</h4>
            <p class="process-step-desc">Selected applicants receive provisional admission letters and confirm enrollment.</p>
          </div>
        </div>
      </section>

      <!-- About IEM Section -->
      <section id="about" class="section-wrapper">
        <div class="section-header">
          <span class="section-tag">Institutional Heritage</span>
          <h2 class="section-title">About IEM Kolkata</h2>
          <p class="section-subtitle">Pioneering quality technical education since 1989</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:2rem;">
          <div class="card" style="margin:0;">
            <h3 style="font-size:1.15rem; font-weight:700; color:#0f172a; margin-bottom:0.75rem;">Excellence in Engineering Education</h3>
            <p style="font-size:0.9rem; color:#475569; line-height:1.6; margin-bottom:1rem;">
              The Institute of Engineering & Management (IEM) is the oldest private engineering college in West Bengal. With over three decades of academic distinction, IEM has consistently ranked among top tier institutions under MAKAUT and NIRF rankings.
            </p>
            <p style="font-size:0.9rem; color:#475569; line-height:1.6;">
              Under the visionary leadership of <strong>Prof. Dr. Satyajit Chakraborty</strong>, the institute has established international collaborations with Harvard, MIT, and leading global research laboratories.
            </p>
          </div>
          <div class="card" style="margin:0;">
            <h3 style="font-size:1.15rem; font-weight:700; color:#0f172a; margin-bottom:0.75rem;">World-Class Salt Lake Sector V Infrastructure</h3>
            <p style="font-size:0.9rem; color:#475569; line-height:1.6; margin-bottom:1rem;">
              Located at the heart of Kolkata's IT hub, IEM operates across two modern campuses: the Gurukul Campus and Management House. Students benefit from immersive exposure to over 500 tech multinationals operating in Sector V.
            </p>
            <ul style="font-size:0.875rem; color:#334155; padding-left:1.25rem; line-height:1.8;">
              <li>AI & Robotics Innovation Centres</li>
              <li>High-Performance Computing Cluster</li>
              <li>State-of-the-Art Digital Central Library</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contact" class="section-wrapper">
        <div class="section-header">
          <span class="section-tag">Get in Touch</span>
          <h2 class="section-title">Admissions Office & Campus Contacts</h2>
          <p class="section-subtitle">Our admission counselors are available Monday to Saturday, 9:30 AM to 5:30 PM</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem;">
          <div class="card" style="margin:0;">
            <h4 style="font-weight:700; color:#0f172a; margin-bottom:0.5rem;">Gurukul Campus</h4>
            <p style="font-size:0.85rem; color:#64748b; line-height:1.6;">
              Y-12, Block EP, Sector V, Salt Lake Electronics Complex, Kolkata, West Bengal 700091
            </p>
            <div style="margin-top:0.75rem; font-size:0.85rem; font-weight:600; color:#2563eb;">
              📞 +91 33 2357 2059 / 2995
            </div>
          </div>
          <div class="card" style="margin:0;">
            <h4 style="font-weight:700; color:#0f172a; margin-bottom:0.5rem;">Management House</h4>
            <p style="font-size:0.85rem; color:#64748b; line-height:1.6;">
              D-1, Management House, Sector V, Salt Lake, Kolkata, West Bengal 700091
            </p>
            <div style="margin-top:0.75rem; font-size:0.85rem; font-weight:600; color:#2563eb;">
              📞 +91 33 2357 2969
            </div>
          </div>
          <div class="card" style="margin:0;">
            <h4 style="font-weight:700; color:#0f172a; margin-bottom:0.5rem;">Central Admissions Desk</h4>
            <p style="font-size:0.85rem; color:#64748b; line-height:1.6;">
              Admissions Helpline: <strong>admissions@iem.edu.in</strong><br/>
              Examination Cell: <strong>iemjee@iem.edu.in</strong>
            </p>
            <div style="margin-top:0.75rem; font-size:0.85rem; font-weight:600; color:#16a34a;">
              🟢 Helpline Active for Session 2026–27
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function selectBranchAndApply(deptName) {
  state.selectedBranchForApply = deptName;
  if (!state.token) {
    navigateTo('register');
  } else {
    navigateTo('apply');
  }
}

function renderLogin() {
  return `
    <div style="max-width:440px; margin:3rem auto;">
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Portal Sign In</h2>
            <p class="card-subtitle">Access your B.Tech admission profile or review applications</p>
          </div>
        </div>
        <form onsubmit="event.preventDefault(); handleLogin(this.email.value, this.password.value);">
          <div class="form-group" style="margin-bottom:1rem;">
            <label>Registered Email Address</label>
            <input type="email" name="email" required placeholder="e.g. rohan@example.com" />
          </div>
          <div class="form-group" style="margin-bottom:1.5rem;">
            <label>Password</label>
            <input type="password" name="password" required placeholder="••••••••" />
          </div>
          <button type="submit" class="nav-btn btn-primary" style="width:100%; justify-content:center; padding:0.75rem;">
            Sign In to Account
          </button>
        </form>
        <div style="text-align:center; margin-top:1.25rem; font-size:0.85rem; color:#64748b;">
          New applicant? <a href="#" style="color:#2563eb; text-decoration:none; font-weight:600;" onclick="navigateTo('register')">Register online</a>
        </div>
      </div>
    </div>
  `;
}

function renderRegister() {
  return `
    <div style="max-width:460px; margin:3rem auto;">
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Student Registration</h2>
            <p class="card-subtitle">Create your applicant profile for B.Tech Admission 2026–27</p>
          </div>
        </div>
        <form onsubmit="event.preventDefault(); handleRegister(this.name.value, this.email.value, this.password.value, 'applicant');">
          <div class="form-group" style="margin-bottom:1rem;">
            <label>Candidate Full Name *</label>
            <input type="text" name="name" required placeholder="As in Class 10 Certificate" />
          </div>
          <div class="form-group" style="margin-bottom:1rem;">
            <label>Email Address *</label>
            <input type="email" name="email" required placeholder="active-email@example.com" />
          </div>
          <div class="form-group" style="margin-bottom:1.5rem;">
            <label>Create Password *</label>
            <input type="password" name="password" required minlength="6" placeholder="Minimum 6 characters" />
          </div>
          <button type="submit" class="nav-btn btn-primary" style="width:100%; justify-content:center; padding:0.75rem;">
            Create Profile & Continue
          </button>
        </form>
        <div style="text-align:center; margin-top:1.25rem; font-size:0.85rem; color:#64748b;">
          Already registered? <a href="#" style="color:#2563eb; text-decoration:none; font-weight:600;" onclick="navigateTo('login')">Sign in here</a>
        </div>
      </div>
    </div>
  `;
}

function renderApplyForm() {
  const defaultDept = state.selectedBranchForApply || 'B.Tech - Computer Science & Engineering (CSE)';

  return `
    <div style="max-width:850px; margin:1rem auto 3rem;">
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">B.Tech Admission Application (Session 2026–27)</h2>
            <p class="card-subtitle">Institute of Engineering & Management, Kolkata</p>
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
              <label>Father / Guardian Name *</label>
              <input type="text" name="guardianName" required placeholder="Parent or Guardian" />
            </div>
            <div class="form-group full-width">
              <label>Permanent Residential Address *</label>
              <textarea name="address" required rows="2" placeholder="Street, City, State, PIN Code"></textarea>
            </div>
          </div>

          <h3 style="font-size:1rem; font-weight:700; color:#1e293b; margin:1.5rem 0 1rem; border-bottom:1px solid #f1f5f9; padding-bottom:0.5rem;">
            2. Academic Qualification (10+2 & Entrance)
          </h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Class 10 Board *</label>
              <input type="text" name="tenthBoard" required placeholder="CBSE / ICSE / WBCHSE" />
            </div>
            <div class="form-group">
              <label>Class 10 Aggregate (%) *</label>
              <input type="number" step="0.01" min="0" max="100" name="tenthPercentage" required placeholder="e.g. 92.5" />
            </div>
            <div class="form-group">
              <label>Class 12 Qualifying Board *</label>
              <input type="text" name="twelfthBoard" required placeholder="CBSE / ISC / WBCHSE" />
            </div>
            <div class="form-group">
              <label>Class 12 Aggregate Percentage (%) *</label>
              <input type="number" step="0.01" min="0" max="100" name="twelfthPercentage" required placeholder="e.g. 94.0" />
            </div>
            <div class="form-group full-width">
              <label>Entrance Exam Score / Percentile (IEMJEE / WBJEE / JEE Main)</label>
              <input type="number" step="0.01" min="0" max="100" name="entranceScore" placeholder="Score / Percentile out of 100" />
            </div>
          </div>

          <h3 style="font-size:1rem; font-weight:700; color:#1e293b; margin:1.5rem 0 1rem; border-bottom:1px solid #f1f5f9; padding-bottom:0.5rem;">
            3. B.Tech Branch Preference & Document Upload
          </h3>
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Select B.Tech Programme Applied For *</label>
              <select name="department" required>
                ${BTECH_PROGRAMMES.map(
                  p => `<option value="${p.deptName}" ${p.deptName === defaultDept ? 'selected' : ''}>${p.deptName} (${p.campus})</option>`
                ).join('')}
              </select>
            </div>
            <div class="form-group full-width">
              <label>Upload Class 12 Marksheet / Transcript * (PDF, PNG, JPG - max 5MB)</label>
              <div class="file-upload-zone" onclick="document.getElementById('marksheetInput').click()">
                <div style="font-size:2rem; margin-bottom:0.5rem;">📄</div>
                <div style="font-weight:600; color:#1e293b;">Click to upload academic transcript or mark statement</div>
                <div style="font-size:0.8rem; color:#64748b; margin-top:0.25rem;">Accepted formats: PDF, PNG, JPEG (Maximum 5MB)</div>
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
              Submit B.Tech Admission Application
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
      <div style="text-align:center; padding:4rem 1rem;">
        <h3>No application submitted yet</h3>
        <p style="color:#64748b; margin:1rem 0;">Ready to apply for B.Tech admission at IEM Kolkata?</p>
        <button class="nav-btn btn-primary" onclick="navigateTo('apply')">Fill B.Tech Application Form</button>
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
    <div style="max-width:900px; margin:1rem auto 3rem;">
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">B.Tech Admission Status (Session 2026–27)</h2>
            <p class="card-subtitle">Application Reference ID: #${app._id.slice(-8).toUpperCase()}</p>
          </div>
          <div>
            <span class="badge ${badgeClass}" style="font-size:0.95rem; padding:0.5rem 1rem;">
              ● ${app.status}
            </span>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1.5rem; margin-bottom:2rem;">
          <div style="background:#f8fafc; padding:1.25rem; border-radius:8px; border:1px solid #e2e8f0;">
            <div style="font-size:0.8rem; text-transform:uppercase; color:#64748b; font-weight:700;">Programme Applied</div>
            <div style="font-size:1.05rem; font-weight:700; color:#0f172a; margin-top:0.35rem;">${app.department}</div>
          </div>
          <div style="background:#f8fafc; padding:1.25rem; border-radius:8px; border:1px solid #e2e8f0;">
            <div style="font-size:0.8rem; text-transform:uppercase; color:#64748b; font-weight:700;">Academic Records</div>
            <div style="font-size:1.05rem; font-weight:700; color:#0f172a; margin-top:0.35rem;">
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
          Application Scrutiny & Allotment Timeline
        </h3>
        
        <div class="timeline">
          ${(app.statusHistory || [])
            .map(
              hist => `
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <strong>${hist.status}</strong>
                  <span style="font-size:0.8rem; color:#64748b;">${new Date(hist.timestamp).toLocaleDateString()} ${new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div style="font-size:0.9rem; color:#475569;">${hist.comments || 'Status update logged.'}</div>
                ${hist.updatedBy ? `<div style="font-size:0.75rem; color:#64748b; margin-top:0.25rem;">Reviewed by: <strong>${hist.updatedBy.name || 'Admissions Committee'}</strong></div>` : ''}
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
    return `<div style="text-align:center; padding:4rem;">Loading admissions statistics...</div>`;
  }

  const maxDept = Math.max(...Object.values(stats.departmentCounts || {}), 1);

  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h1 style="font-size:1.75rem; font-weight:800; color:#0f172a;">Admissions Committee Dashboard</h1>
          <p style="color:#64748b; font-size:0.9rem;">Overview of B.Tech Applications • Institute of Engineering & Management, Kolkata</p>
        </div>
        <div>
          <button class="nav-btn btn-primary" onclick="navigateTo('admin-applicants')">
            Manage & Review Applicants
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
            <div class="metric-label">New Applications</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon" style="background:#f0f9ff; color:#0284c7;">🔍</div>
          <div>
            <div class="metric-val">${stats.statusCounts['Under Review'] || 0}</div>
            <div class="metric-label">Under Verification</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon" style="background:#f0fdf4; color:#16a34a;">🎓</div>
          <div>
            <div class="metric-val">${stats.statusCounts['Selected'] || 0}</div>
            <div class="metric-label">Selected / Allotted</div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon" style="background:#fef2f2; color:#dc2626;">❌</div>
          <div>
            <div class="metric-val">${stats.statusCounts['Rejected'] || 0}</div>
            <div class="metric-label">Ineligible</div>
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(360px, 1fr)); gap:1.5rem;">
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">B.Tech Branch Demand Distribution</h3>
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
                    <div class="dept-bar-label" title="${dept}">${dept}</div>
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
              <h3 class="card-title">Candidate Merit Benchmark</h3>
              <p class="card-subtitle">Aggregated cutoff averages across applicant pool</p>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:1.25rem;">
            <div style="background:#f8fafc; padding:1.25rem; border-radius:8px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:600; color:#334155;">Average Class 10th Aggregate</div>
                <div style="font-size:0.8rem; color:#64748b;">Secondary board merit benchmark</div>
              </div>
              <div style="font-size:1.75rem; font-weight:800; color:#2563eb;">${stats.averages?.avgTenth || 0}%</div>
            </div>

            <div style="background:#f8fafc; padding:1.25rem; border-radius:8px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:600; color:#334155;">Average Class 12th Aggregate</div>
                <div style="font-size:0.8rem; color:#64748b;">Higher secondary qualifying cutoff</div>
              </div>
              <div style="font-size:1.75rem; font-weight:800; color:#16a34a;">${stats.averages?.avgTwelfth || 0}%</div>
            </div>

            <div style="background:#eff6ff; padding:1rem; border-radius:8px; border:1px solid #bfdbfe; font-size:0.85rem; color:#1e40af;">
              🏛️ <strong>Admissions Committee Note:</strong> Minimum qualifying threshold is 45% aggregate in 10+2 with Physics & Mathematics as mandatory subjects.
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
          <h1 style="font-size:1.75rem; font-weight:800; color:#0f172a;">Candidate Verification & Allotment</h1>
          <p style="color:#64748b; font-size:0.9rem;">Review uploaded marksheets and issue provisional admission decisions</p>
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
              <option value="All" ${state.filters.department === 'All' ? 'selected' : ''}>All B.Tech Branches</option>
              ${BTECH_PROGRAMMES.map(
                p => `<option value="${p.deptName}" ${state.filters.department === p.deptName ? 'selected' : ''}>${p.title}</option>`
              ).join('')}
            </select>
          </div>
          <div>
            <select onchange="state.filters.status = this.value; fetchAdminApplicants();">
              <option value="All" ${state.filters.status === 'All' ? 'selected' : ''}>All Statuses</option>
              <option value="Submitted" ${state.filters.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
              <option value="Under Review" ${state.filters.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
              <option value="Selected" ${state.filters.status === 'Selected' ? 'selected' : ''}>Selected</option>
              <option value="Rejected" ${state.filters.status === 'Rejected' ? 'selected' : ''}>Ineligible</option>
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
                <th>B.Tech Branch</th>
                <th>10th / 12th %</th>
                <th>Transcript</th>
                <th>Status</th>
                <th>Decision</th>
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
                      📄 View Document
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
            <h3 class="card-title">Applicant Scrutiny: ${app.fullName}</h3>
            <p class="card-subtitle">Current State: <strong style="color:#2563eb;">${app.status}</strong></p>
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
            <div style="grid-column:1 / -1;"><strong>Programme:</strong> ${app.department}</div>
            <div style="grid-column:1 / -1;"><strong>Address:</strong> ${app.address}</div>
            <div style="grid-column:1 / -1;">
              <strong>Marksheet / Rankcard:</strong> 
              <a href="${app.document?.path}" target="_blank" style="color:#2563eb; font-weight:600;">
                📎 Open ${app.document?.originalName}
              </a>
            </div>
          </div>
        </div>

        <div style="border-top:1px solid #e2e8f0; padding-top:1.25rem;">
          <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:0.75rem; color:#0f172a;">
            Admissions Committee Decision (Prof. Dr. Satyajit Chakraborty)
          </h4>
          
          ${
            allowedNextStatuses.length === 0
              ? `<p style="color:#64748b; font-size:0.85rem;">No further status transitions allowed from '${app.status}'.</p>`
              : `
            <form onsubmit="event.preventDefault(); handleStatusChange('${app._id}', this.nextStatus.value, this.comments.value);">
              <div class="form-group" style="margin-bottom:1rem;">
                <label>Next State</label>
                <select name="nextStatus" required>
                  ${allowedNextStatuses.map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>
              </div>

              <div class="form-group" style="margin-bottom:1.25rem;">
                <label>Committee Evaluation Remarks</label>
                <textarea name="comments" rows="2" placeholder="e.g. WBJEE merit verified. Seat allotted for B.Tech."></textarea>
              </div>

              <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
                <button type="button" class="nav-btn btn-outline" onclick="state.selectedApplicant = null; render();">Cancel</button>
                <button type="submit" class="nav-btn btn-primary">Save & Apply Decision</button>
              </div>
            </form>
          `
          }
        </div>
      </div>
    </div>
  `;
}

// Discreet Staff / Reviewer Quick-Login Modal (Preserves real website look)
function renderStaffModal() {
  if (!state.showStaffModal) return '';

  return `
    <div class="modal-overlay" onclick="if(event.target === this) { state.showStaffModal = false; render(); }">
      <div class="modal" style="max-width:480px;">
        <div class="card-header">
          <div>
            <h3 class="card-title">Admissions Portal Quick Sign-In</h3>
            <p class="card-subtitle">Authorized staff and candidate quick testing access</p>
          </div>
          <button class="nav-btn" style="padding:0.25rem 0.5rem;" onclick="state.showStaffModal = false; render();">✕</button>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <button class="nav-btn btn-primary" style="justify-content:center; padding:0.75rem;" onclick="handleLogin('admin@college.edu', 'admin123')">
            🔑 Sign In as Director (Prof. Dr. Satyajit Chakraborty)
          </button>
          <button class="nav-btn btn-outline" style="justify-content:center; padding:0.65rem;" onclick="handleLogin('aarav@example.com', 'student123')">
            🎓 Candidate: Aarav Sharma (Selected - CSE)
          </button>
          <button class="nav-btn btn-outline" style="justify-content:center; padding:0.65rem;" onclick="handleLogin('diya@example.com', 'student123')">
            🔍 Candidate: Diya Patel (Under Review - AI & ML)
          </button>
          <button class="nav-btn btn-outline" style="justify-content:center; padding:0.65rem;" onclick="handleLogin('rohan@example.com', 'student123')">
            📥 Candidate: Rohan Verma (Submitted - ECE)
          </button>
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
    <main class="main-content">
      ${renderAlert()}
      ${viewHtml}
    </main>
    ${renderReviewModal()}
    ${renderStaffModal()}
    <footer>
      <div class="footer-inner">
        <div class="footer-top">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <img src="/logo.png" alt="IEM Logo" style="height:44px;" />
            <div>
              <div style="font-weight:800; color:#0f172a; font-size:1.05rem;">Institute of Engineering & Management (IEM), Kolkata</div>
              <div style="font-size:0.75rem; color:#64748b;">Autonomous Institution Affiliated to MAKAUT • Approved by AICTE • NAAC 'A' Grade Accredited</div>
            </div>
          </div>
          <div>
            <button class="nav-btn btn-outline" style="font-size:0.8rem; padding:0.4rem 0.85rem;" onclick="state.showStaffModal = true; render();">
              🔒 Committee / Staff Access
            </button>
          </div>
        </div>
        <div class="footer-bottom">
          <div>© 2026 Institute of Engineering & Management (IEM). All Rights Reserved.</div>
          <div>Salt Lake Electronics Complex, Sector V, Kolkata, West Bengal 700091</div>
        </div>
      </div>
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
window.selectBranchAndApply = selectBranchAndApply;
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
