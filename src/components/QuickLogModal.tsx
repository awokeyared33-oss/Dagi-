import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Dumbbell,
  Droplets,
  Utensils,
  Scale,
  Check,
  Footprints,
  Moon,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuickLogModal: React.FC = () => {
  const {
    isQuickLogOpen,
    setIsQuickLogOpen,
    quickLogTab,
    setQuickLogTab,
    currentWaterL,
    addWaterL,
    setWaterL,
    currentSteps,
    addSteps,
    setSteps,
    sleepHoursLogged,
    logSleep,
    weightHistory,
    logWeight,
    user,
    startWorkout,
    setRoute,
    language,
  } = useApp();

  const isAmharic = language === 'am';

  const [activeTab, setActiveTab] = useState<'options' | 'water' | 'weight' | 'steps' | 'sleep'>(
    quickLogTab || 'options'
  );

  useEffect(() => {
    if (isQuickLogOpen) {
      setActiveTab(quickLogTab || 'options');
    }
  }, [isQuickLogOpen, quickLogTab]);

  const [customWaterMl, setCustomWaterMl] = useState('250');
  const [customStepsInput, setCustomStepsInput] = useState(currentSteps.toString());
  const [sleepInput, setSleepInput] = useState(sleepHoursLogged.toString());
  const [sleepQuality, setSleepQuality] = useState<'deep' | 'good' | 'light'>('good');
  const [weightInput, setWeightInput] = useState(user.weightKg ? user.weightKg.toString() : '75.0');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleClose = () => {
    setIsQuickLogOpen(false);
    setTimeout(() => {
      setActiveTab('options');
      setQuickLogTab('options');
    }, 250);
  };

  const triggerSuccess = (msg?: string) => {
    setSuccessMessage(msg || (isAmharic ? 'በተሳካ ሁኔታ ተመዝግቧል!' : 'Logged Successfully!'));
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      handleClose();
    }, 850);
  };

  // Water calculations
  const waterTarget = user.targetWaterL || 3.0;
  const waterPercent = Math.min(100, Math.round((currentWaterL / waterTarget) * 100));

  // Steps calculations
  const stepsTarget = user.targetDailySteps || 10000;
  const stepsPercent = Math.min(100, Math.round((currentSteps / stepsTarget) * 100));
  const estimatedCaloriesBurned = Math.round(currentSteps * 0.04);

  // Sleep calculations
  const sleepTarget = user.targetSleepHours || 8;
  const sleepPercent = Math.min(100, Math.round((sleepHoursLogged / sleepTarget) * 100));

  return (
    <AnimatePresence>
      {isQuickLogOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-[430px] bg-white rounded-t-3xl p-5 sm:p-6 shadow-2xl z-10 pb-safe max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-[#E2E4F0] rounded-full mx-auto mb-3" />

            {/* Header with Title and Close */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[17px] sm:text-[18px] font-black text-[#1E1E2D] tracking-tight">
                  {activeTab === 'options' && (isAmharic ? 'ፈጣን የአካል ብቃት እርምጃዎች' : 'Quick Fitness Actions')}
                  {activeTab === 'water' && (isAmharic ? 'የውኃ መጠጣት መከታተያ' : 'Hydration Tracker')}
                  {activeTab === 'steps' && (isAmharic ? 'የዕለት እርምጃዎች መከታተያ' : 'Daily Steps Tracker')}
                  {activeTab === 'sleep' && (isAmharic ? 'የእንቅልፍና እረፍት መከታተያ' : 'Sleep & Recovery Log')}
                  {activeTab === 'weight' && (isAmharic ? 'የሰውነት ክብደት መዝገብ' : 'Body Weight Log')}
                </h3>
                <p className="text-[11.5px] text-[#8E8E9F]">
                  {isAmharic ? 'የግል ጤና እና የአካል ብቃት እድገት' : 'Personalized fitness & health tracking'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-[#F5F6FA] flex items-center justify-center text-[#8E8E9F] hover:text-[#1E1E2D] cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Top Quick Navigation Tabs */}
            <div className="flex bg-[#F5F6FA] p-1 rounded-2xl mb-4 gap-1 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('options')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'options'
                    ? 'bg-white text-[#1E1E2D] shadow-xs'
                    : 'text-[#8E8E9F] hover:text-[#1E1E2D]'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-[#5C71F3]" />
                <span>{isAmharic ? 'አጠቃላይ' : 'Actions'}</span>
              </button>
              <button
                onClick={() => setActiveTab('water')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'water'
                    ? 'bg-white text-[#5C71F3] shadow-xs'
                    : 'text-[#8E8E9F] hover:text-[#1E1E2D]'
                }`}
              >
                <Droplets className="w-3.5 h-3.5 text-[#5C71F3]" />
                <span>{isAmharic ? 'ውኃ' : 'Water'}</span>
              </button>
              <button
                onClick={() => setActiveTab('steps')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'steps'
                    ? 'bg-white text-[#00D09E] shadow-xs'
                    : 'text-[#8E8E9F] hover:text-[#1E1E2D]'
                }`}
              >
                <Footprints className="w-3.5 h-3.5 text-[#00D09E]" />
                <span>{isAmharic ? 'እርምጃ' : 'Steps'}</span>
              </button>
              <button
                onClick={() => setActiveTab('sleep')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'sleep'
                    ? 'bg-white text-[#9D5CE5] shadow-xs'
                    : 'text-[#8E8E9F] hover:text-[#1E1E2D]'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-[#9D5CE5]" />
                <span>{isAmharic ? 'እረፍት' : 'Sleep'}</span>
              </button>
              <button
                onClick={() => setActiveTab('weight')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'weight'
                    ? 'bg-white text-[#FFB020] shadow-xs'
                    : 'text-[#8E8E9F] hover:text-[#1E1E2D]'
                }`}
              >
                <Scale className="w-3.5 h-3.5 text-[#FFB020]" />
                <span>{isAmharic ? 'ክብደት' : 'Weight'}</span>
              </button>
            </div>

            {/* Success Animation Banner */}
            {showSuccessToast ? (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-8 flex flex-col items-center justify-center text-center space-y-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#00D09E]/15 text-[#00D09E] flex items-center justify-center shadow-xs">
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>
                <p className="text-[16px] font-black text-[#1E1E2D]">{successMessage}</p>
                <p className="text-[12px] text-[#8E8E9F]">
                  {isAmharic ? 'መረጃዎች በዳሽቦርዱ ላይ ተዘምነዋል።' : 'Dashboard and goals updated immediately.'}
                </p>
              </motion.div>
            ) : (
              <>
                {/* ========================================== */}
                {/* 1. QUICK ACTIONS HUB (OPTIONS) */}
                {/* ========================================== */}
                {activeTab === 'options' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Start Workout */}
                      <button
                        onClick={() => {
                          handleClose();
                          startWorkout();
                        }}
                        className="p-3.5 rounded-2xl bg-[#EEF1FE] border border-[#5C71F3]/20 flex flex-col items-start text-left cursor-pointer transition-transform active:scale-95"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#5C71F3] text-white flex items-center justify-center mb-2 shadow-xs">
                          <Dumbbell className="w-4.5 h-4.5" />
                        </div>
                        <span className="font-bold text-[13.5px] text-[#1E1E2D]">
                          {isAmharic ? 'ልምምድ ጀምር' : 'Start Workout'}
                        </span>
                        <span className="text-[11px] text-[#8E8E9F] mt-0.5">
                          {isAmharic ? 'ንቁ ስልጠና ይጀምሩ' : 'Active training timer'}
                        </span>
                      </button>

                      {/* Food / Nutrition */}
                      <button
                        onClick={() => {
                          handleClose();
                          setRoute('nutrition');
                        }}
                        className="p-3.5 rounded-2xl bg-[#FFF7E6] border border-[#FFB020]/20 flex flex-col items-start text-left cursor-pointer transition-transform active:scale-95"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#FFB020] text-white flex items-center justify-center mb-2 shadow-xs">
                          <Utensils className="w-4.5 h-4.5" />
                        </div>
                        <span className="font-bold text-[13.5px] text-[#1E1E2D]">
                          {isAmharic ? 'ምግብ መዝግብ' : 'Log Meal'}
                        </span>
                        <span className="text-[11px] text-[#8E8E9F] mt-0.5">
                          {isAmharic ? 'የምግብ እቅድ እና ካሎሪ' : 'Meal plans & macros'}
                        </span>
                      </button>

                      {/* Log Water */}
                      <button
                        onClick={() => setActiveTab('water')}
                        className="p-3.5 rounded-2xl bg-[#E6FAF5] border border-[#00D09E]/20 flex flex-col items-start text-left cursor-pointer transition-transform active:scale-95"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#00D09E] text-white flex items-center justify-center mb-2 shadow-xs">
                          <Droplets className="w-4.5 h-4.5" />
                        </div>
                        <span className="font-bold text-[13.5px] text-[#1E1E2D]">
                          {isAmharic ? 'ውኃ መከታተያ' : 'Track Hydration'}
                        </span>
                        <span className="text-[11px] text-[#8E8E9F] mt-0.5">
                          {currentWaterL.toFixed(1)}L / {waterTarget}L
                        </span>
                      </button>

                      {/* Track Steps */}
                      <button
                        onClick={() => setActiveTab('steps')}
                        className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#22C55E]/20 flex flex-col items-start text-left cursor-pointer transition-transform active:scale-95"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#22C55E] text-white flex items-center justify-center mb-2 shadow-xs">
                          <Footprints className="w-4.5 h-4.5" />
                        </div>
                        <span className="font-bold text-[13.5px] text-[#1E1E2D]">
                          {isAmharic ? 'ዕለታዊ እርምጃ' : 'Daily Steps'}
                        </span>
                        <span className="text-[11px] text-[#8E8E9F] mt-0.5">
                          {currentSteps.toLocaleString()} / {stepsTarget.toLocaleString()}
                        </span>
                      </button>

                      {/* Track Sleep */}
                      <button
                        onClick={() => setActiveTab('sleep')}
                        className="p-3.5 rounded-2xl bg-[#F5ECFD] border border-[#9D5CE5]/20 flex flex-col items-start text-left cursor-pointer transition-transform active:scale-95"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#9D5CE5] text-white flex items-center justify-center mb-2 shadow-xs">
                          <Moon className="w-4.5 h-4.5" />
                        </div>
                        <span className="font-bold text-[13.5px] text-[#1E1E2D]">
                          {isAmharic ? 'የእንቅልፍ እረፍት' : 'Sleep & Recovery'}
                        </span>
                        <span className="text-[11px] text-[#8E8E9F] mt-0.5">
                          {sleepHoursLogged}h / {sleepTarget}h
                        </span>
                      </button>

                      {/* Log Weight */}
                      <button
                        onClick={() => setActiveTab('weight')}
                        className="p-3.5 rounded-2xl bg-[#FAF5FF] border border-[#C084FC]/20 flex flex-col items-start text-left cursor-pointer transition-transform active:scale-95"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#A855F7] text-white flex items-center justify-center mb-2 shadow-xs">
                          <Scale className="w-4.5 h-4.5" />
                        </div>
                        <span className="font-bold text-[13.5px] text-[#1E1E2D]">
                          {isAmharic ? 'ክብደት መዝግብ' : 'Body Weigh-In'}
                        </span>
                        <span className="text-[11px] text-[#8E8E9F] mt-0.5">
                          {user.weightKg} kg
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* 2. HYDRATION TRACKER TAB */}
                {/* ========================================== */}
                {activeTab === 'water' && (
                  <div className="space-y-4">
                    {/* Status & Progress Card */}
                    <div className="bg-[#EEF1FE] rounded-2xl p-4 border border-[#5C71F3]/20 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-[#5C71F3] uppercase tracking-wider block">
                          {isAmharic ? 'የዛሬው የውኃ መጠን' : "Today's Hydration"}
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-2xl font-black text-[#1E1E2D]">
                            {currentWaterL.toFixed(1)}
                          </span>
                          <span className="text-sm font-bold text-[#8E8E9F]">
                            / {waterTarget.toFixed(1)} L
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-[#5C71F3]">
                          {waterPercent}%
                        </span>
                        <span className="text-[10px] text-[#8E8E9F] block">
                          {isAmharic ? 'የተሟላ' : 'Goal Met'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#E9ECF4] h-2.5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#5C71F3] to-[#00D09E] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${waterPercent}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>

                    {/* Quick Add Presets */}
                    <div>
                      <label className="text-[11.5px] font-bold text-[#8E8E9F] uppercase tracking-wider block mb-2">
                        {isAmharic ? 'ፈጣን መጨመሪያ' : 'Quick Add Presets'}
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { ml: 250, l: 0.25 },
                          { ml: 500, l: 0.5 },
                          { ml: 750, l: 0.75 },
                          { ml: 1000, l: 1.0 },
                        ].map((preset) => (
                          <button
                            key={preset.ml}
                            onClick={() => {
                              addWaterL(preset.l);
                              triggerSuccess(
                                isAmharic ? `+${preset.ml}ml ውኃ ተመዝግቧል!` : `+${preset.ml}ml water logged!`
                              );
                            }}
                            className="py-3 px-1.5 rounded-2xl bg-[#EEF1FE] hover:bg-[#5C71F3] hover:text-white text-[#5C71F3] font-black text-[13px] border border-[#5C71F3]/25 flex flex-col items-center justify-center cursor-pointer transition-all shadow-2xs active:scale-95"
                          >
                            <span>+{preset.ml}</span>
                            <span className="text-[10px] opacity-75 font-medium">ml</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Stepper / Adjustments */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#F0F1F6]">
                      <button
                        onClick={() => {
                          addWaterL(-0.25);
                          triggerSuccess(isAmharic ? '-250ml ተቀንሷል' : '-250ml adjusted');
                        }}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#F5F6FA] hover:bg-[#E9ECF4] text-[#8E8E9F] font-bold text-[11.5px] cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                        <span>{isAmharic ? '250ml ቀንስ' : '-250 ml'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setWaterL(0);
                          triggerSuccess(isAmharic ? 'የውኃ መጠኑ ወደ ዜሮ ተመልሷል' : 'Water reset to 0L');
                        }}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#FFF1F1] hover:bg-[#FFE4E4] text-[#FF5C5C] font-bold text-[11.5px] cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isAmharic ? 'እንደገና ጀምር' : 'Reset'}</span>
                      </button>
                    </div>

                    {/* Nutrition Coach Hydration Insight */}
                    <div className="p-3 bg-[#F8F9FD] rounded-2xl border border-[#E9ECF4] flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#5C71F3] shrink-0 mt-0.5" />
                      <p className="text-[11.5px] text-[#6C7084] leading-relaxed">
                        {isAmharic
                          ? `ለእርስዎ ክብደት (${user.weightKg}kg) እና የስልጠና ግብ፣ በቀን ${waterTarget}L መጠጣት የጡንቻን እድገት እና ድካምን ለመቀነስ ወሳኝ ነው።`
                          : `For your body weight (${user.weightKg}kg) and goals, drinking ${waterTarget}L daily accelerates glycogen synthesis and prevents muscle fatigue.`}
                      </p>
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* 3. DAILY STEPS TRACKER TAB */}
                {/* ========================================== */}
                {activeTab === 'steps' && (
                  <div className="space-y-4">
                    {/* Status Card */}
                    <div className="bg-[#E6FAF5] rounded-2xl p-4 border border-[#00D09E]/25 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-[#00D09E] uppercase tracking-wider block">
                          {isAmharic ? 'የዛሬው እርምጃ' : "Today's Step Count"}
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-2xl font-black text-[#1E1E2D]">
                            {currentSteps.toLocaleString()}
                          </span>
                          <span className="text-sm font-bold text-[#8E8E9F]">
                            / {stepsTarget.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-[#00D09E]">
                          {stepsPercent}%
                        </span>
                        <span className="text-[10px] text-[#8E8E9F] block">
                          ~{estimatedCaloriesBurned} kcal
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#E9ECF4] h-2.5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#00D09E] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${stepsPercent}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>

                    {/* Quick Add Presets */}
                    <div>
                      <label className="text-[11.5px] font-bold text-[#8E8E9F] uppercase tracking-wider block mb-2">
                        {isAmharic ? 'ፈጣን የእርምጃ መጨመሪያ' : 'Quick Step Presets'}
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[1000, 2500, 5000, 10000].map((stepAdd) => (
                          <button
                            key={stepAdd}
                            onClick={() => {
                              addSteps(stepAdd);
                              triggerSuccess(
                                isAmharic
                                  ? `+${stepAdd.toLocaleString()} እርምጃ ተመዝግቧል!`
                                  : `+${stepAdd.toLocaleString()} steps logged!`
                              );
                            }}
                            className="py-3 px-1.5 rounded-2xl bg-[#E6FAF5] hover:bg-[#00D09E] hover:text-white text-[#00D09E] font-black text-[12.5px] border border-[#00D09E]/25 flex flex-col items-center justify-center cursor-pointer transition-all shadow-2xs active:scale-95"
                          >
                            <span>+{stepAdd >= 1000 ? `${stepAdd / 1000}k` : stepAdd}</span>
                            <span className="text-[9.5px] opacity-80 font-medium">steps</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Exact Input */}
                    <div>
                      <label className="text-[11.5px] font-bold text-[#8E8E9F] uppercase tracking-wider block mb-1.5">
                        {isAmharic ? 'ትክክለኛ የእርምጃ ቁጥር አስገባ' : 'Set Exact Steps (e.g. from Pedometer / Watch)'}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={customStepsInput}
                          onChange={(e) => setCustomStepsInput(e.target.value)}
                          placeholder="e.g. 8450"
                          className="flex-1 h-12 rounded-2xl bg-[#F5F6FA] border border-[#E5E7EB] px-4 text-[16px] font-bold text-[#1E1E2D] outline-none focus:border-[#00D09E]"
                        />
                        <button
                          onClick={() => {
                            const val = parseInt(customStepsInput, 10);
                            if (!isNaN(val) && val >= 0) {
                              setSteps(val);
                              triggerSuccess(
                                isAmharic
                                  ? `እርምጃ ወደ ${val.toLocaleString()} ተዘምኗል!`
                                  : `Steps updated to ${val.toLocaleString()}!`
                              );
                            }
                          }}
                          className="px-5 h-12 rounded-2xl bg-[#00D09E] hover:bg-[#00b589] text-white font-bold text-[14px] cursor-pointer shadow-xs"
                        >
                          {isAmharic ? 'አስቀምጥ' : 'Update'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* 4. SLEEP & RECOVERY TAB */}
                {/* ========================================== */}
                {activeTab === 'sleep' && (
                  <div className="space-y-4">
                    {/* Status Card */}
                    <div className="bg-[#F5ECFD] rounded-2xl p-4 border border-[#9D5CE5]/25 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-[#9D5CE5] uppercase tracking-wider block">
                          {isAmharic ? 'የዛሬው እንቅልፍና እረፍት' : "Today's Recovery Sleep"}
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-2xl font-black text-[#1E1E2D]">
                            {sleepHoursLogged.toFixed(1)}
                          </span>
                          <span className="text-sm font-bold text-[#8E8E9F]">
                            / {sleepTarget.toFixed(1)} hrs
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-[#9D5CE5]">
                          {sleepPercent}%
                        </span>
                        <span className="text-[10px] text-[#8E8E9F] block">
                          {sleepHoursLogged >= sleepTarget
                            ? isAmharic ? 'ሙሉ እረፍት ✨' : 'Optimal ✨'
                            : isAmharic ? 'ተጨማሪ እረፍት ያስፈልጋል' : 'Needs Rest'}
                        </span>
                      </div>
                    </div>

                    {/* Sleep Hours Quick Presets */}
                    <div>
                      <label className="text-[11.5px] font-bold text-[#8E8E9F] uppercase tracking-wider block mb-2">
                        {isAmharic ? 'የእንቅልፍ ርዝማኔ ይምረጡ' : 'Select Sleep Duration'}
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[6.0, 7.0, 7.5, 8.0, 8.5, 9.0].slice(0, 4).map((hrs) => (
                          <button
                            key={hrs}
                            onClick={() => {
                              logSleep(hrs);
                              triggerSuccess(
                                isAmharic ? `${hrs} ሰዓት እንቅልፍ ተመዝግቧል!` : `${hrs} hours sleep logged!`
                              );
                            }}
                            className={`py-3 px-1.5 rounded-2xl font-black text-[13px] border flex flex-col items-center justify-center cursor-pointer transition-all shadow-2xs active:scale-95 ${
                              sleepHoursLogged === hrs
                                ? 'bg-[#9D5CE5] text-white border-[#9D5CE5]'
                                : 'bg-[#F5ECFD] text-[#9D5CE5] border-[#9D5CE5]/25 hover:bg-[#9D5CE5] hover:text-white'
                            }`}
                          >
                            <span>{hrs}</span>
                            <span className="text-[9.5px] opacity-80 font-medium">hrs</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sleep Quality Selector */}
                    <div>
                      <label className="text-[11.5px] font-bold text-[#8E8E9F] uppercase tracking-wider block mb-1.5">
                        {isAmharic ? 'የእንቅልፍ ጥራት' : 'Sleep Quality'}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'deep', label: isAmharic ? 'ጥልቅና ደስ የሚል' : 'Deep & Restful', emoji: '😴' },
                          { id: 'good', label: isAmharic ? 'ጥሩ እረፍት' : 'Good / Normal', emoji: '😌' },
                          { id: 'light', label: isAmharic ? 'መቆራረጥ የነበረው' : 'Light / Broken', emoji: '🥱' },
                        ].map((q) => (
                          <button
                            key={q.id}
                            onClick={() => setSleepQuality(q.id as any)}
                            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                              sleepQuality === q.id
                                ? 'bg-[#9D5CE5] text-white border-[#9D5CE5] font-bold shadow-xs'
                                : 'bg-[#F8F9FD] text-[#1E1E2D] border-[#E5E7EB] hover:border-[#9D5CE5]/40 text-[11.5px]'
                            }`}
                          >
                            <span className="text-base block mb-0.5">{q.emoji}</span>
                            <span className="text-[11px] block leading-tight">{q.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Sleep Input Slider/Stepper */}
                    <div className="flex gap-2 items-center pt-2 border-t border-[#F0F1F6]">
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        max="16"
                        value={sleepInput}
                        onChange={(e) => setSleepInput(e.target.value)}
                        placeholder="Hours"
                        className="w-24 h-11 rounded-xl bg-[#F5F6FA] border border-[#E5E7EB] px-3 text-[15px] font-bold text-[#1E1E2D] text-center outline-none focus:border-[#9D5CE5]"
                      />
                      <button
                        onClick={() => {
                          const val = parseFloat(sleepInput);
                          if (!isNaN(val) && val > 0 && val <= 24) {
                            logSleep(val);
                            triggerSuccess(
                              isAmharic ? `${val} ሰዓት እንቅልፍ ተመዝግቧል!` : `${val} hrs sleep logged!`
                            );
                          }
                        }}
                        className="flex-1 h-11 rounded-xl bg-[#9D5CE5] hover:bg-[#8B48D5] text-white font-bold text-[13.5px] cursor-pointer"
                      >
                        {isAmharic ? 'የእንቅልፍ ሰዓት መዝግብ' : 'Save Sleep Hours'}
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* 5. BODY WEIGHT LOG TAB */}
                {/* ========================================== */}
                {activeTab === 'weight' && (
                  <div className="space-y-4">
                    {/* Weight Overview */}
                    <div className="bg-[#FFF7E6] rounded-2xl p-4 border border-[#FFB020]/25 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-[#FFB020] uppercase tracking-wider block">
                          {isAmharic ? 'የመጨረሻ የተመዘገበ ክብደት' : 'Latest Weigh-In'}
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-2xl font-black text-[#1E1E2D]">
                            {user.weightKg || 75.0}
                          </span>
                          <span className="text-sm font-bold text-[#8E8E9F]">
                            kg
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#1E1E2D] block">
                          {user.targetWeightKg ? `${user.targetWeightKg} kg` : '--'}
                        </span>
                        <span className="text-[10px] text-[#8E8E9F] block">
                          {isAmharic ? 'የዒላማ ክብደት' : 'Target Weight'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[12px] font-bold text-[#8E8E9F] uppercase tracking-wider block mb-1.5">
                        {isAmharic ? 'የዛሬው የሰውነት ክብደት (ኪ.ግ)' : 'Log New Weigh-In (kg)'}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={weightInput}
                        onChange={(e) => setWeightInput(e.target.value)}
                        className="w-full h-12 rounded-2xl bg-[#F5F6FA] border border-[#E5E7EB] px-4 text-[18px] font-bold text-[#1E1E2D] outline-none focus:border-[#5C71F3]"
                      />
                    </div>

                    <button
                      onClick={() => {
                        const val = parseFloat(weightInput);
                        if (!isNaN(val) && val > 30 && val < 250) {
                          logWeight(val);
                          triggerSuccess(
                            isAmharic ? `ክብደት (${val}kg) ተመዝግቧል!` : `Weigh-in (${val} kg) saved!`
                          );
                        }
                      }}
                      className="w-full h-12 rounded-2xl bg-[#5C71F3] hover:bg-[#4B62EB] text-white font-bold text-[15px] cursor-pointer transition-colors shadow-xs"
                    >
                      {isAmharic ? 'የክብደት መረጃ አስቀምጥ' : 'Save Weigh-In'}
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
