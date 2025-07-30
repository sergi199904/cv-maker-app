const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const CV = require('../models/CV');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email } = req.body;

    // Check if email is already taken by another user
    if (email !== req.user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, email },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/user/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const cvCount = await CV.countDocuments({ 
      userId: req.user._id, 
      isActive: true 
    });

    const totalViews = await CV.aggregate([
      { $match: { userId: req.user._id, isActive: true } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    const totalDownloads = await CV.aggregate([
      { $match: { userId: req.user._id, isActive: true } },
      { $group: { _id: null, totalDownloads: { $sum: '$downloads' } } }
    ]);

    const recentCVs = await CV.find({ 
      userId: req.user._id, 
      isActive: true 
    })
    .sort({ updatedAt: -1 })
    .limit(3)
    .select('title updatedAt views downloads');

    res.json({
      stats: {
        cvCount,
        totalViews: totalViews[0]?.totalViews || 0,
        totalDownloads: totalDownloads[0]?.totalDownloads || 0,
        cvLimit: req.user.cvLimit,
        downloadLimit: req.user.downloadLimit,
        downloadsThisMonth: req.user.downloadsThisMonth,
        subscriptionType: req.user.subscriptionType
      },
      recentCVs
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/user/upgrade
// @desc    Upgrade user to premium (placeholder for payment integration)
// @access  Private
router.post('/upgrade', auth, async (req, res) => {
  try {
    // TODO: Integrate with payment processor (Stripe, PayPal, etc.)
    // For now, this is a placeholder endpoint
    
    const { planType = 'premium' } = req.body;
    
    // Simulate upgrade process
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        isPremium: true,
        subscriptionType: planType,
        subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        cvLimit: planType === 'enterprise' ? 100 : 50,
        downloadLimit: -1 // Unlimited
      },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Upgrade successful',
      user,
      features: {
        unlimitedCVs: planType !== 'free',
        unlimitedDownloads: true,
        premiumTemplates: true,
        prioritySupport: planType === 'enterprise',
        aiAdvisory: planType === 'enterprise'
      }
    });
  } catch (error) {
    console.error('Upgrade error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;