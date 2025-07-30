const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  // Premium features flag for future monetization
  isPremium: {
    type: Boolean,
    default: false
  },
  subscriptionType: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free'
  },
  subscriptionExpiry: {
    type: Date,
    default: null
  },
  // Limits for free users
  cvLimit: {
    type: Number,
    default: 3 // Free users can create up to 3 CVs
  },
  downloadLimit: {
    type: Number,
    default: 5 // Free users can download 5 times per month
  },
  downloadsThisMonth: {
    type: Number,
    default: 0
  },
  lastDownloadReset: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Reset monthly downloads
userSchema.methods.resetMonthlyDownloads = function() {
  const now = new Date();
  const lastReset = new Date(this.lastDownloadReset);
  
  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    this.downloadsThisMonth = 0;
    this.lastDownloadReset = now;
  }
};

module.exports = mongoose.model('User', userSchema);