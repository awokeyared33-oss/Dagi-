import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, Flame, Dumbbell, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WorkoutSummaryModal: React.FC = () => {
  const {
    isSummaryModalOpen,
    setIsSummaryModalOpen,
    latestCompletedWorkout,
    currentStreak,
    user,
    language,
    t,
    getLocalizedRoutine,
    setRoute,
  } = useApp();

  const isAmharic = language === 'am';

  useEffect(() => {
    if (isSummaryModalOpen) {
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#5C71F3', '#00D09E', '#FFB020', '#6377F7'],
        });
      } catch (e) {
        // Fallback safely
      }
    }
  }, [isSummaryModalOpen]);

  if (!isSummaryModalOpen || !latestCompletedWorkout) return null;

  const firstName = user?.name ? user.name.trim().split(' ')[0] : (isAmharic ? 'ስፖርተኛ' : 'Athlete');

  const handleClose = (target: 'train' | 'dashboard') => {
    setIsSummaryModalOpen(false);
    setRoute(target);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-[390px] bg-white rounded-3xl p-6 shadow-2xl z-10 text-center border border-[#EFEFF8]"
        >
          {/* Trophy Badge */}
          <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-[#FFB020] to-[#FFD166] text-white mx-auto flex items-center justify-center shadow-lg shadow-[#FFB020]/35 mb-3.5">
            <Trophy className="w-9 h-9 stroke-[2.5]" />
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5C71F3] bg-[#EEF1FE] px-3 py-1 rounded-full">
            {t('workoutRecordedBadge')}
          </span>

          <h2 className="text-[22px] font-black text-[#1E1E2D] tracking-tight mt-2 leading-tight">
            {isAmharic ? `ጎበዝ፣ ${firstName}!` : `Great work, ${firstName}!`}
          </h2>
          <p className="text-[13px] text-[#8E8E9F] font-medium mt-0.5">
            {getLocalizedRoutine(latestCompletedWorkout.routineTitle)}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2.5 my-4 text-left">
            <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8E8E9F]">
                <Clock className="w-3.5 h-3.5 text-[#5C71F3]" />
                <span>{t('durationLabelUpper')}</span>
              </div>
              <p className="text-[17px] font-black text-[#1E1E2D] mt-0.5">
                {latestCompletedWorkout.durationMinutes} {t('unitMin')}
              </p>
            </div>

            <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8E8E9F]">
                <Dumbbell className="w-3.5 h-3.5 text-[#00D09E]" />
                <span>{t('totalVolumeLabelUpper')}</span>
              </div>
              <p className="text-[17px] font-black text-[#1E1E2D] mt-0.5">
                {latestCompletedWorkout.totalVolumeKg.toLocaleString()} {t('unitKg')}
              </p>
            </div>

            <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8E8E9F]">
                <Flame className="w-3.5 h-3.5 text-[#FF5C5C]" />
                <span>{t('caloriesBurnedLabelUpper')}</span>
              </div>
              <p className="text-[17px] font-black text-[#1E1E2D] mt-0.5">
                {latestCompletedWorkout.totalCaloriesBurned} {t('unitKcal')}
              </p>
            </div>

            <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8E8E9F]">
                <Award className="w-3.5 h-3.5 text-[#FFB020]" />
                <span>{t('setsCompletedLabelUpper')}</span>
              </div>
              <p className="text-[17px] font-black text-[#1E1E2D] mt-0.5">
                {latestCompletedWorkout.totalSetsCompleted} {t('setsUnit')}
              </p>
            </div>
          </div>

          {/* Streak Boost Banner */}
          <div className="p-3 bg-[#FFF9EE] rounded-2xl border border-[#FFB020]/25 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-left">
              <Flame className="w-5 h-5 text-[#FFB020]" />
              <div>
                <span className="text-[12px] font-bold text-[#1E1E2D] block">{t('consistencyStreak')}</span>
                <span className="text-[11px] text-[#8E8E9F]">
                  {isAmharic ? `የ ${currentStreak} ቀናት ተከታታይ ልምምድ` : `${currentStreak} Day Training Streak`}
                </span>
              </div>
            </div>
            <span className="text-[13px] font-black text-[#FFB020]">{isAmharic ? '🔥 +1 ቀን' : '🔥 +1 Day'}</span>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2">
            <button
              onClick={() => handleClose('train')}
              className="w-full h-12 rounded-2xl bg-[#5C71F3] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-lg shadow-[#5C71F3]/25 cursor-pointer hover:bg-[#4B62EB] transition-colors"
            >
              <span>{t('backToTrainingPlan')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleClose('dashboard')}
              className="w-full h-11 rounded-2xl bg-[#F5F6FA] text-[#1E1E2D] font-bold text-[13px] flex items-center justify-center cursor-pointer hover:bg-[#ECEEF5] transition-colors"
            >
              {t('viewDashboardBtn')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
