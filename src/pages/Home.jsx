import React, { useState, useMemo } from 'react';
import { Search, Mic, RotateCcw, Volume2, Sparkles, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import SimpleCard from '../components/SimpleCard';

export default function Home({
  services = [],
  savedServiceIds = [],
  onToggleSave,
  onSelectService,
  initialCategory = 'all',
  initialSearchQuery = '',
}) {
  const { t, getLocalizedField } = useLanguage();
  const { startListening, speak } = useVoice();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const categories = [
    { key: 'all', label: t.categories.all, emoji: '✨' },
    { key: 'financial', label: t.categories.financial, emoji: '💰' },
    { key: 'housing', label: t.categories.housing, emoji: '🏠' },
    { key: 'education', label: t.categories.education, emoji: '🎓' },
    { key: 'job_skill', label: t.categories.job_skill, emoji: '💼' },
    { key: 'health', label: t.categories.health, emoji: '🏥' },
    { key: 'women_empowerment', label: t.categories.women_empowerment, emoji: '👩' },
  ];

  // Filter schemes by category and search term
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      // Category match
      const categoryMatch = selectedCategory === 'all' || service.category === selectedCategory;
      if (!categoryMatch) return false;

      // Search query match
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const title = (getLocalizedField(service, 'title') || '').toLowerCase();
      const desc = (getLocalizedField(service, 'description') || '').toLowerCase();
      const cat = (service.category || '').toLowerCase();

      return title.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }, [services, selectedCategory, searchQuery, getLocalizedField]);

  const handleVoiceSearch = () => {
    startListening((spokenText) => {
      setSearchQuery(spokenText);
      speak(`${spokenText} தொடர்பான திட்டங்கள் தேடப்படுகின்றன.`);
    });
  };

  const handleReset = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fadeIn pb-24">
      {/* Search Input Bar with Voice Trigger */}
      <div className="mb-6">
        <div className="relative flex items-center bg-white rounded-3xl border-2 border-warmth-300 focus-within:border-terracotta-500 shadow-sm transition-all p-1.5">
          <Search className="w-6 h-6 text-stone-400 ml-3 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full px-3 py-3 text-base sm:text-lg font-semibold text-stone-900 bg-transparent focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-2 text-stone-400 hover:text-stone-600 font-bold mr-1"
            >
              ✕
            </button>
          )}
          {/* Quick Mic trigger in search bar */}
          <button
            type="button"
            onClick={handleVoiceSearch}
            className="flex items-center gap-1 px-4 py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-2xl font-bold text-sm shadow-sm transition-transform active:scale-95 flex-shrink-0"
            aria-label="Voice search"
          >
            <Mic className="w-5 h-5" />
            <span className="hidden sm:inline">{t.speakPrompt}</span>
          </button>
        </div>
      </div>

      {/* Horizontal Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-sm sm:text-base whitespace-nowrap transition-all border-2 ${
                isActive
                  ? 'bg-terracotta-500 text-white border-terracotta-600 shadow-md scale-105'
                  : 'bg-white hover:bg-warmth-100 text-stone-700 border-warmth-200'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl sm:text-2xl font-black text-stone-900">
          {categories.find((c) => c.key === selectedCategory)?.label || t.categories.all}
          <span className="ml-2 text-base font-bold text-stone-500">
            ({filteredServices.length} திட்டங்கள்)
          </span>
        </h2>

        {(selectedCategory !== 'all' || searchQuery) && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-terracotta-600 hover:text-terracotta-800 bg-warmth-100 px-3 py-1.5 rounded-xl border border-warmth-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>அனைத்தும்</span>
          </button>
        )}
      </div>

      {/* Schemes Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredServices.map((service) => (
            <SimpleCard
              key={service.id}
              service={service}
              onSelect={onSelectService}
              isSaved={savedServiceIds.includes(service.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border-2 border-warmth-200 text-center my-6">
          <div className="w-16 h-16 rounded-3xl bg-warmth-100 mx-auto flex items-center justify-center text-3xl mb-3">
            🔍
          </div>
          <h3 className="text-xl font-extrabold text-stone-900 mb-1">
            திட்டங்கள் எதுவும் காணப்படவில்லை
          </h3>
          <p className="text-stone-600 font-semibold mb-6">
            வேறு வார்த்தைகளை பயன்படுத்தவும் அல்லது மைக் தொட்டு பேசவும்.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white font-extrabold rounded-2xl shadow-md transition-transform active:scale-95"
          >
            அனைத்து திட்டங்களையும் காட்டு
          </button>
        </div>
      )}
    </div>
  );
}
