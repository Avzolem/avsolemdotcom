'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  newsletterSubscribed?: boolean;
  language?: 'es' | 'en';
}

interface YugiohAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithCredentials: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string, language?: 'es' | 'en', subscribeNewsletter?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateSession: () => Promise<void>;
}

const YugiohAuthContext = createContext<YugiohAuthContextType | undefined>(
  undefined
);

export function YugiohAuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status, update } = useSession();
  const [registerError, setRegisterError] = useState<string | null>(null);

  const isLoading = status === 'loading';
  const isAuthenticated = !!session?.user;

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.name,
        image: session.user.image,
        newsletterSubscribed: session.user.newsletterSubscribed,
        language: session.user.language,
      }
    : null;

  const signInWithGoogle = useCallback(async () => {
    await signIn('google', { callbackUrl: '/yugioh' });
  }, []);

  const signInWithCredentials = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          return { success: false, error: result.error };
        }

        return { success: true };
      } catch (error) {
        console.error('Sign in error:', error);
        return { success: false, error: 'UNKNOWN_ERROR' };
      }
    },
    []
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      language: 'es' | 'en' = 'es',
      subscribeNewsletter: boolean = false
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await fetch('/api/yugioh/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            name,
            language,
            subscribeNewsletter,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          return { success: false, error: data.message || 'REGISTRATION_FAILED' };
        }

        // Auto sign in after registration
        const signInResult = await signInWithCredentials(email, password);
        return signInResult;
      } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: 'UNKNOWN_ERROR' };
      }
    },
    [signInWithCredentials]
  );

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: '/yugioh' });
  }, []);

  const updateSession = useCallback(async () => {
    await update();
  }, [update]);

  return (
    <YugiohAuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        signInWithGoogle,
        signInWithCredentials,
        register,
        logout,
        updateSession,
      }}
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
