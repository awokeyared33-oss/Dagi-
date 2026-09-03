import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Dumbbell, Clock, Target, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { Exercise, ExperienceLevel } from '../types';
import { ExerciseVisualGuide } from './ExerciseVisualGuide';
import { useApp } from '../context/AppContext';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  onClose: () => void;
  userExperience?: ExperienceLevel;
  previousWeightKg?: number;
  previousReps?: number;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose,
  userExperience = 'intermediate',
  previousWeightKg,
  previousReps,
}) => {
  const { language, t, getLocalizedExercise, getLocalizedMuscle } = useApp();
  if (!exercise) return null;

  const isAmharic = language === 'am';
  const hasHistory = previousWeightKg !== undefined && previousWeightKg > 0;

  const localizedExp = isAmharic
    ? userExperience === 'beginner'
      ? 'ጀማሪ'
      : userExperience === 'advanced'
      ? 'ከፍተኛ'
      : 'መካከለኛ'
    : userExperience;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-[420px] max-h-[88dvh] bg-white rounded-t-[32px] sm:rounded-3xl p-5 shadow-2xl z-10 overflow-y-auto no-scrollbar border border-[#EFEFF8] flex flex-col"
        >
          {/* Top Drag Handle / Header */}
          <div className="w-12 h-1.5 bg-[#E2E4F0] rounded-full mx-auto mb-3 shrink-0" />

          <div className="flex items-start justify-between pb-3 border-b border-[#F1F2FA]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C71F3] bg-[#EEF1FE] px-2.5 py-0.5 rounded-full">
                  {getLocalizedMuscle(exercise.targetMuscle)}
                </span>
                <span className="text-[10px] font-bold text-[#8E8E9F] bg-[#F5F6FA] px-2 py-0.5 rounded-full capitalize">
                  {localizedExp}
                </span>
              </div>
              <h2 className="text-[20px] font-black text-[#1E1E2D] tracking-tight mt-1.5 leading-tight">
                {getLocalizedExercise(exercise.name)}
              </h2>
              <p className="text-[12px] text-[#8E8E9F] font-medium mt-0.5">
                {isAmharic ? 'የስፖርት መሳሪያ' : 'Equipment'}: <span className="text-[#1E1E2D] font-semibold">{exercise.equipment}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#F5F6FA] text-[#8E8E9F] hover:text-[#1E1E2D] flex items-center justify-center cursor-pointer shrink-0 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 py-3">
            {/* Animated Motion Biomechanics Guide */}
            <div>
              <span className="text-[11px] font-bold text-[#8E8E9F] uppercase tracking-wider block mb-2 px-0.5">
                {t('visualExerciseDemonstration')}
              </span>
              <ExerciseVisualGuide exercise={exercise} />
            </div>

            {/* Quick Parameters Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
                <div className="flex items-center gap-1 text-[10px] font-bold text-[#8E8E9F] uppercase">
                  <Target className="w-3.5 h-3.5 text-[#5C71F3]" />
                  <span>{t('targetLabelUpper')}</span>
                </div>
                <p className="text-[13px] font-black text-[#1E1E2D] mt-1">
                  {exercise.sets.length} × {exercise.sets[0]?.reps || 10} {t('repsLabel')}
                </p>
              </div>

              <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
                <div className="flex items-center gap-1 text-[10px] font-bold text-[#8E8E9F] uppercase">
                  <Clock className="w-3.5 h-3.5 text-[#FFB020]" />
                  <span>{t('restLabelUpper')}</span>
                </div>
                <p className="text-[13px] font-black text-[#1E1E2D] mt-1">
                  {exercise.defaultRestSec} {t('unitSec')}
                </p>
              </div>

              <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
                <div className="flex items-center gap-1 text-[10px] font-bold text-[#8E8E9F] uppercase">
                  <Dumbbell className="w-3.5 h-3.5 text-[#00D09E]" />
                  <span>{t('tempoLabel')}</span>
                </div>
                <p className="text-[13px] font-black text-[#1E1E2D] mt-1">
                  {exercise.tempo || '3-0-1-0'}
                </p>
              </div>
            </div>

            {/* Progressive Overload Section */}
            <div className="p-3.5 bg-gradient-to-r from-[#EEF1FE] to-[#F5F7FF] rounded-2xl border border-[#5C71F3]/20">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#5C71F3] uppercase tracking-wider mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{t('progressiveOverloadGuidance')}</span>
              </div>
              {hasHistory ? (
                <div className="text-[12px] text-[#1E1E2D]">
                  <p className="font-bold text-[#5C71F3]">
                    {isAmharic ? `ያለፈው ውጤት፡ ${previousWeightKg} ኪ.ግ × ${previousReps} ድግግሞሽ` : `Last performance: ${previousWeightKg} kg × ${previousReps} reps`}
                  </p>
                  <p className="text-[#8E8E9F] mt-0.5">
                    {isAmharic
                      ? `የዛሬ ምክር፡ ${previousWeightKg} ኪ.ግ × ${(previousReps || 8) + 1}–${(previousReps || 8) + 2} ድግግሞሽ ይሞክሩ።`
                      : `Suggested today: ${previousWeightKg} kg × ${(previousReps || 8) + 1}–${(previousReps || 8) + 2} reps, or advance load cautiously if form is immaculate.`}
                  </p>
                </div>
              ) : (
                <p className="text-[12px] text-[#4A4B65] leading-relaxed">
                  {isAmharic
                    ? 'ትክክለኛ እንቅስቃሴን ለመጠበቅ በሚያስችል ተስማሚ ክብደት ይጀምሩ፤ ከዚያም ቀስ በቀስ ክብደቱን ይጨምሩ።'
                    : 'Start with a comfortable weight that allows you to complete the target reps with pristine form before progressing resistance.'}
                </p>
              )}
            </div>

            {/* Step-by-Step Instructions */}
            <div className="bg-white rounded-2xl p-4 border border-[#ECEEF5]">
              <span className="text-[11px] font-bold text-[#8E8E9F] uppercase tracking-wider block mb-2.5">
                {t('howToPerform')}
              </span>
              <div className="space-y-2">
                {exercise.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-[13px] text-[#1E1E2D] leading-snug">
                    <span className="w-5 h-5 rounded-full bg-[#F5F6FA] text-[#5C71F3] font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coach Training Tip */}
            {exercise.trainingTip && (
              <div className="p-3.5 bg-[#FFF9EE] rounded-2xl border border-[#FFB020]/25 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#FFB020] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-extrabold text-[#D98200] uppercase tracking-wider block">
                    {t('coachTrainingTip')}
                  </span>
                  <p className="text-[12px] text-[#5C3C00] font-medium mt-0.5 leading-relaxed">
                    "{exercise.trainingTip}"
                  </p>
                </div>
              </div>
            )}

            {/* Safety Guidance */}
            <div className="p-3 bg-[#FFF3F3] rounded-2xl border border-[#FF5C5C]/20 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-[#FF5C5C] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-[#FF5C5C] uppercase tracking-wider block">
                  {t('safetyProtocol')}
                </span>
                <p className="text-[12px] text-[#7A2020] font-medium mt-0.5">
                  {exercise.safety || (isAmharic ? 'ሹል ህመም ከተሰማዎት ወዲያውኑ ያቁሙ። የጀርባ አከርካሪዎን ቀጥ አድርገው ይያዙ።' : 'Stop immediately if you experience sharp pain or joint impingement. Maintain spinal neutrality.')}
                </p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="pt-2 mt-auto">
            <button
              onClick={onClose}
              className="w-full h-12 rounded-2xl bg-[#5C71F3] text-white font-bold text-[14px] flex items-center justify-center shadow-md shadow-[#5C71F3]/25 cursor-pointer hover:bg-[#4B62EB] transition-colors"
            >
              {t('gotItBtn')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

