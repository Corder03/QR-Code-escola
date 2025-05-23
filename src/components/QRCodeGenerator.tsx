
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QRCodeData, Student } from '@/types/types';
import { toast } from '@/hooks/use-toast';
import { Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';  // Fixed import

interface QRCodeGeneratorProps {
  student: Student;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ student }) => {
  const generateQRCodeData = (): QRCodeData => {
    // Create QR code data
    return {
      id: student.id,
      registration: student.registration,
      name: student.name,
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // Valid for 1 year
    };
  };

  const qrData = generateQRCodeData();
  const qrValue = JSON.stringify(qrData);

  const downloadQRCode = () => {
    try {
      const canvas = document.getElementById('student-qrcode') as HTMLCanvasElement;
      if (!canvas) return;

      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qrcode-${student.registration}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast({
        title: "Download Iniciado",
        description: "O QR Code foi baixado com sucesso.",
      });
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast({
        title: "Erro",
        description: "Não foi possível baixar o código QR",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-school-800">Código QR do Aluno</CardTitle>
        <CardDescription>QR Code para acesso à escola</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="space-y-4 flex flex-col items-center">
          <div className="border-2 border-school-200 p-4 rounded-lg bg-white">
            <QRCodeCanvas
              id="student-qrcode"
              value={qrValue}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold">{student.name}</h3>
            <p className="text-sm text-gray-500">Matrícula: {student.registration}</p>
            <p className="text-sm text-gray-500">{student.course} - {student.grade}</p>
            <p className="text-xs text-gray-400 mt-1">
              Válido até: {new Date(qrData.validUntil).toLocaleDateString()}
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={downloadQRCode}
            className="flex items-center gap-2 border-school-500 text-school-700 hover:bg-school-50"
          >
            <Download className="h-4 w-4" /> 
            Download QR Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
