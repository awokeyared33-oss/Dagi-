export type AppRoute =
  | 'splash'
  | 'language'
  | 'onboarding'
  | 'auth'
  | 'assessment'
  | 'plan-generating'
  | 'plan-ready'
  | 'dashboard'
  | 'train'
  | 'food-tracker'
  | 'nutrition'
  | 'progress'
  | 'profile'
  | 'admin';

export type UserGoal =
  | 'lose_weight'
  | 'build_muscle'
  | 'burn_fat'
  | 'get_stronger'
  | 'improve_endurance'
  | 'improve_fitness';

export type Gender = 'male' | 'female' | 'other';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type EquipmentType =
  | 'gym'
  | 'home'
  | 'dumbbells'
  | 'machines'
  | 'barbell'
  | 'resistance_bands'
  | 'bodyweight'
  | 'mixed';

export interface BodyMeasurements {
  waistCm?: number;
  chestCm?: number;
  armsCm?: number;
  hipsCm?: number;
  bodyFatPct?: number;
}

export interface NotificationPreferences {
  morningReminders: boolean;
  nightReminders: boolean;
  aiUpdates: boolean;
}

export interface FitnessProfile {
  fullName: string;
  firstName: string;
  email: string;
  language: 'en' | 'am';
  goal: UserGoal;
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg?: number;
  experienceLevel: ExperienceLevel;
  trainingDaysPerWeek: number;
  preferredWorkoutDuration: number;
  equipment: EquipmentType[];
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active';
  waterIntake: 'less_1L' | '1_2L' | '2_3L' | '3L_plus';
  dietPreference: 'no_pref' | 'high_protein' | 'balanced' | 'vegetarian' | 'vegan' | 'other';
  allergies: string[];
  sleepHours: number;
  bodyMeasurements?: BodyMeasurements;
}

export interface UserProfile {
  id?: string;
  onboardingCompleted?: boolean;
  membershipTier?: string;
  name: string;
  email: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  targetWeightKg?: number;
  goal: UserGoal;
  experience: ExperienceLevel;
  workoutFrequencyDays: number;
  workoutDurationMin: number;
  equipment: EquipmentType[];
  language: 'en' | 'am';
  unitSystem: 'metric' | 'imperial';
  joinedDate: string;
  avatarUrl?: string;
  dietPreference?: 'no_pref' | 'high_protein' | 'balanced' | 'vegetarian' | 'vegan' | 'other';
  allergies?: string[];
  notificationPreferences?: NotificationPreferences;
  calculatedBmr: number;
  calculatedTdee: number;
  targetCalories: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
  targetFiberG?: number;
  targetSugarG?: number;
  targetWaterL: number;
  targetDailySteps: number;
  targetSleepHours: number;
  targetCardioMinWeek: number;
  hasSeenWelcomeNotification?: boolean;
}

export interface DailyGoalItem {
  id: string;
  type: 'workout' | 'nutrition' | 'hydration' | 'steps' | 'recovery' | 'protein' | 'cardio';
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  bgColor: string;
  isCompleted: boolean;
  currentValue: number;
  targetValue: number;
  unit: string;
}

export interface DayActivity {
  dayOfWeek: string; // 'Mon', 'Tue', ...
  date: string;
  completionPercentage: number;
  workoutDone: boolean;
  workoutTitle?: string;
  isPlannedWorkoutDay?: boolean;
  isRestDay?: boolean;
  caloriesConsumed: number;
  caloriesTarget: number;
  waterConsumedL: number;
  waterTargetL: number;
  stepsCount: number;
  stepsTarget: number;
}

export interface ExerciseSet {
  setNumber: number;
  reps: number;
  weightKg: number;
  isCompleted: boolean;
  prevReps?: number;
  prevWeightKg?: number;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  secondaryMuscles?: string[];
  equipment: string;
  instructions: string[];
  trainingTip?: string;
  safety?: string;
  tempo?: string;
  sets: ExerciseSet[];
  defaultRestSec: number;
  imageUrl?: string;
  animationType?:
    | 'chest_press'
    | 'squat'
    | 'pullup'
    | 'shoulder_press'
    | 'deadlift'
    | 'bicep_curl'
    | 'plank'
    | 'pushup'
    | 'lunge'
    | 'row'
    | 'lateral_raise'
    | 'tricep_dips'
    | 'core_crunch';
  phaseDescriptions?: {
    start: string;
    movement: string;
    peak: string;
    finish: string;
  };
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  subtitle: string;
  category: 'Push' | 'Pull' | 'Legs' | 'Full Body' | 'Upper' | 'Lower' | 'Cardio & Core';
  targetMuscles: string[];
  estimatedDurationMin: number;
  difficulty: ExperienceLevel;
  intensity?: 'Moderate' | 'High' | 'Progressive Overload' | 'Conditioning';
  exercises: Exercise[];
  equipmentRequired: string[];
  cardioTarget?: {
    activity: string;
    durationMin: number;
    intensity: string;
    frequencyPerWeek: number;
    tip: string;
  };
}

