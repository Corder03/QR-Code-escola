
import React, { createContext, useState, useContext, useEffect } from 'react';

type UserRole = 'admin' | 'gatekeeper' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (username: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  user: {
    name: string;
    role: UserRole;
  } | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  login: () => false,
  logout: () => {},
  user: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [user, setUser] = useState<{ name: string; role: UserRole } | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const storedAuth = localStorage.getItem('authData');
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      setIsAuthenticated(true);
      setUserRole(parsedAuth.role);
      setUser({ name: parsedAuth.name, role: parsedAuth.role });
    }
  }, []);

  const login = (username: string, password: string, role: UserRole): boolean => {
    // For demo purposes, using hardcoded credentials
    // In a real app, this would validate against a backend
    let isValid = false;

    if (role === 'admin' && username === 'admin' && password === 'admin123') {
      isValid = true;
      setUser({ name: 'Administrador', role: 'admin' });
    } else if (role === 'gatekeeper' && username === 'porteiro' && password === 'porteiro123') {
      isValid = true;
      setUser({ name: 'Porteiro', role: 'gatekeeper' });
    }

    if (isValid) {
      setIsAuthenticated(true);
      setUserRole(role);
      
      // Store auth data in localStorage
      localStorage.setItem('authData', JSON.stringify({
        name: role === 'admin' ? 'Administrador' : 'Porteiro',
        role,
      }));
    }

    return isValid;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUser(null);
    localStorage.removeItem('authData');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
