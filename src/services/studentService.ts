
import { Student } from '@/types/types';
import { mockStudents } from '@/utils/mockData';

// In a real application, this would be connected to a backend API
// For demo purposes, we'll use localStorage to persist data

const STORAGE_KEY = 'escola_qr_students';

export const studentService = {
  getAll: (): Student[] => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
    
    // Initialize with mock data if nothing is stored
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockStudents));
    return mockStudents;
  },
  
  getById: (id: string): Student | null => {
    const students = studentService.getAll();
    return students.find(student => student.id === id) || null;
  },
  
  getByRegistration: (registration: string): Student | null => {
    const students = studentService.getAll();
    return students.find(student => student.registration === registration) || null;
  },
  
  create: (student: Omit<Student, 'id' | 'createdAt'>): Student => {
    const students = studentService.getAll();
    
    // Generate a unique ID
    const newId = (students.length > 0) 
      ? String(Math.max(...students.map(s => Number(s.id))) + 1) 
      : '1';
    
    const newStudent: Student = {
      id: newId,
      ...student,
      createdAt: new Date()
    };
    
    // Add to array and persist
    students.push(newStudent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    
    return newStudent;
  },
  
  update: (id: string, data: Partial<Student>): Student | null => {
    const students = studentService.getAll();
    const index = students.findIndex(student => student.id === id);
    
    if (index === -1) return null;
    
    // Update student data
    students[index] = { ...students[index], ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    
    return students[index];
  },
  
  delete: (id: string): boolean => {
    const students = studentService.getAll();
    const filteredStudents = students.filter(student => student.id !== id);
    
    if (filteredStudents.length === students.length) {
      return false; // Nothing was deleted
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredStudents));
    return true;
  }
};
