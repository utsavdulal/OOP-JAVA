const express = require('express');
const Announcement = require('../models/Announcement');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all active announcements (public)
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching announcements.',
      error: error.message,
    });
  }
});

// Get announcements by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const announcements = await Announcement.find({ 
      category, 
      isActive: true 
    })
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching announcements by category.',
      error: error.message,
    });
  }
});

// Create new announcement (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, category, priority, expiryDate } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required.',
      });
    }

    const announcement = new Announcement({
      title,
      content,
      category: category || 'general',
      priority: priority || 'medium',
      createdBy: req.admin.id,
      expiryDate: expiryDate || null,
    });

    await announcement.save();

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully.',
      announcement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating announcement.',
      error: error.message,
    });
  }
});

// Update announcement (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, content, category, priority, isActive, expiryDate } = req.body;

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      {
        title: title || undefined,
        content: content || undefined,
        category: category || undefined,
        priority: priority || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        expiryDate: expiryDate || undefined,
      },
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully.',
      announcement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating announcement.',
      error: error.message,
    });
  }
});

// Delete announcement (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting announcement.',
      error: error.message,
    });
  }
});

module.exports = router;
