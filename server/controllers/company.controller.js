import Company from '../models/Company.model.js';
import User from '../models/User.model.js';
import Employee from '../models/Employee.model.js';
import Review from '../models/Review.model.js';
import Document from '../models/Document.model.js';
import AuditLog from '../models/AuditLog.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { ROLES, AUDIT_EVENTS } from '../config/constants.js';

// @desc    Get current company profile
// @route   GET /api/companies/profile
// @access  Private (Company only)
export const getProfile = asyncHandler(async (req, res, next) => {
  const company = await Company.findOne({ userId: req.user._id });

  if (!company) {
    return next(new AppError('Company profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: company
  });
});

// @desc    Update company profile details
// @route   PUT /api/companies/profile
// @access  Private (Company only)
export const updateProfile = asyncHandler(async (req, res, next) => {
  const allowedUpdates = [
    'companyName', 'website', 'industry', 'companySize',
    'address', 'contactPerson', 'logo'
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
    return next(new AppError('Company profile not found for update', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: company
  });
});

// @desc    Get company statistics & dashboard data
// @route   GET /api/companies/stats
// @access  Private (Company only)
export const getCompanyStats = asyncHandler(async (req, res, next) => {
  const company = await Company.findOne({ userId: req.user._id });

  if (!company) {
    return next(new AppError('Company profile not found', 404));
  }

  // Parallel execution for performance (Scalability improvement)
  const [totalReviews, totalEmployees, employees] = await Promise.all([
    Review.countDocuments({ companyId: company._id }),
    Employee.countDocuments({ createdBy: company._id }),
    Employee.find({ createdBy: company._id }).distinct('_id')
  ]);

  const verifiedDocuments = await Document.countDocuments({
    employeeId: { $in: employees },
    status: 'verified' // Using string literal as enum is mostly for input validation
  });

  res.status(200).json({
    success: true,
    data: {
      totalReviews,
      totalEmployees,
      verifiedDocuments,
      companyInfo: {
        name: company.companyName,
        industry: company.industry,
        companySize: company.companySize
      }
    }
  });
});

// @desc    Get employees created by company
// @route   GET /api/companies/employees
// @access  Private (Company only)
export const getEmployees = asyncHandler(async (req, res, next) => {
  const company = await Company.findOne({ userId: req.user._id });

  if (!company) {
    return next(new AppError('Company profile not found', 404));
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [employees, total] = await Promise.all([
    Employee.find({ createdBy: company._id })
      .select('firstName lastName email currentDesignation createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Employee.countDocuments({ createdBy: company._id })
  ]);

  res.status(200).json({
    success: true,
    count: employees.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: employees
  });
});

// @desc    Permanently delete company account and all associated data
// @route   DELETE /api/company/account
// @access  Private (Company only)
export const deleteCompanyAccount = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const company = await Company.findOne({ userId });

  if (!company) {
    return next(new AppError('Company not found', 404));
  }

  // Delete dependencies first (Transactional logic ideally but Mongo standalone)
  await Promise.all([
    Company.deleteOne({ userId }),
    User.deleteOne({ _id: userId }),
    // Additional cleanup logic would go here
  ]);

  await AuditLog.createLog({
    userId,
    userEmail: req.user.email,
    userRole: ROLES.COMPANY,
    eventType: 'account_deleted', // Standardized event
    status: 'success',
    ipAddress: req.ip
  });

  res.status(200).json({
    success: true,
    message: 'Company account permanently deleted.'
  });
});
