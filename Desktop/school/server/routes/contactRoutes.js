const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');

const router = express.Router();

// POST /api/v1/contact
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone').optional().trim(),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const contact = await Contact.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Thank you for contacting us! We will get back to you soon.',
        data: { id: contact._id },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong. Please try again later.',
      });
    }
  }
);

module.exports = router;
