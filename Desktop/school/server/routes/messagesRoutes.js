const express = require('express');
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all contact messages (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching messages.',
      error: error.message,
    });
  }
});

// Get unread messages count
router.get('/count/unread', authMiddleware, async (req, res) => {
  try {
    const count = await Contact.countDocuments({ isRead: false });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count.',
      error: error.message,
    });
  }
});

// Get message by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found.',
      });
    }

    // Mark as read
    if (!message.isRead) {
      message.isRead = true;
      await message.save();
    }

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching message.',
      error: error.message,
    });
  }
});

// Mark message as read
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message marked as read.',
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking message as read.',
      error: error.message,
    });
  }
});

// Delete message
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting message.',
      error: error.message,
    });
  }
});

module.exports = router;
