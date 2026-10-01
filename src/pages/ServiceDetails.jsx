import React, { useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  MapPin,
  ExternalLink,
  Star,
  Send
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';

export default function ServiceDetails({
  service,
  onBack,
  onStartApplication,
  isSaved = false,
  onToggleSave,
}) {
  const { t, getLocalizedField } = useLanguage();
  const { speak, stopSpeaking, isSpeaking } = useVoice();
  const [isPlayingFullSummary, setIsPlayingFullSummary] = useState(false);

  if (!service) return null;

  const title = getLocalizedField(service, 'title');
  const description = getLocalizedField(service, 'description');
  const eligibility = getLocalizedField(service, 'eligibility') || [];
  const requiredDocuments = getLocalizedField(service, 'required_documents') || [];
  const applicationSteps = getLocalizedField(service, 'application_steps') || [];
  const audioSummary = getLocalizedField(service, 'audio_summary_text') || description;

  // Speak the entire page in clear audio
  const handleReadFullPage = () => {
    if (isPlayingFullSummary && isSpeaking) {
      stopSpeaking();
      setIsPlayingFullSummary(false);
    } else {
      setIsPlayingFullSummary(true);
      const fullText = `
        ${title}.
        ${t.whatIsThis}: ${description}.
        ${t.whatHelp}: ${service.benefit_amount || ''}.
        ${t.whoCanUse}: ${Array.isArray(eligibility) ? eligibility.join('. ') : eligibility}.
        ${t.whatDocuments}: ${Array.isArray(requiredDocuments) ? requiredDocuments.join('. ') : requiredDocuments}.
        ${t.howToApply}: ${Array.isArray(applicationSteps) ? applicationSteps.join('. ') : applicationSteps}.
      `;
      speak(fullText, {
        onEnd: () => setIsPlayingFullSummary(false),
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 animate-fadeIn pb-28 text-left">
      {/* Top Navigation & Save Bar */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-warmth-100 border-2 border-warmth-300 font-bold text-stone-800 transition-colors shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.back}</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleSave && onToggleSave(service.id)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border-2 font-bold transition-all ${
            isSaved
              ? 'bg-amber-100 border-amber-300 text-amber-800'
              : 'bg-white border-warmth-300 text-stone-700 hover:bg-warmth-50'
          }`}
        >
          <Star className={`w-5 h-5 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
          <span>{isSaved ? t.savedAlready : t.saveScheme}</span>
        </button>
      </div>

      {/* Main Title & Benefit Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-warmth-200 shadow-soft-lift mb-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold w-fit mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{service.verification_badge || t.officialBadge}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight mb-3">
          {title}
        </h1>

        {service.benefit_amount && (
          <div className="inline-block bg-emerald-100 text-emerald-900 border-2 border-emerald-300 px-4 py-2 rounded-2xl font-black text-lg sm:text-xl mb-4">
            💰 {t.whatHelp}: {service.benefit_amount}
          </div>
        )}

        {/* Listen Aloud Button - Prominent */}
        <div className="pt-2 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleReadFullPage}
            className={`flex items-center gap-2.5 px-6 py-4 rounded-2xl font-black text-base sm:text-lg border-2 shadow-md transition-all active:scale-95 ${
              isPlayingFullSummary
                ? 'bg-terracotta-600 text-white border-terracotta-700 animate-pulse'
                : 'bg-terracotta-500 hover:bg-terracotta-600 text-white border-terracotta-600'
            }`}
          >
            {isPlayingFullSummary ? (
              <>
                <VolumeX className="w-6 h-6" />
                <span>{t.stopAudio}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-6 h-6" />
                <span>🎙️ {t.listenAll}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onStartApplication(service)}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-base sm:text-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all active:scale-95"
          >
            <Send className="w-5 h-5" />
            <span>{t.applyNow}</span>
          </button>
        </div>
      </div>

      {/* The 6 Core Structured Questions */}
      <div className="space-y-4">
        {/* 1. What is this? */}
        <section className="bg-white rounded-3xl p-6 border-2 border-warmth-200">
          <h2 className="text-xl font-extrabold text-stone-900 mb-2 flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <span>{t.whatIsThis}</span>
          </h2>
          <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-medium">
            {description}
          </p>
        </section>

        {/* 2. Who can use it? */}
        <section className="bg-white rounded-3xl p-6 border-2 border-warmth-200">
          <h2 className="text-xl font-extrabold text-stone-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">👩</span>
            <span>{t.whoCanUse}</span>
          </h2>
          <ul className="space-y-2.5">
            {(Array.isArray(eligibility) ? eligibility : [eligibility]).map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-base sm:text-lg text-stone-800 font-semibold">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. What documents are needed? */}
        <section className="bg-white rounded-3xl p-6 border-2 border-warmth-200">
          <h2 className="text-xl font-extrabold text-stone-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <span>{t.whatDocuments}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Array.isArray(requiredDocuments) ? requiredDocuments : [requiredDocuments]).map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-warmth-50 border-2 border-warmth-200"
              >
                <FileCheck2 className="w-6 h-6 text-terracotta-600 flex-shrink-0" />
                <span className="text-base font-bold text-stone-800">{doc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. How do I apply? */}
        <section className="bg-white rounded-3xl p-6 border-2 border-warmth-200">
          <h2 className="text-xl font-extrabold text-stone-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <span>{t.howToApply}</span>
          </h2>
          <div className="space-y-3">
            {(Array.isArray(applicationSteps) ? applicationSteps : [applicationSteps]).map((step, idx) => (
              <div key={idx} className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-terracotta-500 text-white font-black text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-base sm:text-lg font-semibold text-stone-800 pt-0.5">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Where do I apply & Official Source */}
        <section className="bg-white rounded-3xl p-6 border-2 border-warmth-200">
          <h2 className="text-xl font-extrabold text-stone-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <span>{t.whereToApply}</span>
          </h2>
          <p className="text-base sm:text-lg text-stone-800 font-semibold mb-3">
            {service.official_department || 'அரசு துறை அலுவலகம்'}
          </p>
          {service.official_url && (
            <a
              href={service.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-warmth-100 hover:bg-warmth-200 text-terracotta-700 font-extrabold rounded-2xl border-2 border-warmth-300 transition-colors"
            >
              <span>{t.officialPortal}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </section>
      </div>

      {/* Bottom Start Application CTA */}
      <div className="mt-8 text-center bg-terracotta-50 border-2 border-terracotta-200 p-6 rounded-3xl">
        <h3 className="text-xl font-black text-stone-900 mb-2">
          நீங்களே சுலபமாக விண்ணப்பிக்கலாம்!
        </h3>
        <p className="text-stone-600 font-medium mb-4">
          எங்கள் வாய்ஸ் உதவியாளர் மூலம் ஒரு கேள்வியாக கேட்டு பூர்த்தி செய்யலாம்.
        </p>
        <button
          type="button"
          onClick={() => onStartApplication(service)}
          className="w-full sm:w-auto px-10 py-4 bg-terracotta-500 hover:bg-terracotta-600 text-white font-black text-xl rounded-2xl shadow-xl transition-transform active:scale-95"
        >
          🚀 {t.applyNow}
        </button>
      </div>
    </div>
  );
}
