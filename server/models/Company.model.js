import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Company email is required'],
    lowercase: true,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    required: [true, 'Industry is required']
  },
  companySize: {
    type: String,
    // Fix: Added '200+' to sync with RegisterCompany.jsx frontend options
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+', '200+'], 
    required: [true, 'Company size is required']
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: { type: String, default: 'India' },
    pincode: String
  },
  contactPerson: {
    name: {
      type: String,
      required: [true, 'Contact person name is required']
    },
    designation: {
      type: String,
      required: [true, 'Contact person designation is required']
    },
    phone: {
      type: String,
      required: [true, 'Contact person phone is required']
    },
    email: {
      type: String,
      required: [true, 'Contact person email is required']
    }
  },
  gstin: {
    type: String,
    trim: true,
    uppercase: true
  },
  cin: {
    type: String,
    trim: true,
    uppercase: true
  },
  logo: {
    type: String,
    default: null
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    type: String
  }],
  // Statistics
  totalReviewsSubmitted: {
    type: Number,
    default: 0
  },
  totalEmployeesReviewed: {
    type: Number,
    default: 0
  },
  averageRatingGiven: {
    type: Number,
    default: 0
  },
  reputationScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'free'
  },
  subscriptionExpires: Date,
  settings: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    reviewNotifications: {
      type: Boolean,
      default: true
    },
    profileVisibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public'
    }
  },
  lastActive: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
companySchema.index({ userId: 1 });
companySchema.index({ email: 1 });
companySchema.index({ companyName: 'text' });
companySchema.index({ verified: 1 });
companySchema.index({ reputationScore: -1 });

// Update statistics method
companySchema.methods.updateStatistics = async function() {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ companyId: this._id });
  this.totalReviewsSubmitted = reviews.length;
  const uniqueEmployees = [...new Set(reviews.map(r => r.employeeId.toString()))];
  this.totalEmployeesReviewed = uniqueEmployees.length;

  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => {
      const ratings = Object.values(review.ratings);
      const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      return sum + avgRating;
    }, 0);
    this.averageRatingGiven = Math.round((totalRating / reviews.length) * 10) / 10;
  }
  await this.save();
};

// Reputation algorithm logic
companySchema.methods.calculateReputationScore = async function() {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ companyId: this._id });
  let score = 0;
  if (this.verified) score += 20;
  const reviewCount = Math.min(reviews.length, 50);
  score += (reviewCount / 50) * 30;

  if (reviews.length > 0) {
    const ratings = reviews.map(r => {
      const vals = Object.values(r.ratings);
      return vals.reduce((a, b) => a + b, 0) / vals.length;
    });
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const variance = ratings.reduce((sum, rating) => sum + Math.pow(rating - avgRating, 2), 0) / ratings.length;
    const consistency = Math.max(0, 10 - variance);
    score += (consistency / 10) * 30;
  }

  const recentReviews = reviews.filter(r => {
    const daysSince = (Date.now() - new Date(r.createdAt)) / (1000 * 60 * 60 * 24);
    return daysSince <= 180; 
  });
  score += (recentReviews.length / Math.max(reviews.length, 1)) * 20;
  
  this.reputationScore = Math.round(Math.min(score, 100));
  await this.save();
  return this.reputationScore;
};

const Company = mongoose.model('Company', companySchema);
export default Company;