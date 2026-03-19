import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enable cookies for authentication
});

api.interceptors.request.use((config) => {
  // Cookies are automatically sent with requests
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local storage if any
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      // Redirect to login - cookies are managed by browser
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
