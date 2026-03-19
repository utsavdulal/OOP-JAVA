const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const GalleryImage = require('../models/GalleryImage');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed MIME types for images
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Multer config with validation
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate safe filename - sanitize original name
    const sanitized = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '_')
      .replace(/_{2,}/g, '_');
    const random = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(sanitized);
    cb(null, `${random}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only images are allowed.'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});

router.get('/', async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ uploadedAt: -1 });
    res.json(images);
  } catch (err) {
    console.error('Error fetching gallery:', err);
    res.status(500).json({ message: 'Error fetching gallery' });
  }
});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }
    
    const newImage = new GalleryImage({
      title,
      description,
      imageUrl: '/uploads/' + req.file.filename
    });
    
    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    
    // Delete file from disk - with path traversal protection
    const filePath = path.join(__dirname, '..', image.imageUrl);
    const realPath = path.resolve(filePath);
    const uploadDirResolved = path.resolve(uploadDir);
    
    // Ensure the file is within uploads directory
    if (!realPath.startsWith(uploadDirResolved)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (fs.existsSync(realPath)) {
      fs.unlinkSync(realPath);
    }
    
    await GalleryImage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ message: 'Error deleting image' });
  }
});

module.exports = router;
