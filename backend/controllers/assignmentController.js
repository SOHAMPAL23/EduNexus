const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, courseId, dueDate, maxMarks } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course || course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const assignment = await Assignment.create({
      title,
      description,
      course: courseId,
      dueDate,
      maxMarks,
      createdBy: req.user._id,
    });

    course.assignments.push(assignment._id);
    await course.save();

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId })
      .sort({ createdAt: -1 });
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};