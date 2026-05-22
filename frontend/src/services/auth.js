import api from './api';

const TOKEN_KEY = 'biblioteca_token';

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const loginRequest = async (email, password) => {
  const response = await api.post('/api/auth/login', {
    email,
    password,
  });

  if (response.data?.token) {
    saveToken(response.data.token);
  }

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

export const logoutRequest = () => {
  removeToken();
};