
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user, userRole } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path ? "text-school-700 font-semibold" : "text-gray-600 hover:text-school-600";
  };
  
  const navigationItems = [
    { name: "Início", path: "/", showFor: null },
    { name: "Dashboard", path: "/dashboard", showFor: null },
    { name: "Painel Admin", path: "/admin", showFor: 'admin' },
    { name: "Cadastrar Aluno", path: "/register", showFor: 'admin' },
    { name: "Scanner QR", path: "/scanner", showFor: null }
  ];
  
  const filteredNavItems = navigationItems.filter(item => 
    item.showFor === null || (user && item.showFor === user.role)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-school-600 text-white p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-school">
                <path d="m4 6 8-4 8 4"></path>
                <path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"></path>
                <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"></path>
                <path d="M18 5v17"></path>
                <path d="M6 5v17"></path>
                <circle cx="12" cy="9" r="2"></circle>
              </svg>
            </div>
            <span className="font-bold text-xl text-school-800">EscolaQR</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {filteredNavItems.map(item => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`${isActive(item.path)} transition-colors duration-200 font-medium`}
              >
                {item.name}
              </Link>
            ))}

            {!isAuthenticated ? (
              <Button 
                variant="default" 
                className="bg-school-600 hover:bg-school-700"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                  {user?.name} ({userRole === 'admin' ? 'Admin' : 'Porteiro'})
                </span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleLogout}
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pt-4 pb-3 space-y-3">
            {filteredNavItems.map(item => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`${isActive(item.path)} block py-2 px-3 rounded-md hover:bg-gray-50`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {!isAuthenticated ? (
              <Button 
                variant="default" 
                className="w-full bg-school-600 hover:bg-school-700 mt-2"
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
              >
                Login
              </Button>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 mt-2">
                <span className="text-sm font-medium px-3">
                  {user?.name} ({userRole === 'admin' ? 'Admin' : 'Porteiro'})
                </span>
                <Button 
                  variant="outline"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
