import { UserProfile, FitnessProfile, UserGoal, ExperienceLevel, EquipmentType } from '../types';
import { SafeStorage } from './storageAdapter';

export class StorageService {
  private static PREFIX = 'jossy_gym_';

  static getItem<T>(key: string, fallback: T): T {
    try {
      const data = SafeStorage.getItem(this.PREFIX + key);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(`StorageService read error for ${key}:`, e);
    }
    return fallback;
  }

  static setItem<T>(key: string, value: T): void {
    try {
      SafeStorage.setItem(this.PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn(`StorageService write error for ${key}:`, e);
    }
  }

  static removeItem(key: string): void {
    try {
      SafeStorage.removeItem(this.PREFIX + key);
    } catch (e) {
      console.warn(`StorageService remove error for ${key}:`, e);
    }
  }

  static clear(): void {
    try {
      SafeStorage.clear();
    } catch (e) {
      console.warn('StorageService clear error:', e);
    }
  }
}

export class AuthService {
  static getCurrentSession(): { isAuthenticated: boolean; email?: string; name?: string } {
    return StorageService.getItem('auth_session', { isAuthenticated: false });
  }

  static login(email: string, name?: string): { success: boolean; user: { email: string; name: string } } {
    const existingProfile = StorageService.getItem<FitnessProfile | null>('fitness_profile', null);
    const resolvedName = name || (existingProfile?.fullName) || email.split('@')[0];
    const session = { isAuthenticated: true, email, name: resolvedName };
    StorageService.setItem('auth_session', session);
    return { success: true, user: { email, name: resolvedName } };
  }

  static logout(): void {
    StorageService.removeItem('auth_session');
  }
}

export class FitnessCalculator {
  // Mifflin-St Jeor Formula
  static calculateBMR(gender: string, weightKg: number, heightCm: number, age: number): number {
    const isFemale = gender === 'female';
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    return Math.round(isFemale ? base - 161 : base + 5);
  }

  static calculateTDEE(bmr: number, activityLevel: string): number {
    let multiplier = 1.45; // default moderate
    switch (activityLevel) {
      case 'sedentary':
        multiplier = 1.2;
        break;
      case 'light':
        multiplier = 1.375;
        break;
      case 'moderate':
        multiplier = 1.55;
        break;
      case 'very_active':
        multiplier = 1.725;
        break;
    }
    return Math.round(bmr * multiplier);
  }

  static calculateNutritionTargets(
    goal: UserGoal,
    weightKg: number,
    tdee: number
  ) {
    let targetCalories = tdee;
    let proteinPerKg = 2.0;
    let fatRatio = 0.25;

    switch (goal) {
      case 'lose_weight':
      case 'burn_fat':
        targetCalories = Math.max(1400, tdee - 450);
        proteinPerKg = 2.2;
        fatRatio = 0.25;
        break;
      case 'build_muscle':
        targetCalories = tdee + 300;
        proteinPerKg = 2.2;
        fatRatio = 0.25;
        break;
      case 'get_stronger':
        targetCalories = tdee + 150;
        proteinPerKg = 2.1;
        fatRatio = 0.28;
        break;
      case 'improve_endurance':
      case 'improve_fitness':
      default:
        targetCalories = tdee;
        proteinPerKg = 1.8;
        fatRatio = 0.25;
        break;
    }

    const targetProteinG = Math.round(weightKg * proteinPerKg);
    const targetFatG = Math.round((targetCalories * fatRatio) / 9);
    const targetCarbsG = Math.max(
      50,
      Math.round((targetCalories - (targetProteinG * 4 + targetFatG * 9)) / 4)
    );
    const targetWaterL = Math.max(2.5, Math.round((weightKg * 0.038) * 10) / 10);
    const targetFiberG = Math.round((targetCalories / 1000) * 14); // Standard scientific RDA: 14g per 1000 kcal
    const targetSugarG = Math.round((targetCalories * 0.08) / 4); // Max 8% of energy from simple sugars
    
    // Cardio target in minutes per week based on goal
    let targetCardioMinWeek = 120;
    let targetDailySteps = 8000;

    switch (goal) {
      case 'lose_weight':
      case 'burn_fat':
        targetCardioMinWeek = 150;
        targetDailySteps = 10000;
        break;
      case 'build_muscle':
        targetCardioMinWeek = 90;
        targetDailySteps = 7500;
        break;
      case 'get_stronger':
        targetCardioMinWeek = 60;
        targetDailySteps = 7000;
        break;
      case 'improve_endurance':
        targetCardioMinWeek = 180;
        targetDailySteps = 12000;
        break;
      case 'improve_fitness':
      default:
        targetCardioMinWeek = 120;
        targetDailySteps = 8000;
        break;
    }

    return {
      targetCalories,
      targetProteinG,
      targetCarbsG,
      targetFatG,
      targetFiberG,
      targetSugarG,
      targetWaterL,
      targetCardioMinWeek,
      targetDailySteps,
    };
  }

