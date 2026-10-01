import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { VoiceProvider, useVoice } from './context/VoiceContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import LanguageSelectorModal from './components/LanguageSelectorModal';
import HelpModal from './components/HelpModal';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import ServiceDetails from './pages/ServiceDetails';
import Application from './pages/Application';
import SavedServices from './pages/SavedServices';
import Help from './pages/Help';
import Admin from './pages/Admin';
import { getServices, getSavedServiceIds, toggleSaveService, logUserActivity } from './services/supabase';

function MainApp() {
  const { hasSelectedLanguage, t } = useLanguage();
  const { setNavigationCallback, speak } = useVoice();

  // Navigation state
  const [currentPage, setCurrentPage] = useState(() => {
    // If first time visit and hasn't picked language, start on welcome
    const hash = window.location.hash.replace('#', '');
    if (['home', 'saved', 'help', 'admin'].includes(hash)) return hash;
    return localStorage.getItem('sakhi_visited') ? 'home' : 'welcome';
  });

  const [services, setServices] = useState([]);
  const [savedServiceIds, setSavedServiceIds] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  // Modals
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isVoiceAssistantModalOpen, setIsVoiceAssistantModalOpen] = useState(false);

  // Load schemes & saved bookmarks
  const refreshData = async () => {
    const list = await getServices();
    setServices(list);
    const saved = await getSavedServiceIds();
    setSavedServiceIds(saved);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['welcome', 'home', 'saved', 'help', 'admin'].includes(hash)) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when page changes
  useEffect(() => {
    if (currentPage !== 'details' && currentPage !== 'application') {
      window.location.hash = currentPage;
    }
  }, [currentPage]);

  // Voice Navigation handler: handles "முகப்புக்கு போ", "பின்னால் போ", etc.
  useEffect(() => {
    setNavigationCallback((command) => {
      if (command.type === 'NAVIGATE') {
        setCurrentPage('home');
        speak('முகப்பு பக்கத்திற்கு வந்தாச்சு.');
      } else if (command.type === 'GO_BACK') {
        if (currentPage === 'details' || currentPage === 'application') {
          setCurrentPage('home');
        } else if (currentPage !== 'home') {
          setCurrentPage('home');
        }
        speak('பின்னால் வந்தாச்சு.');
      } else if (command.type === 'TRIGGER_HELP') {
        setIsHelpModalOpen(true);
      }
    });
  }, [currentPage, setNavigationCallback, speak]);

  const handleSelectService = (service) => {
    setSelectedService(service);
    setCurrentPage('details');
    logUserActivity('view_service', service.id);
  };

  const handleStartApplication = (service) => {
    setSelectedService(service);
    setCurrentPage('application');
    logUserActivity('start_application', service.id);
  };

  const handleToggleSave = async (serviceId) => {
    const isNowSaved = await toggleSaveService('guest-user', serviceId);
    setSavedServiceIds((prev) =>
      isNowSaved ? [...prev, serviceId] : prev.filter((id) => id !== serviceId)
    );
    speak(isNowSaved ? t.savedAlready : 'நீக்கப்பட்டது');
  };

  const navigateToHomeWithCategory = (category) => {
    localStorage.setItem('sakhi_visited', 'true');
    setActiveCategoryFilter(category);
    setActiveSearchQuery('');
    setCurrentPage('home');
  };

  const navigateToHomeWithSearch = (query) => {
    localStorage.setItem('sakhi_visited', 'true');
    setActiveCategoryFilter('all');
    setActiveSearchQuery(query);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-warmth-50 text-stone-900">
      {/* 1. Accessible Global Header */}
      <Header
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onOpenHelpModal={() => setIsHelpModalOpen(true)}
        onNavigateHome={() => setCurrentPage('home')}
      />

      {/* 2. Main Page Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto">
        {currentPage === 'welcome' && (
          <Welcome
            onSelectCategory={navigateToHomeWithCategory}
            onSearchSubmit={navigateToHomeWithSearch}
            onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
            onOpenVoiceModal={() => setIsVoiceAssistantModalOpen(true)}
          />
        )}

        {currentPage === 'home' && (
          <Home
            services={services}
            savedServiceIds={savedServiceIds}
            onToggleSave={handleToggleSave}
            onSelectService={handleSelectService}
            initialCategory={activeCategoryFilter}
            initialSearchQuery={activeSearchQuery}
          />
        )}

        {currentPage === 'details' && (
          <ServiceDetails
            service={selectedService}
            onBack={() => setCurrentPage('home')}
            onStartApplication={handleStartApplication}
            isSaved={selectedService ? savedServiceIds.includes(selectedService.id) : false}
            onToggleSave={handleToggleSave}
          />
        )}

        {currentPage === 'application' && (
          <Application
            service={selectedService}
            onBack={() => setCurrentPage('details')}
            onComplete={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'saved' && (
          <SavedServices
            allServices={services}
            savedServiceIds={savedServiceIds}
            onToggleSave={handleToggleSave}
            onSelectService={handleSelectService}
            onNavigateHome={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'help' && (
          <Help onNavigateHome={() => setCurrentPage('home')} />
        )}

        {currentPage === 'admin' && (
          <Admin
            onNavigateHome={() => setCurrentPage('home')}
            onServiceAdded={refreshData}
          />
        )}
      </main>

      {/* 3. Bottom Navigation Bar */}
      <BottomNav
        activeTab={
          currentPage === 'home' || currentPage === 'welcome'
            ? 'home'
            : currentPage === 'saved'
            ? 'saved'
            : currentPage === 'help'
            ? 'help'
            : 'home'
        }
        onSelectTab={(tab) => {
          if (tab === 'home') setCurrentPage('home');
          if (tab === 'saved') setCurrentPage('saved');
          if (tab === 'help') setCurrentPage('help');
        }}
        onOpenVoiceModal={() => setIsVoiceAssistantModalOpen(true)}
      />

      {/* 4. Modals */}
      <LanguageSelectorModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        pageContext={currentPage}
      />

      <VoiceAssistantModal
        isOpen={isVoiceAssistantModalOpen}
        onClose={() => setIsVoiceAssistantModalOpen(false)}
        allServices={services}
        onSelectService={handleSelectService}
        onApplyCategoryFilter={navigateToHomeWithCategory}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <VoiceProvider>
        <MainApp />
      </VoiceProvider>
    </LanguageProvider>
  );
}
