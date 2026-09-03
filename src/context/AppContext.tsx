import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  UserProfile,
  FitnessProfile,
  DailyGoalItem,
  DayActivity,
  WorkoutRoutine,
  CompletedWorkout,
  LoggedMeal,
  WeightRecord,
  NotificationItem,
  AppRoute,
  UserGoal,
  Gender,
  ExperienceLevel,
  EquipmentType,
  FoodItem,
} from '../types';
import { DEFAULT_ROUTINES, getRecommendedRoutine } from '../data/workoutDatabase';
import { FOOD_DATABASE } from '../data/foodDatabase';
import { StorageService, AuthService, FitnessCalculator, NotificationService } from '../services/fitnessServices';
import { SupabaseService, UserScopedStorage, isRealSupabaseConfigured, supabase } from '../services/supabaseClient';
import {
  t as translateHelper,
  getLocalizedGreeting,
  getLocalizedExercise as getLocExercise,
  getLocalizedMuscle as getLocMuscle,
  getLocalizedRoutine as getLocRoutine,
  getLocalizedDay as getLocDay,
  getLocalizedMealType as getLocMealType,
  getLocalizedGoal as getLocGoal,
  getLocalizedNotification as getLocNotification,
  Language,
  TranslationKey,
} from '../locales';

interface ActiveWorkoutState {
  routine: WorkoutRoutine;
  startTime: number;
  currentExerciseIndex: number;
  completedSetsCount: number;
  isPaused: boolean;
  restTimerSec: number | null;
  totalRestTimeSec: number;
}

interface AppContextType {
  route: AppRoute;
  setRoute: (route: AppRoute) => void;
  user: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: (data: Partial<UserProfile>) => void;

  // Language & Translation
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  getLocalizedExercise: (name: string) => string;
  getLocalizedMuscle: (muscle: string) => string;
  getLocalizedRoutine: (title: string) => string;
  getLocalizedDay: (dayName: string, short?: boolean) => string;
  getLocalizedMealType: (mealType: string) => string;
  getLocalizedGoal: (goal: DailyGoalItem) => { title: string; subtitle: string };
  getLocalizedNotification: (item: NotificationItem) => { title: string; message: string; timestamp: string };
  
  // Dashboard & Goals
  dailyGoals: DailyGoalItem[];
  toggleGoalCompletion: (id: string) => void;
  overallProgressPercent: number;
  completedGoalsCount: number;
  inProgressGoalsCount: number;
  remainingGoalsCount: number;
  
  // Dynamic Greetings & Motivation
  greeting: string;
  motivationalSubtitle: string;
  
  // Stats & Weekly Overview
  weeklyActivity: DayActivity[];
  currentStreak: number;
  bestStreak: number;
  successRate: number;
  successRateDiff: number;
  isWeeklyDetailsOpen: boolean;
  setIsWeeklyDetailsOpen: (open: boolean) => void;
  
  // Workouts & Active Session
  currentRoutine: WorkoutRoutine;
  activeWorkout: ActiveWorkoutState | null;
  completedWorkouts: CompletedWorkout[];
  startWorkout: (routine?: WorkoutRoutine) => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  completeSet: (exerciseId: string, setIndex: number, weightKg: number, reps: number) => void;
  skipExercise: () => void;
  finishActiveWorkout: () => CompletedWorkout | null;
  cancelActiveWorkout: () => void;
  startRestTimer: (seconds: number) => void;
  cancelRestTimer: () => void;
  
  // Nutrition & Water
  loggedMeals: LoggedMeal[];
  currentWaterL: number;
  addWaterL: (amountL: number) => void;
  logMeal: (meal: Omit<LoggedMeal, 'id' | 'timestamp'>) => void;
  updateMeal: (id: string, updates: Partial<LoggedMeal>) => void;
  deleteMeal: (id: string) => void;
  consumedCalories: number;
  consumedProteinG: number;
  consumedCarbsG: number;
  consumedFatG: number;
  consumedFiberG: number;
  consumedSugarG: number;
  
  // Progress & Logs
  weightHistory: WeightRecord[];
  logWeight: (weightKg: number) => void;
  currentSteps: number;
  addSteps: (steps: number) => void;
  
  // Notifications & UI modals
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;
  isQuickLogOpen: boolean;
  setIsQuickLogOpen: (open: boolean) => void;
  quickLogTab: 'options' | 'water' | 'weight' | 'steps' | 'sleep';
  setQuickLogTab: (tab: 'options' | 'water' | 'weight' | 'steps' | 'sleep') => void;
  openQuickLog: (tab?: 'options' | 'water' | 'weight' | 'steps' | 'sleep') => void;
  setWaterL: (amountL: number) => void;
  setSteps: (steps: number) => void;
  sleepHoursLogged: number;
  setSleepHoursLogged: (hours: number) => void;
  logSleep: (hours: number) => void;
  logFoodItem: (
    food: FoodItem,
    servings?: number,
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    portionDescription?: string
  ) => void;
  isJossyAIOpen: boolean;
  setIsJossyAIOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isSummaryModalOpen: boolean;
  setIsSummaryModalOpen: (open: boolean) => void;
  latestCompletedWorkout: CompletedWorkout | null;
  
