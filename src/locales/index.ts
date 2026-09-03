import { en, type TranslationKey } from './en';
import { am } from './am';
import type { DailyGoalItem, NotificationItem } from '../types';

export type Language = 'en' | 'am';

export { en, am };
export type { TranslationKey };

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en,
  am,
};

/**
 * Universal translation interpolation function with key normalization
 */
export function t(
  key: TranslationKey | string,
  params?: Record<string, string | number>,
  language: Language = 'en'
): string {
  if (!key) return '';
  const dict = (translations[language] || translations.en) as Record<string, string>;
  const enDict = translations.en as Record<string, string>;

  const strKey = String(key);
  // 1. Direct match
  let text = dict[strKey] || enDict[strKey];

  // 2. Snake to camelCase if not found (e.g. todays_goals -> todaysGoals, today_metrics -> todaysMetrics)
  if (!text && strKey.includes('_')) {
    const camel = strKey.toLowerCase().replace(/_([a-z0-9])/g, (_, g) => g.toUpperCase());
    text = dict[camel] || enDict[camel];
  }

  // 3. Screaming Snake Case (e.g. WORKOUT_LABEL -> workoutLabel or workout_label)
  if (!text) {
    const lowerSnake = strKey.toLowerCase();
    text = dict[lowerSnake] || enDict[lowerSnake];
  }

  // 4. Fallback: if not found, format human-friendly English/Amharic words rather than showing raw key
  if (!text) {
    // If the key has underscores, humanize it: "todays_goals" -> "Today's Goals"
    const words = strKey
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    text = words;
  }

  if (params) {
    for (const [paramKey, value] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
    }
  }

  return text;
}

/**
 * Gender-aware and time-aware greeting
 */
export function getLocalizedGreeting(
  name: string,
  gender: string = 'other',
  language: Language = 'en'
): string {
  const hour = new Date().getHours();
  const safeName = name && name.trim() ? name.trim() : (language === 'am' ? 'አትሌት' : 'Athlete');

  if (language === 'am') {
    if (hour < 12) {
      if (gender === 'female') return `እንደምን አደርሽ፣ ${safeName} 👋`;
      if (gender === 'male') return `እንደምን አደርክ፣ ${safeName} 👋`;
      return `እንደምን አደሩ፣ ${safeName} 👋`;
    } else if (hour < 17) {
      if (gender === 'female') return `እንደምን ዋልሽ፣ ${safeName} 👋`;
      if (gender === 'male') return `እንደምን ዋልክ፣ ${safeName} 👋`;
      return `እንደምን ዋሉ፣ ${safeName} 👋`;
    } else {
      if (gender === 'female') return `እንደምን አመሸሽ፣ ${safeName} 👋`;
      if (gender === 'male') return `እንደምን አመሸህ፣ ${safeName} 👋`;
      return `እንደምን አመሹ፣ ${safeName} 👋`;
    }
  }

  // English
  if (hour < 12) {
    return `Good morning, ${safeName} 👋`;
  } else if (hour < 17) {
    return `Good afternoon, ${safeName} 👋`;
  } else {
    return `Good evening, ${safeName} 👋`;
  }
}

/**
 * Muscle group localization mapping
 */
export const MUSCLE_TRANSLATIONS: Record<string, { en: string; am: string }> = {
  Chest: { en: 'Chest', am: 'ደረት' },
  Back: { en: 'Back', am: 'ጀርባ' },
  Shoulders: { en: 'Shoulders', am: 'ትከሻ' },
  Biceps: { en: 'Biceps', am: 'ባይሴፕስ (የፊት እጅ)' },
  Triceps: { en: 'Triceps', am: 'ትራይሴፕስ (የኋላ እጅ)' },
  Legs: { en: 'Legs', am: 'እግር' },
  Glutes: { en: 'Glutes', am: 'ዳሌ' },
  Abs: { en: 'Abs & Core', am: 'የሆድ ጡንቻ' },
  Calves: { en: 'Calves', am: 'ባት' },
  Cardio: { en: 'Cardio', am: 'ካርዲዮ' },
  'Full Body': { en: 'Full Body', am: 'ሙሉ ሰውነት' },
  'Upper Body': { en: 'Upper Body', am: 'የላይኛው ሰውነት' },
  'Lower Body': { en: 'Lower Body', am: 'የታችኛው ሰውነት' },
  Quads: { en: 'Quadriceps', am: 'የፊት ጭን' },
  Hamstrings: { en: 'Hamstrings', am: 'የኋላ ጭን' },
  Lats: { en: 'Lats', am: 'የጀርባ ክንፍ' },
  Traps: { en: 'Traps', am: 'የትከሻ ጀርባ' },
  Forearms: { en: 'Forearms', am: 'ክንድ' },
};

