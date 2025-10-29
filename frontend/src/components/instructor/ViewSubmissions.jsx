import { useState, useEffect } from 'react';
import { submissionAPI, assignmentAPI } from '../../services/api'; // ✅ Added assignmentAPI

const ViewSubmissions = ({ courseId }) => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeForm, setGradeForm] = useState({ marks: '', feedback: '' });

  useEffect(() => {
    if (courseId) fetchAssignments();
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const { data } = await assignmentAPI.getCourseAssignments(courseId);
      setAssignments(data);
      if (data.length > 0) {
        setSelectedAssignment(data[0]._id);
        fetchSubmissions(data[0]._id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setLoading(false);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      setLoading(true);
      const { data } = await submissionAPI.getAssignmentSubmissions(assignmentId);
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentChange = (assignmentId) => {
    setSelectedAssignment(assignmentId);
    fetchSubmissions(assignmentId);
  };

  const handleGrade = async (submissionId) => {
    try {
      await submissionAPI.grade(submissionId, gradeForm);
      alert('✅ Submission graded successfully!');
      setGradingSubmission(null);
      setGradeForm({ marks: '', feedback: '' });
      fetchSubmissions(selectedAssignment);
    } catch (error) {
      console.error('Failed to grade submission:', error);
      alert('❌ Failed to grade submission');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-600">No assignments created yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Assignment Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Assignment
        </label>
        <select
          value={selectedAssignment || ''}
          onChange={(e) => handleAssignmentChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {assignments.map((assignment) => (
            <option key={assignment._id} value={assignment._id}>
              {assignment.title}
            </option>
          ))}
        </select>
      </div>

      {/* Submissions List */}
      <h2 className="text-2xl font-bold">Submissions</h2>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">No submissions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{submission.student.name}</h3>
                  <p className="text-sm text-gray-600">{submission.student.email}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Submitted: {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                  {submission.comments && (
                    <p className="text-sm text-gray-700 mt-2">
                      <strong>Comments:</strong> {submission.comments}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  {/* ✅ Fixed View Submission button */}
                  <a
                    href={submission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block mb-2"
                  >
                    View Submission
                  </a>

                  {submission.marks !== undefined ? (
                    <div className="mt-2">
                      <p className="font-semibold text-green-600">
                        Marks: {submission.marks}
                      </p>
                      {submission.feedback && (
                        <p className="text-sm text-gray-600 mt-1">{submission.feedback}</p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setGradingSubmission(submission._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
                    >
                      Grade
                    </button>
                  )}
                </div>
              </div>

              {gradingSubmission === submission._id && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <h4 className="font-semibold mb-3">Grade Submission</h4>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Marks"
                      value={gradeForm.marks}
                      onChange={(e) =>
                        setGradeForm({ ...gradeForm, marks: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded"
                    />
                    <textarea
                      placeholder="Feedback"
                      value={gradeForm.feedback}
                      onChange={(e) =>
                        setGradeForm({ ...gradeForm, feedback: e.target.value })
                      }
                      rows="3"
                      className="w-full px-3 py-2 border rounded"
                    />
                    <div className="flex gap-2">
                      <button
                        disabled={!gradeForm.marks}
                        onClick={() => handleGrade(submission._id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        Submit Grade
                      </button>
                      <button
                        onClick={() => setGradingSubmission(null)}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewSubmissions;
