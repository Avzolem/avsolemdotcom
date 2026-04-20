'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Music, Play, ListMusic } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BentoCard } from './BentoCard';

interface Soundtrack {
  _id: string;
  month: string;
  title: string;
  artist: string;
  youtubeId: string;
  description?: string;
}

function formatMonth(ym: string, locale: string): string {
  const [y, m] = ym.split('-').map((n) => parseInt(n, 10));
  if (!y || !m) return ym;
  return new Date(y, m - 1, 1).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });
}

export function SoundtrackCard() {
  const { t, language } = useLanguage();
  const locale = language === 'es' ? 'es-MX' : 'en-US';
  const [items, setItems] = useState<Soundtrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/soundtracks');
        if (res.ok) {
          const b = await res.json();
          setItems(b.soundtracks || []);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const active = items[activeIdx];

  if (loading) {
    return (
      <BentoCard accent="violet">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-violet-600 dark:text-violet-400">
          <Music className="w-3.5 h-3.5" />
          {t('home.soundtrack.label')}
        </div>
        <div className="flex-1 flex items-center justify-center text-xs text-gray-500">
          …
        </div>
      </BentoCard>
    );
  }

  if (!active) {
    return (
      <BentoCard accent="violet">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-violet-600 dark:text-violet-400">
          <Music className="w-3.5 h-3.5" />
          {t('home.soundtrack.label')}
        </div>
        <div className="flex-1 flex items-center justify-center text-center text-sm text-gray-500 dark:text-gray-400">
          {t('home.soundtrack.comingSoon')}
        </div>
      </BentoCard>
    );
  }

  return (
    <BentoCard accent="violet" className="overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-violet-600 dark:text-violet-400">
          <Music className="w-3.5 h-3.5" />
          <span className="truncate">
            {t('home.soundtrack.label')} · {formatMonth(active.month, locale)}
          </span>
        </div>
        {items.length > 1 && (
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="text-[0.65rem] text-gray-500 hover:text-violet-500 inline-flex items-center gap-1"
          >
            <ListMusic className="w-3 h-3" />
            {items.length}
          </button>
        )}
      </div>

      {playing ? (
        <div className="relative flex-1 min-h-[120px] rounded-lg overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${active.youtubeId}?autoplay=1&rel=0`}
            title={active.title}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="relative flex-1 min-h-[120px] rounded-lg overflow-hidden group"
          aria-label="Play"
        >
          <Image
            src={`https://img.youtube.com/vi/${active.youtubeId}/mqdefault.jpg`}
            alt={active.title}
            fill
            sizes="(max-width: 768px) 50vw, 320px"
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 text-gray-900 fill-gray-900 translate-x-0.5" />
            </div>
          </div>
        </button>
      )}

      <div className="pt-1">
        <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {active.title}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {active.artist}
        </div>
      </div>

      {showHistory && items.length > 1 && (
        <div className="flex flex-wrap gap-1 pt-1 max-h-[70px] overflow-y-auto">
          {items.map((s, i) => (
            <button
              key={s._id}
              onClick={() => {
                setActiveIdx(i);
                setPlaying(false);
                setShowHistory(false);
              }}
              className={`text-[0.65rem] px-2 py-0.5 rounded-full font-mono transition-colors ${
                i === activeIdx
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-violet-100 dark:hover:bg-violet-900/30'
              }`}
            >
              {s.month}
            </button>
          ))}
        </div>
      )}
    </BentoCard>
  );
}
