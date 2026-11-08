import apiClient from './api';
import type { Student, CreateStudentRequest, ApiResponse } from '../types';

function convertToCamelCase(data: Partial<Student>): CreateStudentRequest {
  return {
    name: data.name || '',
    studentId: data.student_id || '',
    department: data.department || '',
    major: data.major || '',
    enrollmentYear: data.enrollment_year || new Date().getFullYear(),
  };
}

export const studentService = {
  // 获取学生列表
  async getStudents(search?: string): Promise<ApiResponse<Student[]>> {
    const params = search ? { search } : {};
    return apiClient.get('/students', { params });
  },

  // 获取学生详情
  async getStudent(id: number): Promise<ApiResponse<Student>> {
    return apiClient.get(`/students/${id}`);
  },

  // 创建学生
  async createStudent(data: Partial<Student>): Promise<ApiResponse<Student>> {
    const camelCaseData = convertToCamelCase(data);
    return apiClient.post('/students', camelCaseData);
  },

  // 更新学生
  async updateStudent(id: number, data: Partial<Student>): Promise<ApiResponse<Student>> {
    const camelCaseData = convertToCamelCase(data);
    return apiClient.put(`/students/${id}`, camelCaseData);
  },

  // 删除学生
  async deleteStudent(id: number): Promise<ApiResponse<boolean>> {
    return apiClient.delete(`/students/${id}`);
  },
};
