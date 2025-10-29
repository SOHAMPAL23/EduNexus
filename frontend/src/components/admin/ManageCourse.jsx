import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { courseAPI, lectureAPI, assignmentAPI, submissionAPI } from '../../services/api';

const ManageCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('lectures');
  const [loading, setLoading] = useState(true);

  const [lectureForm, setLectureForm] = useState({
    title: '',
    description: '',
    video: null
  });

  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxMarks: 100
  });

  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const { data } = await courseAPI.getById(id);
      setCourse(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadLecture = async (e) => {
    e.preventDefault();
    if (!lectureForm.video) {
      alert('Please select a video file');
      return;
    }

    const formData = new FormData();
    formData.append('title', lectureForm.title);
    formData.append('description', lectureForm.description);
    formData.append('courseId', id);
    formData.append('video', lectureForm.video);

    try {
      await lectureAPI.create(formData);
      alert('Lecture uploaded successfully!');
      setLectureForm({ title: '', description: '', video: null });
      fetchCourseDetails();
    } catch (error) {
      alert('Failed to upload lecture');
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      await assignmentAPI.create({ ...assignmentForm, courseId: id });
      alert('Assignment created successfully!');
      setAssignmentForm({ title: '', description: '', dueDate: '', maxMarks: 100 });
      fetchCourseDetails();
    } catch (error) {
      alert('Failed to create assignment');
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (window.confirm('Delete this lecture?')) {
      try {
        await lectureAPI.delete(lectureId);
        fetchCourseDetails();
      } catch (error) {
        alert('Failed to delete lecture');
      }
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const { data } = await submissionAPI.getAssignmentSubmissions(assignmentId);
      setSubmissions(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGradeSubmission = async (submissionId, marks, feedback) => {
    try {
      await submissionAPI.grade(submissionId, { marks, feedback });
      alert('Submission graded successfully!');
    } catch (error) {
      alert('Failed to grade submission');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-600 mb-8">{course.enrolledStudents.length} students enrolled</p>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b">
            <div className="flex gap-4 p-4">
              <button
                onClick={() => setActiveTab('lectures')}
                className={`pb-2 px-4 ${
                  activeTab === 'lectures'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                Lectures
              </button>
              <button
                onClick={() => setActiveTab('assignments')}
                className={`pb-2 px-4 ${
                  activeTab === 'assignments'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                Assignments
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'lectures' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Upload Lecture</h2>
                <form onSubmit={handleUploadLecture} className="space-y-4 mb-8">
                  <input
                    type="text"
                    placeholder="Lecture Title"
                    value={lectureForm.title}
                    onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <textarea
                    placeholder="Description"
                    value={lectureForm.description}
                    onChange={(e) => setLectureForm({ ...lectureForm, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setLectureForm({ ...lectureForm, video: e.target.files[0] })}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    Upload Lecture
                  </button>
                </form>

                <h3 className="text-xl font-bold mb-4">Existing Lectures</h3>
                <div className="space-y-4">
                  {course.lectures?.map((lecture, index) => (
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
              </div>
            )}

            {activeTab === 'assignments' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Create Assignment</h2>
                <form onSubmit={handleCreateAssignment} className="space-y-4 mb-8">
                  <input
                    type="text"
                    placeholder="Assignment Title"
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <textarea
                    placeholder="Description"
                    value={assignmentForm.description}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={assignmentForm.dueDate}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="Max Marks"
                      value={assignmentForm.maxMarks}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, maxMarks: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    Create Assignment
                  </button>
                </form>

                <h3 className="text-xl font-bold mb-4">Existing Assignments</h3>
                <div className="space-y-4">
                  {course.assignments?.map((assignment) => (
                    <div key={assignment._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{assignment.title}</h4>
                          <p className="text-gray-600 text-sm">{assignment.description}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => fetchSubmissions(assignment._id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          View Submissions
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCourse;