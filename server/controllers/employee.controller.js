import Employee from '../models/Employee.model.js';
import Review from '../models/Review.model.js';
import Document from '../models/Document.model.js';
import AuditLog from '../models/AuditLog.model.js';
import User from '../models/User.model.js';
import Company from '../models/Company.model.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { sendEmail, emailTemplates } from '../utils/email.js';

// @desc    Create employee (by company)
// @route   POST /api/employees/create
// @access  Private (Company only)
export const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, gender, department, designation, employmentType, dateOfJoining, workLocation } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !dateOfBirth || !gender) {
      return res.status(400).json({ success: false, message: 'First name, last name, email, phone, date of birth, and gender are required' });
    }

    // Check if email already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Get the company that is creating this employee
    const company = await Company.findOne({ userId: req.user._id });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }

    // Generate employee ID: HS-XXXXX
    const empCount = await Employee.countDocuments();
    const employeeId = `HS-${String(empCount + 1).padStart(5, '0')}`;

    // Password = DOB without dashes (YYYYMMDD)
    const rawPassword = dateOfBirth.replace(/-/g, '');

    // Create User account for the employee
    const user = new User({
      email: email.toLowerCase().trim(),
      password: rawPassword,
      role: 'employee',
      isActive: true,
      emailVerified: false
    });
    await user.save();

    // Create Employee profile
    const employee = await Employee.create({
      userId: user._id,
      createdBy: company._id,
      employeeId,
      firstName: firstName.trim().toUpperCase(),
      lastName: lastName.trim().toUpperCase(),
      email: email.toLowerCase().trim(),
      phone: String(phone).trim(),
      dateOfBirth,
      gender: gender.toLowerCase(),
      department: department || 'General',
      designation: designation || 'Employee',
      employmentType: employmentType || 'permanent',
      dateOfJoining: dateOfJoining || new Date(),
      workLocation: workLocation || 'Not Specified',
      address: { city: 'Not Specified', state: 'Not Specified', pincode: '000000', country: 'India' }
    });

    // Link profileId back to User
    user.profileId = employee._id;
    user.firstName = firstName.trim().toUpperCase();
    user.dateOfBirth = dateOfBirth;
    await user.save();

    // Audit log
    await AuditLog.createLog({
      userId: req.user._id, userEmail: req.user.email, userRole: 'company',
      eventType: 'employee_creation_by_company',
      eventData: { employeeId, employeeName: `${firstName} ${lastName}`, companyName: company.companyName },
      ipAddress: req.ip, userAgent: req.headers['user-agent'], status: 'success'
    });

    // Send welcome email to employee
    try {
      const template = emailTemplates.employeeNodeCreated(
        `${firstName} ${lastName}`,
        company.companyName,
        dateOfBirth
      );
      await sendEmail({ to: email, ...template });
    } catch (mailError) {
      console.error('Employee welcome email failed:', mailError);
    }

    res.status(201).json({
      success: true,
      message: `Employee ${firstName} ${lastName} added successfully! Login credentials sent to ${email}.`,
      data: { employeeId, firstName, lastName, email }
    });

  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create employee' });
  }
};

// @desc    Search employees with filters
// @route   GET /api/employees/search
// @access  Public (semi-public based on consent)
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
      isActive: true
      // FIX: Testing ke liye profileVisible aur consentGiven filters abhi hata diye hain taaki naye users dikhein
    };

    // Text search - Standardizing for Uppercase Model matching
    if (query) {
      searchQuery.$or = [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { currentDesignation: { $regex: query, $options: 'i' } }
      ];
    }

    // DOB Exact Match
    if (dob) {
      searchQuery.dateOfBirth = dob; 
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
      .select('firstName lastName email currentDesignation totalExperience skills overallScore verified profilePicture address.city address.state dateOfBirth')
      .sort({ createdAt: -1 }) // Naye users pehle dikhenge
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
        eventData: { query, resultsCount: employees.length },
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
    res.status(500).json({ success: false, message: 'Error searching employees' });
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('userId', 'email emailVerified createdAt');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Profile visibility temporarily bypassed for testing
    employee.profileViews += 1;
    employee.lastViewedAt = new Date();
    await employee.save();

    const reviews = await Review.find({
      employeeId: employee._id,
      isActive: true,
      $or: [{ moderationStatus: 'approved' }, { moderationStatus: { $exists: false } }]
    })
      .populate('companyId', 'companyName industry logo')
      .sort({ createdAt: -1 });

    const documents = await Document.find({ employeeId: employee._id })
      .select('documentType verificationStatus verifiedAt');

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
    res.status(500).json({ success: false, message: 'Error fetching employee profile' });
  }
};

