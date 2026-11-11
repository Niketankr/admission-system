// IEM Admissions Portal Engine - Institute of Engineering & Management, Kolkata
const API_BASE = window.location.origin.includes('localhost')
  ? `${window.location.origin}/api`
  : '/api';

// B.Tech Programme Data with Real-Time Fee Structures & Curricula
const BTECH_PROGRAMMES = [
  {
    code: 'BTECH-CSE',
    title: 'B.Tech - CSE',
    deptName: 'B.Tech - Computer Science & Engineering (CSE)',
    subtitle: 'Computer Science & Engineering',
    desc: 'NBA Accredited • Focus on Cloud Computing, Distributed Systems, Software Engineering & High-Performance Algorithms',
    semesterTuition: 92000,
    labFee: 8000,
    totalTuitionFee: 800000,
    campus: 'Gurukul Campus (Salt Lake Sector V)',
    intake: 240,
    eligibility: '45% in 10+2 (PCM) + Valid IEMJEE / WBJEE / JEE Main Rank'
  },
  {
    code: 'BTECH-AIML',
    title: 'B.Tech - CSE (AI & ML)',
    deptName: 'B.Tech - CSE (AI & ML)',
    subtitle: 'Artificial Intelligence & Machine Learning',
    desc: 'Specialized Track with Deep Learning, Generative AI, Computer Vision, Reinforcement Learning & NVIDIA DGX Station Labs',
    semesterTuition: 95000,
    labFee: 8000,
    totalTuitionFee: 824000,
    campus: 'Gurukul Campus (Salt Lake Sector V)',
    intake: 120,
    eligibility: '45% in 10+2 (PCM) + Valid IEMJEE / WBJEE / JEE Main Rank'
  },
  {
    code: 'BTECH-ECE',
    title: 'B.Tech - ECE',
    deptName: 'B.Tech - Electronics & Communication Engineering (ECE)',
    subtitle: 'Electronics & Communication Engineering',
    desc: 'NBA Accredited • VLSI Architecture, Embedded Robotics, 5G Wireless Communications, RF Engineering & IoT Hardware',
    semesterTuition: 86000,
    labFee: 8000,
    totalTuitionFee: 752000,
    campus: 'Gurukul Campus (Salt Lake Sector V)',
    intake: 180,
    eligibility: '45% in 10+2 (PCM) + Valid IEMJEE / WBJEE / JEE Main Rank'
  },
  {
    code: 'BTECH-IT',
    title: 'B.Tech - IT',
    deptName: 'B.Tech - Information Technology (IT)',
    subtitle: 'Information Technology',
    desc: 'Enterprise Systems, Cloud Infrastructure, Cyber Security, Full-Stack Engineering, Big Data Analytics & DevOps',
    semesterTuition: 88000,
    labFee: 8000,
    totalTuitionFee: 768000,
    campus: 'Management House Campus (Sector V)',
    intake: 180,
    eligibility: '45% in 10+2 (PCM) + Valid IEMJEE / WBJEE / JEE Main Rank'
  },
  {
    code: 'BTECH-CSBS',
    title: 'B.Tech - CSBS',
    deptName: 'B.Tech - Computer Science & Business Systems (CSBS)',
    subtitle: 'Computer Science & Business Systems',
    desc: 'TCS Industry-Designed Curriculum blending Quantitative Finance, Business Analytics, FinTech Architecture & Cognitive Computing',
    semesterTuition: 88000,
    labFee: 8000,
    totalTuitionFee: 768000,
    campus: 'Management House Campus (Sector V)',
    intake: 60,
    eligibility: '45% in 10+2 (PCM) + Valid IEMJEE / WBJEE / JEE Main Rank'
  },
  {
    code: 'BTECH-ME',
    title: 'B.Tech - Mechanical',
    deptName: 'B.Tech - Mechanical Engineering (ME)',
    subtitle: 'Mechanical Engineering',
    desc: 'Industry 4.0 Robotics, Autonomous EV Systems, CAD/CAM Prototyping, Renewable Thermal Engineering & Mechatronics',
    semesterTuition: 82000,
    labFee: 8000,
    totalTuitionFee: 720000,
    campus: 'Gurukul Campus (Salt Lake Sector V)',
    intake: 60,
    eligibility: '45% in 10+2 (PCM) + Valid IEMJEE / WBJEE / JEE Main Rank'
  }
];

