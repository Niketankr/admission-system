# Online Admission System — MEAN Stack POC
**Course:** Software Engineering Lab (PCCCS504)  
**Deliverable:** MEAN Stack Proof of Concept (POC) Lab Assignment  
**Tech Stack:** MongoDB, Express.js, Angular Architecture, Node.js (MEAN)

---

## 📌 Executive Summary

This project is a complete Proof of Concept (POC) for an **Online College Admission System** built using the **MEAN Stack**. It provides end-to-end functionality for applicants to submit admission details and marksheets, tracks application lifecycles through a finite state workflow, and provides faculty/administrators with a filtered management portal and real-time aggregation analytics.

### ✨ Implemented Features

#### Part A: Basic Admission System Requirements
1. **Student Registration & Authentication:** Secure registration and JWT-based authentication with bcrypt password hashing.
2. **Comprehensive Admission Application Form:** Captures personal details, academic qualifications (10th, 12th, Entrance Exam), and engineering department choices.
3. **Marksheet / Document Upload:** Integrates Multer to upload and validate applicant marksheets (PDF/PNG/JPEG up to 5MB).
4. **Admin Applicant Management:** Search by candidate name/email/phone, with instantaneous filtering by Department and Application Status.
5. **Real-time Status Tracking:** Applicants can monitor their admission status with an interactive visual timeline and review feedback.

#### Part B: Deeper Engineering Features (All 4 Implemented)
1. **📁 Document Upload Engine (Multer):** File storage on server disk with complete metadata and reference paths persisted in MongoDB.
2. **🔒 Role-Based Access Control (RBAC) & JWT Security:** Strict role enforcement separating `applicant` and `admin` permissions on the backend.
3. **⚡ Validated Status State Machine:** Enforces valid status transitions (`Submitted` → `Under Review` → `Selected` / `Rejected`) preventing illegal status skips.
4. **📊 Analytics Dashboard (MongoDB Aggregation):** Computes live counts, department volume distributions, and average cutoff scores via `$facet`, `$group`, and `$avg`.

---

## 🏗️ Architecture & Project Structure

```
admission-system/
├── package.json                 # Top-level workspace script runner
├── README.md                    # Setup, running, and API documentation (30% marks)
├── WRITEUP.md                   # System design, schema & architecture report (20% marks)
├── server/                      # Backend (Node.js + Express + MongoDB)
│   ├── server.js                # Express entry point & route orchestrator
│   ├── package.json             # Backend dependencies (express, mongoose, multer, etc.)
│   ├── .env                     # Environment variables (port, db uri, jwt secret)
│   ├── seed.js                  # Pre-populates sample students & admin for demo
│   ├── config/
│   │   └── db.js                # MongoDB connection manager (with Atlas & memory fallback)
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
└── client/                      # Frontend SPA & Angular Architecture
    ├── index.html               # Main single page entry
    ├── styles.css               # Clean academic portal UI
    ├── app.js                   # Client state management, router, & API integration
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
# Navigate to the server folder and install dependencies
cd server
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
> **Tip:** If you have MongoDB Atlas, simply replace `MONGODB_URI` with your connection string. If you don't have MongoDB running locally, the server will automatically spin up an in-memory MongoDB instance so the demo runs seamlessly!

### 4. Seed Demo Data
Pre-load sample admin and applicants across multiple status workflow stages:
```bash
npm run seed
```

### 5. Start the Application
```bash
npm start
```
Open your web browser at:
👉 **`http://localhost:5000`**

---

## 🔑 Pre-Seeded Accounts for Lab Demonstration

| Role | Email | Password | Pre-loaded Application State |
|---|---|---|---|
| **Admin (Dean)** | `admin@college.edu` | `admin123` | Full access to Analytics & Applicants table |
| **Student 1** | `aarav@example.com` | `student123` | Status: **Selected** (CSE Department) |
| **Student 2** | `diya@example.com` | `student123` | Status: **Under Review** (IT Department) |
| **Student 3** | `rohan@example.com` | `student123` | Status: **Submitted** (ECE Department) |
| **Student 4** | `ananya@example.com` | `student123` | Status: **Rejected** (Civil Engineering) |

> **Quick Demo Bar:** The website includes a 1-click **Demo Shortcuts Bar** at the top so examiners can switch personas instantly without re-typing credentials!

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new applicant or admin |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |

### 📄 Admission Applications (`/api/applications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/applications` | Applicant | Submit admission application with marksheet (Multer) |
| `GET` | `/api/applications/my` | Applicant | Retrieve current student's application & history |
| `GET` | `/api/applications` | Admin | List all applicants with search & department/status filters |
| `GET` | `/api/applications/:id` | Owner / Admin | Retrieve full application details by ID |
| `PATCH` | `/api/applications/:id/status` | Admin | Transition status (`Under Review`, `Selected`, `Rejected`) |
| `GET` | `/api/applications/stats/summary`| Admin | Aggregated metrics for total, status, & depts |

