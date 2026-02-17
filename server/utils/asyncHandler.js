/**
 * Async Handler Wrapper
 * Eliminates need for try-catch blocks in every controller
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
