'use client';

import { useState } from 'react';
import { Maximize2, Volume2, VolumeX, Info, X, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function DiabloPage() {
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
          <p className="text-xs text-white font-bold hidden sm:block" style={{ fontFamily: 'var(--font-diablo), serif' }}>Powered by Avsolem</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(true)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Information"
          >
            <Info className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <Link
            href="/"
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Back to avsolem.com"
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
          title="Diablo Web"
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
              <p>
                This is <strong className="text-white">Diablo</strong>, a port of the original Diablo game
                that runs entirely in your browser using WebAssembly. Powered by <strong className="text-red-500">Avsolem</strong>.
              </p>

              <div>
                <h3 className="text-white font-semibold mb-2" style={{ fontFamily: 'var(--font-diablo), serif' }}>How to Play:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>The <strong className="text-gray-200">Shareware version</strong> is available for free</li>
                  <li>For the <strong className="text-gray-200">full game</strong>, you need to provide your own DIABDAT.MPQ file</li>
                  <li>If you own Diablo on GOG or have the original CD, you can extract the MPQ file</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2" style={{ fontFamily: 'var(--font-diablo), serif' }}>Controls:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li><strong className="text-gray-200">Left Click</strong> - Move / Attack / Interact</li>
                  <li><strong className="text-gray-200">Right Click</strong> - Use spell</li>
                  <li><strong className="text-gray-200">I</strong> - Inventory</li>
                  <li><strong className="text-gray-200">C</strong> - Character stats</li>
                  <li><strong className="text-gray-200">S</strong> - Spellbook</li>
                  <li><strong className="text-gray-200">ESC</strong> - Menu</li>
                </ul>
              </div>

              <p className="text-xs text-gray-500 pt-2 border-t border-gray-800">
                Based on <a href="https://github.com/AJenbo/devilutionX" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">DevilutionX</a>.
                Diablo is a trademark of Blizzard Entertainment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
