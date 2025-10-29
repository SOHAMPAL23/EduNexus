const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getCourseAssignments,
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('instructor'), createAssignment);
router.get('/course/:courseId', protect, getCourseAssignments);

module.exports = router;