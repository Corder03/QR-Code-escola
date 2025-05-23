
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-blue-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h1 className="text-4xl md:text-5xl font-bold text-school-800 mb-4">
                  Controle de Acesso Escolar
                </h1>
                <p className="text-xl text-gray-700 mb-6">
                  Sistema seguro de verificação de acesso escolar utilizando QR Code.
                  Monitore a entrada e saída de alunos em tempo real.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register">
                    <Button className="bg-school-600 hover:bg-school-700 text-white rounded-md px-6 py-3 font-medium">
                      Cadastrar Aluno
                    </Button>
                  </Link>
                  <Link to="/scanner">
                    <Button variant="outline" className="border-school-600 text-school-700 hover:bg-school-50 rounded-md px-6 py-3 font-medium">
                      Escanear QR Code
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="bg-white p-4 rounded-lg shadow-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Estudantes na escola" 
                    className="rounded-md w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-school-800 mb-12">
              Recursos do Sistema
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transform transition hover:-translate-y-1">
                <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-school-700">
                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-school-800">Segurança</h3>
                <p className="text-gray-600">
                  Garanta que apenas alunos autorizados tenham acesso à escola,
                  aumentando a segurança de todos.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transform transition hover:-translate-y-1">
                <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-school-700">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    <path d="M7 8h10"></path>
                    <path d="M7 12h10"></path>
                    <path d="M7 16h10"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-school-800">Monitoramento</h3>
                <p className="text-gray-600">
                  Acompanhe em tempo real a entrada e saída dos alunos, com histórico completo
                  de acessos.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transform transition hover:-translate-y-1">
                <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-school-700">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <path d="M9 15v-2"></path>
                    <path d="M12 15v-6"></path>
                    <path d="M15 15v-4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-school-800">Relatórios</h3>
                <p className="text-gray-600">
                  Gere relatórios detalhados de presença e pontualidade dos alunos,
                  facilitando a gestão escolar.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-school-800 mb-4">
              Como Funciona
            </h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
              Nosso sistema é simples e eficiente para garantir a segurança no acesso à escola
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border border-gray-100">
                  <span className="text-2xl font-bold text-school-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Cadastro</h3>
                <p className="text-gray-600">
                  Cadastre os alunos no sistema com suas informações e foto.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border border-gray-100">
                  <span className="text-2xl font-bold text-school-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">QR Code</h3>
                <p className="text-gray-600">
                  Gere QR Codes únicos para cada aluno registrado no sistema.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border border-gray-100">
                  <span className="text-2xl font-bold text-school-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Verificação</h3>
                <p className="text-gray-600">
                  Na entrada da escola, escaneie o QR Code do estudante.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border border-gray-100">
                  <span className="text-2xl font-bold text-school-600">4</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Acesso</h3>
                <p className="text-gray-600">
                  O sistema verifica e autoriza o acesso de alunos cadastrados.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-school-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Pronto para melhorar a segurança da sua escola?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-school-100">
              Implemente nosso sistema de controle de acesso e tenha total visibilidade
              sobre quem entra e sai da sua instituição de ensino.
            </p>
            <Link to="/dashboard">
              <Button className="bg-white text-school-800 hover:bg-gray-100 rounded-md px-6 py-3 font-medium text-base">
                Acessar o Dashboard
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-school-600 text-white p-1 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-school">
                  <path d="m4 6 8-4 8 4"></path>
                  <path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"></path>
                  <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"></path>
                  <path d="M18 5v17"></path>
                  <path d="M6 5v17"></path>
                  <circle cx="12" cy="9" r="2"></circle>
                </svg>
              </div>
              <span className="font-semibold text-school-800">EscolaQR</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Sistema de Controle de Acesso Escolar. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
