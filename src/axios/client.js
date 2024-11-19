import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const client = axios.create({
    baseURL: apiUrl
  });

client.interceptors.request.use(
  function(config) {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (refreshToken) {
      config.headers.Refresh = `Bearer ${refreshToken}`;
    }
    return config;
  },
  function(error) {
    Promise.reject(error)
  }
);



export default client;