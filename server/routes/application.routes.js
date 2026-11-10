import express from 'express';
import {
  submitApplication,
  getMyApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getDashboardStats
} from '../controllers/application.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Applicant routes
router.post('/', authenticate, authorize('applicant'), upload.single('document'), submitApplication);
router.get('/my', authenticate, authorize('applicant'), getMyApplication);

// Admin Analytics Dashboard route
router.get('/stats/summary', authenticate, authorize('admin'), getDashboardStats);

// Admin application listing (with search & filters)
router.get('/', authenticate, authorize('admin'), getAllApplications);

// Shared route (Applicant can view own, Admin can view any)
router.get('/:id', authenticate, getApplicationById);

// Admin update application status with workflow validation
router.patch('/:id/status', authenticate, authorize('admin'), updateApplicationStatus);

export default router;

