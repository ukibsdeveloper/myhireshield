import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

/**
 * Protect routes - Verify JWT Token
 * Standard middleware for authenticated routes
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Get token from Header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Aap is route ke liye authorized nahi hain. Please login karein.'
      });
    }

    try {
      // 2. Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get User and Profile Details
      // Hum profileId aur role ko bhi saath mein select kar rahe hain
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User account nahi mila. Please phir se login karein.'
        });
      }

      // 4. Security Checks: Active/Suspended/Locked
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Aapka account deactivate kar diya gaya hai.'
        });
      }

      if (user.isSuspended) {
        return res.status(403).json({
          success: false,
          message: `Account suspend hai. Reason: ${user.suspensionReason || 'Terms violation'}`
        });
      }

      // Check for account lock (Security feature)
      if (user.lockUntil && user.lockUntil > Date.now()) {
        return res.status(403).json({
          success: false,
          message: 'Security ki wajah se account locked hai. Kuch der baad try karein.'
        });
      }

      // 5. Attach User to Request Object
      req.user = user;
      next();

    } catch (error) {
      const msg = error.name === 'TokenExpiredError' 
        ? 'Aapka session khatam ho gaya hai. Please login karein.' 
        : 'Invalid token. Security verification failed.';
      
      return res.status(401).json({ success: false, message: msg });
    }

  } catch (error) {
    console.error('Auth Middleware Critical Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Authentication Error' });
  }
};

/**
 * Role-Based Access Control (RBAC)
 * Example: authorize('admin', 'company')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user?.role || 'Guest'}' is not authorized to access this route.`
      });
    }
    next();
  };
};

/**
 * Optional Authentication
 * Use this for routes like Search where login is not mandatory but helpful
 */
export const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user && user.isActive && !user.isSuspended) {
        req.user = user;
      }
    } catch (err) {
      req.user = null;
    }
  }
  next();
};

/**
 * Strict Verification Guards
 */
export const requireEmailVerification = (req, res, next) => {
  if (!req.user.emailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Resource access karne se pehle email verify karna zaroori hai.'
    });
  }
  next();
};

export const require2FA = (req, res, next) => {
  // Check if 2FA is on but session is not verified
  if (req.user.twoFactorEnabled && !req.session?.twoFactorVerified) {
    return res.status(403).json({
      success: false,
      message: 'Two-factor authentication verified hona zaroori hai.',
      require2FA: true
    });
  }
  next();
};