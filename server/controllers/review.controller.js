import Review from '../models/Review.model.js';
import Employee from '../models/Employee.model.js';
import Company from '../models/Company.model.js';
import AuditLog from '../models/AuditLog.model.js';
import mongoose from 'mongoose';

// @desc    Create or Update review (Upsert Logic)
// @route   POST /api/reviews
// @access  Private (Company only)
export const createReview = async (req, res) => {
  try {
    const { employeeId, ratings, employmentDetails, comment, wouldRehire, tags } = req.body;
    const companyId = req.user.profileId;

    // 1. Data structuring with Number conversion
    const ratingsData = {
      workQuality: Number(ratings.workQuality) || 1,
      punctuality: Number(ratings.punctuality) || 1,
      behavior: Number(ratings.behavior) || 1,
      teamwork: Number(ratings.teamwork) || 1,
      communication: Number(ratings.communication) || 1,
      technicalSkills: Number(ratings.technicalSkills) || 1,
      problemSolving: Number(ratings.problemSolving) || 1,
      reliability: Number(ratings.reliability) || 1
    };

    const ratingsArray = Object.values(ratingsData);
    const averageRating = ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length;

    // 2. CHECK: Kya is company ne is employee ko pehle review diya hai?
    // Hum sirf isActive: true wale review ko check karenge
    let review = await Review.findOne({ 
      companyId: companyId, 
      employeeId: employeeId,
      isActive: true 
    });

    if (review) {
      // FIX: Naya banane ki bajaye purane ko update karo
      review.ratings = ratingsData;
      review.averageRating = averageRating;
      review.comment = comment;
      review.wouldRehire = Boolean(wouldRehire);
      review.tags = tags || [];
      review.employmentDetails = {
        designation: employmentDetails.designation,
        startDate: new Date(employmentDetails.startDate),
        endDate: new Date(employmentDetails.endDate),
        employmentType: employmentDetails.employmentType
      };
      
      // Edit history maintain karein
      review.editHistory.push({
        editedAt: Date.now(),
        editedBy: req.user._id,
        changes: { ratings: ratingsData, comment }
      });

      await review.save();
    } else {
      // Agar pehle se koi review nahi hai, toh naya create karein
      review = await Review.create({
        companyId: companyId,
        employeeId,
        ratings: ratingsData,
        averageRating,
        employmentDetails: {
          designation: employmentDetails.designation,
          startDate: new Date(employmentDetails.startDate),
          endDate: new Date(employmentDetails.endDate),
          employmentType: employmentDetails.employmentType
        },
        comment,
        wouldRehire: Boolean(wouldRehire),
        tags: tags || [],
        createdBy: req.user._id
      });
    }

    // 3. Score Update logic in Employee Model
    const employee = await Employee.findById(employeeId);
    if (employee && typeof employee.updateScore === 'function') {
      await employee.updateScore();
    }

    // 4. Create audit log
    await AuditLog.createLog({
      userId: req.user._id,
      userEmail: req.user.email,
      userRole: 'company',
      eventType: review.isNew ? 'review_created' : 'review_updated',
      eventData: { employeeId, reviewId: review._id },
      ipAddress: req.ip,
      status: 'success'
    });

    return res.status(review.isNew ? 201 : 200).json({ 
      success: true, 
      message: review.isNew ? 'Review submitted' : 'Review updated', 
      data: review 
    });

  } catch (error) {
    console.error("Review Controller Error:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews for an employee (Public/Dashboard)
export const getEmployeeReviews = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const reviews = await Review.find({ employeeId, isActive: true })
      .populate('companyId', 'companyName industry logo verified')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching reviews' });
  }
};

// @desc    Get company's reviews (History)
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

// @desc    Get review statistics using Aggregation Pipeline
export const getReviewStats = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const stats = await Review.aggregate([
      {
        $match: {
          employeeId: new mongoose.Types.ObjectId(employeeId),
          isActive: true
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