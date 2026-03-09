import api from './api';

export const register = async ({ studentId, fullName, email, password }) => {
  const res = await api.post('/auth/register', { studentId, fullName, email, password });
  return res.data;
};

export const login = async ({ studentId, password }) => {
  const res = await api.post('/auth/login', { studentId, password });
  return res.data;
};

export const getMe = async () => {
  const res = await api.get('/users/me');
  return res.data;
};

export const updateProfile = async (formData) => {
  const res = await api.put('/users/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};