  static calculateBMI(weightKg: number, heightCm: number): { bmi: number; category: string } {
    const heightM = heightCm / 100;
    const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;
    let category = 'Normal';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 25 && bmi < 30) category = 'Overweight';
    else if (bmi >= 30) category = 'Obese';
    return { bmi, category };
  }
}

export class NotificationService {
  static async requestPermission(): Promise<'granted' | 'denied' | 'default'> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const status = await Notification.requestPermission();
        StorageService.setItem('notification_permission', status);
        return status;
      } catch (e) {
        console.warn('Web notification request failed:', e);
      }
    }
    return 'default';
  }

  static getPermissionStatus(): 'granted' | 'denied' | 'default' {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return StorageService.getItem<'granted' | 'denied' | 'default'>('notification_permission', 'default');
  }

  static showSystemNotification(title: string, options?: NotificationOptions) {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          icon: '/dagi-logo.jpg',
          badge: '/dagi-logo.jpg',
          ...options,
        });
      } catch (e) {
        console.warn('Could not fire native notification:', e);
      }
    }
  }

  static generateWelcomeMessage(name: string, goal: UserGoal, lang: 'en' | 'am' = 'en'): { title: string; message: string } {
    const firstName = name.trim().split(' ')[0] || (lang === 'am' ? 'ስፖርተኛ' : 'Athlete');
    
    if (lang === 'am') {
      const goalAm: Record<UserGoal, string> = {
        build_muscle: 'ጡንቻ ለመገንባት',
        lose_weight: 'ክብደት ለመቀነስ',
        burn_fat: 'ስብ ለማቃጠል',
        get_stronger: 'ብርታት ለመጨመር',
        improve_endurance: 'የሰውነት ጥንካሬ ለማሳደግ',
        improve_fitness: 'አጠቃላይ ጤንነት ለማሻሻል',
      };
      return {
        title: `እንኳን ወደ Dagi Fitness በደህና መጡ 👋`,
        message: `ሰላም ${firstName} 👋 ወደ Dagi Fitness እንኳን ደህና መጡ። እቅድዎ ${goalAm[goal] || 'ጡንቻ ለመገንባት'} ዝግጁ ነው። ስለ ምግብዎ ማንኛውንም ጥያቄ ካለዎት ዳጊ ፊትነስ AIን (Dagi Fitness AI) ይጠይቁ።`,
      };
    }

    const goalEn: Record<UserGoal, string> = {
      build_muscle: 'build muscle and maximize fullness',
      lose_weight: 'burn fat and reach your target weight',
      burn_fat: 'sculpt a lean, athletic physique',
      get_stronger: 'increase your compound lift strength',
      improve_endurance: 'boost stamina and athletic endurance',
      improve_fitness: 'elevate your daily vitality and functional fitness',
    };

    return {
      title: `Welcome to Dagi Fitness 👋`,
      message: `Hi ${firstName} 👋 Welcome to Dagi Fitness. Your customized plan is ready to help you ${goalEn[goal] || 'build muscle'}. If you have questions about your nutrition, ask Dagi Fitness AI.`,
    };
  }

  static generateMorningNotification(name: string, routineTitle: string, isRestDay: boolean, lang: 'en' | 'am' = 'en'): { title: string; message: string } {
    const firstName = name.trim().split(' ')[0] || (lang === 'am' ? 'ስፖርተኛ' : 'Athlete');

    if (lang === 'am') {
      if (isRestDay) {
        return {
          title: `እንደምን አደሩ ${firstName} ☀️`,
          message: `እንደምን አደሩ ${firstName} ☀️ ዛሬ የእረፍት ቀን ነው። ሰውነትዎ ጠንክሮ እንዲመለስ ጊዜ ይስጡት።`,
        };
      }
      return {
        title: `እንደምን አደሩ ${firstName} ☀️`,
        message: `እንደምን አደሩ ${firstName} ☀️ የዛሬው ልምምድ ${routineTitle} ነው። ልምምድዎ በዳጊ ፊትነስ (Dagi Fitness) ዝግጁ ነው። የዛሬውን ቀን ውጤታማ እናድርገው!`,
      };
    }

    if (isRestDay) {
      return {
        title: `Good morning ${firstName} ☀️`,
        message: `Good morning ${firstName} ☀️ Today is a recovery day. Give your body time to rebuild so you can come back stronger.`,
      };
    }

    return {
      title: `Good morning ${firstName} ☀️`,
      message: `Good morning ${firstName} ☀️ Today's workout is ${routineTitle}. Your session is ready at Dagi Fitness. Let's make today count.`,
    };
  }

  static generateNightNotification(name: string, workoutCompleted: boolean, lang: 'en' | 'am' = 'en'): { title: string; message: string } {
    const firstName = name.trim().split(' ')[0] || (lang === 'am' ? 'ስፖርተኛ' : 'Athlete');

    if (lang === 'am') {
      if (workoutCompleted) {
        return {
          title: `ደህና እደሩ ${firstName} 🌙`,
          message: `ደህና እደሩ ${firstName} 🌙 ቀኑ እንዴት ነበር? በእንቅልፍ ወቅት ሰውነትዎ ያገግማል። ጥሩ እረፍት ያድርጉ እና ለነገ ዝግጁ ይሁኑ።`,
        };
      }
      return {
        title: `ደህና እደሩ ${firstName} 🌙`,
        message: `${firstName}፣ የዛሬው ቀን እንደታሰበው ባይሄድም ምንም ችግር የለውም። ማገገምም ወሳኝ ነው። ነገ አዲስ እድል ነው!`,
      };
    }

    if (workoutCompleted) {
      return {
        title: `Good night ${firstName} 🌙`,
        message: `Good night ${firstName} 🌙 How was your day? Your body recovers while you sleep. Get some rest and be ready for tomorrow.`,
      };
    }

    return {
      title: `Good night ${firstName} 🌙`,
      message: `${firstName}, today didn't go as planned — that's okay. Recovery matters too. Tomorrow is another opportunity.`,
    };
  }
}