  // Audio & Reset
  playBeep: () => void;
  resetAllDataToDefaults: () => void;
  loadUserSession: (userId: string) => Promise<boolean>;
  signOutMember: () => Promise<void>;
}

const DEFAULT_USER: UserProfile = {
  name: 'Daniel Mekonnen',
  email: 'daniel@dagifitness.com',
  age: 26,
  gender: 'male',
  heightCm: 178,
  weightKg: 76.5,
  targetWeightKg: 80.0,
  goal: 'build_muscle',
  experience: 'intermediate',
  workoutFrequencyDays: 4,
  workoutDurationMin: 60,
  equipment: ['gym', 'barbell', 'dumbbells', 'machines'],
  language: 'en',
  unitSystem: 'metric',
  joinedDate: '2026-01-15',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  dietPreference: 'high_protein',
  allergies: ['None'],
  notificationPreferences: {
    morningReminders: true,
    nightReminders: true,
    aiUpdates: true,
  },
  calculatedBmr: 1720,
  calculatedTdee: 2660,
  targetCalories: 2960,
  targetProteinG: 170,
  targetCarbsG: 360,
  targetFatG: 75,
  targetWaterL: 3.2,
  targetDailySteps: 10000,
  targetSleepHours: 8,
  targetCardioMinWeek: 90,
  hasSeenWelcomeNotification: false,
};

const INITIAL_WEIGHT_RECORDS: WeightRecord[] = [];

const INITIAL_MEALS: LoggedMeal[] = [];

function recalculateUserTargets(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number,
  goal: UserGoal
) {
  const bmr = FitnessCalculator.calculateBMR(gender, weightKg, heightCm, age);
  const tdee = FitnessCalculator.calculateTDEE(bmr, 'moderate');
  const targets = FitnessCalculator.calculateNutritionTargets(goal, weightKg, tdee);

  return {
    calculatedBmr: bmr,
    calculatedTdee: tdee,
    targetCalories: targets.targetCalories,
    targetProteinG: targets.targetProteinG,
    targetCarbsG: targets.targetCarbsG,
    targetFatG: targets.targetFatG,
    targetFiberG: targets.targetFiberG,
    targetSugarG: targets.targetSugarG,
    targetWaterL: targets.targetWaterL,
    targetCardioMinWeek: targets.targetCardioMinWeek,
    targetDailySteps: targets.targetDailySteps,
    targetSleepHours: 8,
  };
}

const AppContext = createContext<AppContextType | null>(null);