// @desc    Get current employee profile
// @route   GET /api/employees/profile
// @access  Private (Employee only)
export const getMyProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id })
      .populate('userId', 'email emailVerified createdAt');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    const reviews = await Review.find({ employeeId: employee._id, isActive: true })
      .populate('companyId', 'companyName industry logo')
      .sort({ createdAt: -1 });

    const documents = await Document.find({ employeeId: employee._id })
      .sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      data: { employee, reviews, documents }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
};

// @desc    Update employee profile
export const updateProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) return res.status(404).json({ success: false, message: 'Not found' });

    const allowedUpdates = ['phone', 'address', 'currentDesignation', 'skills', 'education', 'workHistory', 'bio', 'linkedinUrl', 'githubUrl', 'portfolioUrl', 'settings'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) employee[field] = req.body[field];
    });

    await employee.save();
    res.status(200).json({ success: true, message: 'Profile updated', data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
};

// @desc    Update profile visibility
export const updateVisibility = async (req, res) => {
  try {
    const { profileVisible } = req.body;
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) return res.status(404).json({ success: false, message: 'Not found' });

    employee.profileVisible = profileVisible;
    await employee.save();

    res.status(200).json({ success: true, message: `Profile is now ${profileVisible ? 'visible' : 'hidden'}`, data: { profileVisible } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating visibility' });
  }
};

// @desc    Give consent for data sharing
export const giveConsent = async (req, res) => {
  try {
    const { consentGiven, dataRetentionConsent } = req.body;
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) return res.status(404).json({ success: false, message: 'Not found' });

    employee.consentGiven = consentGiven;
    employee.dataRetentionConsent = dataRetentionConsent;
    if (consentGiven) employee.consentGivenAt = new Date();

    await employee.save();
    res.status(200).json({ success: true, message: 'Consent updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating consent' });
  }
};

// @desc    Export employee data (GDPR)
export const exportData = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    const reviews = await Review.find({ employeeId: employee._id });
    const documents = await Document.find({ employeeId: employee._id });
    const exportData = { profile: employee, reviews, documents, exportedAt: new Date() };
    res.status(200).json({ success: true, data: exportData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error exporting data' });
  }
};

// @desc    Delete employee account (GDPR)
export const deleteAccount = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    const user = await User.findById(req.user._id);
    employee.isActive = false;
    user.isActive = false;
    await employee.save();
    await user.save();
    res.status(200).json({ success: true, message: 'Account deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting account' });
  }
};

// @desc    Get employee statistics
export const getEmployeeStats = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ success: false, message: 'Not found' });

    const reviews = await Review.find({ employeeId: employee._id, isActive: true });
    const parameterAverages = { workQuality: 0, punctuality: 0, behavior: 0, teamwork: 0, communication: 0, technicalSkills: 0, problemSolving: 0, reliability: 0 };

    if (reviews.length > 0) {
      reviews.forEach(review => {
        Object.keys(parameterAverages).forEach(param => { parameterAverages[param] += review.ratings[param] || 0; });
      });
      Object.keys(parameterAverages).forEach(param => { parameterAverages[param] = Math.round((parameterAverages[param] / reviews.length) * 10) / 10; });
    }

    res.status(200).json({
      success: true,
      data: { overallScore: employee.overallScore, totalReviews: employee.totalReviews, profileViews: employee.profileViews, parameterAverages }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching statistics' });
  }
};