export interface CompletedWorkout {
  id: string;
  routineTitle: string;
  date: string;
  durationMinutes: number;
  totalVolumeKg: number;
  totalSetsCompleted: number;
  totalCaloriesBurned: number;
  exerciseCount: number;
}

export interface FoodItem {
  id: string;
  nameEn: string;
  nameAm: string;
  servingSize: string;
  servingGrams: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sugarG: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  isEthiopianTraditional?: boolean;
  isFastingFriendly?: boolean;
  isAffordable?: boolean;
  commonServing?: string;
  aliases?: string[];
  emoji?: string;
}

export interface JossyAIFoodBreakdown {
  foodItem: FoodItem;
  quantity: number;
  portionLabel: string;
  calculatedCalories: number;
  calculatedProtein: number;
  calculatedCarbs: number;
  calculatedFat: number;
  calculatedFiber: number;
  calculatedSugar: number;
}

export interface JossyAIMessage {
  id: string;
  sender: 'user' | 'jossy_ai';
  text: string;
  timestamp: string;
  isTyping?: boolean;
  statusText?: string;
  isAmbiguous?: boolean;
  ambiguousOptions?: { label: string; query: string }[];
  isUnknownFood?: boolean;
  foodBreakdowns?: JossyAIFoodBreakdown[];
  totalCalories?: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFat?: number;
  totalFiber?: number;
  isLogged?: boolean;
  userProteinTarget?: number;
  userCurrentProtein?: number;
  userCalorieTarget?: number;
  userCurrentCalories?: number;
}

export interface PlannedMealItem {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  title: string;
  titleAm: string;
  portionDescription: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sugarG: number;
  primaryFoodId: string;
  foods: {
    foodItem: FoodItem;
    servingMultiplier: number;
  }[];
}

export interface LoggedMeal {
  id: string;
  foodId: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servings: number;
  portionDescription: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  sugarG?: number;
  timestamp: string;
}

export interface WeightRecord {
  date: string;
  weightKg: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'workout' | 'nutrition' | 'streak' | 'general' | 'welcome' | 'night' | 'membership' | 'membership_due' | 'membership_paid';
  isRead: boolean;
  cycleNumber?: number;
  metadata?: Record<string, any>;
}

export type MembershipStatusType = 'active' | 'paused' | 'suspended' | 'expired';
export type PaymentStatusType = 'paid' | 'payment_due' | 'overdue';

export interface EthiopianDateComponents {
  year: number;
  month: number;
  day: number;
}

