import api from '@/lib/api-config';

export const videoService = {
  getAllVideos: async (page = 1, limit = 10) => {
    const res = await api.get(`/videos?page=${page}&limit=${limit}`);
    return res.data;
  },

  getFollowingVideos: async (page = 1, limit = 10) => {
    const res = await api.get(`/videos/following?page=${page}&limit=${limit}`);
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

  addComment: async (videoId, content) => {
    const res = await api.post(`/videos/${videoId}/comments`, { content });
    return res.data;
  },

  uploadVideo: async (formData) => {
    const res = await api.post('/videos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};