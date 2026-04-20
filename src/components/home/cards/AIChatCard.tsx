'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Bot, Sparkles, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BentoCard } from './BentoCard';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatCardProps {
  projectSlugs: string[];
  postSlugs: string[];
}

function renderAssistantText(
  text: string,
  projectSlugs: Set<string>,
  postSlugs: Set<string>
): React.ReactNode[] {
  // Split on [slug] tokens, turn them into <Link> if the slug is known.
  const parts = text.split(/(\[[a-z0-9-]+\])/gi);
  return parts.map((part, i) => {
    const match = part.match(/^\[([a-z0-9-]+)\]$/i);
    if (!match) return <span key={i}>{part}</span>;
    const slug = match[1];
    if (projectSlugs.has(slug)) {
      return (
        <Link
          key={i}
          href={`/work/${slug}`}
          className="text-amber-600 dark:text-amber-400 hover:underline"
        >
          {slug}
        </Link>
      );
    }
    if (postSlugs.has(slug)) {
      return (
        <Link
          key={i}
          href={`/blog/${slug}`}
          className="text-amber-600 dark:text-amber-400 hover:underline"
        >
          {slug}
        </Link>
      );
    }
    return <span key={i} className="opacity-60">{part}</span>;
  });
}

export function AIChatCard({ projectSlugs, postSlugs }: AIChatCardProps) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const [rateLimited, setRateLimited] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const projectSet = new Set(projectSlugs);
  const postSet = new Set(postSlugs);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function send(prompt?: string) {
    const text = (prompt ?? input).trim();
    if (!text || streaming) return;

    const history = messages;
    const nextMessages: Message[] = [
      ...history,
      { role: 'user', content: text },
      { role: 'assistant', content: '' },
    ];
    setMessages(nextMessages);
    setInput('');
    setStreaming(true);
    setError('');

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 429) setRateLimited(true);
        throw new Error(body.detail || body.error || `HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') continue;
          try {
            const evt = JSON.parse(payload);
            if (evt.text) {
              setMessages((prev) => {
                const copy = [...prev];
                const last = copy[copy.length - 1];
                if (last?.role === 'assistant') {
                  copy[copy.length - 1] = { ...last, content: last.content + evt.text };
                }
                return copy;
              });
            } else if (evt.error) {
              throw new Error(evt.error);
            }
          } catch {
            /* ignore partial JSON */
          }
        }
      }
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setStreaming(false);
    }
  }

  const suggestions = [t('home.ai.q1'), t('home.ai.q2'), t('home.ai.q3')];
  const empty = messages.length === 0;

  return (
    <BentoCard className="md:col-span-2 min-h-[260px]">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400">
        <Bot className="w-3.5 h-3.5" />
        {t('home.ai.label')}
      </div>

      {empty ? (
        <div className="flex items-start gap-3 flex-1">
          <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {t('home.ai.description')}
          </p>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto flex flex-col gap-2 max-h-[260px] pr-1"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`text-sm rounded-lg px-3 py-2 ${
                m.role === 'user'
                  ? 'bg-cyan-100 dark:bg-cyan-900/30 text-gray-900 dark:text-white self-end max-w-[85%]'
                  : 'bg-gray-100 dark:bg-gray-800/60 text-gray-800 dark:text-gray-200 self-start max-w-[85%] whitespace-pre-wrap'
              }`}
            >
              {m.role === 'assistant'
                ? renderAssistantText(m.content || '…', projectSet, postSet)
                : m.content}
            </div>
          ))}
          {streaming && messages[messages.length - 1]?.content === '' && (
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
          )}
        </div>
      )}

      {empty && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {suggestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => send(q)}
              disabled={streaming || rateLimited}
              className="text-[0.7rem] px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="text-xs text-red-600 dark:text-red-400">{error}</div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-center gap-2 mt-auto"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={streaming || rateLimited}
          placeholder={rateLimited ? t('home.ai.rateLimited') : t('home.ai.placeholder')}
          maxLength={1000}
          className="flex-1 px-3 py-2 text-sm rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-gray-900 dark:text-white placeholder:text-gray-400 disabled:opacity-50"
          style={{ backgroundColor: 'var(--input-bg, rgba(0,0,0,0.08))' }}
        />
        <button
          type="submit"
          disabled={!input.trim() || streaming || rateLimited}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
          aria-label={t('home.ai.send')}
        >
          {streaming ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </BentoCard>
  );
}
