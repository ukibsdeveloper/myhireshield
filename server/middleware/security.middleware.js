import crypto from 'crypto';

/**
 * SECURITY MIDDLEWARE LAYER
 * Comprehensive protection for MyHireShield verification platform
 */

// ─── 1. REQUEST ID ────────────────────────────────────
// Adds a unique request ID to every request for tracing/debugging
export const requestId = (req, res, next) => {
    const id = crypto.randomUUID();
    req.requestId = id;
    res.setHeader('X-Request-Id', id);
    next();
};

// ─── 2. XSS SANITIZER ────────────────────────────────
// Strips dangerous HTML/script tags from req.body, req.query, req.params
const stripXSS = (value) => {
    if (typeof value === 'string') {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
            // Remove script tags and event handlers
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
            .replace(/on\w+\s*=\s*'[^']*'/gi, '')
            .replace(/javascript\s*:/gi, '');
    }
    return value;
};

const sanitizeObject = (obj) => {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string') return stripXSS(obj);
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sanitizeObject);

    const sanitized = {};
    for (const key of Object.keys(obj)) {
        // Don't sanitize password fields (they get hashed anyway)
        if (key === 'password' || key === 'newPassword' || key === 'currentPassword') {
            sanitized[key] = obj[key];
        } else {
            sanitized[key] = sanitizeObject(obj[key]);
        }
    }
    return sanitized;
};

export const xssSanitizer = (req, res, next) => {
    if (req.body) req.body = sanitizeObject(req.body);
    if (req.query) req.query = sanitizeObject(req.query);
    if (req.params) req.params = sanitizeObject(req.params);
    next();
};

// ─── 3. SECURITY HEADERS (Additional beyond Helmet) ──────
export const securityHeaders = (req, res, next) => {
    // Prevent the browser from caching sensitive responses
    if (req.path.startsWith('/api/')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
    }

    // Prevent MIME sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // Referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions policy (restrict browser features)
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

    next();
};

// ─── 4. PAYLOAD SIZE VALIDATOR ───────────────────────
// Double-checks payload size beyond Express limits
export const payloadValidator = (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const MAX_PAYLOAD = 10 * 1024 * 1024; // 10MB

    if (contentLength > MAX_PAYLOAD) {
        return res.status(413).json({
            success: false,
            message: 'Request payload too large. Maximum allowed: 10MB'
        });
    }
    next();
};

// ─── 5. SUSPICIOUS REQUEST DETECTOR ──────────────────
// Detect and block common attack patterns
export const suspiciousRequestDetector = (req, res, next) => {
    const suspiciousPatterns = [
        /\.\.\//,                    // Path traversal
        /;.*--/,                     // SQL injection comment patterns
        /<script/i,                  // XSS script tags
        /\$gt|\$lt|\$ne|\$regex/,    // MongoDB operator injection in URL
        /eval\s*\(/i,                // Code injection
        /union\s+select/i,           // SQL UNION injection
        /drop\s+table/i,             // SQL DROP
    ];

    const fullUrl = req.originalUrl || req.url;

    for (const pattern of suspiciousPatterns) {
        if (pattern.test(fullUrl)) {
            console.warn(`🚨 SECURITY: Suspicious request blocked from IP ${req.ip}: ${fullUrl}`);
            return res.status(400).json({
                success: false,
                message: 'Request blocked: Suspicious pattern detected'
            });
        }
    }

    next();
};

// ─── 6. IP TRACKING MIDDLEWARE ───────────────────────
// Logs IP addresses for audit trail
export const ipTracker = (req, res, next) => {
    req.clientIP = req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.connection?.remoteAddress;
    next();
};

// ─── 7. PASSWORD STRENGTH VALIDATOR ──────────────────
// Called in validation middleware for registration/password change
export const validatePasswordStrength = (password) => {
    const errors = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// ─── 8. SECURE FILE PATH VALIDATOR ──────────────────
// Prevents path traversal in file downloads
export const sanitizeFilePath = (filePath) => {
    if (!filePath) return null;
    // Remove path traversal attempts
    const sanitized = filePath
        .replace(/\.\./g, '')
        .replace(/\\/g, '/')
        .replace(/\/+/g, '/')
        .replace(/^\//, '');

    // Only allow alphanumeric, dash, underscore, dot
    if (!/^[\w\-./]+$/.test(sanitized)) {
        return null;
    }

    return sanitized;
};

// ─── 9. SAFE ERROR RESPONSE ──────────────────────────
// Prevents leaking internal error details in production
export const safeError = (error, defaultMsg = 'An error occurred') => {
    // Always log the real error for debugging
    console.error('⚠️ Error Details:', {
      message: error.message,
      name: error.name,
      stack: error.stack ? error.stack.split('\n').slice(0, 3) : null
    });
    
    if (process.env.NODE_ENV === 'production') {
        return defaultMsg;
    }
    return error.message || defaultMsg;
};
