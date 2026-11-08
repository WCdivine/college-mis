import { create } from 'zustand';
import { authService } from '../services';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: async (username: string, password: string) => {
    const response = await authService.login({ username, password });
    if (response.success && response.data) {
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ token, user, isAuthenticated: true });
    }
  },
  
  logout: () => {
    authService.logout();
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false });
      return;
    }
    
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        set({ user: response.data, isAuthenticated: true });
      } else {
        set({ user: null, token: null, isAuthenticated: false });
      }
    } catch {
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));
