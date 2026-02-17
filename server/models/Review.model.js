import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required']
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Employee ID is required']
  },
  // 8-Parameter Rating System (1-10 scale)
  ratings: {
    workQuality: { type: Number, required: true, min: 1, max: 10 },
    punctuality: { type: Number, required: true, min: 1, max: 10 },
    behavior: { type: Number, required: true, min: 1, max: 10 },
    teamwork: { type: Number, required: true, min: 1, max: 10 },
    communication: { type: Number, required: true, min: 1, max: 10 },
    technicalSkills: { type: Number, required: true, min: 1, max: 10 },
    problemSolving: { type: Number, required: true, min: 1, max: 10 },
    reliability: { type: Number, required: true, min: 1, max: 10 }
  },
  // Employment Details
  employmentDetails: {
    designation: { type: String, required: [true, 'Designation is required'] },
    department: String,
    startDate: { type: Date, required: [true, 'Start date is required'] },
    endDate: { type: Date, required: [true, 'End date is required'] },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      required: [true, 'Employment type is required']
    },
    reasonForLeaving: String
  },

  // --- ASSET NODES (New: Synchronized with SubmitReview.jsx) ---
  verificationAssets: {
    govId: { type: String }, // URL to uploaded Government ID
    experienceCertificate: { type: String } // URL to Experience Letter
  },

  // Review Content
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    minlength: [50, 'Comment must be at least 50 characters'], // Sync with frontend check
    maxlength: [2000, 'Comment cannot exceed 2000 characters']
  },
  wouldRehire: {
    type: Boolean,
    required: [true, 'Would rehire field is required']
  },
  // Verification & Moderation
  verified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: Date,
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isActive: { type: Boolean, default: true },
  editHistory: [{
    editedAt: Date,
    editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changes: Object
  }],
  deletedAt: Date
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ companyId: 1, createdAt: -1 });
reviewSchema.index({ employeeId: 1, createdAt: -1 });
reviewSchema.index({ moderationStatus: 1 });
// Performance: Optimize Score Calculation Query
reviewSchema.index({ employeeId: 1, isActive: 1, moderationStatus: 1 });
reviewSchema.index({ isActive: 1, createdAt: -1 }); // Optimize "Recent Reviews" Sort

// Virtuals
reviewSchema.virtual('averageRating').get(function () {
  const ratings = Object.values(this.ratings);
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
});

reviewSchema.virtual('daysSinceEmploymentEnded').get(function () {
  if (!this.employmentDetails.endDate) return null;
  const now = new Date();
  const endDate = new Date(this.employmentDetails.endDate);
  const diffTime = now - endDate; // Removed Math.abs to ensure it's in the past
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save validation for 15-day window
reviewSchema.pre('save', async function () {
  if (this.isNew) {
    const daysSince = this.daysSinceEmploymentEnded;
    // Window policy: Review must be within 15 days of exit
    if (daysSince !== null && daysSince > 15) {
      throw new Error('Protocol Violation: Reviews must be submitted within 15 days of employment end date.');
    }
  }
});

// Post-save: Trigger Employee Score Update (only for approved reviews)
reviewSchema.post('save', async function () {
  try {
    if (this.moderationStatus !== 'approved') return;
    const Employee = mongoose.model('Employee');
    const employee = await Employee.findById(this.employeeId);
    if (employee) await employee.updateScore();
  } catch (error) {
    console.error('Score Update Failed:', error);
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;