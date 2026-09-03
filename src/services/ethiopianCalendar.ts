/**
 * Ethiopian Calendar Conversion Service
 * Accurate mathematical conversion between Gregorian and Ethiopian (Ge'ez) Calendar.
 * 
 * Ethiopian Calendar has 12 months of 30 days each, plus a 13th month (Pagume) of 5 or 6 days.
 * The Ethiopian new year (Enkutatash) falls on September 11 (or September 12 in a Gregorian leap year).
 * All gym membership cycles operate in Africa/Addis_Ababa timezone with 30-day recurring periods.
 */

export interface EthiopianDate {
  year: number;
  month: number; // 1 - 13
  day: number;   // 1 - 30 (1 - 6 for Pagume)
  monthNameEn: string;
  monthNameAm: string;
  formattedEn: string;
  formattedAm: string;
  season?: string;
  dayNameAm?: string;
  dayNameEn?: string;
  isLeapYear?: boolean;
}

export const ETHIOPIAN_MONTHS_EN = [
  'Meskerem',
  'Tikimt',
  'Hidar',
  'Tahsas',
  'Tir',
  'Yekatit',
  'Megabit',
  'Miazia',
  'Ginbot',
  'Sene',
  'Hamle',
  'Nehase',
  'Pagume',
];

export const ETHIOPIAN_MONTHS_AM = [
  'መስከረም',
  'ጥቅምት',
  'ኅዳር',
  'ታኅሣሥ',
  'ጥር',
  'የካቲት',
  'መጋቢት',
  'ሚያዝያ',
  'ግንቦት',
  'ሰኔ',
  'ሐምሌ',
  'ነሐሴ',
  'ጳጉሜ',
];

export const AMHARIC_DAYS = ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'];
export const ENGLISH_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Returns list of Ethiopian months with English, Amharic, and max days
 */
export function getEthiopianMonthsList(year: number = 2018) {
  const isLeap = isEthiopianLeapYear(year);
  return ETHIOPIAN_MONTHS_EN.map((nameEn, idx) => {
    const monthNum = idx + 1;
    const maxDays = monthNum === 13 ? (isLeap ? 6 : 5) : 30;
    return {
      monthNumber: monthNum,
      nameEn,
      nameAm: ETHIOPIAN_MONTHS_AM[idx],
      maxDays,
    };
  });
}

/**
 * Checks if an Ethiopian year is a leap year (Pagume has 6 days)
 * An Ethiopian year is leap if (year + 1) % 4 === 0, i.e. year % 4 === 3 (e.g. 2011, 2015, 2019, 2023)
 */
export function isEthiopianLeapYear(ethYear: number): boolean {
  return ethYear % 4 === 3;
}

/**
 * Converts a Gregorian Date to Julian Day Number (JDN)
 */
export function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * Converts Julian Day Number (JDN) to Gregorian Date (year, month 1-12, day 1-31)
 */
export function jdnToGregorian(jdn: number): { year: number; month: number; day: number } {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);

  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);

  return { year, month, day };
}

/**
 * Converts Ethiopian Date (year, month 1-13, day 1-30) to Julian Day Number (JDN)
 */
export function ethiopianToJDN(year: number, month: number, day: number): number {
  return (
    1723856 +
    1461 * Math.floor(year / 4) +
    365 * (year % 4) +
    30 * (month - 1) +
    day -
    1
  );
}

/**
 * Converts Ethiopian Date to Gregorian Date Object (Canonical representation)
 */
export function ethiopianToGregorian(year: number, month: number, day: number): Date {
  // Validate inputs
  const safeYear = Math.max(1, Math.floor(year));
  const safeMonth = Math.max(1, Math.min(13, Math.floor(month)));
  const maxDay = safeMonth === 13 ? (isEthiopianLeapYear(safeYear) ? 6 : 5) : 30;
  const safeDay = Math.max(1, Math.min(maxDay, Math.floor(day)));

  const jdn = ethiopianToJDN(safeYear, safeMonth, safeDay);
  const greg = jdnToGregorian(jdn);

  // Return Date constructed in UTC midnight to avoid local browser timezone shifts
  const utcDate = new Date(Date.UTC(greg.year, greg.month - 1, greg.day, 12, 0, 0, 0));
  return utcDate;
}

/**
 * Converts a Gregorian Date to an Ethiopian Date
 */
