import React from 'react';
import { Star, ArrowLeft, ArrowRight, Volume2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SimpleCard from '../components/SimpleCard';

export default function SavedServices({
  allServices = [],
  savedServiceIds = [],
  onToggleSave,
  onSelectService,
  onNavigateHome,
}) {
  const { t } = useLanguage();

  const savedList = allServices.filter((s) => savedServiceIds.includes(s.id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fadeIn pb-28 text-left">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 flex items-center gap-2">
            <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
            <span>{t.navSaved}</span>
          </h1>
          <p className="text-stone-500 font-semibold mt-1">
            நீங்கள் குறித்து வைத்த அரசு திட்டங்கள்
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

      {/* List of saved schemes */}
      {savedList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {savedList.map((service) => (
            <SimpleCard
              key={service.id}
              service={service}
              onSelect={onSelectService}
              isSaved={true}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border-2 border-warmth-200 text-center my-8">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 mx-auto flex items-center justify-center text-3xl mb-3">
            ⭐
          </div>
          <h2 className="text-xl font-extrabold text-stone-900 mb-2">
            சேமிக்கப்பட்ட திட்டங்கள் எதுவும் இல்லை
          </h2>
          <p className="text-stone-600 font-medium max-w-md mx-auto mb-6">
            திட்டங்களில் உள்ள நட்சத்திரக் குறியீட்டை (⭐) தொட்டு, உங்களுக்குத் தேவையான திட்டங்களை இங்கு சேர்த்துக்கொள்ளலாம்.
          </p>
          <button
            onClick={onNavigateHome}
            className="px-6 py-3.5 bg-terracotta-500 hover:bg-terracotta-600 text-white font-extrabold rounded-2xl shadow-md transition-transform active:scale-95"
          >
            திட்டங்களை பார்க்க செல்லவும்
          </button>
        </div>
      )}
    </div>
  );
}
