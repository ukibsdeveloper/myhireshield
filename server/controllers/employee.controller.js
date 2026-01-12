import Employee from '../models/Employee.model.js';
import Review from '../models/Review.model.js';
import Document from '../models/Document.model.js';
import AuditLog from '../models/AuditLog.model.js';
import User from '../models/User.model.js';
import mongoose from 'mongoose';

// @desc    Search employees with filters
// @route   GET /api/employees/search
// @access  Public (semi-public based on consent)
export const searchEmployees = async (req, res) => {
  try {
    const {
      query,
      dob,
      scoreRange,
      experience,
      skills,
      location,
      education,
      verifiedOnly,
      page = 1,
      limit = 20
    } = req.query;

    // Build search query
    let searchQuery = {
      profileVisible: true,
      consentGiven: true,
      isActive: true
    };

    // Text search
    if (query) {
      searchQuery.$or = [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { currentDesignation: { $regex: query, $options: 'i' } }
      ];
    }

    // Score range filter
    if (scoreRange) {
      if (scoreRange === 'excellent') {
        searchQuery.overallScore = { $gte: 70 };
      } else if (scoreRange === 'average') {
        searchQuery.overallScore = { $gte: 30, $lt: 70 };
      } else if (scoreRange === 'poor') {
        searchQuery.overallScore = { $lt: 30 };
      }
    }

    // Experience filter
    if (experience) {
      const expRange = experience.split('-');
      if (expRange.length === 2) {
        searchQuery.totalExperience = {
          $gte: parseInt(expRange[0]),
          $lte: parseInt(expRange[1])
        };
      }
    }

    // Skills filter
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      searchQuery.skills = { $in: skillsArray };
    }

    // Location filter
    if (location) {
      searchQuery.$or = [
        { 'address.city': { $regex: location, $options: 'i' } },
        { 'address.state': { $regex: location, $options: 'i' } }
      ];
    }

    if (dob) {
      searchQuery.dateOfBirth = dob; 
    }

    // Education filter
    if (education) {
      searchQuery['education.degree'] = { $regex: education, $options: 'i' };
    }

    // Verified only filter
    if (verifiedOnly === 'true') {
      searchQuery.verified = true;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute search
    const employees = await Employee.find(searchQuery)
      .select('firstName lastName email currentDesignation totalExperience skills overallScore verified profilePicture address.city address.state')
      .sort({ overallScore: -1, totalReviews: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Employee.countDocuments(searchQuery);

    // Log search
    if (req.user) {
      await AuditLog.createLog({
        userId: req.user._id,
        userEmail: req.user.email,
        userRole: req.user.role,
        eventType: 'employee_searched',
        eventData: {
          query,
          filters: { scoreRange, experience, skills, location, education, verifiedOnly },
          resultsCount: employees.length
        },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
    }

    res.status(200).json({
      success: true,
      count: employees.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: employees
    });

  } catch (error) {
    console.error('Search employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching employees'
    });
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Public (semi-public based on consent)
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('userId', 'email emailVerified createdAt');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check if profile is visible
    if (!employee.profileVisible || !employee.consentGiven) {
      return res.status(403).json({
        success: false,
        message: 'This profile is not publicly visible'
      });
    }

    // Increment profile views
    employee.profileViews += 1;
    employee.lastViewedAt = new Date();
    await employee.save();

    // Get reviews
    const reviews = await Review.find({ employeeId: employee._id })
      .populate('companyId', 'companyName industry logo')
      .sort({ createdAt: -1 });

    // Get documents (only verification status, not actual files)
    const documents = await Document.find({ employeeId: employee._id })
      .select('documentType verificationStatus verifiedAt');

    // Log profile view
    if (req.user) {
      await AuditLog.createLog({
        userId: req.user._id,
        userEmail: req.user.email,
        userRole: req.user.role,
        eventType: 'profile_viewed',
        eventData: {
          employeeId: employee._id,
          employeeName: `${employee.firstName} ${employee.lastName}`
        },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
    }

    res.status(200).json({
      success: true,
      data: {
        employee,
        reviews,
        documents: documents.map(doc => ({
          type: doc.documentType,
          status: doc.verificationStatus,
          verifiedAt: doc.verifiedAt
        }))
      }
    });

  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching employee profile'
    });
  }
};

// @desc    Get current employee profile
// @route   GET /api/employees/profile
// @access  Private (Employee only)
export const getMyProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id })
      .populate('userId', 'email emailVerified createdAt');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found'
      });
    }

    // Get reviews
    const reviews = await Review.find({ employeeId: employee._id })
      .populate('companyId', 'companyName industry logo')
      .sort({ createdAt: -1 });

    // Get documents
    const documents = await Document.find({ employeeId: employee._id })
      .sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        employee,
        reviews,
        documents
      }
    });

  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
};

