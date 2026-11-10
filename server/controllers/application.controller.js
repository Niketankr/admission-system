import { Application } from '../models/Application.js';
import { isMongoConnected } from '../config/db.js';
import { memoryStore } from '../config/memoryStore.js';

// Status workflow validator
function isValidTransition(currentStatus, newStatus) {
  const allowed = {
    Submitted: ['Under Review'],
    'Under Review': ['Selected', 'Rejected'],
    Selected: ['Under Review'],
    Rejected: ['Under Review']
  };
  return allowed[currentStatus]?.includes(newStatus) || false;
}

// Student submits application
export async function submitApplication(req, res) {
  try {
    const applicantId = String(req.user._id);

    if (!req.file) {
      return res.status(400).json({
        message: 'Marksheet or qualifying document is required. Please upload a PDF or image.'
      });
    }

    const {
      fullName,
      dob,
      gender,
      phone,
      email,
      address,
      guardianName,
      tenthBoard,
      tenthPercentage,
      twelfthBoard,
      twelfthPercentage,
      entranceScore,
      department
    } = req.body;

    const documentData = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date()
    };

    if (isMongoConnected) {
      const existing = await Application.findOne({ applicant: req.user._id });
      if (existing) {
        return res.status(400).json({
          message: 'You have already submitted an application. Check status in your dashboard.'
        });
      }

      const application = new Application({
        applicant: req.user._id,
        fullName,
        dob,
        gender,
        phone,
        email: email || req.user.email,
        address,
        guardianName,
        tenthBoard,
        tenthPercentage: Number(tenthPercentage),
        twelfthBoard,
        twelfthPercentage: Number(twelfthPercentage),
        entranceScore: entranceScore ? Number(entranceScore) : null,
        department,
        document: documentData,
        status: 'Submitted',
        statusHistory: [
          {
            status: 'Submitted',
            updatedBy: req.user._id,
            comments: 'Application initially submitted by applicant.',
            timestamp: new Date()
          }
        ]
      });

      await application.save();
      return res.status(201).json({ message: 'Application submitted successfully!', application });
    } else {
      // In-Memory Fallback
      const existing = memoryStore.applications.find(
        a => String(a.applicant?._id || a.applicant) === applicantId
      );
      if (existing) {
        return res.status(400).json({
          message: 'You have already submitted an application. Check status in your dashboard.'
        });
      }

      const newApp = {
        _id: `app_${Date.now()}`,
        applicant: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email
        },
        fullName,
        dob: new Date(dob).toISOString(),
        gender,
        phone,
        email: email || req.user.email,
        address,
        guardianName,
        tenthBoard,
        tenthPercentage: Number(tenthPercentage),
        twelfthBoard,
        twelfthPercentage: Number(twelfthPercentage),
        entranceScore: entranceScore ? Number(entranceScore) : null,
        department,
        document: documentData,
        status: 'Submitted',
        statusHistory: [
          {
            status: 'Submitted',
            updatedBy: { _id: req.user._id, name: req.user.name },
            comments: 'Application initially submitted by applicant.',
            timestamp: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString()
      };

      memoryStore.applications.unshift(newApp);
      return res.status(201).json({ message: 'Application submitted successfully!', application: newApp });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Submission failed.', error: err.message });
  }
}

// Student views their own application
export async function getMyApplication(req, res) {
  try {
    const applicantId = String(req.user._id);

    if (isMongoConnected) {
      const application = await Application.findOne({ applicant: req.user._id })
        .populate('applicant', 'name email')
        .populate('statusHistory.updatedBy', 'name email');

      if (!application) {
        return res.status(404).json({ message: 'No application found for this account.' });
      }

      return res.json({ application });
    } else {
      // In-Memory Fallback
      const application = memoryStore.applications.find(
        a => String(a.applicant?._id || a.applicant) === applicantId
      );

      if (!application) {
        return res.status(404).json({ message: 'No application found for this account.' });
      }

      return res.json({ application });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve application.', error: err.message });
  }
}

// Admin retrieves all applications with optional query filters
export async function getAllApplications(req, res) {
  try {
    const { department, status, search } = req.query;

    if (isMongoConnected) {
      const filter = {};
      if (department && department !== 'All') filter.department = department;
      if (status && status !== 'All') filter.status = status;
      if (search) {
        const searchRegex = new RegExp(search.trim(), 'i');
        filter.$or = [{ fullName: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
      }

      const applications = await Application.find(filter)
        .populate('applicant', 'name email')
        .sort({ createdAt: -1 });

      return res.json({ count: applications.length, applications });
    } else {
      // In-Memory Fallback
      let list = [...memoryStore.applications];

      if (department && department !== 'All') {
        list = list.filter(a => a.department === department);
      }
      if (status && status !== 'All') {
        list = list.filter(a => a.status === status);
      }
      if (search) {
        const q = search.trim().toLowerCase();
        list = list.filter(
          a =>
            a.fullName?.toLowerCase().includes(q) ||
            a.email?.toLowerCase().includes(q) ||
            a.phone?.includes(q)
        );
      }

      return res.json({ count: list.length, applications: list });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch applications.', error: err.message });
  }
}

// Single application by ID
export async function getApplicationById(req, res) {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const application = await Application.findById(id)
        .populate('applicant', 'name email')
        .populate('statusHistory.updatedBy', 'name email');

      if (!application) return res.status(404).json({ message: 'Application not found.' });

      if (req.user.role !== 'admin' && String(application.applicant._id) !== String(req.user._id)) {
        return res.status(403).json({ message: 'Unauthorized to view this application.' });
      }

      return res.json({ application });
    } else {
      const application = memoryStore.applications.find(a => String(a._id) === String(id));
      if (!application) return res.status(404).json({ message: 'Application not found.' });

      const ownerId = String(application.applicant?._id || application.applicant);
      if (req.user.role !== 'admin' && ownerId !== String(req.user._id)) {
        return res.status(403).json({ message: 'Unauthorized to view this application.' });
      }

      return res.json({ application });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Error retrieving application.', error: err.message });
  }
}

// Admin updates status with workflow validation
export async function updateApplicationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status: newStatus, comments } = req.body;

    if (isMongoConnected) {
      const application = await Application.findById(id);
      if (!application) return res.status(404).json({ message: 'Application not found.' });

      const currentStatus = application.status;
      if (currentStatus === newStatus) {
        return res.status(400).json({ message: `Application is already in '${newStatus}' status.` });
      }

      if (!isValidTransition(currentStatus, newStatus)) {
        return res.status(400).json({
          message: `Invalid workflow transition: Cannot move from '${currentStatus}' to '${newStatus}'. Allowed transitions from '${currentStatus}' are: ${
            currentStatus === 'Submitted'
              ? 'Under Review'
              : currentStatus === 'Under Review'
              ? 'Selected, Rejected'
              : 'Under Review'
          }`
        });
      }

      application.status = newStatus;
      application.statusHistory.push({
        status: newStatus,
        updatedBy: req.user._id,
        comments: comments || `Status transitioned from ${currentStatus} to ${newStatus}`,
        timestamp: new Date()
      });

      await application.save();
      return res.json({ message: `Status updated to ${newStatus} successfully.`, application });
    } else {
      // In-Memory Fallback
      const application = memoryStore.applications.find(a => String(a._id) === String(id));
      if (!application) return res.status(404).json({ message: 'Application not found.' });

      const currentStatus = application.status;
      if (currentStatus === newStatus) {
        return res.status(400).json({ message: `Application is already in '${newStatus}' status.` });
      }

      if (!isValidTransition(currentStatus, newStatus)) {
        return res.status(400).json({
          message: `Invalid workflow transition: Cannot move from '${currentStatus}' to '${newStatus}'. Allowed transitions from '${currentStatus}' are: ${
            currentStatus === 'Submitted'
              ? 'Under Review'
              : currentStatus === 'Under Review'
              ? 'Selected, Rejected'
              : 'Under Review'
          }`
        });
      }

      application.status = newStatus;
      application.statusHistory.push({
        status: newStatus,
        updatedBy: { _id: req.user._id, name: req.user.name },
        comments: comments || `Status transitioned from ${currentStatus} to ${newStatus}`,
        timestamp: new Date().toISOString()
      });

      return res.json({ message: `Status updated to ${newStatus} successfully.`, application });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update status.', error: err.message });
  }
}

// Admin Analytics Dashboard
export async function getDashboardStats(req, res) {
  try {
    if (isMongoConnected) {
      const stats = await Application.aggregate([
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
      ]);

      const result = stats[0] || {};
      const total = result.totalCount?.[0]?.count || 0;
      const statusCounts = { Submitted: 0, 'Under Review': 0, Selected: 0, Rejected: 0 };
      (result.statusDistribution || []).forEach(item => {
        if (item._id) statusCounts[item._id] = item.count;
      });

      const departmentCounts = {};
      (result.departmentDistribution || []).forEach(item => {
        if (item._id) departmentCounts[item._id] = item.count;
      });

      const averages = result.averages?.[0] || { avgTenth: 0, avgTwelfth: 0 };

      return res.json({
        total,
        statusCounts,
        departmentCounts,
        averages: {
          avgTenth: Math.round(averages.avgTenth || 0),
          avgTwelfth: Math.round(averages.avgTwelfth || 0)
        }
      });
    } else {
      // In-Memory Aggregation emulation
      const apps = memoryStore.applications;
      const total = apps.length;

      const statusCounts = { Submitted: 0, 'Under Review': 0, Selected: 0, Rejected: 0 };
      const departmentCounts = {};
      let sum10th = 0;
      let sum12th = 0;

      apps.forEach(a => {
        if (statusCounts[a.status] !== undefined) statusCounts[a.status]++;
        if (a.department) departmentCounts[a.department] = (departmentCounts[a.department] || 0) + 1;
        sum10th += Number(a.tenthPercentage) || 0;
        sum12th += Number(a.twelfthPercentage) || 0;
      });

      return res.json({
        total,
        statusCounts,
        departmentCounts,
        averages: {
          avgTenth: total ? Math.round(sum10th / total) : 0,
          avgTwelfth: total ? Math.round(sum12th / total) : 0
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Failed to aggregate stats.', error: err.message });
  }
}
