import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export const OverallProgressCard: React.FC = () => {
  const {
    dailyGoals,
    completedGoalsCount,
    consumedCalories,
    overallProgressPercent,
    user,
    currentWaterL,
    completedWorkouts,
    setRoute,
    openQuickLog,
    setIsWeeklyDetailsOpen,
    t,
  } = useApp();

  const calPercent = user.targetCalories > 0
    ? Math.min(100, Math.round((consumedCalories / user.targetCalories) * 100))
    : 0;

  // SVG Circular Progress Math (100x100 box, radius 42, circumference ~263.89)
  const radius = 42;
  const circumference = 2 * Math.PI * radius; // ~263.89
  const progressOffset = circumference - (overallProgressPercent / 100) * circumference;

  const isWorkoutDoneToday = completedWorkouts.some(
    (w) => w.date === new Date().toISOString().split('T')[0]
  );

  return (
    <motion.section
      id="overall-progress-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-4 bg-white rounded-[20px] p-4 sm:p-5 shadow-sm border border-slate-100 flex items-center gap-4.5"
    >
      {/* Circular Progress Gauge (Strict 100x100 flex-shrink:0) */}
      <button
        onClick={() => setRoute('nutrition')}
        className="relative w-[100px] h-[100px] flex items-center justify-center shrink-0 cursor-pointer group"
        style={{ flex: '0 0 100px' }}
        title="View Calorie & Nutrition breakdown"
      >
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#F1F3FF"
            strokeWidth="9"
            fill="transparent"
          />
          {/* Animated Progress Arc */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#5C71F3"
            strokeWidth="9"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: progressOffset }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Percentage & Label */}
        <div className="absolute flex flex-col items-center justify-center">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-extrabold text-[#1E1E2D] leading-none group-hover:scale-105 transition-transform"
          >
            {overallProgressPercent}%
          </motion.span>
          <span className="text-[10px] uppercase font-bold text-[#8E8E9F] tracking-wider mt-1">
            {t('today_title')}
          </span>
        </div>
      </button>

      {/* Today's Metrics Grid */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <h3 className="text-sm font-bold text-[#1E1E2D] mb-1">{t('today_metrics')}</h3>
        <div className="grid grid-cols-2 gap-y-2 gap-x-3">
          <button
            onClick={() => setRoute('train')}
            className="flex flex-col text-left cursor-pointer p-1 rounded-lg hover:bg-[#F1F3FF] transition-colors"
          >
            <span className="text-[10px] text-[#8E8E9F] uppercase font-medium">{t('workout_label')}</span>
            <span className="text-xs font-bold text-[#5C71F3]">
              {isWorkoutDoneToday ? '1/1' : '0/1'}
            </span>
          </button>

          <button
            onClick={() => setRoute('nutrition')}
            className="flex flex-col text-left cursor-pointer p-1 rounded-lg hover:bg-[#E6FAF5] transition-colors"
          >
            <span className="text-[10px] text-[#8E8E9F] uppercase font-medium">{t('calories_label')}</span>
            <span className="text-xs font-bold text-[#00D09E]">
              {calPercent}%
            </span>
          </button>

          <button
            onClick={() => openQuickLog('water')}
            className="flex flex-col text-left cursor-pointer p-1 rounded-lg hover:bg-[#EEF1FE] transition-colors"
          >
            <span className="text-[10px] text-[#8E8E9F] uppercase font-medium">{t('water_label')}</span>
            <span className="text-xs font-bold text-[#5C71F3]">
              {currentWaterL.toFixed(1)}L
            </span>
          </button>

          <button
            onClick={() => setIsWeeklyDetailsOpen(true)}
            className="flex flex-col text-left cursor-pointer p-1 rounded-lg hover:bg-[#F5ECFD] transition-colors"
          >
            <span className="text-[10px] text-[#8E8E9F] uppercase font-medium">{t('goals_label')}</span>
            <span className="text-xs font-bold text-[#9D5CE5]">
              {completedGoalsCount}/{dailyGoals.length}
            </span>
          </button>
        </div>
      </div>
    </motion.section>
  );
};
