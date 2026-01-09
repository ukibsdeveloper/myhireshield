import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Employee ID is required']
  },
  documentType: {
    type: String,
    enum: [
      'aadhaar',
      'pan',
      'passport',
      'driving_license',
      'educational_certificate',
      'experience_letter',
      'police_verification',
      'address_proof',
      'bank_statement',
      'other'
    ],
    required: [true, 'Document type is required']
  },
  documentNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  fileName: {
    type: String,
    required: [true, 'File name is required']
  },
  filePath: {
    type: String, // Can be local path or Cloudinary URL
    required: [true, 'File path is required']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required']
  },
  // Verification Status
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'under_review'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  rejectionReason: String,
  
  // Automated Verification & OCR
  autoVerification: {
    attempted: { type: Boolean, default: false },
    success: { type: Boolean, default: false },
    confidence: { type: Number, min: 0, max: 100 },
    extractedData: mongoose.Schema.Types.Mixed,
    errors: [String],
    verifiedAt: Date
  },
  extractedText: String,
  extractedData: {
    name: String,
    documentNumber: String,
    issueDate: Date,
    expiryDate: Date,
    address: String,
    otherFields: mongoose.Schema.Types.Mixed
  },
  
  // Metadata & Security
  issueDate: Date,
  expiryDate: Date,
  issuingAuthority: String,
  encrypted: { type: Boolean, default: false },
  accessLog: [{
    accessedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    accessedAt: Date,
    purpose: String,
    ipAddress: String
  }],
  isSuspicious: { type: Boolean, default: false },
  suspiciousReasons: [String],
  requiresManualReview: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes
documentSchema.index({ employeeId: 1, documentType: 1 });
documentSchema.index({ verificationStatus: 1 });
documentSchema.index({ uploadedAt: -1 });

// Virtuals
documentSchema.virtual('documentAge').get(function() {
  const now = new Date();
  const uploaded = new Date(this.uploadedAt);
  const diffTime = Math.abs(now - uploaded);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
});

documentSchema.virtual('isExpired').get(function() {
  if (!this.expiryDate) return false;
  return new Date() > new Date(this.expiryDate);
});

// Method to log authorized access
documentSchema.methods.logAccess = async function(userId, purpose, ipAddress) {
  this.accessLog.push({
    accessedBy: userId,
    accessedAt: new Date(),
    purpose,
    ipAddress
  });
  await this.save();
};

// Method to finalize verification
documentSchema.methods.markAsVerified = async function(verifiedBy) {
  this.verificationStatus = 'verified';
  this.verifiedBy = verifiedBy;
  this.verifiedAt = new Date();
  await this.save();
  
  // Triggering Badge Update in Employee Node
  const Employee = mongoose.model('Employee');
  const employee = await Employee.findById(this.employeeId);
  if (employee) {
    // Note: Ensure updateScore or a badge logic exists in Employee model
    await employee.save(); 
  }
};

const Document = mongoose.model('Document', documentSchema);
export default Document;