const getInitialAppRoute = (): AppRoute => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path.startsWith('/admin') || hash.startsWith('#/admin')) {
      return 'admin';
    }
  }
  return 'splash';
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation Route state: initialized with direct /admin support
  const [route, setRouteInternal] = useState<AppRoute>(getInitialAppRoute);

  const setRoute = useCallback((newRoute: AppRoute) => {
    setRouteInternal(newRoute);
    if (typeof window !== 'undefined') {
      if (newRoute === 'admin') {
        if (!window.location.pathname.startsWith('/admin')) {
          window.history.pushState(null, '', '/admin');
        }
      } else {
        if (window.location.pathname.startsWith('/admin')) {
          window.history.pushState(null, '', '/');
        }
      }
    }
  }, []);

  // Listen to popstate (Browser Back/Forward buttons and direct URL navigation)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const hash = window.location.hash;
        if (path.startsWith('/admin') || hash.startsWith('#/admin')) {
          setRouteInternal('admin');
        } else {
          setRouteInternal((prev) => (prev === 'admin' ? 'dashboard' : prev));
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Notification generator helper
  const buildDefaultNotifications = useCallback((u: UserProfile, r: WorkoutRoutine): NotificationItem[] => {
    const firstName = u.name ? u.name.split(' ')[0] : 'Athlete';
    const welcome = NotificationService.generateWelcomeMessage(firstName, u.goal, u.language);
    const morning = NotificationService.generateMorningNotification(firstName, r.title, false, u.language);
    const night = NotificationService.generateNightNotification(firstName, true, u.language);

    return [
      {
        id: 'n-welcome',
        title: welcome.title,
        message: welcome.message,
        timestamp: 'Just now',
        type: 'welcome',
        isRead: false,
      },
      {
        id: 'n-morning',
        title: morning.title,
        message: morning.message,
        timestamp: '8:00 AM',
        type: 'workout',
        isRead: false,
      },
      {
        id: 'n-night',
        title: night.title,
        message: night.message,
        timestamp: 'Yesterday',
        type: 'night',
        isRead: true,
      },
    ];
  }, []);

  // Initial bundle resolution (tied to currently active member ID)
  const initialActiveId = useMemo(() => SupabaseService.getCurrentMemberId(), []);
  const initialBundle = useMemo(
    () => (initialActiveId ? SupabaseService.loadMemberFullBundle(initialActiveId) : null),
    [initialActiveId]
  );

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    if (initialBundle) return initialBundle.user;
    return StorageService.getItem<UserProfile>('user', DEFAULT_USER);
  });

  // Routine & Active Workout
  const [currentRoutine, setCurrentRoutine] = useState<WorkoutRoutine>(() => {
    if (initialBundle?.currentRoutine) return initialBundle.currentRoutine;
    const saved = StorageService.getItem<WorkoutRoutine | null>('current_routine', null);
    if (saved) return saved;
    return getRecommendedRoutine(user.goal, user.equipment);
  });

  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkoutState | null>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>(() => {
    if (initialBundle && Array.isArray(initialBundle.completedWorkouts)) return initialBundle.completedWorkouts;
    return StorageService.getItem<CompletedWorkout[]>('completed_workouts', []);
  });

  // Nutrition & Water (Start strictly at 0 for new athletes)
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>(() => {
    if (initialBundle && Array.isArray(initialBundle.meals)) return initialBundle.meals;
    return StorageService.getItem<LoggedMeal[]>('meals', []);
  });

  const [currentWaterL, setCurrentWaterL] = useState<number>(() => {
    if (initialBundle && typeof initialBundle.water === 'number') return initialBundle.water;
    return StorageService.getItem<number>('water', 0);
  });

  const [currentSteps, setCurrentSteps] = useState<number>(() => {
    if (initialBundle && typeof initialBundle.steps === 'number') return initialBundle.steps;
    return StorageService.getItem<number>('steps', 0);
  });

  const [sleepHoursLogged, setSleepHoursLogged] = useState<number>(0);

  const [weightHistory, setWeightHistory] = useState<WeightRecord[]>(() => {
    if (initialBundle && Array.isArray(initialBundle.weightHistory) && initialBundle.weightHistory.length > 0) {
      return initialBundle.weightHistory;
    }
    const fallback = user.weightKg ? [{ date: new Date().toISOString().split('T')[0], weightKg: user.weightKg }] : [];
    return StorageService.getItem<WeightRecord[]>('weight_history', fallback);
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (initialBundle && initialBundle.notifications.length > 0) return initialBundle.notifications;
    const saved = StorageService.getItem<NotificationItem[]>('notifications', []);
    if (saved && saved.length > 0) return saved;
    return buildDefaultNotifications(user, currentRoutine);
  });

  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [quickLogTab, setQuickLogTab] = useState<'options' | 'water' | 'weight' | 'steps' | 'sleep'>('options');
  const [isJossyAIOpen, setIsJossyAIOpen] = useState(false);
  const [isWeeklyDetailsOpen, setIsWeeklyDetailsOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [latestCompletedWorkout, setLatestCompletedWorkout] = useState<CompletedWorkout | null>(null);

  const openQuickLog = useCallback((tab: 'options' | 'water' | 'weight' | 'steps' | 'sleep' = 'options') => {
    setQuickLogTab(tab);
    setIsQuickLogOpen(true);
  }, []);

  // Sound generator
  const playBeep = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (err) {
      // Audio context might be restricted
    }
  }, []);

  // Save to StorageService and UserScopedStorage on updates
  useEffect(() => {
    StorageService.setItem('user', user);
    if (user.id) {
      SupabaseService.saveMemberFullBundle(user.id, {
        profile: user,
        currentRoutine,
        meals: loggedMeals,
        completedWorkouts,
        weightHistory,
        water: currentWaterL,
        steps: currentSteps,
        notifications,
      });
    }
  }, [user, currentRoutine, loggedMeals, completedWorkouts, weightHistory, currentWaterL, currentSteps, notifications]);

  // Language state & Sync
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = StorageService.getItem<Language | null>('language', null);
    if (savedLang === 'en' || savedLang === 'am') return savedLang;
    const userLang = StorageService.getItem<UserProfile>('user', DEFAULT_USER)?.language;
    return userLang === 'am' ? 'am' : 'en';
  });

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      return translateHelper(key, params, language);
    },
    [language]
  );

  const getLocalizedExercise = useCallback(
    (name: string) => getLocExercise(name, language),
    [language]
  );

  const getLocalizedMuscle = useCallback(
    (muscle: string) => getLocMuscle(muscle, language),
    [language]
  );

  const getLocalizedRoutine = useCallback(
    (title: string) => getLocRoutine(title, language),
    [language]
  );

  const getLocalizedDay = useCallback(
    (dayName: string, short?: boolean) => getLocDay(dayName, language, short),
    [language]
  );

  const getLocalizedMealType = useCallback(
    (mealType: string) => getLocMealType(mealType, language),
    [language]
  );

  const getLocalizedGoal = useCallback(
    (goal: DailyGoalItem) => getLocGoal(goal, language),
    [language]
  );

  const getLocalizedNotification = useCallback(
    (item: NotificationItem) => getLocNotification(item, language),
    [language]
  );

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    StorageService.setItem('language', newLang);
    setUser((prev) => {
      const updated = { ...prev, language: newLang };
      StorageService.setItem('user', updated);
      return updated;
    });
    if (typeof document !== 'undefined') {
      document.title = newLang === 'am' ? 'ዳጊ ፊትነስ | Dagi Fitness' : 'Dagi Fitness — Luxury Fitness & Performance';
      document.documentElement.lang = newLang;
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = language === 'am' ? 'ዳጊ ፊትነስ | Dagi Fitness' : 'Dagi Fitness — Luxury Fitness & Performance';
      document.documentElement.lang = language;
    }
  }, [language]);

  // Consumed totals
  const consumedCalories = useMemo(() => {
    return loggedMeals.reduce((acc, m) => acc + m.calories, 0);
  }, [loggedMeals]);

  const consumedProteinG = useMemo(() => {
    return Math.round(loggedMeals.reduce((acc, m) => acc + m.proteinG, 0) * 10) / 10;
  }, [loggedMeals]);

  const consumedCarbsG = useMemo(() => {
    return Math.round(loggedMeals.reduce((acc, m) => acc + m.carbsG, 0) * 10) / 10;
  }, [loggedMeals]);

  const consumedFatG = useMemo(() => {
    return Math.round(loggedMeals.reduce((acc, m) => acc + m.fatG, 0) * 10) / 10;
  }, [loggedMeals]);

  const consumedFiberG = useMemo(() => {
    return Math.round(loggedMeals.reduce((acc, m) => acc + (m.fiberG || 0), 0) * 10) / 10;
  }, [loggedMeals]);

  const consumedSugarG = useMemo(() => {
    return Math.round(loggedMeals.reduce((acc, m) => acc + (m.sugarG || 0), 0) * 10) / 10;
  }, [loggedMeals]);

  // Check today's achievements
  const isWorkoutTodayDone = completedWorkouts.some((w) => w.date === new Date().toISOString().split('T')[0]);
  const isCaloriesTargetReached = consumedCalories >= user.targetCalories * 0.9;
  const isWaterTargetReached = currentWaterL >= user.targetWaterL;
  const isStepsTargetReached = currentSteps >= user.targetDailySteps;
  const isSleepTargetReached = sleepHoursLogged >= user.targetSleepHours;

  // Daily Goals List Items
  const dailyGoals: DailyGoalItem[] = useMemo(() => {
    const workoutSubtitle = isWorkoutTodayDone
      ? `${getLocRoutine(currentRoutine.title, language)} • ${t('completed_status')}`
      : `${getLocRoutine(currentRoutine.title, language)} • ${currentRoutine.estimatedDurationMin} ${t('minutes_unit')}`;

    return [
      {
        id: 'goal-workout',
        type: 'workout',
        title: t('goal_workout'),
        subtitle: workoutSubtitle,
        iconName: 'Dumbbell',
        color: '#5C71F3',
        bgColor: '#EEF1FE',
        isCompleted: isWorkoutTodayDone,
        currentValue: isWorkoutTodayDone ? 1 : 0,
        targetValue: 1,
        unit: language === 'am' ? 'ክፍለ-ጊዜ' : 'session',
      },
      {
        id: 'goal-nutrition',
        type: 'nutrition',
        title: t('goal_nutrition'),
        subtitle: `${consumedCalories.toLocaleString()} / ${user.targetCalories.toLocaleString()} ${t('calories_unit')}`,
        iconName: 'Utensils',
        color: '#FFB020',
        bgColor: '#FFF7E6',
        isCompleted: isCaloriesTargetReached,
        currentValue: consumedCalories,
        targetValue: user.targetCalories,
        unit: t('calories_unit'),
      },
      {
        id: 'goal-hydration',
        type: 'hydration',
        title: t('goal_hydration'),
        subtitle: `${currentWaterL.toFixed(1)} / ${user.targetWaterL.toFixed(1)} ${t('liters_unit')}`,
        iconName: 'Droplets',
        color: '#00D09E',
        bgColor: '#E6FAF5',
        isCompleted: isWaterTargetReached,
        currentValue: currentWaterL,
        targetValue: user.targetWaterL,
        unit: t('liters_unit'),
      },
      {
        id: 'goal-steps',
        type: 'steps',
        title: t('goal_steps'),
        subtitle: `${currentSteps.toLocaleString()} / ${user.targetDailySteps.toLocaleString()}`,
        iconName: 'Footprints',
        color: '#9D5CE5',
        bgColor: '#F5ECFD',
        isCompleted: isStepsTargetReached,
        currentValue: currentSteps,
        targetValue: user.targetDailySteps,
        unit: t('steps_unit'),
      },
      {
        id: 'goal-recovery',
        type: 'recovery',
        title: t('goal_recovery'),
        subtitle: `${t('sleep_label')} • ${sleepHoursLogged}${t('hours_unit')}`,
        iconName: 'Moon',
        color: '#00C48C',
        bgColor: '#E6FAF3',
        isCompleted: isSleepTargetReached,
        currentValue: sleepHoursLogged,
        targetValue: user.targetSleepHours,
        unit: t('hours_unit'),
      },
    ];
  }, [
    isWorkoutTodayDone,
    currentRoutine,
    consumedCalories,
    user.targetCalories,
    isCaloriesTargetReached,
    currentWaterL,
    user.targetWaterL,
    isWaterTargetReached,
    currentSteps,
    user.targetDailySteps,
    isStepsTargetReached,
    sleepHoursLogged,
    user.targetSleepHours,
    isSleepTargetReached,
    language,
    t,
  ]);

  // Overall Progress Percentage (Strictly 0% for new members who have done nothing)
  const overallProgressPercent = useMemo(() => {
    let totalScore = 0;
    // 1. Workout completion: 25% if done today, 0% if not
    if (isWorkoutTodayDone) {
      totalScore += 25;
    }
    // 2. Nutrition / Calorie intake: up to 25%
    if (user.targetCalories > 0 && consumedCalories > 0) {
      totalScore += Math.min(1, consumedCalories / user.targetCalories) * 25;
    }
    // 3. Hydration: up to 20%
    if (user.targetWaterL > 0 && currentWaterL > 0) {
      totalScore += Math.min(1, currentWaterL / user.targetWaterL) * 20;
    }
    // 4. Daily Steps: up to 15%
    if (user.targetDailySteps > 0 && currentSteps > 0) {
      totalScore += Math.min(1, currentSteps / user.targetDailySteps) * 15;
    }
    // 5. Recovery / Sleep (only if logged > 0): up to 15%
    if (user.targetSleepHours > 0 && sleepHoursLogged > 0) {
      totalScore += Math.min(1, sleepHoursLogged / user.targetSleepHours) * 15;
    }

    return Math.min(100, Math.round(totalScore));
  }, [
    isWorkoutTodayDone,
    consumedCalories,
    user.targetCalories,
    currentWaterL,
    user.targetWaterL,
    currentSteps,
    user.targetDailySteps,
    sleepHoursLogged,
    user.targetSleepHours,
  ]);

  const completedGoalsCount = dailyGoals.filter((g) => g.isCompleted).length;
  const inProgressGoalsCount = dailyGoals.filter((g) => !g.isCompleted && g.currentValue > 0).length;
  const remainingGoalsCount = dailyGoals.length - completedGoalsCount;

  // Real Calculated Streak from activity records (0 for new members)
  const currentStreak = useMemo(() => {
    return completedWorkouts.length;
  }, [completedWorkouts.length]);

  const bestStreak = useMemo(() => {
    return currentStreak;
  }, [currentStreak]);

  const successRate = useMemo(() => {
    return overallProgressPercent;
  }, [overallProgressPercent]);

  const successRateDiff = 12;

  // Contextual Greetings & Motivations based on user data
  const greeting = useMemo(() => {
    const firstName = user.name ? user.name.trim().split(' ')[0] : (language === 'am' ? 'አትሌት' : 'Athlete');
    return getLocalizedGreeting(firstName, user.gender, language);
  }, [user.name, user.gender, language]);

  const motivationalSubtitle = useMemo(() => {
    if (!isWorkoutTodayDone) {
      return t('workout_ready_motivation');
    }
    if (completedGoalsCount >= 4) {
      return t('all_targets_crushed');
    }
    if (currentWaterL < user.targetWaterL) {
      const remaining = Math.max(0.1, Math.round((user.targetWaterL - currentWaterL) * 10) / 10);
      return t('hydration_reminder_progress', { remaining });
    }
    if (isWorkoutTodayDone) {
      return t('workout_done_motivation');
    }
    return t('streak_motivation_text', { streak: currentStreak });
  }, [
    isWorkoutTodayDone,
    completedGoalsCount,
    currentWaterL,
    user.targetWaterL,
    language,
    currentStreak,
    t,
  ]);

  // Weekly Overview (Dynamic 7 days based on real user activity logs)
  const weeklyActivity: DayActivity[] = useMemo(() => {
    const days: DayActivity[] = [];
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = dayNames[d.getDay()];

      if (i === 0) {
        // Today
        days.push({
          dayOfWeek,
          date: dateStr,
          completionPercentage: overallProgressPercent,
          workoutDone: isWorkoutTodayDone,
          caloriesConsumed: consumedCalories,
          caloriesTarget: user.targetCalories,
          waterConsumedL: currentWaterL,
          waterTargetL: user.targetWaterL,
          stepsCount: currentSteps,
          stepsTarget: user.targetDailySteps,
        });
      } else {
        // Historical day
        const hasWorkout = completedWorkouts.some((w) => w.date === dateStr);
        days.push({
          dayOfWeek,
          date: dateStr,
          completionPercentage: hasWorkout ? 100 : 0,
          workoutDone: hasWorkout,
          caloriesConsumed: 0,
          caloriesTarget: user.targetCalories,
          waterConsumedL: 0,
          waterTargetL: user.targetWaterL,
          stepsCount: 0,
          stepsTarget: user.targetDailySteps,
        });
      }
    }
    return days;
  }, [
    overallProgressPercent,
    isWorkoutTodayDone,
    isCaloriesTargetReached,
    isWaterTargetReached,
    isStepsTargetReached,
    completedWorkouts,
  ]);

  // Toggle goal manually
  const toggleGoalCompletion = useCallback((id: string) => {
    if (id === 'goal-workout') {
      if (isWorkoutTodayDone) {
        const todayStr = new Date().toISOString().split('T')[0];
        setCompletedWorkouts((prev) => prev.filter((w) => w.date !== todayStr));
      } else {
        const todayStr = new Date().toISOString().split('T')[0];
        const newLog: CompletedWorkout = {
          id: 'cw-' + Date.now(),
          routineTitle: currentRoutine.title,
          date: todayStr,
          durationMinutes: currentRoutine.estimatedDurationMin,
          totalVolumeKg: 4200,
          totalSetsCompleted: 12,
          totalCaloriesBurned: 380,
          exerciseCount: currentRoutine.exercises.length,
        };
        setCompletedWorkouts((prev) => [newLog, ...prev]);
      }
    } else if (id === 'goal-hydration') {
      setCurrentWaterL((prev) => (prev >= user.targetWaterL ? 1.0 : user.targetWaterL));
    } else if (id === 'goal-steps') {
      setCurrentSteps((prev) => (prev >= user.targetDailySteps ? 5000 : user.targetDailySteps));
    } else if (id === 'goal-recovery') {
      setSleepHoursLogged((prev) => (prev >= 8 ? 6 : 8));
    }
  }, [isWorkoutTodayDone, currentRoutine, user.targetWaterL, user.targetDailySteps]);

  // Profile updates with recalculated targets
  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    if (updates.language && (updates.language === 'en' || updates.language === 'am')) {
      setLanguageState(updates.language);
      StorageService.setItem('language', updates.language);
      if (typeof document !== 'undefined') {
        document.title = updates.language === 'am' ? 'ዳጊ ፊትነስ | Dagi Fitness' : 'Dagi Fitness — Luxury Fitness & Performance';
        document.documentElement.lang = updates.language;
      }
    }
    setUser((prev) => {
      const merged = { ...prev, ...updates };
      const targets = recalculateUserTargets(
        merged.gender,
        merged.weightKg,
        merged.heightCm,
        merged.age,
        merged.goal
      );
      return {
        ...merged,
        ...targets,
      };
    });
  }, []);

  const completeOnboarding = useCallback((data: Partial<UserProfile>) => {
    setUser((prev) => {
      const merged = { ...prev, ...data, onboardingCompleted: true };
      const targets = recalculateUserTargets(
        merged.gender || prev.gender,
        merged.weightKg || prev.weightKg,
        merged.heightCm || prev.heightCm,
        merged.age || prev.age,
        merged.goal || prev.goal
      );
      const updatedRoutine = getRecommendedRoutine(merged.goal || prev.goal, merged.equipment || prev.equipment);
      setCurrentRoutine(updatedRoutine);

      const today = new Date().toISOString().split('T')[0];
      const initialWeightRecord: WeightRecord[] = [
        { date: today, weightKg: merged.weightKg || prev.weightKg || 70 },
      ];
      setWeightHistory(initialWeightRecord);

      // Scoped persistence
      StorageService.setItem('onboarding_completed', true);
      if (merged.id) {
        SupabaseService.saveMemberFullBundle(merged.id, {
          profile: { ...merged, ...targets, onboardingCompleted: true },
          currentRoutine: updatedRoutine,
          onboardingCompleted: true,
          weightHistory: initialWeightRecord,
        });
        SupabaseService.updateMemberData(merged.id, {
          fullName: merged.name,
          goal: merged.goal,
          sex: merged.gender === 'female' ? 'female' : 'male',
          age: merged.age,
          heightCm: merged.heightCm,
          weightKg: merged.weightKg,
          targetWeightKg: merged.targetWeightKg,
          experienceLevel: merged.experience,
          availableEquipment: Array.isArray(merged.equipment) ? merged.equipment.join(', ') : merged.equipment,
          onboardingCompleted: true,
        });
      }

      return {
        ...merged,
        ...targets,
        onboardingCompleted: true,
      };
    });
  }, []);

  // Water & Steps & Sleep Handlers
  const addWaterL = useCallback((amountL: number) => {
    setCurrentWaterL((prev) => Math.max(0, Math.round((prev + amountL) * 10) / 10));
  }, []);

  const setWaterL = useCallback((amountL: number) => {
    setCurrentWaterL(Math.max(0, Math.round(amountL * 10) / 10));
  }, []);

  const addSteps = useCallback((steps: number) => {
    setCurrentSteps((prev) => Math.max(0, prev + steps));
  }, []);

  const setSteps = useCallback((steps: number) => {
    setCurrentSteps(Math.max(0, steps));
  }, []);

  const logSleep = useCallback((hours: number) => {
    const validHours = Math.max(0, Math.min(24, Math.round(hours * 10) / 10));
    setSleepHoursLogged(validHours);
  }, []);

  const logWeight = useCallback((weightKg: number) => {
    const today = new Date().toISOString().split('T')[0];
    setWeightHistory((prev) => [...prev.filter((r) => r.date !== today), { date: today, weightKg }]);
    setUser((prev) => ({ ...prev, weightKg }));
  }, []);

  // Meal Handlers
  const logMeal = useCallback((meal: Omit<LoggedMeal, 'id' | 'timestamp'>) => {
    const newMeal: LoggedMeal = {
      ...meal,
      id: 'm-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setLoggedMeals((prev) => [newMeal, ...prev]);
  }, []);

  const logFoodItem = useCallback(
    (
      food: FoodItem,
      servings: number = 1,
      mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'lunch',
      portionDescription?: string
    ) => {
      const multiplier = Math.max(0.25, servings);
      logMeal({
        foodId: food.id,
        name: language === 'am' ? food.nameAm : food.nameEn,
        mealType,
        servings: multiplier,
        portionDescription: portionDescription || `${multiplier}x ${food.servingSize}`,
        calories: Math.round(food.calories * multiplier),
        proteinG: Math.round(food.proteinG * multiplier * 10) / 10,
        carbsG: Math.round(food.carbsG * multiplier * 10) / 10,
        fatG: Math.round(food.fatG * multiplier * 10) / 10,
        fiberG: Math.round((food.fiberG || 0) * multiplier * 10) / 10,
        sugarG: Math.round((food.sugarG || 0) * multiplier * 10) / 10,
      });
    },
    [language, logMeal]
  );

  const deleteMeal = useCallback((id: string) => {
    setLoggedMeals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const updateMeal = useCallback((id: string, updates: Partial<LoggedMeal>) => {
    setLoggedMeals((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }, []);

  // Active Workout Handlers
  const startWorkout = useCallback((routine?: WorkoutRoutine) => {
    const routineToStart = routine || currentRoutine;
    setActiveWorkout({
      routine: JSON.parse(JSON.stringify(routineToStart)),
      startTime: Date.now(),
      currentExerciseIndex: 0,
      completedSetsCount: 0,
      isPaused: false,
      restTimerSec: null,
      totalRestTimeSec: 0,
    });
  }, [currentRoutine]);

  const pauseWorkout = useCallback(() => {
    setActiveWorkout((prev) => (prev ? { ...prev, isPaused: true } : null));
  }, []);

  const resumeWorkout = useCallback(() => {
    setActiveWorkout((prev) => (prev ? { ...prev, isPaused: false } : null));
  }, []);

  const completeSet = useCallback((exerciseId: string, setIndex: number, weightKg: number, reps: number) => {
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const updatedExercises = prev.routine.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const newSets = [...ex.sets];
        newSets[setIndex] = {
          ...newSets[setIndex],
          weightKg,
          reps,
          isCompleted: true,
        };
        return { ...ex, sets: newSets };
      });

      const currentEx = prev.routine.exercises[prev.currentExerciseIndex];
      const restSec = currentEx ? currentEx.defaultRestSec : 90;

      return {
        ...prev,
        routine: { ...prev.routine, exercises: updatedExercises },
        completedSetsCount: prev.completedSetsCount + 1,
        restTimerSec: restSec,
      };
    });
  }, []);

  const skipExercise = useCallback(() => {
    setActiveWorkout((prev) => {
      if (!prev) return null;
      if (prev.currentExerciseIndex < prev.routine.exercises.length - 1) {
        return {
          ...prev,
          currentExerciseIndex: prev.currentExerciseIndex + 1,
          restTimerSec: null,
        };
      }
      return prev;
    });
  }, []);

  const startRestTimer = useCallback((seconds: number) => {
    setActiveWorkout((prev) => (prev ? { ...prev, restTimerSec: seconds } : null));
  }, []);

  const cancelRestTimer = useCallback(() => {
    setActiveWorkout((prev) => (prev ? { ...prev, restTimerSec: null } : null));
  }, []);

  const finishActiveWorkout = useCallback(() => {
    if (!activeWorkout) return null;
    const durationMin = Math.max(1, Math.round((Date.now() - activeWorkout.startTime) / 60000));
    
    let totalVolume = 0;
    let setsCompleted = 0;
    activeWorkout.routine.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.isCompleted) {
          totalVolume += s.weightKg * s.reps;
          setsCompleted++;
        }
      });
    });

    const caloriesBurned = Math.round(durationMin * 7.5);

    const completed: CompletedWorkout = {
      id: 'cw-' + Date.now(),
      routineTitle: activeWorkout.routine.title,
      date: new Date().toISOString().split('T')[0],
      durationMinutes: durationMin,
      totalVolumeKg: Math.round(totalVolume),
      totalSetsCompleted: setsCompleted,
      totalCaloriesBurned: caloriesBurned,
      exerciseCount: activeWorkout.routine.exercises.length,
    };

    setCompletedWorkouts((prev) => [completed, ...prev]);
    setLatestCompletedWorkout(completed);
    setActiveWorkout(null);
    setIsSummaryModalOpen(true);

    return completed;
  }, [activeWorkout]);

  const cancelActiveWorkout = useCallback(() => {
    setActiveWorkout(null);
  }, []);

  // Notifications
  const markNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const loadUserSession = useCallback(async (userId: string): Promise<boolean> => {
    SupabaseService.setCurrentMemberId(userId);
    const bundle = SupabaseService.loadMemberFullBundle(userId);
    setUser(bundle.user);
    const routine = bundle.currentRoutine || getRecommendedRoutine(bundle.user.goal, bundle.user.equipment);
    setCurrentRoutine(routine);
    setLoggedMeals(bundle.meals || []);
    setCompletedWorkouts(bundle.completedWorkouts || []);
    setWeightHistory(
      bundle.weightHistory.length > 0
        ? bundle.weightHistory
        : (bundle.user.weightKg ? [{ date: new Date().toISOString().split('T')[0], weightKg: bundle.user.weightKg }] : [])
    );
    setCurrentWaterL(typeof bundle.water === 'number' ? bundle.water : 0);
    setCurrentSteps(typeof bundle.steps === 'number' ? bundle.steps : 0);
    setSleepHoursLogged(0);
    setNotifications(
      bundle.notifications.length > 0
        ? bundle.notifications
        : buildDefaultNotifications(bundle.user, routine)
    );
    if (bundle.user.language === 'am' || bundle.user.language === 'en') {
      setLanguageState(bundle.user.language);
    }
    return bundle.onboardingCompleted;
  }, [buildDefaultNotifications]);

  const signOutMember = useCallback(async () => {
    if (user.id) {
      SupabaseService.saveMemberFullBundle(user.id, {
        profile: user,
        currentRoutine,
        meals: loggedMeals,
        completedWorkouts,
        weightHistory,
        water: currentWaterL,
        steps: currentSteps,
        notifications,
      });
    }
    SupabaseService.setCurrentMemberId(null);
    AuthService.logout();
    if (isRealSupabaseConfigured) {
      supabase.auth.signOut().catch(() => {});
    }
    setUser(DEFAULT_USER);
    setCurrentRoutine(DEFAULT_ROUTINES[0]);
    setLoggedMeals([]);
    setCurrentWaterL(0);
    setCurrentSteps(0);
    setSleepHoursLogged(0);
    setWeightHistory([]);
    setCompletedWorkouts([]);
    setRoute('auth');
  }, [user, currentRoutine, loggedMeals, completedWorkouts, weightHistory, currentWaterL, currentSteps, notifications, setRoute]);

  const resetAllDataToDefaults = useCallback(() => {
    if (user.id) {
      UserScopedStorage.removeItem(user.id, 'profile');
      UserScopedStorage.removeItem(user.id, 'onboarding_completed');
      UserScopedStorage.removeItem(user.id, 'current_routine');
      UserScopedStorage.removeItem(user.id, 'meals');
      UserScopedStorage.removeItem(user.id, 'workouts');
      UserScopedStorage.removeItem(user.id, 'weight_logs');
      UserScopedStorage.removeItem(user.id, 'water_logged');
      UserScopedStorage.removeItem(user.id, 'steps_logged');
      UserScopedStorage.removeItem(user.id, 'notifications');
      SupabaseService.updateMemberData(user.id, { onboardingCompleted: false });
    }
    setUser(DEFAULT_USER);
    setCurrentRoutine(DEFAULT_ROUTINES[0]);
    setLoggedMeals([]);
    setCurrentWaterL(0);
    setCurrentSteps(0);
    setSleepHoursLogged(0);
    setWeightHistory([]);
    setCompletedWorkouts([]);
    setRoute('auth');
  }, [user.id, setRoute]);

  return (
    <AppContext.Provider
      value={{
        route,
        setRoute,
        user,
        updateUserProfile,
        completeOnboarding,
        language,
        setLanguage,
        t,
        getLocalizedExercise,
        getLocalizedMuscle,
        getLocalizedRoutine,
        getLocalizedDay,
        getLocalizedMealType,
        getLocalizedGoal,
        getLocalizedNotification,
        dailyGoals,
        toggleGoalCompletion,
        overallProgressPercent,
        completedGoalsCount,
        inProgressGoalsCount,
        remainingGoalsCount,
        greeting,
        motivationalSubtitle,
        weeklyActivity,
        currentStreak,
        bestStreak,
        successRate,
        successRateDiff,
        isWeeklyDetailsOpen,
        setIsWeeklyDetailsOpen,
        currentRoutine,
        activeWorkout,
        completedWorkouts,
        startWorkout,
        pauseWorkout,
        resumeWorkout,
        completeSet,
        skipExercise,
        finishActiveWorkout,
        cancelActiveWorkout,
        startRestTimer,
        cancelRestTimer,
        loggedMeals,
        currentWaterL,
        addWaterL,
        setWaterL,
        logMeal,
        logFoodItem,
        updateMeal,
        deleteMeal,
        consumedCalories,
        consumedProteinG,
        consumedCarbsG,
        consumedFatG,
        consumedFiberG,
        consumedSugarG,
        weightHistory,
        logWeight,
        currentSteps,
        addSteps,
        setSteps,
        sleepHoursLogged,
        setSleepHoursLogged,
        logSleep,
        notifications,
        unreadNotificationCount,
        markNotificationsAsRead,
        isQuickLogOpen,
        setIsQuickLogOpen,
        quickLogTab,
        setQuickLogTab,
        openQuickLog,
        isJossyAIOpen,
        setIsJossyAIOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isSummaryModalOpen,
        setIsSummaryModalOpen,
        latestCompletedWorkout,
        playBeep,
        resetAllDataToDefaults,
        loadUserSession,
        signOutMember,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