export function getLocalizedMuscle(muscle: string, language: Language = 'en'): string {
  if (!muscle) return '';
  const match = MUSCLE_TRANSLATIONS[muscle];
  if (match) return match[language] || match.en;
  return muscle;
}

/**
 * Exercise Name Localization mapping
 */
export const EXERCISE_TRANSLATIONS: Record<string, { en: string; am: string }> = {
  'Barbell Bench Press': { en: 'Barbell Bench Press', am: 'የባርቤል ደረት ፕሬስ' },
  'Incline Dumbbell Press': { en: 'Incline Dumbbell Press', am: 'ያጋደለ የዳምቤል ደረት ፕሬስ' },
  'Cable Chest Flyes': { en: 'Cable Chest Flyes', am: 'የኬብል ደረት መክፈቻ' },
  'Dips for Chest': { en: 'Dips for Chest', am: 'የደረት ዲፕስ' },
  'Overhead Tricep Extension': { en: 'Overhead Tricep Extension', am: 'የትራይሴፕስ ወደ ላይ መዘርጋት' },
  'Cable Rope Pushdowns': { en: 'Cable Rope Pushdowns', am: 'የኬብል ገመድ ትራይሴፕስ ፑሽዳውን' },
  'Barbell Deadlift': { en: 'Barbell Deadlift', am: 'የባርቤል ዴድሊፍት' },
  'Wide-Grip Lat Pulldowns': { en: 'Wide-Grip Lat Pulldowns', am: 'ሰፋ ያለ የጀርባ መሳቢያ (Lat Pulldown)' },
  'Chest-Supported Row': { en: 'Chest-Supported Row', am: 'የደረት ድጋፍ ያለው የጀርባ መሳቢያ' },
  'Seated Cable Rows': { en: 'Seated Cable Rows', am: 'ተቀምጦ የኬብል ጀርባ መሳቢያ' },
  'Standing Barbell Bicep Curl': { en: 'Standing Barbell Bicep Curl', am: 'ቆሞ የባርቤል ባይሴፕስ ከርል' },
  'Incline Dumbbell Bicep Curl': { en: 'Incline Dumbbell Bicep Curl', am: 'ያጋደለ የዳምቤል ባይሴፕስ ከርል' },
  'Barbell Back Squats': { en: 'Barbell Back Squats', am: 'የባርቤል ጀርባ ስኳት' },
  'Romanian Deadlifts': { en: 'Romanian Deadlifts', am: 'የሮማኒያ ዴድሊፍት (RDL)' },
  'Bulgarian Split Squats': { en: 'Bulgarian Split Squats', am: 'የቡልጋሪያን ስፕሊት ስኳት' },
  'Leg Press Machine': { en: 'Leg Press Machine', am: 'የእግር ፕሬስ ማሽን' },
  'Standing Calf Raises': { en: 'Standing Calf Raises', am: 'ቆሞ የባት ማንሻ' },
  'Hanging Leg Raises': { en: 'Hanging Leg Raises', am: 'ተሰቅሎ እግር ማንሳት' },
  'Standing Overhead Barbell Press': { en: 'Standing Overhead Barbell Press', am: 'ቆሞ የባርቤል ትከሻ ፕሬስ' },
  'Dumbbell Lateral Raises': { en: 'Dumbbell Lateral Raises', am: 'የዳምቤል የጎን ትከሻ ማንሻ' },
  'Reverse Pec Deck Rear Delts': { en: 'Reverse Pec Deck Rear Delts', am: 'የኋላ ትከሻ ፔክ ዴክ' },
  'Face Pulls with Cable': { en: 'Face Pulls with Cable', am: 'የኬብል የፊት መሳቢያ (Face Pulls)' },
  'Incline Barbell Bench Press': { en: 'Incline Barbell Bench Press', am: 'ያጋደለ የባርቤል ደረት ፕሬስ' },
  'Dumbbell Flat Bench Press': { en: 'Dumbbell Flat Bench Press', am: 'የዳምቤል ጠፍጣፋ ደረት ፕሬስ' },
  'Skull Crushers (EZ Bar)': { en: 'Skull Crushers (EZ Bar)', am: 'የራስ ቅል ትራይሴፕስ ክረሸርስ' },
  'Pull-ups / Chin-ups': { en: 'Pull-ups / Chin-ups', am: 'ተሰቅሎ መሳብ (Pull-ups)' },
  'Bent-Over Barbell Rows': { en: 'Bent-Over Barbell Rows', am: 'አጎንብሶ የባርቤል ጀርባ መሳቢያ' },
  'Dumbbell Hammer Curls': { en: 'Dumbbell Hammer Curls', am: 'የዳምቤል ሀመር ከርል' },
  'Goblet Squats': { en: 'Goblet Squats', am: 'የጎብሌት ስኳት' },
  'Walking Lunges': { en: 'Walking Lunges', am: 'የእግር መራመጃ ላንጅስ' },
  'Leg Curl Machine': { en: 'Leg Curl Machine', am: 'የእግር ከርል ማሽን' },
  'Seated Calf Raises': { en: 'Seated Calf Raises', am: 'ተቀምጦ የባት ማንሻ' },
  'Plank Hold': { en: 'Plank Hold', am: 'ፕላንክ መያዝ' },
  'Cable Crunch': { en: 'Cable Crunch', am: 'የኬብል ሆድ ክረንች' },
  'Push-ups': { en: 'Push-ups', am: 'ፑሽ-አፕ (መሬት ላይ መግፋት)' },
  'Dumbbell Shoulder Press': { en: 'Dumbbell Shoulder Press', am: 'የዳምቤል ትከሻ ፕሬስ' },
  'Band Pull-Apart': { en: 'Band Pull-Apart', am: 'የላስቲክ ገመድ መክፈቻ' },
  'Jump Rope': { en: 'Jump Rope', am: 'ገመድ ዝላይ' },
  'Incline Treadmill Walk': { en: 'Incline Treadmill Walk', am: 'ያጋደለ ትሬድሚል የእግር ጉዞ' },
  'Foam Rolling': { en: 'Full Body Foam Rolling', am: 'ሙሉ ሰውነት ፎም ሮሊንግ' },
};

