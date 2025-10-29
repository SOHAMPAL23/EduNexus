import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseAPI, lectureAPI, assignmentAPI } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState('lectures');
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const { data } = await courseAPI.getById(id);
      setCourse(data);
      
      const isUserEnrolled = data.enrolledStudents.some(
        studentId => studentId === user?._id || studentId._id === user?._id
      );
      setEnrolled(isUserEnrolled);
      
      if (isUserEnrolled) {
        const [lecturesRes, assignmentsRes] = await Promise.all([
          lectureAPI.getCourseLectures(id),
          assignmentAPI.getCourseAssignments(id)
        ]);
        
        setLectures(lecturesRes.data.lectures || lecturesRes.data);
        setAssignments(assignmentsRes.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      await courseAPI.enroll(id);
      setEnrolled(true);
      alert('Enrolled successfully!');
      fetchCourseDetails();
    } catch (error) {
      alert(error.response?.data?.message || 'Enrollment failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return <div className="text-center py-12">Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {course.title}
            </h1>
            <p className="text-gray-600 mb-6">{course.description}</p>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-700">
                <strong>Instructor:</strong> {course.instructor?.name}
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                {course.level}
              </span>
              {course.category && (
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded">
                  {course.category}
                </span>
              )}
            </div>

            {user?.role === 'student' && !enrolled && (
              <button
                onClick={handleEnroll}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                Enroll Now
              </button>
            )}

            {enrolled && (
              <div className="flex gap-4">
                <Link
                  to={`/chat/${course._id}`}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <span>💬</span>
                  <span>Join Course Chat</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {enrolled && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="border-b mb-6">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('lectures')}
                  className={`pb-2 px-4 ${
                    activeTab === 'lectures'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  Lectures ({lectures.length})
                </button>
                <button
                  onClick={() => setActiveTab('assignments')}
                  className={`pb-2 px-4 ${
                    activeTab === 'assignments'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  Assignments ({assignments.length})
                </button>
              </div>
            </div>

            {activeTab === 'lectures' && (
              <div className="space-y-4">
                {lectures.length === 0 ? (
                  <p className="text-gray-600">No lectures available yet</p>
                ) : (
                  lectures.map((lecture, index) => (
                    <div key={lecture._id} className="border rounded-lg p-4 hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {index + 1}. {lecture.title}
                          </h3>
                          <p className="text-gray-600 text-sm">{lecture.description}</p>
                        </div>
                        <a
                          href={lecture.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Watch
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-4">
                {assignments.length === 0 ? (
                  <p className="text-gray-600">No assignments available yet</p>
                ) : (
                  assignments.map((assignment) => (
                    <div key={assignment._id} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">{assignment.title}</h3>
                      <p className="text-gray-600 mb-4">{assignment.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                        <Link
                          to={`/assignment/${assignment._id}/submit`}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Submit
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;