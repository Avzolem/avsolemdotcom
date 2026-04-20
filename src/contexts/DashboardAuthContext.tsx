'use client';

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

interface Ctx {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const DashboardAuthContext = createContext<Ctx | undefined>(undefined);

export function DashboardAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/dashboard/auth');
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (password: string) => {
    try {
      const res = await fetch('/api/dashboard/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        return { success: true };
      }
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.error || 'Error de autenticación' };
    } catch {
      return { success: false, error: 'Error de conexión' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/dashboard/auth', { method: 'DELETE' });
    } catch {}
    setIsAuthenticated(false);
  }, []);

  return (
    <DashboardAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </DashboardAuthContext.Provider>
  );
}

export function useDashboardAuth() {
  const ctx = useContext(DashboardAuthContext);
  if (!ctx) throw new Error('useDashboardAuth must be used within DashboardAuthProvider');
  return ctx;
}
