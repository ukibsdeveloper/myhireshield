import express from 'express';
import fs from 'fs';
import path from 'path';
import Employee from '../models/Employee.model.js';
import {
  companyUploadDocument,
  getEmployeesForUpload,
  getEmployeeDocuments,
  verifyDocument,
  performBackgroundCheck,
  getPendingVerifications,
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

// 1. Company Upload Document (Company Only)
// For comprehensive background verification
router.post(
  '/company-upload',
  protect,
  authorize('company'),
  uploadLimiter,
  upload.single('document'),
  validateDocumentUpload,
  handleMulterError,
  companyUploadDocument
);

// 2. Get Employees for Upload (Company Only)
router.get(
  '/employees',
  protect,
  authorize('company'),
  getEmployeesForUpload
);

// 2. Get Employee Documents (Employee owner or Company)
router.get(
  '/employee/:employeeId',
  protect,
  getEmployeeDocuments
);

// 4. Verify/Reject Document (Company/Admin Only)
router.put(
  '/:id/verify',
  protect,
  authorize('company', 'admin'),
  verifyDocument
);

// 5. Perform Background Check (Company Only)
router.post(
  '/:id/background-check',
  protect,
  authorize('company'),
  performBackgroundCheck
);

// 7. Get All Pending Verifications (Company/Admin Only)
router.get(
  '/pending-verification',
  protect,
  authorize('company', 'admin'),
  getPendingVerifications
);

// 8. Delete Document (Employee Owner Only)
router.delete(
  '/:id',
  protect,
  authorize('employee'),
  deleteDocument
);

// 9. Get My Documents (Employee Only)
router.get(
  '/my',
  protect,
  authorize('employee'),
  async (req, res) => {
    try {
      const employee = await Employee.findOne({ userId: req.user._id });
      if (!employee) {
        return res.status(404).json({ success: false, message: 'Employee profile not found' });
      }

      const documents = await Document.find({ employeeId: employee._id })
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: documents
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching documents',
        error: error.message
      });
    }
  }
);

// 10. Download Document
router.get(
  '/:id/download',
  protect,
  async (req, res) => {
    try {
      const document = await Document.findById(req.params.id);
      
      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      // Check if user owns the document or is a company
      if (req.user.role === 'employee') {
        const employee = await Employee.findOne({ userId: req.user._id });
        if (!employee || document.employeeId.toString() !== employee._id.toString()) {
          return res.status(403).json({
            success: false,
            message: 'Access denied'
          });
        }
      }

      const filePath = path.join(__dirname, '..', 'uploads', 'documents', document.fileName);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'File not found on server'
        });
      }

      res.download(filePath, document.originalName);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error downloading document',
        error: error.message
      });
    }
  }
);

export default router;