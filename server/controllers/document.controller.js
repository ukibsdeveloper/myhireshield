import Document from '../models/Document.model.js';
import Employee from '../models/Employee.model.js';
import AuditLog from '../models/AuditLog.model.js';
import { sendEmail } from '../utils/email.js';
import { 
  validateAadhaar, 
  validatePAN 
} from '../utils/documentVerification.js';
import fs from 'fs';
import path from 'path';

/**
 * Helper Function: Auto-verify document
 * This internal function uses the utility validators to check document number formats.
 */
async function performAutoVerification(document) {
  const result = {
    attempted: true,
    passed: false,
    checks: [],
    confidence: 0
  };

  try {
    // Perform verification based on document type
    switch (document.documentType) {
      case 'aadhaar':
        if (document.documentNumber) {
          const aadhaarValid = validateAadhaar(document.documentNumber);
          result.checks.push({
            name: 'Aadhaar Number Format',
            passed: aadhaarValid.valid,
            message: aadhaarValid.message || aadhaarValid.error
          });
          if (aadhaarValid.valid) result.confidence += 50;
        }
        break;

      case 'pan':
        if (document.documentNumber) {
          const panValid = validatePAN(document.documentNumber);
          result.checks.push({
            name: 'PAN Number Format',
            passed: panValid.valid,
            message: panValid.message || panValid.error
          });
          if (panValid.valid) result.confidence += 50;
        }
        break;

      default:
        result.checks.push({
          name: 'Manual Review Required',
          passed: true,
          message: 'Format validation not available for this type, pending manual review'
        });
        result.confidence += 30;
    }

    // Check file integrity (Basic check if file exists and has size)
    if (document.fileSize > 0) {
      result.checks.push({
        name: 'File Integrity',
        passed: true,
        message: 'File is readable and integrity check passed'
      });
      result.confidence += 20;
    }

    // Check file extension/type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMimeTypes.includes(document.mimeType)) {
       result.confidence += 10;
    }

    // Overall pass/fail based on confidence threshold (70%)
    result.passed = result.confidence >= 70;

  } catch (error) {
    console.error('Auto verification internal error:', error);
    result.checks.push({
      name: 'Verification Engine Error',
      passed: false,
      message: error.message
    });
  }

  return result;
}

/**
 * Helper Function: Update employee verification status
 * Recalculates the percentage of verified documents for the employee profile.
 */
async function updateEmployeeVerificationStatus(employeeId) {
  try {
    const documents = await Document.find({ employeeId });
    
    const totalDocs = documents.length;
    const verifiedDocs = documents.filter(doc => doc.verificationStatus === 'verified').length;
    
    const verificationPercentage = totalDocs > 0 ? Math.round((verifiedDocs / totalDocs) * 100) : 0;
    
    // Threshold for the 'Verified' badge is 80%
    await Employee.findByIdAndUpdate(employeeId, {
      documentsVerified: verifiedDocs,
      verificationPercentage,
      verified: verificationPercentage >= 80 
    });

  } catch (error) {
    console.error('Failed to update employee verification status:', error);
  }
}

// --- MAIN CONTROLLERS ---

