-- ============================================================================
-- JOSSY GYM PRODUCTION SUPABASE BACKEND DATABASE SCHEMA
-- Target Project: https://ktnipucfeyxhpxanulmt.supabase.co
-- Complete Consolidated Migration (20260829_jossy_gym_schema + 20260902_membership_payment_system)
-- Safe, Idempotent, and Fully Verified for Fresh or Existing Supabase Databases
-- ============================================================================

-- ============================================================================
-- PART 1: EXTENSIONS & ENUMS
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Types & Enums
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
    CREATE TYPE notification_type_enum AS ENUM (
        'welcome', 
        'morning_workout', 
        'night_recovery', 
        'admin_broadcast', 
        'workout_reminder', 
        'nutrition', 
        'system', 
        'membership_due', 
        'payment_confirmed',
        'payment_success'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- PART 2: CORE TABLES (MIGRATION 1)
-- ============================================================================

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
    membership_status TEXT DEFAULT 'active',
    payment_status TEXT DEFAULT 'paid',
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

-- 10. Notifications Table (Compatible with core system & payment reminders)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_user_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT,
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
-- PART 3: 30-DAY ETHIOPIAN MEMBERSHIP & PAYMENT SYSTEM (MIGRATION 2)
-- ============================================================================

-- 13. Create membership_cycles Table
CREATE TABLE IF NOT EXISTS public.membership_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  cycle_number INT NOT NULL DEFAULT 1,
  start_date DATE NOT NULL,
  start_date_eth TEXT NOT NULL,
  end_date DATE NOT NULL,
  end_date_eth TEXT NOT NULL,
  due_date DATE NOT NULL,
  due_date_eth TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'overdue', 'paused')),
  payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('paid', 'payment_due', 'overdue')),
  amount NUMERIC(10,2) NOT NULL DEFAULT 1000.00,
  currency TEXT NOT NULL DEFAULT 'ETB',
  paid_at TIMESTAMPTZ,
  paid_at_eth TEXT,
  payment_method TEXT CHECK (payment_method IN ('cash', 'telebirr', 'cbe_birr', 'bank_transfer', 'card', 'other')),
  recorded_by TEXT DEFAULT 'admin@jossygym.com',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_cycle_number UNIQUE (user_id, cycle_number)
);

-- 14. Create membership_payments Permanent Ledger Table
CREATE TABLE IF NOT EXISTS public.membership_payments (
  id TEXT PRIMARY KEY, -- Standard receipt format e.g. REC-20260902-8392
  user_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  membership_cycle_id UUID REFERENCES public.membership_cycles(id) ON DELETE SET NULL,
  cycle_number INT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ETB',
  payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payment_date_eth TEXT NOT NULL,
  due_date DATE NOT NULL,
  due_date_eth TEXT NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'telebirr', 'cbe_birr', 'bank_transfer', 'card', 'other')),
  recorded_by TEXT NOT NULL DEFAULT 'admin@jossygym.com',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all member and notification auxiliary columns exist if updating existing tables
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member';
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS membership_status TEXT DEFAULT 'active';
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'paid';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.members(id) ON DELETE CASCADE;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS recipient_user_id UUID REFERENCES public.members(id) ON DELETE CASCADE;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS body TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- ============================================================================
-- PART 4: PERFORMANCE & DEDUPLICATION INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_members_auth_user_id ON public.members(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members(status);
CREATE INDEX IF NOT EXISTS idx_meal_logs_user_id ON public.meal_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_logs_logged_at ON public.meal_logs(logged_at);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON public.workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(recipient_user_id) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_progress_logs_user_id ON public.progress_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_food_items_name ON public.food_items(name_en);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_membership_cycles_user ON public.membership_cycles(user_id);
CREATE INDEX IF NOT EXISTS idx_membership_cycles_due_date ON public.membership_cycles(due_date);
CREATE INDEX IF NOT EXISTS idx_membership_cycles_payment_status ON public.membership_cycles(payment_status);
CREATE INDEX IF NOT EXISTS idx_membership_payments_user ON public.membership_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_membership_payments_date ON public.membership_payments(payment_date DESC);

-- Unique Notification Deduplication Index: user_id + cycle_id + type
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_membership_due_notif 
  ON public.notifications (user_id, (metadata->>'cycle_id'), type) 
  WHERE type = 'membership_due';

-- ============================================================================
-- PART 5: SECURITY FUNCTIONS
-- ============================================================================

-- Helper Function: Check if caller is Admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE auth_user_id = user_id AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- PART 6: ROW LEVEL SECURITY (RLS) POLICIES
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
ALTER TABLE public.membership_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_payments ENABLE ROW LEVEL SECURITY;

-- 1. Admin Profiles Policies
DROP POLICY IF EXISTS "Admins can view admin profiles" ON public.admin_profiles;
CREATE POLICY "Admins can view admin profiles"
    ON public.admin_profiles FOR SELECT
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- 2. Members Table Policies
DROP POLICY IF EXISTS "Members can view own profile" ON public.members;
CREATE POLICY "Members can view own profile"
    ON public.members FOR SELECT
    TO authenticated
    USING (auth.uid() = auth_user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Members can update permitted fields on own profile" ON public.members;
CREATE POLICY "Members can update permitted fields on own profile"
    ON public.members FOR UPDATE
    TO authenticated
    USING (auth.uid() = auth_user_id AND status = 'active')
    WITH CHECK (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Admins have full access to members table" ON public.members;
CREATE POLICY "Admins have full access to members table"
    ON public.members FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- 3. Meal Logs Policies (Strict Data Isolation)
DROP POLICY IF EXISTS "Users can only read own meal logs" ON public.meal_logs;
CREATE POLICY "Users can only read own meal logs"
    ON public.meal_logs FOR SELECT
    TO authenticated
    USING (
        user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid() AND status = 'active')
        OR public.is_admin(auth.uid())
    );

DROP POLICY IF EXISTS "Users can insert own meal logs" ON public.meal_logs;
CREATE POLICY "Users can insert own meal logs"
    ON public.meal_logs FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid() AND status = 'active')
    );

