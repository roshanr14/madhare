import React from 'react';
import { Home, Star, HelpCircle, Mic, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';

export default function BottomNav({
  activeTab = 'home',
  onSelectTab,
  onOpenVoiceModal,
}) {
  const { t } = useLanguage();
  const { isListening } = useVoice();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-warmth-200 px-3 py-2 shadow-2xl safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl min-w-[68px] transition-all ${
            activeTab === 'home'
              ? 'text-terracotta-600 font-extrabold'
              : 'text-stone-500 font-semibold hover:text-stone-800'
          }`}
          aria-label={t.navHome}
        >
          <div className={`p-1.5 rounded-xl ${activeTab === 'home' ? 'bg-terracotta-100' : ''}`}>
            <Home className="w-6 h-6" />
          </div>
          <span className="text-xs mt-0.5">{t.navHome}</span>
        </button>

        {/* 2. Floating Center Voice Mic */}
        <div className="relative -top-5">
          <button
            type="button"
            onClick={onOpenVoiceModal}
            className={`w-16 h-16 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-transform active:scale-90 border-4 border-white ${
              isListening
                ? 'bg-rose-600 pulse-mic scale-110'
                : 'bg-gradient-to-tr from-terracotta-600 to-terracotta-500 shadow-mic-glow hover:scale-105'
            }`}
            aria-label={isListening ? t.listening : t.speakPrompt}
          >
            <Mic className="w-8 h-8" />
            <span className="text-[10px] font-black uppercase tracking-tighter">
              {isListening ? 'கேட்கிறது' : t.speakPrompt}
            </span>
          </button>
        </div>

        {/* 3. Saved */}
        <button
          type="button"
          onClick={() => onSelectTab('saved')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl min-w-[68px] transition-all ${
            activeTab === 'saved'
              ? 'text-terracotta-600 font-extrabold'
              : 'text-stone-500 font-semibold hover:text-stone-800'
          }`}
          aria-label={t.navSaved}
        >
          <div className={`p-1.5 rounded-xl ${activeTab === 'saved' ? 'bg-terracotta-100' : ''}`}>
            <Star className="w-6 h-6" />
          </div>
          <span className="text-xs mt-0.5">{t.navSaved}</span>
        </button>

        {/* 4. Help */}
        <button
          type="button"
          onClick={() => onSelectTab('help')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl min-w-[68px] transition-all ${
            activeTab === 'help'
              ? 'text-rose-600 font-extrabold'
              : 'text-stone-500 font-semibold hover:text-stone-800'
          }`}
          aria-label={t.navHelp}
        >
          <div className={`p-1.5 rounded-xl ${activeTab === 'help' ? 'bg-rose-100' : ''}`}>
            <HelpCircle className="w-6 h-6 text-rose-600" />
          </div>
          <span className="text-xs mt-0.5 text-rose-700 font-bold">{t.navHelp}</span>
        </button>
      </div>
    </nav>
  );
}
