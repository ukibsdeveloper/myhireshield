import { body, query, validationResult } from 'express-validator';

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
 * 1. Company Registration Rules
 */
export const validateCompanyRegistration = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('industry').notEmpty().withMessage('Industry type is required'),
  body('companySize').notEmpty().withMessage('Company size is required'),
  body('contactPerson.name').trim().notEmpty().withMessage('Contact person name is required'),
  body('contactPerson.designation').trim().notEmpty().withMessage('Contact person designation is required'),
  body('contactPerson.phone').notEmpty().withMessage('Contact phone is required'),
  body('contactPerson.email').isEmail().withMessage('Valid contact email required'),
  // Address validation optional but recommended
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.pincode').isLength({ min: 6, max: 6 }).withMessage('Pincode must be 6 digits'),
  validate
];
/**
 * 2. Employee Registration Rules
 */
export const validateEmployeeRegistration = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Minimum 6 characters required'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Invalid Indian phone number'),
  body('dateOfBirth').isISO8601().withMessage('DOB must be a valid date (YYYY-MM-DD)')
    .custom((value) => {
      const age = (new Date() - new Date(value)) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 18) throw new Error('Employee must be at least 18 years old');
      return true;
    }),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender selection'),
  validate
];

/**
 * 3. Login Rules (Updated for Name+DOB support)
 */
export const validateLogin = [
  body('role').isIn(['company', 'employee', 'admin']).withMessage('Role is required'),
  body('password').notEmpty().withMessage('Password is required'),
  
  // Conditional validation: If role is company, email is required
  body('email').if(body('role').equals('company')).isEmail().withMessage('Email required for company login'),
  
  // Conditional validation: If role is employee, firstName and DOB are required
  body('firstName').if(body('role').equals('employee')).notEmpty().withMessage('First name required for employee login'),
  body('dateOfBirth').if(body('role').equals('employee')).isISO8601().withMessage('DOB required for employee login'),
  
  validate
];

/**
 * 4. Review Submission Rules
 */
export const validateReview = [
  body('employeeId').isMongoId().withMessage('Invalid Employee ID format'),
  body('ratings.*').isInt({ min: 1, max: 10 }).withMessage('All ratings must be between 1 and 10'),
  body('comment').trim().isLength({ min: 20 }).withMessage('Comment should be at least 20 characters'),
  body('wouldRehire').isBoolean().withMessage('Rehire status must be true or false'),
  body('employmentDetails.startDate').isISO8601().withMessage('Invalid start date'),
  body('employmentDetails.endDate').isISO8601().withMessage('Invalid end date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.employmentDetails.startDate)) {
        throw new Error('End date cannot be before or same as start date');
      }
      return true;
    }),
  validate
];

/**
 * 5. Document Upload Rules
 */
export const validateDocumentUpload = [
  body('documentType').isIn(['aadhaar', 'pan', 'passport', 'driving_license', 'other']).withMessage('Invalid document type'),
  body('documentNumber').optional().trim().notEmpty().withMessage('Document number cannot be empty if provided'),
  validate
];

/**
 * 6. Search Rules (Query params validation)
 */
export const validateEmployeeSearch = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  validate
];