export interface MembershipCycle {
  id: string;
  userId: string;
  cycleNumber: number;
  startDate: string; // Canonical ISO 'YYYY-MM-DD'
  startDateEth: string; // e.g. 'መስከረም 1፣ 2018 ዓ.ም'
  endDate: string; // Canonical ISO 'YYYY-MM-DD' (30 days from startDate)
  endDateEth: string; // e.g. 'ጥቅምት 1፣ 2018 ዓ.ም'
  dueDate: string; // Canonical ISO 'YYYY-MM-DD'
  dueDateEth: string;
  status: 'active' | 'completed' | 'overdue' | 'paused';
  paymentStatus: PaymentStatusType;
  amount: number; // e.g. 1000 ETB
  currency: string; // 'ETB'
  paidAt?: string; // ISO timestamp when paid
  paidAtEth?: string;
  paymentMethod?: 'cash' | 'telebirr' | 'cbe_birr' | 'bank_transfer' | 'card' | 'other';
  recordedBy?: string; // e.g. 'admin@dagifitness.com'
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MembershipPayment {
  id: string;
  userId: string;
  membershipCycleId: string;
  cycleNumber: number;
  amount: number;
  currency: string; // 'ETB'
  paymentDate: string; // ISO timestamp
  paymentDateEth: string; // e.g. 'መስከረም 1፣ 2018 ዓ.ም'
  dueDate: string;
  dueDateEth: string;
  paymentMethod: 'cash' | 'telebirr' | 'cbe_birr' | 'bank_transfer' | 'card' | 'other';
  recordedBy: string;
  notes?: string;
  createdAt: string;
}

export interface MembershipSummary {
  userId: string;
  memberName: string;
  memberEmail: string;
  memberPhone?: string;
  memberTier: 'VIP' | 'Standard' | 'Elite Athlete';
  tier?: 'VIP' | 'Standard' | 'Elite Athlete';
  membershipStatus: MembershipStatusType;
  paymentStatus: PaymentStatusType;
  monthlyFee: number;
  membershipStartDate: string; // Canonical ISO
  membershipStartDateEth: string;
  startDate?: string;
  startDateEth?: string;
  currentCycleNumber: number;
  cycleNumber?: number;
  currentCycleStartDate: string;
  currentCycleStartDateEth: string;
  currentCycleEndDate: string;
  currentCycleEndDateEth: string;
  endDate?: string;
  endDateEth?: string;
  nextPaymentDueDate: string;
  nextPaymentDueDateEth: string;
  dueDate?: string;
  dueDateEth?: string;
  daysRemaining: number;
  daysOverdue: number;
  isDueToday: boolean;
  isOverdue: boolean;
  lastPaymentDate?: string;
  lastPaymentDateEth?: string;
  lastPaymentAmount?: number;
  totalPaymentsCount: number;
  totalPaidAmount: number;
  isPaused: boolean;
}

// ==========================================
// PERSONAL TRAINER ACADEMY & KNOWLEDGE TYPES
// ==========================================

export interface TrainerLesson {
  id: string;
  unitId: number;
  lessonNumber: number;
  title: string;
  titleAm?: string;
  estimatedReadMin: number;
  learningObjectives: string[];
  summary: string;
  contentSections: {
    heading: string;
    body: string;
    bullets?: string[];
    highlightBox?: {
      title: string;
      text: string;
      type: 'tip' | 'warning' | 'science' | 'formula';
    };
  }[];
  trainerTips: string[];
  commonMistakes: string[];
  keyTakeaways: string[];
  professionalTerminology?: { term: string; definition: string }[];
  realWorldExample?: string;
}

export interface TrainerQuizQuestion {
  id: string;
  unitId: number;
  questionNumber: number;
  questionText: string;
  questionTextAm?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  topicRef?: string;
}

export interface TrainerUnit {
  id: number;
  unitNumber: number;
  title: string;
  titleAm: string;
  subtitle: string;
  iconName: string;
  category: 'Fundamentals' | 'Hypertrophy & Strength' | 'Nutrition & Metabolism' | 'Programming & Assessment' | 'Coaching & Safety';
  overview: string;
  lessonsCount: number;
  lessons: TrainerLesson[];
  quizQuestions: TrainerQuizQuestion[]; // Exactly 15 questions
  passingScoreThreshold: number; // 12 (out of 15)
}

export interface TrainerQuizAttempt {
  id: string;
  userId: string;
  unitId: number;
  score: number;
  maxScore: number;
  passed: boolean;
  userAnswers: number[]; // index of chosen option for each of the 15 questions
  completedAt: string;
}

export interface TrainerUserProgress {
  userId: string;
  enrolledDate: string;
  currentUnitId: number; // 1-20
  completedUnits: number[]; // List of passed unit IDs (e.g. [1, 2])
  unitHighestScores: Record<number, number>; // unitId -> highest score achieved (e.g. {1: 14, 2: 13})
  totalQuizzesPassed: number;
  courseCompleted: boolean;
  completionDate?: string;
  certificateId?: string;
}

export interface TrainerCertificate {
  certificateId: string;
  userId: string;
  learnerName: string;
  courseTitle: string;
  issueDate: string;
  issueDateEth: string;
  totalUnitsCompleted: number;
  overallScorePercent: number;
  verificationCode: string;
  issuingBody: string;
}

export interface FitnessKnowledgeArticle {
  id: string;
  title: string;
  titleAm?: string;
  category:
    | 'anatomy'
    | 'hypertrophy'
    | 'strength'
    | 'nutrition'
    | 'ethiopian_food'
    | 'weight_loss'
    | 'muscle_gain'
    | 'recovery'
    | 'cardio'
    | 'mobility'
    | 'programming'
    | 'safety'
    | 'general_fitness';
  keywords: string[];
  summary: string;
  detailedContent: string;
  practicalApplication: string;
  coachingCue?: string;
  commonQuestions?: { q: string; a: string }[];
}