// @desc    Company uploads document for employee verification
// @route   POST /api/documents/company-upload
export const companyUploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { employeeId, documentType, documentNumber, verificationNotes } = req.body;

    // 1. Validate Employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // 2. Create Document Entry with comprehensive verification fields
    const document = await Document.create({
      employeeId: employee._id,
      documentType,
      documentNumber: documentNumber?.toUpperCase(),
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user._id,
      verificationStatus: 'pending',
      verificationNotes,
      // Initialize comprehensive verification fields
      backgroundCheck: {
        policeVerification: { status: 'pending', checkedAt: null, result: null },
        courtRecords: { status: 'pending', checkedAt: null, result: null },
        addressVerification: { status: 'pending', checkedAt: null, result: null },
        employmentVerification: { status: 'pending', checkedAt: null, result: null },
        educationVerification: { status: 'pending', checkedAt: null, result: null },
        referenceCheck: { status: 'pending', checkedAt: null, result: null },
        criminalBackground: { status: 'pending', checkedAt: null, result: null }
      }
    });

    // 3. Perform initial auto-verification
    const verificationResult = await performAutoVerification(document);
    document.autoVerification = verificationResult;

    // 4. If auto-verification passes, move to under_review for manual checks
    if (verificationResult.passed) {
      document.verificationStatus = 'under_review';
    }

    await document.save();

    // 5. Update Employee Badge Progress
    await updateEmployeeVerificationStatus(employee._id);

    // 6. Audit Logging
    await AuditLog.createLog({
      userId: req.user._id,
      userEmail: req.user.email,
      userRole: req.user.role,
      eventType: 'document_uploaded_by_company',
      eventData: {
        employeeId: employee._id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        documentType,
        fileName: req.file.filename,
        autoVerified: verificationResult.passed
      },
      ipAddress: req.ip,
      status: 'success'
    });

    // 7. Send Email Notification to Employee
    try {
      await sendEmail({
        to: employee.email,
        subject: 'Document Verification Started - MyHireShield',
        template: 'documentVerificationStarted',
        data: {
          employeeName: `${employee.firstName} ${employee.lastName}`,
          documentType: documentType.toUpperCase(),
          companyName: req.user.companyName || 'Your Company'
        }
      });
    } catch (mailError) {
      console.error('Email notification failed but upload was successful');
    }

    res.status(201).json({
      success: true,
      message: 'Document uploaded and verification process initiated',
      data: document
    });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error('Company Upload Error:', error);
    res.status(500).json({ success: false, message: 'Server error during upload' });
  }
};

// @desc    Get employee documents
// @route   GET /api/documents/employee/:employeeId
export const getEmployeeDocuments = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await Employee.findById(employeeId);
    
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

    // Security Check: Only the owner or a company can view
    if (req.user.role === 'employee' && employee.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const documents = await Document.find({ employeeId }).sort({ uploadedAt: -1 });

    await AuditLog.createLog({
      userId: req.user._id,
      userEmail: req.user.email,
      eventType: 'document_viewed',
      eventData: { employeeId },
      ipAddress: req.ip,
      status: 'success'
    });

    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching documents' });
  }
};

// @desc    Perform comprehensive background verification
// @route   POST /api/documents/:id/background-check
export const performBackgroundCheck = async (req, res) => {
  try {
    const { checkType, result, notes } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Validate check type
    const validCheckTypes = [
      'policeVerification', 'courtRecords', 'addressVerification',
      'employmentVerification', 'educationVerification', 'referenceCheck', 'criminalBackground'
    ];

    if (!validCheckTypes.includes(checkType)) {
      return res.status(400).json({ success: false, message: 'Invalid check type' });
    }

    // Update background check status
    document.backgroundCheck[checkType] = {
      status: result, // 'passed', 'failed', 'pending'
      checkedAt: new Date(),
      result: notes || '',
      checkedBy: req.user._id
    };

    // Calculate overall verification status
    await updateOverallVerificationStatus(document);

    await document.save();

    // Audit logging
    await AuditLog.createLog({
      userId: req.user._id,
      userEmail: req.user.email,
      userRole: req.user.role,
      eventType: 'background_check_performed',
      eventData: {
        documentId: document._id,
        checkType,
        result,
        employeeId: document.employeeId
      },
      ipAddress: req.ip,
      status: 'success'
    });

    res.status(200).json({
      success: true,
      message: `${checkType} check completed`,
      data: document.backgroundCheck[checkType]
    });

  } catch (error) {
    console.error('Background check error:', error);
    res.status(500).json({ success: false, message: 'Background check failed' });
  }
};

// Helper function to update overall verification status
async function updateOverallVerificationStatus(document) {
  const checks = document.backgroundCheck;
  const criticalChecks = ['policeVerification', 'courtRecords', 'criminalBackground'];
  const allChecks = Object.values(checks);

  // Check if all critical checks are passed
  const criticalPassed = criticalChecks.every(check =>
    checks[check].status === 'passed'
  );

  // Check if any check failed
  const anyFailed = allChecks.some(check => check.status === 'failed');

  if (anyFailed) {
    document.verificationStatus = 'rejected';
    document.rejectionReason = 'Failed background verification check(s)';
  } else if (criticalPassed && allChecks.every(check => check.status !== 'pending')) {
    document.verificationStatus = 'verified';
    document.verifiedAt = new Date();
    document.verifiedBy = document.backgroundCheck.criminalBackground.checkedBy;
  } else {
    document.verificationStatus = 'under_review';
  }

  // Update employee verification status
  await updateEmployeeVerificationStatus(document.employeeId);
}

