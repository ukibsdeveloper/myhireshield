import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['company', 'employee', 'admin'],
    required: [true, 'User role is required']
  },

  // --- BUREAU MODEL EXTENSIONS ---
  // Identity Nodes (For Employee Login via Name + DOB)
  firstName: { type: String, trim: true, uppercase: true }, // Uppercase for standardized matching
  dateOfBirth: { type: String }, // Stored as YYYY-MM-DD from frontend

  // Payment Status (For Reputation Report Unlock)
  isPaid: { type: Boolean, default: false },

  // --- CORE SECURITY & AUTH ---
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: String,
  phoneNumber: String,
  phoneVerified: { type: Boolean, default: false },
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  isActive: { type: Boolean, default: true },
  isSuspended: { type: Boolean, default: false },
  suspensionReason: String,
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'role'
  },
  ipAddresses: [{
    ip: String,
    timestamp: Date
  }],
  sessions: [{
    token: String,
    createdAt: Date,
    expiresAt: Date,
    device: String,
    browser: String
  }]
}, {
  timestamps: true
});

// Indexes for high-speed node verification
userSchema.index({ role: 1 });
userSchema.index({ firstName: 1, dateOfBirth: 1 }); // New: Optimized search for Name+DOB login
userSchema.index({ emailVerified: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 }); // Optimize "Recent Users" Sort

userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const salt = await bcrypt.genSalt(rounds);
    this.password = await bcrypt.hash(this.password, salt);
    next(); // <--- Ye zaroori hai
  } catch (error) {
    next(error); // <--- Error pass karna bhi zaroori hai
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

userSchema.methods.incLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 4 * 60 * 60 * 1000; // 4 hours lockout
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  return this.updateOne(updates);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.emailVerificationToken;
  delete user.emailVerificationExpires;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  delete user.twoFactorSecret;
  delete user.sessions;
  delete user.ipAddresses;
  delete user.loginAttempts;
  delete user.lockUntil;
  return user;
};

const User = mongoose.model('User', userSchema);
export default User;