DROP POLICY IF EXISTS "Users can delete own meal logs" ON public.meal_logs;
CREATE POLICY "Users can delete own meal logs"
    ON public.meal_logs FOR DELETE
    TO authenticated
    USING (
        user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid() AND status = 'active')
    );

-- 4. Workout Sessions Policies
DROP POLICY IF EXISTS "Users can only read own workout sessions" ON public.workout_sessions;
CREATE POLICY "Users can only read own workout sessions"
    ON public.workout_sessions FOR SELECT
    TO authenticated
    USING (
        user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid() AND status = 'active')
        OR public.is_admin(auth.uid())
    );

DROP POLICY IF EXISTS "Users can insert own workout sessions" ON public.workout_sessions;
CREATE POLICY "Users can insert own workout sessions"
    ON public.workout_sessions FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid() AND status = 'active')
    );

-- 5. Progress Logs Policies
DROP POLICY IF EXISTS "Users can only view own progress logs" ON public.progress_logs;
CREATE POLICY "Users can only view own progress logs"
    ON public.progress_logs FOR SELECT
    TO authenticated
    USING (
        user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid() AND status = 'active')
        OR public.is_admin(auth.uid())
    );

DROP POLICY IF EXISTS "Users can record own progress logs" ON public.progress_logs;
CREATE POLICY "Users can record own progress logs"
    ON public.progress_logs FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid() AND status = 'active')
    );

-- 6. Notifications Policies
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (
        recipient_user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid())
        OR user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid())
        OR public.is_admin(auth.uid())
    );

DROP POLICY IF EXISTS "Users can update read status on own notifications" ON public.notifications;
CREATE POLICY "Users can update read status on own notifications"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (
        recipient_user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid())
        OR user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid())
    )
    WITH CHECK (
        recipient_user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid())
        OR user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Admins can create notifications" ON public.notifications;
CREATE POLICY "Admins can create notifications"
    ON public.notifications FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin(auth.uid()));

-- 7. Jossy AI Messages Policies
DROP POLICY IF EXISTS "Users can only read own AI messages" ON public.jossy_ai_messages;
CREATE POLICY "Users can only read own AI messages"
    ON public.jossy_ai_messages FOR SELECT
    TO authenticated
    USING (
        user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can insert own AI messages" ON public.jossy_ai_messages;
CREATE POLICY "Users can insert own AI messages"
    ON public.jossy_ai_messages FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid() AND status = 'active')
    );

-- 8. Food Items Policies
DROP POLICY IF EXISTS "Everyone authenticated can read active food catalog" ON public.food_items;
CREATE POLICY "Everyone authenticated can read active food catalog"
    ON public.food_items FOR SELECT
    TO authenticated
    USING (is_active = TRUE OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage food items" ON public.food_items;
CREATE POLICY "Admins can manage food items"
    ON public.food_items FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- 9. Audit Logs Policies (Admins only)
DROP POLICY IF EXISTS "Admins can read audit logs" ON public.audit_logs;
CREATE POLICY "Admins can read audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "System and Admins can insert audit logs" ON public.audit_logs;
CREATE POLICY "System and Admins can insert audit logs"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin(auth.uid()));