// @desc    Update employee profile
// @route   PUT /api/employees/profile
// @access  Private (Employee only)
export const updateProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'phone',
      'address',
      'currentDesignation',
      'skills',
      'education',
      'workHistory',
      'bio',
      'linkedinUrl',
      'githubUrl',
      'portfolioUrl',
      'settings'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        employee[field] = req.body[field];
      }
    });

    await employee.save();

    // Create audit log
    await AuditLog.createLog({
      userId: req.user._id,
      userEmail: req.user.email,
      userRole: 'employee',
      eventType: 'profile_updated',
      eventData: {
        updatedFields: Object.keys(req.body)
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: employee
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

// @desc    Update profile visibility
// @route   PUT /api/employees/visibility
// @access  Private (Employee only)
export const updateVisibility = async (req, res) => {
  try {
    const { profileVisible } = req.body;

    const employee = await Employee.findOne({ userId: req.user._id });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found'
      });
    }

    // Check if consent is given
    if (profileVisible && !employee.consentGiven) {
      return res.status(400).json({
        success: false,
        message: 'Please provide consent before making profile visible'
      });
    }

    employee.profileVisible = profileVisible;
    await employee.save();

    // Create audit log
    await AuditLog.createLog({
      userId: req.user._id,
      userEmail: req.user.email,
      userRole: 'employee',
      eventType: 'profile_visibility_changed',
      eventData: {
        profileVisible
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      success: true,
      message: `Profile is now ${profileVisible ? 'visible' : 'hidden'}`,
      data: { profileVisible }
    });

  } catch (error) {
    console.error('Update visibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating visibility'
    });
  }
};

// @desc    Give consent for data sharing
// @route   POST /api/employees/consent
// @access  Private (Employee only)
export const giveConsent = async (req, res) => {
  try {
    const { consentGiven, dataRetentionConsent } = req.body;

    const employee = await Employee.findOne({ userId: req.user._id });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found'
      });
    }

    employee.consentGiven = consentGiven;
    employee.dataRetentionConsent = dataRetentionConsent;
    
    if (consentGiven) {
      employee.consentGivenAt = new Date();
    }

    await employee.save();

    // Create audit log
    await AuditLog.createLog({
      userId: req.user._id,
      userEmail: req.user.email,
      userRole: 'employee',
      eventType: consentGiven ? 'consent_given' : 'consent_withdrawn',
      eventData: {
        consentGiven,
        dataRetentionConsent
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      success: true,
      message: consentGiven ? 'Consent provided successfully' : 'Consent withdrawn',
      data: { consentGiven, dataRetentionConsent }
    });

  } catch (error) {
    console.error('Give consent error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating consent'
    });
  }
};

// @desc    Export employee data (GDPR)
// @route   GET /api/employees/export
// @access  Private (Employee only)
export const exportData = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    const reviews = await Review.find({ employeeId: employee._id });
    const documents = await Document.find({ employeeId: employee._id });
    const auditLogs = await AuditLog.find({ userId: req.user._id }).limit(1000);

    const exportData = {
      profile: employee,
      reviews,
      documents: documents.map(doc => ({
        type: doc.documentType,
        status: doc.verificationStatus,
        uploadedAt: doc.uploadedAt
      })),
      auditLogs,
      exportedAt: new Date()
    };

    // Create audit log
    await AuditLog.createLog({
      userId: req.user._id,
      userEmail: req.user.email,
      userRole: 'employee',
      eventType: 'data_exported',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      success: true,
      data: exportData
    });

  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting data'
    });
  }
};

// @desc    Delete employee account (GDPR)
// @route   DELETE /api/employees/account
// @access  Private (Employee only)
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    // Verify password
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    // Soft delete - mark as inactive
    const employee = await Employee.findOne({ userId: req.user._id });
    employee.isActive = false;
    employee.deletedAt = new Date();
    await employee.save();

    user.isActive = false;
    await user.save();

    // Create audit log
    await AuditLog.createLog({
      userId: req.user._id,
      userEmail: req.user.email,
      userRole: 'employee',
      eventType: 'account_deleted',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account'
    });
  }
};

// @desc    Get employee statistics
// @route   GET /api/employees/:id/stats
// @access  Public
export const getEmployeeStats = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const reviews = await Review.find({ employeeId: employee._id, isActive: true });
    
    // Calculate parameter averages
    const parameterAverages = {
      workQuality: 0,
      punctuality: 0,
      behavior: 0,
      teamwork: 0,
      communication: 0,
      technicalSkills: 0,
      problemSolving: 0,
      reliability: 0
    };

    if (reviews.length > 0) {
      reviews.forEach(review => {
        Object.keys(parameterAverages).forEach(param => {
          parameterAverages[param] += review.ratings[param] || 0;
        });
      });

      Object.keys(parameterAverages).forEach(param => {
        parameterAverages[param] = Math.round((parameterAverages[param] / reviews.length) * 10) / 10;
      });
    }

    // Calculate would rehire percentage
    const wouldRehireCount = reviews.filter(r => r.wouldRehire).length;
    const wouldRehirePercentage = reviews.length > 0 
      ? Math.round((wouldRehireCount / reviews.length) * 100) 
      : 0;

    res.status(200).json({
      success: true,
      data: {
        overallScore: employee.overallScore,
        totalReviews: employee.totalReviews,
        profileViews: employee.profileViews,
        parameterAverages,
        wouldRehirePercentage,
        verificationBadges: employee.verificationBadges
      }
    });

  } catch (error) {
    console.error('Get employee stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
};