"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaHeart, FaComment, FaShare, FaMusic, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useAuth } from "../../contexts/authContext";
import { videoService } from "../../services/videoService";
import toast from "react-hot-toast";

const VideoCard = ({ video, onAuthRequired }) => {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(video.isLiked || false);
  const [likeCount, setLikeCount] = useState(video.likeCount || 0);
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const videoRef = useRef(null);

  const getFullVideoUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((error) => {
              console.error("Error playing video:", error);
            });
        }
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleLike = async () => {
    if (!user) {
      onAuthRequired?.();
      return;
    }
    try {
      if (isLiked) {
        await videoService.unlikeVideo(video.id);
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        await videoService.likeVideo(video.id);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      toast.error("Failed to like/unlike video");
    }
  };

  const handleComments = async () => {
    if (!showComments) {
      try {
        const data = await videoService.getComments(video.id);
        setComments(data.comments || data);
      } catch {
        toast.error('Failed to load comments');
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return onAuthRequired?.();
    if (!newComment.trim()) return;
    try {
      const comment = await videoService.addComment(video.id, newComment);
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch {
      toast.error('Failed to add comment');
    }
  };

  // Autoplay when in view
  useEffect(() => {
    if (!videoRef.current) return;
    let isPaused = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (videoRef.current && !isPaused) {
              const playPromise = videoRef.current.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => setIsPlaying(true))
                  .catch(() => setIsPlaying(false));
              }
            }
          }, 50);
        } else {
          if (videoRef.current) {
            isPaused = true;
            videoRef.current.pause();
            setIsPlaying(false);
            setTimeout(() => { isPaused = false; }, 100);
          }
        }
      },
      { threshold: 0.6 }
    );

    const currentVideo = videoRef.current;
    if (currentVideo) observer.observe(currentVideo);
    return () => { if (currentVideo) observer.unobserve(currentVideo); };
  }, []);

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <div className="mb-8 flex border-b border-gray-200 pb-8 max-w-2xl mx-auto px-4">
      {/* User avatar */}
      <div className="mr-4">
        <Link href={`/profile/${video.user?.id}`}>
          <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-700 text-lg">
            {video.user?.profilePicture ? (
              <img
                src={getFullVideoUrl(video.user.profilePicture)}
                alt={video.user?.username}
                className="h-full w-full object-cover"
              />
            ) : (
              video.user?.username?.[0]?.toUpperCase()
            )}
          </div>
        </Link>
      </div>

      {/* Video content */}
      <div className="flex-1">
        {/* User info and caption */}
        <div className="mb-3">
          <Link
            href={`/profile/${video.user?.id}`}
            className="font-semibold hover:underline"
          >
            @{video.user?.username}
          </Link>
          {video.caption && (
            <p className="mt-1">{video.caption}</p>
          )}
          <p className="mt-1 flex items-center text-sm text-gray-500">
            <FaMusic className="mr-1" />
            original Sounds - {video.user?.username}
          </p>
        </div>

        {/* Video and interaction */}
        <div className="flex">
          {/* Video container */}
          <div className="relative mr-4 h-[600px] w-[336px] overflow-hidden rounded-lg bg-black">
            {!videoError ? (
              <>
                <video
                  ref={videoRef}
                  onClick={togglePlay}
                  className="h-full w-full object-cover"
                  loop
                  muted={isMuted}
                  playsInline
                  poster={video.thumbnailUrl ? getFullVideoUrl(video.thumbnailUrl) : undefined}
                  onError={handleVideoError}
                  src={getFullVideoUrl(video.url)}
                />

                {/* Mute button */}
                <button
                  onClick={toggleMute}
                  className="absolute bottom-4 right-4 bg-black bg-opacity-50 rounded-full p-2 text-white z-10"
                >
                  {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                </button>

                {/* Play button */}
              {!isPlaying && (
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
    <button className="rounded-full  border-2 border-gray-0 p-3 shadow-lg">
      <svg viewBox="0 0 24 24" className="w-8 h-8  drop-shadow-[0_0_1px_rgba(0,0,0,1)]" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </button>
  </div>
)}
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-black text-white">
                <p className="mb-2">Video Placeholder</p>
                <p className="text-sm text-gray-400">Unable to load video</p>
              </div>
            )}
          </div>

          {/* Interaction buttons */}
          <div className="flex flex-col items-center justify-end space-y-4">

            {/* Like */}
            <button
  onClick={handleLike}
  className="flex flex-col items-center"
>
  <div className="rounded-full bg-white border border-gray-200 p-3 shadow-sm">
    <FaHeart 
      size={20} 
      className={isLiked ? "text-red-500" : "text-white drop-shadow-[0_0_1px_rgba(0,0,0,1)]"} 
    />
  </div>
  <span className={`mt-1 text-xs ${isLiked ? "text-red-500" : ""}`}>{likeCount}</span>
</button>

            {/* Comment */}
            <button
              onClick={handleComments}
              className="flex flex-col items-center"
            >
             <div className="rounded-full bg-gray-100 border border-gray-200 p-3 shadow-sm">
  <FaComment size={20} className="text-white drop-shadow-[0_0_1px_rgba(0,0,0,1)]" />
</div>
              <span className="mt-1 text-xs">{video.commentCount || 0}</span>
            </button>

            {/* Share */}
            <button className="flex flex-col items-center">
              <div className="rounded-full bg-gray-100 p-3">
                <FaShare size={20} />
              </div>
              <span className="mt-1 text-xs">Share</span>
            </button>

          </div>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="mt-4 bg-gray-50 rounded-lg p-4 max-w-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Comments</h3>
              <button onClick={() => setShowComments(false)} className="text-gray-500">✕</button>
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2 mb-3">
              <input
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder={user ? "Add a comment..." : "Log in to comment"}
                disabled={!user}
                className="flex-1 border rounded-full px-3 py-1 text-sm focus:outline-none 
                focus:ring-1 focus:ring-red-400"
              />
              <button
                type="submit"
                className="bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600"
              >
                Post
              </button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {comments.length === 0 && (
                <p className="text-center text-gray-400 text-sm">No comments yet</p>
              )}
              {comments.map(c => (
                <div key={c.id} className="flex gap-2 text-sm">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center 
                  font-bold text-gray-600 text-xs flex-shrink-0">
                    {c.user?.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <span className="font-semibold">@{c.user?.username}</span>{' '}
                    <span className="text-gray-700">{c.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;