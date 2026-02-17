/**
 * Global Error Handler Middleware
 * Production-safe: Never leaks internal details to the client
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log full error in all environments (for server-side debugging)
  console.error(`❌ [${req.requestId || 'NO-ID'}] ${req.method} ${req.originalUrl}`, {
    error: err.message,
    stack: err.stack,
    ip: req.clientIP || req.ip,
    userId: req.user?._id
  });

  // 1. Mongoose: Invalid ID format (CastError)
  if (err.name === 'CastError') {
    error = { message: 'Resource not found. Invalid ID format.', statusCode: 404 };
  }

  // 2. Mongoose: Duplicate Key (Email/Phone already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = { message: `This ${field} is already registered.`, statusCode: 400 };
  }

  // 3. Mongoose: Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // 4. JWT: Invalid Token
  if (err.name === 'JsonWebTokenError') {
    error = { message: 'Authentication failed. Please login again.', statusCode: 401 };
  }

  // 5. JWT: Expired Token
  if (err.name === 'TokenExpiredError') {
    error = { message: 'Session expired. Please login again.', statusCode: 401 };
  }

  // 6. CORS Error
  if (err.message && err.message.includes('CORS')) {
    error = { message: 'Cross-origin request blocked.', statusCode: 403 };
  }

  // 7. Payload Too Large
  if (err.type === 'entity.too.large') {
    error = { message: 'Request payload too large.', statusCode: 413 };
  }

  // 8. Syntax Error (bad JSON)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = { message: 'Invalid JSON in request body.', statusCode: 400 };
  }

  // Final Response — NEVER leak stack trace or internal details in production
  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    message: statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error. Please try again later.'
      : error.message || 'Server error',
    requestId: req.requestId
  };

  // Stack trace ONLY in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.detail = err.message;
  }

  res.status(statusCode).json(response);
};