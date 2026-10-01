import React, { useState, useEffect } from 'react';
import { X, Mic, Volume2, ArrowRight, RotateCcw, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import { understandUserRequest } from '../services/ai';

export default function VoiceAssistantModal({
  isOpen,
  onClose,
  onApplyCategoryFilter,
  onSelectService,
  allServices = [],
}) {
  const { t, currentLangCode, getLocalizedField } = useLanguage();
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  } = useVoice();

  const [aiResult, setAiResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchedSchemes, setMatchedSchemes] = useState([]);

  // When modal opens, speak greeting & start listening automatically
  useEffect(() => {
    if (isOpen) {
      setAiResult(null);
      setMatchedSchemes([]);
      speak(t.welcomeQuestion, {
        onEnd: () => {
          startListening(handleTranscriptComplete);
        },
      });
    } else {
      stopSpeaking();
      stopListening();
    }
  }, [isOpen]);

  const handleTranscriptComplete = async (spokenText) => {
    if (!spokenText || !spokenText.trim()) return;

    setIsProcessing(true);
    try {
      const result = await understandUserRequest(spokenText, currentLangCode);
      setAiResult(result);

      // Filter matching schemes
      let matches = [];
      if (result.category && result.category !== 'all') {
        matches = allServices.filter((s) => s.category === result.category);
      } else {
        matches = allServices.slice(0, 3);
      }
      setMatchedSchemes(matches);

      // Speak back friendly response
      const speechText = result.friendlySpeech || t.welcomeQuestion;
      speak(speechText);
    } catch (err) {
      console.warn('AI understanding error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setAiResult(null);
    setMatchedSchemes([]);
    startListening(handleTranscriptComplete);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-warmth-50 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-terracotta-200 max-h-[92vh] overflow-y-auto text-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="voice-assistant-title"
      >
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-warmth-100 hover:bg-warmth-200 text-stone-700 transition-colors border border-warmth-300"
            aria-label="Close voice assistant"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Digital Helper Avatar */}
        <div className="my-2">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-terracotta-500 text-white flex items-center justify-center shadow-lg text-4xl mb-3 animate-bounce">
            🌸
          </div>
          <h2 id="voice-assistant-title" className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {t.appName} தோழி
          </h2>
          <p className="text-stone-600 text-base sm:text-lg font-bold mt-1">
            "{t.welcomeQuestion}"
          </p>
        </div>

        {/* Big Mic Center */}
        <div className="my-6">
          <button
            type="button"
            onClick={() => {
              if (isListening) {
                stopListening();
              } else {
                startListening(handleTranscriptComplete);
              }
            }}
            className={`w-28 h-28 mx-auto rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-all ${
              isListening
                ? 'bg-rose-600 pulse-mic scale-110'
                : 'bg-terracotta-500 hover:bg-terracotta-600 shadow-mic-glow hover:scale-105 active:scale-95'
            }`}
          >
            <Mic className="w-12 h-12" />
            <span className="text-xs font-black uppercase mt-1">
              {isListening ? 'கேட்கிறது...' : t.speakPrompt}
            </span>
          </button>
        </div>

        {/* Live Spoken Text Bubble */}
        <div className="min-h-[50px] mb-4">
          {isListening ? (
            <div className="bg-terracotta-50 border-2 border-terracotta-200 rounded-2xl p-3 text-terracotta-800 font-bold text-base sm:text-lg animate-pulse">
              "{interimTranscript || t.listening}"
            </div>
          ) : transcript ? (
            <div className="bg-warmth-100 border border-warmth-300 rounded-2xl p-3 text-stone-800 font-semibold text-base">
              நீங்கள் சொன்னது: <span className="font-extrabold text-stone-950">"{transcript}"</span>
            </div>
          ) : null}
        </div>

        {/* AI Intent Result / Matching Schemes */}
        {aiResult && (
          <div className="mt-4 pt-4 border-t-2 border-warmth-200 text-left">
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm mb-1">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                புரிந்து கொண்டது:
              </div>
              <p className="text-stone-800 font-bold text-base sm:text-lg">
                {aiResult.friendlySpeech}
              </p>
            </div>

            {/* Matched Schemes List */}
            {matchedSchemes.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-xs font-black text-stone-500 uppercase tracking-wider">
                  உங்களுக்கான திட்டங்கள்:
                </p>
                {matchedSchemes.map((scheme) => (
                  <button
                    key={scheme.id}
                    onClick={() => {
                      onSelectService(scheme);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white hover:bg-terracotta-50 border-2 border-warmth-200 hover:border-terracotta-400 text-left transition-all group"
                  >
                    <div>
                      <div className="font-extrabold text-stone-900 group-hover:text-terracotta-700 text-sm sm:text-base">
                        {getLocalizedField(scheme, 'title')}
                      </div>
                      <div className="text-xs font-bold text-emerald-700 mt-0.5">
                        💰 {scheme.benefit_amount}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-terracotta-600 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            )}

            {/* Action Buttons: View All in this Category or Try Speaking Again */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              {aiResult.category && (
                <button
                  type="button"
                  onClick={() => {
                    onApplyCategoryFilter(aiResult.category);
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-terracotta-500 hover:bg-terracotta-600 text-white font-extrabold text-base rounded-2xl shadow-md transition-all active:scale-95"
                >
                  <Check className="w-5 h-5" />
                  <span>திட்டங்களை பார்க்க</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleRetry}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-warmth-100 hover:bg-warmth-200 text-stone-800 font-bold text-sm sm:text-base rounded-2xl border-2 border-warmth-300 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.tryAgain}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
