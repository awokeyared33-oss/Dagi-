import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  generatePersonalizedWeeklyPlan,
  getDynamicGoalSentence,
} from '../data/workoutDatabase';
import { Exercise, WorkoutRoutine } from '../types';
import { ExerciseDetailModal } from '../components/ExerciseDetailModal';
import {
  Dumbbell,
  Play,
  CheckCircle2,
  Calendar,
  Award,
  ChevronRight,
  Activity,
  Heart,
  TrendingUp,
} from 'lucide-react';

export const TrainView: React.FC = () => {
  const {
    user,
    currentRoutine,
    startWorkout,
    activeWorkout,
    completedWorkouts,
    language,
    t,
    getLocalizedExercise,
    getLocalizedRoutine,
    getLocalizedDay,
    getLocalizedMuscle,
  } = useApp();

  const isAmharic = language === 'am';
  const todayDayIndex = (new Date().getDay() + 6) % 7; // 0 for Mon, 6 for Sun
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(todayDayIndex);
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<Exercise | null>(null);

  // Generate personalized weekly plan dynamically based on actual user profile
  const personalizedPlan = useMemo(() => {
    return generatePersonalizedWeeklyPlan({
      name: user.name,
      goal: user.goal,
      experience: user.experience,
      workoutDaysPerWeek: user.workoutFrequencyDays || 4,
      preferredDurationMin: user.workoutDurationMin || 45,
      equipment: user.equipment || ['gym'],
      completedWorkouts: completedWorkouts || [],
    });
  }, [
    user.name,
    user.goal,
    user.experience,
    user.workoutFrequencyDays,
    user.workoutDurationMin,
    user.equipment,
    completedWorkouts,
  ]);

  const schedule = personalizedPlan.schedule;
  const selectedDay = schedule[selectedDayIndex] || schedule[0];
  const activeDisplayRoutine: WorkoutRoutine =
    selectedDay.routine || currentRoutine || personalizedPlan.todayRoutine;

  const firstName = user?.name ? user.name.trim().split(' ')[0] : (isAmharic ? 'አትሌት' : 'Athlete');

  // Check if today's workout has been completed
  const todayStr = new Date().toISOString().split('T')[0];
  const isSelectedDayCompleted =
    selectedDay.isToday &&
    (completedWorkouts?.length ?? 0) > 0 &&
    completedWorkouts.some((w) => w.date === todayStr);

  // Calculate estimated calories burned for the session
  const estimatedSessionCalories = useMemo(() => {
    const duration = activeDisplayRoutine.estimatedDurationMin || 45;
    const bodyWeight = user.weightKg || 70;
    // MET calculation for resistance training (~6.0 METs)
    return Math.round((duration * 6.0 * 3.5 * bodyWeight) / 200);
  }, [activeDisplayRoutine.estimatedDurationMin, user.weightKg]);

  // Aggregate real stats from actual completed workouts
  const totalVolumeLifted = useMemo(() => {
    return (completedWorkouts || []).reduce((acc, curr) => acc + (curr.totalVolumeKg || 0), 0);
  }, [completedWorkouts]);

  const totalMinutesTrained = useMemo(() => {
    return (completedWorkouts || []).reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  }, [completedWorkouts]);

  // Dynamic Goal Motivation text
  const goalSentence = useMemo(() => {
    if (isAmharic) {
      switch (user.goal) {
        case 'build_muscle':
          return 'የጡንቻ እድገትን ለማሳደግ እና ሰውነትዎን ለማጠንከር የተዘጋጀ ስልጠና።';
        case 'lose_weight':
          return 'ካሎሪን ለማቃጠል እና የሰውነት ቅልጥፍናን ለመጨመር የተዘጋጀ ስልጠና።';
        case 'burn_fat':
          return 'ስብን በማቅለጥ ጡንቻን ለማጉላት የተዘጋጀ ስልጠና።';
        case 'get_stronger':
          return 'ከፍተኛ ክብደት የማንሳት ጥንካሬን ለማጎልበት የተዘጋጀ ስልጠና።';
        case 'improve_endurance':
          return 'ጽናትን እና የልብና የደም ዝውውር ብቃትን ለማሳደግ የተዘጋጀ ስልጠና።';
        default:
          return 'አጠቃላይ ጤናን እና ብቃትን ለማሳደግ የተዘጋጀ ስልጠና።';
      }
    }
    return getDynamicGoalSentence(user.goal);
  }, [user.goal, isAmharic]);

  const localizedRoutineTitle = getLocalizedRoutine(activeDisplayRoutine.title);
  const localizedTargetMuscles = activeDisplayRoutine.targetMuscles.map(m => getLocalizedMuscle(m)).join(' • ');

  return (
    <div className="flex-1 flex flex-col pt-3 pb-28 px-4 bg-[#F5F6FA] min-h-full">
      {/* 1. PERSONALIZED HEADER */}
      <div className="flex items-start justify-between pb-4">
        <div>
          <h1 className="text-[23px] font-black text-[#1E1E2D] tracking-tight">
            {t('readyToTrain', { name: firstName })}
          </h1>
          <p className="text-[13px] text-[#8E8E9F] font-medium mt-1 leading-snug max-w-[320px]">
            {goalSentence}
          </p>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-white border border-[#EBEBF4] flex items-center justify-center text-[#5C71F3] card-shadow shrink-0 mt-0.5">
          <Dumbbell className="w-5 h-5" />
        </div>
      </div>

      {/* 2. TODAY'S WORKOUT HERO CARD (or Selected Day Card) */}
      {!selectedDay.isRest ? (
        <motion.div
          key={`hero-${activeDisplayRoutine.id}-${selectedDayIndex}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-5 card-shadow border border-[#EFEFF8] mb-4 relative overflow-hidden"
        >
          {/* Top Label & Completion Badge */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C71F3] bg-[#EEF1FE] px-2.5 py-1 rounded-full">
              {selectedDay.isToday
                ? t('todaysWorkout')
                : `${getLocalizedDay(selectedDay.dayName)} ${isAmharic ? 'ስልጠና' : 'Workout'}`}
            </span>

            {isSelectedDayCompleted && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#00C48C] bg-[#E6FAF3] px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('completedTodayBadge')}</span>
              </div>
            )}
          </div>

          {/* Workout Title & Subtitle */}
          <h2 className="text-[20px] font-black text-[#1E1E2D] tracking-tight mt-2.5 leading-tight">
            {localizedRoutineTitle}
          </h2>
          <p className="text-[13px] text-[#8E8E9F] font-medium mt-0.5">
            {localizedTargetMuscles}
          </p>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-4 gap-2 my-3.5 pt-3 border-t border-[#F1F2FA]">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#8E8E9F] uppercase">{t('estimatedDuration')}</span>
              <span className="text-[13px] font-black text-[#1E1E2D] mt-0.5">
                {activeDisplayRoutine.estimatedDurationMin} {t('unitMin')}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#8E8E9F] uppercase">{isAmharic ? 'ልምምዶች' : 'Exercises'}</span>
              <span className="text-[13px] font-black text-[#1E1E2D] mt-0.5">
                {activeDisplayRoutine.exercises.length} {t('exerciseCountLabel', { count: '' }).trim()}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#8E8E9F] uppercase">{t('difficultyLabel')}</span>
              <span className="text-[13px] font-black text-[#5C71F3] capitalize mt-0.5">
                {isAmharic
                  ? activeDisplayRoutine.difficulty === 'beginner'
                    ? 'ጀማሪ'
                    : activeDisplayRoutine.difficulty === 'advanced'
                    ? 'ከፍተኛ'
                    : 'መካከለኛ'
                  : activeDisplayRoutine.difficulty}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#8E8E9F] uppercase">{t('estBurnLabel')}</span>
              <span className="text-[13px] font-black text-[#FFB020] mt-0.5">
                ~{estimatedSessionCalories} {t('unitKcal')}
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          {activeWorkout ? (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {}}
              className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#00C48C] to-[#00D09E] text-white font-extrabold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-[#00C48C]/25 cursor-pointer"
            >
              <Activity className="w-5 h-5 animate-pulse" />
              <span>{t('resumeWorkoutBtn')}</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startWorkout(activeDisplayRoutine)}
              className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#4B62EB] to-[#6377F7] text-white font-extrabold text-[15px] flex items-center justify-center gap-2.5 shadow-lg shadow-[#5C71F3]/25 cursor-pointer"
            >
              <Play className="w-4.5 h-4.5 fill-current" />
              <span>{isSelectedDayCompleted ? t('startRepeatSession') : t('startWorkoutBtn')}</span>
            </motion.button>
          )}
        </motion.div>
      ) : (
        /* Recovery Day Card */
        <motion.div
          key={`recovery-${selectedDayIndex}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 card-shadow border border-[#EFEFF8] mb-4 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#EEF1FE] text-[#5C71F3] flex items-center justify-center mx-auto mb-3 text-[26px]">
            🧘
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5C71F3] bg-[#EEF1FE] px-3 py-1 rounded-full">
            {t('activeRecoverySectionTitle')}
          </span>
          <h2 className="text-[19px] font-black text-[#1E1E2D] tracking-tight mt-2.5">
            {t('restDayTitle')}
          </h2>
          <p className="text-[13px] text-[#8E8E9F] mt-1.5 leading-relaxed max-w-[300px] mx-auto">
            {t('restDayDesc')}
          </p>

          <div className="mt-4 pt-4 border-t border-[#F1F2FA] grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#F8F9FD] p-2.5 rounded-xl border border-[#ECEEF5]">
              <span className="text-[9px] font-bold text-[#8E8E9F] uppercase block">{t('water')}</span>
              <span className="text-[12px] font-black text-[#00D09E] mt-0.5 block">{user.targetWaterL}{t('unitLiters')} {isAmharic ? 'ዒላማ' : 'Target'}</span>
            </div>
            <div className="bg-[#F8F9FD] p-2.5 rounded-xl border border-[#ECEEF5]">
              <span className="text-[9px] font-bold text-[#8E8E9F] uppercase block">{isAmharic ? 'የእንቅልፍ ዒላማ' : 'Target Sleep'}</span>
              <span className="text-[12px] font-black text-[#5C71F3] mt-0.5 block">{user.targetSleepHours || 8}h {isAmharic ? 'እረፍት' : 'Deep'}</span>
            </div>
            <div className="bg-[#F8F9FD] p-2.5 rounded-xl border border-[#ECEEF5]">
              <span className="text-[9px] font-bold text-[#8E8E9F] uppercase block">{isAmharic ? 'እንቅስቃሴ' : 'Mobility'}</span>
              <span className="text-[12px] font-black text-[#FFB020] mt-0.5 block">{isAmharic ? 'ቀላል የእግር ጉዞ' : 'Light Walk'}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* 3. WEEKLY TRAINING CALENDAR */}
      <div className="bg-white rounded-3xl p-4 card-shadow border border-[#EFEFF8] mb-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#1E1E2D]">
            <Calendar className="w-3.5 h-3.5 text-[#5C71F3]" />
            <span>{t('weeklySplitCalendarTitle', { days: user.workoutFrequencyDays || 4 })}</span>
          </div>
          <span className="text-[11px] font-bold text-[#5C71F3] bg-[#EEF1FE] px-2 py-0.5 rounded-full">
            {t('sessionDurationPill', { min: user.workoutDurationMin || 45 })}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {schedule.map((item) => {
            const isSelected = selectedDayIndex === item.dayIndex;
            const isDone = item.isToday && isSelectedDayCompleted;

            return (
              <button
                key={item.dayName}
                onClick={() => setSelectedDayIndex(item.dayIndex)}
                className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#5C71F3] text-white shadow-md shadow-[#5C71F3]/30 scale-105'
                    : item.isToday
                    ? 'bg-[#EEF1FE] text-[#5C71F3] border border-[#5C71F3]/40'
                    : 'bg-[#F8F9FD] text-[#8E8E9F] border border-[#ECEEF5] hover:border-[#D9DCED]'
                }`}
              >
                <span className="text-[9px] font-bold uppercase">{getLocalizedDay(item.dayName, true)}</span>
                <span className="text-[13px] font-black mt-0.5">
                  {item.dateFormatted}
                </span>
                <span
                  className={`text-[9px] font-bold mt-1 px-1.5 py-0.2 rounded-full truncate max-w-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : isDone
                      ? 'bg-[#E6FAF3] text-[#00C48C]'
                      : item.isRest
                      ? 'bg-[#EFEFF8] text-[#8E8E9F]'
                      : 'bg-[#EEF1FE] text-[#5C71F3]'
                  }`}
                >
                  {isDone ? (isAmharic ? 'አልቋል' : 'Done') : item.isRest ? (isAmharic ? 'እረፍት' : 'Rest') : (isAmharic ? 'ስልጠና' : 'Train')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. TODAY'S WORKOUT OVERVIEW ("Your Session") */}
      {!selectedDay.isRest && (
        <div className="bg-white rounded-3xl p-4 card-shadow border border-[#EFEFF8] mb-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[14px] font-extrabold text-[#1E1E2D] tracking-tight">
              {t('yourSessionOverview')}
            </span>
            <span className="text-[11px] font-bold text-[#5C71F3] bg-[#EEF1FE] px-2.5 py-0.5 rounded-full">
              {isAmharic ? 'የክብደት ጭማሪ ስልጠና' : (activeDisplayRoutine.intensity || 'Progressive Overload')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
              <span className="text-[10px] font-bold text-[#8E8E9F] uppercase block">{t('totalExercisesLabel')}</span>
              <p className="text-[15px] font-black text-[#1E1E2D] mt-0.5">
                {t('movementsCountLabel', { count: activeDisplayRoutine.exercises.length })}
              </p>
            </div>

            <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
              <span className="text-[10px] font-bold text-[#8E8E9F] uppercase block">{t('targetMuscleGroupsLabel')}</span>
              <p className="text-[13px] font-black text-[#1E1E2D] mt-0.5 truncate">
                {activeDisplayRoutine.targetMuscles.slice(0, 2).map(m => getLocalizedMuscle(m)).join(' + ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. EXERCISE LIST */}
      {!selectedDay.isRest && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="text-[15px] font-extrabold text-[#1E1E2D] tracking-tight">
              {t('exerciseSequenceTitle', { count: activeDisplayRoutine.exercises.length })}
            </h3>
            <span className="text-[11px] text-[#8E8E9F] font-semibold">
              {t('tapForAnimationGuide')}
            </span>
          </div>

          <div className="space-y-2.5">
            {activeDisplayRoutine.exercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedExerciseForModal(exercise)}
                className="bg-white rounded-2xl p-3.5 card-shadow border border-[#EFEFF8] flex items-center justify-between cursor-pointer hover:border-[#D5D8ED] transition-all"
              >
                <div className="flex items-center gap-3">
                  {/* Number Badge */}
                  <div className="w-9 h-9 rounded-xl bg-[#F5F6FA] text-[#5C71F3] font-black text-[14px] flex items-center justify-center shrink-0">
                    0{index + 1}
                  </div>

                  <div>
                    <h4 className="text-[14px] font-bold text-[#1E1E2D] leading-tight">
                      {getLocalizedExercise(exercise.name)}
                    </h4>
                    <p className="text-[12px] text-[#8E8E9F] mt-0.5">
                      {exercise.sets.length} {t('setsLabel')} × {exercise.sets[0]?.reps || 10} {t('repsLabel')} •{' '}
                      <span className="text-[#5C71F3] font-medium">{t('restSecLabel', { sec: exercise.defaultRestSec })}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#5C71F3] bg-[#EEF1FE] px-2 py-0.5 rounded">
                    {getLocalizedMuscle(exercise.targetMuscle)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#C1C3D6]" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 6. CARDIO TARGET RECOMMENDATION */}
      {activeDisplayRoutine.cardioTarget && (
        <div className="bg-white rounded-3xl p-4 card-shadow border border-[#EFEFF8] mb-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#FF5C5C]" />
              <span className="text-[13px] font-black text-[#1E1E2D]">{t('cardioTargetRec')}</span>
            </div>
            <span className="text-[10px] font-extrabold text-[#FF5C5C] bg-[#FFF0F0] px-2 py-0.5 rounded-full">
              {t('perWeekFreq', { count: activeDisplayRoutine.cardioTarget.frequencyPerWeek })}
            </span>
          </div>

          <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5] space-y-1 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-black text-[#1E1E2D]">
                {isAmharic && activeDisplayRoutine.cardioTarget.activity === 'Incline Treadmill Walk' ? 'ያጋደለ ትሬድሚል የእግር ጉዞ' : activeDisplayRoutine.cardioTarget.activity}
              </span>
              <span className="text-[11px] font-bold text-[#5C71F3]">
                {activeDisplayRoutine.cardioTarget.durationMin} {t('unitMin')}
              </span>
            </div>
            <p className="text-[11px] text-[#8E8E9F] leading-snug">
              {isAmharic ? 'መካከለኛ ፍጥነት • የስብ ማቃጠል ዞን' : `${activeDisplayRoutine.cardioTarget.intensity} • ${activeDisplayRoutine.cardioTarget.tip}`}
            </p>
          </div>
        </div>
      )}

      {/* 7. TRAINING PROGRESS (Calculated purely from real stored data) */}
      <div className="bg-white rounded-3xl p-4 card-shadow border border-[#EFEFF8] mb-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5 text-[13px] font-black text-[#1E1E2D]">
            <TrendingUp className="w-4 h-4 text-[#00D09E]" />
            <span>{t('trainingProgressTitle')}</span>
          </div>
          <span className="text-[11px] font-bold text-[#00D09E] bg-[#E6FAF3] px-2 py-0.5 rounded-full">
            {t('realMetricsBadge')}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#F8F9FD] p-2.5 rounded-2xl border border-[#ECEEF5]">
            <span className="text-[9px] font-bold text-[#8E8E9F] uppercase block">{t('completedWorkoutsStat')}</span>
            <span className="text-[14px] font-black text-[#1E1E2D] mt-0.5 block">
              {completedWorkouts?.length || 0} {isAmharic ? 'ስልጠናዎች' : 'Sessions'}
            </span>
          </div>

          <div className="bg-[#F8F9FD] p-2.5 rounded-2xl border border-[#ECEEF5]">
            <span className="text-[9px] font-bold text-[#8E8E9F] uppercase block">{t('minutesTrainedStat')}</span>
            <span className="text-[14px] font-black text-[#5C71F3] mt-0.5 block">
              {totalMinutesTrained} {t('unitMin')}
            </span>
          </div>

          <div className="bg-[#F8F9FD] p-2.5 rounded-2xl border border-[#ECEEF5]">
            <span className="text-[9px] font-bold text-[#8E8E9F] uppercase block">{t('volumeLiftedStat')}</span>
            <span className="text-[14px] font-black text-[#00D09E] mt-0.5 block">
              {totalVolumeLifted > 0 ? `${totalVolumeLifted.toLocaleString()} ${t('unitKg')}` : `0 ${t('unitKg')}`}
            </span>
          </div>
        </div>
      </div>

      {/* 8. COMPLETED WORKOUT HISTORY ("Recent Training") */}
      <div>
        <h3 className="text-[15px] font-extrabold text-[#1E1E2D] tracking-tight mb-2.5 px-1 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[#FFB020]" />
          <span>{t('recentTrainingTitle')}</span>
        </h3>

        {(completedWorkouts?.length ?? 0) > 0 ? (
          <div className="space-y-2.5">
            {completedWorkouts.map((w) => (
              <div
                key={w.id}
                className="bg-white rounded-2xl p-3.5 card-shadow border border-[#EFEFF8] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E6FAF3] text-[#00D09E] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#1E1E2D]">{getLocalizedRoutine(w.routineTitle)}</h4>
                    <p className="text-[11px] text-[#8E8E9F] mt-0.5">
                      {w.date} • {w.durationMinutes} {t('unitMin')} •{' '}
                      <span className="text-[#FFB020] font-bold">{w.totalCaloriesBurned || 320} {t('unitKcal')}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-extrabold text-[#00D09E] bg-[#E6FAF3] px-2.5 py-0.5 rounded-full block">
                    {w.totalVolumeKg ? `${w.totalVolumeKg} ${t('unitKg')}` : `${w.totalSetsCompleted} ${t('setsLabel')}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 card-shadow border border-[#EFEFF8] text-center">
            <div className="w-10 h-10 rounded-xl bg-[#F5F6FA] text-[#8E8E9F] flex items-center justify-center mx-auto mb-2">
              <Dumbbell className="w-5 h-5" />
            </div>
            <p className="text-[13px] font-bold text-[#1E1E2D]">{t('noCompletedWorkoutsYet')}</p>
            <p className="text-[11px] text-[#8E8E9F] mt-0.5">
              {t('noCompletedWorkoutsSub')}
            </p>
          </div>
        )}
      </div>

      {/* Exercise Detail & Animation Modal */}
      <ExerciseDetailModal
        exercise={selectedExerciseForModal}
        onClose={() => setSelectedExerciseForModal(null)}
        userExperience={user.experience}
      />
    </div>
  );
};

