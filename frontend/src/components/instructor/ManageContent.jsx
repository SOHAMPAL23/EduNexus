import { useState } from 'react';
import { assignmentAPI, lectureAPI } from '../../services/api';

const ManageContent = ({ courseId, onContentAdded }) => {
  const [contentType, setContentType] = useState('lecture');
  const [lectureForm, setLectureForm] = useState({
    title: '',
    description: '',
    order: 0,
  });
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxMarks: 100,
  });
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const handleLectureSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    setUploading(true);
    setError('');

    const data = new FormData();
    data.append('title', lectureForm.title);
    data.append('description', lectureForm.description);
    data.append('order', lectureForm.order);
    data.append('courseId', courseId);
    data.append('video', videoFile);

    try {
      await lectureAPI.create(data, (progress) => setUploadProgress(progress));
      alert('Lecture uploaded successfully!');
      setLectureForm({ title: '', description: '', order: 0 });
      setVideoFile(null);
      e.target.reset();
      if (onContentAdded) onContentAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload lecture');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      await assignmentAPI.create({ ...assignmentForm, courseId });
      alert('Assignment created successfully!');
      setAssignmentForm({ title: '', description: '', dueDate: '', maxMarks: 100 });
      if (onContentAdded) onContentAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create assignment');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toggle Buttons */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setContentType('lecture')}
          className={`pb-2 px-4 ${
            contentType === 'lecture'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Upload Lecture
        </button>
        <button
          onClick={() => setContentType('assignment')}
          className={`pb-2 px-4 ${
            contentType === 'assignment'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Create Assignment
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Lecture Form */}
      {contentType === 'lecture' && (
        <form onSubmit={handleLectureSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lecture Title *
            </label>
            <input
              type="text"
              value={lectureForm.title}
              onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={lectureForm.description}
              onChange={(e) => setLectureForm({ ...lectureForm, description: e.target.value })}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video File * (Max 500MB)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {uploading && (
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-blue-700">Uploading...</span>
                <span className="text-sm font-bold text-blue-700">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {uploading ? `Uploading... ${uploadProgress}%` : 'Upload Lecture'}
          </button>
        </form>
      )}

      {/* Assignment Form */}
      {contentType === 'assignment' && (
        <form onSubmit={handleAssignmentSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Title *
            </label>
            <input
              type="text"
              value={assignmentForm.title}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={assignmentForm.description}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
              required
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={assignmentForm.dueDate}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Marks
              </label>
              <input
                type="number"
                value={assignmentForm.maxMarks}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, maxMarks: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {uploading ? 'Creating...' : 'Create Assignment'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ManageContent;