export function gregorianToEthiopian(date: Date = new Date()): EthiopianDate {
  // Use UTC or local date safely
  const gYear = date.getUTCFullYear();
  const gMonth = date.getUTCMonth() + 1; // 1-12
  const gDay = date.getUTCDate();
  const dayOfWeek = date.getUTCDay();

  // Julian Day Number calculation for Gregorian date
  const jdn = gregorianToJDN(gYear, gMonth, gDay);

  // Conversion of JDN to Ethiopian Date
  const r = (jdn - 1723856) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);

  const ethYear =
    4 * Math.floor((jdn - 1723856) / 1461) +
    Math.floor(r / 365) -
    Math.floor(r / 1460);
  const ethMonth = Math.floor(n / 30) + 1;
  const ethDay = (n % 30) + 1;

  const safeMonthIdx = Math.max(0, Math.min(12, ethMonth - 1));
  const monthNameEn = ETHIOPIAN_MONTHS_EN[safeMonthIdx] || 'Meskerem';
  const monthNameAm = ETHIOPIAN_MONTHS_AM[safeMonthIdx] || 'መስከረም';

  // Season in Ethiopia (Bega: Sep-Feb, Belg: Mar-May, Kiremt: Jun-Aug)
  let season = 'በጋ (Bega)';
  if (ethMonth >= 7 && ethMonth <= 9) season = 'በልግ (Belg)';
  else if (ethMonth >= 10 && ethMonth <= 13) season = 'ክረምት (Kiremt)';

  return {
    year: ethYear,
    month: ethMonth,
    day: ethDay,
    monthNameEn,
    monthNameAm,
    formattedEn: `${monthNameEn} ${ethDay}, ${ethYear} E.C.`,
    formattedAm: `${monthNameAm} ${ethDay}፣ ${ethYear} ዓ.ም`,
    season,
    dayNameAm: AMHARIC_DAYS[dayOfWeek],
    dayNameEn: ENGLISH_DAYS[dayOfWeek],
    isLeapYear: isEthiopianLeapYear(ethYear),
  };
}

/**
 * Returns localized string of current Ethiopian date
 */
export function getFormattedEthiopianDate(language: 'en' | 'am' = 'en', date: Date = new Date()): string {
  const eth = gregorianToEthiopian(date);
  return language === 'am' ? eth.formattedAm : eth.formattedEn;
}

/**
 * Formats a given Ethiopian date object or ISO string to Ethiopian display
 */
export function formatEthiopianFromISO(isoDateString: string, language: 'en' | 'am' = 'en'): string {
  try {
    const d = new Date(isoDateString);
    if (isNaN(d.getTime())) return isoDateString;
    const eth = gregorianToEthiopian(d);
    return language === 'am' ? eth.formattedAm : eth.formattedEn;
  } catch {
    return isoDateString;
  }
}

/**
 * Returns quick Ethiopian now object with formatted helpers
 */
export function getEthiopianNow(date: Date = new Date()) {
  const eth = gregorianToEthiopian(date);
  return {
    ...eth,
    formatted: `${eth.monthNameAm} ${eth.day} (${eth.monthNameEn} ${eth.day})`,
  };
}

/**
 * Formats dual calendar (Ethiopian + Gregorian)
 */
export function formatDualCalendar(date: Date = new Date()) {
  const eth = gregorianToEthiopian(date);
  const gregFormatted = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    ethiopianDateFormatted: eth.formattedAm,
    ethiopianDateFormattedEn: eth.formattedEn,
    gregorianFormatted: gregFormatted,
  };
}

/**
 * Adds exactly 30 calendar days to a Gregorian date for a recurring membership cycle
 */
export function add30Days(date: Date | string): Date {
  const base = typeof date === 'string' ? new Date(date) : new Date(date.getTime());
  const result = new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000);
  return result;
}

/**
 * Adds arbitrary days to a date
 */
export function addDays(date: Date | string, days: number): Date {
  const base = typeof date === 'string' ? new Date(date) : new Date(date.getTime());
  return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
}

/**
 * Calculates days remaining or overdue between reference date (now) and due date
 * All calculations use UTC midnight to ensure exact daylight/timezone independence
 */
export function calculateMembershipDaysRemaining(dueDate: Date | string, now: Date = new Date()): {
  daysRemaining: number;
  daysOverdue: number;
  isDueToday: boolean;
  isOverdue: boolean;
} {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  
  const dueUtc = Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate());
  const nowUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  
  const diffTime = dueUtc - nowUtc;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return {
      daysRemaining: diffDays,
      daysOverdue: 0,
      isDueToday: false,
      isOverdue: false,
    };
  } else if (diffDays === 0) {
    return {
      daysRemaining: 0,
      daysOverdue: 0,
      isDueToday: true,
      isOverdue: false,
    };
  } else {
    return {
      daysRemaining: 0,
      daysOverdue: Math.abs(diffDays),
      isDueToday: false,
      isOverdue: true,
    };
  }
}

/**
 * Converts standard Date to ISO Date String YYYY-MM-DD
 */
export function toISODateString(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

