const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String },
  gpa: { type: String }
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String },
  location: { type: String },
  responsibilities: [{ type: String }]
});

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  category: {
    type: String,
    enum: ['technical', 'soft', 'language', 'other'],
    default: 'technical'
  }
});

const contactSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  linkedin: { type: String },
  github: { type: String },
  portfolio: { type: String },
  website: { type: String }
});

const cvSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'My CV'
  },
  // Personal Information
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    title: { type: String }, // Professional title
    summary: { type: String },
    profileImage: { type: String } // URL or base64 for future implementation
  },
  
  // Contact Information
  contact: contactSchema,
  
  // Professional Experience
  experience: [experienceSchema],
  
  // Education
  education: [educationSchema],
  
  // Skills
  skills: [skillSchema],
  
  // Additional sections for premium features
  projects: [{
    name: { type: String },
    description: { type: String },
    technologies: [{ type: String }],
    url: { type: String },
    startDate: { type: Date },
    endDate: { type: Date }
  }],
  
  certifications: [{
    name: { type: String },
    issuer: { type: String },
    date: { type: Date },
    url: { type: String }
  }],
  
  languages: [{
    name: { type: String },
    level: { 
      type: String, 
      enum: ['basic', 'intermediate', 'advanced', 'native']
    }
  }],
  
  // CV Customization
  template: {
    type: String,
    default: 'classic',
    enum: ['classic', 'modern', 'creative', 'minimal'] // Future templates
  },
  
  theme: {
    primaryColor: { type: String, default: '#2563eb' },
    secondaryColor: { type: String, default: '#64748b' },
    fontFamily: { type: String, default: 'Inter' },
    fontSize: { type: String, default: 'medium' }
  },
  
  // Privacy and sharing
  isPublic: { type: Boolean, default: false },
  shareUrl: { type: String }, // For future sharing feature
  
  // Analytics for premium users
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  lastViewed: { type: Date },
  
  // Status
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Index for user's CVs
cvSchema.index({ userId: 1, createdAt: -1 });

// Method to increment view count
cvSchema.methods.incrementViews = function() {
  this.views += 1;
  this.lastViewed = new Date();
  return this.save();
};

// Method to increment download count
cvSchema.methods.incrementDownloads = function() {
  this.downloads += 1;
  return this.save();
};

module.exports = mongoose.model('CV', cvSchema);