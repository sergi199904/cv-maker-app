const express = require('express');
const { body, validationResult } = require('express-validator');
const CV = require('../models/CV');
const User = require('../models/User');
const { auth, requirePremium, checkDownloadLimit } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cv
// @desc    Get all CVs for authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const cvs = await CV.find({ userId: req.user._id, isActive: true })
      .sort({ updatedAt: -1 })
      .select('title template createdAt updatedAt views downloads');
    
    res.json({
      cvs,
      count: cvs.length,
      limit: req.user.cvLimit
    });
  } catch (error) {
    console.error('Get CVs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cv/:id
// @desc    Get specific CV by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const cv = await CV.findOne({ 
      _id: req.params.id, 
      userId: req.user._id,
      isActive: true 
    });
    
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    
    // Increment view count
    await cv.incrementViews();
    
    res.json(cv);
  } catch (error) {
    console.error('Get CV error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cv
// @desc    Create new CV
// @access  Private
router.post('/', [
  auth,
  body('title').trim().notEmpty(),
  body('personalInfo.firstName').trim().notEmpty(),
  body('personalInfo.lastName').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check CV limit for free users
    if (req.user.subscriptionType === 'free') {
      const userCVCount = await CV.countDocuments({ 
        userId: req.user._id, 
        isActive: true 
      });
      
      if (userCVCount >= req.user.cvLimit) {
        return res.status(403).json({
          message: `Free users can create up to ${req.user.cvLimit} CVs. Upgrade to premium for unlimited CVs.`,
          limit: req.user.cvLimit,
          current: userCVCount,
          upgrade: true
        });
      }
    }

    const cvData = {
      userId: req.user._id,
      ...req.body
    };

    const cv = new CV(cvData);
    await cv.save();

    res.status(201).json({
      message: 'CV created successfully',
      cv
    });
  } catch (error) {
    console.error('Create CV error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/cv/:id
// @desc    Update CV
// @access  Private
router.put('/:id', [
  auth,
  body('title').trim().notEmpty(),
  body('personalInfo.firstName').trim().notEmpty(),
  body('personalInfo.lastName').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const cv = await CV.findOne({ 
      _id: req.params.id, 
      userId: req.user._id,
      isActive: true 
    });
    
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    // Update CV data
    Object.assign(cv, req.body);
    await cv.save();

    res.json({
      message: 'CV updated successfully',
      cv
    });
  } catch (error) {
    console.error('Update CV error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cv/:id
// @desc    Delete CV (soft delete)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const cv = await CV.findOne({ 
      _id: req.params.id, 
      userId: req.user._id,
      isActive: true 
    });
    
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    // Soft delete
    cv.isActive = false;
    await cv.save();

    res.json({ message: 'CV deleted successfully' });
  } catch (error) {
    console.error('Delete CV error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cv/:id/download
// @desc    Download CV as PDF (placeholder for PDF generation)
// @access  Private
router.post('/:id/download', [auth, checkDownloadLimit], async (req, res) => {
  try {
    const cv = await CV.findOne({ 
      _id: req.params.id, 
      userId: req.user._id,
      isActive: true 
    });
    
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    // Increment download count
    await cv.incrementDownloads();
    
    // Update user's monthly download count
    if (req.user.subscriptionType === 'free') {
      req.user.downloadsThisMonth += 1;
      await req.user.save();
    }

    // TODO: Implement actual PDF generation using puppeteer
    // For now, return success message
    res.json({
      message: 'PDF generation initiated',
      downloadUrl: `/api/cv/${cv._id}/pdf`, // Future implementation
      downloads: cv.downloads
    });
  } catch (error) {
    console.error('Download CV error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cv/templates
// @desc    Get available CV templates
// @access  Private
router.get('/templates/list', auth, async (req, res) => {
  try {
    const templates = [
      {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional CV layout with clean typography',
        isPremium: false,
        preview: '/templates/classic-preview.png'
      },
      {
        id: 'modern',
        name: 'Modern',
        description: 'Contemporary design with color accents',
        isPremium: true,
        preview: '/templates/modern-preview.png'
      },
      {
        id: 'creative',
        name: 'Creative',
        description: 'Eye-catching design for creative professionals',
        isPremium: true,
        preview: '/templates/creative-preview.png'
      },
      {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean and minimal design focused on content',
        isPremium: true,
        preview: '/templates/minimal-preview.png'
      }
    ];

    // Filter premium templates for free users
    const availableTemplates = templates.filter(template => 
      !template.isPremium || req.user.isPremium
    );

    res.json({
      templates: availableTemplates,
      userType: req.user.subscriptionType
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;