-- 10. Membership Cycles Policies
DROP POLICY IF EXISTS "Users can view own membership cycles" ON public.membership_cycles;
CREATE POLICY "Users can view own membership cycles"
  ON public.membership_cycles FOR SELECT
  USING (
    auth.uid() = user_id
    OR user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid())
    OR auth.jwt() ->> 'email' = 'admin@jossygym.com'
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.members m
      WHERE (m.id = auth.uid() OR m.auth_user_id = auth.uid()) AND m.role IN ('admin', 'superadmin', 'manager')
    )
    OR auth.role() = 'service_role'
  );

DROP POLICY IF EXISTS "Admin full access to membership cycles" ON public.membership_cycles;
CREATE POLICY "Admin full access to membership cycles"
  ON public.membership_cycles FOR ALL
  USING (
    auth.jwt() ->> 'email' = 'admin@jossygym.com'
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.members m
      WHERE (m.id = auth.uid() OR m.auth_user_id = auth.uid()) AND m.role IN ('admin', 'superadmin', 'manager')
    )
    OR auth.role() = 'service_role'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = 'admin@jossygym.com'
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.members m
      WHERE (m.id = auth.uid() OR m.auth_user_id = auth.uid()) AND m.role IN ('admin', 'superadmin', 'manager')
    )
    OR auth.role() = 'service_role'
  );

-- 11. Membership Payments Policies
DROP POLICY IF EXISTS "Users can view own payment receipts" ON public.membership_payments;
CREATE POLICY "Users can view own payment receipts"
  ON public.membership_payments FOR SELECT
  USING (
    auth.uid() = user_id
    OR user_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid())
    OR auth.jwt() ->> 'email' = 'admin@jossygym.com'
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.members m
      WHERE (m.id = auth.uid() OR m.auth_user_id = auth.uid()) AND m.role IN ('admin', 'superadmin', 'manager')
    )
    OR auth.role() = 'service_role'
  );

DROP POLICY IF EXISTS "Admin full access to membership payments" ON public.membership_payments;
CREATE POLICY "Admin full access to membership payments"
  ON public.membership_payments FOR ALL
  USING (
    auth.jwt() ->> 'email' = 'admin@jossygym.com'
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.members m
      WHERE (m.id = auth.uid() OR m.auth_user_id = auth.uid()) AND m.role IN ('admin', 'superadmin', 'manager')
    )
    OR auth.role() = 'service_role'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = 'admin@jossygym.com'
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.members m
      WHERE (m.id = auth.uid() OR m.auth_user_id = auth.uid()) AND m.role IN ('admin', 'superadmin', 'manager')
    )
    OR auth.role() = 'service_role'
  );

-- ============================================================================
-- PART 7: AUTOMATED MEMBERSHIP PROCEDURES
-- ============================================================================

-- Procedure 1: Daily 30-Day Expiration Check (Addis Ababa Timezone)
CREATE OR REPLACE FUNCTION public.check_and_process_expired_memberships()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cycle RECORD;
  v_today DATE := (NOW() AT TIME ZONE 'Africa/Addis_Ababa')::DATE;
  v_expired_count INT := 0;
  v_overdue_count INT := 0;
  v_notified_count INT := 0;
  v_title TEXT;
  v_msg TEXT;
