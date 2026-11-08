import apiClient from './api';
import type { Award, CreateAwardRequest, ApiResponse } from '../types';

function convertAwardToCamelCase(data: Partial<Award>): CreateAwardRequest {
  return {
    ownerId: data.owner_id || 0,
    ownerType: (data.owner_type as 'student' | 'teacher') || 'student',
    title: data.title || '',
    level: data.level || '',
    date: data.date || '',
    description: data.description,
  };
}

export const awardService = {
  // 获取获奖列表
  async getAwards(ownerId?: number, ownerType?: 'student' | 'teacher'): Promise<ApiResponse<Award[]>> {
    const params: Record<string, any> = {};
    if (ownerId) params.ownerId = ownerId;
    if (ownerType) params.ownerType = ownerType;
    return apiClient.get('/awards', { params });
  },

  // 获取获奖详情
  async getAward(id: number): Promise<ApiResponse<Award>> {
    return apiClient.get(`/awards/${id}`);
  },

  // 创建获奖
  async createAward(data: Partial<Award>): Promise<ApiResponse<Award>> {
    const camelCaseData = convertAwardToCamelCase(data);
    return apiClient.post('/awards', camelCaseData);
  },

  // 更新获奖
  async updateAward(id: number, data: Partial<Award>): Promise<ApiResponse<Award>> {
    const camelCaseData = convertAwardToCamelCase(data);
    return apiClient.put(`/awards/${id}`, camelCaseData);
  },

  // 删除获奖
  async deleteAward(id: number): Promise<ApiResponse<boolean>> {
    return apiClient.delete(`/awards/${id}`);
  },
};
