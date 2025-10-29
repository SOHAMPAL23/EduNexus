const Lecture = require('../models/Lecture');
const Course = require('../models/Course');
const cloudinary = require('../config/cloudinary');

exports.createLecture = async (req, res) => {
  try {
    // Debug logs
    console.log('=== CREATE LECTURE REQUEST ===');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('User:', req.user ? req.user._id : 'No user');
    console.log('===========================');

    // Check if request has files
    if (!req.files) {
      return res.status(400).json({ 
        success: false,
        message: 'No files were uploaded' 
      });
    }

    // Check if video file exists
    if (!req.files.video) {
      return res.status(400).json({ 
        success: false,
        message: 'Video file is required',
        receivedFiles: Object.keys(req.files)
      });
    }

    // Get form fields
    const title = req.body.title;
    const description = req.body.description || '';
    const courseId = req.body.courseId;
    const order = req.body.order || 0;

    // Validation
    if (!title) {
      return res.status(400).json({ 
        success: false,
        message: 'Title is required' 
      });
    }

    if (!courseId) {
      return res.status(400).json({ 
        success: false,
        message: 'Course ID is required' 
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    // Check authorization
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to add lectures to this course' 
      });
    }

    const videoFile = req.files.video;

    // Validate file type
    console.log('Video file type:', videoFile.mimetype);
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(videoFile.mimetype)) {
      return res.status(400).json({ 
        success: false,
        message: `Invalid video format: ${videoFile.mimetype}. Allowed: MP4, AVI, MOV, WMV, WEBM` 
      });
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024;
    if (videoFile.size > maxSize) {
      return res.status(400).json({ 
        success: false,
        message: `Video file size (${(videoFile.size / (1024 * 1024)).toFixed(2)}MB) exceeds 500MB limit` 
      });
    }

    console.log('Uploading to Cloudinary...');
    console.log('File path:', videoFile.tempFilePath);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(videoFile.tempFilePath, {
      folder: 'edunexus/lectures',
      resource_type: 'video',
      chunk_size: 6000000,
      timeout: 600000, // 10 minutes
    });

    console.log('Cloudinary upload successful!');
    console.log('Video URL:', result.secure_url);

    // Create lecture
    const lecture = await Lecture.create({
      title,
      description,
      videoUrl: result.secure_url,
      duration: result.duration || 0,
      course: courseId,
      order: parseInt(order),
    });

    // Add lecture to course
    course.lectures.push(lecture._id);
    await course.save();

    console.log('Lecture created successfully:', lecture._id);

    res.status(201).json({
      success: true,
      message: 'Lecture created successfully',
      lecture
    });

  } catch (error) {
    console.error('❌ Create lecture error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create lecture',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getCourseLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({ course: req.params.courseId })
      .sort({ order: 1, createdAt: 1 });
    
    res.json({
      success: true,
      count: lectures.length,
      lectures
    });
  } catch (error) {
    console.error('Get lectures error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch lectures',
      error: error.message 
    });
  }
};

exports.deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    
    if (!lecture) {
      return res.status(404).json({ 
        success: false,
        message: 'Lecture not found' 
      });
    }

    const course = await Course.findById(lecture.course);
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized' 
      });
    }

    // Remove from course
    await Course.findByIdAndUpdate(
      lecture.course,
      { $pull: { lectures: lecture._id } }
    );

    await lecture.deleteOne();

    res.json({
      success: true,
      message: 'Lecture deleted successfully'
    });
  } catch (error) {
    console.error('Delete lecture error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete lecture',
      error: error.message 
    });
  }
};