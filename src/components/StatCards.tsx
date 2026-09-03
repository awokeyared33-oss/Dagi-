import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export const StatCards: React.FC = () => {
  const { currentStreak, bestStreak, user, t, language, setIsWeeklyDetailsOpen, openQuickLog, setRoute } = useApp();

  // Determine second metric based on user's goal
  const getSecondMetric = () => {
    switch (user.goal) {
      case 'lose_weight':
      case 'burn_fat':
      case 'improve_endurance':
        return {
          label: language === 'am' ? 'የካርዲዮ ዒላማ' : 'Cardio Target',
          value: `${user.targetCardioMinWeek || 90}m`,
          subtitle: language === 'am' ? 'ሳምንታዊ ዒላማ 🏃' : 'Weekly Target 🏃',
          color: '#00D09E',
          action: () => openQuickLog('steps'),
        };
      case 'build_muscle':
        return {
          label: language === 'am' ? 'የስልጠና ትኩረት' : 'Training Focus',
          value: language === 'am' ? 'ጡንቻ ማሳደግ' : 'Hypertrophy',
          subtitle: language === 'am' ? `${user.workoutDaysPerWeek || 5} ቀናት / ሳምንት 💪` : `${user.workoutDaysPerWeek || 5} Days / Week 💪`,
          color: '#5C71F3',
          action: () => setRoute('train'),
        };
      case 'get_stronger':
        return {
          label: language === 'am' ? 'የስልጠና ትኩረት' : 'Training Focus',
          value: language === 'am' ? 'ጥንካሬ' : 'Strength',
          subtitle: language === 'am' ? 'ቀጣይነት ያለው ክብደት መጨመር ⚡' : 'Progressive Overload ⚡',
          color: '#FFB020',
          action: () => setRoute('train'),
        };
      case 'improve_fitness':
      default:
        return {
          label: language === 'am' ? 'የእንቅስቃሴ ዒላማ' : 'Active Target',
          value: `${(user.targetDailySteps || 8000).toLocaleString()}`,
          subtitle: language === 'am' ? 'የዕለት የእርምጃ ግብ 👣' : 'Daily Steps Target 👣',
          color: '#9D5CE5',
          action: () => openQuickLog('steps'),
        };
    }
  };

  const secondMetric = getSecondMetric();

  return (
    <div className="mx-4 grid grid-cols-2 gap-3.5 mt-4">
      {/* Left Card: Current Streak */}
      <motion.div
        id="current-streak-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsWeeklyDetailsOpen(true)}
        className="bg-white rounded-[20px] p-4 shadow-sm border-l-4 border-[#FFB020] border-t border-r border-b border-slate-100/80 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
      >
        <div>
          <span className="text-[10px] font-bold text-[#8E8E9F] uppercase tracking-wider block">
            {t('current_streak')}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-[#1E1E2D]">
              {currentStreak > 0 ? currentStreak : (language === 'am' ? 'ጀምር' : 'Start')}
            </span>
            <span className="text-xs font-bold text-[#1E1E2D]">
              {currentStreak > 0 ? (currentStreak === 1 ? (language === 'am' ? 'ቀን' : 'Day') : (language === 'am' ? 'ቀናት' : 'Days')) : (language === 'am' ? 'ዛሬ' : 'Today')}
            </span>
          </div>
        </div>

        <p className="text-[10px] text-[#8E8E9F] mt-2 font-medium">
          {bestStreak > 0
            ? (language === 'am' ? `ከፍተኛ፦ ${bestStreak} ቀናት 🔥` : `Best: ${bestStreak} Days 🔥`)
            : (language === 'am' ? 'የመጀመሪያውን ልምምድ ይመዝግቡ 🚀' : 'Log your 1st workout 🚀')}
        </p>
      </motion.div>

      {/* Right Card: Dynamic Goal-Based Metric */}
      <motion.div
        id="goal-metric-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        whileTap={{ scale: 0.98 }}
        onClick={secondMetric.action}
        className="bg-white rounded-[20px] p-4 shadow-sm border-l-4 border-t border-r border-b border-slate-100/80 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
        style={{ borderLeftColor: secondMetric.color }}
      >
        <div>
          <span className="text-[10px] font-bold text-[#8E8E9F] uppercase tracking-wider block">
            {secondMetric.label}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-[#1E1E2D]">
              {secondMetric.value}
            </span>
          </div>
        </div>

        <p className="text-[10px] font-semibold mt-2" style={{ color: secondMetric.color }}>
          {secondMetric.subtitle}
        </p>
      </motion.div>
    </div>
  );
};

