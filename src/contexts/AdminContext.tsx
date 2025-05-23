import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AdminState } from '../types';

interface AdminContextType {
  adminState: AdminState;
  login: (password: string) => boolean;
  logout: () => void;
}

const ADMIN_PASSWORD = 'Niharuka1829';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [adminState, setAdminState] = useState<AdminState>(() => {
    const savedState = localStorage.getItem('adminState');
    return savedState ? JSON.parse(savedState) : { isAuthenticated: false };
  });

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      const newState = { isAuthenticated: true };
      setAdminState(newState);
      localStorage.setItem('adminState', JSON.stringify(newState));
      return true;
    }
    return false;
  };

  const logout = () => {
    const newState = { isAuthenticated: false };
    setAdminState(newState);
    localStorage.setItem('adminState', JSON.stringify(newState));
  };

  const value = {
    adminState,
    login,
    logout
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};