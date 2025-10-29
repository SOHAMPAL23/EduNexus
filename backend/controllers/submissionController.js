const Submission = require('../models/Submission');
const cloudinary = require('../config/cloudinary');

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, comments } = req.body;

    console.log('Received submission:', { assignmentId, comments, files: req.files }); // Debug

    if (!assignmentId) {
      return res.status(400).json({ 
        success: false,
        message: 'Assignment ID is required' 
      });
    }

    if (!req.files?.file) {
      return res.status(400).json({ 
        success: false,
        message: 'File is required' 
      });
    }

    const result = await cloudinary.uploader.upload(req.files.file.tempFilePath, {
      folder: 'submissions',
      resource_type: 'auto',
    });

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user._id,
      fileUrl: result.secure_url,
      comments: comments || '',
    });

    res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully',
      submission
    });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.assignmentId })
      .populate('student', 'name email')
      .sort({ submittedAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { marks, feedback } = req.body;
    
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { marks, feedback },
      { new: true }
    ).populate('student', 'name email');

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};