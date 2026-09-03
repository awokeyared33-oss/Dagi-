-- ============================================================================
-- JOSSY GYM PRODUCTION SUPABASE BACKEND SCHEMA & RLS POLICIES
-- Fully normalized PostgreSQL schema for Member Application & Admin Console
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Types & Enums
DO $$ BEGIN
    CREATE TYPE member_status_enum AS ENUM ('pending', 'active', 'suspended', 'deactivated', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE membership_tier_enum AS ENUM ('Standard', 'VIP', 'Elite Athlete');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE admin_role_enum AS ENUM ('super_admin', 'admin', 'staff', 'trainer', 'nutritionist');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type_enum AS ENUM ('welcome', 'morning_workout', 'night_recovery', 'admin_broadcast', 'workout_reminder', 'nutrition', 'system', 'membership_due', 'payment_confirmed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Admin Profiles Table
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role admin_role_enum NOT NULL DEFAULT 'admin',
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Members Profile Table (Linked directly to Supabase Auth User UUID)
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'member',
    status member_status_enum NOT NULL DEFAULT 'active',
    membership_tier membership_tier_enum NOT NULL DEFAULT 'VIP',
    goal TEXT NOT NULL DEFAULT 'build_muscle',
    experience_level TEXT NOT NULL DEFAULT 'intermediate',
    sex TEXT DEFAULT 'male',
    date_of_birth DATE,
    age INT,
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    training_frequency INT NOT NULL DEFAULT 4,
    available_equipment TEXT DEFAULT 'full_gym',
    dietary_preferences TEXT DEFAULT 'high_protein',
    fasting_preference TEXT DEFAULT 'none',
    language TEXT NOT NULL DEFAULT 'en',
    avatar_url TEXT,
    assigned_program_id TEXT DEFAULT 'split-4',
    calorie_target INT NOT NULL DEFAULT 2400,
    protein_target INT NOT NULL DEFAULT 160,
    carbs_target INT NOT NULL DEFAULT 260,
    fat_target INT NOT NULL DEFAULT 70,
    fiber_target INT NOT NULL DEFAULT 35,
    override_calories INT,
    override_protein INT,
    override_carbs INT,
    override_fat INT,
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    suspended_at TIMESTAMPTZ,
    last_active_at TIMESTAMPTZ
);

-- 5. Food Catalog Table
CREATE TABLE IF NOT EXISTS public.food_items (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_am TEXT NOT NULL,
    category TEXT NOT NULL, -- breakfast, lunch, dinner, snack
    serving_size TEXT NOT NULL,
    serving_grams NUMERIC(6,2) NOT NULL DEFAULT 100,
    calories INT NOT NULL CHECK (calories >= 0),
    protein_g NUMERIC(5,2) NOT NULL CHECK (protein_g >= 0),
    carbs_g NUMERIC(5,2) NOT NULL CHECK (carbs_g >= 0),
    fat_g NUMERIC(5,2) NOT NULL CHECK (fat_g >= 0),
    fiber_g NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (fiber_g >= 0),
    sugar_g NUMERIC(5,2) DEFAULT 0,
    is_ethiopian_traditional BOOLEAN NOT NULL DEFAULT TRUE,
    is_fasting_friendly BOOLEAN NOT NULL DEFAULT FALSE,
    affordability_tier TEXT DEFAULT 'standard',
    emoji TEXT DEFAULT '🍲',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Member Meal Logs Table
CREATE TABLE IF NOT EXISTS public.meal_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    food_id TEXT REFERENCES public.food_items(id) ON DELETE SET NULL,
    name_en TEXT NOT NULL,
    name_am TEXT NOT NULL,
    category TEXT NOT NULL,
    serving_size TEXT NOT NULL,
    quantity NUMERIC(4,2) NOT NULL DEFAULT 1.0 CHECK (quantity > 0),
    calories INT NOT NULL,
    protein_g NUMERIC(5,2) NOT NULL,
    carbs_g NUMERIC(5,2) NOT NULL,
    fat_g NUMERIC(5,2) NOT NULL,
    fiber_g NUMERIC(5,2) NOT NULL DEFAULT 0,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Workout Programs & Assignments Table
CREATE TABLE IF NOT EXISTS public.workout_programs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    days_count INT NOT NULL,
    target_level TEXT NOT NULL,
    description TEXT NOT NULL,
    split_details JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.member_workout_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    program_id TEXT NOT NULL REFERENCES public.workout_programs(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    custom_notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Completed Workout Sessions Table
CREATE TABLE IF NOT EXISTS public.workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    routine_id TEXT NOT NULL,
    routine_name TEXT NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 45,
    calories_burned INT NOT NULL DEFAULT 320,
    exercises_completed INT NOT NULL DEFAULT 5,
    sets_data JSONB DEFAULT '[]'::jsonb,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Progress & Weight Logs Table
CREATE TABLE IF NOT EXISTS public.progress_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    weight_kg NUMERIC(5,2) NOT NULL,
    body_fat_pct NUMERIC(4,2),
    notes TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_user_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    message TEXT,
    type notification_type_enum NOT NULL DEFAULT 'system',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Jossy AI Conversations & Logs
CREATE TABLE IF NOT EXISTS public.jossy_ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    parsed_foods JSONB DEFAULT '[]'::jsonb,
    total_nutrition JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_members_auth_user_id ON public.members(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members(status);
CREATE INDEX IF NOT EXISTS idx_meal_logs_user_id ON public.meal_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_logs_logged_at ON public.meal_logs(logged_at);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON public.workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(recipient_user_id) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_progress_logs_user_id ON public.progress_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_food_items_name ON public.food_items(name_en);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_workout_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jossy_ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if caller is Admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE auth_user_id = user_id AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Admin Profiles Policy
CREATE POLICY "Admins can view admin profiles"
    ON public.admin_profiles FOR SELECT
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- 2. Members Table Policies
CREATE POLICY "Members can view own profile"
    ON public.members FOR SELECT
    TO authenticated
    USING (auth.uid() = auth_user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Members can update permitted fields on own profile"
    ON public.members FOR UPDATE
    TO authenticated
    USING (auth.uid() = auth_user_id AND status = 'active')
    WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Admins have full access to members table"
    ON public.members FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- 3. Meal Logs Policies (Strict Data Isolation)
CREATE POLICY "Users can only read own meal logs"
    ON public.meal_logs FOR SELECT
    TO authenticated
    USING (
        user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid() AND status = 'active')
        OR public.is_admin(auth.uid())
    );

CREATE POLICY "Users can insert own meal logs"
    ON public.meal_logs FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid() AND status = 'active')
    );

CREATE POLICY "Users can delete own meal logs"
    ON public.meal_logs FOR DELETE
    TO authenticated
    USING (
        user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid() AND status = 'active')
    );

-- 4. Workout Sessions Policies
CREATE POLICY "Users can only read own workout sessions"
    ON public.workout_sessions FOR SELECT
    TO authenticated
    USING (
        user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid() AND status = 'active')
        OR public.is_admin(auth.uid())
    );

