import User from '../models/User.model.js';
import Company from '../models/Company.model.js';
import Employee from '../models/Employee.model.js';
import AuditLog from '../models/AuditLog.model.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail, emailTemplates } from '../utils/email.js';
import { camelCaseName } from '../utils/helpers.js';
import { safeError } from '../middleware/security.middleware.js';

// --- UTILITIES ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const getDeviceInfo = (req) => {
  const userAgent = req.headers['user-agent'] || '';
  return {
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: userAgent,
    browser: userAgent.split(' ').pop(),
    device: /mobile/i.test(userAgent) ? 'mobile' : 'desktop'
  };
};

// --- CONTROLLERS ---

// @desc    Register company
export const registerCompany = async (req, res) => {
  try {
    let { companyName, email, password, industry, companySize, address, contactPerson, website, gstin, cin } = req.body;
    // Standardize companyName and contactPerson.name to CamelCase
    companyName = camelCaseName(companyName);
    if (contactPerson && contactPerson.name) {
      contactPerson.name = camelCaseName(contactPerson.name);
    }

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // 2. Create User
    const user = new User({
      email,
      password,
      role: 'company',
      isActive: true,
      emailVerified: true
    });
    await user.save();

    // 3. Create Company with ALL fields including address
    const company = new Company({
      userId: user._id,
      companyName,
      email,
      website,
      industry,
      companySize,
      address, // FIX: Frontend se aane wala address object ab save hoga
      contactPerson,
      gstin,
      cin
    });
    await company.save();

    // 4. Link profileId back to User
    user.profileId = company._id;
    await user.save();

    // Send Welcome Email to Company
    try {
      await sendEmail(emailTemplates.welcome(companyName, 'Company') ? {
        to: email,
        ...emailTemplates.welcome(companyName, 'Company')
      } : {});
    } catch (mailError) {
      console.error('Welcome email failed:', mailError);
    }

    res.status(201).json({ success: true, message: 'Company registered successfully!' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: safeError(error, 'Registration failed') });
  }
};

// @desc    Register employee
export const registerEmployee = async (req, res) => {
  try {
    let { firstName, lastName, email, password, phone, dateOfBirth, gender, city, state, pincode } = req.body;
    // Standardize firstName and lastName to CamelCase
    firstName = camelCaseName(firstName);
    lastName = camelCaseName(lastName);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ email, password, role: 'employee' });

    // auth.controller.js ke registerEmployee function mein (Line 90-95 ke paas)
    const employee = await Employee.create({
      userId: user._id,
      firstName: firstName,
      lastName: lastName,
      email,
      phone,
      dateOfBirth, // Ye String format (YYYY-MM-DD) mein hi jayega jo sahi hai
      gender: gender.toLowerCase(),
      address: { city, state, pincode, country: 'India' }
    });

    user.profileId = employee._id;
    await user.save();

    // No email verification for employees
    await AuditLog.createLog({
      userId: user._id, userEmail: email, userRole: 'employee',
      eventType: 'user_registration', ...getDeviceInfo(req), status: 'success'
    });

    res.status(201).json({ success: true, message: 'Employee registered.' });
  } catch (error) {
    res.status(500).json({ success: false, message: safeError(error, 'Registration failed') });
  }
};

// @desc    Login user (Email + Password for both roles)
export const login = async (req, res) => {
  try {
    const { role, password, email } = req.body;

    if (!role || !password || !email) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    let user;
    let profileData;

    // Unified authentication: email + password for both roles
    user = await User.findOne({ email, role }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Get profile data based on role
    if (role === 'company') {
      profileData = await Company.findOne({ userId: user._id });
    } else if (role === 'employee') {
      profileData = await Employee.findOne({ userId: user._id });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incLoginAttempts();
      // Audit log failed login attempt
      try {
        await AuditLog.createLog({
          userId: user._id, userEmail: user.email, userRole: user.role,
          eventType: 'login_failed', ...getDeviceInfo(req), status: 'failure',
          details: `Failed login attempt #${(user.loginAttempts || 0) + 1}`
        });
      } catch (e) { /* silent */ }
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if account is locked after failed attempts
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
      });
    }

    await user.updateOne({ $set: { loginAttempts: 0, lastLogin: Date.now() }, $unset: { lockUntil: 1 } });
    const token = generateToken(user._id);

    if (!profileData) {
      profileData = role === 'company'
        ? await Company.findOne({ userId: user._id })
        : await Employee.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true, token,
      user: { id: user._id, email: user.email, role: user.role, profile: profileData }
    });

    // Audit log successful login
    try {
      await AuditLog.createLog({
        userId: user._id, userEmail: user.email, userRole: user.role,
        eventType: 'user_login', ...getDeviceInfo(req), status: 'success'
      });
    } catch (e) { /* silent */ }

  } catch (error) {
    res.status(500).json({ success: false, message: safeError(error, 'Login failed') });
  }
};

