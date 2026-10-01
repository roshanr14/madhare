import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { speechService, parseVoiceCommand } from '../services/speech';
import { useLanguage } from './LanguageContext';

const VoiceContext = createContext();

export function VoiceProvider({ children }) {
  const { currentLang, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lastSpokenText, setLastSpokenText] = useState('');
  const [voiceError, setVoiceError] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const customResultHandlerRef = useRef(null);
  const navigationHandlerRef = useRef(null);

  // Accessible audio chimes using Web Audio API for friendly earcons
  const playChime = useCallback((type = 'start') => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'start') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {
      // AudioCtx might be blocked before first user gesture
    }
  }, []);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
  }, []);

  // Speak aloud in current language
  const speak = useCallback(
    (text, { onEnd, rate = 0.9 } = {}) => {
      if (!text || isAudioMuted) {
        if (onEnd) onEnd();
        return;
      }

      setLastSpokenText(text);
      speechService.speak(text, {
        language: currentLang.speechCode || 'ta-IN',
        rate,
        onStart: () => setIsSpeaking(true),
        onEnd: () => {
          setIsSpeaking(false);
          if (onEnd) onEnd();
        },
        onError: () => setIsSpeaking(false),
      });
    },
    [currentLang, isAudioMuted]
  );

  // Stop listening
  const stopListening = useCallback(() => {
    speechService.stopListening();
    setIsListening(false);
    playChime('stop');
  }, [playChime]);

  // Start listening
  const startListening = useCallback(
    (customOnResult = null) => {
      stopSpeaking();
      setVoiceError(null);
      setTranscript('');
      setInterimTranscript('');
      customResultHandlerRef.current = customOnResult;

      playChime('start');
      setIsListening(true);

      speechService.startListening({
        language: currentLang.speechCode || 'ta-IN',
        onResult: ({ transcript: text, isFinal }) => {
          setInterimTranscript(text);
          if (isFinal) {
            setTranscript(text);
            setIsListening(false);
            playChime('success');

            // Check if it's a voice navigation command
            const command = parseVoiceCommand(text);
            if (navigationHandlerRef.current && (command.type === 'NAVIGATE' || command.type === 'GO_BACK' || command.type === 'TRIGGER_HELP')) {
              navigationHandlerRef.current(command);
            }

            if (customResultHandlerRef.current) {
              customResultHandlerRef.current(text);
            }
          }
        },
        onError: (err) => {
          setIsListening(false);
          setVoiceError(err.friendlyMessage || t.speechNotClear);
          speak(t.speechNotClear);
        },
        onEnd: () => {
          setIsListening(false);
        },
      });
    },
    [currentLang, playChime, speak, stopSpeaking, t]
  );

  // Register navigation handler
  const setNavigationCallback = useCallback((cb) => {
    navigationHandlerRef.current = cb;
  }, []);

  // Clean up when unmounting
  useEffect(() => {
    return () => {
      speechService.stopSpeaking();
      speechService.stopListening();
    };
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        isSpeaking,
        transcript,
        interimTranscript,
        voiceError,
        isAudioMuted,
        setIsAudioMuted,
        startListening,
        stopListening,
        speak,
        stopSpeaking,
        setNavigationCallback,
        lastSpokenText,
        isSupported: speechService.isSpeechRecognitionSupported(),
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
}
