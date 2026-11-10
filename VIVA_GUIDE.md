# PCCCS504 Software Engineering Lab — Viva & Defense Guide
**Project:** Online Admission System (MEAN Stack POC)  
**Target:** Live Demonstration (15% Marks) & Code Understanding

---

## 🎯 Top Examiner Questions & How to Answer Them

### 1. "Explain the Architecture of the MEAN Stack in your project."
* **Answer:**
  "MEAN stands for **M**ongoDB, **E**xpress.js, **A**ngular architecture, and **N**ode.js.
  - **Angular (Presentation Tier):** Handles the single-page user interface, reactive forms, file upload picker, and dynamic status timelines.
  - **Node.js (Runtime):** Executes the backend JavaScript engine on top of Chrome's V8 engine.
  - **Express.js (Application Tier):** Provides the HTTP routing framework, handles CORS, parses request bodies, integrates middleware like Multer and JWT, and enforces business logic.
  - **MongoDB (Data Tier):** A NoSQL document-oriented database storing JSON-like BSON documents for users, admission forms, uploaded file references, and audit logs."

---

### 2. "How did you implement Document Upload using Multer?"
* **Answer:**
  "We configured `multer.diskStorage` in [`server/middleware/upload.js`](file:///c:/Antigravity/project/admission-system/server/middleware/upload.js).
  - The actual binary files (marksheets) are written directly to the server's `uploads/` directory on disk.
  - To prevent filename collisions and security vulnerabilities, filenames are sanitized and concatenated with a timestamp: `${sanitizedBase}-${Date.now()}-${random}.ext`.
  - A strict `fileFilter` restricts files to `application/pdf`, `image/png`, and `image/jpeg` with a `5MB` limit.
  - MongoDB does not store the heavy file binary directly; instead, it stores the metadata reference (`filename`, `originalName`, `path`, `mimetype`, `size`) inside the `Application` document."

---

### 3. "How does your Finite State Machine prevent illegal status transitions?"
* **Answer:**
  "In [`server/models/Application.js`](file:///c:/Antigravity/project/admission-system/server/models/Application.js), we implemented a state transition rule engine:
  - `Submitted` $\rightarrow$ can only transition to `Under Review`.
  - `Under Review` $\rightarrow$ can transition to `Selected` or `Rejected`.
  - An application cannot skip from `Submitted` directly to `Selected` or `Rejected` without being reviewed first.
  - If a client or administrator attempts an illegal jump, the server rejects it with an HTTP `400 Bad Request` and an explanatory error message, ensuring data integrity."

---

### 4. "How is Role-Based Access Control (RBAC) enforced?"
* **Answer:**
  "We use stateless JSON Web Tokens (JWT) combined with `bcryptjs`:
  - When a user logs in via `/api/auth/login`, their password is verified against the bcrypt hash.
  - A signed JWT token is issued containing their `id` and `role` (`applicant` or `admin`).
  - Protected endpoints use two middleware layers in [`server/middleware/auth.js`](file:///c:/Antigravity/project/admission-system/server/middleware/auth.js):
    1. `authenticate`: Verifies the token's HMAC-SHA256 signature and extracts the user.
    2. `authorize('admin')`: Restricts administrative endpoints (such as status modification and analytics). Non-admin users receive an HTTP `403 Forbidden`."

---

### 5. "Explain how the MongoDB Aggregation Pipeline works in your Analytics Dashboard."
* **Answer:**
  "In [`server/controllers/application.controller.js`](file:///c:/Antigravity/project/admission-system/server/controllers/application.controller.js) under `getDashboardStats`, we use the `$facet` operator to execute multiple aggregations in a single database round-trip:
  1. `$count: 'count'` to get total applicants.
  2. `$group: { _id: '$status', count: { $sum: 1 } }` to get status distribution.
  3. `$group: { _id: '$department', count: { $sum: 1 } }` to get department application counts.
  4. `$group: { _id: null, avgTenth: { $avg: '$tenthPercentage' }, avgTwelfth: { $avg: '$twelfthPercentage' } }` to compute cutoff averages.
  This processes calculations directly on the database engine rather than pulling raw documents into Node.js memory."

---

### 6. "Why did you embed `statusHistory` instead of creating a separate collection?"
* **Answer:**
  "Because an application's review history is always read alongside the application itself, embedding `statusHistory` as an array of subdocuments eliminates the need for expensive multi-collection `$lookup` joins, provides atomic document updates, and models the 1-to-few relationship recommended in MongoDB schema design."

---

## 🎬 Recommended 3-Minute Live Demonstration Flow

1. **Step 1: Open the Application (30 seconds)**
   - Open `http://localhost:5000` in the browser.
   - Point out the clean UI, MEAN stack branding, and the **Demo Shortcuts Bar**.

2. **Step 2: Show the Student Application & Marksheet Upload (60 seconds)**
   - Click **Demo: Student: Submitted (Rohan)** or register a new applicant.
   - Walk through the application sections: Personal Details $\rightarrow$ Academic Scores $\rightarrow$ Department Selection $\rightarrow$ Marksheet File Picker.
   - Show the **Visual Status Timeline** showing current state and Dean comments.

3. **Step 3: Show the Admin Dashboard & Workflow Enforcement (60 seconds)**
   - Click **Demo: Admin (Dean)**.
   - Highlight the **Analytics Dashboard** (KPI cards, department volume distribution bar chart, cutoff score averages).
   - Click **Manage All Applicants**, filter by department (e.g. *Computer Science*), and open an applicant.
   - Click **Review & Decide**: Show the dropdown dynamically displaying only allowed next states (e.g. `Under Review`), transition the state with a faculty note, and watch the status update in real-time.

4. **Step 4: Run the Automated Verification Suite (30 seconds)**
   - Switch to terminal and run:
     ```bash
     cd server
     npm test
     ```
   - Show the examiner all 8 automated tests passing cleanly with zero errors.
