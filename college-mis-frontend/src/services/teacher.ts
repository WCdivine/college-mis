import apiClient from './api';
import type { Teacher, CreateTeacherRequest, ApiResponse } from '../types';

function convertTeacherToCamelCase(data: Partial<Teacher>): CreateTeacherRequest {
  return {
    name: data.name || '',
    employeeId: data.employee_id || '',
    department: data.department || '',
    title: data.title || '',
    hireDate: data.hire_date || '',
  };
}

export const teacherService = {
  // 获取教师列表
  async getTeachers(search?: string): Promise<ApiResponse<Teacher[]>> {
    const params = search ? { search } : {};
    return apiClient.get('/teachers', { params });
  },

  // 获取教师详情
  async getTeacher(id: number): Promise<ApiResponse<Teacher>> {
    return apiClient.get(`/teachers/${id}`);
  },

  // 创建教师
  async createTeacher(data: Partial<Teacher>): Promise<ApiResponse<Teacher>> {
    const camelCaseData = convertTeacherToCamelCase(data);
    return apiClient.post('/teachers', camelCaseData);
  },

  // 更新教师
  async updateTeacher(id: number, data: Partial<Teacher>): Promise<ApiResponse<Teacher>> {
    const camelCaseData = convertTeacherToCamelCase(data);
    return apiClient.put(`/teachers/${id}`, camelCaseData);
  },

  // 删除教师
  async deleteTeacher(id: number): Promise<ApiResponse<boolean>> {
    return apiClient.delete(`/teachers/${id}`);
  },
};
