import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Mic,
  RotateCcw,
  Check,
  Shield,
  Send,
  PartyPopper,
  Volume2,
  FileText
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import StepIndicator from '../components/StepIndicator';
import { saveApplicationProgress } from '../services/supabase';

const POPULAR_DISTRICTS_TN = [
  'சென்னை (Chennai)',
  'மதுரை (Madurai)',
  'கோயம்புத்தூர் (Coimbatore)',
  'திருச்சி (Trichy)',
  'சேலம் (Salem)',
  'திருநெல்வேலி (Tirunelveli)',
  'தஞ்சாவூர் (Thanjavur)',
  'வேலூர் (Vellore)',
];

export default function Application({ service, onBack, onComplete }) {
  const { t, getLocalizedField } = useLanguage();
  const { speak, startListening, stopListening, isListening, stopSpeaking } = useVoice();

  const [step, setStep] = useState(1);
  const totalSteps = 4; // 1: Name, 2: District, 3: Aadhaar, 4: Phone

  const [formData, setFormData] = useState({
    name: '',
    district: '',
    hasAadhaar: null, // true | false
    phone: '',
  });

  const [pendingValue, setPendingValue] = useState('');
  const [isConfirmingSpokenValue, setIsConfirmingSpokenValue] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);

  const schemeTitle = getLocalizedField(service, 'title');

  // Read the active step question aloud whenever the step changes
  useEffect(() => {
    let questionText = '';
    if (step === 1) questionText = `படி ஒன்று. ${t.step1Title}. ${t.speakYourAnswer}`;
    else if (step === 2) questionText = `படி இரண்டு. ${t.step2Title}. ${t.speakYourAnswer}`;
    else if (step === 3) questionText = `படி மூன்று. ${t.step3Title}`;
    else if (step === 4) questionText = `படி நான்கு. ${t.step4Title}`;

    speak(questionText);
  }, [step]);

  // Voice capture for the current step
  const handleVoiceInputForStep = () => {
    startListening((spokenText) => {
      if (!spokenText || !spokenText.trim()) return;

      const cleanSpoken = spokenText.trim();
      setPendingValue(cleanSpoken);
      setIsConfirmingSpokenValue(true);

      speak(`நீங்கள் சொன்னது: ${cleanSpoken}. சரியா?`);
    });
  };

  // Confirm spoken value
  const handleConfirmValue = () => {
    setIsConfirmingSpokenValue(false);
    if (step === 1) {
      setFormData((prev) => ({ ...prev, name: pendingValue }));
      setStep(2);
    } else if (step === 2) {
      setFormData((prev) => ({ ...prev, district: pendingValue }));
      setStep(3);
    } else if (step === 4) {
      // Extract numbers if spoken
      const digits = pendingValue.replace(/\D/g, '');
      setFormData((prev) => ({ ...prev, phone: digits || pendingValue }));
      setStep(5); // Go to final review step
    }
    setPendingValue('');
  };

  // Retry voice input
  const handleRetryValue = () => {
    setIsConfirmingSpokenValue(false);
    setPendingValue('');
    handleVoiceInputForStep();
  };

  // Aadhaar Yes/No handler
  const handleAadhaarSelect = (hasCard) => {
    setFormData((prev) => ({ ...prev, hasAadhaar: hasCard }));
    speak(hasCard ? 'ஆம் என்று குறித்துக்கொண்டேன்.' : 'ஆதார் இல்லை என்று குறித்துக்கொண்டேன்.');
    setStep(4);
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const saved = await saveApplicationProgress({
        serviceId: service.id,
        serviceTitle: schemeTitle,
        currentStep: 5,
        status: 'submitted',
        formData,
      });

      // Celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      setSubmittedResult(saved);
      speak(`${t.appSubmittedSuccess} உங்கள் விண்ணப்ப எண்: ${saved.id}`);
    } catch (err) {
      console.warn('Error submitting application:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If application is successfully submitted, show the confirmation screen
  if (submittedResult) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 animate-fadeIn text-center">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-emerald-300 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-700 flex items-center justify-center text-4xl mx-auto mb-4 animate-bounce">
            🎉
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mb-2">
            {t.appSubmittedSuccess}
          </h2>

          <p className="text-stone-600 font-semibold mb-6">
            {schemeTitle}
          </p>

          {/* Reference ID Card */}
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 mb-6 text-left">
            <div className="text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
              {t.applicationNumber}:
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono tracking-wider">
              {submittedResult.id}
            </div>
            <p className="text-xs font-bold text-stone-500 mt-2">
              📌 {t.saveReference}
            </p>
          </div>

          {/* Submitted Summary */}
          <div className="bg-warmth-50 rounded-2xl p-4 text-left border border-warmth-200 mb-6 space-y-2">
            <div className="text-sm font-semibold text-stone-700">
              👤 பெயர்: <span className="font-bold text-stone-900">{formData.name}</span>
            </div>
            <div className="text-sm font-semibold text-stone-700">
              📍 மாவட்டம்: <span className="font-bold text-stone-900">{formData.district}</span>
            </div>
            <div className="text-sm font-semibold text-stone-700">
              📱 மொபைல்: <span className="font-bold text-stone-900">{formData.phone || 'குறிப்பிடப்படவில்லை'}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                speak(`உங்கள் விண்ணப்ப எண்: ${submittedResult.id}. இது பாதுகாப்பாக சேமிக்கப்பட்டுள்ளது.`);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-warmth-100 hover:bg-warmth-200 text-stone-800 font-bold rounded-2xl border-2 border-warmth-300 transition-colors"
            >
              <Volume2 className="w-5 h-5 text-terracotta-600" />
              <span>விண்ணப்ப எண்ணை மீண்டும் கேளுங்கள்</span>
            </button>

            <button
              onClick={onComplete}
              className="w-full py-4 px-6 bg-terracotta-500 hover:bg-terracotta-600 text-white font-black text-lg rounded-2xl shadow-lg transition-transform active:scale-95"
            >
              {t.backToHome}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 animate-fadeIn pb-28 text-left">
      {/* Top back button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            if (step > 1) {
              setStep(step - 1);
            } else {
              onBack();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-warmth-100 border-2 border-warmth-300 font-bold text-stone-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.back}</span>
        </button>

        <span className="text-sm font-bold text-stone-600 truncate max-w-[200px]">
          {schemeTitle}
        </span>
      </div>

      {/* Step Progress Bar */}
      <StepIndicator currentStep={Math.min(step, totalSteps)} totalSteps={totalSteps} />

      {/* Trust & Safety Assurance Header */}
      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-2xl mb-6 text-xs sm:text-sm text-emerald-900 font-bold">
        <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>🔒 {t.trustMessage}</span>
      </div>

      {/* Main Single-Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-warmth-200 shadow-soft-lift">
        {/* Verification dialog if speech was captured */}
        {isConfirmingSpokenValue ? (
          <div className="text-center py-4 animate-fadeIn">
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 mb-2">
              {t.isThisCorrect}
            </h3>
            <div className="bg-terracotta-50 border-2 border-terracotta-300 rounded-2xl p-4 my-4 text-2xl font-extrabold text-terracotta-900">
              "{pendingValue}"
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={handleConfirmValue}
                className="flex items-center justify-center gap-2 py-4 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-2xl shadow-md transition-all active:scale-95"
              >
                <Check className="w-6 h-6 stroke-[3]" />
                <span>{t.yesCorrect}</span>
              </button>

              <button
                type="button"
                onClick={handleRetryValue}
                className="flex items-center justify-center gap-2 py-3 px-6 bg-warmth-100 hover:bg-warmth-200 text-stone-800 font-bold text-base rounded-2xl border-2 border-warmth-300 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                <span>{t.tryAgain}</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* STEP 1: NAME */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mb-2">
                  {t.step1Title}
                </h2>
                <p className="text-stone-500 font-semibold mb-6">
                  உங்கள் முழுப் பெயரை சொல்லவும் அல்லது எழுதவும்.
                </p>

                {/* Big Voice Button for Name */}
                <div className="my-6 text-center">
                  <button
                    type="button"
                    onClick={handleVoiceInputForStep}
                    className={`w-24 h-24 mx-auto rounded-full flex flex-col items-center justify-center text-white font-extrabold transition-all shadow-xl ${
                      isListening ? 'bg-rose-600 pulse-mic' : 'bg-terracotta-500 hover:bg-terracotta-600 shadow-mic-glow active:scale-95'
                    }`}
                  >
                    <Mic className="w-10 h-10 mb-1" />
                    <span className="text-xs uppercase">{isListening ? 'கேட்கிறது' : t.speakPrompt}</span>
                  </button>
                  <p className="text-stone-600 font-bold text-sm mt-3">
                    👆 மைக் தொட்டு உங்கள் பெயரை சொல்லுங்கள்
                  </p>
                </div>

                {/* Simple Text Input Fallback */}
                <div className="mt-6 pt-4 border-t border-warmth-100">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                    அல்லது தட்டச்சு செய்யலாம்:
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="எ.கா: சுமதி"
                    className="w-full px-4 py-3 text-lg font-bold text-stone-900 rounded-2xl border-2 border-warmth-300 focus:border-terracotta-500 focus:outline-none"
                  />
                  {formData.name.trim() && (
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="mt-4 w-full py-3.5 bg-stone-900 text-white font-bold text-lg rounded-2xl hover:bg-stone-800 transition-transform active:scale-95"
                    >
                      {t.next} →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: DISTRICT */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mb-2">
                  {t.step2Title}
                </h2>
                <p className="text-stone-500 font-semibold mb-4">
                  நீங்கள் வசிக்கும் மாவட்டத்தை சொல்லவும் அல்லது கீழே தொட்டு தேர்வு செய்யவும்.
                </p>

                {/* Big Voice Button for District */}
                <div className="my-4 text-center">
                  <button
                    type="button"
                    onClick={handleVoiceInputForStep}
                    className={`w-20 h-20 mx-auto rounded-full flex flex-col items-center justify-center text-white font-extrabold transition-all shadow-md ${
                      isListening ? 'bg-rose-600 pulse-mic' : 'bg-terracotta-500 hover:bg-terracotta-600 shadow-mic-glow active:scale-95'
                    }`}
                  >
                    <Mic className="w-8 h-8" />
                    <span className="text-[10px] font-bold mt-0.5">{isListening ? 'கேட்கிறது' : t.speakPrompt}</span>
                  </button>
                </div>

                {/* Quick District Buttons */}
                <div className="grid grid-cols-2 gap-2.5 my-4">
                  {POPULAR_DISTRICTS_TN.map((dist) => (
                    <button
                      key={dist}
                      type="button"
                      onClick={() => {
                        const distName = dist.split(' ')[0];
                        setFormData({ ...formData, district: distName });
                        setStep(3);
                      }}
                      className="p-3 text-left rounded-2xl border-2 border-warmth-200 hover:border-terracotta-500 bg-warmth-50 hover:bg-terracotta-50 font-bold text-stone-800 text-sm transition-all active:scale-95"
                    >
                      📍 {dist}
                    </button>
                  ))}
                </div>

                {/* Text input */}
                <div className="mt-4 pt-4 border-t border-warmth-100">
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="உங்கள் மாவட்டம் தட்டச்சு செய்யவும்"
                    className="w-full px-4 py-3 text-base font-bold text-stone-900 rounded-2xl border-2 border-warmth-300 focus:border-terracotta-500 focus:outline-none"
                  />
                  {formData.district.trim() && (
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="mt-3 w-full py-3.5 bg-stone-900 text-white font-bold text-lg rounded-2xl hover:bg-stone-800 transition-transform active:scale-95"
                    >
                      {t.next} →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: AADHAAR YES / NO */}
            {step === 3 && (
              <div className="text-center py-2">
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mb-2">
                  {t.step3Title}
                </h2>
                <p className="text-stone-500 font-semibold mb-8">
                  ஆதார் அட்டை இருந்தால் எளிதாக பதிவு செய்யலாம்.
                </p>

                {/* Big Accessible YES / NO Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleAadhaarSelect(true)}
                    className="flex flex-col items-center justify-center p-6 rounded-3xl bg-emerald-50 hover:bg-emerald-100 border-4 border-emerald-400 text-emerald-900 transition-all hover:scale-105 active:scale-95 shadow-md"
                  >
                    <span className="text-4xl mb-2">🟢</span>
                    <span className="text-2xl font-black">{t.yes}</span>
                    <span className="text-xs font-bold text-emerald-700 mt-1">என்னிடம் ஆதார் உள்ளது</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAadhaarSelect(false)}
                    className="flex flex-col items-center justify-center p-6 rounded-3xl bg-rose-50 hover:bg-rose-100 border-4 border-rose-300 text-rose-900 transition-all hover:scale-105 active:scale-95 shadow-md"
                  >
                    <span className="text-4xl mb-2">🔴</span>
                    <span className="text-2xl font-black">{t.no}</span>
                    <span className="text-xs font-bold text-rose-700 mt-1">இப்போது இல்லை</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: MOBILE NUMBER */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mb-2">
                  {t.step4Title}
                </h2>
                <p className="text-stone-500 font-semibold mb-6">
                  விண்ணப்ப நிலவரம் பற்றிய எஸ்.எம்.எஸ் அனுப்ப இது தேவைப்படுகிறது.
                </p>

                {/* Big Voice Button */}
                <div className="my-4 text-center">
                  <button
                    type="button"
                    onClick={handleVoiceInputForStep}
                    className={`w-20 h-20 mx-auto rounded-full flex flex-col items-center justify-center text-white font-extrabold transition-all shadow-md ${
                      isListening ? 'bg-rose-600 pulse-mic' : 'bg-terracotta-500 hover:bg-terracotta-600 shadow-mic-glow active:scale-95'
                    }`}
                  >
                    <Mic className="w-8 h-8" />
                    <span className="text-[10px] font-bold mt-0.5">{isListening ? 'கேட்கிறது' : t.speakPrompt}</span>
                  </button>
                </div>

                <div className="mt-4">
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    placeholder="10 இலக்க மொபைல் எண் (எ.கா: 9876543210)"
                    className="w-full px-4 py-3.5 text-xl font-bold font-mono text-stone-900 rounded-2xl border-2 border-warmth-300 focus:border-terracotta-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="mt-4 w-full py-4 bg-terracotta-500 hover:bg-terracotta-600 text-white font-black text-xl rounded-2xl shadow-lg transition-transform active:scale-95"
                  >
                    விண்ணப்பத்தை சரிபார்க்க →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: CONFIRMATION & REVIEW BEFORE SUBMIT */}
            {step === 5 && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-black text-stone-900 mb-2">
                  {t.reviewTitle}
                </h2>
                <p className="text-stone-500 font-semibold mb-5">
                  தகவல்கள் அனைத்தும் சரியாக உள்ளதா என சரிபார்க்கவும்.
                </p>

                {/* Review Summary Box */}
                <div className="bg-warmth-50 border-2 border-warmth-200 rounded-2xl p-5 space-y-3 mb-6">
                  <div>
                    <span className="text-xs font-bold text-stone-500 uppercase">திட்டம்:</span>
                    <div className="font-extrabold text-stone-900 text-base">{schemeTitle}</div>
                  </div>
                  <div className="border-t border-warmth-200 pt-2">
                    <span className="text-xs font-bold text-stone-500 uppercase">பெயர்:</span>
                    <div className="font-extrabold text-stone-900 text-lg">{formData.name || 'குறிப்பிடப்படவில்லை'}</div>
                  </div>
                  <div className="border-t border-warmth-200 pt-2">
                    <span className="text-xs font-bold text-stone-500 uppercase">மாவட்டம்:</span>
                    <div className="font-extrabold text-stone-900 text-base">{formData.district || 'குறிப்பிடப்படவில்லை'}</div>
                  </div>
                  <div className="border-t border-warmth-200 pt-2">
                    <span className="text-xs font-bold text-stone-500 uppercase">ஆதார் அட்டை:</span>
                    <div className="font-extrabold text-stone-900 text-base">
                      {formData.hasAadhaar ? '🟢 ஆம், உள்ளது' : '🔴 இல்லை'}
                    </div>
                  </div>
                  <div className="border-t border-warmth-200 pt-2">
                    <span className="text-xs font-bold text-stone-500 uppercase">செல்போன் எண்:</span>
                    <div className="font-extrabold text-stone-900 text-base">{formData.phone || 'குறிப்பிடப்படவில்லை'}</div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-xl font-black text-terracotta-700">
                    "{t.canWeSubmit}"
                  </h3>
                </div>

                {/* Two Clear Confirmation Buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleFinalSubmit}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl rounded-2xl shadow-xl transition-transform active:scale-95"
                  >
                    <Check className="w-6 h-6 stroke-[3]" />
                    <span>{isSubmitting ? 'சமர்ப்பிக்கப்படுகிறது...' : t.submitBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-warmth-100 hover:bg-warmth-200 text-stone-800 font-bold text-base rounded-2xl border-2 border-warmth-300 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>தகவலை மாற்ற வேண்டும்</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
