import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Application } from './models/Application.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  await connectDB();

  console.log('[Seed] Clearing existing collections...');
  await User.deleteMany({});
  await Application.deleteMany({});

  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const samplePdfPath = path.join(uploadsDir, 'sample-marksheet.pdf');
  if (!fs.existsSync(samplePdfPath)) {
    fs.writeFileSync(samplePdfPath, '%PDF-1.4 Mock Marksheet Certificate for IEM Kolkata Admissions %EOF');
  }

  console.log('[Seed] Creating Director & Applicant accounts...');

  const admin = await User.create({
    name: 'Prof. Dr. Satyajit Chakraborty (Director, IEM Kolkata)',
    email: 'admin@college.edu',
    password: 'admin123',
    role: 'admin'
  });

  const student1 = await User.create({
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    password: 'student123',
    role: 'applicant'
  });

  const student2 = await User.create({
    name: 'Diya Patel',
    email: 'diya@example.com',
    password: 'student123',
    role: 'applicant'
  });

  const student3 = await User.create({
    name: 'Rohan Verma',
    email: 'rohan@example.com',
    password: 'student123',
    role: 'applicant'
  });

  const student4 = await User.create({
    name: 'Ananya Sen',
    email: 'ananya@example.com',
    password: 'student123',
    role: 'applicant'
  });

  console.log('[Seed] Creating B.Tech applications with workflow histories...');

  await Application.create([
    {
      applicant: student1._id,
      fullName: 'Aarav Sharma',
      dob: new Date('2005-04-12'),
      gender: 'Male',
      phone: '+91 98765 43210',
      email: 'aarav@example.com',
      address: '42 MG Road, Salt Lake, Kolkata',
      guardianName: 'Rajesh Sharma',
      tenthBoard: 'CBSE',
      tenthPercentage: 94,
      twelfthBoard: 'CBSE',
      twelfthPercentage: 96,
      entranceScore: 98.4,
      department: 'B.Tech - Computer Science & Engineering (CSE)',
      document: {
        originalName: '12th_Marksheet_Aarav.pdf',
        filename: 'sample-marksheet.pdf',
        path: '/uploads/sample-marksheet.pdf',
        mimetype: 'application/pdf',
        size: 1048576,
        uploadedAt: new Date()
      },
      status: 'Selected',
      statusHistory: [
        {
          status: 'Submitted',
          updatedBy: student1._id,
          comments: 'Application submitted with CBSE Class 12 marksheet & WBJEE rankcard',
          timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000)
        },
        {
          status: 'Under Review',
          updatedBy: admin._id,
          comments: 'Academic credentials verified. WBJEE merit cutoff satisfied for B.Tech CSE.',
          timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000)
        },
        {
          status: 'Selected',
          updatedBy: admin._id,
          comments: 'Provisional Admission Offer issued for B.Tech CSE (Gurukul Campus).',
          timestamp: new Date()
        }
      ]
    },
    {
      applicant: student2._id,
      fullName: 'Diya Patel',
      dob: new Date('2005-08-23'),
      gender: 'Female',
      phone: '+91 91234 56789',
      email: 'diya@example.com',
      address: '15 Sector V, Salt Lake, Kolkata',
      guardianName: 'Hitesh Patel',
      tenthBoard: 'ISC',
      tenthPercentage: 91,
      twelfthBoard: 'ISC',
      twelfthPercentage: 89,
      entranceScore: 92.1,
      department: 'B.Tech - CSE (AI & ML)',
      document: {
        originalName: 'Diya_Marksheet.pdf',
        filename: 'sample-marksheet.pdf',
        path: '/uploads/sample-marksheet.pdf',
        mimetype: 'application/pdf',
        size: 845200,
        uploadedAt: new Date()
      },
      status: 'Under Review',
      statusHistory: [
        {
          status: 'Submitted',
          updatedBy: student2._id,
          comments: 'Application submitted for B.Tech CSE (AI & ML)',
          timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000)
        },
        {
          status: 'Under Review',
          updatedBy: admin._id,
          comments: 'Counseling verification in progress for IEMJEE / JEE Main ranks.',
          timestamp: new Date()
        }
      ]
    },
    {
      applicant: student3._id,
      fullName: 'Rohan Verma',
      dob: new Date('2004-11-05'),
      gender: 'Male',
      phone: '+91 94567 89012',
      email: 'rohan@example.com',
      address: '88 New Town Action Area 1, Kolkata',
      guardianName: 'Vikas Verma',
      tenthBoard: 'WBCHSE',
      tenthPercentage: 84,
      twelfthBoard: 'WBCHSE',
      twelfthPercentage: 86,
      entranceScore: 85.0,
      department: 'B.Tech - Electronics & Communication Engineering (ECE)',
      document: {
        originalName: 'Marksheet_Rohan.pdf',
        filename: 'sample-marksheet.pdf',
        path: '/uploads/sample-marksheet.pdf',
        mimetype: 'application/pdf',
        size: 789120,
        uploadedAt: new Date()
      },
      status: 'Submitted',
      statusHistory: [
        {
          status: 'Submitted',
          updatedBy: student3._id,
          comments: 'Application filed online with Class 12 WBCHSE marksheet',
          timestamp: new Date()
        }
      ]
    },
    {
      applicant: student4._id,
      fullName: 'Ananya Sen',
      dob: new Date('2005-01-30'),
      gender: 'Female',
      phone: '+91 97890 12345',
      email: 'ananya@example.com',
      address: '10 Southern Avenue, Kolkata',
      guardianName: 'Subir Sen',
      tenthBoard: 'ICSE',
      tenthPercentage: 68,
      twelfthBoard: 'ISC',
      twelfthPercentage: 42,
      entranceScore: 32.0,
      department: 'B.Tech - Information Technology (IT)',
      document: {
        originalName: 'Ananya_ISC_Doc.pdf',
        filename: 'sample-marksheet.pdf',
        path: '/uploads/sample-marksheet.pdf',
        mimetype: 'application/pdf',
        size: 921400,
        uploadedAt: new Date()
      },
      status: 'Rejected',
      statusHistory: [
        {
          status: 'Submitted',
          updatedBy: student4._id,
          comments: 'Initial application submitted',
          timestamp: new Date(Date.now() - 7 * 24 * 3600 * 1000)
        },
        {
          status: 'Under Review',
          updatedBy: admin._id,
          comments: 'Eligibility verification against AICTE/WBJEE 45% aggregate cutoff.',
          timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000)
        },
        {
          status: 'Rejected',
          updatedBy: admin._id,
          comments: 'Does not satisfy mandatory 45% PCM minimum eligibility threshold.',
          timestamp: new Date()
        }
      ]
    }
  ]);

  console.log('✅ [Seed] Database successfully seeded with IEM Kolkata data!');
  console.log('----------------------------------------------------------------------');
  console.log('Admin (Director): admin@college.edu / admin123 (Prof. Dr. Satyajit Chakraborty)');
  console.log('----------------------------------------------------------------------');

  process.exit(0);
}

seed().catch(err => {
  console.error('[Seed Error]', err);
  process.exit(1);
});
