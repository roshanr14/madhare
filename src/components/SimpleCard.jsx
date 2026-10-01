import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  ArrowRight,
  ShieldCheck,
  Star,
  Baby,
  Coins,
  Home,
  GraduationCap,
  Stethoscope,
  Scissors,
  Flame,
  FileText
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';

const ICONS_MAP = {
  Baby,
  Coins,
  Home,
  GraduationCap,
  Stethoscope,
  Scissors,
  Flame,
  FileText,
};

export default function SimpleCard({
  service,
  onSelect,
  isSaved = false,
  onToggleSave,
}) {
  const { t, getLocalizedField } = useLanguage();
  const { speak, stopSpeaking, isSpeaking, lastSpokenText } = useVoice();
  const [isPlayingCurrent, setIsPlayingCurrent] = useState(false);

  const IconComponent = ICONS_MAP[service.icon_name] || FileText;
  const title = getLocalizedField(service, 'title');
  const description = getLocalizedField(service, 'description');
  const audioSummary = getLocalizedField(service, 'audio_summary_text') || description;

  const handleAudioClick = (e) => {
    e.stopPropagation();
    if (isPlayingCurrent && isSpeaking) {
      stopSpeaking();
      setIsPlayingCurrent(false);
    } else {
      setIsPlayingCurrent(true);
      speak(`${title}. ${audioSummary}`, {
        onEnd: () => setIsPlayingCurrent(false),
      });
    }
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (onToggleSave) {
      onToggleSave(service.id);
    }
  };

  return (
    <div
      onClick={() => onSelect(service)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(service);
        }
      }}
      className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-warmth-200 hover:border-terracotta-400 hover:shadow-soft-lift transition-all cursor-pointer text-left relative flex flex-col justify-between group active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-terracotta-400/40"
    >
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="truncate">{service.verification_badge || t.officialBadge}</span>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSaveClick}
            className={`p-2 rounded-xl border transition-all ${
              isSaved
                ? 'bg-amber-100 text-amber-600 border-amber-300'
                : 'bg-warmth-50 hover:bg-warmth-100 text-stone-400 hover:text-stone-600 border-warmth-200'
            }`}
            title={isSaved ? t.savedAlready : t.saveScheme}
            aria-label={isSaved ? t.savedAlready : t.saveScheme}
          >
            <Star className={`w-5 h-5 ${isSaved ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* Icon & Title */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-terracotta-50 border-2 border-terracotta-200 text-terracotta-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
            <IconComponent className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 group-hover:text-terracotta-700 transition-colors leading-snug">
              {title}
            </h3>
            {service.benefit_amount && (
              <span className="inline-block mt-1 font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg text-sm sm:text-base border border-emerald-200">
                💰 {service.benefit_amount}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-stone-600 text-base leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-warmth-100 flex flex-wrap items-center justify-between gap-2">
        {/* Listen Aloud Audio Button */}
        <button
          type="button"
          onClick={handleAudioClick}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl font-bold text-sm sm:text-base border-2 transition-all ${
            isPlayingCurrent
              ? 'bg-terracotta-500 text-white border-terracotta-600 animate-pulse'
              : 'bg-warmth-100 hover:bg-terracotta-50 text-terracotta-700 border-warmth-300'
          }`}
          aria-label={t.listenAll}
        >
          {isPlayingCurrent ? (
            <>
              <VolumeX className="w-5 h-5" />
              <span>{t.stopAudio}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5 text-terracotta-600" />
              <span>{t.listenAll}</span>
            </>
          )}
        </button>

        {/* View Details Arrow */}
        <div className="flex items-center gap-1 text-terracotta-600 font-extrabold text-sm sm:text-base group-hover:translate-x-1 transition-transform">
          <span>விவரங்கள்</span>
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
