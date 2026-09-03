import React from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Droplets, Footprints, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DailyGoalItem } from '../types';

export const TodayGoalsList: React.FC = () => {
  const { dailyGoals, toggleGoalCompletion, setRoute, openQuickLog, t, getLocalizedGoal } = useApp();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Dumbbell':
        return (
          <svg className="w-5 h-5 text-[#5C71F3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        );
      case 'Utensils':
        return (
          <svg className="w-5 h-5 text-[#FFB020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
        );
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-[#5C71F3]" />;
      case 'Footprints':
        return <Footprints className="w-5 h-5 text-[#00D09E]" />;
      case 'Moon':
        return <Moon className="w-5 h-5 text-[#9D5CE5]" />;
      default:
        return <Dumbbell className="w-5 h-5 text-[#5C71F3]" />;
    }
  };

  const getBgColor = (goal: DailyGoalItem) => {
    if (goal.type === 'workout') return '#F1F3FF';
    if (goal.type === 'nutrition') return '#FFF7ED';
    if (goal.type === 'hydration') return '#F1F3FF';
    if (goal.type === 'steps') return '#E6FAF5';
    return '#F5F0FF';
  };

  const handleGoalItemClick = (goal: DailyGoalItem) => {
    if (goal.type === 'workout') {
      setRoute('train');
    } else if (goal.type === 'nutrition' || goal.type === 'protein') {
      setRoute('nutrition');
    } else if (goal.type === 'hydration') {
      openQuickLog('water');
    } else if (goal.type === 'steps' || goal.type === 'cardio') {
      openQuickLog('steps');
    } else if (goal.type === 'recovery') {
      openQuickLog('sleep');
    } else {
      openQuickLog('options');
    }
  };

  return (
    <section className="px-4 space-y-3 pb-28 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-[#1E1E2D]">{t('todays_goals')}</h3>
        <span
          onClick={() => openQuickLog('options')}
          className="text-[10px] font-bold text-[#5C71F3] uppercase cursor-pointer hover:underline"
        >
          {t('view_all')}
        </span>
      </div>

      <div className="space-y-2.5">
        {dailyGoals.map((goal, idx) => {
          const locGoal = getLocalizedGoal(goal);
          return (
            <motion.div
              key={goal.id}
              id={`goal-item-${goal.type}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 + idx * 0.04 }}
              className="bg-white rounded-[20px] p-3 shadow-sm border border-slate-100/80 flex items-center justify-between"
            >
              {/* Left: Icon & Text */}
              <div
                onClick={() => handleGoalItemClick(goal)}
                className="flex items-center gap-3 flex-1 min-w-0 pr-2 cursor-pointer"
              >
                {/* Icon Container */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: getBgColor(goal) }}
                >
                  {getIcon(goal.iconName)}
                </div>

                {/* Title & Subtitle */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#1E1E2D] truncate">{locGoal.title}</h4>
                  <p className="text-[10px] text-[#8E8E9F] mt-0.5 truncate">{locGoal.subtitle}</p>
                </div>
              </div>

              {/* Right: Round Checkbox */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGoalCompletion(goal.id);
                }}
                className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                  goal.isCompleted
                    ? 'border-2 border-[#00D09E] bg-[#00D09E] text-white shadow-xs'
                    : 'border-2 border-slate-200 bg-transparent hover:border-[#5C71F3]'
                }`}
                aria-label={`Toggle ${locGoal.title}`}
              >
                {goal.isCompleted && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
