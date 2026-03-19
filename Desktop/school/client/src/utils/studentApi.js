import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const studentApi = axios.create({
  baseURL: `${API_BASE_URL}/student`,
});

studentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('studentToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

studentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('studentToken');
      window.location.href = '/student/login';
    }
    return Promise.reject(error);
  }
);

export default studentApi;
