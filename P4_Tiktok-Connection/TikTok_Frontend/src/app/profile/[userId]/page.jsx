'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import VideoCard from '@/components/ui/VideoCard';
import { userService } from '@/services/userService';
import { videoService } from '@/services/videoService';
import { useAuth } from '@/contexts/authContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileData, videosData] = await Promise.all([
          userService.getUserProfile(userId),
          videoService.getUserVideos(userId),
        ]);
        setProfile(profileData);
        setVideos(videosData.videos || videosData);
        if (user) {
          const following = await userService.getFollowing(user.id);
          setIsFollowing(following.some(u => u.id === userId));
        }
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId, user]);

  const toggleFollow = async () => {
    if (!user) return toast.error('Please log in first');
    try {
      if (isFollowing) {
        await userService.unfollowUser(userId);
        setIsFollowing(false);
      } else {
        await userService.followUser(userId);
        setIsFollowing(true);
      }
    } catch {
      toast.error('Action failed');
    }
  };

  if (loading) return <MainLayout><p className="text-center py-20">Loading...</p></MainLayout>;
  if (!profile) return <MainLayout><p className="text-center py-20">User not found.</p></MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">

        {/* Profile header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex items-center gap-6">
          
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold">
            {profile.username?.[0]?.toUpperCase()}
          </div>

          {/* User info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">@{profile.username}</h1>
            {profile.bio && <p className="text-sm text-gray-500 mt-1">{profile.bio}</p>}
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span><strong>{profile._count?.videos || 0}</strong> videos</span>
             <span><strong>{profile._count?.following || 0}</strong> followers</span>
<span><strong>{profile._count?.followers || 0}</strong> following</span>
            </div>
          </div>

          {/* Follow button - only show on other user's profile */}
          {user && user.id !== userId && (
            <button
              onClick={toggleFollow}
              className={`px-4 py-2 rounded font-medium ${
                isFollowing
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}

        </div>

        {/* Videos */}
        <h2 className="text-xl font-semibold mb-4">Videos</h2>
        {videos.length === 0
          ? <p className="text-gray-500 text-center py-8">No videos yet.</p>
          : videos.map(v => <VideoCard key={v.id} video={v} />)
        }

      </div>
    </MainLayout>
  );
}