export function getLocalizedExercise(name: string, language: Language = 'en'): string {
  if (!name) return '';
  const match = EXERCISE_TRANSLATIONS[name];
  if (match) return match[language] || match.en;
  return name;
}

/**
 * Routine / Workout day title translations
 */
export const ROUTINE_TRANSLATIONS: Record<string, { en: string; am: string }> = {
  'Chest & Triceps Hypertrophy': { en: 'Chest & Triceps Hypertrophy', am: 'የደረት እና ትራይሴፕስ ስልጠና' },
  'Back & Biceps Thickness': { en: 'Back & Biceps Thickness', am: 'የጀርባ እና ባይሴፕስ ስልጠና' },
  'Quad & Glute Power Development': { en: 'Quad & Glute Power Development', am: 'የጭን እና ዳሌ ስልጠና' },
  'Shoulders & Core Stability': { en: 'Shoulders & Core Stability', am: 'የትከሻ እና የሆድ ጡንቻ ስልጠና' },
  'Posterior Chain & Hamstring Focus': { en: 'Posterior Chain & Hamstring Focus', am: 'የጀርባ እና የኋላ እግር ስልጠና' },
  'Active Recovery & Mobility': { en: 'Active Recovery & Mobility', am: 'ንቁ ማገገሚያ እና ማፍታታት' },
  'Rest & Systemic Regeneration': { en: 'Rest & Systemic Regeneration', am: 'የእረፍት እና ሙሉ ማገገሚያ ቀን' },
  'Upper Body Power': { en: 'Upper Body Power', am: 'የላይኛው ሰውነት ጥንካሬ' },
  'Lower Body Strength': { en: 'Lower Body Strength', am: 'የታችኛው ሰውነት ጥንካሬ' },
  'Full Body Conditioning': { en: 'Full Body Conditioning', am: 'የሙሉ ሰውነት ቅልጥፍና' },
  'Push Day (Chest, Shoulders, Triceps)': { en: 'Push Day (Chest, Shoulders, Triceps)', am: 'የግፊት ቀን (ደረት፣ ትከሻ፣ ትራይሴፕስ)' },
  'Pull Day (Back, Biceps, Rear Delts)': { en: 'Pull Day (Back, Biceps, Rear Delts)', am: 'የመሳብ ቀን (ጀርባ፣ ባይሴፕስ፣ ኋላ ትከሻ)' },
  'Legs & Core Strength': { en: 'Legs & Core Strength', am: 'የእግር እና የሆድ ጥንካሬ' },
};

