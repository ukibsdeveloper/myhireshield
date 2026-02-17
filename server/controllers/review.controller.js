import Review from '../models/Review.model.js';
import Employee from '../models/Employee.model.js';
import Company from '../models/Company.model.js';
import AuditLog from '../models/AuditLog.model.js';
import mongoose from 'mongoose';

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private (Company only)
export const createReview = async (req, res) => {
  try {
    const { employeeId, ratings, employmentDetails, comment, wouldRehire, tags } = req.body;

    // Handle File Assets from req.files (Multer)
    const verificationAssets = {
      govId: req.files?.['govId'] ? `/uploads/documents/${req.files['govId'][0].filename}` : undefined,
      experienceCertificate: req.files?.['expCert'] ? `/uploads/documents/${req.files['expCert'][0].filename}` : undefined
    };

    // Data structuring with explicit Number conversion
    // Note: Ratings might come as strings from FormData
    const ratingsData = {
      workQuality: Number(ratings?.workQuality) || 1,
      punctuality: Number(ratings?.punctuality) || 1,
      behavior: Number(ratings?.behavior) || 1,
      teamwork: Number(ratings?.teamwork) || 1,
      communication: Number(ratings?.communication) || 1,
      technicalSkills: Number(ratings?.technicalSkills) || 1,
      problemSolving: Number(ratings?.problemSolving) || 1,
      reliability: Number(ratings?.reliability) || 1
    };

    const reviewData = {
      companyId: req.user.profileId,
      employeeId,
      ratings: ratingsData,
      verificationAssets,
      employmentDetails: {
        designation: employmentDetails.designation,
        startDate: new Date(employmentDetails.startDate),
        endDate: new Date(employmentDetails.endDate),
        employmentType: employmentDetails.employmentType,
        department: employmentDetails.department
      },
      comment,
      wouldRehire: wouldRehire === 'true' || wouldRehire === true,
      tags: tags || [],
      createdBy: req.user._id,
      moderationStatus: 'pending'
    };

    const review = await Review.create(reviewData);

    // Score Update logic in Employee Model
    const employee = await Employee.findById(employeeId);
    if (employee && typeof employee.updateScore === 'function') {
      await employee.updateScore();
    }

    // Create audit log
    await AuditLog.createLog({
      userId: req.user._id,
      userEmail: req.user.email,
      userRole: 'company',
      eventType: 'review_created',
      eventData: { employeeId, reviewId: review._id },
      ipAddress: req.ip,
      status: 'success'
    });

    return res.status(201).json({ success: true, data: review });

  } catch (error) {
    console.error("Review Controller Error:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews for an employee
// @route   GET /api/reviews/employee/:employeeId
export const getEmployeeReviews = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await Employee.findById(employeeId);

    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

    if (!employee.profileVisible || !employee.consentGiven) {
      return res.status(403).json({ success: false, message: 'Employee profile is not public' });
    }

    const reviews = await Review.find({
      employeeId,
      isActive: true,
      $or: [{ moderationStatus: 'approved' }, { moderationStatus: { $exists: false } }]
    })
      .populate('companyId', 'companyName industry logo verified')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching reviews', error: error.message });
  }
};

// @desc    Get company's reviews
// @route   GET /api/reviews/company
export const getCompanyReviews = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

    const reviews = await Review.find({ companyId: company._id, isActive: true })
      .populate('employeeId', 'firstName lastName email currentDesignation')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching reviews' });
  }
};

// @desc    Get review by ID
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('employeeId', 'firstName lastName email currentDesignation');

    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    // Check if company is authorized to see this review
    const company = await Company.findOne({ userId: req.user._id });
    if (!company || review.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Fetch failed' });
  }
};

// @desc    Update review with Edit History
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { ratings, comment, wouldRehire } = req.body;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    const company = await Company.findOne({ userId: req.user._id });
    if (!company || review.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Capture changes for history
    const changes = {};
    if (ratings) {
      review.ratings = ratings;
      const vals = Object.values(ratings);
      review.averageRating = vals.reduce((a, b) => a + b, 0) / vals.length;
      changes.ratings = ratings;
    }
    if (comment) { review.comment = comment; changes.comment = comment; }
    if (wouldRehire !== undefined) { review.wouldRehire = wouldRehire; changes.wouldRehire = wouldRehire; }

    if (!review.editHistory) review.editHistory = [];
    review.editHistory.push({
      editedAt: Date.now(),
      editedBy: req.user._id,
      changes
    });

    await review.save();

    const employee = await Employee.findById(review.employeeId);
    if (employee) await employee.updateScore();

    res.status(200).json({ success: true, message: 'Review updated', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};

// @desc    Delete review (Soft Delete)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    const company = await Company.findOne({ userId: req.user._id });
    if (!company || review.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    review.isActive = false;
    review.deletedAt = Date.now();
    await review.save();

    const employee = await Employee.findById(review.employeeId);
    if (employee) await employee.updateScore();

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
};

// @desc    Get pending reviews (Admin only - for team verification)
// @route   GET /api/reviews/admin/pending
export const getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isActive: true, moderationStatus: 'pending' })
      .populate('employeeId', 'firstName lastName email')
      .populate('companyId', 'companyName')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching pending reviews' });
  }
};

// @desc    Approve or reject review (Admin only)
// @route   PUT /api/reviews/admin/:id/moderate
export const moderateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Action must be approve or reject' });
    }

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.moderationStatus !== 'pending') {
      return res.status(400).json({ success: false, message: 'Review is not pending moderation' });
    }

    review.moderationStatus = action === 'approve' ? 'approved' : 'rejected';
    review.verifiedBy = req.user._id;
    review.verifiedAt = new Date();
    await review.save();

    if (review.moderationStatus === 'approved') {
      const employee = await Employee.findById(review.employeeId);
      if (employee) await employee.updateScore();
    }

    res.status(200).json({
      success: true,
      message: action === 'approve' ? 'Review approved and now visible on the website' : 'Review rejected',
      data: review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Moderation failed' });
  }
};

// @desc    Get review statistics using Aggregation Pipeline
export const getReviewStats = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const stats = await Review.aggregate([
      {
        $match: {
          employeeId: new mongoose.Types.ObjectId(employeeId),
          isActive: true,
          $or: [{ moderationStatus: 'approved' }, { moderationStatus: { $exists: false } }]
        }
      },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          avgWorkQuality: { $avg: '$ratings.workQuality' },
          avgPunctuality: { $avg: '$ratings.punctuality' },
          avgBehavior: { $avg: '$ratings.behavior' },
          avgTeamwork: { $avg: '$ratings.teamwork' },
          avgCommunication: { $avg: '$ratings.communication' },
          avgTechnicalSkills: { $avg: '$ratings.technicalSkills' },
          avgProblemSolving: { $avg: '$ratings.problemSolving' },
          avgReliability: { $avg: '$ratings.reliability' },
          avgOverall: { $avg: '$averageRating' },
          wouldRehireCount: { $sum: { $cond: ['$wouldRehire', 1, 0] } }
        }
      }
    ]);

    res.status(200).json({ success: true, data: stats[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Stats error' });
  }
};