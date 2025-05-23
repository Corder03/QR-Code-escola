
import { AccessRecord } from '@/types/types';

const STORAGE_KEY = 'escola_qr_access_logs';

export const AccessLogService = {
  getAllRecords: (): AccessRecord[] => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return [];
  },
  
  getRecordsByStudentId: (studentId: string): AccessRecord[] => {
    const records = AccessLogService.getAllRecords();
    return records.filter(record => record.studentId === studentId);
  },
  
  getLatestRecords: (limit: number = 20): AccessRecord[] => {
    const records = AccessLogService.getAllRecords();
    return records
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  },
  
  addRecord: (data: Omit<AccessRecord, 'id' | 'timestamp'>): AccessRecord => {
    const records = AccessLogService.getAllRecords();
    
    // Generate a unique ID
    const newId = (records.length > 0) 
      ? String(Math.max(...records.map(r => Number(r.id))) + 1) 
      : '1';
    
    const newRecord: AccessRecord = {
      id: newId,
      ...data,
      timestamp: new Date()
    };
    
    // Add to array and persist
    records.push(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    
    return newRecord;
  },
  
  deleteRecord: (id: string): boolean => {
    const records = AccessLogService.getAllRecords();
    const filteredRecords = records.filter(record => record.id !== id);
    
    if (filteredRecords.length === records.length) {
      return false; // Nothing was deleted
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
    return true;
  },
  
  clearAllRecords: (): boolean => {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  }
};
