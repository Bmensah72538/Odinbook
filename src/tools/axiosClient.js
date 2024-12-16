import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const client = axios.create({
    baseURL: apiUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Refresh token function
const refreshAccessToken = async () => {
  try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await apiClient.post('/refresh', { refreshToken });

      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
  } catch (error) {
      console.error('Failed to refresh token:', error);
      throw error;
  }
};

// Axios request interceptor
client.interceptors.request.use(
  function(config) {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function(error) {
    Promise.reject(error)
  }
);


// Axios response interceptor
client.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
      const originalRequest = error.config;

      // If unauthorized (401) and no retry flag set
      if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // Prevent infinite loops

          try {
              const newAccessToken = await refreshAccessToken();
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return client(originalRequest); // Retry with new token
          } catch (refreshError) {
              console.error('Refresh token expired or invalid:', refreshError);
              // Optional: Redirect to login or show logout modal
              return Promise.reject(refreshError);
          }
      }

      return Promise.reject(error); // Propagate other errors
  }
);


export default client;