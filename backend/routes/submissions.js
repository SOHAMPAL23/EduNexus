const express = require('express');
const router = express.Router();
const {
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
} = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('student'), submitAssignment);
router.get('/assignment/:assignmentId', protect, getAssignmentSubmissions);
router.put('/:id/grade', protect, authorize('instructor'), gradeSubmission);

module.exports = router;