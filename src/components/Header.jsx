import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Globe, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';

export default function Header({ onOpenLanguageModal, onOpenHelpModal, onNavigateHome }) {
  const { currentLang, t } = useLanguage();
  const { isAudioMuted, setIsAudioMuted, isSpeaking, stopSpeaking } = useVoice();
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-warmth-50/95 backdrop-blur-md border-b-2 border-warmth-200 px-4 py-3 sm:px-6 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and Greeting */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus:ring-2 focus:ring-terracotta-500 rounded-xl p-1"
          aria-label="Go to Home"
        >
          <div className="w-11 h-11 rounded-2xl bg-terracotta-500 text-white flex items-center justify-center shadow-md font-bold text-xl group-hover:scale-105 transition-transform">
            🌸
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                {t.appName}
              </span>
              <span className="text-xs bg-terracotta-100 text-terracotta-700 font-bold px-2 py-0.5 rounded-full border border-terracotta-200">
                அரசு வழிகாட்டி
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </button>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Online/Offline Status Indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors ${
              isOnline
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
            }`}
            title={isOnline ? t.onlineStatus : t.offlineStatus}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOnline ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span className="hidden md:inline">
              {isOnline ? t.onlineStatus : t.offlineStatus}
            </span>
          </div>

          {/* Mute/Unmute audio */}
          <button
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setIsAudioMuted(!isAudioMuted);
            }}
            className={`p-2.5 rounded-xl border-2 transition-all ${
              isAudioMuted
                ? 'bg-stone-200 border-stone-300 text-stone-600'
                : 'bg-warmth-100 border-warmth-300 text-terracotta-600 hover:bg-terracotta-50'
            }`}
            title={isAudioMuted ? 'ஒலி இயக்கவும்' : 'ஒலி நிறுத்தவும்'}
            aria-label="Toggle Sound"
          >
            {isAudioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Change Language Button */}
          <button
            onClick={onOpenLanguageModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-warmth-100 hover:bg-terracotta-50 border-2 border-warmth-300 text-stone-800 font-bold text-sm sm:text-base transition-colors shadow-sm"
            aria-label="Change Language"
          >
            <Globe className="w-4 h-4 text-terracotta-600" />
            <span>{currentLang.name}</span>
          </button>

          {/* SOS / Help Button */}
          <button
            onClick={onOpenHelpModal}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-rose-700 font-extrabold text-sm sm:text-base shadow-sm transition-all hover:scale-105 active:scale-95"
            aria-label={t.sosButton}
          >
            <span className="text-base">🆘</span>
            <span className="hidden sm:inline">{t.navHelp}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
