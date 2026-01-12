import User from '../models/User.model.js';
import Company from '../models/Company.model.js';
import Employee from '../models/Employee.model.js';
import AuditLog from '../models/AuditLog.model.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/email.js';

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
    const { companyName, email, password, industry, companySize, address, contactPerson, website, gstin, cin } = req.body;

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

    res.status(201).json({ success: true, message: 'Company registered successfully!' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register employee
export const registerEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, dateOfBirth, gender, city, state, pincode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ email, password, role: 'employee' });

    const employee = await Employee.create({
      userId: user._id,
      firstName, lastName, email, phone, dateOfBirth,
      gender: gender.toLowerCase(),
      address: { city, state, pincode, country: 'India' }
    });

    user.profileId = employee._id;
    await user.save();

    const token = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await AuditLog.createLog({
      userId: user._id, userEmail: email, userRole: 'employee',
      eventType: 'user_registration', ...getDeviceInfo(req), status: 'success'
    });

    res.status(201).json({ success: true, message: 'Employee registered. Check email.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error registering employee' });
  }
};

// @desc    Login user (Company: Email | Employee: Name+DOB)
export const login = async (req, res) => {
  try {
    const { role, password, email, firstName, dateOfBirth } = req.body;

    if (!role || !password) {
      return res.status(400).json({ success: false, message: 'Missing credentials' });
    }

    let user;
    let profileData;

    if (role === 'company') {
      if (!email) return res.status(400).json({ success: false, message: 'Email required' });
      user = await User.findOne({ email, role }).select('+password');
    } 
    else if (role === 'employee') {
      if (!firstName || !dateOfBirth) return res.status(400).json({ success: false, message: 'Name and DOB required' });
      
      profileData = await Employee.findOne({ 
        firstName: { $regex: new RegExp(`^${firstName}$`, 'i') }, 
        dateOfBirth 
      });

      if (profileData) {
        user = await User.findOne({ _id: profileData.userId, role }).select('+password');
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incLoginAttempts();
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
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

  } catch (error) {
    res.status(500).json({ success: false, message: 'Login error' });
  }
};

// @desc    Get current user
export const getMe = async (req, res) => {
  try {
    const user = req.user;
    let profileData = user.role === 'company' 
      ? await Company.findOne({ userId: user._id })
      : await Employee.findOne({ userId: user._id });

    res.status(200).json({ success: true, user: { id: user._id, email: user.email, role: user.role, profile: profileData } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user' });
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
  const user = await User.findOne({ emailVerificationToken: hashedToken, emailVerificationExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ success: false, message: 'Invalid token' });

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
  res.status(200).json({ success: true, message: 'Email verified' });
};

// @desc    Forgot Password
export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await sendEmail({ to: user.email, subject: 'Password Reset', template: 'passwordReset', data: { name: user.email, resetUrl } });
  res.status(200).json({ success: true, message: 'Email sent' });
};

// @desc    Reset Password
export const resetPassword = async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ success: false, message: 'Invalid token' });

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.status(200).json({ success: true, message: 'Password reset successful' });
};

// @desc    Change Password
export const changePassword = async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(req.body.currentPassword);
  if (!isMatch) return res.status(401).json({ success: false, message: 'Old password wrong' });

  user.password = req.body.newPassword;
  await user.save();
  res.status(200).json({ success: true, message: 'Password changed' });
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
    res.status(500).json({ success: false, message: 'Error enabling 2FA' });
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
    res.status(500).json({ success: false, message: 'Error verifying 2FA' });
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
    res.status(500).json({ success: false, message: 'Error disabling 2FA' });
  }
};