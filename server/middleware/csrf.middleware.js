import csrfProtection from '../utils/csrf.js';

// CSRF middleware
export const csrfMiddleware = (req, res, next) => {
  // Only apply to state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const sessionId = req.session?.id || req.headers['x-session-id'];
    const csrfToken = req.headers['x-csrf-token'] || req.body._csrf;

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: 'Session required'
      });
    }

    if (!csrfToken) {
      return res.status(403).json({
        success: false,
        message: 'CSRF token required'
      });
    }

    if (!csrfProtection.validateToken(sessionId, csrfToken)) {
      return res.status(403).json({
        success: false,
        message: 'Invalid CSRF token'
      });
    }
  }

  next();
};

// Generate CSRF token endpoint
export const getCSRFToken = (req, res) => {
  const sessionId = req.session?.id || req.headers['x-session-id'];
  
  if (!sessionId) {
    return res.status(401).json({
      success: false,
      message: 'Session required'
    });
  }

  const token = csrfProtection.generateToken(sessionId);

  res.json({
    success: true,
    data: {
      csrfToken: token
    }
  });
};

// Secure cookie middleware
export const secureCookieMiddleware = (req, res, next) => {
  // Set secure cookies
  res.cookie('session', req.session?.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  next();
};
