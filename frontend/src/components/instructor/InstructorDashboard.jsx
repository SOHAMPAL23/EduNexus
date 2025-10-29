import { useState, useEffect } from 'react';
import { courseAPI } from '../../services/api';
import CreateCourse from './CreateCourse';
import ManageCourse from './ManageCourse';
import { Plus, BookOpen } from 'lucide-react';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await courseAPI.getInstructorCourses();
      setCourses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
      console.error('Fetch courses error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseCreated = (newCourse) => {
    setCourses([...courses, newCourse]);
    setShowCreateCourse(false);
  };

  const handleCourseUpdated = (updatedCourse) => {
    setCourses(courses.map(c => c._id === updatedCourse._id ? updatedCourse : c));
    setSelectedCourse(null);
    fetchCourses(); // Refresh to get updated data
  };

  const handleCourseDeleted = (courseId) => {
    setCourses(courses.filter(c => c._id !== courseId));
    setSelectedCourse(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <ManageCourse
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
        onUpdate={handleCourseUpdated}
        onDelete={handleCourseDeleted}
      />
    );
  }

  if (showCreateCourse) {
    return (
      <CreateCourse
        onBack={() => setShowCreateCourse(false)}
        onCourseCreated={handleCourseCreated}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <button
            onClick={() => setShowCreateCourse(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            <span>Create Course</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses yet</h3>
            <p className="text-gray-500 mb-6">Create your first course to get started</p>
            <button
              onClick={() => setShowCreateCourse(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedCourse(course)}
              >
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <BookOpen size={64} className="text-white opacity-80" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{course.enrolledStudents?.length || 0} students</span>
                    <span>{course.lectures?.length || 0} lectures</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;