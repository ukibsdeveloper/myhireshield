import express from 'express';
import {
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
 * --- PUBLIC ROUTES ---
 * Ye routes bina login ke bhi access ho sakte hain (Filters & View Only)
 */

// Search with Filters & Rate Limiting
router.get('/search', searchLimiter, validateEmployeeSearch, searchEmployees);

// Public Profile View
router.get('/:id', validateIdParam('id'), getEmployeeById);

// Public Stats (Ratings & Scores)
router.get('/:id/stats', validateIdParam('id'), getEmployeeStats);

/**
 * --- PROTECTED ROUTES (Employee Only) ---
 * In routes ke liye Token aur 'employee' role hona zaroori hai
 */

// Get Logged-in Employee's own profile
router.get('/profile', protect, authorize('employee'), getMyProfile);

// Update Profile Details
router.put('/profile', protect, authorize('employee'), updateProfile);

// Privacy: Toggle Profile Visibility (Public/Private)
router.put('/visibility', protect, authorize('employee'), updateVisibility);

// GDPR: Provide or Withdraw Data Consent
router.post('/consent', protect, authorize('employee'), giveConsent);

// GDPR: Download all personal data
router.get('/export', protect, authorize('employee'), exportData);

// GDPR: Deactivate/Delete Account
router.delete('/profile', protect, authorize('employee'), deleteAccount);

export default router;