import express from 'express';
import {
  register,
  login,
  getMe,
  getAdminPersonas,
  getAdminStaff,
  createAdminStaff
} from '../controllers/auth.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);

// Public list of active admin personas for quick multi-admin login switch
router.get('/admin-personas', getAdminPersonas);

// Administrative management endpoints
router.get('/admins', authenticate, authorize('admin'), getAdminStaff);
router.post('/admins', authenticate, authorize('admin'), createAdminStaff);

export default router;

