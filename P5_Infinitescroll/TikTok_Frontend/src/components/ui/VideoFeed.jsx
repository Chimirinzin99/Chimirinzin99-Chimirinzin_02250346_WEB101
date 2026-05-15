'use client';

import { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import VideoCard from './VideoCard';
import { videoService } from '@/services/videoService';
import AuthModal from '@/components/auth/AuthModal';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export default function VideoFeed({ mode = 'forYou' }) {
  const [authOpen, setAuthOpen] = useState(false); // ✅ Add state for auth modal

  const fetchFunction = mode === 'following' 
    ? videoService.getFollowingVideos 
    : videoService.getAllVideos;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['videos', mode],
    queryFn: ({ pageParam = null }) => fetchFunction(pageParam, 10),
    getNextPageParam: (lastPage) => lastPage.pagination?.nextCursor || undefined,
    initialPageParam: null,
    staleTime: 5 * 60 * 1000,
  });

  const { targetRef, isIntersecting } = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all pages of videos
  const allVideos = data?.pages.flatMap(page => page.videos) ?? [];
  
  // ✅ Deduplicate videos by ID
  const uniqueVideos = Array.from(
    new Map(allVideos.map(video => [video.id, video])).values()
  );

  if (isLoading) {
    return <div className="text-center py-20 text-gray-500">Loading videos...</div>;
  }

  if (isError) {
    return <div className="text-center py-20 text-red-500">
      {error?.message || 'Failed to load videos'}
    </div>;
  }

  if (uniqueVideos.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        {mode === 'following' 
          ? "Follow some users to see their videos here!" 
          : "No videos yet."}
      </div>
    );
  }

  return (
    <div className="py-4">
      {uniqueVideos.map(video => (
        <VideoCard 
          key={video.id} 
          video={video} 
          onAuthRequired={() => setAuthOpen(true)} 
        />
      ))}

      {isFetchingNextPage && (
        <div className="text-center py-4 text-gray-500">Loading more...</div>
      )}

      <div ref={targetRef} style={{ height: '10px' }} />

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}