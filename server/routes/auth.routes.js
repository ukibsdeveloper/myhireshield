import express from 'express';
import {
  registerCompany,
  registerEmployee,
  login,
  logout,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import {
  validateCompanyRegistration,
  validateEmployeeRegistration,
  validateLogin
} from '../middleware/validation.middleware.js';
import { authLimiter, registerLimiter, loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * --- PUBLIC ROUTES ---
 */

// Company Registration
router.post('/register/company', registerLimiter, validateCompanyRegistration, registerCompany);

// Employee Registration
router.post('/register/employee', registerLimiter, validateEmployeeRegistration, registerEmployee);

// Login (Using loginLimiter for specific protection)
router.post('/login', loginLimiter, validateLogin, login);

// Email Verification
router.get('/verify-email/:token', verifyEmail);

// Password Management
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

/**
 * --- PROTECTED ROUTES (Requires Token) ---
 */

// Get Current User Profile
router.get('/me', protect, getMe);

// Logout
router.post('/logout', protect, logout);

// Change Password (Auth required)
router.put('/change-password', protect, changePassword);

export default router;