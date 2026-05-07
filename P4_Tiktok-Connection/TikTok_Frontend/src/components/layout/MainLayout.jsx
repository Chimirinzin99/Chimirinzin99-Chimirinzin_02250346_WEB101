'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/authContext';
import AuthModal from '@/components/auth/AuthModal';
export default function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r fixed h-full flex flex-col p-4">
        <Link href="/" className="text-2xl font-bold text-red-500 mb-8 block">TikTok</Link>
        <nav className="flex flex-col gap-2">
          <Link href="/" className="hover:bg-gray-100 rounded px-3 py-2">For You</Link>
          {user && (
            <Link href="/following" className="hover:bg-gray-100 rounded px-3 py-2">Following</Link>
          )}
          <Link href="/explore-users" className="hover:bg-gray-100 rounded px-3 py-2">Explore Users</Link>
          {user && (
            <>
              <Link href="/upload" className="hover:bg-gray-100 rounded px-3 py-2">Upload</Link>
              <Link href={`/profile/${user.id}`} className="hover:bg-gray-100 rounded px-3 py-2">Profile</Link>
            </>
          )}
        </nav>
        <div className="mt-auto">
          {user ? (
            <div>
              <p className="text-sm text-gray-600 mb-2">@{user.username}</p>
              <button onClick={logout} className="w-full bg-gray-100 hover:bg-gray-200 rounded px-3 py-2 text-sm">
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="w-full bg-red-500 text-white rounded px-3 py-2 hover:bg-red-600"
            >
              Log In
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-4">{children}</main>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}