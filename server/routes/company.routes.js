import express from 'express';
import {
  getProfile,
  updateProfile,
  getCompanyStats,
  getEmployees,
  deleteCompanyAccount
} from '../controllers/company.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

/*
 * COMPANY ROUTES
 * Base Path: /api/companies (set in server.js)
 */

// Universal Middleware for this router
router.use(protect, authorize(ROLES.COMPANY));

// Profile Management
router.get('/profile', apiLimiter, getProfile);
router.put('/profile', updateProfile);

// Dashboard & Analytics
router.get('/stats', apiLimiter, getCompanyStats);

// Employee Management (View Only - Creation is in Auth/Employee routes)
router.get('/employees', apiLimiter, getEmployees);

// Account Management
router.delete('/account', deleteCompanyAccount);

export default router;