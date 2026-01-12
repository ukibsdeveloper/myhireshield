import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import Review from '../models/Review.model.js';
import Employee from '../models/Employee.model.js';
import Company from '../models/Company.model.js';
import Document from '../models/Document.model.js';
import AuditLog from '../models/AuditLog.model.js';

const router = express.Router();

/**
 * @desc    Get Company Dashboard Analytics
 * @route   GET /api/analytics/company
 * @access  Private (Company Only)
 */
router.get('/company', protect, authorize('company'), async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }

    // 1. Core Stats for Cards
    const totalReviews = await Review.countDocuments({ companyId: company._id, isActive: true });
    const employeesReviewed = await Review.distinct('employeeId', { companyId: company._id });
    
    // 2. Trust Rating & Clearance Logic
    // Agar company verified hai toh 95%, varna default 75%
    const trustRating = company.verified ? 95 : 75;

    // 3. Recent Audit Ledger (Matches Table in Dashboard)
    const recentReviews = await Review.find({ companyId: company._id, isActive: true })
      .sort({ createdAt: -1 })
      .limit(3) // Sirf top 3 results table ke liye
      .populate('employeeId', 'firstName lastName email currentDesignation overallScore profilePicture');

    // 4. Review Trends (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const reviewTrends = await Review.aggregate([
      {
        $match: {
          companyId: company._id,
          isActive: true,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalReviews,
        staffNodesCount: employeesReviewed.length, // Updated key name for frontend sync
        trustRating, // Added for gauge sync
        recentReviews, // Added for table sync
        reviewTrends
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @desc    Get Employee Profile Analytics
 * @route   GET /api/analytics/employee
 * @access  Private (Employee Only)
 */
router.get('/employee', protect, authorize('employee'), async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    // 1. Documentation & Profile Stats
    const totalReviews = await Review.countDocuments({ employeeId: employee._id, isActive: true });
    const totalDocuments = await Document.countDocuments({ employeeId: employee._id });
    const verifiedDocuments = await Document.countDocuments({ 
      employeeId: employee._id, 
      verificationStatus: 'verified' 
    });
    
    // 2. Profile Views
    const profileViews = employee.profileViews || 0;

    // 3. Recent Feedbacks
    const recentReviews = await Review.find({ employeeId: employee._id, isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('companyId', 'companyName industry logo verified');

    // 4. Score Breakdown Logic
    const reviews = await Review.find({ employeeId: employee._id, isActive: true });
    const parameters = ['workQuality', 'punctuality', 'behavior', 'teamwork', 'communication', 'technicalSkills', 'problemSolving', 'reliability'];
    
    const scoreBreakdown = {};
    parameters.forEach(param => {
        const sum = reviews.reduce((acc, rev) => acc + (rev.ratings[param] || 0), 0);
        scoreBreakdown[param] = reviews.length ? Math.round((sum / reviews.length) * 10) : 0;
    });

    res.status(200).json({
      success: true,
      data: {
        totalReviews,
        totalDocuments,
        verifiedDocuments,
        profileViews,
        overallScore: employee.overallScore,
        verificationPercentage: employee.verificationPercentage,
        scoreBreakdown,
        recentReviews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;