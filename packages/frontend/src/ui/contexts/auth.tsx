import { USER_ROLES } from '@domain/constants/user';
import { User } from '@domain/entities/User';
import { AuthRepository } from '@domain/repositories/AuthRepository';
import { AuthApiRepository } from '@infrastructure/api/AuthApiRepository';
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@/ui/hooks/useToast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: { email: string; password: string; username: string }) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const authRepository = useMemo<AuthRepository>(() => new AuthApiRepository(), []);
  const toast = useToast();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const currentUser = await authRepository.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [authRepository]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const user = await authRepository.login(email, password);
      setUser(user);
      toast.success('Inicio de sesión exitoso');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error al iniciar sesión');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authRepository.logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { email: string; password: string; username: string }) => {
    try {
      setIsLoading(true);
      await authRepository.register({
        ...userData,
        role: USER_ROLES.USER
      });
      toast.success('Registro exitoso. Por favor inicia sesión.');
      navigate('/login');
    } catch (error) {
      toast.error('Error al registrarse');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      await authRepository.forgotPassword(email);
      toast.success('Se ha enviado un correo con las instrucciones para restablecer tu contraseña');
    } catch (error) {
      toast.error('Error al procesar la solicitud');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        forgotPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 