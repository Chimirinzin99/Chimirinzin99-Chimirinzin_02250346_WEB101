import api from '@/lib/api-config';

export const userService = {
  getAllUsers: async () => {
    const res = await api.get('/users');
    return res.data;
  },

  getUserProfile: async (userId) => {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  },

  followUser: async (userId) => {
    const res = await api.post(`/users/${userId}/follow`);
    return res.data;
  },

  unfollowUser: async (userId) => {
    const res = await api.delete(`/users/${userId}/follow`);
    return res.data;
  },

  getFollowers: async (userId) => {
    const res = await api.get(`/users/${userId}/followers`);
    return res.data;
  },

  getFollowing: async (userId) => {
    const res = await api.get(`/users/${userId}/following`);
    return res.data;
  },
};