import bcrypt from 'bcryptjs';

// Pre-hashed password for demo accounts ("admin123" and "student123")
const ADMIN_HASH = bcrypt.hashSync('admin123', 10);
const STUDENT_HASH = bcrypt.hashSync('student123', 10);

export const memoryStore = {
  users: [
    {
      _id: 'usr_admin_001',
      name: 'Prof. Dr. Satyajit Chakraborty (Director, IEM Kolkata)',
      email: 'admin@college.edu',
      password: ADMIN_HASH,
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'usr_admin_002',
      name: 'Prof. Dr. Satyajit Chakraborty (Director, IEM Kolkata)',
      email: 'director@iem.edu.in',
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
        uploadedAt: new Date(Date.now() - 5 * 86400000).toISOString()
      },
      status: 'Selected',
      statusHistory: [
        {
          status: 'Submitted',
          updatedBy: { _id: 'usr_stu_001', name: 'Aarav Sharma' },
          comments: 'Application submitted with CBSE Class 12 marksheet & WBJEE rankcard',
          timestamp: new Date(Date.now() - 5 * 86400000).toISOString()
        },
        {
          status: 'Under Review',
          updatedBy: { _id: 'usr_admin_001', name: 'Prof. Dr. Satyajit Chakraborty' },
          comments: 'Academic credentials verified. WBJEE merit cutoff satisfied for B.Tech CSE.',
          timestamp: new Date(Date.now() - 2 * 86400000).toISOString()
        },
        {
          status: 'Selected',
          updatedBy: { _id: 'usr_admin_001', name: 'Prof. Dr. Satyajit Chakraborty' },
          comments: 'Provisional Admission Offer issued for B.Tech CSE (Gurukul Campus).',
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
        uploadedAt: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      status: 'Under Review',
      statusHistory: [
        {
          status: 'Submitted',
          updatedBy: { _id: 'usr_stu_002', name: 'Diya Patel' },
          comments: 'Application submitted for B.Tech CSE (AI & ML)',
          timestamp: new Date(Date.now() - 3 * 86400000).toISOString()
        },
        {
          status: 'Under Review',
          updatedBy: { _id: 'usr_admin_001', name: 'Prof. Dr. Satyajit Chakraborty' },
          comments: 'Counseling verification in progress for IEMJEE / JEE Main ranks.',
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
        uploadedAt: new Date().toISOString()
      },
      status: 'Submitted',
      statusHistory: [
        {
          status: 'Submitted',
          updatedBy: { _id: 'usr_stu_003', name: 'Rohan Verma' },
          comments: 'Application filed online with Class 12 WBCHSE marksheet',
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
        uploadedAt: new Date(Date.now() - 7 * 86400000).toISOString()
      },
      status: 'Rejected',
      statusHistory: [
        {
          status: 'Submitted',
          updatedBy: { _id: 'usr_stu_004', name: 'Ananya Sen' },
          comments: 'Initial application submitted',
          timestamp: new Date(Date.now() - 7 * 86400000).toISOString()
        },
        {
          status: 'Under Review',
          updatedBy: { _id: 'usr_admin_001', name: 'Prof. Dr. Satyajit Chakraborty' },
          comments: 'Eligibility verification against AICTE/WBJEE 45% aggregate cutoff.',
          timestamp: new Date(Date.now() - 4 * 86400000).toISOString()
        },
        {
          status: 'Rejected',
          updatedBy: { _id: 'usr_admin_001', name: 'Prof. Dr. Satyajit Chakraborty' },
          comments: 'Does not satisfy mandatory 45% PCM minimum eligibility threshold.',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
    }
  ]
};
