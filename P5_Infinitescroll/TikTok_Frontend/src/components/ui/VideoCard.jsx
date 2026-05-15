"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaHeart, FaComment, FaShare, FaMusic, FaVolumeMute, FaVolumeUp, FaTimes } from "react-icons/fa";
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
  const commentsPanelRef = useRef(null);

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

  const handleShare = async () => {
    const url = `${window.location.origin}/video/${video.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Video link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
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

  // Close comments when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showComments && commentsPanelRef.current && !commentsPanelRef.current.contains(event.target)) {
        if (!event.target.closest('.comment-button')) {
          setShowComments(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showComments]);

  return (
    <div className="flex justify-center">
      {/* Main card container - centered horizontally */}
      <div className="w-full max-w-2xl">
        {/* User avatar + caption row (simplified, aligned with video top) */}
        <div className="flex items-start gap-3 mb-3">
          <Link href={`/profile/${video.user?.id}`}>
            <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-700 text-lg flex-shrink-0">
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
          <div>
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
        </div>

        {/* Video + Interaction row */}
        <div className="flex items-center gap-4">
          {/* Video container */}
          <div className="relative h-[600px] w-[336px] ...">
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
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <button
                      onClick={togglePlay}
                      className="rounded-full bg-black/50 border-2 border-white p-3 shadow-lg hover:bg-black/70 transition"
                    >
                      <svg viewBox="0 0 24 24" className="w-8 h-8 text-white drop-shadow-md" fill="currentColor">
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

          {/* Interaction buttons (vertical) */}
          <div className="flex flex-col items-center space-y-4 mt-42">
            {/* Like */}
            <button onClick={handleLike} className="flex flex-col items-center">
              <div className="rounded-full bg-gray-100 border border-gray-200 p-3 shadow-sm">
                <FaHeart 
                  size={20} 
                  className={isLiked ? "text-red-500" : "text-white drop-shadow-[0_0_1px_rgba(0,0,0,1)]"} 
                />
              </div>
              <span className={`mt-1 text-xs ${isLiked ? "text-red-500" : ""}`}>{likeCount}</span>
            </button>

            {/* Comment */}
            <button onClick={handleComments} className="comment-button flex flex-col items-center">
              <div className="rounded-full bg-gray-100 border border-gray-200 p-3 shadow-sm">
                <FaComment size={20} className="text-white drop-shadow-[0_0_1px_rgba(0,0,0,1)]" />
              </div>
              <span className="mt-1 text-xs">{video.commentCount || 0}</span>
            </button>

            {/* Share */}
            <button onClick={handleShare} className="flex flex-col items-center">
              <div className="rounded-full bg-gray-100 p-3">
                <FaShare size={20} />
              </div>
              <span className="mt-1 text-xs">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments sidebar overlay (fixed on right) */}
      {showComments && (
        <div 
          ref={commentsPanelRef}
          className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col"
          style={{ animation: 'slideIn 0.3s ease-out' }}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-bold text-lg">Comments</h3>
            <button onClick={() => setShowComments(false)} className="text-gray-500 hover:text-gray-700">
              <FaTimes size={20} />
            </button>
          </div>

          <div className="p-4 border-b">
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder={user ? "Add a comment..." : "Log in to comment"}
                disabled={!user}
                className="flex-1 border rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
              />
              <button
                type="submit"
                className="bg-red-500 text-white px-4 py-2 rounded-full text-sm hover:bg-red-600 disabled:opacity-50"
                disabled={!user || !newComment.trim()}
              >
                Post
              </button>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {comments.length === 0 && (
              <p className="text-center text-gray-400 text-sm">No comments yet. Be the first!</p>
            )}
            {comments.map(c => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs flex-shrink-0">
                  {c.user?.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <span className="font-semibold text-sm">@{c.user?.username}</span>
                  <p className="text-gray-700 text-sm">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default VideoCard;