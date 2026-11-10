import bcrypt from 'bcryptjs';

// Pre-hashed password for demo accounts ("admin123" and "student123")
const ADMIN_HASH = bcrypt.hashSync('admin123', 10);
const STUDENT_HASH = bcrypt.hashSync('student123', 10);

export const memoryStore = {
  users: [
    {
      _id: 'usr_admin_001',
      name: 'Dr. Sarah Jenkins (Dean of Admissions)',
      email: 'admin@college.edu',
      password: ADMIN_HASH,
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'usr_stu_001',
      name: 'Aarav Sharma',
      email: 'aarav@example.com',
      password: STUDENT_HASH,
      role: 'applicant',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      _id: 'usr_stu_002',
      name: 'Diya Patel',
      email: 'diya@example.com',
      password: STUDENT_HASH,
      role: 'applicant',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      _id: 'usr_stu_003',
      name: 'Rohan Verma',
      email: 'rohan@example.com',
      password: STUDENT_HASH,
      role: 'applicant',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'usr_stu_004',
      name: 'Ananya Sen',
      email: 'ananya@example.com',
      password: STUDENT_HASH,
      role: 'applicant',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
    }
  ],

  applications: [
    {
      _id: 'app_001',
      applicant: {
        _id: 'usr_stu_001',
        name: 'Aarav Sharma',
        email: 'aarav@example.com'
      },
      fullName: 'Aarav Sharma',
      dob: '2005-04-12T00:00:00.000Z',
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
        uploadedAt: new Date(Date.now() - 5 * 86400000).toISOString()
      },
      status: 'Selected',
      statusHistory: [
        {
          status: 'Submitted',
          updatedBy: { _id: 'usr_stu_001', name: 'Aarav Sharma' },
          comments: 'Initial submission with CBSE Class 12 marksheet',
          timestamp: new Date(Date.now() - 5 * 86400000).toISOString()
        },
        {
          status: 'Under Review',
          updatedBy: { _id: 'usr_admin_001', name: 'Dr. Sarah Jenkins' },
          comments: 'Document verified. Cut-off met for CSE department.',
          timestamp: new Date(Date.now() - 2 * 86400000).toISOString()
        },
        {
          status: 'Selected',
          updatedBy: { _id: 'usr_admin_001', name: 'Dr. Sarah Jenkins' },
          comments: 'Congratulations! Selected for CSE batch 2026-2030.',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      _id: 'app_002',
      applicant: {
        _id: 'usr_stu_002',
        name: 'Diya Patel',
        email: 'diya@example.com'
      },
      fullName: 'Diya Patel',
      dob: '2005-08-23T00:00:00.000Z',
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
        uploadedAt: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      status: 'Under Review',
      statusHistory: [
        {
          status: 'Submitted',
          updatedBy: { _id: 'usr_stu_002', name: 'Diya Patel' },
          comments: 'Application submitted',
          timestamp: new Date(Date.now() - 3 * 86400000).toISOString()
        },
        {
          status: 'Under Review',
          updatedBy: { _id: 'usr_admin_001', name: 'Dr. Sarah Jenkins' },
          comments: 'Checking entrance score and domicile quota certificates.',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      _id: 'app_003',
      applicant: {
        _id: 'usr_stu_003',
        name: 'Rohan Verma',
        email: 'rohan@example.com'
      },
      fullName: 'Rohan Verma',
      dob: '2004-11-05T00:00:00.000Z',
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
        uploadedAt: new Date().toISOString()
      },
      status: 'Submitted',
      statusHistory: [
        {
          status: 'Submitted',
          updatedBy: { _id: 'usr_stu_003', name: 'Rohan Verma' },
          comments: 'Fresh application submitted',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    },
    {
      _id: 'app_004',
      applicant: {
        _id: 'usr_stu_004',
        name: 'Ananya Sen',
        email: 'ananya@example.com'
      },
      fullName: 'Ananya Sen',
      dob: '2005-01-30T00:00:00.000Z',
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
        uploadedAt: new Date(Date.now() - 7 * 86400000).toISOString()
      },
      status: 'Rejected',
      statusHistory: [
        {
          status: 'Submitted',
          updatedBy: { _id: 'usr_stu_004', name: 'Ananya Sen' },
          comments: 'Initial submission',
          timestamp: new Date(Date.now() - 7 * 86400000).toISOString()
        },
        {
          status: 'Under Review',
          updatedBy: { _id: 'usr_admin_001', name: 'Dr. Sarah Jenkins' },
          comments: 'Screening for minimum eligibility cutoff.',
          timestamp: new Date(Date.now() - 4 * 86400000).toISOString()
        },
        {
          status: 'Rejected',
          updatedBy: { _id: 'usr_admin_001', name: 'Dr. Sarah Jenkins' },
          comments: 'Does not meet minimum aggregate percentage requirement (62% vs 70% cutoff).',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
    }
  ]
};

