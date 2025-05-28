import { create } from 'zustand';
import { authApi } from '../lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    username: string;
    full_name?: string;
  }) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('token'),
  
  initializeAuth: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Verify token and get user data
        const response = await authApi.getCurrentUser();
        localStorage.setItem('user', JSON.stringify(response.user));
        set({
          token,
          user: response.user,
          isAuthenticated: true,
        });
      } catch (error) {
        // If token is invalid, clear everything
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      }
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      set({
        token: response.access_token,
        user: response.user,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await authApi.register(userData);
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      set({
        token: response.access_token,
        user: response.user,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  logout: () => {
    authApi.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
})); 