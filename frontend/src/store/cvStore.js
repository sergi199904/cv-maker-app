import { create } from 'zustand';
import { cvService } from '../services/api';

const useCVStore = create((set, get) => ({
  cvs: [],
  currentCV: null,
  templates: [],
  isLoading: false,
  error: null,

  fetchCVs: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await cvService.getCVs();
      set({ cvs: data.cvs, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch CVs', 
        isLoading: false 
      });
    }
  },

  fetchCV: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const cv = await cvService.getCV(id);
      set({ currentCV: cv, isLoading: false });
      return cv;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch CV', 
        isLoading: false 
      });
      throw error;
    }
  },

  createCV: async (cvData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await cvService.createCV(cvData);
      set(state => ({ 
        cvs: [data.cv, ...state.cvs],
        currentCV: data.cv,
        isLoading: false 
      }));
      return data.cv;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create CV', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateCV: async (id, cvData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await cvService.updateCV(id, cvData);
      set(state => ({
        cvs: state.cvs.map(cv => cv._id === id ? data.cv : cv),
        currentCV: data.cv,
        isLoading: false
      }));
      return data.cv;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update CV', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteCV: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await cvService.deleteCV(id);
      set(state => ({
        cvs: state.cvs.filter(cv => cv._id !== id),
        currentCV: state.currentCV?._id === id ? null : state.currentCV,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete CV', 
        isLoading: false 
      });
      throw error;
    }
  },

  downloadCV: async (id) => {
    try {
      const response = await cvService.downloadCV(id);
      return response;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to download CV' });
      throw error;
    }
  },

  fetchTemplates: async () => {
    try {
      const data = await cvService.getTemplates();
      set({ templates: data.templates });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch templates' });
    }
  },

  setCurrentCV: (cv) => set({ currentCV: cv }),
  
  clearError: () => set({ error: null }),

  // Helper function to create initial CV structure
  createEmptyCV: () => ({
    title: 'My CV',
    personalInfo: {
      firstName: '',
      lastName: '',
      title: '',
      summary: ''
    },
    contact: {
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      linkedin: '',
      github: '',
      portfolio: '',
      website: ''
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    template: 'classic',
    theme: {
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      fontFamily: 'Inter',
      fontSize: 'medium'
    }
  })
}));

export default useCVStore;