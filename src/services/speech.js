// Speech Service Abstraction Layer
// Default: Browser Web Speech API (SpeechRecognition + SpeechSynthesis)
// Extensible for Indian Language speech providers (Bhashini, Google Cloud Speech, Azure Speech)

export class WebSpeechProvider {
  constructor() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      null;

    this.SpeechRecognitionClass = SpeechRecognition;
    this.recognitionInstance = null;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.isListening = false;
    this.isSpeaking = false;
  }

  isSpeechRecognitionSupported() {
    return Boolean(this.SpeechRecognitionClass);
  }

  isSpeechSynthesisSupported() {
    return Boolean(this.synth);
  }

  // 1. SPEECH TO TEXT
  startListening({ language = 'ta-IN', onResult, onError, onEnd }) {
    if (!this.isSpeechRecognitionSupported()) {
      if (onError) onError({ code: 'not-supported', message: 'Speech recognition is not supported in this browser' });
      return null;
    }

    try {
      if (this.recognitionInstance) {
        this.recognitionInstance.abort();
      }

      const recognition = new this.SpeechRecognitionClass();
      this.recognitionInstance = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        this.isListening = true;
      };

      recognition.onresult = (event) => {
        let transcript = '';
        let isFinal = false;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }

        if (onResult) {
          onResult({ transcript, isFinal });
        }
      };

      recognition.onerror = (event) => {
        this.isListening = false;
        if (onError) {
          // Provide friendly error codes, never raw technical exceptions
          onError({
            code: event.error,
            friendlyMessage: event.error === 'no-speech'
              ? 'எதுவும் பேசவில்லை. மீண்டும் முயற்சி செய்யுங்கள்.'
              : 'மைக் இணைப்பில் சிக்கல் உள்ளது. மீண்டும் சொல்லுங்கள்.',
          });
        }
      };

      recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      recognition.start();
      return recognition;
    } catch (err) {
      console.warn('Speech recognition error:', err);
      if (onError) onError({ code: 'init-failed', message: err.message });
      return null;
    }
  }

  stopListening() {
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.stop();
      } catch (e) {
        // Safe ignore
      }
      this.isListening = false;
    }
  }

  // 2. TEXT TO SPEECH
  speak(text, { language = 'ta-IN', onStart, onEnd, onError, rate = 0.9, pitch = 1.0 } = {}) {
    if (!this.isSpeechSynthesisSupported() || !text) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.stopSpeaking();

      // Clean text for speech (strip markdown/bullets)
      const cleanText = text.replace(/[*_#`[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language;
      utterance.rate = rate; // Slightly slower for clear rural comprehension
      utterance.pitch = pitch;

      // Select best matching voice for the language if available
      const voices = this.synth.getVoices();
      const langPrefix = language.split('-')[0].toLowerCase();
      const matchedVoice = voices.find(
        (v) => v.lang.toLowerCase() === language.toLowerCase() || v.lang.toLowerCase().startsWith(langPrefix)
      );

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        if (onError) onError(event);
      };

      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      this.isSpeaking = false;
      if (onEnd) onEnd();
    }
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }
}

// Global active voice provider instance
export const speechService = new WebSpeechProvider();

// Voice Command Classifier for Navigation & Actions
export function parseVoiceCommand(transcript = '') {
  const text = transcript.toLowerCase().trim();

  // 1. Navigation: Go Home
  if (
    text.includes('முகப்பு') ||
    text.includes('ஹோம்') ||
    text.includes('வீடு போ') ||
    text.includes('home') ||
    text.includes('ghar') ||
    text.includes('mukhya')
  ) {
    return { type: 'NAVIGATE', destination: '/' };
  }

  // 2. Navigation: Go Back
  if (
    text.includes('பின்னால்') ||
    text.includes('திரும்பி') ||
    text.includes('back') ||
    text.includes('peeche') ||
    text.includes('hinde')
  ) {
    return { type: 'GO_BACK' };
  }

  // 3. Action: Read page aloud
  if (
    text.includes('படித்து') ||
    text.includes('படியுங்கள்') ||
    text.includes('சொல்லுங்கள்') ||
    text.includes('கேளுங்கள்') ||
    text.includes('read') ||
    text.includes('sunao') ||
    text.includes('padho')
  ) {
    return { type: 'READ_PAGE' };
  }

  // 4. Action: Help / SOS
  if (
    text.includes('உதவி') ||
    text.includes('help') ||
    text.includes('madad') ||
    text.includes('sahayam')
  ) {
    return { type: 'TRIGGER_HELP' };
  }

  // 5. Action: Apply
  if (
    text.includes('விண்ணப்ப') ||
    text.includes('apply') ||
    text.includes('aavedan') ||
    text.includes('register')
  ) {
    return { type: 'APPLY' };
  }

  return { type: 'SEARCH_OR_INPUT', text };
}
