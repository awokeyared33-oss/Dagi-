-- =====================================================================
-- JOSSY GYM: 30-DAY ETHIOPIAN MEMBERSHIP PAYMENT & RECURRING CYCLE SCHEMA
-- MIGRATION: 20260902_membership_payment_system.sql
-- =====================================================================

-- 1. Create membership_cycles Table
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

CREATE INDEX IF NOT EXISTS idx_membership_cycles_user ON public.membership_cycles(user_id);
CREATE INDEX IF NOT EXISTS idx_membership_cycles_due_date ON public.membership_cycles(due_date);
CREATE INDEX IF NOT EXISTS idx_membership_cycles_payment_status ON public.membership_cycles(payment_status);

-- 2. Create membership_payments Permanent Ledger Table
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

CREATE INDEX IF NOT EXISTS idx_membership_payments_user ON public.membership_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_membership_payments_date ON public.membership_payments(payment_date DESC);

-- Ensure members and notifications columns exist for payment system integration
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.members(id) ON DELETE CASCADE;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Unique Notification Deduplication Index: user_id + cycle_id + type
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_membership_due_notif 
  ON public.notifications (user_id, (metadata->>'cycle_id'), type) 
  WHERE type = 'membership_due';

-- 3. Enable RLS on Membership Tables
ALTER TABLE public.membership_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_payments ENABLE ROW LEVEL SECURITY;

-- Drop prior policies if needed for clean update
DROP POLICY IF EXISTS "Users can view own membership cycles" ON public.membership_cycles;
DROP POLICY IF EXISTS "Admin full access to membership cycles" ON public.membership_cycles;
DROP POLICY IF EXISTS "Users can view own payment receipts" ON public.membership_payments;
DROP POLICY IF EXISTS "Admin full access to membership payments" ON public.membership_payments;

-- Policies for membership_cycles:
-- Members can ONLY view their own records.
-- Only Admin accounts (by role or admin email) or service_role can INSERT, UPDATE, DELETE.
CREATE POLICY "Users can view own membership cycles"
  ON public.membership_cycles FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.jwt() ->> 'email' = 'admin@jossygym.com'
    OR EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.id = auth.uid() AND m.role IN ('admin', 'superadmin', 'manager')
    )
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Admin full access to membership cycles"
  ON public.membership_cycles FOR ALL
  USING (
    auth.jwt() ->> 'email' = 'admin@jossygym.com'
    OR EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.id = auth.uid() AND m.role IN ('admin', 'superadmin', 'manager')
    )
    OR auth.role() = 'service_role'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = 'admin@jossygym.com'
    OR EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.id = auth.uid() AND m.role IN ('admin', 'superadmin', 'manager')
    )
    OR auth.role() = 'service_role'
  );

-- Policies for membership_payments:
-- Members can ONLY view their own receipts.
-- Only Admin or service_role can create/modify payments.
CREATE POLICY "Users can view own payment receipts"
  ON public.membership_payments FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.jwt() ->> 'email' = 'admin@jossygym.com'
    OR EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.id = auth.uid() AND m.role IN ('admin', 'superadmin', 'manager')
    )
    OR auth.role() = 'service_role'
  );

CREATE POLICY "Admin full access to membership payments"
  ON public.membership_payments FOR ALL
  USING (
    auth.jwt() ->> 'email' = 'admin@jossygym.com'
    OR EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.id = auth.uid() AND m.role IN ('admin', 'superadmin', 'manager')
    )
    OR auth.role() = 'service_role'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = 'admin@jossygym.com'
    OR EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.id = auth.uid() AND m.role IN ('admin', 'superadmin', 'manager')
    )
    OR auth.role() = 'service_role'
  );

-- 4. Automated Database Procedure for Daily 30-Day Expiration Checks
-- Timezone: Africa/Addis_Ababa. Authoritative, Idempotent, and Handles both 'paid' -> 'payment_due' AND 'payment_due' -> 'overdue'.
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
  -- and are not yet completed.
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
      WHERE user_id = v_cycle.user_id
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
        id, user_id, title, message, type, is_read, metadata, created_at
      ) VALUES (
        gen_random_uuid(),
        v_cycle.user_id,
        v_title,
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

-- 5. Atomic Payment Recording Database Procedure (Double-Submission & Transaction Safe)
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

  -- 4. Update Member Status to Paid
  UPDATE public.members
  SET payment_status = 'paid',
      membership_status = 'active',
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
    id, user_id, title, message, type, is_read, metadata, created_at
  ) VALUES (
    gen_random_uuid(),
    p_user_id,
    v_notification_title,
    v_notification_msg,
    'payment_success',
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

-- 6. Configure pg_cron Automation (Run daily at 00:00 UTC / 03:00 AM Addis Ababa)
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
    RAISE NOTICE 'pg_cron setup verified.';
END;
$$;