// Departmental Innovation Channels & Specialized Labs Data
const INNOVATION_LABS = [
  {
    id: 'aiml',
    title: 'AI & Machine Learning Supercomputing Center',
    tag: 'NVIDIA DGX Station A100 Cluster',
    image: '/assets/aiml-lab.jpg',
    lead: 'Prof. Dr. Debashis De & Dr. Malay Gangopadhyaya',
    desc: 'A dedicated high-performance supercomputing testbed equipped with NVIDIA DGX Station A100 (640GB Tensor Core VRAM), supporting large language model fine-tuning, autonomous drone navigation, and clinical medical imaging.',
    features: [
      'NVIDIA DGX A100 Supercomputer Cluster with 2.5 PetaFLOPS AI computing power',
      'Dual 4K workstation monitors with PyTorch, TensorFlow & CUDA acceleration',
      'Live Research: Indic Multilingual LLM, Vision-Based Tumor Detection & Autonomous Drone Swarms',
      '14 High-Impact IEEE/Springer Publications & 3 Patent Grants (2025–26)'
    ],
    patents: '3 Patents Granted • 5 Technology Licenses'
  },
  {
    id: 'iot',
    title: 'IoT & Smart Connected Systems Laboratory',
    tag: '5G, LoRaWAN & Industrial Telemetry',
    image: '/assets/iot-lab.jpg',
    lead: 'Dr. Senjuti Saha & Prof. Subhabrata Sengupta',
    desc: 'Sponsored by DST & industry partners, this laboratory houses digital storage oscilloscopes, RF spectrum analyzers, and programmable microcontroller rigs for developing smart-city infrastructure and industrial telemetric hardware.',
    features: [
      'Keysight 1GHz Digital Storage Oscilloscopes & RF Spectrum Analyzers',
      'LoRaWAN Long-Range Gateways & Private 5G NR Software-Defined Radio Testbed',
      'Embedded STM32, ESP32, Raspberry Pi 5 & FPGA Development Benches',
      'Smart Campus Project: Deployed 200+ Environmental & Energy telemetry sensors in Sector V'
    ],
    patents: 'Live Smart Campus IoT Grid • 4 Patents Filed'
  },
  {
    id: 'iedc',
    title: 'IEDC Innovation & Entrepreneurship FabLab',
    tag: 'DST Supported Incubation Hub',
    image: '/assets/iedc-lab.jpg',
    lead: 'Prof. Dr. Satyajit Chakraborty (Director & Head of Incubation)',
    desc: 'Established with financial grant support from the Department of Science & Technology (DST), Govt. of India. Features rapid-prototyping 3D printers, laser engravers, PCB milling machines, and dedicated startup co-working pods.',
    features: [
      'Stratasys & Creality Industrial High-Precision Dual-Extruder 3D Printers',
      'CNC PCB Milling Machines & Automated Laser Prototyping Systems',
      '40+ Student Startups Incubated with ₹2.5 Crore+ in Seed Grants & Angel Capital',
      '65+ Patents Filed by Undergraduate Student Founders & Faculty Mentors'
    ],
    patents: '40+ Startups Incubated • ₹2.5 Cr Seed Grants'
  }
];

