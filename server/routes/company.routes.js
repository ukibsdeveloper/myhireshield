import express from 'express';
import Company from '../models/Company.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * @desc    Get current company profile
 * @route   GET /api/companies/profile
 * @access  Private (Company only)
 */
router.get('/profile', apiLimiter, protect, authorize('company'), async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile nahi mila.'
      });
    }

    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Profile fetch karne mein error aaya.',
      error: error.message
    });
  }
});

/**
 * @desc    Update company profile details
 * @route   PUT /api/companies/profile
 * @access  Private (Company only)
 */
router.put('/profile', protect, authorize('company'), async (req, res) => {
  try {
    // Only allow specific fields to be updated for security
    const allowedUpdates = [
      'companyName', 
      'website', 
      'industry', 
      'companySize', 
      'address', 
      'contactPerson', 
      'logo'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const company = await Company.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Update ke liye company profile nahi mila.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Company profile successfully update ho gaya.',
      data: company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Update fail ho gaya.',
      error: error.message
    });
  }
});

export default router;