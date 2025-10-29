const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllCoursesAdmin,
  deleteCourseAdmin,
  updateUser,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/courses', getAllCoursesAdmin);
router.delete('/courses/:id', deleteCourseAdmin);
router.put('/users/:id', updateUser); 

module.exports = router;