// Branch-Wise Placement Statistics
const PLACEMENT_STATS = [
  {
    branch: 'Computer Science & Engineering (CSE)',
    code: 'CSE',
    placed: '99.4%',
    highest: '₹72 LPA',
    average: '₹10.8 LPA',
    median: '₹9.5 LPA',
    superDreamOffers: 84,
    recruiters: ['Google', 'Microsoft', 'Amazon', 'Oracle', 'Adobe', 'Cisco']
  },
  {
    branch: 'CSE (Artificial Intelligence & Machine Learning)',
    code: 'AI & ML',
    placed: '99.1%',
    highest: '₹48 LPA',
    average: '₹10.4 LPA',
    median: '₹9.2 LPA',
    superDreamOffers: 42,
    recruiters: ['Microsoft', 'Amazon', 'AMD', 'Intel', 'NVIDIA', 'Adobe']
  },
  {
    branch: 'Information Technology (IT)',
    code: 'IT',
    placed: '98.7%',
    highest: '₹42 LPA',
    average: '₹9.8 LPA',
    median: '₹8.8 LPA',
    superDreamOffers: 56,
    recruiters: ['Cisco', 'Adobe', 'Morgan Stanley', 'PwC', 'Goldman Sachs']
  },
  {
    branch: 'Computer Science & Business Systems (CSBS)',
    code: 'CSBS',
    placed: '98.2%',
    highest: '₹36 LPA',
    average: '₹9.4 LPA',
    median: '₹8.5 LPA',
    superDreamOffers: 18,
    recruiters: ['TCS Digital', 'Deloitte', 'Goldman Sachs', 'PwC', 'Fintech Labs']
  },
  {
    branch: 'Electronics & Communication Engineering (ECE)',
    code: 'ECE',
    placed: '96.8%',
    highest: '₹28 LPA',
    average: '₹8.6 LPA',
    median: '₹7.8 LPA',
    superDreamOffers: 38,
    recruiters: ['Qualcomm', 'Texas Instruments', 'Intel', 'Samsung', 'L&T Tech']
  },
  {
    branch: 'Mechanical Engineering (ME)',
    code: 'ME',
    placed: '94.5%',
    highest: '₹18 LPA',
    average: '₹7.4 LPA',
    median: '₹6.8 LPA',
    superDreamOffers: 12,
    recruiters: ['Tata Motors', 'L&T Heavy', 'Siemens', 'Hero MotoCorp', 'Adani Power']
  }
];

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
  showStaffModal: false,

  // Hero Quick Evaluator State
  wizard: {
    twelfthPct: 88,
    entranceScore: 82,
    resultMsg: null
  },

  // Placement Active Branch Filter
  activePlacementBranch: 'All'
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

    showAlert('Candidate profile registered successfully!', 'success');
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

