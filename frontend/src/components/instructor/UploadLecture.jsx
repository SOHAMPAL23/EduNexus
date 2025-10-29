import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lectureAPI } from '../../services/api';

const UploadLecture = ({ courseId: propCourseId, onLectureUploaded }) => {
  const { courseId: paramCourseId } = useParams();
  const navigate = useNavigate();
  const courseId = propCourseId || paramCourseId;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0,
  });
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      e.target.value = '';
      return;
    }
    
    if (file.size > 500 * 1024 * 1024) {
      setError('Video file must be less than 500MB');
      e.target.value = '';
      return;
    }

    setVideoFile(file);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    if (!courseId) {
      setError('Missing courseId — cannot upload lecture');
      return;
    }

    setUploading(true);
    setError('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('order', formData.order);
    data.append('courseId', courseId);
    data.append('video', videoFile);

    try {
      await lectureAPI.create(data, (progress) => {
        setUploadProgress(progress);
      });
      
      alert('Lecture uploaded successfully!');
      
      if (onLectureUploaded) {
        onLectureUploaded();
      }
      
      navigate(`/instructor/course/${courseId}/manage`, { 
        state: { refresh: true } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload lecture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Upload Lecture</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lecture Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order/Position
          </label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min="0"
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
            onChange={handleFileChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {videoFile && (
            <p className="text-sm text-green-600 mt-2">
              Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
            </p>
          )}
        </div>

        {uploading && (
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-700">Uploading...</span>
              <span className="text-sm font-bold text-blue-700">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {uploading ? `Uploading... ${uploadProgress}%` : 'Upload Lecture'}
        </button>
      </form>
    </div>
  );
};

export default UploadLecture;