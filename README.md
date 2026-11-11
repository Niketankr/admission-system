# Institute of Engineering & Management (IEM), Kolkata
## Online Undergraduate Admission Portal (Session 2026–27)

---

## 📌 Executive Summary

This system serves as the centralized **Online Undergraduate Admission Portal** for the **Institute of Engineering & Management (IEM), Salt Lake Sector V, Kolkata**. It provides prospective engineering students with a streamlined interface to apply for AICTE-approved 4-Year B.Tech programmes, upload academic transcripts, and track their admission review timeline. Admissions committee faculty, headed by **Prof. Dr. Satyajit Chakraborty**, utilize the administrative dashboard for merit scrutiny, branch cutoff analytics, and provisional seat allotment.

### ✨ System Features

#### Undergraduate Admissions (B.Tech Only)
1. **Student Registration & Authentication:** Secure candidate profile creation with JWT stateless session tokens and bcrypt password encryption.
2. **Comprehensive Admission Application Form:** Captures personal demographics, Class 10 & 12 board marks, entrance examination scorecards (IEMJEE, WBJEE, JEE Main), and B.Tech branch selection.
3. **Academic Transcript Upload:** Multer pipeline for uploading Class 12 marksheets and entrance rankcards (PDF/PNG/JPEG up to 5MB).
4. **Admissions Committee Portal:** Filter candidates by engineering branch, review status, and search by applicant name/contact details.
5. **Real-time Allotment Tracker:** Real-time visual timeline showing application review status, verified scores, and faculty review notes.

#### Administrative & Security Features
1. **📁 Document Verification Engine (Multer):** Transcripts stored on secure storage with metadata references in MongoDB.
2. **🔒 Role-Based Access Control (RBAC):** Strict separation between `applicant` and `admin` permissions on the backend.
3. **⚡ Validated State Transition Workflow:** Enforces deterministic status transitions (`Submitted` → `Under Review` → `Selected` / `Rejected`). Illegal status jumps are rejected with HTTP 400.
4. **📊 Institutional Analytics Dashboard:** Aggregates total candidate volume, branch demand distributions, and candidate cutoff averages using MongoDB `$facet`, `$group`, and `$avg`.

---

## 🏗️ Architecture & Project Structure

```
admission-system/
├── package.json                 # Top-level workspace script runner
├── README.md                    # Setup, running, and API documentation
├── WRITEUP.md                   # System design, schema & architecture report
├── vercel.json                  # Serverless deployment configuration
├── api/
│   └── index.js                 # Serverless entry bridge
├── server/                      # Backend (Node.js + Express + MongoDB)
│   ├── server.js                # Express entry point & route orchestrator
│   ├── package.json             # Backend dependencies
│   ├── .env                     # Environment variables (port, db uri, jwt secret)
│   ├── seed.js                  # Pre-populates sample students & admin
│   ├── test-api.js              # Automated verification test suite
│   ├── config/
│   │   ├── db.js                # MongoDB connection manager (with Atlas & memory fallback)
│   │   └── memoryStore.js       # Pre-seeded institutional data store
│   ├── models/
│   │   ├── User.js              # User schema & bcrypt hashing logic
│   │   └── Application.js       # Admission Application schema & state machine
│   ├── middleware/
│   │   ├── auth.js              # JWT verification & RBAC authorization
│   │   └── upload.js            # Multer file storage & type filtering
│   ├── controllers/
│   │   ├── auth.controller.js   # Auth business logic
│   │   └── application.controller.js # Admission and analytics logic
│   ├── routes/
│   │   ├── auth.routes.js       # /api/auth endpoints
│   │   └── application.routes.js# /api/applications endpoints
│   └── uploads/                 # Storage destination for uploaded marksheets
└── client/                      # Frontend Single Page Web Portal
    ├── index.html               # Main application entry
    ├── styles.css               # Official institutional UI styles
    ├── app.js                   # Interactive client application engine
    ├── logo.png                 # Official IEM crest logo
    └── src/                     # Angular / TypeScript source architecture
        ├── models/              # TypeScript interfaces (User, Application, Stats)
        └── services/            # Angular HTTP services (AuthService, ApplicationService)
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local `mongod` service, MongoDB Atlas URI, or built-in in-memory fallback)

### 2. Installation
Open your terminal in the `admission-system` directory:
```bash
npm install
```

### 3. Environment Configuration
The `.env` file in the `server` directory is pre-configured:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/admission_db
JWT_SECRET=supersecret_admission_jwt_key_2026
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Start the Application
```bash
npm start
```
Open your web browser at:
👉 **`http://localhost:5000`**

---

## 🔑 Accounts for Review & Testing

| Role | Email | Password | Pre-loaded Candidate State |
|---|---|---|---|
| **Director / Admin** | `admin@college.edu` | `admin123` | **Prof. Dr. Satyajit Chakraborty** (Full Portal Access) |
| **Candidate 1** | `aarav@example.com` | `student123` | Status: **Selected** (B.Tech CSE) |
| **Candidate 2** | `diya@example.com` | `student123` | Status: **Under Review** (B.Tech CSE AI & ML) |
| **Candidate 3** | `rohan@example.com` | `student123` | Status: **Submitted** (B.Tech ECE) |
| **Candidate 4** | `ananya@example.com` | `student123` | Status: **Rejected** (B.Tech IT - Did not meet 45% PCM cutoff) |

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new applicant or faculty |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |

### 📄 Admission Applications (`/api/applications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/applications` | Applicant | Submit B.Tech application with transcript (Multer) |
| `GET` | `/api/applications/my` | Applicant | Retrieve candidate's application & timeline |
| `GET` | `/api/applications` | Admin | List all applicants with branch & status filters |
| `GET` | `/api/applications/:id` | Owner / Admin | Retrieve full application details by ID |
| `PATCH` | `/api/applications/:id/status` | Admin | Transition status (`Under Review`, `Selected`, `Rejected`) |
| `GET` | `/api/applications/stats/summary`| Admin | Aggregated metrics for total, status, & branches |
