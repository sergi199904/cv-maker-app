const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user has premium access
const requirePremium = (req, res, next) => {
  if (!req.user.isPremium && req.user.subscriptionType === 'free') {
    return res.status(403).json({ 
      message: 'Premium subscription required for this feature',
      upgrade: true
    });
  }
  next();
};

// Middleware to check download limits
const checkDownloadLimit = async (req, res, next) => {
  try {
    const user = req.user;
    
    // Reset monthly downloads if needed
    user.resetMonthlyDownloads();
    
    // Check if user has exceeded download limit
    if (user.subscriptionType === 'free' && user.downloadsThisMonth >= user.downloadLimit) {
      return res.status(403).json({
        message: 'Monthly download limit exceeded. Upgrade to premium for unlimited downloads.',
        limit: user.downloadLimit,
        used: user.downloadsThisMonth,
        upgrade: true
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking download limit' });
  }
};

module.exports = { auth, requirePremium, checkDownloadLimit };