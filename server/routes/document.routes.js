import express from 'express';
import {
  uploadDocument,
  getEmployeeDocuments,
  verifyDocument,
  deleteDocument
} from '../controllers/document.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { upload, handleMulterError } from '../middleware/upload.middleware.js';
import { validateDocumentUpload } from '../middleware/validation.middleware.js';

const router = express.Router();

/**
 * --- PROTECTED ROUTES ---
 * Note: Sabhi document routes protected hain security reasons se.
 */

// 1. Upload Document (Employee Only)
// Sequence: Auth -> Role Check -> Rate Limit -> File Upload -> Data Validation -> Error Handler -> Controller
router.post(
  '/upload',
  protect,
  authorize('employee'),
  uploadLimiter,
  upload.single('document'),
  validateDocumentUpload,
  handleMulterError, // Catching file size/type errors specifically
  uploadDocument
);

// 2. Get Employee Documents (Employee owner or Company)
router.get(
  '/employee/:employeeId',
  protect,
  getEmployeeDocuments
);

// 3. Verify/Reject Document (Company/Admin Only)
router.put(
  '/:id/verify',
  protect,
  authorize('company', 'admin'),
  verifyDocument
);

// 4. Delete Document (Employee Owner Only)
router.delete(
  '/:id',
  protect,
  authorize('employee'),
  deleteDocument
);

export default router;