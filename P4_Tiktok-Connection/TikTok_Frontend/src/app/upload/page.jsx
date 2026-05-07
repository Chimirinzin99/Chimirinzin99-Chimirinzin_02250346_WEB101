'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { videoService } from '@/services/videoService';
import { useAuth } from '@/contexts/authContext';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ caption: '', audioName: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user) return (
    <MainLayout>
      <div className="text-center py-20">
        <p className="text-gray-500">Please log in to upload videos.</p>
      </div>
    </MainLayout>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return toast.error('Please select a video');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      if (thumbnail) formData.append('thumbnail', thumbnail);
      formData.append('caption', form.caption);
      formData.append('audioName', form.audioName);
      await videoService.uploadVideo(formData);
      toast.success('Video uploaded!');
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Video File *</label>
            <input
              type="file" accept="video/*"
              onChange={e => setVideoFile(e.target.files[0])}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail (optional)</label>
            <input
              type="file" accept="image/*"
              onChange={e => setThumbnail(e.target.files[0])}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Caption</label>
            <textarea
              value={form.caption}
              onChange={e => setForm({ ...form, caption: e.target.value })}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Audio Name</label>
            <input
              type="text" value={form.audioName}
              onChange={e => setForm({ ...form, audioName: e.target.value })}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50 font-medium"
          >
            {loading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}