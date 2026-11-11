# Design Choices and Architectural Report
**Institution:** Institute of Engineering & Management (IEM), Kolkata  
**Project:** Online Undergraduate Admission Portal (B.Tech Session 2026–27)  
**Leadership:** Admissions Committee headed by Prof. Dr. Satyajit Chakraborty  

---

## 1. Institutional Context & System Overview
Traditional engineering admission workflows often face bottlenecks such as manual transcript verification queues, lack of real-time application status visibility for candidates, and fragmented evaluation by admission committees. 

This system provides a centralized, web-based **Online Admission Portal** for the **Institute of Engineering & Management (IEM), Kolkata**. It streamlines student application filing, document handling, state transitions, and administrative oversight.

---

## 2. System Architecture & Request-Response Cycle

The application follows a decoupled **Client-Server 3-Tier Architecture**:

```
[ Presentation Tier ]       [ Application / Logic Tier ]       [ Data Tier ]
   Client Frontend       ───►     Express.js + Node.js     ───►    MongoDB
(SPA / Form / Timeline)  ◄───    (JWT / Multer / RBAC)     ◄───  (Collections)
```

### The Request-Response Cycle
1. **Request Dispatch:** When a student submits the multi-part admission form, the client encapsulates text fields and the binary marksheet into an HTTP `multipart/form-data` request, attaching the `Authorization: Bearer <JWT>` token header.
2. **Middleware Interception:**
   - `express.json()` & `cors()` parse basic payloads and configure Cross-Origin permissions.
   - `authenticate` middleware verifies the digital signature of the JWT token and attaches `req.user`.
   - `authorize('applicant')` verifies role permissions.
   - `upload.single('document')` (Multer) buffers the incoming binary stream, validates file extension and MIME type, writes the file to disk with a collision-resistant timestamped filename, and passes file metadata into `req.file`.
3. **Controller Execution:** `application.controller.js` validates business constraints (e.g. preventing duplicate applications per user), instantiates the Mongoose model, and persists the record to MongoDB.
4. **Response Delivery:** Express returns an HTTP `201 Created` JSON payload containing the assigned MongoDB ObjectId and initial workflow status, allowing the frontend to immediately render the status tracker.

---

## 3. Database Schema Design (MongoDB & Mongoose)

A hybrid document approach balances query performance and data integrity:

### A. Referencing vs. Embedding Trade-off
- **User Reference:** The `Application` document maintains an ObjectId reference to the `User` model (`applicant: { type: ObjectId, ref: 'User' }`). This decouples authentication credentials from academic records and complies with third normal form (3NF) principles in document stores.
- **Embedded Document Metadata:** The `document` subdocument (`filename`, `path`, `mimetype`, `size`) is embedded directly within the `Application` document since the marksheet is exclusively tied to that single application lifecycle.
- **Embedded Audit Trail (`statusHistory`):** Status updates are embedded as an array of chronological subdocuments containing the transition status, acting faculty ObjectId, timestamp, and review remarks. This provides an audit log without requiring cross-collection joins.

---

## 4. Finite State Machine (Workflow Engine)

To prevent arbitrary status assignments (e.g., jumping from `Submitted` directly to `Selected` without faculty evaluation), the system enforces a deterministic Finite State Machine (FSM):

```
               ┌─────────────┐
               │  Submitted  │
               └──────┬──────┘
                      │ (Admin reviews)
                      ▼
               ┌─────────────┐
        ┌─────►│Under Review │◄────┐
(Re-eval)│      └──────┬──────┘     │ (Re-eval)
        │             │            │
        │      ┌──────┴──────┐     │
        │      ▼             ▼     │
   ┌───────────┐     ┌───────────┐ │
   │ Selected  │     │ Rejected  │─┘
   └───────────┘     └───────────┘
```

### Transition Matrix Enforced in Mongoose Schema:
- **`Submitted`** $\rightarrow$ `['Under Review']`
- **`Under Review`** $\rightarrow$ `['Selected', 'Rejected']`
- **`Selected`** $\rightarrow$ `['Under Review']` *(for reconsideration)*
- **`Rejected`** $\rightarrow$ `['Under Review']` *(for appeal / corrections)*

Any attempt by a client or malicious actor to bypass `Under Review` triggers an HTTP `400 Bad Request` with an explanatory error payload.

---

## 5. Document Handling Pipeline (Multer)

Handling student credentials such as 12th marksheets requires strict file handling:
1. **Disk Storage vs. GridFS:** Because individual marksheets rarely exceed 5MB in this POC, storing files directly on disk under `/uploads` while retaining the relative path in MongoDB avoids the operational overhead of MongoDB GridFS while maintaining fast static file streaming.
2. **Sanitization:** Uploaded filenames are stripped of non-alphanumeric characters and combined with a millisecond timestamp and random entropy suffix (`${sanitizedBase}-${Date.now()}-${random}`) to prevent directory traversal and filename collision.
3. **MIME Type Validation:** A strict filter restricts uploads to `application/pdf`, `image/png`, and `image/jpeg`, rejecting executables or scripts.

---

## 6. Security & Role-Based Access Control (RBAC)

1. **Password Hashing:** Passwords are never stored in plaintext. Mongoose pre-save middleware hashes user passwords using `bcryptjs` with a work factor of 10 salt rounds.
2. **Stateless JWT Authentication:** Users authenticate via `/api/auth/login` to obtain an HMAC-SHA256 signed JSON Web Token containing their user ID and role.
3. **Route Guarding:** Backend endpoints are protected by higher-order middleware:
   ```javascript
   router.patch('/:id/status', authenticate, authorize('admin'), updateApplicationStatus);
   ```
   Non-admin tokens attempting administrative actions are rejected with HTTP `403 Forbidden`.

---

## 7. MongoDB Aggregation Pipeline for Analytics

Instead of querying all documents into Node.js memory and calculating statistics in application code, the admin dashboard leverages MongoDB's native `$facet` aggregation pipeline to compute multiple metrics in a single database round-trip:

```javascript
Application.aggregate([
  {
    $facet: {
      totalCount: [{ $count: 'count' }],
      statusDistribution: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
      departmentDistribution: [{ $group: { _id: '$department', count: { $sum: 1 } } }],
      averages: [
        {
          $group: {
            _id: null,
            avgTenth: { $avg: '$tenthPercentage' },
            avgTwelfth: { $avg: '$twelfthPercentage' }
          }
        }
      ]
    }
  }
])
```
This demonstrates scalable, database-level computation suitable for high-throughput institutional applications.

---

## 8. Limitations & Future Enhancements

While this POC meets all lab requirements, potential real-world production enhancements include:
- **Email/SMS Notifications:** Triggering transactional email alerts (via Nodemailer or SendGrid) whenever an applicant's status transitions to `Selected` or `Rejected`.
- **Payment Gateway Integration:** Integrating Razorpay or Stripe for admission form processing fees.
- **Automated Optical Character Recognition (OCR):** Using Tesseract or cloud OCR to automatically cross-verify uploaded marksheets with entered percentages.
- **Containerization:** Packaging client, server, and MongoDB into a multi-container `docker-compose` configuration.

