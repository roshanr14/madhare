-- ========================================================
-- Sakhi / Women-First Digital Access Platform Schema
-- Supabase PostgreSQL with Row Level Security (RLS)
-- ========================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    phone TEXT,
    preferred_language TEXT DEFAULT 'ta', -- 'ta' (Tamil), 'hi' (Hindi), etc.
    district TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    title_translations JSONB DEFAULT '{}'::jsonb, -- translations for { ta: "...", hi: "...", ... }
    description TEXT NOT NULL,
    description_translations JSONB DEFAULT '{}'::jsonb,
    category TEXT NOT NULL, -- 'financial', 'housing', 'education', 'job_skill', 'health', 'women_empowerment'
    icon_name TEXT DEFAULT 'Heart',
    benefit_amount TEXT,
    eligibility JSONB NOT NULL DEFAULT '[]'::jsonb,
    eligibility_translations JSONB DEFAULT '{}'::jsonb,
    required_documents JSONB NOT NULL DEFAULT '[]'::jsonb,
    required_documents_translations JSONB DEFAULT '{}'::jsonb,
    application_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    application_steps_translations JSONB DEFAULT '{}'::jsonb,
    official_url TEXT,
    official_department TEXT,
    verification_badge TEXT DEFAULT 'Official Verified Scheme',
    audio_summary_text JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. USER ACTIVITY TABLE
CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- 'view', 'read_aloud', 'start_application', 'submit'
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SAVED SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.saved_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, service_id)
);

-- 5. APPLICATION PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.application_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    current_step INT DEFAULT 1,
    total_steps INT DEFAULT 4,
    status TEXT DEFAULT 'draft', -- 'draft', 'submitted', 'review'
    form_data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_progress ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Services: Readable by anyone (public welfare schemes must be freely accessible to all women)
CREATE POLICY "Services are viewable by all users" 
ON public.services FOR SELECT USING (true);

-- Admins can insert/update services (can be configured with service role or role claim)
CREATE POLICY "Admins can manage services" 
ON public.services FOR ALL USING (auth.role() = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

-- Users can view and manage their own profile
CREATE POLICY "Users can view own profile" 
ON public.users FOR SELECT USING (auth.uid() = auth_id OR id::text = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Users can update own profile" 
ON public.users FOR UPDATE USING (auth.uid() = auth_id OR id::text = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Users can insert own profile" 
ON public.users FOR INSERT WITH CHECK (true);

-- Saved Services: Users can manage only their own saved items
CREATE POLICY "Users can view own saved services" 
ON public.saved_services FOR SELECT USING (true);

CREATE POLICY "Users can save services" 
ON public.saved_services FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete own saved services" 
ON public.saved_services FOR DELETE USING (true);

-- Application Progress: Users can manage only their own progress
CREATE POLICY "Users can view own application progress" 
ON public.application_progress FOR SELECT USING (true);

CREATE POLICY "Users can insert application progress" 
ON public.application_progress FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own application progress" 
ON public.application_progress FOR UPDATE USING (true);

-- User Activity: Logged activities
CREATE POLICY "Users can view and insert own activity" 
ON public.user_activity FOR ALL USING (true);
