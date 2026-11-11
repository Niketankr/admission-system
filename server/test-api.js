// Automated API Verification Script for PCCCS504 Software Engineering Lab POC
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting Automated API Suite for Online Admission System...');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE}/health`);
    const health = await healthRes.json();
    assert(healthRes.status === 200 && health.status === 'ok', '1. System Health Check (/api/health)');

    // 2. Admin Login (RBAC)
    const adminLoginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@college.edu', password: 'admin123' })
    });
    const adminAuth = await adminLoginRes.json();
    assert(adminLoginRes.status === 200 && adminAuth.user.role === 'admin', '2. Admin Login & JWT Generation (/api/auth/login)');
    const adminToken = adminAuth.token;

    // 3. Student Login
    const stuLoginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'aarav@example.com', password: 'student123' })
    });
    const stuAuth = await stuLoginRes.json();
    assert(stuLoginRes.status === 200 && stuAuth.user.role === 'applicant', '3. Student Login & Profile Retrieval');
    const stuToken = stuAuth.token;

    // 4. Student View Own Application
    const myAppRes = await fetch(`${BASE}/applications/my`, {
      headers: { Authorization: `Bearer ${stuToken}` }
    });
    const myAppData = await myAppRes.json();
    assert(myAppRes.status === 200 && myAppData.application.status === 'Selected', '4. Student Application & Status Tracking (/api/applications/my)');

    // 5. Admin Analytics Dashboard (Aggregation Pipeline)
    const statsRes = await fetch(`${BASE}/applications/stats/summary`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const stats = await statsRes.json();
    assert(statsRes.status === 200 && stats.total >= 4 && stats.averages.avgTenth > 0, '5. Admin Analytics Aggregation (/api/applications/stats/summary)');

    // 6. Admin Filter Applicants by Department
    const filterRes = await fetch(`${BASE}/applications?department=B.Tech%20-%20Computer%20Science%20%26%20Engineering%20(CSE)`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const filtered = await filterRes.json();
    assert(filterRes.status === 200 && filtered.applications.length > 0, '6. Admin Filter by Department Query Parameter');

    // 7. Security & RBAC Enforcement (Student cannot view admin stats)
    const unauthorizedRes = await fetch(`${BASE}/applications/stats/summary`, {
      headers: { Authorization: `Bearer ${stuToken}` }
    });
    assert(unauthorizedRes.status === 403, '7. RBAC Security Check: Applicant blocked from Admin Stats (403 Forbidden)');

    // 8. Workflow Validation Engine: Illegal transition rejection
    const targetApp = filtered.applications[0];
    const illegalTransitionRes = await fetch(`${BASE}/applications/${targetApp._id}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'Submitted' }) // Illegal transition from Selected
    });
    assert(illegalTransitionRes.status === 400, '8. State Machine Workflow Validation (Rejects Illegal Status Jump with 400)');

    // 9. Multi-Admin Personas Endpoint
    const personasRes = await fetch(`${BASE}/auth/admin-personas`);
    const personas = await personasRes.json();
    assert(personasRes.status === 200 && personas.admins.length >= 4, '9. Multi-Admin Profiles & Personas (/api/auth/admin-personas)');

    // 10. Main Admin Provisions New Administrator
    const directorLoginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'director@iem.edu.in', password: 'admin123' })
    });
    const directorAuth = await directorLoginRes.json();
    const directorToken = directorAuth.token;

    const newAdminEmail = `test.hod.${Date.now()}@iem.edu.in`;
    const addAdminRes = await fetch(`${BASE}/auth/admins`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${directorToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Dr. Test Administrator',
        email: newAdminEmail,
        password: 'admin123',
        designation: 'Department Head (Research)',
        department: 'Information Technology'
      })
    });
    const addAdminData = await addAdminRes.json();
    assert(addAdminRes.status === 201 && addAdminData.admin.email === newAdminEmail, '10. Main Admin Provisions New Administrator (/api/auth/admins)');

    // 11. Security Check: Non-Main Admin Blocked from Provisioning (403 Forbidden)
    const officerLoginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admissions.officer@iem.edu.in', password: 'admin123' })
    });
    const officerAuth = await officerLoginRes.json();
    const officerToken = officerAuth.token;

    const unauthorizedAddRes = await fetch(`${BASE}/auth/admins`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${officerToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Unauthorized User',
        email: 'unauth@iem.edu.in',
        password: 'admin123'
      })
    });
    assert(unauthorizedAddRes.status === 403, '11. Security Check: Only Main Admin (Director) Can Provision Admins (403 Forbidden)');

    console.log('\n==================================================');
    console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log('==================================================');

    if (failed === 0) {
      console.log('🎉 All Software Engineering POC requirements verified!');
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();

