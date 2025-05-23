
import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, AlertCircle, Camera, ScanLine } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { QRCodeData, Student } from '@/types/types';
import { studentService } from '@/services/studentService';
import { useTheme } from '@/hooks/use-theme';

interface RealQRScannerProps {
  onScanSuccess?: (student: Student) => void;
  accessType: 'entry' | 'exit';
}

const RealQRScanner: React.FC<RealQRScannerProps> = ({ 
  onScanSuccess: handleScanSuccessCallback,
  accessType 
}) => {
  const [scanning, setScanning] = useState<boolean>(false);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const [scanResult, setScanResult] = useState<QRCodeData | null>(null);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const qrElementRef = useRef<HTMLDivElement | null>(null);

  // Cleanup QR scanner on unmount
  useEffect(() => {
    return () => {
      stopScannerAndCleanup();
    };
  }, []);

  // Separate cleanup function to ensure proper resource management
  const stopScannerAndCleanup = async () => {
    try {
      if (html5QrCode && html5QrCode.isScanning) {
        console.log("Stopping scanner...");
        await html5QrCode.stop();
        setHtml5QrCode(null);
      }
    } catch (err) {
      console.error("Error stopping scanner:", err);
    } finally {
      setScanning(false);
    }
  };

  const startScanner = async () => {
    try {
      // Reset state before starting
      setScanning(true);
      setError(null);
      setScanResult(null);
      setStudentData(null);
      setAuthorized(null);
      
      // Ensure any previous scanner is properly stopped
      await stopScannerAndCleanup();
      
      // Check if container ref exists
      if (!qrContainerRef.current) {
        console.error("QR container ref is not available");
        setError("Unable to initialize scanner");
        setScanning(false);
        return;
      }
      
      // Create a unique ID for this scanner instance
      const qrCodeId = `qr-reader-${Date.now()}`;
      
      // Clear previous content safely
      while (qrContainerRef.current.firstChild) {
        qrContainerRef.current.removeChild(qrContainerRef.current.firstChild);
      }
      
      // Create a new container for the QR scanner
      const qrElement = document.createElement('div');
      qrElement.id = qrCodeId;
      qrElement.style.width = '100%';
      qrElement.style.height = '100%';
      qrContainerRef.current.appendChild(qrElement);
      qrElementRef.current = qrElement;
      
      // Optimize scanning configuration for better performance
      const qrConfig = { 
        fps: 10, // Lower for better performance
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        formatsToSupport: ['QR_CODE'],
        disableFlip: false,
      };

      try {
        // Create new scanner instance
        const newQrCode = new Html5Qrcode(qrCodeId);
        setHtml5QrCode(newQrCode);
        
        // Apply camera settings
        const cameraConfig = {
          facingMode: "environment", // Use rear camera if available
        };
        
        await newQrCode.start(
          cameraConfig,
          qrConfig,
          handleQrCodeSuccess,
          handleScanError
        );
      } catch (cameraError) {
        console.error("Camera access error:", cameraError);
        setError("Unable to access camera. Please check your permissions and try again.");
        setScanning(false);
        toast({
          title: "Erro na Câmera",
          description: "Não foi possível acessar sua câmera. Verifique as permissões.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Error initializing scanner:", err);
      setError("Erro ao inicializar o scanner.");
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    await stopScannerAndCleanup();
    
    // Safely clean up the DOM
    if (qrContainerRef.current) {
      // Use a safer way to clear the container
      while (qrContainerRef.current.firstChild) {
        qrContainerRef.current.removeChild(qrContainerRef.current.firstChild);
      }
    }
  };

  const handleQrCodeSuccess = (decodedText: string) => {
    try {
      // Pause scanning after successful scan
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.pause();
      }
      
      // Parse QR code data
      const qrData = JSON.parse(decodedText) as QRCodeData;
      setScanResult(qrData);
      
      // Verify if it's a valid student QR code
      if (!qrData.id || !qrData.registration || !qrData.name) {
        throw new Error("QR Code inválido");
      }
      
      // Check if QR code is expired
      const validUntil = new Date(qrData.validUntil);
      if (validUntil < new Date()) {
        setAuthorized(false);
        toast({
          title: "QR Code Expirado",
          description: "Este QR Code já não é mais válido.",
          variant: "destructive"
        });
        stopScanner();
        return;
      }
      
      // Get student from storage
      const student = studentService.getById(qrData.id);
      
      if (!student) {
        setAuthorized(false);
        toast({
          title: "Aluno Não Encontrado",
          description: "Este QR Code não pertence a nenhum aluno cadastrado.",
          variant: "destructive"
        });
        stopScanner();
        return;
      }

      setStudentData(student);
      
      // Check if student is authorized
      const isAuthorized = student.status === 'active';
      setAuthorized(isAuthorized);
      
      // Notify parent component
      if (isAuthorized && handleScanSuccessCallback) {
        handleScanSuccessCallback(student);
      }
      
      toast({
        title: isAuthorized ? "Acesso Autorizado" : "Acesso Negado",
        description: isAuthorized 
          ? `Aluno ${student.name} autorizado para ${accessType === 'entry' ? 'entrada' : 'saída'}.`
          : `Aluno ${student.name} não está autorizado. Status: ${student.status}.`,
        variant: isAuthorized ? "default" : "destructive"
      });
      
      stopScanner();
    } catch (err) {
      console.error("Error processing QR code:", err);
      setScanResult(null);
      setStudentData(null);
      setAuthorized(null);
      setError("QR Code inválido ou danificado");
      toast({
        title: "Erro na Leitura",
        description: "Formato de QR Code inválido.",
        variant: "destructive"
      });
      stopScanner();
    }
  };

  const handleScanError = (err: any) => {
    // This is called continuously, so we don't want to set state or show toasts here
    // unless it's a critical error
    if (err?.name === 'NotAllowedError') {
      stopScanner();
      setError("Acesso à câmera negado. Verifique as configurações do seu navegador.");
      toast({
        title: "Acesso Negado",
        description: "Permissão de câmera negada.",
        variant: "destructive"
      });
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setStudentData(null);
    setAuthorized(null);
    setError(null);
    stopScanner();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-school-800 dark:text-school-100">
          Scanner QR Code ({accessType === 'entry' ? 'Entrada' : 'Saída'})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="w-full max-w-sm mb-4 relative">
          {/* QR Code Scanner Container */}
          <div 
            ref={qrContainerRef}
            className="w-full h-64 relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700"
          >
            {/* Scanner UI overlay */}
            {scanning && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                <div className="border-2 border-school-500 w-48 h-48 rounded-lg relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-school-500"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-school-500"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-school-500"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-school-500"></div>
                  <div className="absolute top-0 left-0 w-full border-t border-school-500 animate-qrScan"></div>
                </div>
                <p className="text-school-700 dark:text-school-300 font-medium mt-4 bg-white/50 dark:bg-black/50 px-2 py-1 rounded">Posicione o QR Code no centro</p>
              </div>
            )}
            
            {/* Result or Error Display */}
            {!scanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                {error && (
                  <div className="text-center p-4">
                    <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-2" />
                    <p className="text-red-700 dark:text-red-400">{error}</p>
                  </div>
                )}
                
                {!error && !scanResult && (
                  <div className="text-center p-4 flex flex-col items-center">
                    <Camera className="h-12 w-12 text-gray-500 dark:text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Clique em "Iniciar Scanner" para começar</p>
                  </div>
                )}
                
                {scanResult && (
                  <div className="text-center">
                    {authorized ? (
                      <div className="flex flex-col items-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-800 mb-2">
                          <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="font-semibold text-green-700 dark:text-green-400">Acesso Autorizado</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-800 mb-2">
                          <X className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <p className="font-semibold text-red-700 dark:text-red-400">Acesso Negado</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {scanResult && studentData && (
            <div className="mt-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                {studentData.photo && (
                  <img 
                    src={studentData.photo} 
                    alt={studentData.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div className="text-left">
                  <h3 className="font-semibold dark:text-white">{scanResult.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Matrícula: {scanResult.registration}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {studentData.course} - {studentData.grade}
                  </p>
                </div>
              </div>
              
              {!authorized && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-2">
                  Motivo: Aluno com status {studentData.status}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={resetScan}
          disabled={scanning || (!scanResult && !error)}
          className="dark:text-white dark:hover:bg-gray-700"
        >
          Limpar
        </Button>
        
        {!scanning ? (
          <Button 
            className="bg-school-600 hover:bg-school-700 dark:bg-school-700 dark:hover:bg-school-600 flex items-center gap-2"
            onClick={startScanner}
          >
            <Camera size={18} />
            Iniciar Scanner
          </Button>
        ) : (
          <Button 
            variant="destructive"
            onClick={stopScanner}
          >
            Parar Scanner
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RealQRScanner;
