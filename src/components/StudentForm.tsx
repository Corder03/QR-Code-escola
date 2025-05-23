
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Student } from '@/types/types';
import { studentService } from '@/services/studentService';
import { useAuth } from '@/contexts/AuthContext';
import QRCodeGenerator from './QRCodeGenerator';

const StudentForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, userRole } = useAuth();
  const [showQRDialog, setShowQRDialog] = useState<boolean>(false);
  const [createdStudent, setCreatedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    registration: '',
    course: '',
    grade: '',
    status: 'active',
    photo: ''
  });

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
        description: "Apenas administradores podem cadastrar alunos.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.registration || !formData.course || !formData.grade) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if registration already exists
    if (studentService.getByRegistration(formData.registration)) {
      toast({
        title: "Erro",
        description: "Número de matrícula já cadastrado.",
        variant: "destructive"
      });
      return;
    }

    // Create new student
    try {
      const newStudent = studentService.create({
        name: formData.name,
        registration: formData.registration,
        course: formData.course,
        grade: formData.grade,
        status: formData.status as 'active' | 'inactive' | 'suspended',
        photo: formData.photo || undefined
      });

      setCreatedStudent(newStudent);
      
      // Show success message
      toast({
        title: "Sucesso",
        description: "Aluno cadastrado com sucesso!",
      });
      
      // Open QR code dialog
      setShowQRDialog(true);
      
      // Reset form
      setFormData({
        name: '',
        registration: '',
        course: '',
        grade: '',
        status: 'active',
        photo: ''
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cadastrar o aluno.",
        variant: "destructive"
      });
      console.error(error);
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-school-800">Cadastro de Aluno</CardTitle>
          <CardDescription>Cadastre um novo aluno no sistema</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input 
                id="name"
                name="name"
                placeholder="Nome do aluno"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="registration">Número de Matrícula</Label>
              <Input 
                id="registration"
                name="registration"
                placeholder="ex: 20220001"
                value={formData.registration}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Curso</Label>
                <Select
                  onValueChange={(value) => handleSelectChange('course', value)}
                  value={formData.course}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engenharia de Software">Engenharia de Software</SelectItem>
                    <SelectItem value="Ciência da Computação">Ciência da Computação</SelectItem>
                    <SelectItem value="Sistemas de Informação">Sistemas de Informação</SelectItem>
                    <SelectItem value="Análise e Desenvolvimento de Sistemas">Análise e Desenvolvimento de Sistemas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="grade">Série/Ano</Label>
                <Select
                  onValueChange={(value) => handleSelectChange('grade', value)}
                  value={formData.grade}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1° ano">1° ano</SelectItem>
                    <SelectItem value="2° ano">2° ano</SelectItem>
                    <SelectItem value="3° ano">3° ano</SelectItem>
                    <SelectItem value="4° ano">4° ano</SelectItem>
                    <SelectItem value="5° ano">5° ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) => handleSelectChange('status', value)}
                defaultValue="active"
                value={formData.status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="photo">URL da Foto (opcional)</Label>
              <Input 
                id="photo"
                name="photo"
                placeholder="URL da foto do aluno"
                value={formData.photo}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="w-full bg-school-600 hover:bg-school-700">
              Cadastrar Aluno
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code Gerado</DialogTitle>
            <DialogDescription>
              QR Code para acesso à escola foi gerado com sucesso. Faça o download e entregue ao aluno.
            </DialogDescription>
          </DialogHeader>
          
          {createdStudent && (
            <div className="py-4">
              <QRCodeGenerator student={createdStudent} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudentForm;
