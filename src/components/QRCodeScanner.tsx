
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { QRCodeData, Student } from '@/types/types';
import { mockStudents } from '@/utils/mockData';
import { Check, X } from 'lucide-react';

const QRCodeScanner: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('entry');
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<QRCodeData | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [studentData, setStudentData] = useState<Student | null>(null);
  
  // Reset scan when changing tab
  useEffect(() => {
    resetScan();
  }, [activeTab]);
  
  // Mock function to simulate QR scanning
  // In a real app, you would use a library like react-qr-reader
  const simulateScan = () => {
    setScanning(true);
    
    // Show scanning animation for 2 seconds
    setTimeout(() => {
      // Random student from mock data
      const randomIndex = Math.floor(Math.random() * mockStudents.length);
      const student = mockStudents[randomIndex];
      
      // Create QR data
      const qrData: QRCodeData = {
        id: student.id,
        registration: student.registration,
        name: student.name,
        validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // Valid for 1 year
      };
      
      // Verify student
      const isAuthorized = student.status === 'active';
      
      setScanResult(qrData);
      setStudentData(student);
      setAuthorized(isAuthorized);
      setScanning(false);

      // Show toast with result
      toast({
        title: isAuthorized ? "Acesso Autorizado" : "Acesso Negado",
        description: isAuthorized 
          ? `Aluno ${student.name} autorizado para ${activeTab === 'entry' ? 'entrada' : 'saída'}.`
          : `Aluno ${student.name} não está autorizado. Status: ${student.status}.`,
        variant: isAuthorized ? "default" : "destructive"
      });
    }, 2000);
  };
  
  const resetScan = () => {
    setScanResult(null);
    setAuthorized(null);
    setStudentData(null);
    setScanning(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-school-800">Scanner QR Code</CardTitle>
        <CardDescription>Escaneie o QR code do aluno para verificar acesso</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="entry" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="entry">Entrada</TabsTrigger>
            <TabsTrigger value="exit">Saída</TabsTrigger>
          </TabsList>
          
          <TabsContent value="entry" className="mt-0">
            <div className="text-center space-y-4">
              <div className={`qr-scanner-container h-64 bg-gray-100 mx-auto 
                ${scanning ? 'animate-pulse-opacity' : ''}`}
              >
                <div className="qr-scanner-corners"></div>
                <div className="qr-scanner-corners-2"></div>
                
                {scanning && (
                  <div className="qr-scanner-line animate-scan"></div>
                )}
                
                {!scanning && !scanResult && (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">
                      Clique em "Escanear" para iniciar
                    </p>
                  </div>
                )}
                
                {!scanning && scanResult && (
                  <div className="flex flex-col items-center justify-center h-full">
                    {authorized ? (
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2">
                          <Check className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="font-semibold text-green-700">Acesso Autorizado</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-2">
                          <X className="h-6 w-6 text-red-600" />
                        </div>
                        <p className="font-semibold text-red-700">Acesso Negado</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {scanResult && studentData && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    {studentData.photo && (
                      <img 
                        src={studentData.photo} 
                        alt={studentData.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div className="text-left">
                      <h3 className="font-semibold">{scanResult.name}</h3>
                      <p className="text-sm text-gray-500">
                        Matrícula: {scanResult.registration}
                      </p>
                    </div>
                  </div>
                  
                  {!authorized && (
                    <p className="text-sm text-red-500 mt-2">
                      Motivo: Aluno com status {studentData.status}
                    </p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="exit" className="mt-0">
            <div className="text-center space-y-4">
              <div className={`qr-scanner-container h-64 bg-gray-100 mx-auto 
                ${scanning ? 'animate-pulse-opacity' : ''}`}
              >
                <div className="qr-scanner-corners"></div>
                <div className="qr-scanner-corners-2"></div>
                
                {scanning && (
                  <div className="qr-scanner-line animate-scan"></div>
                )}
                
                {!scanning && !scanResult && (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">
                      Clique em "Escanear" para iniciar
                    </p>
                  </div>
                )}
                
                {!scanning && scanResult && (
                  <div className="flex flex-col items-center justify-center h-full">
                    {authorized ? (
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2">
                          <Check className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="font-semibold text-green-700">Saída Autorizada</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-2">
                          <X className="h-6 w-6 text-red-600" />
                        </div>
                        <p className="font-semibold text-red-700">Saída Negada</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {scanResult && studentData && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    {studentData.photo && (
                      <img 
                        src={studentData.photo} 
                        alt={studentData.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div className="text-left">
                      <h3 className="font-semibold">{scanResult.name}</h3>
                      <p className="text-sm text-gray-500">
                        Matrícula: {scanResult.registration}
                      </p>
                    </div>
                  </div>
                  
                  {!authorized && (
                    <p className="text-sm text-red-500 mt-2">
                      Motivo: Aluno com status {studentData.status}
                    </p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={resetScan}
          disabled={scanning || !scanResult}
        >
          Limpar
        </Button>
        <Button 
          className="bg-school-600 hover:bg-school-700"
          onClick={simulateScan}
          disabled={scanning}
        >
          {scanning ? "Escaneando..." : "Escanear QR"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QRCodeScanner;
