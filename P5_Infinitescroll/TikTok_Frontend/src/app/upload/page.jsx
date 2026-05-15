'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';  // ← ADD THIS
import { uploadVideoToStorage, uploadThumbnailToStorage, createVideo } from '@/services/uploadService';

export default function UploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [audioName, setAudioName] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoFile) {
      alert('Please select a video');
      return;
    }

    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id;

      if (!userId) {
        throw new Error('User not logged in');
      }

      console.log('Uploading video...');
      const videoUpload = await uploadVideoToStorage(userId, videoFile);
      console.log('Video uploaded:', videoUpload);

      let thumbnailUrl = null;
      if (thumbnailFile) {
        console.log('Uploading thumbnail...');
        const thumbnailUpload = await uploadThumbnailToStorage(userId, thumbnailFile);
        thumbnailUrl = thumbnailUpload.url;
        console.log('Thumbnail uploaded:', thumbnailUpload);
      }

      const videoData = {
        caption: caption,
        audioName: audioName,
        url: videoUpload.url,
        thumbnailUrl: thumbnailUrl
      };

      const response = await createVideo(videoData);
      console.log('Video saved to database:', response);

      alert('Video uploaded successfully!');
      router.push('/');
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload video: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Wrap the entire upload form with MainLayout
  return (
    <MainLayout>
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h1 className="text-xl font-semibold text-black">Upload Video</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Video File */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video File <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
                required
              />
              {previewUrl && (
                <video 
                  src={previewUrl} 
                  controls 
                  className="mt-3 w-full max-h-48 rounded-lg border border-gray-200"
                />
              )}
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
              />
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                rows="3"
                placeholder="Write a caption..."
              />
            </div>

            {/* Audio Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audio Name
              </label>
              <input
                type="text"
                value={audioName}
                onChange={(e) => setAudioName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter audio name..."
              />
            </div>

            {/* Upload Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 focus:ring-4 focus:ring-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Upload Video'
              )}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}