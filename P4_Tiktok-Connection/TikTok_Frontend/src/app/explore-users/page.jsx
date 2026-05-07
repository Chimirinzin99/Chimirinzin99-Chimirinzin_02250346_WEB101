'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { userService } from '@/services/userService';
import { useAuth } from '@/contexts/authContext';
import toast from 'react-hot-toast';

export default function ExploreUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingIds, setFollowingIds] = useState(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        const data = await userService.getAllUsers();
        setUsers(data);
        if (user) {
          const following = await userService.getFollowing(user.id);
          setFollowingIds(new Set(following.map(u => u.id)));
        }
      } catch {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const toggleFollow = async (targetId) => {
    if (!user) return toast.error('Please log in first');
    try {
      if (followingIds.has(targetId)) {
        await userService.unfollowUser(targetId);
        setFollowingIds(prev => { const s = new Set(prev); s.delete(targetId); return s; });
      } else {
        await userService.followUser(targetId);
        setFollowingIds(prev => new Set([...prev, targetId]));
      }
    } catch {
      toast.error('Action failed');
    }
  };

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Explore Users</h1>
      {loading ? <p className="text-gray-500">Loading...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.filter(u => u.id !== user?.id).map(u => (
            <div key={u.id} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
              <Link href={`/profile/${u.id}`}>
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-lg">
                  {u.username?.[0]?.toUpperCase()}
                </div>
              </Link>
              <div className="flex-1">
                <Link href={`/profile/${u.id}`} className="font-semibold hover:underline block">
                  @{u.username}
                </Link>
                {u.name && <p className="text-sm text-gray-500">{u.name}</p>}
              </div>
              {user && (
                <button
                  onClick={() => toggleFollow(u.id)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    followingIds.has(u.id)
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {followingIds.has(u.id) ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}