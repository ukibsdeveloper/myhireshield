import express from 'express';
import {
  createReview,
  getEmployeeReviews,
  getCompanyReviews,
  updateReview,
  deleteReview,
  getReviewStats
} from '../controllers/review.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { reviewLimiter } from '../middleware/rateLimiter.js';
import { validateReview } from '../middleware/validation.middleware.js';

const router = express.Router();

/**
 * --- PUBLIC ROUTES ---
 * Ye routes employee ki ratings aur reviews dekhne ke liye hain
 */

// Get all reviews for a specific employee
router.get('/employee/:employeeId', getEmployeeReviews);

// Get aggregated statistics (Average ratings) for an employee
router.get('/stats/:employeeId', getReviewStats);

/**
 * --- PROTECTED ROUTES (Company Only) ---
 * In routes ke liye 'company' role aur Valid Token hona zaroori hai
 */

// Create a new review (Includes Rate Limiting & Validation)
router.post(
  '/', 
  protect, 
  authorize('company'), 
  reviewLimiter, 
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

// Update an existing review (Edit History track hogi controller mein)
router.put(
  '/:id', 
  protect, 
  authorize('company'), 
  validateReview, 
  updateReview
);

// Delete a review (Soft delete logic controller mein handle hai)
router.delete(
  '/:id', 
  protect, 
  authorize('company'), 
  deleteReview
);

export default router;