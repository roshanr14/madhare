import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  PlusCircle,
  Database,
  Users,
  FileText,
  Lock,
  ArrowLeft,
  CheckCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { isSupabaseConfigured, adminCreateService, getApplications } from '../services/supabase';

export default function Admin({ onNavigateHome, onServiceAdded }) {
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const [applications, setApplications] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Service Form State
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    category: 'financial',
    benefit_amount: '',
    eligibilityText: '',
    documentsText: '',
    stepsText: '',
    official_url: '',
    official_department: '',
  });

  useEffect(() => {
    setApplications(getApplications());
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Default admin PIN for hackathon / portal access
    if (pin === 'sakhi2026' || pin === '1234') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('தவறான ரகசிய எண் (PIN). தயவுசெய்து "sakhi2026" என உள்ளிடவும்.');
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    setIsSaving(true);
    try {
      const eligibility = formData.eligibilityText
        ? formData.eligibilityText.split('\n').filter((s) => s.trim())
        : ['தகுதியுள்ள பெண்கள்'];

      const required_documents = formData.documentsText
        ? formData.documentsText.split('\n').filter((s) => s.trim())
        : ['ஆதார் அட்டை', 'வங்கி கணக்கு புத்தகம்'];

      const application_steps = formData.stepsText
        ? formData.stepsText.split('\n').filter((s) => s.trim())
        : ['அருகிலுள்ள சேவை மையத்தில் பதிவு செய்யவும்'];

      const newRecord = {
        title: formData.title,
        title_translations: {
          ta: formData.title,
          en: formData.titleEn || formData.title,
        },
        description: formData.description,
        description_translations: {
          ta: formData.description,
          en: formData.descriptionEn || formData.description,
        },
        category: formData.category,
        benefit_amount: formData.benefit_amount || 'அரசு உதவி',
        eligibility,
        required_documents,
        application_steps,
        official_url: formData.official_url || 'https://www.india.gov.in',
        official_department: formData.official_department || 'அரசு நலத்துறை',
        verification_badge: 'அங்கீகரிக்கப்பட்ட அரசு திட்டம்',
      };

      await adminCreateService(newRecord);
      setSaveSuccess(true);
      if (onServiceAdded) onServiceAdded();

      setTimeout(() => {
        setSaveSuccess(false);
        setFormData({
          title: '',
          titleEn: '',
          description: '',
          descriptionEn: '',
          category: 'financial',
          benefit_amount: '',
          eligibilityText: '',
          documentsText: '',
          stepsText: '',
          official_url: '',
          official_department: '',
        });
      }, 2000);
    } catch (err) {
      console.warn('Error creating service:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 animate-fadeIn text-left">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-warmth-200 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-3xl mx-auto mb-4">
            🔒
          </div>
          <h1 className="text-2xl font-black text-stone-900 mb-1">
            அரசு அதிகாரி உள்நுழைவு
          </h1>
          <p className="text-stone-500 font-semibold text-sm mb-6">
            அங்கீகரிக்கப்பட்ட அரசு அலுவலர்கள் மட்டுமே நுழைய முடியும்.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2 text-left">
                ரகசிய கடவுச்சொல் (Admin PIN):
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="எ.கா: sakhi2026"
                className="w-full px-4 py-3 text-lg font-bold text-center tracking-widest rounded-2xl border-2 border-warmth-300 focus:border-terracotta-500 focus:outline-none"
                autoFocus
              />
              <p className="text-xs text-stone-400 mt-1.5 text-left">
                (ஹேக்கத்தான் பரிசோதனை PIN: <strong className="text-stone-700">sakhi2026</strong>)
              </p>
            </div>

            {pinError && (
              <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200">
                {pinError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-lg rounded-2xl shadow-md transition-transform active:scale-95"
            >
              உள்நுழைக
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-warmth-100">
            <button
              onClick={onNavigateHome}
              className="text-stone-600 font-bold text-sm hover:underline"
            >
              ← முகப்புக்கு திரும்புக
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fadeIn pb-28 text-left">
      {/* Admin Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
            <span>அரசு நிர்வாக போர்டல் (Admin)</span>
          </h1>
          <p className="text-stone-500 font-semibold text-sm mt-0.5">
            திட்டங்கள் மேலாண்மை & விண்ணப்பங்களின் நிலவரம்
          </p>
        </div>

        <button
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white hover:bg-warmth-100 border-2 border-warmth-300 font-bold text-stone-800 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.home}</span>
        </button>
      </div>

      {/* Database Connection & Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border-2 border-warmth-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-500 uppercase">தரவுத்தளம் (Database)</div>
              <div className="text-sm font-black text-stone-900">
                {isSupabaseConfigured ? '🟢 Supabase இணைக்கப்பட்டது' : '🟡 லோக்கல் ஆஃப்லைன் மோட்'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-warmth-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-500 uppercase">மொத்த விண்ணப்பங்கள்</div>
              <div className="text-xl font-black text-stone-900">
                {applications.length} மனுக்கள்
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-warmth-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-500 uppercase">ஆதரிக்கும் மொழிகள்</div>
              <div className="text-xl font-black text-stone-900">
                9 இந்திய மொழிகள்
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Add New Verified Scheme Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-warmth-200 shadow-soft-lift mb-8">
        <h2 className="text-xl font-black text-stone-900 mb-1 flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-terracotta-600" />
          <span>புதிய அரசு நலத்திட்டத்தை சேர்க்கவும்</span>
        </h2>
        <p className="text-stone-500 font-semibold text-sm mb-6">
          அதிகாரப்பூர்வ அரசு ஆணை விவரங்களை உள்ளிடவும்.
        </p>

        {saveSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 font-bold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>திட்டம் வெற்றிகரமாக சேர்க்கப்பட்டது!</span>
          </div>
        )}

        <form onSubmit={handleAddService} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-stone-700 uppercase tracking-wider mb-1">
                திட்டத்தின் பெயர் (தமிழ்): *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="எ.கா: புதுமைப் பெண் திட்டம்"
                className="w-full px-4 py-3 rounded-2xl border-2 border-warmth-300 focus:border-terracotta-500 font-bold text-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-stone-700 uppercase tracking-wider mb-1">
                Scheme Name (English):
              </label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                placeholder="E.g. Pudhumai Penn Scheme"
                className="w-full px-4 py-3 rounded-2xl border-2 border-warmth-300 focus:border-terracotta-500 font-bold text-stone-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-stone-700 uppercase tracking-wider mb-1">
                உதவிப் பிரிவு (Category): *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border-2 border-warmth-300 focus:border-terracotta-500 font-bold text-stone-900 bg-white focus:outline-none"
              >
                <option value="financial">பண உதவி (Financial)</option>
                <option value="housing">வீடு (Housing)</option>
                <option value="education">கல்வி (Education)</option>
                <option value="job_skill">வேலை & தையல் (Job & Skills)</option>
                <option value="health">மருத்துவம் (Health)</option>
                <option value="women_empowerment">பெண்களுக்கான திட்டங்கள் (Women Support)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-stone-700 uppercase tracking-wider mb-1">
                உதவித் தொகை / பலன்:
              </label>
              <input
                type="text"
                value={formData.benefit_amount}
                onChange={(e) => setFormData({ ...formData, benefit_amount: e.target.value })}
                placeholder="எ.கா: ₹1,000 / மாதம்"
                className="w-full px-4 py-3 rounded-2xl border-2 border-warmth-300 focus:border-terracotta-500 font-bold text-stone-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-stone-700 uppercase tracking-wider mb-1">
              எளிய விளக்கம் (Description): *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="கிராமப்புற பெண்கள் எளிதில் புரிந்துகொள்ளும் எளிய தமிழ் வாக்கியத்தில் எழுதவும்..."
              className="w-full px-4 py-3 rounded-2xl border-2 border-warmth-300 focus:border-terracotta-500 font-semibold text-stone-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-stone-700 uppercase tracking-wider mb-1">
                தகுதிகள் (ஒவ்வொரு வரியிலும் ஒன்று):
              </label>
              <textarea
                rows={3}
                value={formData.eligibilityText}
                onChange={(e) => setFormData({ ...formData, eligibilityText: e.target.value })}
                placeholder="அரசு பள்ளி மாணவிகள்&#10;கல்லூரி முதலாம் ஆண்டு"
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-warmth-300 focus:border-terracotta-500 text-sm font-semibold text-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-stone-700 uppercase tracking-wider mb-1">
                தேவையான ஆவணங்கள்:
              </label>
              <textarea
                rows={3}
                value={formData.documentsText}
                onChange={(e) => setFormData({ ...formData, documentsText: e.target.value })}
                placeholder="ஆதார் அட்டை&#10;வங்கி பாஸ்புக்&#10;கல்லூரி அடையாள அட்டை"
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-warmth-300 focus:border-terracotta-500 text-sm font-semibold text-stone-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-stone-700 uppercase tracking-wider mb-1">
                அதிகாரப்பூர்வ இணையதளம்:
              </label>
              <input
                type="url"
                value={formData.official_url}
                onChange={(e) => setFormData({ ...formData, official_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-warmth-300 focus:border-terracotta-500 font-bold text-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-stone-700 uppercase tracking-wider mb-1">
                அரசு துறை:
              </label>
              <input
                type="text"
                value={formData.official_department}
                onChange={(e) => setFormData({ ...formData, official_department: e.target.value })}
                placeholder="சமூக நலத்துறை"
                className="w-full px-4 py-3 rounded-2xl border-2 border-warmth-300 focus:border-terracotta-500 font-bold text-stone-900 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 bg-terracotta-500 hover:bg-terracotta-600 text-white font-black text-lg rounded-2xl shadow-lg transition-transform active:scale-95"
          >
            {isSaving ? 'சேமிக்கப்படுகிறது...' : 'திட்டத்தை வெளியிடவும்'}
          </button>
        </form>
      </div>

      {/* 2. Registered Applications List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-warmth-200 shadow-soft-lift">
        <h2 className="text-xl font-black text-stone-900 mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-stone-700" />
            <span>பதிவு செய்யப்பட்ட பெண்களின் விண்ணப்பங்கள்</span>
          </span>
          <button
            onClick={() => setApplications(getApplications())}
            className="p-2 text-stone-500 hover:text-stone-800"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </h2>

        {applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-warmth-50 text-stone-600 font-extrabold uppercase text-xs border-b">
                <tr>
                  <th className="py-3 px-3">விண்ணப்ப எண்</th>
                  <th className="py-3 px-3">திட்டம்</th>
                  <th className="py-3 px-3">விண்ணப்பதாரர் பெயர்</th>
                  <th className="py-3 px-3">மாவட்டம்</th>
                  <th className="py-3 px-3">மொபைல்</th>
                  <th className="py-3 px-3">நிலை</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmth-100 font-medium text-stone-800">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-warmth-50">
                    <td className="py-3 px-3 font-mono font-bold text-emerald-800">{app.id}</td>
                    <td className="py-3 px-3 font-bold truncate max-w-[160px]">{app.service_title}</td>
                    <td className="py-3 px-3 font-bold">{app.form_data?.name || 'N/A'}</td>
                    <td className="py-3 px-3">{app.form_data?.district || 'N/A'}</td>
                    <td className="py-3 px-3 font-mono">{app.form_data?.phone || 'N/A'}</td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        {app.status || 'பதிவு செய்யப்பட்டது'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-stone-500 font-semibold">
            இன்னும் விண்ணப்பங்கள் எதுவும் பதிவு செய்யப்படவில்லை.
          </div>
        )}
      </div>
    </div>
  );
}
