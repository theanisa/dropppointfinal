import api from './api';

export const fetchPosts = async (params) => {
  const res = await api.get('/posts', { params });
  return res.data;
};

export const createPost = async (formData) => {
  const res = await api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const toggleClaim = async (postId) => {
  const res = await api.post(`/posts/${postId}/claim`);
  return res.data;
};

export const deletePost = async (postId) => {
  const res = await api.delete(`/posts/${postId}`);
  return res.data;
};

export const addComment = async (postId, comment) => {
  const res = await api.post(`/posts/${postId}/comments`, { comment });
  return res.data;
};

export const deleteComment = async (postId, commentId) => {
  const res = await api.delete(`/posts/${postId}/comments/${commentId}`);
  return res.data;
};

export const fetchAllPosts = async () => {
  const res = await api.get('/posts/admin/all');
  return res.data;
};
