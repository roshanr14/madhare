import React, { useEffect } from 'react';
import { X, Volume2, PhoneCall, HeartHandshake, ShieldAlert, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';

export default function HelpModal({ isOpen, onClose, pageContext = 'home' }) {
  const { t } = useLanguage();
  const { speak, stopSpeaking } = useVoice();

  // Dynamic friendly explanation based on the screen user is currently on
  const getPageHelpExplanation = () => {
    switch (pageContext) {
      case 'welcome':
        return 'வணக்கம். இது முதல் பக்கம். நீங்கள் மைக் பட்டனை அழுத்தி உங்களுக்கு என்ன உதவி வேண்டும் என்று உங்கள் சொந்த மொழியிலேயே பேசலாம். அல்லது கீழே உள்ள பொத்தான்களை தொடலாம்.';
      case 'home':
        return 'இந்த பக்கம் உங்களுக்கு தேவையான பல்வேறு அரசு உதவி பிரிவுகளை காட்டுகிறது. பண உதவி, வீடு, கல்வி, தையல் மற்றும் வேலை, இலவச மருத்துவம் போன்றவற்றை தேர்வு செய்யலாம்.';
      case 'details':
        return 'இந்த பக்கம் தேர்ந்தெடுக்கப்பட்ட திட்டத்தின் முழு விவரங்களையும் காட்டுகிறது. யாருக்கு கிடைக்கும், என்னென்ன ஆவணங்கள் தேவை என்பதை மேலே உள்ள "கேட்டு தெரிந்து கொள்ளுங்கள்" பட்டன் மூலம் நீங்கள் குரல் வழியே கேட்கலாம்.';
      case 'application':
        return 'இது மிக எளிய விண்ணப்ப வழிகாட்டி. ஒவ்வொன்றாக கேள்வி கேட்கப்படும். உங்கள் கைகளால் தட்டச்சு செய்யத் தேவையில்லை. மைக் பட்டனை அழுத்தி உங்கள் பதிலை சத்தமாக சொன்னால் போதும்.';
      case 'saved':
        return 'நீங்கள் குறித்து வைத்த திட்டங்கள் இங்கு சேமிக்கப்பட்டுள்ளன. இணையம் இல்லாத போதும் கூட இவற்றை நீங்கள் பார்க்கலாம்.';
      default:
        return 'நான் உங்கள் சகி டிஜிட்டல் தோழி. உங்களுக்கு பயனுள்ள அரசு திட்டங்களை எளிதாக கண்டறியவும் விண்ணப்பிக்கவும் நான் உதவுகிறேன்.';
    }
  };

  const helpExplanation = getPageHelpExplanation();

  // Read aloud automatically when opening the help modal
  useEffect(() => {
    if (isOpen) {
      speak(helpExplanation);
    }
    return () => {
      stopSpeaking();
    };
  }, [isOpen, pageContext, speak, stopSpeaking, helpExplanation]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-warmth-50 w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-rose-300 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-warmth-200 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 border-2 border-rose-300 flex items-center justify-center text-2xl">
              🆘
            </div>
            <div>
              <h2 id="help-modal-title" className="text-xl sm:text-2xl font-black text-rose-800">
                {t.sosButton}
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm font-semibold">
                உடனடி உதவி மற்றும் ஆடியோ வழிகாட்டி
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-warmth-100 hover:bg-warmth-200 text-stone-700 transition-colors border-2 border-warmth-300"
            aria-label="Close help"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Spoken Screen Explanation Box */}
        <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-5 mb-6 text-left relative">
          <div className="flex items-center justify-between mb-2">
            <span className="font-extrabold text-rose-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-600" />
              இந்த பக்கத்தின் வழிகாட்டுதல்:
            </span>
            <button
              onClick={() => speak(helpExplanation)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-rose-100 border border-rose-300 rounded-xl text-xs font-bold text-rose-700 shadow-sm transition-all"
            >
              <Volume2 className="w-4 h-4" />
              மீண்டும் கேளுங்கள்
            </button>
          </div>
          <p className="text-base sm:text-lg text-stone-800 font-semibold leading-relaxed">
            "{helpExplanation}"
          </p>
        </div>

        {/* Direct Emergency Telephone Helplines */}
        <div>
          <h3 className="text-sm font-black text-stone-700 uppercase tracking-wider mb-3">
            📞 {t.emergencyHelplines} (இலவச தொலைபேசி எண்கள்):
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Women Helpline 181 */}
            <a
              href="tel:181"
              className="flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-rose-50 border-2 border-rose-200 transition-all group"
            >
              <div>
                <div className="font-black text-stone-900 text-base group-hover:text-rose-700">
                  பெண்கள் உதவி எண்
                </div>
                <div className="text-xs text-stone-500 font-medium">24 மணி நேர உதவி</div>
              </div>
              <div className="flex items-center gap-1 text-rose-700 font-black text-lg bg-rose-100 px-3 py-1.5 rounded-xl">
                <PhoneCall className="w-4 h-4" />
                181
              </div>
            </a>

            {/* Ayushman Bharat Health Helpline 14555 */}
            <a
              href="tel:14555"
              className="flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-emerald-50 border-2 border-emerald-200 transition-all group"
            >
              <div>
                <div className="font-black text-stone-900 text-base group-hover:text-emerald-700">
                  இலவச மருத்துவ உதவி
                </div>
                <div className="text-xs text-stone-500 font-medium">ஆயுஷ்மான் மித்ரா</div>
              </div>
              <div className="flex items-center gap-1 text-emerald-700 font-black text-lg bg-emerald-100 px-3 py-1.5 rounded-xl">
                <PhoneCall className="w-4 h-4" />
                14555
              </div>
            </a>

            {/* Kisan / Rural Helpline 1551 */}
            <a
              href="tel:1551"
              className="flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-amber-50 border-2 border-amber-200 transition-all group"
            >
              <div>
                <div className="font-black text-stone-900 text-base group-hover:text-amber-700">
                  விவசாயம் & கிராமப்புறம்
                </div>
                <div className="text-xs text-stone-500 font-medium">கிசான் கால் சென்டர்</div>
              </div>
              <div className="flex items-center gap-1 text-amber-800 font-black text-lg bg-amber-100 px-3 py-1.5 rounded-xl">
                <PhoneCall className="w-4 h-4" />
                1551
              </div>
            </a>

            {/* Childline 1098 */}
            <a
              href="tel:1098"
              className="flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-blue-50 border-2 border-blue-200 transition-all group"
            >
              <div>
                <div className="font-black text-stone-900 text-base group-hover:text-blue-700">
                  குழந்தைகள் பாதுகாப்பு
                </div>
                <div className="text-xs text-stone-500 font-medium">சைல்டுலைன்</div>
              </div>
              <div className="flex items-center gap-1 text-blue-700 font-black text-lg bg-blue-100 px-3 py-1.5 rounded-xl">
                <PhoneCall className="w-4 h-4" />
                1098
              </div>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-warmth-200 flex justify-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 bg-stone-900 text-white font-black text-base rounded-2xl hover:bg-stone-800 shadow-md transition-transform active:scale-95"
          >
            புரிந்தது (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
