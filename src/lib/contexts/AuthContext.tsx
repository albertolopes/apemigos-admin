'use client';

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
} from 'react';
import { getToken, setToken, removeToken } from '../services/authService'; // Caminho ajustado

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Inicia como false, será verificado no useEffect
  const [isClient, setIsClient] = useState(false); // Para garantir que localStorage só seja acessado no cliente

  React.useEffect(() => {
    setIsClient(true);
    if (getToken()) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string) => {
    setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
