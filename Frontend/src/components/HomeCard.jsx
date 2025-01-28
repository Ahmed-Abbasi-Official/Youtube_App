import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';

const HomeCard = ({ video }) => {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isVolumeSliderVisible, setIsVolumeSliderVisible] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Handle any autoplay restrictions
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsVolumeSliderVisible(false);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(1);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex flex-col gap-2 w-[40%] 540px:w-[90%] sm:w-[30%] lg:w-[23%] cursor-pointer">
      <div 
        className="relative group rounded-xl overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          src={video?.videoFile}
          className="w-full h-[200px] object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
          onTimeUpdate={handleTimeUpdate}
          muted={isMuted}
          loop
          playsInline
        />

        {/* Overlay with controls (only visible on hover) */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300">
            {/* Volume controls */}
            <div 
              className="absolute top-4 right-4 flex items-center gap-2"
              onMouseEnter={() => setIsVolumeSliderVisible(true)}
              onMouseLeave={() => setIsVolumeSliderVisible(false)}
            >
              <button
                onClick={toggleMute}
                className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all duration-200"
              >
                <span className="text-white text-lg">
                  {isMuted ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                </span>
              </button>
              
              {/* Volume slider */}
              {isVolumeSliderVisible && (
                <div className="bg-black bg-opacity-50 rounded-full p-2 transition-all duration-200">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 accent-white"
                  />
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 px-4 py-2">
              <div className="flex items-center gap-2 text-white text-xs">
                <span>{formatTime(currentTime)}</span>
                <div className="flex-1 h-1 bg-gray-600 rounded-full">
                  <div 
                    className="h-full bg-white rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Duration badge (only visible when not hovering) */}
        {!isHovered && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
            {formatTime(duration)}
          </div>
        )}
      </div>

      {/* Video details */}
      <div className="flex items-start gap-3 p-2">
        <Link to={`/${video?.owner?.username}`}>
        <img
          src={video?.owner?.avatar || "/Main/Avatar.png"}
          className="w-9 h-9 rounded-full object-cover"
          loading="lazy"
          alt=""
        />
        </Link>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-medium line-clamp-2 mb-1">
            {video?.title || "Video Title"}
          </h2>
          <Link to={`/${video?.owner?.username}`}>
            <p className="text-sm text-gray-500 hover:text-gray-700">
              {video?.owner?.username || "Username"}
            </p>
          </Link>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <span>{`${video?.views || 0} views`}</span>
            <span>•</span>
            <span>{format(video?.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;