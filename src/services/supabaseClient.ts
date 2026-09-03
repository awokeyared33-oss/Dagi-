import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  UserProfile,
  FitnessProfile,
  LoggedMeal,
  CompletedWorkout,
  WeightRecord,
  NotificationItem,
  FoodItem,
  WorkoutRoutine,
  MembershipCycle,
  MembershipPayment,
  MembershipSummary,
  PaymentStatusType,
  MembershipStatusType,
  EthiopianDateComponents,
} from '../types';
import { initialFoodDatabase } from '../data/foodDatabase';
import { SafeStorage, SafeSessionStorage } from './storageAdapter';
import {
  gregorianToEthiopian,
  ethiopianToGregorian,
  getFormattedEthiopianDate,
  formatEthiopianFromISO,
  add30Days,
  calculateMembershipDaysRemaining,
  toISODateString,
  getEthiopianNow,
} from './ethiopianCalendar';


const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
const rawUrl = metaEnv.VITE_SUPABASE_URL || 'https://ktnipucfeyxhpxanulmt.supabase.co';
const SUPABASE_URL = (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))
  ? rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
  : 'https://ktnipucfeyxhpxanulmt.supabase.co';
const rawKey = metaEnv.VITE_SUPABASE_ANON_KEY || 'sb_publishable_9NHSb-HBCU9uPXMtgQ9V8A_dAvpfbEN';
const SUPABASE_ANON_KEY = rawKey && rawKey.length > 20 ? rawKey : 'sb_publishable_9NHSb-HBCU9uPXMtgQ9V8A_dAvpfbEN';

export const isRealSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_ANON_KEY.includes('dummy')
);

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: SafeStorage,
  },
});

export interface AdminMemberRecord {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  membershipTier: 'VIP' | 'Standard' | 'Elite Athlete';
  membershipStatus: 'active' | 'pending' | 'inactive' | 'suspended';
  isApproved: boolean;
  isActive: boolean;
  onboardingCompleted: boolean;
  language: 'en' | 'am';
  trainingDaysPerWeek: number;
  goal: string;
  sex?: 'male' | 'female' | 'other';
  age?: number;
  heightCm?: number;
  weightKg?: number;
  targetWeightKg?: number;
  experienceLevel?: string;
  availableEquipment?: string;
  dietaryPreferences?: string;
  fastingPreference?: string;
  assignedProgramId?: string;
  calorieTarget?: number;
  proteinTarget?: number;
  carbsTarget?: number;
  fatTarget?: number;
  fiberTarget?: number;
  overrideCalories?: number;
  overrideProtein?: number;
  joinedDate: string;
  lastActive: string;
  membershipStartDate?: string;
  membershipStartDateEth?: { year: number; month: number; day: number };
  monthlyFee?: number;
  currentCycleNumber?: number;
  currentCycleStartDate?: string;
  currentCycleEndDate?: string;
  paymentStatus?: 'paid' | 'payment_due' | 'overdue';
  isMembershipPaused?: boolean;
  lastPaymentDate?: string;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  targetUserEmail: string;
  details: string;
  timestamp: string;
}

// Master Admin Storage Keys
export const ADMIN_EMAIL = 'admin@dagifitness.com';

// Pre-seeded authorized members directory (Managed by Admin)
const DEFAULT_MEMBERS: AdminMemberRecord[] = [
  {
    id: 'usr_admin',
    fullName: 'Dagi Fitness Admin',
    email: 'admin@dagifitness.com',
    phone: '+251 91 123 4567',
    membershipTier: 'VIP',
    membershipStatus: 'active',
    isApproved: true,
    isActive: true,
    onboardingCompleted: true,
    language: 'en',
    trainingDaysPerWeek: 5,
    goal: 'build_muscle',
    sex: 'male',
    age: 32,
    heightCm: 182,
    weightKg: 85,
    experienceLevel: 'advanced',
    availableEquipment: 'full_gym',
    assignedProgramId: 'split-5',
    calorieTarget: 2800,
    proteinTarget: 180,
    carbsTarget: 310,
    fatTarget: 80,
    fiberTarget: 38,
    joinedDate: '2026-01-01',
    lastActive: 'Just now',
  },
  {
    id: 'usr_daniel',
    fullName: 'Daniel Mekonnen',
    email: 'daniel@dagifitness.com',
    phone: '+251 91 234 5678',
    membershipTier: 'VIP',
    membershipStatus: 'active',
    isApproved: true,
    isActive: true,
    onboardingCompleted: true,
    language: 'en',
    trainingDaysPerWeek: 4,
    goal: 'build_muscle',
    sex: 'male',
    age: 26,
    heightCm: 178,
    weightKg: 76.5,
    experienceLevel: 'intermediate',
    availableEquipment: 'full_gym',
    assignedProgramId: 'split-4',
    calorieTarget: 2450,
    proteinTarget: 165,
    carbsTarget: 260,
    fatTarget: 70,
    fiberTarget: 35,
    joinedDate: '2026-02-10',
    lastActive: 'Today, 08:30',
  },
  {
    id: 'usr_usera',
    fullName: 'Henok Tadesse',
    email: 'usera@example.com',
    phone: '+251 92 345 6789',
    membershipTier: 'VIP',
    membershipStatus: 'active',
    isApproved: true,
    isActive: true,
    onboardingCompleted: false, // Will trigger full onboarding & personalized Q/A flow
    language: 'am',
    trainingDaysPerWeek: 4,
    goal: 'lose_weight',
    sex: 'male',
    age: 28,
    heightCm: 175,
    weightKg: 84.0,
    experienceLevel: 'beginner',
    availableEquipment: 'full_gym',
    assignedProgramId: 'split-3',
    calorieTarget: 2100,
    proteinTarget: 150,
    carbsTarget: 210,
    fatTarget: 60,
    fiberTarget: 32,
    joinedDate: '2026-08-20',
    lastActive: 'Yesterday',
  },
  {
    id: 'usr_userb',
    fullName: 'Sara Girma',
    email: 'userb@example.com',
    phone: '+251 93 456 7890',
    membershipTier: 'Elite Athlete',
    membershipStatus: 'active',
    isApproved: true,
    isActive: true,
    onboardingCompleted: false, // Separate athlete flow
    language: 'en',
    trainingDaysPerWeek: 5,
    goal: 'build_muscle',
    sex: 'female',
    age: 24,
    heightCm: 168,
    weightKg: 62.0,
    experienceLevel: 'advanced',
    availableEquipment: 'full_gym',
    assignedProgramId: 'split-5',
    calorieTarget: 2300,
    proteinTarget: 145,
    carbsTarget: 270,
    fatTarget: 65,
    fiberTarget: 30,
    joinedDate: '2026-08-22',
    lastActive: '2 days ago',
  },
  {
    id: 'usr_pending1',
    fullName: 'Biruk Alemu',
    email: 'biruk@example.com',
    phone: '+251 94 567 8901',
    membershipTier: 'Standard',
    membershipStatus: 'pending',
    isApproved: false, // Unapproved - will be rejected on login until approved by Admin
    isActive: false,
    onboardingCompleted: false,
    language: 'am',
    trainingDaysPerWeek: 3,
    goal: 'improve_fitness',
    sex: 'male',
    age: 30,
    heightCm: 172,
    weightKg: 79.0,
    joinedDate: '2026-08-27',
    lastActive: 'Pending Approval',
  },
];

/**
 * Storage Namespacing Helper:
 * Ensures strict zero data leakage across different user sessions.
 */
export class UserScopedStorage {
  static getStorageKey(userId: string, key: string): string {
    return `jossy_gym_user_${userId}_${key}`;
  }

  static getItem<T>(userId: string, key: string, fallback: T): T {
    try {
      const fullKey = this.getStorageKey(userId, key);
      const raw = SafeStorage.getItem(fullKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn(`UserScopedStorage read error for ${key}:`, e);
    }
    return fallback;
  }

  static setItem<T>(userId: string, key: string, value: T): void {
    try {
      const fullKey = this.getStorageKey(userId, key);
      SafeStorage.setItem(fullKey, JSON.stringify(value));
    } catch (e) {
      console.warn(`UserScopedStorage write error for ${key}:`, e);
    }
  }

  static removeItem(userId: string, key: string): void {
    try {
      const fullKey = this.getStorageKey(userId, key);
      SafeStorage.removeItem(fullKey);
    } catch (e) {
      console.warn(`UserScopedStorage remove error for ${key}:`, e);
    }
  }
}

/**
 * Supabase Data & Auth Service Layer
 */
export class SupabaseService {
  private static MEMBERS_STORE_KEY = 'jossy_gym_global_members_v2';
  private static AUDIT_STORE_KEY = 'jossy_gym_global_audit_logs_v2';
  private static FOOD_STORE_KEY = 'jossy_gym_global_food_catalog_v2';
  private static MEMBERSHIP_CYCLES_STORE_KEY = 'jossy_gym_global_membership_cycles_v3';
  private static MEMBERSHIP_PAYMENTS_STORE_KEY = 'jossy_gym_global_membership_payments_v3';

  // Seed default realistic membership cycles and payment histories
  private static getDefaultMembershipCycles(): MembershipCycle[] {
    const now = new Date();
    // usr_daniel: Active Cycle 3 (Started ~12 days ago, 18 days remaining)
    const danielStart = new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000);
    const danielEnd = add30Days(danielStart);
    const danielStartEth = gregorianToEthiopian(danielStart);
    const danielEndEth = gregorianToEthiopian(danielEnd);

    // usr_usera (Henok Tadesse): Active Cycle 2 (Due Today! 30 days completed)
    const henokStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const henokEnd = new Date(now.getTime());
    const henokStartEth = gregorianToEthiopian(henokStart);
    const henokEndEth = gregorianToEthiopian(henokEnd);

    // usr_userb (Sara Girma): Cycle 2 (Overdue by 4 days)
    const saraStart = new Date(now.getTime() - 34 * 24 * 60 * 60 * 1000);
    const saraEnd = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
    const saraStartEth = gregorianToEthiopian(saraStart);
    const saraEndEth = gregorianToEthiopian(saraEnd);