// @desc    Get current user
export const getMe = async (req, res) => {
  try {
    const user = req.user;
    let profileData = user.role === 'company'
      ? await Company.findOne({ userId: user._id })
      : await Employee.findOne({ userId: user._id });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        profile: profileData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: safeError(error, 'Error fetching user') });
  }
};

// @desc    Logout
export const logout = async (req, res) => {
  await AuditLog.createLog({ userId: req.user._id, userEmail: req.user.email, userRole: req.user.role, eventType: 'user_logout', ...getDeviceInfo(req), status: 'success' });
  res.status(200).json({ success: true, message: 'Logged out' });
};

// @desc    Verify email
export const verifyEmail = async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ emailVerificationToken: hashedToken, emailVerificationExpires: { $gt: Date.now() }, role: 'company' });
  if (!user) return res.status(400).json({ success: false, message: 'Invalid token or not a company account' });

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
  res.status(200).json({ success: true, message: 'Email verified' });
};

// @desc    Resend verification email (authenticated or by email in body)
export const resendVerificationEmail = async (req, res) => {
  try {
    const email = req.body?.email || req.user?.email;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    // Only allow for companies
    const user = await User.findOne({ email, role: 'company' });
    if (!user) return res.status(404).json({ success: false, message: 'Company user not found' });
    if (user.emailVerified) return res.status(400).json({ success: false, message: 'Email already verified' });

    const token = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${token}`;
    const template = emailTemplates.verifyEmail(user.email, verifyUrl);
    await sendEmail({ to: user.email, subject: template.subject, html: template.html });
    res.status(200).json({ success: true, message: 'Verification email sent' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ success: false, message: safeError(error, 'Failed to send verification email') });
  }
};

// @desc    Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email, role: 'company' });

    // Security: Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({ success: true, message: 'If an account exists, an email has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const template = emailTemplates.resetPassword(user.email, resetUrl);

    await sendEmail({ to: user.email, subject: template.subject, html: template.html });

    // Audit log
    await AuditLog.createLog({
      userId: user._id, userEmail: user.email, userRole: user.role,
      eventType: 'password_reset_request', ...getDeviceInfo(req), status: 'success'
    });

    res.status(200).json({ success: true, message: 'If an account exists, an email has been sent.' });
  } catch (error) {
    res.status(500).json({ success: false, message: safeError(error, 'Error processing request') });
  }
};

// @desc    Reset Password
export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Audit log
    await AuditLog.createLog({
      userId: user._id, userEmail: user.email, userRole: user.role,
      eventType: 'password_reset_success', ...getDeviceInfo(req), status: 'success'
    });

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: safeError(error, 'Error resetting password') });
  }
};

// @desc    Change Password
export const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });

    user.password = req.body.newPassword;
    await user.save();

    // Audit log
    await AuditLog.createLog({
      userId: user._id, userEmail: user.email, userRole: user.role,
      eventType: 'password_change', ...getDeviceInfo(req), status: 'success'
    });

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: safeError(error, 'Error changing password') });
  }
};

// @desc    Enable 2FA
export const enable2FA = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await User.findById(req.user._id);

    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    // In a real implementation, you would integrate with an SMS service
    // For now, we'll just set a mock secret
    user.twoFactorEnabled = true;
    user.phoneNumber = phoneNumber;
    user.twoFactorSecret = 'mock-2fa-secret-' + Date.now();
    await user.save();

    await AuditLog.createLog({
      userId: user._id,
      userEmail: user.email,
      userRole: user.role,
      eventType: 'two_factor_enabled',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.status(200).json({
      success: true,
      message: '2FA enabled successfully',
      data: { phoneNumber: user.phoneNumber }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: safeError(error, 'Error enabling 2FA') });
  }
};

// @desc    Verify 2FA
export const verify2FA = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ success: false, message: '2FA not enabled' });
    }

    // In a real implementation, verify the TOTP code
    // For now, accept any 6-digit code
    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ success: false, message: 'Invalid 2FA code' });
    }

    res.status(200).json({ success: true, message: '2FA verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: safeError(error, 'Error verifying 2FA') });
  }
};

// @desc    Disable 2FA
export const disable2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    user.phoneNumber = undefined;
    await user.save();

    await AuditLog.createLog({
      userId: user._id,
      userEmail: user.email,
      userRole: user.role,
      eventType: 'two_factor_disabled',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success'
    });

    res.status(200).json({ success: true, message: '2FA disabled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: safeError(error, 'Error disabling 2FA') });
  }
};