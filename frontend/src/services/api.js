import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export const cvService = {
  getCVs: async () => {
    const response = await api.get('/cv');
    return response.data;
  },

  getCV: async (id) => {
    const response = await api.get(`/cv/${id}`);
    return response.data;
  },

  createCV: async (cvData) => {
    const response = await api.post('/cv', cvData);
    return response.data;
  },

  updateCV: async (id, cvData) => {
    const response = await api.put(`/cv/${id}`, cvData);
    return response.data;
  },

  deleteCV: async (id) => {
    const response = await api.delete(`/cv/${id}`);
    return response.data;
  },

  downloadCV: async (id) => {
    const response = await api.post(`/cv/${id}/download`);
    return response.data;
  },

  getTemplates: async () => {
    const response = await api.get('/cv/templates/list');
    return response.data;
  }
};

export const userService = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/user/stats');
    return response.data;
  },

  upgrade: async (planType) => {
    const response = await api.post('/user/upgrade', { planType });
    return response.data;
  }
};

export default api;