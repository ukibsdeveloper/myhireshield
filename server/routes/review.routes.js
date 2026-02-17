import express from 'express';
import {
  createReview,
  getEmployeeReviews,
  getCompanyReviews,
  updateReview,
  deleteReview,
  getReviewStats,
  getReviewById,
  getPendingReviews,
  moderateReview
} from '../controllers/review.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { reviewLimiter } from '../middleware/rateLimiter.js';
import { validateReview, validateIdParam } from '../middleware/validation.middleware.js';

import { upload, handleMulterError } from '../middleware/upload.middleware.js';

const router = express.Router();

/**
 * --- PUBLIC ROUTES ---
 * Ye routes employee ki ratings aur reviews dekhne ke liye hain
 */

// Get all reviews for a specific employee
router.get('/employee/:employeeId', validateIdParam('employeeId'), getEmployeeReviews);

// Get aggregated statistics (Average ratings) for an employee
router.get('/stats/:employeeId', validateIdParam('employeeId'), getReviewStats);

/**
 * --- PROTECTED ROUTES (Company Only) ---
 * In routes ke liye 'company' role aur Valid Token hona zaroori hai
 */

// Middleware to parse stringified JSON from FormData
const parseReviewData = (req, res, next) => {
  if (req.body.ratings && typeof req.body.ratings === 'string') {
    try { req.body.ratings = JSON.parse(req.body.ratings); } catch (e) {
      return res.status(400).json({ success: false, message: 'Invalid ratings format' });
    }
  }
  if (req.body.employmentDetails && typeof req.body.employmentDetails === 'string') {
    try { req.body.employmentDetails = JSON.parse(req.body.employmentDetails); } catch (e) {
      return res.status(400).json({ success: false, message: 'Invalid employment details format' });
    }
  }
  next();
};

// Create a new review (Includes Rate Limiting, File Uploads & Validation)
router.post(
  '/',
  protect,
  authorize('company'),
  reviewLimiter,
  upload.fields([
    { name: 'govId', maxCount: 1 },
    { name: 'expCert', maxCount: 1 }
  ]),
  handleMulterError,
  parseReviewData,
  validateReview,
  createReview
);

// Get all reviews posted by the logged-in company
router.get(
  '/company',
  protect,
  authorize('company'),
  getCompanyReviews
);

// --- ADMIN: Verify reviews before they go live ---
router.get(
  '/admin/pending',
  protect,
  authorize('admin'),
  getPendingReviews
);
router.put(
  '/admin/:id/moderate',
  protect,
  authorize('admin'),
  validateIdParam('id'),
  moderateReview
);

// Get a single review by ID
router.get(
  '/:id',
  protect,
  authorize('company'),
  validateIdParam('id'),
  getReviewById
);

// Update an existing review (Edit History track hogi controller mein)
router.put(
  '/:id',
  protect,
  authorize('company'),
  validateIdParam('id'),
  validateReview,
  updateReview
);

// Delete a review (Soft delete logic controller mein handle hai)
router.delete(
  '/:id',
  protect,
  authorize('company'),
  validateIdParam('id'),
  deleteReview
);

export default router;