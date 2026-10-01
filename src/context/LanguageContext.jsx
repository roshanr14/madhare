import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES, TRANSLATIONS } from '../data/translations';

const LanguageContext = createContext();

const LOCAL_STORAGE_LANG_KEY = 'sakhi_user_language';

export function LanguageProvider({ children }) {
  // Read saved language or default to 'ta' (Tamil)
  const [currentLangCode, setCurrentLangCode] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_LANG_KEY) || 'ta';
  });

  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(() => {
    return Boolean(localStorage.getItem(LOCAL_STORAGE_LANG_KEY));
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_LANG_KEY, currentLangCode);
  }, [currentLangCode]);

  const setLanguage = (langCode) => {
    setCurrentLangCode(langCode);
    setHasSelectedLanguage(true);
    localStorage.setItem(LOCAL_STORAGE_LANG_KEY, langCode);
  };

  const currentLang = LANGUAGES.find((l) => l.code === currentLangCode) || LANGUAGES[0];
  const t = TRANSLATIONS[currentLangCode] || TRANSLATIONS.ta;

  // Helper to resolve localized fields from scheme data
  const getLocalizedField = (item, fieldName) => {
    if (!item) return '';

    // Check translations JSONB map
    const translationsMap = item[`${fieldName}_translations`];
    if (translationsMap && translationsMap[currentLangCode]) {
      return translationsMap[currentLangCode];
    }

    // Check English fallback
    if (translationsMap && translationsMap.en) {
      return translationsMap.en;
    }

    // Default to base field
    return item[fieldName] || '';
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLangCode,
        currentLang,
        languages: LANGUAGES,
        t,
        setLanguage,
        hasSelectedLanguage,
        getLocalizedField,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
