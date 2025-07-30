import { create } from 'zustand';
import { authService } from '../services/api';

const useAuthStore = create((set, get) => ({
  user: authService.getStoredUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(credentials);
      set({ 
        user: data.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.register(userData);
      set({ 
        user: data.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Registration failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ 
      user: null, 
      isAuthenticated: false, 
      error: null 
    });
  },

  updateUser: async () => {
    try {
      const user = await authService.getCurrentUser();
      set({ user });
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;