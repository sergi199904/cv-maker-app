const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  preview: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['professional', 'creative', 'modern', 'minimal'],
    default: 'professional'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
templateSchema.index({ isPremium: 1, isActive: 1 });

module.exports = mongoose.model('Template', templateSchema);