
import { Student, AccessRecord } from "../types/types";

// Generate some mock students
export const mockStudents: Student[] = [
  {
    id: "1",
    name: "João Silva",
    registration: "20210001",
    course: "Engenharia de Software",
    status: "active",
    photo: "https://i.pravatar.cc/150?img=1",
    grade: "3° ano",
    createdAt: new Date("2021-02-15")
  },
  {
    id: "2",
    name: "Maria Oliveira",
    registration: "20210002",
    course: "Ciência da Computação",
    status: "active",
    photo: "https://i.pravatar.cc/150?img=5",
    grade: "2° ano",
    createdAt: new Date("2021-02-15")
  },
  {
    id: "3",
    name: "Pedro Santos",
    registration: "20190015",
    course: "Sistemas de Informação",
    status: "active",
    photo: "https://i.pravatar.cc/150?img=3",
    grade: "4° ano",
    createdAt: new Date("2019-02-10")
  },
  {
    id: "4",
    name: "Ana Souza",
    registration: "20220045",
    course: "Engenharia de Software",
    status: "active",
    photo: "https://i.pravatar.cc/150?img=4",
    grade: "1° ano",
    createdAt: new Date("2022-02-15")
  },
  {
    id: "5",
    name: "Lucas Ferreira",
    registration: "20200078",
    course: "Ciência da Computação",
    status: "suspended",
    photo: "https://i.pravatar.cc/150?img=7",
    grade: "3° ano",
    createdAt: new Date("2020-02-18")
  }
];

// Generate some mock access records
export const mockAccessRecords: AccessRecord[] = [
  {
    id: "a1",
    studentId: "1",
    studentName: "João Silva",
    timestamp: new Date("2023-05-10T07:45:00"),
    accessType: "entry",
    authorized: true
  },
  {
    id: "a2",
    studentId: "1",
    studentName: "João Silva",
    timestamp: new Date("2023-05-10T16:30:00"),
    accessType: "exit",
    authorized: true
  },
  {
    id: "a3",
    studentId: "2",
    studentName: "Maria Oliveira",
    timestamp: new Date("2023-05-10T08:05:00"),
    accessType: "entry",
    authorized: true
  },
  {
    id: "a4",
    studentId: "3",
    studentName: "Pedro Santos",
    timestamp: new Date("2023-05-10T07:55:00"),
    accessType: "entry",
    authorized: true
  },
  {
    id: "a5",
    studentId: "5",
    studentName: "Lucas Ferreira",
    timestamp: new Date("2023-05-10T08:15:00"),
    accessType: "entry",
    authorized: false
  },
  {
    id: "a6",
    studentId: "3",
    studentName: "Pedro Santos",
    timestamp: new Date("2023-05-10T16:45:00"),
    accessType: "exit",
    authorized: true
  }
];
