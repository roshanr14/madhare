import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';
import { useLanguage } from '../context/LanguageContext';

export default function VoiceButton({
  onVoiceResult,
  size = 'large', // 'large' (hero) | 'compact' (floating / inside form)
  label = null,
  className = '',
}) {
  const { isListening, interimTranscript, transcript, startListening, stopListening, isSupported, voiceError } = useVoice();
  const { t } = useLanguage();

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((resultText) => {
        if (onVoiceResult) {
          onVoiceResult(resultText);
        }
      });
    }
  };

  if (size === 'compact') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`relative inline-flex items-center justify-center p-3.5 rounded-2xl font-bold transition-all ${
          isListening
            ? 'bg-rose-600 text-white pulse-mic scale-105 ring-4 ring-rose-200'
            : 'bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-md active:scale-95'
        } ${className}`}
        aria-label={isListening ? t.listening : t.speakPrompt}
      >
        {isListening ? (
          <Mic className="w-6 h-6 animate-pulse" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
        {label && <span className="ml-2 text-sm sm:text-base">{label}</span>}
      </button>
    );
  }

  // Hero / Main Voice Button
  return (
    <div className={`flex flex-col items-center justify-center text-center my-4 ${className}`}>
      {/* Outer ripple rings during active listening */}
      <div className="relative">
        {isListening && (
          <>
            <span className="absolute inset-0 rounded-full bg-terracotta-500/30 animate-ping duration-1000 scale-125" />
            <span className="absolute -inset-3 rounded-full border-4 border-terracotta-400/50 animate-pulse" />
          </>
        )}

        {/* The Big Microphone Button */}
        <button
          type="button"
          onClick={handleToggle}
          className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center font-extrabold text-white transition-all transform active:scale-95 shadow-xl ${
            isListening
              ? 'bg-gradient-to-tr from-rose-600 to-terracotta-500 ring-8 ring-terracotta-200 shadow-mic-active scale-105'
              : 'bg-gradient-to-tr from-terracotta-600 to-terracotta-500 hover:from-terracotta-700 hover:to-terracotta-600 shadow-mic-glow hover:scale-105'
          }`}
          aria-label={isListening ? t.listening : t.speakPrompt}
        >
          {isListening ? (
            <>
              <div className="flex items-center gap-1 mb-1">
                <span className="w-1.5 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-8 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-10 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="w-1.5 h-7 bg-white rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                <span className="w-1.5 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
              </div>
              <span className="text-xs uppercase tracking-wider font-black">
                {t.listening.split('...')[0]}
              </span>
            </>
          ) : (
            <>
              <Mic className="w-12 h-12 sm:w-14 sm:h-14 mb-1 drop-shadow" />
              <span className="text-base sm:text-lg font-black tracking-wide">
                {t.speakPrompt}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Spoken Text Feedback Area */}
      <div className="mt-4 min-h-[48px] max-w-md px-4">
        {isListening ? (
          <p className="text-base sm:text-lg font-bold text-terracotta-700 bg-terracotta-50 border-2 border-terracotta-200 px-4 py-2 rounded-2xl shadow-sm animate-pulse">
            {interimTranscript || t.listening}
          </p>
        ) : voiceError ? (
          <p className="text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
            {voiceError}
          </p>
        ) : (
          <p className="text-stone-600 text-sm sm:text-base font-medium">
            👇 {t.speakPrompt} தொடவும் அல்லது தட்டச்சு செய்யவும்
          </p>
        )}
      </div>
    </div>
  );
}