// ==========================================
// PERSONAL TRAINER ACADEMY SERVICE
// ==========================================

import { TrainerUserProgress, TrainerQuizAttempt, TrainerCertificate, TrainerQuizQuestion } from '../types';

export class TrainerAcademyService {
  private static STORAGE_PREFIX = 'jossy_trainer_academy_';

  static getProgress(userId: string): TrainerUserProgress {
    const key = `${this.STORAGE_PREFIX}progress_${userId || 'guest'}`;
    const defaultProgress: TrainerUserProgress = {
      userId: userId || 'guest',
      enrolledDate: new Date().toISOString(),
      currentUnitId: 1,
      completedUnits: [],
      unitHighestScores: {},
      totalQuizzesPassed: 0,
      courseCompleted: false,
    };
    return StorageService.getItem<TrainerUserProgress>(key, defaultProgress);
  }

  static saveProgress(userId: string, progress: TrainerUserProgress): void {
    const key = `${this.STORAGE_PREFIX}progress_${userId || 'guest'}`;
    StorageService.setItem(key, progress);
  }

  static submitQuiz(
    userId: string,
    unitId: number,
    chosenAnswers: number[],
    questions: TrainerQuizQuestion[]
  ): {
    attempt: TrainerQuizAttempt;
    passed: boolean;
    score: number;
    maxScore: number;
    nextUnitUnlocked: boolean;
    courseNewlyCompleted: boolean;
  } {
    const maxScore = questions.length;
    let score = 0;

    for (let i = 0; i < questions.length; i++) {
      if (chosenAnswers[i] === questions[i].correctOptionIndex) {
        score++;
      }
    }

    const passed = score >= 12; // 12 out of 15 (80%)
    const progress = this.getProgress(userId);

    const prevBest = progress.unitHighestScores[unitId] || 0;
    if (score > prevBest) {
      progress.unitHighestScores[unitId] = score;
    }

    let nextUnitUnlocked = false;
    let courseNewlyCompleted = false;

    if (passed && !progress.completedUnits.includes(unitId)) {
      progress.completedUnits.push(unitId);
      progress.totalQuizzesPassed = progress.completedUnits.length;
      nextUnitUnlocked = true;

      // Advance currentUnitId if completing the current frontier
      if (unitId >= progress.currentUnitId && unitId < 20) {
        progress.currentUnitId = unitId + 1;
      }

      // Check if course completed (all 20 units passed)
      if (progress.completedUnits.length >= 20 && !progress.courseCompleted) {
        progress.courseCompleted = true;
        progress.completionDate = new Date().toISOString();
        progress.certificateId = `DAGI-CPT-${Date.now().toString(36).toUpperCase()}`;
        courseNewlyCompleted = true;
      }
    }

    this.saveProgress(userId, progress);

    const attempt: TrainerQuizAttempt = {
      id: `attempt-${Date.now()}`,
      userId: userId || 'guest',
      unitId,
      score,
      maxScore,
      passed,
      userAnswers: chosenAnswers,
      completedAt: new Date().toISOString(),
    };

    // Save attempt history
    const attemptsKey = `${this.STORAGE_PREFIX}attempts_${userId || 'guest'}_unit_${unitId}`;
    const attempts = StorageService.getItem<TrainerQuizAttempt[]>(attemptsKey, []);
    attempts.unshift(attempt);
    StorageService.setItem(attemptsKey, attempts.slice(0, 10));

    return {
      attempt,
      passed,
      score,
      maxScore,
      nextUnitUnlocked,
      courseNewlyCompleted,
    };
  }

  static getCertificate(userId: string, learnerName: string): TrainerCertificate | null {
    const progress = this.getProgress(userId);
    if (!progress.courseCompleted) return null;

    let totalScore = 0;
    for (let i = 1; i <= 20; i++) {
      totalScore += progress.unitHighestScores[i] || 12;
    }
    const overallPercent = Math.round((totalScore / (20 * 15)) * 100);

    return {
      certificateId: progress.certificateId || `DAGI-CPT-${userId.slice(0, 6).toUpperCase()}`,
      userId,
      learnerName: learnerName || 'Certified Fitness Professional',
      courseTitle: 'Personal Trainer Academy Mastery Program',
      issueDate: progress.completionDate || new Date().toISOString(),
      issueDateEth: '2018 ዓ.ም',
      totalUnitsCompleted: 20,
      overallScorePercent: overallPercent,
      verificationCode: `VERIFY-${(progress.certificateId || 'DAGI').replace(/[^A-Z0-9]/g, '')}`,
      issuingBody: 'Dagi Fitness Sports Science & Fitness Academy',
    };
  }
}
