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
        message: 'Authentication required. Please log in to continue.'
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
          message: 'User account not found. Please log in again.'
        });
      }

      // 4. Security Checks: Active/Suspended/Locked
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Your account has been deactivated. Please contact support.'
        });
      }

      if (user.isSuspended) {
        return res.status(403).json({
          success: false,
          message: `Your account has been suspended. Reason: ${user.suspensionReason || 'Terms violation'}`
        });
      }

      // Check for account lock (Security feature)
      if (user.lockUntil && user.lockUntil > Date.now()) {
        return res.status(403).json({
          success: false,
          message: 'Account temporarily locked for security. Please try again later.'
        });
      }

      // 5. Attach User to Request Object
      req.user = user;
      next();

    } catch (error) {
      const msg = error.name === 'TokenExpiredError' 
        ? 'Your session has expired. Please log in again.' 
        : 'Invalid token. Please log in again.';
      
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
      message: 'Please verify your email address before accessing this resource.'
    });
  }
  next();
};

export const require2FA = (req, res, next) => {
  if (req.user.twoFactorEnabled && !req.session?.twoFactorVerified) {
    return res.status(403).json({
      success: false,
      message: 'Two-factor authentication verification is required.',
      require2FA: true
    });
  }
  next();
};
