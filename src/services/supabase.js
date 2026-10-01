import { createClient } from '@supabase/supabase-js';
import { INITIAL_SCHEMES } from '../data/mockSchemes';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// LocalStorage Keys for reliable offline operation
const LOCAL_STORAGE_SCHEMES_KEY = 'sakhi_services_cache';
const LOCAL_STORAGE_SAVED_KEY = 'sakhi_saved_services';
const LOCAL_STORAGE_APPLICATIONS_KEY = 'sakhi_applications';
const LOCAL_STORAGE_ACTIVITY_KEY = 'sakhi_user_activity';

// Initialize local cache if empty
if (!localStorage.getItem(LOCAL_STORAGE_SCHEMES_KEY)) {
  localStorage.setItem(LOCAL_STORAGE_SCHEMES_KEY, JSON.stringify(INITIAL_SCHEMES));
}

// 1. Fetch All Services
export async function getServices() {
  if (isSupabaseConfigured && navigator.onLine) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_SCHEMES_KEY, JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn('Supabase fetch failed, using local cache:', err);
    }
  }

  // Fallback to local storage / default schemes
  const cached = localStorage.getItem(LOCAL_STORAGE_SCHEMES_KEY);
  return cached ? JSON.parse(cached) : INITIAL_SCHEMES;
}

// 2. Fetch Single Service by ID
export async function getServiceById(id) {
  const allServices = await getServices();
  return allServices.find((s) => s.id === id) || null;
}

// 3. Saved Services
export async function getSavedServiceIds(userId = 'guest-user') {
  if (isSupabaseConfigured && navigator.onLine && userId !== 'guest-user') {
    try {
      const { data, error } = await supabase
        .from('saved_services')
        .select('service_id')
        .eq('user_id', userId);
      if (!error && data) {
        return data.map((item) => item.service_id);
      }
    } catch (err) {
      console.warn('Error fetching saved services from Supabase:', err);
    }
  }

  const saved = localStorage.getItem(`${LOCAL_STORAGE_SAVED_KEY}_${userId}`);
  return saved ? JSON.parse(saved) : [];
}

export async function toggleSaveService(userId = 'guest-user', serviceId) {
  const currentSaved = await getSavedServiceIds(userId);
  const exists = currentSaved.includes(serviceId);
  const updated = exists
    ? currentSaved.filter((id) => id !== serviceId)
    : [...currentSaved, serviceId];

  localStorage.setItem(`${LOCAL_STORAGE_SAVED_KEY}_${userId}`, JSON.stringify(updated));

  if (isSupabaseConfigured && navigator.onLine && userId !== 'guest-user') {
    try {
      if (exists) {
        await supabase
          .from('saved_services')
          .delete()
          .match({ user_id: userId, service_id: serviceId });
      } else {
        await supabase
          .from('saved_services')
          .insert({ user_id: userId, service_id: serviceId });
      }
    } catch (err) {
      console.warn('Error syncing toggle save to Supabase:', err);
    }
  }

  return !exists;
}

// 4. Save Application Progress
export async function saveApplicationProgress({
  id,
  userId = 'guest-user',
  serviceId,
  serviceTitle,
  currentStep,
  status = 'submitted',
  formData,
}) {
  const applicationId = id || `APP-${Date.now().toString().slice(-6)}`;
  const record = {
    id: applicationId,
    user_id: userId,
    service_id: serviceId,
    service_title: serviceTitle,
    current_step: currentStep,
    status,
    form_data: formData,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  // Save to local storage
  const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_APPLICATIONS_KEY) || '[]');
  const index = existing.findIndex((a) => a.id === applicationId || (a.service_id === serviceId && a.user_id === userId));

  if (index >= 0) {
    existing[index] = { ...existing[index], ...record, updated_at: new Date().toISOString() };
  } else {
    existing.unshift(record);
  }
  localStorage.setItem(LOCAL_STORAGE_APPLICATIONS_KEY, JSON.stringify(existing));

  // Sync to Supabase if available
  if (isSupabaseConfigured && navigator.onLine) {
    try {
      await supabase.from('application_progress').upsert({
        user_id: userId,
        service_id: serviceId,
        current_step: currentStep,
        status,
        form_data: formData,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Could not sync application to Supabase, saved locally:', err);
    }
  }

  return record;
}

export function getApplications() {
  const raw = localStorage.getItem(LOCAL_STORAGE_APPLICATIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

// 5. User Activity Logging
export async function logUserActivity(action, serviceId = null, details = {}) {
  const activityItem = {
    id: `ACT-${Date.now()}`,
    action,
    service_id: serviceId,
    details,
    created_at: new Date().toISOString(),
  };

  const current = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ACTIVITY_KEY) || '[]');
  current.unshift(activityItem);
  localStorage.setItem(LOCAL_STORAGE_ACTIVITY_KEY, JSON.stringify(current.slice(0, 50)));

  if (isSupabaseConfigured && navigator.onLine) {
    try {
      await supabase.from('user_activity').insert({
        action,
        service_id: serviceId,
        details,
      });
    } catch (err) {
      // Activity log fail is non-blocking
    }
  }
}

// 6. Admin Service Creation
export async function adminCreateService(newService) {
  const allServices = await getServices();
  const createdRecord = {
    ...newService,
    id: newService.id || `srv-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  const updated = [createdRecord, ...allServices];
  localStorage.setItem(LOCAL_STORAGE_SCHEMES_KEY, JSON.stringify(updated));

  if (isSupabaseConfigured && navigator.onLine) {
    try {
      await supabase.from('services').insert(createdRecord);
    } catch (err) {
      console.warn('Admin Supabase insert failed, saved to local cache:', err);
    }
  }

  return createdRecord;
}
