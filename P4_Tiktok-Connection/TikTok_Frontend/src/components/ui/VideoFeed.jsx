'use client';
import { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import { videoService } from '@/services/videoService';
import AuthModal from '@/components/auth/AuthModal';

export default function VideoFeed({ mode = 'forYou' }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = mode === 'following'
          ? await videoService.getFollowingVideos()
          : await videoService.getAllVideos();
        setVideos(data.videos || data);
      } catch (err) {
        setError('Failed to load videos');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [mode]);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading videos...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!videos.length) return (
    <div className="text-center py-20 text-gray-500">
      {mode === 'following' ? "Follow some users to see their videos here!" : "No videos yet."}
    </div>
  );

  return (
    <div className="py-4">
      {videos.map(video => (
        <VideoCard key={video.id} video={video} onAuthRequired={() => setAuthOpen(true)} />
      ))}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}