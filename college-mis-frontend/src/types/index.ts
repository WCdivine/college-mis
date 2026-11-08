export interface User {
  id: number;
  username: string;
  role: 'admin' | 'teacher' | 'student';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Student {
  id: number;
  user_id: number;
  name: string;
  student_id: string;
  department: string;
  major: string;
  enrollment_year: number;
  created_at: string;
  updated_at: string;
}

export interface CreateStudentRequest {
  name: string;
  studentId: string;
  department: string;
  major: string;
  enrollmentYear: number;
}

export interface CreateTeacherRequest {
  name: string;
  employeeId: string;
  department: string;
  title: string;
  hireDate: string;
}

export interface CreateAwardRequest {
  ownerId: number;
  ownerType: 'student' | 'teacher';
  title: string;
  level: string;
  date: string;
  description?: string;
}

export interface CreatePaperRequest {
  ownerId: number;
  ownerType: 'student' | 'teacher';
  title: string;
  journal?: string;
  publishDate: string;
  authors: string;
  doi?: string;
}

export interface Teacher {
  id: number;
  user_id: number;
  name: string;
  employee_id: string;
  department: string;
  title: string;
  hire_date: string;
  created_at: string;
  updated_at: string;
}

export interface Award {
  id: number;
  owner_id: number;
  owner_type: 'student' | 'teacher';
  title: string;
  level: string;
  date: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Paper {
  id: number;
  owner_id: number;
  owner_type: 'student' | 'teacher';
  title: string;
  journal?: string;
  publish_date: string;
  authors: string;
  doi?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
