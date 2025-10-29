const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  getInstructorCourses,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getEnrolledCourses,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getCourses)
  .post(protect, authorize('instructor'), createCourse);

router.get('/instructor/my-courses', protect, authorize('instructor'), getInstructorCourses);
router.get('/enrolled', protect, authorize('student'), getEnrolledCourses);
router.post('/:id/enroll', protect, authorize('student'), enrollCourse);

router.route('/:id')
  .get(getCourseById)
  .put(protect, authorize('instructor'), updateCourse)
  .delete(protect, authorize('instructor'), deleteCourse);

module.exports = router;