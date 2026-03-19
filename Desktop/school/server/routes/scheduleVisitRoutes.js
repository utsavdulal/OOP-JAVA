const express = require('express');
const ScheduleVisit = require('../models/ScheduleVisit');
const { verifyAdminToken } = require('../middleware/authMiddleware');
const { sendEmail, emailTemplates } = require('../utils/emailService');

const router = express.Router();

// Submit a schedule visit request
router.post('/schedule-visit', async (req, res) => {
  try {
    const { fullName, email, phone, program, visitDate, timeSlot, message } = req.body;

    // Validation
    if (!fullName || !email || !phone || !program || !visitDate || !timeSlot) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Check if email already has a pending request
    const existingRequest = await ScheduleVisit.findOne({
      email,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending visit request. Please wait for confirmation.' });
    }

    const scheduleVisit = new ScheduleVisit({
      fullName,
      email,
      phone,
      program,
      visitDate: new Date(visitDate),
      timeSlot,
      message: message || '',
    });

    await scheduleVisit.save();

    // Send confirmation email
    const emailContent = emailTemplates.scheduleVisitConfirmation({
      fullName,
      program,
      visitDate,
      timeSlot,
      phone,
    });

    await sendEmail(email, 'Campus Visit Request Received - Kasturi College', emailContent);

    res.status(201).json({
      message: 'Your visit has been scheduled successfully! We will contact you soon.',
      visit: scheduleVisit,
    });
  } catch (error) {
    console.error('Error scheduling visit:', error);
    res.status(500).json({ message: 'Error scheduling visit', error: error.message });
  }
});

// Get all schedule visits (Admin only)
router.get('/schedule-visits', verifyAdminToken, async (req, res) => {
  try {
    const status = req.query.status || 'all';

    let filter = {};
    if (status !== 'all') {
      filter.status = status;
    }

    const visits = await ScheduleVisit.find(filter).sort({ visitDate: -1 });
    res.json({ visits, count: visits.length });
  } catch (error) {
    console.error('Error fetching schedule visits:', error);
    res.status(500).json({ message: 'Error fetching schedule visits', error: error.message });
  }
});

// Get single schedule visit (Admin only)
router.get('/schedule-visits/:id', verifyAdminToken, async (req, res) => {
  try {
    const visit = await ScheduleVisit.findById(req.params.id);
    if (!visit) {
      return res.status(404).json({ message: 'Schedule visit not found' });
    }
    res.json({ visit });
  } catch (error) {
    console.error('Error fetching schedule visit:', error);
    res.status(500).json({ message: 'Error fetching schedule visit', error: error.message });
  }
});

// Update schedule visit status (Admin only)
router.put('/schedule-visits/:id/status', verifyAdminToken, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const visit = await ScheduleVisit.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNotes: adminNotes || undefined,
      },
      { new: true }
    );

    if (!visit) {
      return res.status(404).json({ message: 'Schedule visit not found' });
    }

    // Send status update emails
    let subject = '';
    let emailContent = '';

    if (status === 'confirmed') {
      subject = 'Campus Visit Confirmed - Kasturi College';
      emailContent = emailTemplates.visitConfirmed(visit, adminNotes);
    } else if (status === 'cancelled') {
      subject = 'Campus Visit Cancelled - Kasturi College';
      emailContent = emailTemplates.visitCancelled(visit, adminNotes);
    } else if (status === 'completed') {
      subject = 'Thank You for Visiting Kasturi College';
      emailContent = emailTemplates.visitCompleted(visit);
    }

    if (emailContent) {
      await sendEmail(visit.email, subject, emailContent);
    }

    res.json({ message: 'Status updated successfully', visit });
  } catch (error) {
    console.error('Error updating schedule visit:', error);
    res.status(500).json({ message: 'Error updating schedule visit', error: error.message });
  }
});

// Delete schedule visit (Admin only)
router.delete('/schedule-visits/:id', verifyAdminToken, async (req, res) => {
  try {
    const visit = await ScheduleVisit.findByIdAndDelete(req.params.id);
    if (!visit) {
      return res.status(404).json({ message: 'Schedule visit not found' });
    }
    res.json({ message: 'Schedule visit deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule visit:', error);
    res.status(500).json({ message: 'Error deleting schedule visit', error: error.message });
  }
});

module.exports = router;
