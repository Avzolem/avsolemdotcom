'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ToastData {
  id: number;
  message: string | ReactNode;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  toasts: ToastData[];
  showToast: (message: string | ReactNode, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

let toastIdCounter = 0;

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((message: string | ReactNode, type: 'success' | 'error' | 'info' = 'success') => {
    const id = toastIdCounter++;
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