BEGIN
  -- Select all active or overdue cycles that have reached or passed their due date
  FOR v_cycle IN
    SELECT c.*, m.full_name, m.email, m.language
    FROM public.membership_cycles c
    JOIN public.members m ON c.user_id = m.id
    WHERE c.status IN ('active', 'overdue')
      AND c.payment_status IN ('paid', 'payment_due')
      AND c.due_date <= v_today
  LOOP
    IF v_cycle.due_date = v_today THEN
      -- EXACT DUE DATE (Day 30): Mark as Payment Due
      IF v_cycle.payment_status != 'payment_due' THEN
        UPDATE public.membership_cycles
        SET payment_status = 'payment_due', updated_at = NOW()
        WHERE id = v_cycle.id;

        UPDATE public.members
        SET payment_status = 'payment_due', updated_at = NOW()
        WHERE id = v_cycle.user_id;

        v_expired_count := v_expired_count + 1;
      END IF;
    ELSE
      -- PAST DUE DATE (Day 31+): Transition to Overdue
      IF v_cycle.payment_status != 'overdue' OR v_cycle.status != 'overdue' THEN
        UPDATE public.membership_cycles
        SET payment_status = 'overdue', status = 'overdue', updated_at = NOW()
        WHERE id = v_cycle.id;

        UPDATE public.members
        SET payment_status = 'overdue', updated_at = NOW()
        WHERE id = v_cycle.user_id;

        v_overdue_count := v_overdue_count + 1;
      END IF;
    END IF;

    -- Strict Idempotent Notification Deduplication
    -- Canonical Check: user_id + cycle_id + type = 'membership_due'
    IF NOT EXISTS (
      SELECT 1 FROM public.notifications
      WHERE (user_id = v_cycle.user_id OR recipient_user_id = v_cycle.user_id)
        AND type = 'membership_due'
        AND metadata ->> 'cycle_id' = v_cycle.id::TEXT
    ) THEN
      IF v_cycle.language = 'am' THEN
        v_title := '🔔 የጂም አባልነት ክፍያ ማሳሰቢያ';
        v_msg := 'ሰላም ' || v_cycle.full_name || '፣ የ30-ቀን የጂም ጊዜዎ አብቅቷል። አገልግሎቱን ሳያቋርጡ ለመቀጠል እባክዎ የዚህን ወር ክፍያ (' || v_cycle.amount || ' ብር) በጂም መቀበያ ወይም በቴሌብር ይክፈሉ።';
      ELSE
        v_title := '🔔 Membership Payment Due';
        v_msg := 'Hello ' || v_cycle.full_name || ', your 30-day Jossy Gym membership period has ended. Please make your renewal payment (' || v_cycle.amount || ' ETB) to continue your training uninterrupted.';
      END IF;

      INSERT INTO public.notifications (
        id, user_id, recipient_user_id, title, message, body, type, is_read, metadata, created_at
      ) VALUES (
        gen_random_uuid(),
        v_cycle.user_id,
        v_cycle.user_id,
        v_title,
        v_msg,
        v_msg,
        'membership_due',
        FALSE,
        json_build_object(
          'cycle_number', v_cycle.cycle_number,
          'cycle_id', v_cycle.id,
          'due_date', v_cycle.due_date,
          'due_date_eth', v_cycle.due_date_eth,
          'amount', v_cycle.amount
        ),
        NOW()
      );

      v_notified_count := v_notified_count + 1;
    END IF;
  END LOOP;

  RETURN json_build_object(
    'success', TRUE,
    'evaluated_date', v_today,
    'cycles_marked_due', v_expired_count,
    'cycles_marked_overdue', v_overdue_count,
    'notifications_dispatched', v_notified_count,
    'timestamp', NOW()
  );
END;
$$;

