'use client';

import { useState, FormEvent } from 'react';

export function NotePasswordForm({ slug }: { slug: string }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!password) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/n/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, password }),
      });
      if (res.ok) {
        window.location.reload();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data?.error || 'Contraseña incorrecta');
      setSubmitting(false);
    } catch {
      setError('Error de red');
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-5">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">notas</div>
          <h1 className="text-xl font-medium text-gray-100">Esta página requiere contraseña</h1>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          placeholder="Contraseña"
          className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 transition-colors"
        />
        {error && <div className="text-sm text-red-400 text-center">{error}</div>}
        <button
          type="submit"
          disabled={submitting || !password}
          className="w-full py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
        >
          {submitting ? 'Validando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
