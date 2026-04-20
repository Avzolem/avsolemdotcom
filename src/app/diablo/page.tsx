'use client';

import { useState } from 'react';
import { Maximize2, Volume2, VolumeX, Info, X, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { KonamiCRT } from '@/components/home/KonamiCRT';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DiabloPage() {
  const { t } = useLanguage();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const toggleFullscreen = () => {
    const iframe = document.getElementById('diablo-frame') as HTMLIFrameElement;
    if (iframe) {
      if (!document.fullscreenElement) {
        iframe.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <KonamiCRT />
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-black to-black pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-2 border-b border-red-900/30 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Image
            src="/images/diablo-logo.webp"
            alt="Diablo"
            width={150}
            height={44}
            className="h-10 w-auto"
            priority
          />
          <p className="text-xs text-white font-bold hidden sm:block" style={{ fontFamily: 'var(--font-diablo), serif' }}>{t('diablo.poweredBy')}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(true)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title={t('diablo.info')}
          >
            <Info className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title={isMuted ? t('diablo.unmute') : t('diablo.mute')}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title={t('diablo.fullscreen')}
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <Link
            href="/"
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title={t('diablo.backHome')}
          >
            <Home className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Game container */}
      <main className="relative w-full" style={{ height: 'calc(100vh - 60px)' }}>
        <iframe
          id="diablo-frame"
          src="https://d07riv.github.io/diabloweb/"
          className="w-full h-full border-0"
          allow="fullscreen; autoplay"
          title={t('diablo.gameTitle')}
        />
      </main>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-red-900/50 rounded-lg max-w-lg w-full p-6 relative">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/diablo-logo.webp"
                alt="Diablo"
                width={120}
                height={35}
                className="h-8 w-auto"
              />
            </div>

            <div className="space-y-4 text-gray-300 text-sm">
              <p>{t('diablo.description')}</p>

              <div>
                <h3 className="text-white font-semibold mb-2" style={{ fontFamily: 'var(--font-diablo), serif' }}>{t('diablo.howToPlay')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>{t('diablo.shareware')}</li>
                  <li>{t('diablo.fullGame')}</li>
                  <li>{t('diablo.extractMpq')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2" style={{ fontFamily: 'var(--font-diablo), serif' }}>{t('diablo.controls')}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>{t('diablo.controls.leftClick')}</li>
                  <li>{t('diablo.controls.rightClick')}</li>
                  <li>{t('diablo.controls.inventory')}</li>
                  <li>{t('diablo.controls.character')}</li>
                  <li>{t('diablo.controls.spellbook')}</li>
                  <li>{t('diablo.controls.menu')}</li>
                </ul>
              </div>

              <p className="text-xs text-gray-500 pt-2 border-t border-gray-800">
                {t('diablo.basedOn')} <a href="https://github.com/AJenbo/devilutionX" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">DevilutionX</a>.
                {' '}{t('diablo.trademark')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
