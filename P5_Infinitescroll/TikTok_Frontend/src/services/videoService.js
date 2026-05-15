import api from '@/lib/api-config';

export const videoService = {
  // Cursor-based pagination for main feed
  getAllVideos: async (cursor = null, limit = 10) => {
    const params = new URLSearchParams();
    params.append('limit', limit);
    if (cursor) params.append('cursor', cursor);
    const res = await api.get(`/videos?${params.toString()}`);
    return res.data;
  },

  // Cursor-based pagination for following feed
  getFollowingVideos: async (cursor = null, limit = 10) => {
    const params = new URLSearchParams();
    params.append('limit', limit);
    if (cursor) params.append('cursor', cursor);
    const res = await api.get(`/videos/following?${params.toString()}`);
    return res.data;
  },

  getUserVideos: async (userId) => {
    const res = await api.get(`/videos/user/${userId}`);
    return res.data;
  },

  likeVideo: async (videoId) => {
    const res = await api.post(`/videos/${videoId}/like`);
    return res.data;
  },

  unlikeVideo: async (videoId) => {
    const res = await api.delete(`/videos/${videoId}/like`);
    return res.data;
  },

  getComments: async (videoId) => {
    const res = await api.get(`/videos/${videoId}/comments`);
    return res.data;
  },

  // ✅ Fixed: addComment sends videoId and text to backend
  addComment: async (videoId, text) => {
    const res = await api.post('/comments', { videoId, text });
    return res.data;
  },

  uploadVideo: async (formData) => {
    const res = await api.post('/videos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};