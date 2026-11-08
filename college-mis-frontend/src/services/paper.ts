import apiClient from './api';
import type { Paper, CreatePaperRequest, ApiResponse } from '../types';

function convertPaperToCamelCase(data: Partial<Paper>): CreatePaperRequest {
  return {
    ownerId: data.owner_id || 0,
    ownerType: (data.owner_type as 'student' | 'teacher') || 'student',
    title: data.title || '',
    journal: data.journal,
    publishDate: data.publish_date || '',
    authors: data.authors || '',
    doi: data.doi,
  };
}

export const paperService = {
  // 获取论文列表
  async getPapers(ownerId?: number, ownerType?: 'student' | 'teacher'): Promise<ApiResponse<Paper[]>> {
    const params: Record<string, any> = {};
    if (ownerId) params.ownerId = ownerId;
    if (ownerType) params.ownerType = ownerType;
    return apiClient.get('/papers', { params });
  },

  // 获取论文详情
  async getPaper(id: number): Promise<ApiResponse<Paper>> {
    return apiClient.get(`/papers/${id}`);
  },

  // 创建论文
  async createPaper(data: Partial<Paper>): Promise<ApiResponse<Paper>> {
    const camelCaseData = convertPaperToCamelCase(data);
    return apiClient.post('/papers', camelCaseData);
  },

  // 更新论文
  async updatePaper(id: number, data: Partial<Paper>): Promise<ApiResponse<Paper>> {
    const camelCaseData = convertPaperToCamelCase(data);
    return apiClient.put(`/papers/${id}`, camelCaseData);
  },

  // 删除论文
  async deletePaper(id: number): Promise<ApiResponse<boolean>> {
    return apiClient.delete(`/papers/${id}`);
  },
};
