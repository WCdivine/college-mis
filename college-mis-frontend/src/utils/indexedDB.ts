import { openDB, type IDBPDatabase } from 'idb';
import type { Student, Teacher, Award, Paper } from '../types';

const DB_NAME = 'college-mis-db';
const DB_VERSION = 1;

export interface CollegeDatabase {
  students: {
    key: number;
    value: Student;
  };
  teachers: {
    key: number;
    value: Teacher;
  };
  awards: {
    key: number;
    value: Award;
  };
  papers: {
    key: number;
    value: Paper;
  };
}

export async function initDB(): Promise<IDBPDatabase<CollegeDatabase>> {
  return openDB<CollegeDatabase>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // 学生存储
      if (!db.objectStoreNames.contains('students')) {
        db.createObjectStore('students', { keyPath: 'id' });
      }
      
      // 教师存储
      if (!db.objectStoreNames.contains('teachers')) {
        db.createObjectStore('teachers', { keyPath: 'id' });
      }
      
      // 获奖存储
      if (!db.objectStoreNames.contains('awards')) {
        db.createObjectStore('awards', { keyPath: 'id' });
      }
      
      // 论文存储
      if (!db.objectStoreNames.contains('papers')) {
        db.createObjectStore('papers', { keyPath: 'id' });
      }
    },
  });
}

// 学生相关操作
export async function saveStudent(student: Student): Promise<void> {
  const db = await initDB();
  await db.put('students', student);
}

export async function getAllStudents(): Promise<Student[]> {
  const db = await initDB();
  return db.getAll('students');
}

export async function getStudent(id: number): Promise<Student | undefined> {
  const db = await initDB();
  return db.get('students', id);
}

export async function deleteStudent(id: number): Promise<void> {
  const db = await initDB();
  await db.delete('students', id);
}

export async function clearStudents(): Promise<void> {
  const db = await initDB();
  const tx = db.transaction('students', 'readwrite');
  await tx.store.clear();
}

// 教师相关操作
export async function saveTeacher(teacher: Teacher): Promise<void> {
  const db = await initDB();
  await db.put('teachers', teacher);
}

export async function getAllTeachers(): Promise<Teacher[]> {
  const db = await initDB();
  return db.getAll('teachers');
}

export async function getTeacher(id: number): Promise<Teacher | undefined> {
  const db = await initDB();
  return db.get('teachers', id);
}

export async function deleteTeacher(id: number): Promise<void> {
  const db = await initDB();
  await db.delete('teachers', id);
}

export async function clearTeachers(): Promise<void> {
  const db = await initDB();
  const tx = db.transaction('teachers', 'readwrite');
  await tx.store.clear();
}

// 获奖相关操作
export async function saveAward(award: Award): Promise<void> {
  const db = await initDB();
  await db.put('awards', award);
}

export async function getAllAwards(): Promise<Award[]> {
  const db = await initDB();
  return db.getAll('awards');
}

export async function deleteAward(id: number): Promise<void> {
  const db = await initDB();
  await db.delete('awards', id);
}

export async function clearAwards(): Promise<void> {
  const db = await initDB();
  const tx = db.transaction('awards', 'readwrite');
  await tx.store.clear();
}

// 论文相关操作
export async function savePaper(paper: Paper): Promise<void> {
  const db = await initDB();
  await db.put('papers', paper);
}

export async function getAllPapers(): Promise<Paper[]> {
  const db = await initDB();
  return db.getAll('papers');
}

export async function deletePaper(id: number): Promise<void> {
  const db = await initDB();
  await db.delete('papers', id);
}

export async function clearPapers(): Promise<void> {
  const db = await initDB();
  const tx = db.transaction('papers', 'readwrite');
  await tx.store.clear();
}

// 清除所有缓存
export async function clearAllCache(): Promise<void> {
  await clearStudents();
  await clearTeachers();
  await clearAwards();
  await clearPapers();
}
