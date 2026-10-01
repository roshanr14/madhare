import React, { useState, useEffect } from 'react';
import {
  Mic,
  Search,
  Globe,
  Coins,
  Home as HomeIcon,
  GraduationCap,
  Scissors,
  Stethoscope,
  Heart,
  Volume2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import VoiceButton from '../components/VoiceButton';

export default function Welcome({
  onSelectCategory,
  onSearchSubmit,
  onOpenLanguageModal,
  onOpenVoiceModal,
}) {
  const { t, currentLang } = useLanguage();
  const { speak } = useVoice();
  const [typedQuery, setTypedQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Play natural welcoming voice once on welcome mount
  useEffect(() => {
    const welcomeAudio = `${currentLang.greeting}! ${t.welcomeQuestion}`;
    speak(welcomeAudio);
  }, []);

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (typedQuery.trim()) {
      onSearchSubmit(typedQuery);
    }
  };

  const categories = [
    { key: 'financial', icon: Coins, label: t.categories.financial, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { key: 'housing', icon: HomeIcon, label: t.categories.housing, color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { key: 'education', icon: GraduationCap, label: t.categories.education, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { key: 'job_skill', icon: Scissors, label: t.categories.job_skill, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { key: 'health', icon: Stethoscope, label: t.categories.health, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { key: 'women_empowerment', icon: Heart, label: t.categories.women_empowerment, color: 'bg-rose-50 text-rose-700 border-rose-200' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10 text-center animate-fadeIn">
      {/* 1. Welcoming Hero Heading */}
      <div className="mb-6">
        <span className="text-4xl sm:text-5xl inline-block animate-bounce mb-2">
          👋
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight mb-3">
          {currentLang.greeting}!
        </h1>
        <p className="text-2xl sm:text-3xl font-extrabold text-terracotta-700 leading-snug">
          {t.welcomeQuestion}
        </p>
      </div>

      {/* 2. The Primary Microphone Button */}
      <div className="my-8">
        <VoiceButton
          size="large"
          onVoiceResult={(spoken) => {
            if (spoken && spoken.trim()) {
              onSearchSubmit(spoken);
            }
          }}
        />
      </div>

      {/* 3. Three Simple Core Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
        {/* Speak button trigger */}
        <button
          type="button"
          onClick={onOpenVoiceModal}
          className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-extrabold text-base sm:text-lg shadow-md transition-all active:scale-95"
        >
          <Mic className="w-5 h-5" />
          <span>🎙️ {t.speakPrompt}</span>
        </button>

        {/* Type button trigger */}
        <button
          type="button"
          onClick={() => setShowSearchInput(!showSearchInput)}
          className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-warmth-100 text-stone-800 font-extrabold text-base sm:text-lg border-2 border-warmth-300 shadow-sm transition-all active:scale-95"
        >
          <Search className="w-5 h-5 text-stone-600" />
          <span>⌨️ {t.typePrompt}</span>
        </button>

        {/* Change Language */}
        <button
          type="button"
          onClick={onOpenLanguageModal}
          className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-warmth-100 hover:bg-warmth-200 text-stone-800 font-extrabold text-base sm:text-lg border-2 border-warmth-300 shadow-sm transition-all active:scale-95"
        >
          <Globe className="w-5 h-5 text-terracotta-600" />
          <span>🌐 {t.changeLanguage}</span>
        </button>
      </div>

      {/* Optional Simple Search Field (Expandable when Type clicked) */}
      {showSearchInput && (
        <form onSubmit={handleTextSubmit} className="mb-10 max-w-lg mx-auto">
          <div className="flex items-center gap-2 bg-white p-2 rounded-3xl border-2 border-terracotta-400 shadow-md">
            <input
              type="text"
              value={typedQuery}
              onChange={(e) => setTypedQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="flex-1 px-4 py-3 text-lg font-semibold text-stone-900 focus:outline-none bg-transparent"
              autoFocus
            />
            <button
              type="submit"
              className="px-6 py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold rounded-2xl text-base transition-colors"
            >
              {t.navHome}
            </button>
          </div>
        </form>
      )}

      {/* 4. Quick Category Selection Cards */}
      <div className="pt-6 border-t-2 border-warmth-200 text-left">
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mb-4 text-center sm:text-left">
          {t.categoriesTitle}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => onSelectCategory(cat.key)}
                className={`p-4 rounded-3xl border-2 ${cat.color} hover:scale-105 active:scale-95 transition-all text-left flex flex-col justify-between h-28 sm:h-32 shadow-sm group focus:outline-none focus:ring-4 focus:ring-terracotta-300`}
              >
                <div className="w-10 h-10 rounded-2xl bg-white/80 flex items-center justify-center shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="font-black text-base sm:text-lg leading-tight group-hover:underline">
                  {cat.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