export function getLocalizedRoutine(title: string, language: Language = 'en'): string {
  if (!title) return '';
  const match = ROUTINE_TRANSLATIONS[title];
  if (match) return match[language] || match.en;
  return title;
}

/**
 * Days of the week localization
 */
export const DAYS_MAP: Record<string, { enShort: string; amShort: string; enFull: string; amFull: string }> = {
  Mon: { enShort: 'Mon', amShort: 'ሰኞ', enFull: 'Monday', amFull: 'ሰኞ' },
  Tue: { enShort: 'Tue', amShort: 'ማክ', enFull: 'Tuesday', amFull: 'ማክሰኞ' },
  Wed: { enShort: 'Wed', amShort: 'ረቡ', enFull: 'Wednesday', amFull: 'ረቡዕ' },
  Thu: { enShort: 'Thu', amShort: 'ሐሙ', enFull: 'Thursday', amFull: 'ሐሙስ' },
  Fri: { enShort: 'Fri', amShort: 'ዓር', enFull: 'Friday', amFull: 'ዓርብ' },
  Sat: { enShort: 'Sat', amShort: 'ቅዳ', enFull: 'Saturday', amFull: 'ቅዳሜ' },
  Sun: { enShort: 'Sun', amShort: 'እሁ', enFull: 'Sunday', amFull: 'እሁድ' },
  Monday: { enShort: 'Mon', amShort: 'ሰኞ', enFull: 'Monday', amFull: 'ሰኞ' },
  Tuesday: { enShort: 'Tue', amShort: 'ማክ', enFull: 'Tuesday', amFull: 'ማክሰኞ' },
  Wednesday: { enShort: 'Wed', amShort: 'ረቡ', enFull: 'Wednesday', amFull: 'ረቡዕ' },
  Thursday: { enShort: 'Thu', amShort: 'ሐሙ', enFull: 'Thursday', amFull: 'ሐሙስ' },
  Friday: { enShort: 'Fri', amShort: 'ዓር', enFull: 'Friday', amFull: 'ዓርብ' },
  Saturday: { enShort: 'Sat', amShort: 'ቅዳ', enFull: 'Saturday', amFull: 'ቅዳሜ' },
  Sunday: { enShort: 'Sun', amShort: 'እሁ', enFull: 'Sunday', amFull: 'እሁድ' },
};

export function getLocalizedDay(dayName: string, language: Language = 'en', short: boolean = false): string {
  const match = DAYS_MAP[dayName];
  if (!match) return dayName;
  if (language === 'am') {
    return short ? match.amShort : match.amFull;
  }
  return short ? match.enShort : match.enFull;
}

/**
 * Meal Type localization
 */
export function getLocalizedMealType(mealType: string, language: Language = 'en'): string {
  const key = mealType?.toLowerCase() || '';
  if (key === 'breakfast') return t('meal_breakfast', undefined, language);
  if (key === 'lunch') return t('meal_lunch', undefined, language);
  if (key === 'dinner') return t('meal_dinner', undefined, language);
  if (key === 'snack') return t('meal_snack', undefined, language);
  return mealType;
}