    return [
      {
        id: 'cycle_daniel_3',
        userId: 'usr_daniel',
        cycleNumber: 3,
        startDate: toISODateString(danielStart),
        startDateEth: danielStartEth.formattedAm,
        endDate: toISODateString(danielEnd),
        endDateEth: danielEndEth.formattedAm,
        dueDate: toISODateString(danielEnd),
        dueDateEth: danielEndEth.formattedAm,
        status: 'active',
        paymentStatus: 'paid',
        amount: 1200,
        currency: 'ETB',
        paidAt: danielStart.toISOString(),
        paidAtEth: danielStartEth.formattedAm,
        paymentMethod: 'telebirr',
        recordedBy: 'admin@dagifitness.com',
        notes: 'Monthly VIP renewal via Telebirr',
        createdAt: danielStart.toISOString(),
        updatedAt: danielStart.toISOString(),
      },
      {
        id: 'cycle_henok_2',
        userId: 'usr_usera',
        cycleNumber: 2,
        startDate: toISODateString(henokStart),
        startDateEth: henokStartEth.formattedAm,
        endDate: toISODateString(henokEnd),
        endDateEth: henokEndEth.formattedAm,
        dueDate: toISODateString(henokEnd),
        dueDateEth: henokEndEth.formattedAm,
        status: 'active',
        paymentStatus: 'payment_due',
        amount: 1000,
        currency: 'ETB',
        notes: 'Cycle ended today - awaiting 30-day renewal payment',
        createdAt: henokStart.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'cycle_sara_2',
        userId: 'usr_userb',
        cycleNumber: 2,
        startDate: toISODateString(saraStart),
        startDateEth: saraStartEth.formattedAm,
        endDate: toISODateString(saraEnd),
        endDateEth: saraEndEth.formattedAm,
        dueDate: toISODateString(saraEnd),
        dueDateEth: saraEndEth.formattedAm,
        status: 'overdue',
        paymentStatus: 'overdue',
        amount: 1500,
        currency: 'ETB',
        notes: 'Payment overdue by 4 days',
        createdAt: saraStart.toISOString(),
        updatedAt: now.toISOString(),
      },
    ];
  }

  private static getDefaultMembershipPayments(): MembershipPayment[] {
    const now = new Date();
    const d1 = new Date(now.getTime() - 72 * 24 * 60 * 60 * 1000);
    const d2 = new Date(now.getTime() - 42 * 24 * 60 * 60 * 1000);
    const d3 = new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000);
    const h1 = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const s1 = new Date(now.getTime() - 64 * 24 * 60 * 60 * 1000);

