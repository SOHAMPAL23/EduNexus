const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

const uploadToCloudinary = async (file, folder, resourceType = 'auto') => {
  try {
    if (!file || !file.tempFilePath) {
      throw new Error('No file provided');
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: folder,
      resource_type: resourceType,
      ...(resourceType === 'image' && {
        transformation: [
          { width: 1200, height: 630, crop: 'limit' },
          { quality: 'auto' }
        ]
      })
    });

    fs.unlinkSync(file.tempFilePath);

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      duration: result.duration, 
      width: result.width,
      height: result.height,
      bytes: result.bytes
    };
  } catch (error) {
    if (file && file.tempFilePath && fs.existsSync(file.tempFilePath)) {
      fs.unlinkSync(file.tempFilePath);
    }
    throw error;
  }
};

const uploadVideo = async (file, folder = 'courses/lectures') => {
  try {
    return await uploadToCloudinary(file, folder, 'video');
  } catch (error) {
    throw new Error(`Video upload failed: ${error.message}`);
  }
};

const uploadImage = async (file, folder = 'courses/thumbnails') => {
  try {
    return await uploadToCloudinary(file, folder, 'image');
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

const uploadDocument = async (file, folder = 'assignments/submissions') => {
  try {
    return await uploadToCloudinary(file, folder, 'raw');
  } catch (error) {
    throw new Error(`Document upload failed: ${error.message}`);
  }
};

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};

const validateFileType = (file, allowedTypes) => {
  if (!file) {
    throw new Error('No file provided');
  }

  const fileExt = path.extname(file.name).toLowerCase();
  const mimeType = file.mimetype;

  const isValidExt = allowedTypes.extensions.includes(fileExt);
  const isValidMime = allowedTypes.mimeTypes.includes(mimeType);

  if (!isValidExt || !isValidMime) {
    throw new Error(
      `Invalid file type. Allowed types: ${allowedTypes.extensions.join(', ')}`
    );
  }

  return true;
};

const validateFileSize = (file, maxSizeInMB) => {
  if (!file) {
    throw new Error('No file provided');
  }

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (file.size > maxSizeInBytes) {
    throw new Error(`File size exceeds ${maxSizeInMB}MB limit`);
  }

  return true;
};

const ALLOWED_TYPES = {
  video: {
    extensions: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm'],
    mimeTypes: [
      'video/mp4',
      'video/avi',
      'video/quicktime',
      'video/x-ms-wmv',
      'video/x-flv',
      'video/x-matroska',
      'video/webm'
    ]
  },
  image: {
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ]
  },
  document: {
    extensions: ['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx', '.xls', '.xlsx'],
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  }
};
module.exports = {
  uploadVideo,
  uploadImage,
  uploadDocument,
  deleteFromCloudinary,
  validateFileType,
  validateFileSize,
  ALLOWED_TYPES
};