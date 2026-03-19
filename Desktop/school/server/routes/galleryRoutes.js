const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Gallery = require('../models/Gallery');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads/gallery';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, PNG, and WEBP files are allowed'), false);
    }
  }
});

// Helper function to delete file
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Get all gallery images (public)
router.get('/', async (req, res) => {
  try {
    const galleries = await Gallery.find({ isVisible: true })
      .populate('uploadedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: galleries.length,
      galleries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery images.',
      error: error.message,
    });
  }
});

// Get gallery by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const galleries = await Gallery.find({ 
      category, 
      isVisible: true 
    })
      .populate('uploadedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: galleries.length,
      galleries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery images by category.',
      error: error.message,
    });
  }
});

// Create new gallery collection (admin only)
router.post('/', authMiddleware, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title) {
      // Clean up uploaded file if validation fails
      if (req.file) deleteFile(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Title is required.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Cover image is required.',
      });
    }

    // Store relative path for the database
    const coverImageUrl = `/uploads/gallery/${req.file.filename}`;

    const gallery = new Gallery({
      title,
      description: description || '',
      coverImage: coverImageUrl,
      images: [], // Start with empty images array
      category: category || 'other',
      uploadedBy: req.admin.id,
    });

    await gallery.save();

    res.status(201).json({
      success: true,
      message: 'Gallery collection created successfully.',
      gallery,
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) deleteFile(req.file.path);
    res.status(500).json({
      success: false,
      message: 'Error creating gallery collection.',
      error: error.message,
    });
  }
});

// Update gallery collection (admin only)
router.put('/:id', authMiddleware, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, description, category, isVisible } = req.body;

    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      // Clean up uploaded file if no gallery found
      if (req.file) deleteFile(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Gallery collection not found.',
      });
    }

    const updateData = {
      title: title || gallery.title,
      description: description !== undefined ? description : gallery.description,
      category: category || gallery.category,
      isVisible: isVisible !== undefined ? isVisible : gallery.isVisible,
    };

    // If a new cover image is uploaded, update it and delete the old one
    if (req.file) {
      const newCoverImageUrl = `/uploads/gallery/${req.file.filename}`;

      // Delete old cover image file
      if (gallery.coverImage) {
        const oldFilePath = gallery.coverImage.replace('/uploads/', 'uploads/');
        deleteFile(oldFilePath);
      }

      updateData.coverImage = newCoverImageUrl;
    }

    const updatedGallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Gallery collection updated successfully.',
      gallery: updatedGallery,
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) deleteFile(req.file.path);
    res.status(500).json({
      success: false,
      message: 'Error updating gallery collection.',
      error: error.message,
    });
  }
});

// Delete gallery collection (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery collection not found.',
      });
    }

    // Delete cover image file
    if (gallery.coverImage) {
      const coverImagePath = gallery.coverImage.replace('/uploads/', 'uploads/');
      deleteFile(coverImagePath);
    }

    // Delete all photos in the collection
    if (gallery.images && gallery.images.length > 0) {
      gallery.images.forEach(image => {
        if (image.url) {
          const imagePath = image.url.replace('/uploads/', 'uploads/');
          deleteFile(imagePath);
        }
      });
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Gallery collection deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting gallery collection.',
      error: error.message,
    });
  }
});

// Upload photos to a gallery collection (admin only)
router.post('/:id/photos', authMiddleware, upload.array('photos', 20), async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      // Clean up uploaded files if gallery not found
      if (req.files) {
        req.files.forEach(file => deleteFile(file.path));
      }
      return res.status(404).json({
        success: false,
        message: 'Gallery collection not found.',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No photos uploaded.',
      });
    }

    // Process uploaded files and add to gallery images
    const newImages = req.files.map(file => ({
      url: `/uploads/gallery/${file.filename}`,
      caption: '', // Optional caption can be added later
      uploadedAt: new Date()
    }));

    // Add new images to the existing images array
    gallery.images = [...gallery.images, ...newImages];
    await gallery.save();

    res.status(200).json({
      success: true,
      message: `${newImages.length} photos uploaded successfully.`,
      gallery,
      newImages
    });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => deleteFile(file.path));
    }
    res.status(500).json({
      success: false,
      message: 'Error uploading photos.',
      error: error.message,
    });
  }
});

// Delete a single photo from gallery collection (admin only)
router.delete('/:id/photos/:photoId', authMiddleware, async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery collection not found.',
      });
    }

    const photoIndex = gallery.images.findIndex(img => img._id.toString() === req.params.photoId);

    if (photoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found in this gallery.',
      });
    }

    // Delete the physical file
    const photoToDelete = gallery.images[photoIndex];
    if (photoToDelete.url) {
      const imagePath = photoToDelete.url.replace('/uploads/', 'uploads/');
      deleteFile(imagePath);
    }

    // Remove photo from gallery images array
    gallery.images.splice(photoIndex, 1);
    await gallery.save();

    res.status(200).json({
      success: true,
      message: 'Photo deleted successfully.',
      gallery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting photo.',
      error: error.message,
    });
  }
});

module.exports = router;
