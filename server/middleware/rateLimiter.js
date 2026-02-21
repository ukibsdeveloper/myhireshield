import rateLimit from 'express-rate-limit';

/**
 * RATE LIMITER CONFIGURATIONS
 * Security layer to prevent Brute-force, DoS attacks, and API abuse.
 */

// 1. General API rate limiter (Standard across all routes)
export const apiLimiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000, // Default: 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Default: 100 requests
  message: {
    success: false,
    message: 'Too many requests. Please wait a moment and try again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. Strict rate limiter for Authentication (Failed attempts only)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 failed attempts
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many failed attempts. Please try again after 15 minutes.'
  }
});

// 3. Rate limiter for Registration
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 registrations per hour per IP
  message: {
    success: false,
    message: 'Registration attempt limit exceeded. Please try again after 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 4. Rate limiter for Login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 login attempts (Balanced for dev/prod)
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 5. Document upload rate limiter (Prevents server storage spam)
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    success: false,
    message: 'File upload limit exceeded. Please try again later.'
  }
});

// 6. Review submission rate limiter (Prevents fake review spam)
export const reviewLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 50, // 50 reviews per day per entity
  message: {
    success: false,
    message: 'You have reached the daily review submission limit.'
  }
});

// 7. Search rate limiter (Protects Database from heavy queries)
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  message: {
    success: false,
    message: 'You are searching too fast. Please slow down a bit.'
  }
});

// 8. Email sending rate limiter (Protects SMTP service/Costs)
export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // 15 emails per hour per IP
  message: {
    success: false,
    message: 'Email request limit exceeded. Please try again later.'
  }
});