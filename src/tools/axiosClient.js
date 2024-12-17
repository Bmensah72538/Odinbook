import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiUrl = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    console.error('No refresh token available');
    throw new Error('No refresh token available');
  }

  try {
    const response = await client.post('/refresh', { refreshToken });
    const { accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
};

client.interceptors.request.use(
  (request) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken && !isTokenExpired(accessToken)) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token expired or invalid:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default client;
