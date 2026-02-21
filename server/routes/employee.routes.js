import express from 'express';
import {
  createEmployee,
  searchEmployees,
  getEmployeeById,
  getMyProfile,
  updateProfile,
  updateVisibility,
  giveConsent,
  exportData,
  deleteAccount,
  getEmployeeStats
} from '../controllers/employee.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { searchLimiter } from '../middleware/rateLimiter.js';
import { validateEmployeeSearch, validateIdParam } from '../middleware/validation.middleware.js';

const router = express.Router();

/**
 * --- PROTECTED: Company creates employees ---
 */
router.post('/create', protect, authorize('company'), createEmployee);

/**
 * --- PROTECTED: Employee's own routes ---
 * IMPORTANT: These must come BEFORE /:id to avoid treating 'profile', 'search', etc. as MongoDB IDs
 */
router.get('/profile', protect, authorize('employee'), getMyProfile);
router.put('/profile', protect, authorize('employee'), updateProfile);
router.delete('/profile', protect, authorize('employee'), deleteAccount);
router.put('/visibility', protect, authorize('employee'), updateVisibility);
router.post('/consent', protect, authorize('employee'), giveConsent);
router.get('/export', protect, authorize('employee'), exportData);

/**
 * --- PUBLIC / SEMI-PUBLIC ROUTES ---
 */
router.get('/search', searchLimiter, validateEmployeeSearch, searchEmployees);
router.get('/:id', validateIdParam('id'), getEmployeeById);
router.get('/:id/stats', validateIdParam('id'), getEmployeeStats);

export default router;
