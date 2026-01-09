import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Fix: Allow logging failed login attempts before user is identified
  },
  userEmail: String,
  userRole: {
    type: String,
    enum: ['company', 'employee', 'admin', 'anonymous']
  },
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    enum: [
      // Authentication
      'user_login',
      'user_logout',
      'user_registration',
      'password_change',
      'password_reset',
      'email_verification',
      'two_factor_enabled',
      'two_factor_disabled',
      'failed_login_attempt',
      // Bureau Specific (New Nodes)
      'employee_creation_by_company', 
      'score_decryption_payment',
      // Profile & Ledger Actions
      'profile_created',
      'profile_updated',
      'profile_viewed',
      'profile_deleted',
      'review_created',
      'review_updated',
      'review_deleted',
      'review_viewed',
      'review_flagged',
      // Documents
      'document_uploaded',
      'document_verified',
      'document_rejected',
      'document_deleted',
      'document_viewed',
      // Search
      'employee_searched',
      'search_filter_applied',
      // Data Rights & Security
      'data_exported',
      'consent_given',
      'consent_withdrawn',
      'account_deleted',
      'suspicious_activity',
      'ip_blocked',
      'account_suspended',
      'account_activated'
    ]
  },
  eventData: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  browser: String,
  os: String,
  device: String,
  sessionId: String,
  location: {
    country: String,
    city: String,
    region: String
  },
  status: {
    type: String,
    enum: ['success', 'failure', 'warning'],
    default: 'success'
  },
  errorMessage: String,
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for high-speed security forensic
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ eventType: 1, timestamp: -1 });
auditLogSchema.index({ ipAddress: 1, timestamp: -1 });

// Automatically delete logs older than 2 years to keep DB lean
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 63072000 }); 

// Static method to create audit log without breaking main logic
auditLogSchema.statics.createLog = async function(data) {
  try {
    const log = new this(data);
    await log.save();
    return log;
  } catch (error) {
    console.error('Audit Log Error:', error);
    return null;
  }
};

// Security logic: Detect brute force or scraping
auditLogSchema.statics.detectSuspiciousActivity = async function(userId) {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const failedLogins = await this.countDocuments({
    userId,
    eventType: 'failed_login_attempt',
    timestamp: { $gte: oneHourAgo }
  });
  
  if (failedLogins >= 5) {
    return { suspicious: true, reason: 'Brute force suspected', count: failedLogins };
  }
  return { suspicious: false };
};

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;