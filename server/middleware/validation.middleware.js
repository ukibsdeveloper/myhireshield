import { body, query, param, validationResult } from 'express-validator';
import { validatePasswordStrength } from './security.middleware.js';

/**
 * Global Validation Error Handler
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * 1. Company Registration Rules — Strong Password Enforced
 */
export const validateCompanyRegistration = [
  body('companyName').trim().notEmpty().withMessage('Company name is required')
    .isLength({ max: 100 }).withMessage('Company name must be under 100 characters')
    .matches(/^[a-zA-Z0-9\s&.\-,'()]+$/).withMessage('Company name contains invalid characters'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .custom((value) => {
      const result = validatePasswordStrength(value);
      if (!result.isValid) {
        throw new Error(result.errors.join('. '));
      }
      return true;
    }),
  body('industry').notEmpty().withMessage('Industry type is required')
    .isLength({ max: 50 }).withMessage('Industry must be under 50 characters'),
  body('companySize').notEmpty().withMessage('Company size is required'),
  body('contactPerson.name').trim().notEmpty().withMessage('Contact person name is required')
    .isLength({ max: 50 }).withMessage('Contact name must be under 50 characters'),
  body('contactPerson.phone').notEmpty().withMessage('Contact phone is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Invalid Indian phone number'),
  body('address.city').notEmpty().withMessage('City is required')
    .isLength({ max: 50 }).withMessage('City must be under 50 characters'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.pincode').isLength({ min: 6, max: 6 }).withMessage('Pincode must be 6 digits')
    .isNumeric().withMessage('Pincode must contain only digits'),
  body('website').optional().isURL().withMessage('Invalid website URL'),
  body('gstin').optional().matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).withMessage('Invalid GSTIN format'),
  validate
];

/**
 * 2. Employee Registration Rules — Strong Password Enforced
 */
export const validateEmployeeRegistration = [
  body('firstName').trim().notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name must be under 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('First name can only contain letters'),
  body('lastName').trim().notEmpty().withMessage('Last name is required')
    .isLength({ max: 50 }).withMessage('Last name must be under 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Last name can only contain letters'),
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .custom((value) => {
      const result = validatePasswordStrength(value);
      if (!result.isValid) {
        throw new Error(result.errors.join('. '));
      }
      return true;
    }),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Invalid Indian phone number'),
  body('dateOfBirth').isISO8601().withMessage('DOB must be a valid date (YYYY-MM-DD)')
    .custom((value) => {
      const dob = new Date(value);
      const now = new Date();
      const age = Math.floor((now - dob) / (1000 * 60 * 60 * 24 * 365.25));
      if (age < 16) throw new Error('Must be at least 16 years old');
      if (age > 100) throw new Error('Invalid date of birth');
      return true;
    }),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender selection'),
  validate
];

/**
 * 3. Login Rules
 */
export const validateLogin = [
  body('role').isIn(['company', 'employee', 'admin']).withMessage('Role is required'),
  body('password').notEmpty().withMessage('Password is required')
    .isLength({ max: 128 }).withMessage('Password too long'),

  // Company ke liye email zaroori hai
  body('email').if(body('role').equals('company')).isEmail().withMessage('Email required for company login'),
  body('email').if(body('role').equals('admin')).isEmail().withMessage('Email required for admin login'),

  // Employee ke liye Name aur DOB zaroori hai
  body('firstName').if(body('role').equals('employee')).notEmpty().withMessage('First name required for employee login')
    .isLength({ max: 50 }).withMessage('Name too long'),
  body('dateOfBirth').if(body('role').equals('employee')).isISO8601().withMessage('Valid DOB (YYYY-MM-DD) required'),

  validate
];

/**
 * 4. Review Submission Rules
 */
export const validateReview = [
  body('employeeId').isMongoId().withMessage('Invalid Employee ID format'),
  body('ratings.*').isInt({ min: 1, max: 10 }).withMessage('Ratings must be 1-10'),
  body('comment').trim().isLength({ min: 20, max: 2000 }).withMessage('Comment must be 20-2000 characters')
    .escape(), // HTML escape the comment
  body('wouldRehire').isBoolean().withMessage('Rehire status must be boolean'),
  body('employmentDetails.startDate').isISO8601().withMessage('Valid start date required'),
  body('employmentDetails.endDate').isISO8601().withMessage('Valid end date required'),
  body('employmentDetails.designation').optional().trim()
    .isLength({ max: 100 }).withMessage('Designation must be under 100 characters'),
  body('employmentDetails.employmentType').optional()
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'freelance']).withMessage('Invalid employment type'),
  validate
];

/**
 * 5. Document Upload Rules
 */
export const validateDocumentUpload = [
  body('documentType').isIn(['aadhaar', 'pan', 'passport', 'driving_license', 'other']).withMessage('Invalid document type'),
  validate
];

/**
 * 6. Search Rules
 */
export const validateEmployeeSearch = [
  query('query').optional().trim().notEmpty().withMessage('Search term cannot be empty')
    .isLength({ max: 100 }).withMessage('Search term too long'),
  query('dob').optional().isISO8601().withMessage('DOB must be YYYY-MM-DD'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  validate
];

/**
 * 7. Password Change Rules — Strong Password Enforced
 */
export const validatePasswordChange = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      const result = validatePasswordStrength(value);
      if (!result.isValid) {
        throw new Error(result.errors.join('. '));
      }
      return true;
    }),
  validate
];

/**
 * 8. Password Reset Rules — Strong Password Enforced
 */
export const validatePasswordReset = [
  body('token').notEmpty().withMessage('Reset token is required')
    .isLength({ min: 20, max: 200 }).withMessage('Invalid token format'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .custom((value) => {
      const result = validatePasswordStrength(value);
      if (!result.isValid) {
        throw new Error(result.errors.join('. '));
      }
      return true;
    }),
  validate
];

/**
 * 9. MongoDB ID Param Validator (Generic Factory)
 */
export const validateIdParam = (paramName = 'id') => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName} format`),
  validate
];

// Provide default for backward compatibility
export const validateMongoId = validateIdParam('id');

/**
 * 10. Email Validator (for forgot password, etc.)
 */
export const validateEmail = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  validate
];

/**
 * 11. 2FA Code Validator
 */
export const validate2FACode = [
  body('code')
    .notEmpty().withMessage('2FA code is required')
    .isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits')
    .isNumeric().withMessage('Code must contain only numbers'),
  validate
];