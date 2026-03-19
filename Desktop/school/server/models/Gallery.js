const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    images: [{
      url: {
        type: String,
        required: true
      },
      caption: {
        type: String,
        default: ''
      }
    }],
    coverImage: {
      type: String,
      required: [true, 'Cover image is required']
    },
    category: {
      type: String,
      enum: ['events', 'campus', 'achievements', 'activities', 'other'],
      default: 'other'
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    isVisible: {
      type: Boolean,
      default: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', gallerySchema);
