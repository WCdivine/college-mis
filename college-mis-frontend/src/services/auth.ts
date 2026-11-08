import apiClient from './api';
import type { LoginRequest, LoginResponse, User, ApiResponse } from '../types';

export const authService = {
  // 登录
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post('/auth/login', data);
  },

  // 注册
  async register(username: string, password: string, role: string): Promise<ApiResponse<User>> {
    return apiClient.post('/auth/register', { username, password, role });
  },

  // 获取当前用户
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get('/auth/me');
  },

  // 登出
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