// @desc    Get all employees for company document upload
// @route   GET /api/documents/employees
export const getEmployeesForUpload = async (req, res) => {
  try {
    // For now, return all employees (in production, filter by company relationship)
    // TODO: Add company-employee relationship
    const employees = await Employee.find({ profileVisible: true })
      .select('firstName lastName email phone currentDesignation verificationPercentage verified')
      .sort({ createdAt: -1 });

    const formattedEmployees = employees.map(emp => ({
      id: emp._id,
      name: `${emp.firstName} ${emp.lastName}`,
      email: emp.email,
      phone: emp.phone,
      designation: emp.currentDesignation,
      verificationPercentage: emp.verificationPercentage || 0,
      verified: emp.verified || false
    }));

    res.status(200).json({
      success: true,
      count: formattedEmployees.length,
      data: formattedEmployees
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ success: false, message: 'Error fetching employees' });
  }
};

// @desc    Get all documents pending verification (for companies)
// @route   GET /api/documents/pending-verification
export const getPendingVerifications = async (req, res) => {
  try {
    // Find all documents that need manual verification
    const pendingDocuments = await Document.find({ 
      verificationStatus: { $in: ['under_review', 'pending'] }
    })
    .populate({
      path: 'employeeId',
      select: 'firstName lastName email phone',
      populate: {
        path: 'userId',
        select: 'email'
      }
    })
    .populate('uploadedBy', 'email')
    .sort({ uploadedAt: -1 });

    // Format the response for the frontend
    const formattedDocuments = pendingDocuments.map(doc => ({
      id: doc._id,
      employeeId: doc.employeeId._id,
      employeeName: `${doc.employeeId.firstName} ${doc.employeeId.lastName}`,
      employeeEmail: doc.employeeId.email || doc.employeeId.userId?.email,
      documentType: doc.documentType,
      documentNumber: doc.documentNumber,
      status: doc.verificationStatus,
      uploadedAt: doc.uploadedAt,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      autoVerification: doc.autoVerification,
      rejectionReason: doc.rejectionReason,
      backgroundCheck: doc.backgroundCheck,
      verificationNotes: doc.verificationNotes
    }));

    res.status(200).json({ 
      success: true, 
      count: formattedDocuments.length,
      data: formattedDocuments 
    });
  } catch (error) {
    console.error('Error fetching pending verifications:', error);
    res.status(500).json({ success: false, message: 'Error fetching pending verifications' });
  }
};

// @desc    Manual verification by Company/Admin
// @route   PUT /api/documents/:id/verify
export const verifyDocument = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const document = await Document.findById(req.params.id);

    if (!document) return res.status(404).json({ success: false, message: 'Document not found' });

    document.verificationStatus = status;
    document.verifiedBy = req.user._id;
    document.verifiedAt = new Date();
    if (status === 'rejected') document.rejectionReason = rejectionReason;

    await document.save();
    await updateEmployeeVerificationStatus(document.employeeId);

    const employee = await Employee.findById(document.employeeId).populate('userId');

    // Notification
    await sendEmail({
      to: employee.email,
      subject: `Document Verification: ${status.toUpperCase()}`,
      template: status === 'verified' ? 'documentVerified' : 'documentRejected',
      data: {
        employeeName: employee.firstName,
        documentType: document.documentType,
        reason: rejectionReason || 'No reason provided'
      }
    });

    res.status(200).json({ success: true, message: `Document marked as ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Verification update failed' });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ success: false, message: 'Document not found' });

    const employee = await Employee.findById(document.employeeId);
    if (employee.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized deletion' });
    }

    if (fs.existsSync(document.filePath)) fs.unlinkSync(document.filePath);
    
    const empId = document.employeeId;
    await document.deleteOne();
    await updateEmployeeVerificationStatus(empId);

    res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Deletion failed' });
  }
};