// Submission Handler for Admission Form
async function handleApplicationSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const fileInput = form.querySelector('input[name="document"]');
  if (!fileInput.files.length) {
    showAlert('Please upload your Class 12 marksheet or qualifying rankcard.', 'error');
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
    showAlert('Application submitted successfully for verification!', 'success');
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

    showAlert(`Application status updated to '${newStatus}'!`, 'success');
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

function evaluateWizard() {
  const p = Number(state.wizard.twelfthPct) || 0;
  const e = Number(state.wizard.entranceScore) || 0;

  if (p < 45) {
    state.wizard.resultMsg = {
      eligible: false,
      title: 'Ineligible for Direct Counseling',
      text: 'Minimum 45% aggregate in 10+2 (Physics & Mathematics) is mandatory per AICTE norms.'
    };
  } else if (p >= 85 && e >= 75) {
    state.wizard.resultMsg = {
      eligible: true,
      title: 'High Merit: Eligible for B.Tech CSE & AI-ML',
      text: 'Congratulations! Your score qualifies for Top-Tier counseling and 25% Academic Merit Scholarship.'
    };
  } else if (p >= 70 && e >= 50) {
    state.wizard.resultMsg = {
      eligible: true,
      title: 'Eligible for B.Tech IT, CSBS & ECE',
      text: 'Good performance! You are eligible for counseling across B.Tech IT, CSBS, and ECE programmes.'
    };
  } else {
    state.wizard.resultMsg = {
      eligible: true,
      title: 'Eligible for Mechanical & ECE Rounds',
      text: 'You satisfy minimum eligibility. Qualifies for IEMJEE Direct Counseling seat allotment.'
    };
  }
  render();
}

// Navigation Bar
function renderNavbar() {
  const isAuth = !!state.token;
  const isAdmin = state.user?.role === 'admin';

  return `
    <div class="top-announcement">
      <div class="top-announcement-inner">
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <span class="announcement-badge">ADMISSION NOTICE</span>
          <span>B.Tech Session 2026–27 Online Counseling & Allotment • Approved by AICTE • NAAC 'A' Grade</span>
        </div>
        <div style="display:flex; align-items:center; gap:1.25rem;">
          <span>📞 Helpline: +91 33 2357 2059</span>
          <span>✉️ admissions@iem.edu.in</span>
        </div>
      </div>
    </div>

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
            <a class="nav-link-item" onclick="navigateTo('home', 'programmes')">B.Tech Degrees</a>
            <a class="nav-link-item" onclick="navigateTo('home', 'innovation-labs')">Innovation Labs</a>
            <a class="nav-link-item" onclick="navigateTo('home', 'placements')">Placement Analytics</a>
            <a class="nav-link-item" onclick="navigateTo('home', 'contact')">Contact</a>
            <button class="nav-btn btn-outline" style="margin-left:0.5rem;" onclick="navigateTo('login')">Sign In</button>
            <button class="nav-btn btn-primary" onclick="navigateTo('register')">Apply Online</button>
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
              Candidate: ${state.user.name}
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

// HOME PAGE VIEW (Redesigned with Distinct Visual Identity)
function renderHome() {
  return `
    <div>
      <!-- HERO SECTION: Executive Immersive Design (Not a screenshot copy) -->
      <section class="hero-executive">
        <div class="hero-executive-inner">
          <div>
            <div class="hero-pill-dark">
              <span class="pill-dot"></span>
              <span>Autonomous Institute • Approved by AICTE • NAAC 'A' Grade Accredited</span>
            </div>

            <h1 class="hero-title-dark">
              Engineering Future Tech & <span>Global Leadership</span>
            </h1>
            
            <p class="hero-subtitle-dark">
              Welcome to the official undergraduate portal of the <strong>Institute of Engineering & Management (IEM), Kolkata</strong>. Explore AICTE-accredited 4-Year B.Tech degrees, transparent semester-wise tuition structures, world-class innovation laboratories, and proven career records.
            </p>

            <div class="hero-quick-stats">
              <div class="stat-metric-dark">
                <div class="stat-num">₹72 LPA</div>
                <div class="stat-text">Highest International CTC</div>
              </div>
              <div class="stat-metric-dark">
                <div class="stat-num">98.4%</div>
                <div class="stat-text">Overall B.Tech Placement</div>
              </div>
              <div class="stat-metric-dark">
                <div class="stat-num">35+ Yrs</div>
                <div class="stat-text">Excellence (Est. 1989)</div>
              </div>
            </div>

            <div class="hero-actions-dark">
              <button class="nav-btn btn-primary" style="padding:0.8rem 2rem; font-size:1rem;" onclick="${state.token ? "navigateTo('apply')" : "navigateTo('register')"}">
                Start B.Tech Application →
              </button>
              <button class="nav-btn btn-outline" style="background:rgba(255,255,255,0.1); color:#fff; border-color:rgba(255,255,255,0.25);" onclick="navigateTo('home', 'innovation-labs')">
                Virtual Lab Tour
              </button>
            </div>
          </div>

          <!-- Hero Right: Interactive Eligibility & Cutoff Evaluator -->
          <div>
            <div class="hero-wizard-card">
              <div class="wizard-header">
                <div class="wizard-title">Candidate Eligibility Evaluator</div>
                <span class="wizard-badge">Session 2026–27</span>
              </div>

              <div class="wizard-input-group">
                <label>Class 12th PCM Aggregate Percentage: <strong style="color:#38bdf8;">${state.wizard.twelfthPct}%</strong></label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value="${state.wizard.twelfthPct}"
                  oninput="state.wizard.twelfthPct = this.value; evaluateWizard();"
                />
              </div>

              <div class="wizard-input-group">
                <label>Entrance Exam Score / Rank Percentile: <strong style="color:#38bdf8;">${state.wizard.entranceScore}/100</strong></label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value="${state.wizard.entranceScore}"
                  oninput="state.wizard.entranceScore = this.value; evaluateWizard();"
                />
              </div>

              <div class="wizard-result-box">
                ${
                  state.wizard.resultMsg
                    ? `
                  <strong>${state.wizard.resultMsg.title}</strong>
                  <div>${state.wizard.resultMsg.text}</div>
                `
                    : `
                  <strong>High Probability for B.Tech CSE & AI-ML</strong>
                  <div>Your score qualifies for Tier-1 counseling and Merit Scholarship Scheme.</div>
                `
                }
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
                <button class="nav-btn btn-primary" style="justify-content:center; width:100%; font-size:0.85rem;" onclick="${state.token ? "navigateTo('apply')" : "navigateTo('register')"}">
                  Apply with this Score
                </button>
                <button class="nav-btn btn-outline" style="justify-content:center; width:100%; font-size:0.85rem; background:rgba(255,255,255,0.1); color:#fff;" onclick="navigateTo('home', 'programmes')">
                  View Cutoff Trends
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DEPARTMENTAL INNOVATION CHANNELS & SPECIALIZED LABS SECTION -->
      <section id="innovation-labs" class="section-wrapper">
        <div class="section-header">
          <div>
            <span class="section-tag">R&D Ecosystem</span>
            <h2 class="section-title">Departmental Innovation Channels & Specialized Labs</h2>
            <p class="section-subtitle">
              Explore state-of-the-art supercomputing clusters, IoT telemetry hubs, and the DST-funded IEDC Incubation Center at IEM.
            </p>
          </div>
          <div>
            <span class="badge badge-review" style="font-size:0.85rem; padding:0.4rem 0.85rem;">
              🔬 ₹12+ Crore Research Infrastructure
            </span>
          </div>
        </div>

        <div class="labs-grid">
          ${INNOVATION_LABS.map(
            lab => `
            <div class="lab-card">
              <div class="lab-image-wrapper">
                <img src="${lab.image}" alt="${lab.title}" onerror="this.onerror=null; this.src='/logo.png';" />
                <span class="lab-badge-floating">${lab.tag}</span>
              </div>
              <div class="lab-body">
                <h3 class="lab-title">${lab.title}</h3>
                <p class="lab-desc">${lab.desc}</p>
                
                <ul class="lab-features-list">
                  ${lab.features.map(f => `<li>${f}</li>`).join('')}
                </ul>

                <div class="lab-footer">
                  <span class="lab-meta">Head: <strong>${lab.lead.split('&')[0].trim()}</strong></span>
                  <span class="badge badge-selected" style="font-size:0.75rem;">${lab.patents.split('•')[0].trim()}</span>
                </div>
              </div>
            </div>
          `
          ).join('')}
        </div>
      </section>

      <!-- PLACEMENT ANALYTICS & RECRUITER SPECTRUM -->
      <section id="placements" class="section-wrapper">
        <div class="section-header">
          <div>
            <span class="section-tag">Institutional Placements</span>
            <h2 class="section-title">Placement Statistics (Batch 2025–26)</h2>
            <p class="section-subtitle">
              Audited campus recruitment metrics showcasing branch-wise average packages, highest international offers, and marquee recruiter visits.
            </p>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="nav-btn ${state.activePlacementBranch === 'All' ? 'btn-primary' : 'btn-outline'}" style="padding:0.35rem 0.75rem; font-size:0.8rem;" onclick="state.activePlacementBranch = 'All'; render();">
              All Branches
            </button>
            ${PLACEMENT_STATS.map(
              p => `
              <button class="nav-btn ${state.activePlacementBranch === p.code ? 'btn-primary' : 'btn-outline'}" style="padding:0.35rem 0.75rem; font-size:0.8rem;" onclick="state.activePlacementBranch = '${p.code}'; render();">
                ${p.code}
              </button>
            `
            ).join('')}
          </div>
        </div>

        <div class="placement-kpis">
          <div class="kpi-card">
            <div class="kpi-number" style="color:#2563eb;">₹72 LPA</div>
            <div class="kpi-label">Highest International CTC</div>
          </div>
          <div class="kpi-card emerald">
            <div class="kpi-number" style="color:#10b981;">₹9.2 LPA</div>
            <div class="kpi-label">Overall B.Tech Average Package</div>
          </div>
          <div class="kpi-card amber">
            <div class="kpi-number" style="color:#f59e0b;">98.4%</div>
            <div class="kpi-label">Placement Conversion Rate</div>
          </div>
          <div class="kpi-card purple">
            <div class="kpi-number" style="color:#8b5cf6;">1,450+</div>
            <div class="kpi-label">Offers Received by Cohort</div>
          </div>
        </div>

        <div class="card" style="padding:0; overflow:hidden; margin-bottom:2.5rem;">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>B.Tech Branch</th>
                  <th>Placement Rate</th>
                  <th>Highest CTC</th>
                  <th>Average CTC</th>
                  <th>Median CTC</th>
                  <th>Super Dream Offers (> ₹15L)</th>
                  <th>Key Corporate Recruiters</th>
                </tr>
              </thead>
              <tbody>
                ${PLACEMENT_STATS.filter(
                  p => state.activePlacementBranch === 'All' || p.code === state.activePlacementBranch
                )
                  .map(
                    p => `
                  <tr>
                    <td><strong>${p.branch}</strong></td>
                    <td><span class="badge badge-selected">${p.placed}</span></td>
                    <td><strong style="color:#2563eb;">${p.highest}</strong></td>
                    <td><strong>${p.average}</strong></td>
                    <td>${p.median}</td>
                    <td><span class="badge badge-review">${p.superDreamOffers} Students</span></td>
                    <td style="color:#475569; font-size:0.825rem;">${p.recruiters.join(', ')}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div class="recruiter-category-block">
            <div class="recruiter-category-title">🌐 Tier-1 Big Tech & Global R&D Centers</div>
            <div class="recruiters-marquee">
              <span class="recruiter-pill">Google</span>
              <span class="recruiter-pill">Microsoft</span>
              <span class="recruiter-pill">Amazon</span>
              <span class="recruiter-pill">Adobe</span>
              <span class="recruiter-pill">Oracle</span>
              <span class="recruiter-pill">Cisco</span>
              <span class="recruiter-pill">AMD</span>
              <span class="recruiter-pill">Intel</span>
              <span class="recruiter-pill">NVIDIA</span>
              <span class="recruiter-pill">Samsung R&D</span>
            </div>
          </div>

          <div class="recruiter-category-block">
            <div class="recruiter-category-title">💼 Global Banking, FinTech & Strategic Consulting</div>
            <div class="recruiters-marquee">
              <span class="recruiter-pill">Goldman Sachs</span>
              <span class="recruiter-pill">Morgan Stanley</span>
              <span class="recruiter-pill">PwC India</span>
              <span class="recruiter-pill">Deloitte</span>
              <span class="recruiter-pill">EY</span>
              <span class="recruiter-pill">Nomura</span>
            </div>
          </div>
        </div>
      </section>

      <!-- B.TECH PROGRAMMES OVERVIEW SECTION -->
      <section id="programmes" class="section-wrapper">
        <div class="section-header">
          <div>
            <span class="section-tag">Academic Portfolio</span>
            <h2 class="section-title">Undergraduate Degree Programmes (B.Tech Only)</h2>
            <p class="section-subtitle">
              4-Year Engineering Degrees Approved by AICTE & Accredited by NBA
            </p>
          </div>
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
                  <div class="fee-item-label">Semester Fee</div>
                  <div class="fee-item-val">₹${prog.semesterTuition.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div class="fee-item-label">Total Tuition</div>
                  <div class="fee-item-val">₹${prog.totalTuitionFee.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div class="fee-item-label">Campus</div>
                  <div class="fee-item-campus">${prog.campus.split('(')[0]}</div>
                </div>
              </div>

              <button class="nav-btn btn-outline" style="width:100%; justify-content:center; font-weight:600;" onclick="selectBranchAndApply('${prog.deptName}')">
                Apply for this Degree →
              </button>
            </div>
          `
          ).join('')}
        </div>
      </section>

      <!-- CONTACT & HELPDESK SECTION -->
      <section id="contact" class="section-wrapper">
        <div class="section-header">
          <div>
            <span class="section-tag">Admissions Desk</span>
            <h2 class="section-title">Campus Information & Helpline</h2>
            <p class="section-subtitle">Counseling sessions active Monday through Saturday at Gurukul & Management House Campuses</p>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem;">
          <div class="card" style="margin:0;">
            <h4 style="font-weight:700; color:#0f172a; margin-bottom:0.5rem;">Gurukul Campus (Engineering Headquarters)</h4>
            <p style="font-size:0.85rem; color:#64748b; line-height:1.6;">
              Y-12, Block EP, Sector V, Salt Lake Electronics Complex, Kolkata, West Bengal 700091
            </p>
            <div style="margin-top:0.75rem; font-size:0.85rem; font-weight:600; color:#2563eb;">
              📞 +91 33 2357 2059 / 2995
            </div>
          </div>
          <div class="card" style="margin:0;">
            <h4 style="font-weight:700; color:#0f172a; margin-bottom:0.5rem;">Management House Campus</h4>
            <p style="font-size:0.85rem; color:#64748b; line-height:1.6;">
              D-1, Management House, Sector V, Salt Lake, Kolkata, West Bengal 700091
            </p>
            <div style="margin-top:0.75rem; font-size:0.85rem; font-weight:600; color:#2563eb;">
              📞 +91 33 2357 2969
            </div>
          </div>
          <div class="card" style="margin:0;">
            <h4 style="font-weight:700; color:#0f172a; margin-bottom:0.5rem;">Admissions Secretariat</h4>
            <p style="font-size:0.85rem; color:#64748b; line-height:1.6;">
              Executive Desk: <strong>director@iem.edu.in</strong><br/>
              Admissions Helpdesk: <strong>admissions@iem.edu.in</strong>
            </p>
            <div style="margin-top:0.75rem; font-size:0.85rem; font-weight:600; color:#16a34a;">
              🟢 In-Person & Online Counseling Active
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

// Student Login View
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

// Student Register View
function renderRegister() {
  return `
    <div style="max-width:460px; margin:3rem auto;">
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Student Registration</h2>
            <p class="card-subtitle">Create your candidate profile for B.Tech Admission 2026–27</p>
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

// Student Admission Form View
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
              <label>Entrance Exam Score / Rank Percentile (IEMJEE / WBJEE / JEE Main)</label>
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

// Student Status View
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

// Admin Dashboard View
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

// Admin Applicants Review View
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

// Review Decision Modal
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
                <textarea name="comments" rows="2" placeholder="e.g. WBJEE merit verified. Provisional seat allotted for B.Tech."></textarea>
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

// Discreet Staff / Reviewer Quick-Login Modal
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
          <div style="display:flex; align-items:center; gap:0.85rem;">
            <img src="/logo.png" alt="IEM Logo" style="height:48px;" />
            <div>
              <div style="font-weight:800; color:#0f172a; font-size:1.1rem;">Institute of Engineering & Management (IEM), Kolkata</div>
              <div style="font-size:0.75rem; color:#64748b;">Autonomous Institution • Approved by AICTE • NAAC 'A' Grade Accredited • NBA Accredited Programmes</div>
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
window.evaluateWizard = evaluateWizard;
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
