
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import RealQRScanner from '@/components/RealQRScanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Student } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Moon, Sun, QrCode, Activity } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { AccessLogService } from '@/services/accessLogService';

const ScannerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'entry' | 'exit'>('entry');
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Access control - redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Acesso Restrito",
        description: "Você precisa estar logado para acessar esta página.",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Update document height for mobile devices
  useEffect(() => {
    const updateViewportHeight = () => {
      // First we get the viewport height and multiply it by 1% to get a value for a vh unit
      const vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Add event listeners
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);
    
    // Initial call
    updateViewportHeight();
    
    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
    };
  }, []);

  const handleScanSuccess = (student: Student) => {
    console.log(`${activeTab === 'entry' ? 'Entrada' : 'Saída'} registrada para ${student.name}`);
    
    // Record this access in the database/localStorage
    AccessLogService.addRecord({
      studentId: student.id,
      studentName: student.name,
      accessType: activeTab,
      authorized: true
    });
    
    // Show toast notification
    toast({
      title: `${activeTab === 'entry' ? 'Entrada' : 'Saída'} Registrada`,
      description: `Registro salvo para ${student.name}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Header />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-4 md:py-8" style={{ minHeight: 'calc(100vh - 170px)' }}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4 md:mb-8">
            <div className="flex items-center">
              <QrCode className="mr-2 h-6 w-6 text-school-700 dark:text-school-300" />
              <h1 className="text-2xl md:text-3xl font-bold text-school-800 dark:text-white">Scanner QR Code</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-full"
                aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
              >
                {theme === 'dark' ? 
                  <Sun className="h-5 w-5 text-yellow-400" /> : 
                  <Moon className="h-5 w-5 text-slate-700" />
                }
              </Button>
            </div>
          </div>
          
          <div className="max-w-md mx-auto">
            <Tabs
              defaultValue="entry"
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as 'entry' | 'exit')}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-6 w-full">
                <TabsTrigger value="entry" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Entrada
                </TabsTrigger>
                <TabsTrigger value="exit" className="flex items-center gap-2">
                  <Activity className="h-4 w-4 rotate-180" />
                  Saída
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="entry">
                <div className="p-0 sm:p-2 md:p-4">
                  <RealQRScanner 
                    accessType="entry"
                    onScanSuccess={handleScanSuccess}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="exit">
                <div className="p-0 sm:p-2 md:p-4">
                  <RealQRScanner 
                    accessType="exit"
                    onScanSuccess={handleScanSuccess}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="py-2 text-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
        <p>Sistema de Controle de Acesso v1.0</p>
      </footer>
    </div>
  );
};

export default ScannerPage;
