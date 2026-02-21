import express from 'express';
import {
  registerCompany,
  login,
  logout,
  getMe,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  enable2FA,
  verify2FA,
  disable2FA
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import {
  validateCompanyRegistration,
  validateLogin,
  validatePasswordChange,
  validatePasswordReset,
  validateEmail,
  validate2FACode
} from '../middleware/validation.middleware.js';
import { authLimiter, registerLimiter, loginLimiter, emailLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * --- PUBLIC ROUTES ---
 */

// Company Registration (Rate limited + Validated)
router.post('/register/company', registerLimiter, validateCompanyRegistration, registerCompany);

// NOTE: Employee registration removed — employees are created by companies via POST /api/employees/create

// Login (Rate limited + Validated)
router.post('/login', loginLimiter, validateLogin, login);

// Email Verification
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', emailLimiter, resendVerificationEmail);

// Password Management (Rate limited + Validated)
router.post('/forgot-password', emailLimiter, validateEmail, forgotPassword);
router.post('/reset-password', authLimiter, validatePasswordReset, resetPassword);

/**
 * --- PROTECTED ROUTES (Requires Token) ---
 */

// Get Current User Profile
router.get('/me', protect, getMe);

// Logout
router.post('/logout', protect, logout);

// Change Password (Auth required + Validated)
router.put('/change-password', protect, validatePasswordChange, changePassword);

// 2FA Routes (Rate limited)
router.post('/2fa/enable', protect, authLimiter, enable2FA);
router.post('/2fa/verify', protect, authLimiter, validate2FACode, verify2FA);
router.post('/2fa/disable', protect, authLimiter, disable2FA);

export default router;