import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submissionAPI } from '../../services/api';

const AssignmentSubmit = () => {
  const { id } = useParams(); // This is assignmentId
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('assignmentId', id); // ✅ Make sure this matches backend expectation
    formData.append('comments', comments);

    setLoading(true);
    setError('');

    try {
      console.log('Submitting with assignmentId:', id); // Debug log
      await submissionAPI.submit(formData);
      alert('Assignment submitted successfully!');
      navigate(-1);
    } catch (err) {
      console.error('Submission error:', err.response?.data); // Debug log
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">Submit Assignment</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File *
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {file && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments (Optional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any comments about your submission..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Submitting...' : 'Submit Assignment'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmit;