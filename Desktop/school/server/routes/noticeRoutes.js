const express = require('express');
const Notice = require('../models/Notice');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all visible notices (public)
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find({ isVisible: true })
      .populate('postedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notices.length,
      notices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notices.',
      error: error.message,
    });
  }
});

// Get notices by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const notices = await Notice.find({ 
      category, 
      isVisible: true 
    })
      .populate('postedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notices.length,
      notices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notices by category.',
      error: error.message,
    });
  }
});

// Create new notice (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, category, targetAudience, attachmentUrl, expiryDate } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required.',
      });
    }

    const notice = new Notice({
      title,
      content,
      category: category || 'general',
      targetAudience: targetAudience || 'all',
      postedBy: req.admin.id,
      attachmentUrl: attachmentUrl || null,
      expiryDate: expiryDate || null,
    });

    await notice.save();

    res.status(201).json({
      success: true,
      message: 'Notice posted successfully.',
      notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating notice.',
      error: error.message,
    });
  }
});

// Update notice (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, content, category, targetAudience, attachmentUrl, isVisible, expiryDate } = req.body;

    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      {
        title: title || undefined,
        content: content || undefined,
        category: category || undefined,
        targetAudience: targetAudience || undefined,
        attachmentUrl: attachmentUrl || undefined,
        isVisible: isVisible !== undefined ? isVisible : undefined,
        expiryDate: expiryDate || undefined,
      },
      { new: true, runValidators: true }
    );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notice updated successfully.',
      notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notice.',
      error: error.message,
    });
  }
});

// Delete notice (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notice deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting notice.',
      error: error.message,
    });
  }
});

module.exports = router;
