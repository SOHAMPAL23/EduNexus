import { createContext, useState, useEffect, useContext } from 'react';
import { courseAPI } from '../services/api';
import { AuthContext } from './AuthContext';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all courses
  const fetchCourses = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await courseAPI.getAll(filters);
      setCourses(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch enrolled courses (for students)
  const fetchEnrolledCourses = async () => {
    if (!user || user.role !== 'student') return;
    
    try {
      setLoading(true);
      const { data } = await courseAPI.getEnrolled();
      setEnrolledCourses(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch enrolled courses');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch instructor courses (for instructors)
  const fetchInstructorCourses = async () => {
    if (!user || user.role !== 'instructor') return;
    
    try {
      setLoading(true);
      const { data } = await courseAPI.getInstructorCourses();
      setInstructorCourses(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch instructor courses');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single course
  const getCourse = async (id) => {
    try {
      setLoading(true);
      const { data } = await courseAPI.getById(id);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch course');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create course (instructor)
  const createCourse = async (courseData) => {
    try {
      setLoading(true);
      const { data } = await courseAPI.create(courseData);
      setInstructorCourses([...instructorCourses, data]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update course (instructor)
  const updateCourse = async (id, courseData) => {
    try {
      setLoading(true);
      const { data } = await courseAPI.update(id, courseData);
      setInstructorCourses(
        instructorCourses.map(c => c._id === id ? data : c)
      );
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update course');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete course (instructor)
  const deleteCourse = async (id) => {
    try {
      setLoading(true);
      await courseAPI.delete(id);
      setInstructorCourses(instructorCourses.filter(c => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete course');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Enroll in course (student)
  const enrollInCourse = async (id) => {
    try {
      setLoading(true);
      const { data } = await courseAPI.enroll(id);
      setEnrolledCourses([...enrolledCourses, data.course]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enroll in course');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if user is enrolled in a course
  const isEnrolled = (courseId) => {
    return enrolledCourses.some(c => c._id === courseId);
  };

  // Load initial data based on user role
  useEffect(() => {
    if (user) {
      if (user.role === 'student') {
        fetchEnrolledCourses();
      } else if (user.role === 'instructor') {
        fetchInstructorCourses();
      }
    }
  }, [user]);

  const value = {
    courses,
    enrolledCourses,
    instructorCourses,
    loading,
    error,
    fetchCourses,
    fetchEnrolledCourses,
    fetchInstructorCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollInCourse,
    isEnrolled,
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

// Custom hook to use course context
export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};