    return [
      {
        id: 'pay_daniel_1',
        userId: 'usr_daniel',
        membershipCycleId: 'cycle_daniel_1',
        cycleNumber: 1,
        amount: 1200,
        currency: 'ETB',
        paymentDate: d1.toISOString(),
        paymentDateEth: gregorianToEthiopian(d1).formattedAm,
        dueDate: toISODateString(add30Days(d1)),
        dueDateEth: gregorianToEthiopian(add30Days(d1)).formattedAm,
        paymentMethod: 'cbe_birr',
        recordedBy: 'admin@dagifitness.com',
        notes: 'Initial registration + 1st month',
        createdAt: d1.toISOString(),
      },
      {
        id: 'pay_daniel_2',
        userId: 'usr_daniel',
        membershipCycleId: 'cycle_daniel_2',
        cycleNumber: 2,
        amount: 1200,
        currency: 'ETB',
        paymentDate: d2.toISOString(),
        paymentDateEth: gregorianToEthiopian(d2).formattedAm,
        dueDate: toISODateString(add30Days(d2)),
        dueDateEth: gregorianToEthiopian(add30Days(d2)).formattedAm,
        paymentMethod: 'telebirr',
        recordedBy: 'admin@dagifitness.com',
        notes: 'Cycle 2 renewal',
        createdAt: d2.toISOString(),
      },
      {
        id: 'pay_daniel_3',
        userId: 'usr_daniel',
        membershipCycleId: 'cycle_daniel_3',
        cycleNumber: 3,
        amount: 1200,
        currency: 'ETB',
        paymentDate: d3.toISOString(),
        paymentDateEth: gregorianToEthiopian(d3).formattedAm,
        dueDate: toISODateString(add30Days(d3)),
        dueDateEth: gregorianToEthiopian(add30Days(d3)).formattedAm,
        paymentMethod: 'telebirr',
        recordedBy: 'admin@dagifitness.com',
        notes: 'Cycle 3 renewal',
        createdAt: d3.toISOString(),
      },
      {
        id: 'pay_henok_1',
        userId: 'usr_usera',
        membershipCycleId: 'cycle_henok_1',
        cycleNumber: 1,
        amount: 1000,
        currency: 'ETB',
        paymentDate: h1.toISOString(),
        paymentDateEth: gregorianToEthiopian(h1).formattedAm,
        dueDate: toISODateString(add30Days(h1)),
        dueDateEth: gregorianToEthiopian(add30Days(h1)).formattedAm,
        paymentMethod: 'cash',
        recordedBy: 'admin@dagifitness.com',
        notes: 'Cash payment at front desk',
        createdAt: h1.toISOString(),
      },
      {
        id: 'pay_sara_1',
        userId: 'usr_userb',
        membershipCycleId: 'cycle_sara_1',
        cycleNumber: 1,
        amount: 1500,
        currency: 'ETB',
        paymentDate: s1.toISOString(),
        paymentDateEth: gregorianToEthiopian(s1).formattedAm,
        dueDate: toISODateString(add30Days(s1)),
        dueDateEth: gregorianToEthiopian(add30Days(s1)).formattedAm,
        paymentMethod: 'bank_transfer',
        recordedBy: 'admin@dagifitness.com',
        notes: 'Elite Athlete membership payment',
        createdAt: s1.toISOString(),
      },
    ];
  }

  // Retrieve all membership cycles
  static getMembershipCycles(userId?: string): MembershipCycle[] {
    let cycles: MembershipCycle[] = [];
    try {
      const saved = SafeStorage.getItem(this.MEMBERSHIP_CYCLES_STORE_KEY);
      if (saved) {
        cycles = JSON.parse(saved);
      } else {
        cycles = this.getDefaultMembershipCycles();
        SafeStorage.setItem(this.MEMBERSHIP_CYCLES_STORE_KEY, JSON.stringify(cycles));
      }
    } catch (e) {
      console.error('Error fetching membership cycles:', e);
      cycles = this.getDefaultMembershipCycles();
    }

    if (userId) {
      return cycles.filter((c) => c.userId === userId);
    }
    return cycles;
  }

  // Save all membership cycles
  static saveMembershipCycles(cycles: MembershipCycle[]): void {
    SafeStorage.setItem(this.MEMBERSHIP_CYCLES_STORE_KEY, JSON.stringify(cycles));
  }

  // Retrieve all membership payments
  static getMembershipPayments(userId?: string): MembershipPayment[] {
    let payments: MembershipPayment[] = [];
    try {
      const saved = SafeStorage.getItem(this.MEMBERSHIP_PAYMENTS_STORE_KEY);
      if (saved) {
        payments = JSON.parse(saved);
      } else {
        payments = this.getDefaultMembershipPayments();
        SafeStorage.setItem(this.MEMBERSHIP_PAYMENTS_STORE_KEY, JSON.stringify(payments));
      }
    } catch (e) {
      console.error('Error fetching membership payments:', e);
      payments = this.getDefaultMembershipPayments();
    }

    if (userId) {
      return payments.filter((p) => p.userId === userId).sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
    }
    return payments.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  }

  // Save all membership payments
  static saveMembershipPayments(payments: MembershipPayment[]): void {
    SafeStorage.setItem(this.MEMBERSHIP_PAYMENTS_STORE_KEY, JSON.stringify(payments));
  }

  /**
   * Get dynamic Membership Summary for a specific user.
   * Auto-evaluates 30-day recurring cycle and current payment status.
   */
  static getMemberMembershipSummary(userId: string): MembershipSummary {
    const members = this.getGlobalMembers();
    const member = members.find((m) => m.id === userId);
    const now = new Date();

    const cycles = this.getMembershipCycles(userId).sort((a, b) => b.cycleNumber - a.cycleNumber);
    const payments = this.getMembershipPayments(userId);

    let activeCycle = cycles[0];

    // If member has no cycle initialized yet, create cycle 1
    if (!activeCycle) {
      const ethNow = gregorianToEthiopian(now);
      const startEth: EthiopianDateComponents = member?.membershipStartDateEth || {
        year: ethNow.year,
        month: ethNow.month,
        day: ethNow.day,
      };
      const gregStart = ethiopianToGregorian(startEth.year, startEth.month, startEth.day);
      const gregEnd = add30Days(gregStart);
      const startEthObj = gregorianToEthiopian(gregStart);
      const endEthObj = gregorianToEthiopian(gregEnd);

      activeCycle = {
        id: `cycle_${Date.now()}_${userId}`,
        userId,
        cycleNumber: 1,
        startDate: toISODateString(gregStart),
        startDateEth: startEthObj.formattedAm,
        endDate: toISODateString(gregEnd),
        endDateEth: endEthObj.formattedAm,
        dueDate: toISODateString(gregEnd),
        dueDateEth: endEthObj.formattedAm,
        status: member?.isMembershipPaused ? 'paused' : 'active',
        paymentStatus: 'paid',
        amount: member?.monthlyFee || 0,
        currency: 'ETB',
        paidAt: now.toISOString(),
        paidAtEth: ethNow.formattedAm,
        paymentMethod: 'cash',
        recordedBy: 'admin@dagifitness.com',
        notes: 'Initial automatic 30-day membership cycle',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      const allCycles = this.getMembershipCycles();
      allCycles.push(activeCycle);
      this.saveMembershipCycles(allCycles);
    }

    // Calculate days remaining or overdue
    const dayCalc = calculateMembershipDaysRemaining(activeCycle.dueDate, now);

    // Compute active payment status
    let computedPaymentStatus: PaymentStatusType = activeCycle.paymentStatus;
    if (member?.isMembershipPaused) {
      computedPaymentStatus = 'paid';
    } else if (activeCycle.paymentStatus === 'paid' && dayCalc.isDueToday) {
      // Cycle ended today -> now payment is due
      computedPaymentStatus = 'payment_due';
    } else if (activeCycle.paymentStatus === 'paid' && dayCalc.isOverdue) {
      // Past due date without renewal -> overdue
      computedPaymentStatus = 'overdue';
    } else if (activeCycle.paymentStatus === 'payment_due' && dayCalc.isOverdue) {
      computedPaymentStatus = 'overdue';
    } else if (activeCycle.paymentStatus === 'paid') {
      computedPaymentStatus = 'paid';
    }

    const lastPayment = payments[0];
    const totalPaidAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    const memberName = member ? member.fullName : 'Gym Member';
    const memberEmail = member ? member.email : '';
    const memberTier = (member?.membershipTier as any) || 'VIP';

    return {
      userId,
      memberName,
      memberEmail,
      memberPhone: member?.phone,
      memberTier,
      tier: memberTier,
      membershipStatus: (member?.membershipStatus as any) || 'active',
      paymentStatus: computedPaymentStatus,
      monthlyFee: activeCycle.amount || member?.monthlyFee || 0,
      membershipStartDate: activeCycle.startDate,
      membershipStartDateEth: activeCycle.startDateEth,
      startDate: activeCycle.startDate,
      startDateEth: activeCycle.startDateEth,
      currentCycleNumber: activeCycle.cycleNumber,
      cycleNumber: activeCycle.cycleNumber,
      currentCycleStartDate: activeCycle.startDate,
      currentCycleStartDateEth: activeCycle.startDateEth,
      currentCycleEndDate: activeCycle.endDate,
      currentCycleEndDateEth: activeCycle.endDateEth,
      endDate: activeCycle.endDate,
      endDateEth: activeCycle.endDateEth,
      nextPaymentDueDate: activeCycle.dueDate,
      nextPaymentDueDateEth: activeCycle.dueDateEth,
      dueDate: activeCycle.dueDate,
      dueDateEth: activeCycle.dueDateEth,
      daysRemaining: dayCalc.daysRemaining,
      daysOverdue: dayCalc.daysOverdue,
      isDueToday: dayCalc.isDueToday,
      isOverdue: dayCalc.isOverdue,
      lastPaymentDate: lastPayment?.paymentDate,
      lastPaymentDateEth: lastPayment?.paymentDateEth,
      lastPaymentAmount: lastPayment?.amount,
      totalPaymentsCount: payments.length,
      totalPaidAmount,
      isPaused: Boolean(member?.isMembershipPaused),
    };
  }

  /**
   * Record a Membership Payment (Mark as Paid)
   * Completes current cycle, records payment history, and starts next 30-day cycle #N+1.
   * Includes duplicate payment prevention.
   */
  static recordMembershipPayment(params: {
    userId: string;
    amount?: number;
    paymentMethod?: 'cash' | 'telebirr' | 'cbe_birr' | 'bank_transfer' | 'card' | 'other';
    recordedBy?: string;
    notes?: string;
    paymentDate?: Date;
  }): {
    success: boolean;
    cycle?: MembershipCycle;
    payment?: MembershipPayment;
    newCycle?: MembershipCycle;
    error?: string;
  } {
    const { userId, paymentMethod = 'cash', recordedBy = 'admin@dagifitness.com', notes = '' } = params;
    const now = params.paymentDate || new Date();
    const ethNow = gregorianToEthiopian(now);

    const members = this.getGlobalMembers();
    const member = members.find((m) => m.id === userId);
    if (!member) {
      return { success: false, error: 'Member not found.' };
    }

    const allCycles = this.getMembershipCycles();
    const userCycles = allCycles.filter((c) => c.userId === userId).sort((a, b) => b.cycleNumber - a.cycleNumber);
    let currentCycle = userCycles[0];

    const amount = params.amount !== undefined && params.amount > 0 ? params.amount : (member.monthlyFee || currentCycle?.amount || 0);

    // Double-payment prevention check:
    // If current cycle is already completed and a payment was logged within last 10 seconds, block
    const allPayments = this.getMembershipPayments();
    const recentDuplicate = allPayments.find(
      (p) =>
        p.userId === userId &&
        p.cycleNumber === (currentCycle?.cycleNumber ?? 1) &&
        Date.now() - new Date(p.createdAt || p.paymentDate).getTime() < 10000
    );
    if (recentDuplicate) {
      return {
        success: false,
        error: `A payment for Cycle #${recentDuplicate.cycleNumber} was just recorded. Duplicate transaction prevented.`,
      };
    }

    if (!currentCycle) {
      // Create cycle 1 if none
      const startEth: EthiopianDateComponents = member.membershipStartDateEth || {
        year: ethNow.year,
        month: ethNow.month,
        day: ethNow.day,
      };
      const gregStart = ethiopianToGregorian(startEth.year, startEth.month, startEth.day);
      const gregEnd = add30Days(gregStart);
      const startEthObj = gregorianToEthiopian(gregStart);
      const endEthObj = gregorianToEthiopian(gregEnd);

      currentCycle = {
        id: `cycle_${Date.now()}_${userId}`,
        userId,
        cycleNumber: 1,
        startDate: toISODateString(gregStart),
        startDateEth: startEthObj.formattedAm,
        endDate: toISODateString(gregEnd),
        endDateEth: endEthObj.formattedAm,
        dueDate: toISODateString(gregEnd),
        dueDateEth: endEthObj.formattedAm,
        status: 'active',
        paymentStatus: 'paid',
        amount,
        currency: 'ETB',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
      allCycles.push(currentCycle);
    }

    // 1. Record the Payment in Permanent Ledger
    const receiptNum = `REC-${toISODateString(now).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment: MembershipPayment = {
      id: receiptNum,
      userId,
      membershipCycleId: currentCycle.id,
      cycleNumber: currentCycle.cycleNumber,
      amount,
      currency: 'ETB',
      paymentDate: now.toISOString(),
      paymentDateEth: ethNow.formattedAm,
      dueDate: currentCycle.dueDate,
      dueDateEth: currentCycle.dueDateEth,
      paymentMethod,
      recordedBy,
      notes: notes || `Cycle #${currentCycle.cycleNumber} renewal payment via ${paymentMethod.toUpperCase()}`,
      createdAt: now.toISOString(),
    };
    allPayments.unshift(newPayment);
    this.saveMembershipPayments(allPayments);
    this.saveMembershipPayments(allPayments);

    // 2. Complete current cycle
    currentCycle.paymentStatus = 'paid';
    currentCycle.status = 'completed';
    currentCycle.paidAt = now.toISOString();
    currentCycle.paidAtEth = ethNow.formattedAm;
    currentCycle.paymentMethod = paymentMethod;
    currentCycle.recordedBy = recordedBy;
    currentCycle.updatedAt = now.toISOString();

    // 3. Immediately spawn NEXT 30-Day Cycle (Cycle #N+1)
    // If the previous cycle ended in the future, next cycle starts at prev cycle endDate.
    // If overdue, next cycle starts from today.
    let nextStartDate = new Date(currentCycle.endDate);
    if (isNaN(nextStartDate.getTime()) || nextStartDate.getTime() < now.getTime()) {
      nextStartDate = now;
    }
    const nextEndDate = add30Days(nextStartDate);
    const nextStartEth = gregorianToEthiopian(nextStartDate);
    const nextEndEth = gregorianToEthiopian(nextEndDate);

    const nextCycle: MembershipCycle = {
      id: `cycle_${Date.now() + 1}_${userId}`,
      userId,
      cycleNumber: currentCycle.cycleNumber + 1,
      startDate: toISODateString(nextStartDate),
      startDateEth: nextStartEth.formattedAm,
      endDate: toISODateString(nextEndDate),
      endDateEth: nextEndEth.formattedAm,
      dueDate: toISODateString(nextEndDate),
      dueDateEth: nextEndEth.formattedAm,
      status: 'active',
      paymentStatus: 'paid', // Active and paid for the next 30 days
      amount,
      currency: 'ETB',
      paidAt: now.toISOString(),
      paidAtEth: ethNow.formattedAm,
      paymentMethod,
      recordedBy,
      notes: `Cycle #${currentCycle.cycleNumber + 1} ongoing (Paid via ${paymentMethod})`,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    allCycles.unshift(nextCycle);
    this.saveMembershipCycles(allCycles);

    // 4. Update member's record
    member.paymentStatus = 'paid';
    member.lastPaymentDate = now.toISOString();
    member.currentCycleNumber = nextCycle.cycleNumber;
    member.currentCycleStartDate = nextCycle.startDate;
    member.currentCycleEndDate = nextCycle.endDate;
    this.saveGlobalMembers(members);

    // 5. Add Audit Log
    this.logAdminAction(
      'MEMBERSHIP_PAYMENT_RECORDED',
      member.email,
      `Recorded ${amount} ETB (${paymentMethod}) for ${member.fullName}. Next due date: ${nextEndEth.formattedAm} (${nextEndEth.formattedEn}).`
    );

    // 6. Push In-App Notification to User
    const userNotifications = UserScopedStorage.getItem<NotificationItem[]>(userId, 'notifications', []);
    const newNotif: NotificationItem = {
      id: `notif_pay_${Date.now()}`,
      title: '✅ ክፍያዎ በተሳካ ሁኔታ ተመዝግቧል (Payment Confirmed)',
      message: `የ ${amount} ብር ክፍያዎ ተረጋግጧል። አዲሱ የ 30-ቀን የጂም ጊዜዎ እስከ ${nextEndEth.formattedAm} (${nextEndEth.formattedEn}) ድረስ ተራዝሟል!`,
      timestamp: 'Just now',
      type: 'membership_paid',
      isRead: false,
      cycleNumber: nextCycle.cycleNumber,
    };
    userNotifications.unshift(newNotif);
    UserScopedStorage.setItem(userId, 'notifications', userNotifications.slice(0, 30));

    // Try server API sync
    try {
      fetch('/api/admin/memberships/record-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, paymentMethod, recordedBy, notes }),
      }).catch(() => {});
    } catch {}

    return {
      success: true,
      cycle: currentCycle,
      payment: newPayment,
      newCycle: nextCycle,
    };
  }

  /**
   * Update Member's Ethiopian Start Date
   */
  static updateMemberMembershipStartDate(
    memberId: string,
    startDateEth: EthiopianDateComponents
  ): { success: boolean; summary?: MembershipSummary; error?: string } {
    const members = this.getGlobalMembers();
    const member = members.find((m) => m.id === memberId);
    if (!member) return { success: false, error: 'Member not found.' };

    const gregStart = ethiopianToGregorian(startDateEth.year, startDateEth.month, startDateEth.day);
    const gregEnd = add30Days(gregStart);
    const startEthObj = gregorianToEthiopian(gregStart);
    const endEthObj = gregorianToEthiopian(gregEnd);

    member.membershipStartDate = toISODateString(gregStart);
    member.membershipStartDateEth = startDateEth;
    member.currentCycleStartDate = toISODateString(gregStart);
    member.currentCycleEndDate = toISODateString(gregEnd);
    this.saveGlobalMembers(members);

    // Update active cycle
    const allCycles = this.getMembershipCycles();
    const userCycles = allCycles.filter((c) => c.userId === memberId).sort((a, b) => b.cycleNumber - a.cycleNumber);
    if (userCycles[0]) {
      userCycles[0].startDate = toISODateString(gregStart);
      userCycles[0].startDateEth = startEthObj.formattedAm;
      userCycles[0].endDate = toISODateString(gregEnd);
      userCycles[0].endDateEth = endEthObj.formattedAm;
      userCycles[0].dueDate = toISODateString(gregEnd);
      userCycles[0].dueDateEth = endEthObj.formattedAm;
      userCycles[0].updatedAt = new Date().toISOString();
      this.saveMembershipCycles(allCycles);
    }

    this.logAdminAction(
      'MEMBERSHIP_DATE_UPDATED',
      member.email,
      `Updated start date for ${member.fullName} to ${startEthObj.formattedAm} (${startEthObj.formattedEn}).`
    );

    const summary = this.getMemberMembershipSummary(memberId);
    return { success: true, summary };
  }

  /**
   * Pause / Resume Member's Membership
   */
  static togglePauseMembership(memberId: string, shouldPause: boolean): boolean {
    const members = this.getGlobalMembers();
    const member = members.find((m) => m.id === memberId);
    if (!member) return false;

    member.isMembershipPaused = shouldPause;
    if (shouldPause) {
      member.membershipStatus = 'inactive';
    } else {
      member.membershipStatus = 'active';
    }
    this.saveGlobalMembers(members);

    const allCycles = this.getMembershipCycles();
    const userCycles = allCycles.filter((c) => c.userId === memberId).sort((a, b) => b.cycleNumber - a.cycleNumber);
    if (userCycles[0]) {
      userCycles[0].status = shouldPause ? 'paused' : 'active';
      userCycles[0].updatedAt = new Date().toISOString();
      this.saveMembershipCycles(allCycles);
    }

    this.logAdminAction(
      shouldPause ? 'MEMBERSHIP_PAUSED' : 'MEMBERSHIP_RESUMED',
      member.email,
      `Admin ${shouldPause ? 'paused' : 'resumed'} membership for ${member.fullName}.`
    );

    return true;
  }

  /**
   * Automatic 30-Day Expiration & Due Notification Engine
   * Checks all members, detects payment due / overdue, and triggers in-app alerts.
   */
  static checkAndRunMembershipExpirations(): {
    checkedCount: number;
    dueCount: number;
    overdueCount: number;
    notifiedCount: number;
  } {
    const members = this.getGlobalMembers().filter((m) => m.id !== 'usr_admin');
    let dueCount = 0;
    let overdueCount = 0;
    let notifiedCount = 0;

    members.forEach((member) => {
      const summary = this.getMemberMembershipSummary(member.id);
      if (summary.isPaused) return;

      if (summary.paymentStatus === 'payment_due' || summary.paymentStatus === 'overdue') {
        if (summary.paymentStatus === 'payment_due') dueCount++;
        if (summary.paymentStatus === 'overdue') overdueCount++;

        // Check if member already received notification for this cycle
        const userNotifs = UserScopedStorage.getItem<NotificationItem[]>(member.id, 'notifications', []);
        const alreadyNotified = userNotifs.some(
          (n) =>
            (n.type === 'membership_due' || n.type === 'membership') &&
            n.cycleNumber === summary.currentCycleNumber
        );

        if (!alreadyNotified) {
          const isAm = member.language === 'am';
          const title = isAm ? '🔔 የጂም አባልነት ክፍያ ማሳሰቢያ' : '🔔 Membership Payment Due';
          const message = isAm
            ? `ሰላም ${member.fullName}፣ የ30-ቀን የጂም ጊዜዎ አብቅቷል። አገልግሎቱን ሳያቋርጡ ለመቀጠል እባክዎ የዚህን ወር ክፍያ (${summary.monthlyFee} ብር) በጂም መቀበያ ወይም በቴሌብር ይክፈሉ።`
            : `Hello ${member.fullName}, your 30-day Dagi Fitness membership period has completed. Please make your renewal payment (${summary.monthlyFee} ETB) to continue your training uninterrupted.`;

          const notif: NotificationItem = {
            id: `notif_due_c${summary.currentCycleNumber}_${Date.now()}`,
            title,
            message,
            timestamp: 'Just now',
            type: 'membership_due',
            isRead: false,
            cycleNumber: summary.currentCycleNumber,
          };
          userNotifs.unshift(notif);
          UserScopedStorage.setItem(member.id, 'notifications', userNotifs.slice(0, 30));
          notifiedCount++;
        }
      }
    });

    return {
      checkedCount: members.length,
      dueCount,
      overdueCount,
      notifiedCount,
    };
  }

  /**
   * Get List of Unpaid / Overdue Members
   */
  static getUnpaidMembersList(): { member: AdminMemberRecord; summary: MembershipSummary }[] {
    const members = this.getGlobalMembers().filter((m) => m.id !== 'usr_admin');
    const result: { member: AdminMemberRecord; summary: MembershipSummary }[] = [];

    members.forEach((member) => {
      const summary = this.getMemberMembershipSummary(member.id);
      if (summary.paymentStatus === 'payment_due' || summary.paymentStatus === 'overdue') {
        result.push({ member, summary });
      }
    });

    // Sort: overdue first (by highest overdue days), then due today
    return result.sort((a, b) => b.summary.daysOverdue - a.summary.daysOverdue);
  }

  /**
   * Get Overview Statistics for Admin Payment Dashboard
   */
  static getMembershipDashboardStats(): {
    totalMembers: number;
    paidCount: number;
    paymentDueCount: number;
    overdueCount: number;
    dueTodayCount: number;
    dueThisWeekCount: number;
    totalRevenueETB: number;
    activeRate: number;
  } {
    const members = this.getGlobalMembers().filter((m) => m.id !== 'usr_admin');
    const payments = this.getMembershipPayments();

    let paidCount = 0;
    let paymentDueCount = 0;
    let overdueCount = 0;
    let dueTodayCount = 0;
    let dueThisWeekCount = 0;

    members.forEach((member) => {
      const summary = this.getMemberMembershipSummary(member.id);
      if (summary.paymentStatus === 'paid') paidCount++;
      if (summary.paymentStatus === 'payment_due') paymentDueCount++;
      if (summary.paymentStatus === 'overdue') overdueCount++;
      if (summary.isDueToday) dueTodayCount++;
      if (summary.daysRemaining > 0 && summary.daysRemaining <= 7) dueThisWeekCount++;
    });

    const totalRevenueETB = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const activeRate = members.length > 0 ? Math.round((paidCount / members.length) * 100) : 0;

    return {
      totalMembers: members.length,
      paidCount,
      paymentDueCount,
      overdueCount,
      dueTodayCount,
      dueThisWeekCount,
      totalRevenueETB,
      activeRate,
    };
  }


  /**
   * Fetches real members directly from Supabase database `public.members`.
   * Automatically synchronizes the local cache with the shared cloud database.
   */
  static async fetchGlobalMembers(): Promise<AdminMemberRecord[]> {
    if (isRealSupabaseConfigured) {
      try {
        const { data: dbMembers, error } = await supabase
          .from('members')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && dbMembers && dbMembers.length > 0) {
          const mapped: AdminMemberRecord[] = dbMembers.map((m: any) => ({
            id: m.id || m.auth_user_id,
            fullName: m.full_name || 'Athlete',
            email: m.email || '',
            phone: m.phone || '',
            membershipTier: m.membership_tier || 'VIP',
            membershipStatus: m.status || 'active',
            isApproved: m.status !== 'pending',
            isActive: m.status === 'active',
            onboardingCompleted: m.onboarding_completed ?? false,
            language: m.language || 'en',
            trainingDaysPerWeek: m.training_frequency || 4,
            goal: m.goal || 'build_muscle',
            joinedDate: m.created_at ? m.created_at.split('T')[0] : '',
            lastActive: m.last_active_at ? 'Recently' : 'Newly Registered',
            calorieTarget: m.calorie_target,
            proteinTarget: m.protein_target,
            carbsTarget: m.carbs_target,
            fatTarget: m.fat_target,
            assignedProgramId: m.assigned_program_id,
          }));

          // Merge with any existing local members
          this.saveGlobalMembers(mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Error querying members from Supabase database:', err);
      }
    }
    return this.getGlobalMembers();
  }

  // Retrieve global members list
  static getGlobalMembers(): AdminMemberRecord[] {
    try {
      const saved = SafeStorage.getItem(this.MEMBERS_STORE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error fetching global members:', e);
    }
    SafeStorage.setItem(this.MEMBERS_STORE_KEY, JSON.stringify(DEFAULT_MEMBERS));
    return DEFAULT_MEMBERS;
  }

  // Save global members list
  static saveGlobalMembers(members: AdminMemberRecord[]): void {
    SafeStorage.setItem(this.MEMBERS_STORE_KEY, JSON.stringify(members));
  }

  // Retrieve audit logs
  static getAuditLogs(): AdminAuditLog[] {
    try {
      const saved = SafeStorage.getItem(this.AUDIT_STORE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error fetching audit logs:', e);
    }
    const initialLogs: AdminAuditLog[] = [
      {
        id: 'log-boot',
        action: 'SYSTEM_BOOT',
        targetUserEmail: 'admin@dagifitness.com',
        details: 'Dagi Fitness secure Supabase Auth & RLS database subsystem online.',
        timestamp: new Date().toISOString(),
      },
    ];
    SafeStorage.setItem(this.AUDIT_STORE_KEY, JSON.stringify(initialLogs));
    return initialLogs;
  }

  // Add audit log
  static logAdminAction(action: string, targetUserEmail: string, details: string): void {
    const logs = this.getAuditLogs();
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      action,
      targetUserEmail,
      details,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    SafeStorage.setItem(this.AUDIT_STORE_KEY, JSON.stringify(logs.slice(0, 100)));
  }

  // Food Catalog (Ethiopian + International)
  static getFoodCatalog(): FoodItem[] {
    try {
      const saved = SafeStorage.getItem(this.FOOD_STORE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error fetching food catalog:', e);
    }
    SafeStorage.setItem(this.FOOD_STORE_KEY, JSON.stringify(initialFoodDatabase));
    return initialFoodDatabase;
  }

  static saveFoodCatalog(foods: FoodItem[]): void {
    SafeStorage.setItem(this.FOOD_STORE_KEY, JSON.stringify(foods));
  }

  static addFoodToCatalog(newFood: FoodItem): void {
    const foods = this.getFoodCatalog();
    foods.unshift(newFood);
    this.saveFoodCatalog(foods);
    this.logAdminAction('FOOD_CATALOG_ADD', 'admin@dagifitness.com', `Added food item: ${newFood.nameEn} (${newFood.nameAm})`);
  }

  static updateFoodInCatalog(updatedFood: FoodItem): void {
    const foods = this.getFoodCatalog();
    const idx = foods.findIndex((f) => f.id === updatedFood.id);
    if (idx !== -1) {
      foods[idx] = updatedFood;
      this.saveFoodCatalog(foods);
      this.logAdminAction('FOOD_CATALOG_UPDATE', 'admin@dagifitness.com', `Updated food item: ${updatedFood.nameEn}`);
    }
  }

  static deleteFoodFromCatalog(foodId: string): void {
    const foods = this.getFoodCatalog();
    const target = foods.find((f) => f.id === foodId);
    const filtered = foods.filter((f) => f.id !== foodId);
    this.saveFoodCatalog(filtered);
    if (target) {
      this.logAdminAction('FOOD_CATALOG_DELETE', 'admin@dagifitness.com', `Removed food item: ${target.nameEn}`);
    }
  }

  /**
   * Admin Authentication & Session Management with Supabase Auth & Role Verification
   */
  static async checkAdminAuth(): Promise<{
    isAuthed: boolean;
    isAdmin: boolean;
    isMember?: boolean;
    email?: string;
    userId?: string;
  }> {
    // 1. If real Supabase is configured, verify session & admin_profiles table
    if (isRealSupabaseConfigured) {
      try {
        const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr || !session || !session.user) {
          this.setAdminSession(false);
          return { isAuthed: false, isAdmin: false };
        }

        const user = session.user;
        // Verify in admin_profiles table using user's UUID
        const { data: adminProfile, error: profileErr } = await supabase
          .from('admin_profiles')
          .select('id, role, status, email')
          .eq('auth_user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (profileErr) {
          console.warn('Admin profile query error:', profileErr.message);
        }

        if (adminProfile && (adminProfile.role === 'super_admin' || adminProfile.role === 'admin')) {
          this.setAdminSession(true, user.email || adminProfile.email);
          return {
            isAuthed: true,
            isAdmin: true,
            email: user.email || adminProfile.email,
            userId: user.id,
          };
        }

        // User is authenticated but NOT an active administrator
        this.setAdminSession(false);
        return {
          isAuthed: true,
          isAdmin: false,
          isMember: true,
          email: user.email,
          userId: user.id,
        };
      } catch (e) {
        console.warn('Check admin auth error:', e);
      }
    }

    // 2. Session verification fallback
    const session = this.getAdminSession();
    return {
      isAuthed: session.isAuthenticated,
      isAdmin: session.isAuthenticated,
      email: session.email,
    };
  }

  static async signInAdmin(
    emailAttempt: string,
    passwordAttempt: string
  ): Promise<{
    success: boolean;
    isAdmin: boolean;
    isMember?: boolean;
    error?: string;
    email?: string;
  }> {
    const cleanEmail = emailAttempt.trim().toLowerCase();
    const cleanPass = passwordAttempt.trim();

    if (!cleanEmail || !cleanPass) {
      return {
        success: false,
        isAdmin: false,
        error: 'Please enter both admin email and password.',
      };
    }

    // 1. Supabase Auth if configured
    if (isRealSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass,
        });

        if (error) {
          return {
            success: false,
            isAdmin: false,
            error: 'Invalid email or password. Please try again.',
          };
        }

        if (data.user) {
          const { data: adminRecord, error: adminErr } = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('auth_user_id', data.user.id)
            .eq('status', 'active')
            .maybeSingle();

          if (adminErr || !adminRecord) {
            // User successfully authenticated with Supabase, but is a regular member NOT an admin
            await supabase.auth.signOut();
            this.setAdminSession(false);
            return {
              success: false,
              isAdmin: false,
              isMember: true,
              error: 'Access restricted. This account does not have administrator authorization.',
            };
          }

          // Active authorized administrator
          this.setAdminSession(true, cleanEmail);
          this.logAdminAction('ADMIN_LOGIN', cleanEmail, 'Super-administrator authenticated via Supabase Auth');
          return {
            success: true,
            isAdmin: true,
            email: cleanEmail,
          };
        }
      } catch (e) {
        console.warn('Supabase sign-in exception:', e);
      }
    }

    // 2. Local credential & role check
    const creds = this.getAdminCredentials();
    const isMasterMatch =
      cleanEmail === creds.email.toLowerCase() &&
      cleanPass === creds.passwordHash;

    if (isMasterMatch) {
      this.setAdminSession(true, cleanEmail);
      this.logAdminAction('ADMIN_LOGIN', cleanEmail, 'Administrator authenticated successfully');
      return {
        success: true,
        isAdmin: true,
        email: cleanEmail,
      };
    }

    // Check if a normal member tried to login
    const members = this.getGlobalMembers();
    const isRegularMember = members.some((m) => m.email.toLowerCase() === cleanEmail);
    if (isRegularMember) {
      return {
        success: false,
        isAdmin: false,
        isMember: true,
        error: 'Access restricted. This account is a regular member and does not have administrator privileges.',
      };
    }

    return {
      success: false,
      isAdmin: false,
      error: 'Invalid email or password. Please try again.',
    };
  }

  static async adminSignOut(): Promise<void> {
    if (isRealSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase sign-out error:', e);
      }
    }
    this.setAdminSession(false);
  }

  static getAdminSession(): { isAuthenticated: boolean; email?: string } {
    try {
      const raw =
        SafeSessionStorage.getItem('dagi_fitness_admin_auth') ||
        SafeSessionStorage.getItem('abrish_fitness_admin_auth');
      if (raw) return JSON.parse(raw);
    } catch {}
    return { isAuthenticated: false };
  }

  static setAdminSession(isAuthenticated: boolean, email?: string): void {
    if (isAuthenticated) {
      const payload = JSON.stringify({ isAuthenticated: true, email: email || ADMIN_EMAIL, timestamp: new Date().toISOString() });
      SafeSessionStorage.setItem('dagi_fitness_admin_auth', payload);
    } else {
      SafeSessionStorage.removeItem('dagi_fitness_admin_auth');
      SafeSessionStorage.removeItem('abrish_fitness_admin_auth');
    }
  }

  /**
   * Gym-wide Analytics Aggregator
   */
  static getGymAggregateStats(): {
    totalWorkoutsLogged: number;
    totalMealsLogged: number;
    totalActiveMembers: number;
    todayActiveAthletes: number;
  } {
    const members = this.getGlobalMembers();
    let totalWorkouts = 0;
    let totalMeals = 0;
    let todayActive = 0;

    members.forEach((m) => {
      const workouts = this.getLoggedWorkouts(m.id);
      totalWorkouts += workouts.length;
      const meals = this.getLoggedMeals(m.id);
      totalMeals += meals.length;
      if (m.lastActive && (m.lastActive.includes('Today') || m.lastActive.includes('Just') || m.lastActive.includes('hour'))) {
        todayActive++;
      }
    });

    return {
      totalWorkoutsLogged: totalWorkouts,
      totalMealsLogged: totalMeals,
      totalActiveMembers: members.filter((m) => m.membershipStatus === 'active').length,
      todayActiveAthletes: todayActive || 2,
    };
  }

  /**
   * AUTHENTICATION - Supabase Auth as the SOLE Source of Truth:
   * Real email/password authentication via Supabase Auth.
   * Cross-device, cross-browser, and AppsGeyser APK compatible.
   */
  static async login(
    email: string,
    passwordAttempt: string
  ): Promise<{
    success: boolean;
    member?: AdminMemberRecord;
    errorMessage?: { en: string; am: string };
  }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !passwordAttempt) {
      return {
        success: false,
        errorMessage: {
          en: 'Please enter both email and password.',
          am: 'እባክዎ ኢሜይል እና የይለፍ ቃል ያስገቡ።',
        },
      };
    }

    // 1. Authenticate with Supabase Auth (The single source of truth)
    let authUserId: string | null = null;
    let authUserEmail: string = cleanEmail;
    let userMetadata: any = {};

    if (isRealSupabaseConfigured) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: passwordAttempt,
        });

        if (authError) {
          console.warn('Supabase Auth error during signInWithPassword:', authError.message);
          const lowerErr = authError.message.toLowerCase();
          if (lowerErr.includes('invalid login credentials') || lowerErr.includes('invalid_grant')) {
            return {
              success: false,
              errorMessage: {
                en: 'Invalid email or password. Please verify your credentials or contact Dagi Fitness administration.',
                am: 'ትክክል ያልሆነ የኢሜይል ወይም የይለፍ ቃል። እባክዎ መረጃዎን ያረጋግጡ ወይም የ Dagi Fitness አስተዳደርን ያነጋግሩ።',
              },
            };
          }
          if (lowerErr.includes('email not confirmed')) {
            return {
              success: false,
              errorMessage: {
                en: 'Your account email is not yet confirmed. Please contact administration.',
                am: 'የመለያዎ ኢሜይል እስካሁን አልተረጋገጠም። እባክዎ አስተዳዳሪውን ያነጋግሩ።',
              },
            };
          }
          return {
            success: false,
            errorMessage: {
              en: authError.message,
              am: authError.message,
            },
          };
        }

        if (!authData || !authData.user) {
          return {
            success: false,
            errorMessage: {
              en: 'Authentication failed: No user returned by Supabase Auth.',
              am: 'የማረጋገጫ ስህተት፡ ተጠቃሚው በሱፓቤዝ አልተገኘም።',
            },
          };
        }

        authUserId = authData.user.id;
        authUserEmail = authData.user.email || cleanEmail;
        userMetadata = authData.user.user_metadata || {};
      } catch (err: any) {
        console.error('Supabase authentication network error:', err);
        return {
          success: false,
          errorMessage: {
            en: err.message || 'Network error connecting to Supabase Auth.',
            am: 'የኔትወርክ ስህተት አጋጥሟል። እባክዎ ግንኙነትዎን ያረጋግጡ።',
          },
        };
      }
    } else {
      // Supabase is not yet configured in environment variables
      return {
        success: false,
        errorMessage: {
          en: 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.',
          am: 'ሱፓቤዝ አልተዋቀረም። እባክዎ VITE_SUPABASE_URL እና VITE_SUPABASE_ANON_KEY ያዋቅሩ።',
        },
      };
    }

    // 2. Fetch member profile from Supabase public.members using the authenticated UUID
    let memberRecord: any = null;
    try {
      const { data: dbMember, error: dbError } = await supabase
        .from('members')
        .select('*')
        .or(`id.eq.${authUserId},auth_user_id.eq.${authUserId},email.eq.${cleanEmail}`)
        .maybeSingle();

      if (dbMember) {
        memberRecord = dbMember;
      } else if (dbError) {
        console.warn('Error querying public.members by auth user id:', dbError.message);
      }
    } catch (dbErr) {
      console.warn('Exception querying public.members:', dbErr);
    }

    // 3. Status enforcement: check pending approval
    if (memberRecord && (memberRecord.status === 'pending' || memberRecord.is_approved === false)) {
      await supabase.auth.signOut();
      return {
        success: false,
        errorMessage: {
          en: 'Your account is pending approval by Dagi Fitness administration.',
          am: 'መለያዎ በ Dagi Fitness አስተዳዳሪ እስኪረጋገጥ በመጠባበቅ ላይ ነው።',
        },
      };
    }

    // 4. Status enforcement: check suspended or inactive
    if (memberRecord && (memberRecord.status === 'suspended' || memberRecord.status === 'inactive')) {
      await supabase.auth.signOut();
      return {
        success: false,
        errorMessage: {
          en: 'Your account has been suspended or deactivated. Please contact Dagi Fitness reception.',
          am: 'መለያዎ ታግዷል ወይም ተዘግቷል። እባክዎ የ Dagi Fitness አስተዳደርን ያነጋግሩ።',
        },
      };
    }

    // 5. Build resolved AdminMemberRecord keyed by authUserId
    const member: AdminMemberRecord = {
      id: authUserId, // AUTHENTICATED SUPABASE USER UUID
      fullName: memberRecord?.full_name || userMetadata.full_name || 'Athlete',
      email: authUserEmail,
      phone: memberRecord?.phone || userMetadata.phone || '',
      membershipTier: memberRecord?.membership_tier || userMetadata.membership_tier || 'VIP',
      membershipStatus: (memberRecord?.status as any) || 'active',
      isApproved: memberRecord ? memberRecord.status !== 'pending' : true,
      isActive: memberRecord ? memberRecord.status === 'active' : true,
      onboardingCompleted: memberRecord?.onboarding_completed ?? false,
      language: memberRecord?.language || userMetadata.language || 'en',
      trainingDaysPerWeek: memberRecord?.training_frequency || 4,
      goal: memberRecord?.goal || 'build_muscle',
      joinedDate: memberRecord?.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      calorieTarget: memberRecord?.calorie_target,
      proteinTarget: memberRecord?.protein_target,
      carbsTarget: memberRecord?.carbs_target,
      fatTarget: memberRecord?.fat_target,
      assignedProgramId: memberRecord?.assigned_program_id,
    };

    // Update active timestamp in Supabase
    try {
      supabase
        .from('members')
        .update({ last_active_at: new Date().toISOString() })
        .or(`id.eq.${authUserId},auth_user_id.eq.${authUserId}`)
        .then(() => {}, () => {});
    } catch {}

    // Save to global members cache
    const existingMembers = this.getGlobalMembers();
    const existingIdx = existingMembers.findIndex(
      (m) => m.id === authUserId || m.email.toLowerCase() === cleanEmail
    );
    if (existingIdx >= 0) {
      existingMembers[existingIdx] = member;
    } else {
      existingMembers.unshift(member);
    }
    this.saveGlobalMembers(existingMembers);

    return {
      success: true,
      member,
    };
  }

  /**
   * Admin: Create Member with Real Supabase Auth User & Ethiopian Membership Tracking.
   * Creates real user in Supabase Authentication and database.
   */
  static async createMember(params: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    membershipTier: 'VIP' | 'Standard' | 'Elite Athlete';
    trainingDaysPerWeek: number;
    goal: string;
    language?: 'en' | 'am';
    membershipStartDateEth?: EthiopianDateComponents;
    initialPaymentStatus?: PaymentStatusType;
    monthlyFee?: number;
    recordedBy?: string;
    notes?: string;
  }): Promise<{ success: boolean; member?: AdminMemberRecord; cycle?: MembershipCycle; error?: string }> {
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanName = params.fullName.trim();

    if (!cleanName || !cleanEmail) {
      return { success: false, error: 'Full name and email are required.' };
    }

    if (!params.password || params.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const feeNumber = Number(params.monthlyFee);
    if (params.monthlyFee === undefined || params.monthlyFee === null || isNaN(feeNumber) || feeNumber <= 0) {
      return { success: false, error: 'Please enter a valid membership price greater than 0 ETB.' };
    }
    const monthlyFee = feeNumber;
    const initialPaymentStatus: PaymentStatusType = params.initialPaymentStatus || 'paid';

    const now = new Date();
    const ethNow = gregorianToEthiopian(now);
    const startEth = params.membershipStartDateEth || {
      year: ethNow.year,
      month: ethNow.month,
      day: ethNow.day,
    };

    // Calculate canonical Gregorian start and end (30-day cycle)
    const gregStart = ethiopianToGregorian(startEth.year, startEth.month, startEth.day);
    const gregEnd = add30Days(gregStart);
    const startEthObj = gregorianToEthiopian(gregStart);
    const endEthObj = gregorianToEthiopian(gregEnd);

    // CALL THE SECURE BACKEND PROVISIONING API (Vercel Serverless / Express)
    try {
      const response = await fetch('/api/admin/create-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: cleanName,
          email: cleanEmail,
          password: params.password,
          phone: params.phone?.trim() || '',
          membershipTier: params.membershipTier || 'VIP',
          membershipStatus: 'active',
          trainingDaysPerWeek: params.trainingDaysPerWeek || 4,
          goal: params.goal || 'build_muscle',
          language: params.language || 'en',
          membershipStartDateEth: startEth,
          initialPaymentStatus,
          monthlyFee,
          recordedBy: params.recordedBy || 'admin@dagifitness.com',
          notes: params.notes,
        }),
      });

      const responseText = await response.text();
      let result: any = null;

      try {
        result = responseText ? JSON.parse(responseText) : null;
      } catch (parseError) {
        console.error('Non-JSON response from /api/admin/create-member:', responseText);
        return {
          success: false,
          error: `Server returned non-JSON response (${response.status} ${response.statusText}). When running on Vercel, ensure SUPABASE_SERVICE_ROLE_KEY and SUPABASE_URL are configured in Project Environment Variables.`,
        };
      }

      if (!response.ok || !result || !result.success) {
        const errorMsg =
          result?.error ||
          result?.message ||
          `Server returned error status ${response.status}: ${response.statusText}`;
        return {
          success: false,
          error: errorMsg,
        };
      }

      // Supabase Auth user created successfully!
      const authUserId = result.user?.id || result.member?.id;
      const createdMember: AdminMemberRecord = {
        ...result.member,
        id: authUserId,
      };

      // Ensure password is never stored on the client record
      delete (createdMember as any).password;

      // Update local members cache
      const members = this.getGlobalMembers();
      const existingIdx = members.findIndex(
        (m) => m.id === authUserId || m.email.toLowerCase() === cleanEmail
      );
      if (existingIdx >= 0) {
        members[existingIdx] = createdMember;
      } else {
        members.unshift(createdMember);
      }
      this.saveGlobalMembers(members);

      // Initialize Cycle #1 cache
      const newCycle: MembershipCycle = {
        id: `cycle_${Date.now()}_${authUserId}`,
        userId: authUserId,
        cycleNumber: 1,
        startDate: toISODateString(gregStart),
        startDateEth: startEthObj.formattedAm,
        endDate: toISODateString(gregEnd),
        endDateEth: endEthObj.formattedAm,
        dueDate: toISODateString(gregEnd),
        dueDateEth: endEthObj.formattedAm,
        status: 'active',
        paymentStatus: initialPaymentStatus,
        amount: monthlyFee,
        currency: 'ETB',
        paidAt: initialPaymentStatus === 'paid' ? now.toISOString() : undefined,
        paidAtEth: initialPaymentStatus === 'paid' ? ethNow.formattedAm : undefined,
        paymentMethod: 'cash',
        recordedBy: params.recordedBy || 'admin@dagifitness.com',
        notes: params.notes || `Initial 30-day membership cycle (Registered on ${startEthObj.formattedAm})`,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      const allCycles = this.getMembershipCycles();
      allCycles.unshift(newCycle);
      this.saveMembershipCycles(allCycles);

      // If marked as paid on registration, record payment history
      if (initialPaymentStatus === 'paid') {
        const allPayments = this.getMembershipPayments();
        const initialPayment: MembershipPayment = {
          id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          userId: authUserId,
          membershipCycleId: newCycle.id,
          cycleNumber: 1,
          amount: monthlyFee,
          currency: 'ETB',
          paymentDate: now.toISOString(),
          paymentDateEth: ethNow.formattedAm,
          dueDate: toISODateString(gregEnd),
          dueDateEth: endEthObj.formattedAm,
          paymentMethod: 'cash',
          recordedBy: params.recordedBy || 'admin@dagifitness.com',
          notes: 'Initial registration payment (Cycle #1)',
          createdAt: now.toISOString(),
        };
        allPayments.unshift(initialPayment);
        this.saveMembershipPayments(allPayments);
      }

      this.logAdminAction(
        'MEMBER_PROVISIONED',
        cleanEmail,
        `Admin provisioned real Supabase Auth user & profile for ${cleanName} (${params.membershipTier}) with UUID ${authUserId}.`
      );

      return {
        success: true,
        member: createdMember,
        cycle: newCycle,
      };
    } catch (fetchError: any) {
      console.error('Failed to provision member through /api/admin/create-member:', fetchError);
      return {
        success: false,
        error:
          fetchError.message ||
          'Network connection error while contacting the member provisioning API.',
      };
    }
  }

  /**
   * Admin: Update Member Status (Activate / Deactivate / Suspend / Approve)
   */
  static updateMemberStatus(
    memberId: string,
    status: 'active' | 'pending' | 'inactive' | 'suspended',
    isApproved: boolean
  ): boolean {
    const members = this.getGlobalMembers();
    const idx = members.findIndex((m) => m.id === memberId);
    if (idx === -1) return false;

    members[idx].membershipStatus = status;
    members[idx].isApproved = isApproved;
    members[idx].isActive = status === 'active';
    this.saveGlobalMembers(members);

    // Also update in Supabase database if configured
    if (isRealSupabaseConfigured) {
      try {
        supabase
          .from('members')
          .update({ status, is_approved: isApproved })
          .or(`id.eq.${memberId},auth_user_id.eq.${memberId}`)
          .then(() => {}, () => {});
      } catch {}
    }

    this.logAdminAction(
      'MEMBER_STATUS_UPDATED',
      members[idx].email,
      `Status updated to: ${status.toUpperCase()} (Approved: ${isApproved})`
    );
    return true;
  }

  /**
   * Admin: Reset Member Password
   * Updates real user password in Supabase Auth via backend serverless API.
   */
  static async resetMemberPassword(memberId: string, newPass: string): Promise<boolean> {
    const members = this.getGlobalMembers();
    const idx = members.findIndex((m) => m.id === memberId);
    if (idx === -1) return false;

    const email = members[idx].email;
    this.logAdminAction('PASSWORD_RESET', email, `Password reset by administrator`);

    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: memberId, email, newPassword: newPass }),
      });
      const data = await response.json();
      return !!data?.success;
    } catch (err) {
      console.warn('Error resetting password via Supabase Auth API:', err);
      return false;
    }
  }

  /**
   * Admin: Assign Workout Program
   */
  static assignWorkoutProgram(
    memberId: string,
    programId: string,
    programName: string,
    customNotes?: string
  ): boolean {
    const members = this.getGlobalMembers();
    const idx = members.findIndex((m) => m.id === memberId);
    if (idx === -1) return false;

    members[idx].assignedProgramId = programId;
    this.saveGlobalMembers(members);

    this.logAdminAction(
      'WORKOUT_PROGRAM_ASSIGNED',
      members[idx].email,
      `Assigned program "${programName}" (ID: ${programId}). Notes: ${customNotes || 'None'}`
    );

    // Send push notification to member
    const notifs = UserScopedStorage.getItem<NotificationItem[]>(memberId, 'notifications', []);
    notifs.unshift({
      id: `notif_prog_${Date.now()}`,
      title: 'New Workout Split Assigned 🏋️',
      message: `Your coach has assigned you the ${programName} regimen. Check your Train tab!`,
      timestamp: 'Just now',
      type: 'workout',
      isRead: false,
    });
    UserScopedStorage.setItem(memberId, 'notifications', notifs);

    try {
      fetch('/api/admin/assign-program', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          programId,
          programName,
          email: members[idx].email,
          customNotes,
        }),
      }).catch(() => {});
    } catch {}

    return true;
  }

  /**
   * Admin: Update Nutrition Targets & Overrides
   */
  static updateNutritionTargets(
    memberId: string,
    targets: {
      calorieTarget: number;
      proteinTarget: number;
      carbsTarget?: number;
      fatTarget?: number;
      overrideCalories?: number;
      overrideProtein?: number;
    }
  ): boolean {
    const members = this.getGlobalMembers();
    const idx = members.findIndex((m) => m.id === memberId);
    if (idx === -1) return false;

    members[idx].calorieTarget = targets.calorieTarget;
    members[idx].proteinTarget = targets.proteinTarget;
    if (targets.carbsTarget) members[idx].carbsTarget = targets.carbsTarget;
    if (targets.fatTarget) members[idx].fatTarget = targets.fatTarget;
    if (targets.overrideCalories !== undefined) members[idx].overrideCalories = targets.overrideCalories;
    if (targets.overrideProtein !== undefined) members[idx].overrideProtein = targets.overrideProtein;

    this.saveGlobalMembers(members);

    this.logAdminAction(
      'NUTRITION_TARGETS_UPDATED',
      members[idx].email,
      `Updated targets: ${targets.calorieTarget} kcal, ${targets.proteinTarget}g protein`
    );

    try {
      fetch('/api/admin/update-nutrition-targets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          email: members[idx].email,
          ...targets,
        }),
      }).catch(() => {});
    } catch {}

    return true;
  }

  /**
   * Admin Security Credentials Management
   */
  static getAdminCredentials(): { email: string; passwordHash: string; updatedAt?: string } {
    try {
      const raw =
        SafeStorage.getItem('dagi_fitness_admin_credentials_v1') ||
        SafeStorage.getItem('abrish_fitness_admin_credentials_v3');
      if (raw) return JSON.parse(raw);
    } catch {}
    return { email: ADMIN_EMAIL, passwordHash: 'admin123' };
  }

  static async verifyAdminLogin(email: string, password: string): Promise<{ success: boolean; error?: string; admin?: { email: string; name: string } }> {
    const inputEmail = (email || '').trim().toLowerCase();
    const inputPassword = (password || '').trim();

    if (!inputEmail || !inputPassword) {
      return { success: false, error: 'Please enter both administrator email and password.' };
    }

    // Try server verification API first
    try {
      const res = await fetch('/api/admin/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputEmail, password: inputPassword }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          this.setAdminSession(true, inputEmail);
          return { success: true, admin: data.admin };
        }
      }
    } catch {}

    // Fallback to local stored credentials
    const creds = this.getAdminCredentials();
    const expectedEmail = (creds.email || ADMIN_EMAIL).trim().toLowerCase();
    const expectedPass = (creds.passwordHash || 'admin123').trim();

    const isMatch =
      (inputEmail === expectedEmail && inputPassword === expectedPass) ||
      (!creds.updatedAt && (inputEmail === 'admin@dagifitness.com' || inputEmail === 'admin@abrishfitness.com') && inputPassword === 'admin123');

    if (isMatch) {
      this.setAdminSession(true, inputEmail);
      this.logAdminAction(
        'ADMIN_LOGIN',
        inputEmail,
        `Admin logged in to Dagi Fitness Admin Console at ${new Date().toISOString()}`
      );
      return {
        success: true,
        admin: { email: inputEmail, name: 'Dagi Fitness Administrator' },
      };
    }

    return {
      success: false,
      error: 'Invalid administrator email or password. Please check your credentials.',
    };
  }

  static updateAdminSecurity(currentEmail: string, newEmail?: string, newPassword?: string): boolean {
    const creds = this.getAdminCredentials();
    if (newEmail && newEmail.includes('@')) {
      creds.email = newEmail.trim().toLowerCase();
    }
    if (newPassword && newPassword.length >= 6) {
      creds.passwordHash = newPassword.trim();
    }
    creds.updatedAt = new Date().toISOString();
    SafeStorage.setItem('dagi_fitness_admin_credentials_v1', JSON.stringify(creds));
    SafeStorage.setItem('abrish_fitness_admin_credentials_v3', JSON.stringify(creds));

    // Update active session with the new email
    this.setAdminSession(true, creds.email);

    this.logAdminAction(
      'ADMIN_SECURITY_UPDATED',
      creds.email,
      `Admin updated credentials (Email changed: ${Boolean(newEmail)}, Password rotated: ${Boolean(newPassword)})`
    );

    try {
      fetch('/api/admin/update-admin-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentEmail, newEmail, newPassword }),
      }).catch(() => {});
    } catch {}

    return true;
  }

  /**
   * Export all ecosystem data for backup
   */
  static exportAllGymData(): string {
    const data = {
      exportedAt: new Date().toISOString(),
      platform: 'Dagi Fitness Supabase Production Backend',
      members: this.getGlobalMembers(),
      foods: this.getFoodCatalog(),
      auditLogs: this.getAuditLogs(),
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Admin: Broadcast Notification to Active Members
   */
  static broadcastNotification(params: {
    title: string;
    message: string;
    target: 'all' | 'specific';
    targetUserId?: string;
  }): { success: boolean; dispatchedCount: number } {
    const members = this.getGlobalMembers();
    const targetMembers =
      params.target === 'all'
        ? members.filter((m) => m.isActive && m.isApproved)
        : members.filter((m) => m.id === params.targetUserId);

    const notifItem: NotificationItem = {
      id: `notif_broadcast_${Date.now()}`,
      title: params.title,
      message: params.message,
      timestamp: 'Just now',
      type: 'general',
      isRead: false,
    };

    targetMembers.forEach((member) => {
      const userNotifs = UserScopedStorage.getItem<NotificationItem[]>(member.id, 'notifications', []);
      userNotifs.unshift({ ...notifItem, id: `notif_${Date.now()}_${member.id}` });
      UserScopedStorage.setItem(member.id, 'notifications', userNotifs.slice(0, 30));
    });

    this.logAdminAction(
      'NOTIFICATION_BROADCAST',
      params.target === 'all' ? 'ALL_MEMBERS' : (targetMembers[0]?.email || 'SPECIFIC_MEMBER'),
      `Broadcast sent: "${params.title}" (${targetMembers.length} recipient${targetMembers.length === 1 ? '' : 's'})`
    );

    return { success: true, dispatchedCount: targetMembers.length };
  }

  /**
   * Member Data Isolation Operations (Scoped by userId)
   */

  // 1. Profile
  static getUserProfile(userId: string, defaultProfile: UserProfile): UserProfile {
    return UserScopedStorage.getItem<UserProfile>(userId, 'profile', defaultProfile);
  }

  static saveUserProfile(userId: string, profile: UserProfile): void {
    UserScopedStorage.setItem<UserProfile>(userId, 'profile', profile);

    // Update global members list if name or language changed
    const members = this.getGlobalMembers();
    const idx = members.findIndex((m) => m.id === userId || m.email === profile.email);
    if (idx !== -1) {
      members[idx].fullName = profile.name;
      members[idx].language = profile.language;
      members[idx].trainingDaysPerWeek = profile.workoutFrequencyDays;
      members[idx].goal = profile.goal;
      this.saveGlobalMembers(members);
    }
  }

  // 2. Workout History
  static getLoggedWorkouts(userId: string): CompletedWorkout[] {
    return UserScopedStorage.getItem<CompletedWorkout[]>(userId, 'workouts', []);
  }

  static saveLoggedWorkouts(userId: string, workouts: CompletedWorkout[]): void {
    UserScopedStorage.setItem<CompletedWorkout[]>(userId, 'workouts', workouts);
  }

  // 3. Meals
  static getLoggedMeals(userId: string): LoggedMeal[] {
    return UserScopedStorage.getItem<LoggedMeal[]>(userId, 'meals', []);
  }

  static saveLoggedMeals(userId: string, meals: LoggedMeal[]): void {
    UserScopedStorage.setItem<LoggedMeal[]>(userId, 'meals', meals);
  }

  // 4. Weight Logs
  static getWeightLogs(userId: string, defaultLogs: WeightRecord[]): WeightRecord[] {
    return UserScopedStorage.getItem<WeightRecord[]>(userId, 'weight_logs', defaultLogs);
  }

  static saveWeightLogs(userId: string, logs: WeightRecord[]): void {
    UserScopedStorage.setItem<WeightRecord[]>(userId, 'weight_logs', logs);
  }

  // 5. Notifications
  static getNotifications(userId: string, defaultNotifs: NotificationItem[]): NotificationItem[] {
    return UserScopedStorage.getItem<NotificationItem[]>(userId, 'notifications', defaultNotifs);
  }

  static saveNotifications(userId: string, notifs: NotificationItem[]): void {
    UserScopedStorage.setItem<NotificationItem[]>(userId, 'notifications', notifs);
  }

  // 6. Water Log
  static getWaterLogged(userId: string): number {
    return UserScopedStorage.getItem<number>(userId, 'water_logged', 0);
  }

  static saveWaterLogged(userId: string, amount: number): void {
    UserScopedStorage.setItem<number>(userId, 'water_logged', amount);
  }

  // 7. Workout Plan
  static getCustomWorkoutPlan(userId: string): WorkoutRoutine[] | null {
    return UserScopedStorage.getItem<WorkoutRoutine[] | null>(userId, 'workout_plan', null);
  }

  static saveCustomWorkoutPlan(userId: string, plan: WorkoutRoutine[]): void {
    UserScopedStorage.setItem<WorkoutRoutine[]>(userId, 'workout_plan', plan);
  }

  // 8. Chat History
  static getChatHistory(userId: string): any[] {
    return UserScopedStorage.getItem<any[]>(userId, 'chat_history', []);
  }

  static saveChatHistory(userId: string, history: any[]): void {
    UserScopedStorage.setItem<any[]>(userId, 'chat_history', history);
  }

  /**
   * Session Management: Active Member Tracking
   */
  private static CURRENT_MEMBER_ID_KEY = 'jossy_gym_current_active_member_id';

  static getCurrentMemberId(): string | null {
    try {
      return SafeStorage.getItem(this.CURRENT_MEMBER_ID_KEY) || null;
    } catch {
      return null;
    }
  }

  static setCurrentMemberId(memberId: string | null): void {
    try {
      if (memberId) {
        SafeStorage.setItem(this.CURRENT_MEMBER_ID_KEY, memberId);
      } else {
        SafeStorage.removeItem(this.CURRENT_MEMBER_ID_KEY);
      }
    } catch (e) {
      console.warn('Error updating current member id:', e);
    }
  }

  static getMemberById(memberId: string): AdminMemberRecord | null {
    const members = this.getGlobalMembers();
    return members.find((m) => m.id === memberId) || null;
  }

  static getMemberByEmail(email: string): AdminMemberRecord | null {
    const clean = email.trim().toLowerCase();
    const members = this.getGlobalMembers();
    return members.find((m) => m.email.toLowerCase() === clean) || null;
  }

  static updateMemberData(memberId: string, updates: Partial<AdminMemberRecord>): boolean {
    const members = this.getGlobalMembers();
    const idx = members.findIndex((m) => m.id === memberId);
    if (idx === -1) return false;

    members[idx] = {
      ...members[idx],
      ...updates,
      lastActive: updates.lastActive || 'Just now',
    };
    this.saveGlobalMembers(members);

    if (isRealSupabaseConfigured) {
      Promise.resolve(
        supabase
          .from('members')
          .update(updates)
          .eq('id', memberId)
      )
        .then(() => {})
        .catch(() => {});
    }

    return true;
  }

  /**
   * Loads the full persistent state for an authenticated member.
   * Ensures zero data loss across logins.
   */
  static loadMemberFullBundle(memberId: string): {
    user: UserProfile;
    onboardingCompleted: boolean;
    currentRoutine: WorkoutRoutine | null;
    meals: LoggedMeal[];
    completedWorkouts: CompletedWorkout[];
    weightHistory: WeightRecord[];
    water: number;
    steps: number;
    notifications: NotificationItem[];
  } {
    const member = this.getMemberById(memberId);
    const existingProfile = UserScopedStorage.getItem<UserProfile | null>(memberId, 'profile', null);
    const scopedOnboarding = UserScopedStorage.getItem<boolean>(memberId, 'onboarding_completed', false);

    const isOnboardingCompleted = Boolean(
      (member && member.onboardingCompleted) ||
      scopedOnboarding ||
      (existingProfile && existingProfile.onboardingCompleted)
    );

    // Build the resolved profile
    let profile: UserProfile;
    if (existingProfile) {
      profile = {
        ...existingProfile,
        id: memberId,
        onboardingCompleted: isOnboardingCompleted,
        name: member?.fullName || existingProfile.name,
        email: member?.email || existingProfile.email,
        language: member?.language || existingProfile.language || 'en',
        membershipTier: member?.membershipTier || existingProfile.membershipTier || 'VIP',
      };
    } else {
      // Synthesize initial profile from Admin Member Record
      profile = {
        id: memberId,
        name: member?.fullName || 'Athlete',
        email: member?.email || '',
        age: member?.age || 26,
        gender: (member?.sex as any) || 'male',
        heightCm: member?.heightCm || 178,
        weightKg: member?.weightKg || 75.0,
        targetWeightKg: member?.weightKg ? member.weightKg + 2 : 77.0,
        goal: (member?.goal as any) || 'build_muscle',
        experience: (member?.experienceLevel as any) || 'intermediate',
        workoutFrequencyDays: member?.trainingDaysPerWeek || 4,
        workoutDurationMin: 60,
        equipment: ['gym', 'barbell', 'dumbbells', 'machines'],
        language: member?.language || 'en',
        unitSystem: 'metric',
        joinedDate: member?.joinedDate || new Date().toISOString().split('T')[0],
        onboardingCompleted: isOnboardingCompleted,
        membershipTier: member?.membershipTier || 'VIP',
        dietPreference: 'high_protein',
        allergies: ['None'],
        notificationPreferences: {
          morningReminders: true,
          nightReminders: true,
          aiUpdates: true,
        },
        calculatedBmr: member?.calorieTarget ? Math.round(member.calorieTarget * 0.65) : 1720,
        calculatedTdee: member?.calorieTarget ? Math.round(member.calorieTarget * 0.9) : 2660,
        targetCalories: member?.calorieTarget || 2600,
        targetProteinG: member?.proteinTarget || 160,
        targetCarbsG: member?.carbsTarget || 280,
        targetFatG: member?.fatTarget || 70,
        targetFiberG: member?.fiberTarget || 35,
        targetWaterL: 3.0,
        targetDailySteps: 10000,
        targetSleepHours: 8,
        targetCardioMinWeek: 90,
        hasSeenWelcomeNotification: false,
      };
    }

    const currentRoutine = UserScopedStorage.getItem<WorkoutRoutine | null>(memberId, 'current_routine', null);
    const meals = UserScopedStorage.getItem<LoggedMeal[]>(memberId, 'meals', []);
    const completedWorkouts = UserScopedStorage.getItem<CompletedWorkout[]>(memberId, 'workouts', []);
    const weightHistory = UserScopedStorage.getItem<WeightRecord[]>(
      memberId,
      'weight_logs',
      profile.weightKg ? [{ date: new Date().toISOString().split('T')[0], weightKg: profile.weightKg }] : []
    );
    const water = UserScopedStorage.getItem<number>(memberId, 'water_logged', 0);
    const steps = UserScopedStorage.getItem<number>(memberId, 'steps_logged', 0);
    const notifications = UserScopedStorage.getItem<NotificationItem[]>(memberId, 'notifications', []);

    return {
      user: profile,
      onboardingCompleted: isOnboardingCompleted,
      currentRoutine,
      meals,
      completedWorkouts,
      weightHistory,
      water,
      steps,
      notifications,
    };
  }

  /**
   * Persists all data changes for a member, scoped strictly to memberId.
   */
  static saveMemberFullBundle(
    memberId: string,
    bundle: {
      profile: UserProfile;
      currentRoutine?: WorkoutRoutine;
      meals?: LoggedMeal[];
      completedWorkouts?: CompletedWorkout[];
      weightHistory?: WeightRecord[];
      water?: number;
      steps?: number;
      notifications?: NotificationItem[];
      onboardingCompleted?: boolean;
    }
  ): void {
    if (!memberId) return;

    // 1. Profile
    UserScopedStorage.setItem(memberId, 'profile', bundle.profile);

    // 2. Onboarding status
    if (bundle.onboardingCompleted !== undefined) {
      UserScopedStorage.setItem(memberId, 'onboarding_completed', bundle.onboardingCompleted);
    }

    // 3. Routine
    if (bundle.currentRoutine) {
      UserScopedStorage.setItem(memberId, 'current_routine', bundle.currentRoutine);
    }

    // 4. Meals
    if (bundle.meals) {
      UserScopedStorage.setItem(memberId, 'meals', bundle.meals);
    }

    // 5. Workouts
    if (bundle.completedWorkouts) {
      UserScopedStorage.setItem(memberId, 'workouts', bundle.completedWorkouts);
    }

    // 6. Weight
    if (bundle.weightHistory) {
      UserScopedStorage.setItem(memberId, 'weight_logs', bundle.weightHistory);
    }

    // 7. Water & Steps
    if (bundle.water !== undefined) {
      UserScopedStorage.setItem(memberId, 'water_logged', bundle.water);
    }
    if (bundle.steps !== undefined) {
      UserScopedStorage.setItem(memberId, 'steps_logged', bundle.steps);
    }

    // 8. Notifications
    if (bundle.notifications) {
      UserScopedStorage.setItem(memberId, 'notifications', bundle.notifications);
    }

    // 9. Update the global member record
    this.updateMemberData(memberId, {
      fullName: bundle.profile.name,
      language: bundle.profile.language,
      trainingDaysPerWeek: bundle.profile.workoutFrequencyDays,
      goal: bundle.profile.goal,
      sex: bundle.profile.gender,
      age: bundle.profile.age,
      heightCm: bundle.profile.heightCm,
      weightKg: bundle.profile.weightKg,
      calorieTarget: bundle.profile.targetCalories,
      proteinTarget: bundle.profile.targetProteinG,
      carbsTarget: bundle.profile.targetCarbsG,
      fatTarget: bundle.profile.targetFatG,
      fiberTarget: bundle.profile.targetFiberG,
      onboardingCompleted:
        bundle.onboardingCompleted ?? bundle.profile.onboardingCompleted ?? true,
      lastActive: 'Just now',
    });
  }
}
