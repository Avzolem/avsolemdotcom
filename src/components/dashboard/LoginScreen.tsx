'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Lock, LogIn, Loader2 } from 'lucide-react';
import { useDashboardAuth } from '@/contexts/DashboardAuthContext';

export function LoginScreen() {
  const { login } = useDashboardAuth();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || status === 'submitting') return;
    setStatus('submitting');
    setError('');
    const result = await login(password);
    if (!result.success) {
      setError(result.error || 'Error');
      setStatus('idle');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-950">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col gap-5"
      >
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/images/logo/avsolem-light.webp"
            alt="avsolem."
            width={385}
            height={68}
            className="h-8 w-auto"
            priority
          />
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-cyan-400">
            <Lock className="w-3.5 h-3.5" />
            Dashboard
          </div>
        </div>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full px-4 py-2.5 rounded-lg bg-gray-950 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white placeholder:text-gray-500"
        />
        {error && <div className="text-sm text-red-400">{error}</div>}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 text-white text-sm font-medium transition-colors"
        >
          {status === 'submitting' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogIn className="w-4 h-4" />
          )}
          Entrar
        </button>
      </form>
    </div>
  );
}
