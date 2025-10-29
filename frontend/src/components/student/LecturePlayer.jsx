import { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

const LecturePlayer = ({ lecture }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (videoRef) {
      const handleTimeUpdate = () => setCurrentTime(videoRef.currentTime);
      const handleLoadedMetadata = () => setDuration(videoRef.duration);
      const handleEnded = () => setIsPlaying(false);

      videoRef.addEventListener('timeupdate', handleTimeUpdate);
      videoRef.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoRef.addEventListener('ended', handleEnded);

      return () => {
        videoRef.removeEventListener('timeupdate', handleTimeUpdate);
        videoRef.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoRef.removeEventListener('ended', handleEnded);
      };
    }
  }, [videoRef]);

  const togglePlay = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef) {
      videoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef?.parentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    if (videoRef) {
      videoRef.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!lecture || !lecture.videoUrl) {
    return (
      <div className="bg-gray-900 rounded-lg p-8 text-center text-white">
        <p>No video available for this lecture</p>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full aspect-video"
          src={lecture.videoUrl}
          poster={lecture.thumbnail}
          onClick={togglePlay}
        >
          Your browser does not support the video tag.
        </video>

        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-3">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, #4b5563 ${progress}%, #4b5563 100%)`
              }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="hover:text-blue-400 transition"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>

              <button
                onClick={toggleMute}
                className="hover:text-blue-400 transition"
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>

              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <button
              onClick={toggleFullscreen}
              className="hover:text-blue-400 transition"
            >
              {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Lecture Info */}
      <div className="bg-gray-900 p-4 text-white">
        <h3 className="text-xl font-bold mb-2">{lecture.title}</h3>
        {lecture.description && (
          <p className="text-gray-400 text-sm">{lecture.description}</p>
        )}
        {lecture.duration && (
          <p className="text-gray-500 text-xs mt-2">
            Duration: {lecture.duration} minutes
          </p>
        )}
      </div>
    </div>
  );
};

export default LecturePlayer;