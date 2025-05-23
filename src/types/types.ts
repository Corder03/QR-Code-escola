
export interface Student {
  id: string;
  name: string;
  registration: string;
  course: string;
  status: 'active' | 'inactive' | 'suspended';
  photo?: string;
  grade: string;
  createdAt: Date;
}

export interface AccessRecord {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: Date;
  accessType: 'entry' | 'exit';
  authorized: boolean;
}

export interface QRCodeData {
  id: string;
  registration: string;
  name: string;
  validUntil: Date;
}
