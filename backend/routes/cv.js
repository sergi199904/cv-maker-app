const express = require('express');
const { body, validationResult } = require('express-validator');
const CV = require('../models/CV');
const User = require('../models/User');
const Template = require('../models/Template');
const { auth, requirePremium, checkDownloadLimit } = require('../middleware/auth');
const { normalizeCvPayload, validateCvPayload } = require('../utils/normalizeCvPayload');
const { generatePDF } = require('../utils/pdfGenerator');

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
  body('title').trim().notEmpty()
], async (req, res) => {
  try {
    // Normalize payload for backward compatibility
    const normalizedPayload = normalizeCvPayload(req.body);
    
    // Validate normalized payload
    const validationErrors = validateCvPayload(normalizedPayload);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
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
      ...normalizedPayload
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
  body('title').trim().notEmpty()
], async (req, res) => {
  try {
    // Normalize payload for backward compatibility
    const normalizedPayload = normalizeCvPayload(req.body);
    
    // Validate normalized payload
    const validationErrors = validateCvPayload(normalizedPayload);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
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
    Object.assign(cv, normalizedPayload);
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
// @desc    Download CV as PDF
// @access  Private
router.post('/:id/download', [auth, checkDownloadLimit], async (req, res) => {
  try {
    const cv = await CV.findOne({ 
      _id: req.params.id, 
      userId: req.user._id,
      isActive: true 
    }).populate('userId', 'firstName lastName');
    
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    // Get template name (default to classic)
    const templateName = cv.template?.toLowerCase() || 'classic';

    // Generate PDF
    const pdfBuffer = await generatePDF(cv.toObject(), templateName);

    // Increment download count
    await cv.incrementDownloads();
    
    // Update user's monthly download count
    if (req.user.subscriptionType === 'free') {
      req.user.downloadsThisMonth += 1;
      await req.user.save();
    }

    // Set response headers
    const filename = `${cv.firstName}_${cv.lastName}_CV.pdf`.replace(/\s+/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Download CV error:', error);
    res.status(500).json({ 
      message: 'Error generating PDF', 
      error: error.message 
    });
  }
});

// @route   GET /api/cv/templates/list
// @desc    Get available CV templates
// @access  Private
router.get('/templates/list', auth, async (req, res) => {
  try {
    // Fetch templates from database
    const allTemplates = await Template.find({ isActive: true }).sort({ isPremium: 1, name: 1 });
    
    // Filter premium templates for free users
    const availableTemplates = allTemplates.filter(template => 
      !template.isPremium || req.user.isPremium
    );

    res.json({
      templates: availableTemplates,
      userType: req.user.subscriptionType,
      total: allTemplates.length,
      available: availableTemplates.length
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;