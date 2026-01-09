/**
 * Global Error Handler Middleware
 * Sabhi controllers se aane wale errors yahan handle hote hain
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Debugging ke liye console par error print karega
  if (process.env.NODE_ENV === 'development') {
    console.error('--- ERROR DEBUGGER ---');
    console.error(err);
  }

  // 1. Mongoose: Galat ID format (CastError)
  if (err.name === 'CastError') {
    const message = `Resource nahi mila. Galat ID format: ${err.value}`;
    error = { message, statusCode: 404 };
  }

  // 2. Mongoose: Duplicate Data (Email ya phone pehle se hai)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} pehle se database mein maujood hai.`;
    error = { message, statusCode: 400 };
  }

  // 3. Mongoose: Validation Error (Schema requirements fail)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // 4. JWT: Invalid Token
  if (err.name === 'JsonWebTokenError') {
    const message = 'Authentication token sahi nahi hai. Please login karein.';
    error = { message, statusCode: 401 };
  }

  // 5. JWT: Expired Token
  if (err.name === 'TokenExpiredError') {
    const message = 'Aapka session khatam ho gaya hai. Please phir se login karein.';
    error = { message, statusCode: 401 };
  }

  // Final Response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server mein kuch takleef hai (Server Error)',
    // Stack trace sirf development mode mein dikhega security ke liye
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};