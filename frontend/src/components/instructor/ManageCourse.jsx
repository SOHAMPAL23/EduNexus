import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { courseAPI, lectureAPI, assignmentAPI } from '../../services/api';
import UploadLecture from './UploadLecture';
import CreateAssignment from './CreateAssignment';
import ViewSubmissions from './ViewSubmissions';

const ManageCourse = ({ course, onBack, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    category: course.category,
    level: course.level,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await courseAPI.update(course._id, formData);
      onUpdate(response.data);
      setIsEditing(false);
      alert('Course updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await courseAPI.delete(course._id);
        onDelete(course._id);
        alert('Course deleted successfully!');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete course');
      }
    }
  };

  const handleTogglePublish = async () => {
    try {
      const newStatus = !course.isPublished;
      await courseAPI.update(course._id, { isPublished: newStatus });
      alert(`Course ${newStatus ? 'published' : 'unpublished'} successfully!`);
      refreshCourse();
    } catch (err) {
      setError('Failed to toggle publish status');
    }
  };

  const refreshCourse = async () => {
    try {
      const response = await courseAPI.getById(course._id);
      onUpdate(response.data);
    } catch (err) {
      console.error('Failed to refresh course:', err);
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (window.confirm('Delete this lecture?')) {
      try {
        await lectureAPI.delete(lectureId);
        alert('Lecture deleted successfully!');
        refreshCourse();
      } catch (error) {
        alert('Failed to delete lecture');
      }
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Delete this assignment?')) {
      try {
        await assignmentAPI.delete(assignmentId);
        alert('Assignment deleted successfully!');
        refreshCourse();
      } catch (error) {
        alert('Failed to delete assignment');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="mt-2 opacity-90">
              {course.category} • {course.level} • 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                course.isPublished ? 'bg-green-500' : 'bg-yellow-500'
              }`}>
                {course.isPublished ? '✓ Published' : '⚠ Unpublished'}
              </span>
            </p>
          </div>

          {error && (
            <div className="m-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'content'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'submissions'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Submissions
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                      Level *
                    </label>
                    <select
                      id="level"
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Updating...' : 'Update Course'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <p className="text-gray-700 mb-6">{course.description}</p>
                  
                  <div className="mb-6">
                    <Link
                      to={`/chat/${course._id}`}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 inline-flex items-center space-x-2"
                    >
                      <span>💬</span>
                      <span>Open Course Chat</span>
                    </Link>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Edit Course
                    </button>

                    <button
                      onClick={handleTogglePublish}
                      className={`px-4 py-2 rounded flex items-center space-x-2 ${
                        course.isPublished 
                          ? 'bg-yellow-600 hover:bg-yellow-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white`}
                    >
                      {course.isPublished ? (
                        <>
                          <span>📕</span>
                          <span>Unpublish Course</span>
                        </>
                      ) : (
                        <>
                          <span>📗</span>
                          <span>Publish Course</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleDelete}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center space-x-2"
                    >
                      <Trash2 size={16} />
                      <span>Delete Course</span>
                    </button>
                  </div>
                </div>
              )
            )}

            {/* CONTENT TAB */}
            {activeTab === 'content' && (
              <div className="space-y-8">
                {/* Upload Lecture Section */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">Upload Lecture</h2>
                  <UploadLecture 
                    courseId={course._id} 
                    onLectureUploaded={refreshCourse}
                  />
                </div>

                {/* Create Assignment Section */}
                <div className="border-t pt-8">
                  <h2 className="text-2xl font-bold mb-4">Create Assignment</h2>
                  <CreateAssignment 
                    courseId={course._id}
                    onAssignmentCreated={refreshCourse}
                  />
                </div>

                {/* Existing Lectures List */}
                <div className="border-t pt-8">
                  <h3 className="text-xl font-bold mb-4">Existing Lectures</h3>
                  {course.lectures && course.lectures.length > 0 ? (
                    <div className="space-y-4">
                      {course.lectures.map((lecture, index) => (
                        <div key={lecture._id} className="border rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{index + 1}. {lecture.title}</h4>
                            <p className="text-gray-600 text-sm">{lecture.description}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteLecture(lecture._id)}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No lectures uploaded yet</p>
                  )}
                </div>

                {/* Existing Assignments List */}
                <div className="border-t pt-8">
                  <h3 className="text-xl font-bold mb-4">Existing Assignments</h3>
                  {course.assignments && course.assignments.length > 0 ? (
                    <div className="space-y-4">
                      {course.assignments.map((assignment) => (
                        <div key={assignment._id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{assignment.title}</h4>
                              <p className="text-gray-600 text-sm">{assignment.description}</p>
                              <p className="text-sm text-gray-500 mt-2">
                                Due: {new Date(assignment.dueDate).toLocaleDateString()} • Max Marks: {assignment.maxMarks}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteAssignment(assignment._id)}
                              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No assignments created yet</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <ViewSubmissions courseId={course._id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCourse;