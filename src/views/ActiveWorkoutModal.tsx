import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  X,
  Play,
  Pause,
  Check,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Flame,
  Clock,
  Sparkles,
  TrendingUp,
  Dumbbell,
  ShieldAlert,
} from 'lucide-react';

export const ActiveWorkoutModal: React.FC = () => {
  const {
    activeWorkout,
    user,
    language,
    t,
    getLocalizedRoutine,
    getLocalizedExercise,
    getLocalizedMuscle,
    pauseWorkout,
    resumeWorkout,
    completeSet,
    skipExercise,
    finishActiveWorkout,
    cancelActiveWorkout,
    cancelRestTimer,
    startRestTimer,
    playBeep,
  } = useApp();

  const isAmharic = language === 'am';

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [restCountdown, setRestCountdown] = useState<number | null>(null);
  const [activeSetIndex, setActiveSetIndex] = useState<number>(0);
  const [weightInput, setWeightInput] = useState<number>(0);
  const [repsInput, setRepsInput] = useState<number>(10);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Current exercise calculations
  const currentExercise = activeWorkout?.routine.exercises[activeWorkout.currentExerciseIndex];
  const totalExercises = activeWorkout?.routine.exercises.length || 0;
  const currentExerciseSets = currentExercise?.sets || [];

  const firstName = user?.name ? user.name.trim().split(' ')[0] : (isAmharic ? 'ስፖርተኛ' : 'Athlete');

  // Synchronize inputs when exercise or set changes
  useEffect(() => {
    if (currentExercise) {
      // Find first incomplete set
      const firstIncompleteIdx = currentExercise.sets.findIndex((s) => !s.isCompleted);
      const targetIdx = firstIncompleteIdx !== -1 ? firstIncompleteIdx : 0;
      setActiveSetIndex(targetIdx);
      setWeightInput(currentExercise.sets[targetIdx]?.weightKg || 0);
      setRepsInput(currentExercise.sets[targetIdx]?.reps || 10);
    }
  }, [activeWorkout?.currentExerciseIndex, currentExercise]);

  // Stopwatch interval
  useEffect(() => {
    if (!activeWorkout || activeWorkout.isPaused) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout, activeWorkout?.isPaused]);

  // Rest Timer interval
  useEffect(() => {
    if (!activeWorkout || activeWorkout.restTimerSec === null) {
      setRestCountdown(null);
      return;
    }
    setRestCountdown(activeWorkout.restTimerSec);
  }, [activeWorkout?.restTimerSec]);

  useEffect(() => {
    if (restCountdown === null || restCountdown <= 0) return;
    const timer = setInterval(() => {
      setRestCountdown((prev) => {
        if (prev === null || prev <= 1) {
          playBeep();
          cancelRestTimer();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [restCountdown, cancelRestTimer, playBeep]);

  if (!activeWorkout) return null;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Natural personalized motivational cue
  const motivationalCue = useMemo(() => {
    const currentExNum = activeWorkout.currentExerciseIndex + 1;
    if (isAmharic) {
      if (currentExNum === 1) {
        return `${firstName}፣ በትክክለኛ እንቅስቃሴ ላይ ትኩረት በማድረግ በጥንካሬ ጀምር።`;
      }
      if (currentExNum === Math.ceil(totalExercises / 2)) {
        return `የዛሬውን ልምምድ እኩሌታ ጨርሰሃል፣ ${firstName}። በርታ!`;
      }
      if (currentExNum === totalExercises) {
        return `${firstName}፣ የመጨረሻው እንቅስቃሴ ነው። ያለህን አቅም በሙሉ ተጠቀም!`;
      }
      return `በእያንዳንዱ ድግግሞሽ ላይ ሙሉ ቁጥጥር ይኑርህ፣ ${firstName}።`;
    }
    if (currentExNum === 1) {
      return `${firstName}, lock in on form and set the tone.`;
    }
    if (currentExNum === Math.ceil(totalExercises / 2)) {
      return `You're halfway through today's session, ${firstName}. Keep the intensity!`;
    }
    if (currentExNum === totalExercises) {
      return `${firstName}, final exercise. Empty the tank with clean technique.`;
    }
    return `Stay controlled on every rep, ${firstName}.`;
  }, [activeWorkout.currentExerciseIndex, totalExercises, firstName, isAmharic]);

  const handleCompleteCurrentSet = () => {
    if (!currentExercise) return;
    completeSet(currentExercise.id, activeSetIndex, weightInput, repsInput);

    // If more sets remain in this exercise, advance activeSetIndex
    if (activeSetIndex < currentExerciseSets.length - 1) {
      const nextIdx = activeSetIndex + 1;
      setActiveSetIndex(nextIdx);
      setWeightInput(currentExerciseSets[nextIdx]?.weightKg || weightInput);
      setRepsInput(currentExerciseSets[nextIdx]?.reps || repsInput);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F5F6FA] flex flex-col max-w-[430px] mx-auto overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#EFEFF8] px-4 py-3 flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#5C71F3] bg-[#EEF1FE] px-2 py-0.5 rounded">
            {t('liveWorkoutBadge')}
          </span>
          <h2 className="text-[15px] font-black text-[#1E1E2D] tracking-tight mt-0.5 truncate max-w-[180px]">
            {getLocalizedRoutine(activeWorkout.routine.title)}
          </h2>
        </div>

        {/* Stopwatch & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#F5F6FA] border border-[#E2E4F0] px-2.5 py-1 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-[#5C71F3]" />
            <span className="text-[13px] font-black text-[#1E1E2D] font-mono">
              {formatTime(elapsedSeconds)}
            </span>
          </div>

          <button
            onClick={() => (activeWorkout.isPaused ? resumeWorkout() : pauseWorkout())}
            className="w-8 h-8 rounded-xl bg-white border border-[#E2E4F0] flex items-center justify-center text-[#1E1E2D] cursor-pointer"
            title={activeWorkout.isPaused ? (isAmharic ? 'ቀጥል' : 'Resume') : (isAmharic ? 'አቁም' : 'Pause')}
          >
            {activeWorkout.isPaused ? (
              <Play className="w-3.5 h-3.5 text-[#00C48C] fill-current" />
            ) : (
              <Pause className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={() => setShowExitConfirm(true)}
            className="w-8 h-8 rounded-xl bg-[#F5F6FA] flex items-center justify-center text-[#8E8E9F] hover:text-[#FF5C5C] cursor-pointer"
            title={isAmharic ? 'ልምምድ አቋርጥ' : 'Cancel Workout'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Active Workout Canvas */}
      <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-3.5 no-scrollbar">
        {/* Natural Motivational Header */}
        <div className="p-3 bg-gradient-to-r from-[#EEF1FE] to-[#F7F8FF] rounded-2xl border border-[#5C71F3]/20 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#5C71F3] shrink-0" />
          <span className="text-[12px] text-[#1E1E2D] font-semibold leading-tight">
            {motivationalCue}
          </span>
        </div>

        {/* Current Exercise Hero Card */}
        <div className="bg-white rounded-3xl p-4 card-shadow border border-[#EFEFF8]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-[#8E8E9F]">
              {isAmharic ? `እንቅስቃሴ ${activeWorkout.currentExerciseIndex + 1} ከ ${totalExercises}` : `Exercise ${activeWorkout.currentExerciseIndex + 1} of ${totalExercises}`}
            </span>
            <span className="text-[10px] font-bold text-[#5C71F3] bg-[#EEF1FE] px-2 py-0.5 rounded-full">
              {currentExercise ? getLocalizedMuscle(currentExercise.targetMuscle) : ''}
            </span>
          </div>

          <h3 className="text-[18px] font-black text-[#1E1E2D] tracking-tight leading-tight">
            {currentExercise ? getLocalizedExercise(currentExercise.name) : ''}
          </h3>
          <p className="text-[11px] text-[#8E8E9F] mt-0.5">
            {isAmharic ? 'የስፖርት መሳሪያ' : 'Equipment'}: <span className="text-[#1E1E2D] font-semibold">{currentExercise?.equipment}</span>
          </p>

          {/* Exercise Progress Bar */}
          <div className="w-full h-1.5 bg-[#ECEEF5] rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-[#5C71F3] rounded-full transition-all duration-300"
              style={{
                width: `${((activeWorkout.currentExerciseIndex + 1) / totalExercises) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Rest Timer Banner */}
        <AnimatePresence>
          {restCountdown !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              className="bg-gradient-to-r from-[#5C71F3] to-[#7B8DF7] text-white p-3.5 rounded-2xl shadow-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-[17px] font-mono">
                  {restCountdown}s
                </div>
                <div>
                  <span className="text-[13px] font-black block">{t('restTimerTitle')}</span>
                  <span className="text-[11px] opacity-80">{t('restTimerSubtitle')}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => startRestTimer(restCountdown + 30)}
                  className="px-2 py-1 rounded-lg bg-white/20 text-[10px] font-bold cursor-pointer hover:bg-white/30"
                >
                  +30s
                </button>
                <button
                  onClick={cancelRestTimer}
                  className="px-2.5 py-1 rounded-lg bg-white text-[#5C71F3] text-[10px] font-extrabold cursor-pointer hover:bg-[#F1F3FF]"
                >
                  {t('skipBtn')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Set Execution Panel */}
        <div className="bg-white rounded-3xl p-4 card-shadow border border-[#EFEFF8]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-extrabold text-[#1E1E2D] uppercase tracking-wider">
              {isAmharic ? `ዙር ${activeSetIndex + 1} ከ ${currentExerciseSets.length}` : `Set ${activeSetIndex + 1} of ${currentExerciseSets.length}`}
            </span>
            <span className="text-[11px] font-bold text-[#8E8E9F]">
              {isAmharic ? `ግቡ፡ ${currentExerciseSets[activeSetIndex]?.reps || 10} ድግግሞሽ` : `Target: ${currentExerciseSets[activeSetIndex]?.reps || 10} reps`}
            </span>
          </div>

          {/* Interactive Weight & Reps Adjusters */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Weight Input Box */}
            <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
              <span className="text-[10px] font-bold text-[#8E8E9F] uppercase block mb-1">
                {t('weightLabel')}
              </span>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setWeightInput((prev) => Math.max(0, prev - 2.5))}
                  className="w-8 h-8 rounded-xl bg-white border border-[#D9DCED] text-[#1E1E2D] font-black text-[16px] flex items-center justify-center cursor-pointer active:scale-95"
                >
                  -
                </button>
                <input
                  type="number"
                  step="0.5"
                  value={weightInput}
                  onChange={(e) => setWeightInput(parseFloat(e.target.value) || 0)}
                  className="w-16 text-center text-[18px] font-black text-[#1E1E2D] bg-transparent outline-none"
                />
                <button
                  onClick={() => setWeightInput((prev) => prev + 2.5)}
                  className="w-8 h-8 rounded-xl bg-white border border-[#D9DCED] text-[#1E1E2D] font-black text-[16px] flex items-center justify-center cursor-pointer active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            {/* Reps Input Box */}
            <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
              <span className="text-[10px] font-bold text-[#8E8E9F] uppercase block mb-1">
                {t('repsDoneLabel')}
              </span>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setRepsInput((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-xl bg-white border border-[#D9DCED] text-[#1E1E2D] font-black text-[16px] flex items-center justify-center cursor-pointer active:scale-95"
                >
                  -
                </button>
                <input
                  type="number"
                  value={repsInput}
                  onChange={(e) => setRepsInput(parseInt(e.target.value) || 1)}
                  className="w-16 text-center text-[18px] font-black text-[#1E1E2D] bg-transparent outline-none"
                />
                <button
                  onClick={() => setRepsInput((prev) => prev + 1)}
                  className="w-8 h-8 rounded-xl bg-white border border-[#D9DCED] text-[#1E1E2D] font-black text-[16px] flex items-center justify-center cursor-pointer active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Complete Set Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCompleteCurrentSet}
            className="w-full h-12 rounded-2xl bg-[#5C71F3] hover:bg-[#4B62EB] text-white font-extrabold text-[14px] flex items-center justify-center gap-2 shadow-md shadow-[#5C71F3]/25 cursor-pointer transition-colors"
          >
            <Check className="w-4.5 h-4.5 stroke-[3]" />
            <span>{isAmharic ? `ዙር ${activeSetIndex + 1} ጨርስ` : `Complete Set ${activeSetIndex + 1}`}</span>
          </motion.button>
        </div>

        {/* Sets Checklist Table */}
        <div className="bg-white rounded-3xl p-3.5 card-shadow border border-[#EFEFF8]">
          <span className="text-[11px] font-bold text-[#8E8E9F] uppercase tracking-wider block mb-2 px-1">
            {isAmharic
              ? `የእንቅስቃሴ ዙሮች (${currentExerciseSets.filter((s) => s.isCompleted).length} / ${currentExerciseSets.length} ተጠናቀዋል)`
              : `Exercise Sets (${currentExerciseSets.filter((s) => s.isCompleted).length} / ${currentExerciseSets.length} Done)`}
          </span>

          <div className="space-y-1.5">
            {currentExerciseSets.map((set, idx) => (
              <div
                key={set.setNumber}
                onClick={() => {
                  setActiveSetIndex(idx);
                  setWeightInput(set.weightKg);
                  setRepsInput(set.reps);
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  set.isCompleted
                    ? 'bg-[#E6FAF3] border-[#00D09E]/30 text-[#00A87A]'
                    : activeSetIndex === idx
                    ? 'bg-[#EEF1FE] border-[#5C71F3] text-[#5C71F3]'
                    : 'bg-[#F9FAFD] border-[#ECEEF5] text-[#8E8E9F]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-white/80 font-black text-[11px] flex items-center justify-center">
                    {set.setNumber}
                  </span>
                  <span className="text-[12px] font-bold">
                    {set.weightKg > 0
                      ? `${set.weightKg} ${t('unitKg')} × ${set.reps} ${t('repsLabel')}`
                      : `${set.reps} ${t('repsLabel')} (${t('bodyweightLabel')})`}
                  </span>
                </div>

                <span className="text-[11px] font-black">
                  {set.isCompleted
                    ? `✓ ${t('completedBadge')}`
                    : activeSetIndex === idx
                    ? t('currentSetBadge')
                    : t('pendingBadge')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Exercise Navigation Controls */}
        <div className="flex gap-2">
          {activeWorkout.currentExerciseIndex < totalExercises - 1 && (
            <button
              onClick={skipExercise}
              className="flex-1 h-11 rounded-2xl bg-white border border-[#ECEEF5] text-[#1E1E2D] font-bold text-[13px] flex items-center justify-center gap-1.5 card-shadow cursor-pointer hover:border-[#D5D8ED]"
            >
              <span>{t('nextExerciseBtn')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Sticky Finish Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/95 backdrop-blur-md border-t border-[#ECECF5] p-3.5 flex gap-2.5 shadow-lg z-30">
        <button
          onClick={finishActiveWorkout}
          className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-[#00D09E] to-[#00C48C] text-white font-extrabold text-[14px] flex items-center justify-center gap-2 shadow-md shadow-[#00D09E]/30 cursor-pointer hover:opacity-95"
        >
          <Trophy className="w-4.5 h-4.5" />
          <span>{t('finishAndSaveBtn')}</span>
        </button>
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-[320px] bg-white rounded-3xl p-5 shadow-2xl text-center border border-[#ECEEF5]">
            <h3 className="text-[17px] font-black text-[#1E1E2D]">{t('cancelSessionConfirmTitle')}</h3>
            <p className="text-[12px] text-[#8E8E9F] mt-1">
              {t('cancelSessionConfirmDesc')}
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 h-10 rounded-xl bg-[#F5F6FA] text-[#1E1E2D] font-bold text-[13px] cursor-pointer"
              >
                {t('resumeBtn')}
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  cancelActiveWorkout();
                }}
                className="flex-1 h-10 rounded-xl bg-[#FF5C5C] text-white font-bold text-[13px] cursor-pointer shadow-md shadow-[#FF5C5C]/25"
              >
                {t('exitBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
