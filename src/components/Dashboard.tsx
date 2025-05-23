
import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AccessLog from './AccessLog';
import QRCodeGenerator from './QRCodeGenerator';
import { Student } from '@/types/types';
import { mockAccessRecords, mockStudents } from '@/utils/mockData';

const Dashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.registration.includes(searchTerm)
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'suspended': return 'Suspenso';
      default: return status;
    }
  };

  // Statistics from access records
  const totalEntries = mockAccessRecords.filter(r => r.accessType === 'entry').length;
  const totalExits = mockAccessRecords.filter(r => r.accessType === 'exit').length;
  const deniedAccesses = mockAccessRecords.filter(r => !r.authorized).length;

  // Count active, inactive and suspended students
  const activeStudents = students.filter(s => s.status === 'active').length;
  const inactiveStudents = students.filter(s => s.status === 'inactive').length;
  const suspendedStudents = students.filter(s => s.status === 'suspended').length;

  const handleViewQRCode = (student: Student) => {
    setSelectedStudent(student);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alunos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudents}</div>
            <p className="text-xs text-muted-foreground">
              de {students.length} alunos cadastrados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Entradas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEntries}</div>
            <p className="text-xs text-muted-foreground">
              {deniedAccesses} acessos negados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saídas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExits}</div>
            <p className="text-xs text-muted-foreground">
              de {activeStudents} alunos ativos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs">Ativos</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">{activeStudents}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Inativos</span>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">{inactiveStudents}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Suspensos</span>
              <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">{suspendedStudents}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="students">Alunos</TabsTrigger>
          <TabsTrigger value="access">Histórico de Acessos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="students" className="space-y-4">
          <Input
            placeholder="Buscar alunos por nome ou matrícula"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map(student => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {student.photo ? (
                            <img 
                              src={student.photo} 
                              alt={student.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              {student.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.grade}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.registration}</TableCell>
                      <TableCell>{student.course}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(student.status)}>
                          {getStatusText(student.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewQRCode(student)}
                        >
                          Ver QR Code
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 px-6 py-3">
              <p className="text-sm text-gray-500">
                Mostrando {filteredStudents.length} de {students.length} alunos
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="access">
          <AccessLog accessRecords={mockAccessRecords} />
        </TabsContent>
      </Tabs>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code do Aluno</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <QRCodeGenerator student={selectedStudent} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
