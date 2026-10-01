import React from 'react';
import { X, Check, Volume2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';

export default function LanguageSelectorModal({ isOpen, onClose }) {
  const { languages, currentLangCode, setLanguage, t } = useLanguage();
  const { speak } = useVoice();

  if (!isOpen) return null;

  const handleSelectLanguage = (lang) => {
    setLanguage(lang.code);
    // Play voice greeting in selected language to reassure the user
    speak(`${lang.greeting}!`, {
      rate: 0.9,
    });
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-warmth-50 w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-warmth-200 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-warmth-200 mb-6">
          <div className="text-left">
            <h2 id="language-modal-title" className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              🌐 {t.changeLanguage}
            </h2>
            <p className="text-stone-600 text-sm sm:text-base font-medium mt-1">
              உங்கள் தாய்மொழியை தேர்வு செய்யுங்கள்
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-warmth-100 hover:bg-warmth-200 text-stone-700 transition-colors border-2 border-warmth-300"
              aria-label="Close language selector"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* 9 Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {languages.map((lang) => {
            const isSelected = currentLangCode === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left group active:scale-95 ${
                  isSelected
                    ? 'bg-terracotta-50 border-terracotta-500 shadow-md ring-2 ring-terracotta-400'
                    : 'bg-white hover:bg-warmth-100 border-warmth-200 hover:border-warmth-400'
                }`}
              >
                <div>
                  <div className="text-2xl font-black text-stone-900 mb-0.5 group-hover:text-terracotta-700">
                    {lang.name}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-stone-500">
                    {lang.englishName} • <span className="text-terracotta-600 font-bold">{lang.greeting}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-warmth-100 text-stone-600 font-bold px-2 py-1 rounded-lg">
                    <Volume2 className="w-4 h-4 inline mr-1 text-terracotta-500" />
                    கேளுங்கள்
                  </span>
                  {isSelected && (
                    <div className="w-8 h-8 rounded-full bg-terracotta-500 text-white flex items-center justify-center font-bold">
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Friendly guidance note */}
        <div className="mt-6 pt-4 border-t border-warmth-200 text-center">
          <p className="text-stone-600 font-medium text-sm">
            💡 மொழியை தேர்வு செய்தவுடன் ஆப் உங்கள் மொழியில் பேசத் தொடங்கும்.
          </p>
        </div>
      </div>
    </div>
  );
}
