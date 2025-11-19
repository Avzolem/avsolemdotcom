'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface YugiohAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const YugiohAuthContext = createContext<YugiohAuthContextType | undefined>(
  undefined
);

export function YugiohAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/yugioh/auth');
      setIsAuthenticated(response.ok);
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/yugioh/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/yugioh/auth', { method: 'DELETE' });
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <YugiohAuthContext.Provider
      value={{ isAuthenticated, isLoading, login, logout, checkAuth }}
    >
      {children}
    </YugiohAuthContext.Provider>
  );
}

export function useYugiohAuth() {
  const context = useContext(YugiohAuthContext);
  if (context === undefined) {
    throw new Error('useYugiohAuth must be used within a YugiohAuthProvider');
  }
  return context;
}
