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
    message: 'Bohot zyada requests! Please thodi der baad try karein.'
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
    message: 'Bohot zyada failed attempts! Please 15 minute baad try karein.'
  }
});

// 3. Rate limiter for Registration
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 registrations per hour per IP
  message: {
    success: false,
    message: 'Registration attempts limit exceed ho gayi hai. Please 1 ghante baad try karein.'
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
    message: 'Bohot saare login attempts! Please 15 minute baad koshish karein.'
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
    message: 'File upload limit exceed ho gayi hai. Please thodi der baad try karein.'
  }
});

// 6. Review submission rate limiter (Prevents fake review spam)
export const reviewLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 50, // 50 reviews per day per entity
  message: {
    success: false,
    message: 'Aapne daily review submission ki limit reach kar li hai.'
  }
});

// 7. Search rate limiter (Protects Database from heavy queries)
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  message: {
    success: false,
    message: 'Bohot tez search kar rahe hain! Please thoda slow down karein.'
  }
});

// 8. Email sending rate limiter (Protects SMTP service/Costs)
export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // 15 emails per hour per IP
  message: {
    success: false,
    message: 'Email requests ki limit exceed ho gayi hai. Please thodi der baad try karein.'
  }
});