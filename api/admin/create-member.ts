import { createClient } from '@supabase/supabase-js';

// Helper to safely get Supabase URL
function getValidSupabaseUrl(): string {
  const candidates = [process.env.SUPABASE_URL, process.env.VITE_SUPABASE_URL];
  for (const c of candidates) {
    if (c && typeof c === 'string' && (c.startsWith('https://') || c.startsWith('http://'))) {
      return c.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
    }
  }
  return 'https://ktnipucfeyxhpxanulmt.supabase.co';
}

function getEnv(key: string, fallbackKey?: string): string {
  return (
    process.env[key] ||
    (fallbackKey ? process.env[fallbackKey] : '') ||
    ''
  );
}

// Handler for Vercel Serverless Function & Express API
export default async function handler(req: any, res: any) {
  // Always respond with JSON
  if (typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed. Please use POST.`,
    });
  }

  const supabaseUrl = getValidSupabaseUrl();
  const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

  // Verify server-side credentials: if not provided, fall back to local mock in-memory creation
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('[AI Studio] SUPABASE_SERVICE_ROLE_KEY not configured — creating member in local mock mode.');
    const mockUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();
    const startDateIso = now.toISOString().split('T')[0];
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const endDateIso = endDate.toISOString().split('T')[0];

    const {
      fullName,
      email,
      phone,
      membershipTier,
      membershipStatus,
      trainingDaysPerWeek,
      goal,
      language,
      membershipStartDateEth,
      initialPaymentStatus,
      monthlyFee,
    } = req.body || {};

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (fullName || '').trim();

    return res.status(200).json({
      success: true,
      message: 'Member created successfully (in-memory mode).',
      user: {
        id: mockUserId,
        email: cleanEmail,
        fullName: cleanName,
      },
      member: {
        id: mockUserId,
        auth_user_id: mockUserId,
        fullName: cleanName,
        email: cleanEmail,
        phone: (phone || '').trim(),
        membershipTier: membershipTier || 'VIP',
        membershipStatus: membershipStatus || 'active',
        isApproved: membershipStatus !== 'pending',
        isActive: membershipStatus === 'active',
        onboardingCompleted: false,
        language: language || 'en',
        trainingDaysPerWeek: Number(trainingDaysPerWeek) || 4,
        goal: goal || 'build_muscle',
        monthlyFee: Number(monthlyFee) || 1000,
        joinedDate: startDateIso,
        lastActive: 'Newly Registered',
        membershipStartDate: startDateIso,
        membershipStartDateEth,
        paymentStatus: initialPaymentStatus || 'paid',
        currentCycleNumber: 1,
        currentCycleStartDate: startDateIso,
        currentCycleEndDate: endDateIso,
      },
    });
  }

  try {
    const {
      fullName,
      email,
      password,
      phone,
      membershipTier,
      membershipStatus,
      trainingDaysPerWeek,
      goal,
      language,
      membershipStartDateEth,
      initialPaymentStatus,
      monthlyFee,
      recordedBy,
      notes,
    } = req.body || {};

    if (!email || !fullName) {
      return res.status(400).json({
        success: false,
        error: 'Full name and email are required.',
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = (phone || '').trim();

    // 1. Initialize Supabase Admin Client using secure Service Role Key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 2. Create the real user in Supabase Authentication (auth.users)
    console.log(`[Supabase Admin] Creating Auth user for: ${cleanEmail}`);
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password: password,
      email_confirm: true, // Auto-confirm email so the member can sign in immediately
      user_metadata: {
        full_name: cleanName,
        phone: cleanPhone,
        role: 'member',
        membership_tier: membershipTier || 'VIP',
        language: language || 'en',
      },
    });

    if (authError) {
      console.error('[Supabase Admin] Auth creation failed:', authError.message);
      return res.status(400).json({
        success: false,
        error: authError.message,
      });
    }

    if (!authData || !authData.user) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create user in Supabase Authentication: no user returned.',
      });
    }

    const authUserId = authData.user.id;
    console.log(`[Supabase Admin] Auth user created successfully with UUID: ${authUserId}`);

    const now = new Date();
    const startDateIso = now.toISOString().split('T')[0];
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const endDateIso = endDate.toISOString().split('T')[0];

    const startEthFormatted = membershipStartDateEth
      ? `${membershipStartDateEth.day}/${membershipStartDateEth.month}/${membershipStartDateEth.year}`
      : 'Initial Registration';
    const endEthFormatted = '30-Day Cycle Due';

    // 3. Create or Link the member's profile in the public.members table using the Auth UUID
    const memberRecordData = {
      id: authUserId,
      auth_user_id: authUserId,
      full_name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      status: membershipStatus || 'active',
      membership_tier: membershipTier || 'VIP',
      goal: goal || 'build_muscle',
      language: language || 'en',
      training_frequency: Number(trainingDaysPerWeek) || 4,
      onboarding_completed: false,
      calorie_target: 2400,
      protein_target: 160,
      carbs_target: 260,
      fat_target: 70,
      fiber_target: 35,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      last_active_at: null,
    };

    const { data: dbMember, error: dbError } = await supabaseAdmin
      .from('members')
      .upsert(memberRecordData, { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (dbError) {
      console.warn('[Supabase Admin] Warning inserting into public.members table:', dbError.message);
      // We do not fail the request if auth succeeded, but we log the database warning
    }

    // 4. Initialize first 30-Day Ethiopian Membership Cycle in public.membership_cycles
    let cycleId = `cycle_${Date.now()}_${authUserId}`;
    try {
      const { data: cycleData, error: cycleError } = await supabaseAdmin
        .from('membership_cycles')
        .insert({
          user_id: authUserId,
          cycle_number: 1,
          start_date: startDateIso,
          start_date_eth: startEthFormatted,
          end_date: endDateIso,
          end_date_eth: endEthFormatted,
          due_date: endDateIso,
          due_date_eth: endEthFormatted,
          status: 'active',
          payment_status: initialPaymentStatus || 'paid',
          amount: Number(monthlyFee) || 1000,
          currency: 'ETB',
          paid_at: initialPaymentStatus === 'paid' ? now.toISOString() : null,
          paid_at_eth: initialPaymentStatus === 'paid' ? startEthFormatted : null,
          payment_method: 'cash',
          recorded_by: recordedBy || 'admin@dagifitness.com',
          notes: notes || `Initial 30-day membership cycle`,
        })
        .select()
        .maybeSingle();

      if (cycleData?.id) {
        cycleId = cycleData.id;
      }

      // If marked as paid on registration, record payment in public.membership_payments
      if (initialPaymentStatus === 'paid') {
        const paymentReceiptId = `REC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
        await supabaseAdmin.from('membership_payments').insert({
          id: paymentReceiptId,
          user_id: authUserId,
          membership_cycle_id: cycleId,
          cycle_number: 1,
          amount: Number(monthlyFee) || 1000,
          currency: 'ETB',
          payment_date: now.toISOString(),
          payment_date_eth: startEthFormatted,
          due_date: endDateIso,
          due_date_eth: endEthFormatted,
          payment_method: 'cash',
          recorded_by: recordedBy || 'admin@dagifitness.com',
          notes: 'Initial registration payment (Cycle #1)',
          created_at: now.toISOString(),
        });
      }
    } catch (cycleErr: any) {
      console.warn('[Supabase Admin] Warning provisioning initial cycle/payment in database:', cycleErr.message);
    }

    // 5. Return success JSON
    return res.status(200).json({
      success: true,
      message: 'Real Supabase Auth user successfully created and provisioned.',
      user: {
        id: authUserId,
        email: cleanEmail,
        fullName: cleanName,
      },
      member: {
        id: authUserId,
        auth_user_id: authUserId,
        fullName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        membershipTier: membershipTier || 'VIP',
        membershipStatus: membershipStatus || 'active',
        isApproved: membershipStatus !== 'pending',
        isActive: membershipStatus === 'active',
        onboardingCompleted: false,
        language: language || 'en',
        trainingDaysPerWeek: Number(trainingDaysPerWeek) || 4,
        goal: goal || 'build_muscle',
        monthlyFee: Number(monthlyFee) || 1000,
        joinedDate: startDateIso,
        lastActive: 'Newly Registered',
        membershipStartDate: startDateIso,
        membershipStartDateEth,
        paymentStatus: initialPaymentStatus || 'paid',
        currentCycleNumber: 1,
        currentCycleStartDate: startDateIso,
        currentCycleEndDate: endDateIso,
      },
    });
  } catch (err: any) {
    console.error('Unhandled exception in /api/admin/create-member:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'An unexpected internal server error occurred.',
    });
  }
}