-- Procedure 2: Atomic Payment Recording (Double-Submission & Transaction Safe)
CREATE OR REPLACE FUNCTION public.record_membership_payment_atomic(
  p_user_id UUID,
  p_amount NUMERIC,
  p_payment_method TEXT,
  p_payment_date TIMESTAMPTZ,
  p_payment_date_eth TEXT,
  p_receipt_id TEXT,
  p_recorded_by TEXT,
  p_notes TEXT,
  p_next_start_date DATE,
  p_next_start_date_eth TEXT,
  p_next_end_date DATE,
  p_next_end_date_eth TEXT,
  p_next_due_date DATE,
  p_next_due_date_eth TEXT
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_cycle RECORD;
  v_next_cycle_id UUID;
  v_member_name TEXT;
  v_member_lang TEXT;
  v_notification_title TEXT;
  v_notification_msg TEXT;
BEGIN
  -- Prevent duplicate payment by receipt ID
  IF EXISTS (SELECT 1 FROM public.membership_payments WHERE id = p_receipt_id) THEN
    RETURN json_build_object('success', FALSE, 'error', 'Payment with this receipt ID already exists.');
  END IF;

  -- Get latest active or due cycle for user with row-level lock
  SELECT * INTO v_current_cycle
  FROM public.membership_cycles
  WHERE user_id = p_user_id
    AND status IN ('active', 'overdue')
  ORDER BY cycle_number DESC
  LIMIT 1
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('success', FALSE, 'error', 'No active or overdue membership cycle found to renew.');
  END IF;

  -- 1. Insert Payment in Permanent Ledger
  INSERT INTO public.membership_payments (
    id, user_id, membership_cycle_id, cycle_number, amount, currency,
    payment_date, payment_date_eth, due_date, due_date_eth,
    payment_method, recorded_by, notes, created_at
  ) VALUES (
    p_receipt_id, p_user_id, v_current_cycle.id, v_current_cycle.cycle_number, p_amount, 'ETB',
    p_payment_date, p_payment_date_eth, v_current_cycle.due_date, v_current_cycle.due_date_eth,
    p_payment_method, p_recorded_by, p_notes, NOW()
  );

  -- 2. Mark Current Cycle Completed & Paid
  UPDATE public.membership_cycles
  SET status = 'completed',
      payment_status = 'paid',
      paid_at = p_payment_date,
      paid_at_eth = p_payment_date_eth,
      payment_method = p_payment_method,
      recorded_by = p_recorded_by,
      updated_at = NOW()
  WHERE id = v_current_cycle.id;

  -- 3. Create Next Cycle (Cycle #N+1)
  v_next_cycle_id := gen_random_uuid();
  INSERT INTO public.membership_cycles (
    id, user_id, cycle_number, start_date, start_date_eth,
    end_date, end_date_eth, due_date, due_date_eth,
    status, payment_status, amount, currency,
    paid_at, paid_at_eth, payment_method, recorded_by, notes,
    created_at, updated_at
  ) VALUES (
    v_next_cycle_id, p_user_id, v_current_cycle.cycle_number + 1,
    p_next_start_date, p_next_start_date_eth,
    p_next_end_date, p_next_end_date_eth,
    p_next_due_date, p_next_due_date_eth,
    'active', 'paid', p_amount, 'ETB',
    p_payment_date, p_payment_date_eth, p_payment_method, p_recorded_by,
    'Cycle #' || (v_current_cycle.cycle_number + 1) || ' renewed',
    NOW(), NOW()
  );

  -- 4. Update Member Status to Paid & Active
  UPDATE public.members
  SET payment_status = 'paid',
      membership_status = 'active',
      status = 'active',
      updated_at = NOW()
  WHERE id = p_user_id;

  -- 5. Send Payment Confirmation Notification
  SELECT full_name, language INTO v_member_name, v_member_lang
  FROM public.members WHERE id = p_user_id;

  IF v_member_lang = 'am' THEN
    v_notification_title := '✅ የክፍያ ማረጋገጫ';
    v_notification_msg := 'ክፍያዎ (' || p_amount || ' ብር) በተሳካ ሁኔታ ተመዝግቧል። አዲሱ የ30-ቀን ዑደት #' || (v_current_cycle.cycle_number + 1) || ' እስከ ' || p_next_due_date_eth || ' ድረስ ይሰራል!';
  ELSE
    v_notification_title := '✅ Payment Confirmed';
    v_notification_msg := 'Your renewal payment of ' || p_amount || ' ETB has been recorded. Cycle #' || (v_current_cycle.cycle_number + 1) || ' is now active until ' || p_next_due_date_eth || '!';
  END IF;

  INSERT INTO public.notifications (
    id, user_id, recipient_user_id, title, message, body, type, is_read, metadata, created_at
  ) VALUES (
    gen_random_uuid(),
    p_user_id,
    p_user_id,
    v_notification_title,
    v_notification_msg,
    v_notification_msg,
    'payment_confirmed',
    FALSE,
    json_build_object(
      'cycle_number', v_current_cycle.cycle_number + 1,
      'cycle_id', v_next_cycle_id,
      'receipt_id', p_receipt_id,
      'amount', p_amount,
      'payment_method', p_payment_method,
      'new_due_date_eth', p_next_due_date_eth
    ),
    NOW()
  );

  RETURN json_build_object(
    'success', TRUE,
    'receipt_id', p_receipt_id,
    'completed_cycle_number', v_current_cycle.cycle_number,
    'new_cycle_number', v_current_cycle.cycle_number + 1,
    'new_due_date_eth', p_next_due_date_eth
  );
END;
$$;

-- 6. Configure pg_cron Automation if extension is present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    -- Unschedule existing job if any
    PERFORM cron.unschedule('jossy-gym-daily-membership-check')
    WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'jossy-gym-daily-membership-check');

    -- Schedule daily midnight check
    PERFORM cron.schedule(
      'jossy-gym-daily-membership-check',
      '0 0 * * *',
      'SELECT public.check_and_process_expired_memberships();'
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'pg_cron configuration verified.';
END;
$$;
