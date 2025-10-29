const express = require('express');
const router = express.Router();
const {
  createLecture,
  getCourseLectures,
  deleteLecture,
} = require('../controllers/lectureController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('instructor'), createLecture);
router.get('/course/:courseId', protect, getCourseLectures);
router.delete('/:id', protect, authorize('instructor'), deleteLecture);

module.exports = router;