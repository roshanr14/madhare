import React from 'react';
import { PhoneCall, Volume2, ShieldAlert, MapPin, ArrowLeft, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';

export default function Help({ onNavigateHome }) {
  const { t } = useLanguage();
  const { speak } = useVoice();

  const handleReadHelp = () => {
    speak(
      'இது அரசு உதவி எண்கள் பக்கம். பெண்கள் உதவி எண் 181. இலவச மருத்துவ உதவி எண் 14555. விவசாயம் மற்றும் கிராமப்புற உதவி எண் 1551. உங்கள் போனில் உள்ள பட்டனை தொட்டு நேரடியாக பேசலாம்.'
    );
  };

  const emergencyContacts = [
    {
      title: 'பெண்கள் உதவி எண் (Women Helpline)',
      number: '181',
      desc: 'குடும்ப வன்முறை, பாதுகாப்பு, ஆலோசனை மற்றும் அரசு உதவி',
      badge: '24 மணி நேர இலவச சேவை',
      color: 'bg-rose-50 border-rose-300 text-rose-800',
    },
    {
      title: 'ஆயுஷ்மான் பாரத் இலவச மருத்துவ உதவி',
      number: '14555',
      desc: 'அரசு மற்றும் தனியார் மருத்துவமனை சிகிச்சை அட்டை உதவி',
      badge: 'இலவச அழைப்பு',
      color: 'bg-emerald-50 border-emerald-300 text-emerald-800',
    },
    {
      title: 'விவசாய & கிராமப்புற உதவி மையம் (Kisan)',
      number: '1551',
      desc: 'கிராமப்புற விவசாயம், பயிர் காப்பீடு மற்றும் மானிய உதவி',
      badge: 'அரசு சேவை',
      color: 'bg-amber-50 border-amber-300 text-amber-900',
    },
    {
      title: 'குழந்தைகள் பாதுகாப்பு உதவி எண் (Childline)',
      number: '1098',
      desc: 'குழந்தை திருமணம் தடுப்பு, பெண் குழந்தைகள் பாதுகாப்பு மற்றும் கல்வி',
      badge: 'அவசர உதவி',
      color: 'bg-blue-50 border-blue-300 text-blue-900',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 animate-fadeIn pb-28 text-left">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-rose-800 flex items-center gap-2">
            <span>🆘</span>
            <span>{t.navHelp}</span>
          </h1>
          <p className="text-stone-500 font-semibold mt-1">
            அரசு அவசர எண்கள் மற்றும் நேரடி வழிகாட்டுதல்
          </p>
        </div>

        <button
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-warmth-100 border-2 border-warmth-300 font-bold text-stone-800 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.home}</span>
        </button>
      </div>

      {/* Voice Read Aloud Banner */}
      <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-black text-rose-900 text-lg mb-1">
            குரல் மூலம் தெரிந்துகொள்ளுங்கள்
          </h2>
          <p className="text-stone-700 text-sm font-semibold">
            இந்த பக்கத்தில் உள்ள விவரங்களை ஆடியோ மூலம் கேட்கலாம்.
          </p>
        </div>
        <button
          onClick={handleReadHelp}
          className="flex items-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl shadow-md transition-transform active:scale-95 flex-shrink-0"
        >
          <Volume2 className="w-5 h-5" />
          <span>படித்து காட்டுங்கள்</span>
        </button>
      </div>

      {/* Emergency Phone Contacts Grid */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-black text-stone-800 uppercase tracking-wider px-1">
          📞 இலவச நேரடி தொலைபேசி எண்கள்:
        </h2>

        {emergencyContacts.map((contact, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-3xl border-2 ${contact.color} shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-black text-lg sm:text-xl text-stone-900">
                  {contact.title}
                </h3>
              </div>
              <p className="text-sm font-medium text-stone-700 max-w-md">
                {contact.desc}
              </p>
              <span className="inline-block mt-2 text-xs font-extrabold bg-white/80 px-2.5 py-0.5 rounded-full border border-stone-200">
                {contact.badge}
              </span>
            </div>

            <a
              href={`tel:${contact.number}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-black text-xl rounded-2xl shadow-md transition-all active:scale-95 flex-shrink-0"
            >
              <PhoneCall className="w-5 h-5" />
              <span>{contact.number} ஐ அழைக்கவும்</span>
            </a>
          </div>
        ))}
      </div>

      {/* Physical Support / Panchayat / CSC Guidance */}
      <div className="bg-white rounded-3xl p-6 border-2 border-warmth-200 shadow-sm">
        <h2 className="text-xl font-black text-stone-900 mb-3 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-terracotta-600" />
          <span>நேரில் சென்று உதவி பெற வேண்டுமா?</span>
        </h2>
        <div className="space-y-3 text-stone-700 font-semibold text-base">
          <div className="flex items-start gap-2.5">
            <span className="text-xl">🏛️</span>
            <p>
              <strong className="text-stone-900">கிராம ஊராட்சி அலுவலகம்:</strong> உங்கள் ஊர் பஞ்சாயத்து தலைவர் அல்லது கிராம நிர்வாக அலுவலரை (VAO) அணுகி விண்ணப்பங்களை இலவசமாக பெறலாம்.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-xl">💻</span>
            <p>
              <strong className="text-stone-900">இ-சேவை மையம் (CSC):</strong> உங்கள் ஊரில் உள்ள பொது சேவை மையத்தில் ஆதார் அட்டை மற்றும் குடும்ப அட்டை கொண்டு சென்று பதிவு செய்யலாம்.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-xl">🏥</span>
            <p>
              <strong className="text-stone-900">அங்கன்வாடி மையம்:</strong> கர்ப்பிணி தாய்மார்கள் மற்றும் குழந்தைகளுக்கு சத்துணவு மற்றும் உதவித்தொகை பெற அங்கன்வாடி ஆசிரியையிடம் பேசலாம்.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