/**
 * Daily Goal item localization
 */
export function getLocalizedGoal(
  goal: DailyGoalItem,
  language: Language = 'en'
): { title: string; subtitle: string } {
  if (!goal) return { title: '', subtitle: '' };

  let title = goal.title;
  if (goal.type === 'workout') title = t('goal_workout', undefined, language);
  else if (goal.type === 'nutrition') title = t('goal_nutrition', undefined, language);
  else if (goal.type === 'hydration') title = t('goal_hydration', undefined, language);
  else if (goal.type === 'steps') title = t('goal_steps', undefined, language);
  else if (goal.type === 'recovery' || goal.id?.includes('sleep')) title = t('goal_recovery', undefined, language);

  return {
    title,
    subtitle: goal.subtitle,
  };
}

/**
 * Notification item localization
 */
export function getLocalizedNotification(
  item: NotificationItem,
  language: Language = 'en'
): { title: string; message: string; timestamp: string } {
  if (!item) return { title: '', message: '', timestamp: '' };

  if (language === 'am') {
    let title = item.title;
    let message = item.message;
    let timestamp = item.timestamp;

    if (timestamp === 'Today, 8:00 AM' || timestamp.includes('8:00 AM')) timestamp = 'ዛሬ፣ 2:00 ጠዋት';
    else if (timestamp === 'Today, 1:30 PM' || timestamp.includes('1:30 PM')) timestamp = 'ዛሬ፣ 7:30 ከሰዓት';
    else if (timestamp === 'Yesterday' || timestamp.includes('Yesterday')) timestamp = 'ትናንት';
    else if (timestamp === '2 hours ago' || timestamp.includes('2 hours')) timestamp = 'ከ 2 ሰዓት በፊት';
    else if (timestamp === 'Just now' || timestamp.includes('Just now')) timestamp = 'አሁን';

    if (item.type === 'workout' || item.title.includes('Workout') || item.title.includes('Push Day') || item.title.includes('Chest')) {
      if (item.title === "Today's Training Session" || item.title.includes('Training Session')) {
        title = 'የዛሬው የልምምድ ክፍለ-ጊዜ';
      }
      if (item.message.includes('Push Day') || item.message.includes('workout is ready')) {
        message = 'የዛሬው የስልጠና እቅድዎ ተዘጋጅቷል፤ በብርታት ይጀምሩ!';
      }
    } else if (item.type === 'nutrition' || item.title.includes('Hydration') || item.title.includes('Water')) {
      if (item.title.includes('Hydration') || item.title.includes('Water')) {
        title = 'የውሃ መጠጥ ማስታወሻ';
        message = 'ለሰውነትዎ እርጥበት እና ጥንካሬ በቂ ውሃ መጠጣትዎን አይርሱ።';
      }
    } else if (item.type === 'streak' || item.title.includes('Streak')) {
      title = 'የቀጣይነት ጭማሪ!';
      message = 'ድንቅ ነው! የቀጣይነት ጉዞዎን በጽናት እያስቀጠሉ ነው።';
    } else if (item.type === 'welcome' || item.title.includes('Welcome')) {
      title = 'እንኳን ወደ Dagi Fitness በደህና መጡ';
      message = 'የግል ስልጠና እና አመጋገብ ረዳትዎ ዝግጁ ነው።';
    }

    return { title, message, timestamp };
  }

  return {
    title: item.title
      ? item.title
          .replace(/Blue sky fitness/gi, 'Dagi Fitness')
          .replace(/Jossy Gym/gi, 'Dagi Fitness')
          .replace(/Jossi Gym/gi, 'Dagi Fitness')
          .replace(/Abrish Fitness/gi, 'Dagi Fitness')
      : '',
    message: item.message
      ? item.message
          .replace(/Blue sky fitness/gi, 'Dagi Fitness')
          .replace(/Jossy Gym/gi, 'Dagi Fitness')
          .replace(/Jossi Gym/gi, 'Dagi Fitness')
          .replace(/Abrish Fitness/gi, 'Dagi Fitness')
      : '',
    timestamp: item.timestamp,
  };
}

