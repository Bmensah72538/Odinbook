import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiUrl = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

const isTokenExpired = (token) => {
  const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
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
  async (request) => {
    const accessToken = localStorage.getItem('accessToken');
    let tokenExpired = false; // Default to false

    if (accessToken) {
      try {
        tokenExpired = isTokenExpired(accessToken);
      } catch (error) {
        console.error('Error checking token expiration:', error);
        tokenExpired = true; // Default to true on error to prevent usage of invalid tokens
      }
    }

    if (accessToken && !tokenExpired) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }

    return request;
  },
  (error) => {
    console.log('An error occured');
    // Check if the response has an error message in the body
    if (error.response && error.response.data && error.response.data.error) {
      console.error('Error from server:', error.response.data.error);
      return Promise.reject(new Error(error.response.data.error));
    }

    // Fallback for cases where no error message is provided
    return Promise.reject(
      new Error(error.response?.statusText || 'An unknown error occurred')
    );
  }
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
