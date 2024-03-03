import axios from "axios";

const client = axios.create({
    baseURL: 'http://127.0.0.1:8080'
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