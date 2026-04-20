'use client';

import { useState } from 'react';
import { Mail, Send, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BentoCard } from './BentoCard';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactFormCard() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value.trim(),
      company: (form.elements.namedItem('company') as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem('email') as HTMLInputElement).value.trim(),
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value.trim(),
    };
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Request failed');
      }
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError((err as Error).message);
    }
  }

  return (
    <BentoCard accent="cyan" className="md:row-span-2">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
        <Mail className="w-3.5 h-3.5" />
        {t('home.contact.label')}
      </div>
      <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight">
        {t('home.contact.title')}
      </h3>

      {status === 'sent' ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6 text-center">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {t('home.contact.success')}
          </div>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline mt-2"
          >
            {t('home.contact.sendAnother')}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 flex-1">
          <input
            name="name"
            type="text"
            required
            placeholder={t('home.contact.name')}
            className="w-full px-3 py-2 text-sm rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-gray-900 dark:text-white placeholder:text-gray-400"
            style={{ backgroundColor: 'var(--input-bg, rgba(0,0,0,0.08))' }}
          />
          <input
            name="company"
            type="text"
            placeholder={t('home.contact.company')}
            className="w-full px-3 py-2 text-sm rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-gray-900 dark:text-white placeholder:text-gray-400"
            style={{ backgroundColor: 'var(--input-bg, rgba(0,0,0,0.08))' }}
          />
          <input
            name="email"
            type="email"
            required
            placeholder={t('home.contact.email')}
            className="w-full px-3 py-2 text-sm rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-gray-900 dark:text-white placeholder:text-gray-400"
            style={{ backgroundColor: 'var(--input-bg, rgba(0,0,0,0.08))' }}
          />
          <input
            name="phone"
            type="tel"
            placeholder={t('home.contact.phone')}
            className="w-full px-3 py-2 text-sm rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-gray-900 dark:text-white placeholder:text-gray-400"
            style={{ backgroundColor: 'var(--input-bg, rgba(0,0,0,0.08))' }}
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="mt-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            {status === 'sending' ? t('home.contact.submitting') : (
              <>
                {t('home.contact.submit')} <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
          {status === 'error' && (
            <div className="text-xs text-red-600 dark:text-red-400">{error}</div>
          )}
        </form>
      )}
    </BentoCard>
  );
}
