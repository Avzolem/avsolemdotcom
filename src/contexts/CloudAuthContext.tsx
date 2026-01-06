'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface CloudAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const CloudAuthContext = createContext<CloudAuthContextType | undefined>(undefined);

export function CloudAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/cloud/auth');
      setIsAuthenticated(response.ok);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/cloud/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, error: data.error || 'Error de autenticacion' };
      }
    } catch {
      return { success: false, error: 'Error de conexion' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/cloud/auth', { method: 'DELETE' });
    } catch {
      // Ignore errors
    }
    setIsAuthenticated(false);
  }, []);

  return (
    <CloudAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </CloudAuthContext.Provider>
  );
}

export function useCloudAuth() {
  const context = useContext(CloudAuthContext);
  if (context === undefined) {
    throw new Error('useCloudAuth must be used within a CloudAuthProvider');
  }
  return context;
}