CREATE POLICY "Users can insert own workout sessions"
    ON public.workout_sessions FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid() AND status = 'active')
    );

-- 5. Progress Logs Policies
CREATE POLICY "Users can only view own progress logs"
    ON public.progress_logs FOR SELECT
    TO authenticated
    USING (
        user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid() AND status = 'active')
        OR public.is_admin(auth.uid())
    );

CREATE POLICY "Users can record own progress logs"
    ON public.progress_logs FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid() AND status = 'active')
    );

-- 6. Notifications Policies
CREATE POLICY "Users can read own notifications"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (
        recipient_user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid())
        OR public.is_admin(auth.uid())
    );

CREATE POLICY "Users can update read status on own notifications"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (
        recipient_user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid())
    )
    WITH CHECK (
        recipient_user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid())
    );

CREATE POLICY "Admins can create notifications"
    ON public.notifications FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin(auth.uid()));

-- 7. Jossy AI Messages Policies
CREATE POLICY "Users can only read own AI messages"
    ON public.jossy_ai_messages FOR SELECT
    TO authenticated
    USING (
        user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid())
    );

CREATE POLICY "Users can insert own AI messages"
    ON public.jossy_ai_messages FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid() AND status = 'active')
    );

-- 8. Food Items Policies
CREATE POLICY "Everyone authenticated can read active food catalog"
    ON public.food_items FOR SELECT
    TO authenticated
    USING (is_active = TRUE OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage food items"
    ON public.food_items FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- 9. Audit Logs Policies (Admins only)
CREATE POLICY "Admins can read audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (public.is_admin(auth.uid()));

CREATE POLICY "System and Admins can insert audit logs"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin(auth.uid()));
