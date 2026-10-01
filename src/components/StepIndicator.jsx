import React from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function StepIndicator({ currentStep = 1, totalSteps = 4 }) {
  const { t } = useLanguage();

  return (
    <div className="w-full my-4">
      {/* Step textual header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-sm sm:text-base font-bold text-stone-700">
          {t.step} {currentStep} {t.of} {totalSteps}
        </span>
        <span className="text-xs sm:text-sm font-semibold text-terracotta-600 bg-terracotta-50 px-2.5 py-1 rounded-full border border-terracotta-200">
          {Math.round((currentStep / totalSteps) * 100)}% நிறைவுற்றது
        </span>
      </div>

      {/* Visual step line and nodes */}
      <div className="flex items-center justify-between relative">
        {/* Connecting Background Line */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-2 bg-warmth-200 rounded-full z-0" />
        
        {/* Active Progress Line */}
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 h-2 bg-terracotta-500 rounded-full z-0 transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 90}%`,
          }}
        />

        {/* Step Nodes */}
        {Array.from({ length: totalSteps }, (_, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div
              key={stepNum}
              className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-sm sm:text-base border-4 transition-all ${
                isCompleted
                  ? 'bg-emerald-600 border-white text-white shadow-md'
                  : isCurrent
                  ? 'bg-terracotta-500 border-warmth-100 text-white ring-4 ring-terracotta-300 scale-110 shadow-lg'
                  : 'bg-warmth-100 border-warmth-300 text-stone-400'
              }`}
            >
              {isCompleted ? <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" /> : stepNum}
            </div>
          );
        })}
      </div>
    </div>
  );
}
