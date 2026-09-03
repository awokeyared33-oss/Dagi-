import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2 } from 'lucide-react';

export const WeeklyOverviewCard: React.FC = () => {
  const { weeklyActivity, t, language, getLocalizedDay } = useApp();
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames[new Date().getDay()];
  });
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const getDayInitial = (day: string) => {
    if (language === 'am') {
      switch (day) {
        case 'Mon':
          return 'ሰ';
        case 'Tue':
          return 'ማ';
        case 'Wed':
          return 'ረ';
        case 'Thu':
          return 'ሐ';
        case 'Fri':
          return 'ዓ';
        case 'Sat':
          return 'ቅ';
        case 'Sun':
          return 'እ';
        default:
          return day.charAt(0);
      }
    }
    switch (day) {
      case 'Mon':
        return 'M';
      case 'Tue':
        return 'T';
      case 'Wed':
        return 'W';
      case 'Thu':
        return 'T';
      case 'Fri':
        return 'F';
      case 'Sat':
        return 'S';
      case 'Sun':
        return 'S';
      default:
        return day.charAt(0);
    }
  };

  return (
    <>
      <motion.section
        id="weekly-overview-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mx-4 bg-white rounded-[20px] p-4 sm:p-5 shadow-sm border border-slate-100 mt-4"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-[#1E1E2D]">{t('weekly_overview_title')}</h3>
          <button
            onClick={() => setIsDetailsOpen(true)}
            className="text-[10px] font-bold text-[#5C71F3] uppercase tracking-wider cursor-pointer hover:underline"
          >
            {t('details_btn')}
          </button>
        </div>

        {/* 7-Bar Chart distributed cleanly across mobile width */}
        <div className="grid grid-cols-7 gap-1.5 items-end h-20 pt-1">
          {weeklyActivity.map((day, idx) => {
            const isSelected = selectedDay === day.dayOfWeek;
            const barHeightPercent = day.completionPercentage > 0 ? Math.max(15, Math.min(100, day.completionPercentage)) : 0;

            return (
              <div
                key={day.dayOfWeek}
                onClick={() => {
                  setSelectedDay(day.dayOfWeek);
                }}
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                {/* Bar Container */}
                <div className="w-2.5 bg-[#F1F3FF] rounded-full h-14 relative overflow-hidden flex flex-col justify-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${barHeightPercent}%` }}
                    transition={{ duration: 0.7, delay: idx * 0.06, ease: 'easeOut' }}
                    className={`w-full rounded-full transition-colors ${
                      isSelected ? 'bg-[#5C71F3]' : 'bg-[#5C71F3]/90'
                    }`}
                  />
                </div>

                {/* Day Label */}
                <span
                  className={`text-[10px] font-semibold transition-colors ${
                    isSelected ? 'text-[#5C71F3] font-bold' : 'text-[#8E8E9F]'
                  }`}
                >
                  {getDayInitial(day.dayOfWeek)}
                </span>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Weekly Details Bottom Sheet */}
      <AnimatePresence>
        {isDetailsOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailsOpen(false)}
              className="fixed inset-0 bg-black/45 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative w-full max-w-[430px] bg-white rounded-t-3xl p-5 shadow-2xl z-10 max-h-[85vh] flex flex-col pb-safe"
            >
              <div className="w-12 h-1.5 bg-[#E2E4F0] rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[17px] font-extrabold text-[#1E1E2D]">
                    {language === 'am' ? 'የሳምንታዊ አፈጻጸም ዝርዝር' : 'Weekly Consistency Breakdown'}
                  </h3>
                  <p className="text-[12px] text-[#8E8E9F]">
                    {language === 'am' ? 'ዒላማ፦ 4-5 የስልጠና ቀናት / ሳምንት' : 'Target: 4-5 Training Days/Week'}
                  </p>
                </div>
                <button
                  onClick={() => setIsDetailsOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#F5F6FA] flex items-center justify-center text-[#8E8E9F] hover:text-[#1E1E2D]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 overflow-y-auto no-scrollbar">
                {weeklyActivity.map((day) => (
                  <div
                    key={day.dayOfWeek}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                      day.dayOfWeek === selectedDay
                        ? 'bg-[#EEF1FE] border-[#5C71F3]/40'
                        : 'bg-white border-[#EBEBF4]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#E8EAF2] flex flex-col items-center justify-center font-bold">
                        <span className="text-[10px] text-[#8E8E9F] uppercase">{getLocalizedDay(day.dayOfWeek)}</span>
                        <span className="text-[12px] text-[#1E1E2D]">{day.completionPercentage}%</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-bold text-[#1E1E2D]">
                            {day.dayOfWeek === 'Wed' ? t('today_title') : `${getLocalizedDay(day.dayOfWeek)} ${language === 'am' ? 'ክፍለ-ጊዜ' : 'Session'}`}
                          </span>
                          {day.completionPercentage >= 80 && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00D09E]" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#8E8E9F]">
                          <span className={day.workoutDone ? 'text-[#5C71F3] font-bold' : ''}>
                            {day.workoutDone ? (language === 'am' ? '✓ ልምምድ' : '✓ Workout') : (language === 'am' ? 'የእረፍት ቀን' : 'Rest Day')}
                          </span>
                          <span>•</span>
                          <span className={day.caloriesReached ? 'text-[#FFB020] font-bold' : ''}>
                            {day.caloriesReached ? (language === 'am' ? '✓ ካሎሪ' : '✓ Calories') : (language === 'am' ? 'ዝቅተኛ ካሎሪ' : 'Low Cal')}
                          </span>
                          <span>•</span>
                          <span className={day.waterReached ? 'text-[#00D09E] font-bold' : ''}>
                            {day.waterReached ? (language === 'am' ? '✓ ውኃ' : '✓ Water') : (language === 'am' ? 'ዝቅተኛ ውኃ' : 'Low Water')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-12 h-2 bg-[#E2E6FA] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#5C71F3] rounded-full"
                        style={{ width: `${day.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
