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

  // Ensure uploads directory exists with a sample dummy marksheet
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const samplePdfPath = path.join(uploadsDir, 'sample-marksheet.pdf');
  if (!fs.existsSync(samplePdfPath)) {
    fs.writeFileSync(samplePdfPath, '%PDF-1.4 Mock Marksheet Certificate for Demonstration %EOF');
  }

  console.log('[Seed] Creating Admin and Applicant accounts...');

  const admin = await User.create({
    name: 'Dr. Sarah Jenkins (Dean of Admissions)',
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

  console.log('[Seed] Creating applications with workflow histories...');

  await Application.create([
    {
      applicant: student1._id,
      fullName: 'Aarav Sharma',
      dob: new Date('2005-04-12'),
      gender: 'Male',
      phone: '+91 98765 43210',
      email: 'aarav@example.com',
      address: '42 MG Road, Bangalore, Karnataka',
      guardianName: 'Rajesh Sharma',
      tenthBoard: 'CBSE',
      tenthPercentage: 94,
      twelfthBoard: 'CBSE',
      twelfthPercentage: 96,
      entranceScore: 98.4,
      department: 'Computer Science & Engineering',
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
          comments: 'Initial submission with CBSE Class 12 marksheet',
          timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000)
        },
        {
          status: 'Under Review',
          updatedBy: admin._id,
          comments: 'Document verified. Cut-off met for CSE department.',
          timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000)
        },
        {
          status: 'Selected',
          updatedBy: admin._id,
          comments: 'Congratulations! Selected for CSE batch 2026-2030.',
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
      address: '15 Nehru Nagar, Ahmedabad, Gujarat',
      guardianName: 'Hitesh Patel',
      tenthBoard: 'GSEB',
      tenthPercentage: 91,
      twelfthBoard: 'GSEB',
      twelfthPercentage: 89,
      entranceScore: 92.1,
      department: 'Information Technology',
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
          comments: 'Application submitted',
          timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000)
        },
        {
          status: 'Under Review',
          updatedBy: admin._id,
          comments: 'Checking entrance score and domicile quota certificates.',
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
      address: '88 Civil Lines, Jaipur, Rajasthan',
      guardianName: 'Vikas Verma',
      tenthBoard: 'RBSE',
      tenthPercentage: 82,
      twelfthBoard: 'RBSE',
      twelfthPercentage: 84,
      entranceScore: 85.0,
      department: 'Electronics & Communication Engineering',
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
          comments: 'Fresh application submitted',
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
      address: '10 Park Street, Kolkata, West Bengal',
      guardianName: 'Subir Sen',
      tenthBoard: 'ICSE',
      tenthPercentage: 68,
      twelfthBoard: 'ISC',
      twelfthPercentage: 62,
      entranceScore: 48.0,
      department: 'Civil Engineering',
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
          comments: 'Initial submission',
          timestamp: new Date(Date.now() - 7 * 24 * 3600 * 1000)
        },
        {
          status: 'Under Review',
          updatedBy: admin._id,
          comments: 'Screening for minimum eligibility cutoff (minimum 70% in 12th).',
          timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000)
        },
        {
          status: 'Rejected',
          updatedBy: admin._id,
          comments: 'Does not meet minimum aggregate percentage requirement (62% vs 70% cutoff).',
          timestamp: new Date()
        }
      ]
    }
  ]);

  console.log('✅ [Seed] Database successfully seeded!');
  console.log('--------------------------------------------------');
  console.log('Admin Login:      admin@college.edu   / admin123');
  console.log('Student 1 (Selected): aarav@example.com   / student123');
  console.log('Student 2 (Review):   diya@example.com    / student123');
  console.log('Student 3 (Submitted):rohan@example.com   / student123');
  console.log('Student 4 (Rejected): ananya@example.com  / student123');
  console.log('--------------------------------------------------');

  process.exit(0);
}

seed().catch(err => {
  console.error('[Seed Error]', err);
  process.exit(1);
});

