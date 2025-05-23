
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Student } from '@/types/types';
import { studentService } from '@/services/studentService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { Search, Edit, Trash, QrCode } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showQRDialog, setShowQRDialog] = useState(false);
  
  // Access control - redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Acesso Restrito",
        description: "Você precisa estar logado para acessar esta página.",
        variant: "destructive"
      });
      navigate('/login');
    } else if (userRole !== 'admin') {
      toast({
        title: "Acesso Restrito",
        description: "Apenas administradores podem acessar esta página.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [isAuthenticated, userRole, navigate]);
  
  // Load students
  useEffect(() => {
    const loadStudents = () => {
      const allStudents = studentService.getAll();
      setStudents(allStudents);
      setFilteredStudents(allStudents);
    };
    
    loadStudents();
  }, []);
  
  // Filter students when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students);
      return;
    }
    
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = students.filter(student => 
      student.name.toLowerCase().includes(lowercasedTerm) || 
      student.registration.toLowerCase().includes(lowercasedTerm) ||
      student.course.toLowerCase().includes(lowercasedTerm)
    );
    
    setFilteredStudents(filtered);
  }, [searchTerm, students]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleDeleteStudent = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      const success = studentService.delete(id);
      
      if (success) {
        // Update the local state
        setStudents(prev => prev.filter(student => student.id !== id));
        toast({
          title: "Sucesso",
          description: "Aluno excluído com sucesso.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o aluno.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleEditStudent = (id: string) => {
    // In a real application, this would navigate to an edit page
    // or open a modal with a form
    toast({
      title: "Edição",
      description: "Funcionalidade de edição a ser implementada.",
    });
  };
  
  const handleViewQRCode = (student: Student) => {
    setSelectedStudent(student);
    setShowQRDialog(true);
  };
  
  const handleRegisterStudent = () => {
    navigate('/register');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-school-800 mb-4 md:mb-0">Painel do Administrador</h1>
            <Button 
              onClick={handleRegisterStudent}
              className="bg-school-600 hover:bg-school-700"
            >
              Cadastrar Novo Aluno
            </Button>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-school-800">Alunos Cadastrados</CardTitle>
              <CardDescription>Gerencie os alunos registrados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Buscar por nome, matrícula ou curso..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden md:table-cell">Curso</TableHead>
                      <TableHead className="hidden md:table-cell">Ano/Série</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.registration}</TableCell>
                          <TableCell className="max-w-[150px] md:max-w-none truncate">{student.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{student.course}</TableCell>
                          <TableCell className="hidden md:table-cell">{student.grade}</TableCell>
                          <TableCell>
                            <div className={`
                              inline-block px-2 py-1 rounded-full text-xs
                              ${student.status === 'active' ? 'bg-green-100 text-green-800' : 
                                student.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                                'bg-red-100 text-red-800'}
                            `}>
                              {student.status === 'active' ? 'Ativo' : 
                               student.status === 'inactive' ? 'Inativo' : 'Suspenso'}
                            </div>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button 
                              size="icon"
                              variant="ghost"
                              onClick={() => handleViewQRCode(student)}
                              title="Gerar QR Code"
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEditStudent(student.id)}
                              title="Editar Aluno"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-500 hover:text-red-700"
                              title="Excluir Aluno"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          {searchTerm ? "Nenhum aluno encontrado." : "Nenhum aluno cadastrado."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code do Aluno</DialogTitle>
            <DialogDescription>
              QR Code para acesso à escola. Faça o download e entregue ao aluno.
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="py-4">
              <QRCodeGenerator student={selectedStudent} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboardPage;
