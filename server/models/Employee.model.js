import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    index: true
  },
  // Employment Information
  employeeId: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  department: {
    type: String,
    default: 'General'
  },
  designation: {
    type: String,
    default: 'Employee'
  },
  employmentType: {
    type: String,
    enum: ['permanent', 'contract', 'intern', 'probation'],
    default: 'permanent'
  },
  employmentStatus: {
    type: String,
    enum: ['active', 'inactive', 'terminated', 'resigned'],
    default: 'active'
  },
  dateOfJoining: {
    type: Date,
    default: Date.now
  },
  dateOfLeaving: {
    type: Date
  },
  workLocation: {
    type: String,
    default: 'Not Specified'
  },
  reportingManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  // Company Relationships
  previousCompanies: [{
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    fromDate: Date,
    toDate: Date,
    designation: String,
    reasonForLeaving: String
  }],
  // Access Control
  permissions: {
    canViewReports: {
      type: Boolean,
      default: false
    },
    canManageTeam: {
      type: Boolean,
      default: false
    },
    canAccessDocuments: {
      type: Boolean,
      default: true
    }
  },
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    uppercase: true // Fix: Standardizing for Search and Login
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    uppercase: true // Fix: Standardizing for Search and Login
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  dateOfBirth: {
    type: String, // Fix: Changed from Date to String to match Frontend YYYY-MM-DD
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Gender is required']
  },
  // Address
  address: {
    street: String,
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    country: {
      type: String,
      default: 'India'
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required']
    }
  },
  // Professional Information
  currentDesignation: String,
  totalExperience: {
    type: Number,
    default: 0 // in years
  },
  skills: [{
    type: String,
    trim: true
  }],
  education: [{
    degree: String,
    institution: String,
    year: Number,
    percentage: Number
  }],
  workHistory: [{
    companyName: String,
    designation: String,
    startDate: Date,
    endDate: Date,
    currentlyWorking: Boolean,
    responsibilities: String
  }],
  // Profile
  profilePicture: String,
  bio: String,
  linkedinUrl: String,
  githubUrl: String,
  portfolioUrl: String,
  // Score and Verification
  overallScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationBadges: [{
    type: {
      type: String,
      enum: ['identity', 'education', 'experience', 'police', 'address']
    },
    verified: Boolean,
    verifiedAt: Date
  }],
  // Privacy and Consent
  profileVisible: {
    type: Boolean,
    default: false // Must give consent first
  },
  consentGiven: {
    type: Boolean,
    default: false
  },
  consentType: {
    type: String,
    enum: ['marketing', 'analytics', 'third_party', 'all']
  },
  consentDate: Date,
  consentGivenAt: Date,
  dataRetentionConsent: {
    type: Boolean,
    default: false
  },
  // Statistics
  profileViews: {
    type: Number,
    default: 0
  },
  lastViewedAt: Date,
  searchAppearances: {
    type: Number,
    default: 0
  },
  // Settings
  settings: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    profileVisibility: {
      type: String,
      enum: ['public', 'semi-public', 'private'],
      default: 'semi-public'
    },
    showContactInfo: {
      type: Boolean,
      default: false
    }
  },
  // Metadata
  lastActive: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Fix: Robust Indexing for EmployeeSearch.jsx logic
employeeSchema.index({ email: 1 });
employeeSchema.index({ firstName: 1, lastName: 1, dateOfBirth: 1 }); // Multi-key index for search
employeeSchema.index({ firstName: 'text', lastName: 'text' });
employeeSchema.index({ overallScore: -1 });
employeeSchema.index({ createdAt: -1 }); // Optimize "Recent Employees" Sort

// Virtual for full name
employeeSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for verification percentage (profile completeness)
employeeSchema.virtual('verificationPercentage').get(function () {
  let score = 0;
  if (this.verified) score += 40; // Base verification status
  if (this.profilePicture) score += 10;
  if (this.bio) score += 10;
  if (this.workHistory?.length > 0) score += 20;
  if (this.education?.length > 0) score += 20;
  return Math.min(score, 100);
});

// Update overall score based on approved reviews only
employeeSchema.methods.updateScore = async function () {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({
    employeeId: this._id,
    isActive: true,
    $or: [{ moderationStatus: 'approved' }, { moderationStatus: { $exists: false } }]
  });

  if (reviews.length === 0) {
    this.overallScore = 0;
    this.totalReviews = 0;
  } else {
    const totalScore = reviews.reduce((sum, review) => {
      const ratings = Object.values(review.ratings);
      const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      return sum + avgRating;
    }, 0);

    this.overallScore = Math.round((totalScore / reviews.length) * 10);
    this.totalReviews = reviews.length;
  }

  await this.save();
  return this.overallScore;
};

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;