/**
 * Not Found Middleware
 * Catch-all for undefined routes
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Resource nahi mila - ${req.originalUrl}`);
  res.status(404);
  next(error);
};