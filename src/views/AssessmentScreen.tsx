import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  FitnessProfile,
  UserGoal,
  Gender,
  ExperienceLevel,
  EquipmentType,
} from '../types';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Dumbbell,
  Flame,
  Zap,
  ShieldCheck,
  Activity,
  Heart,
  Droplets,
  Moon,
  Minus,
  Plus,
} from 'lucide-react';

export const AssessmentScreen: React.FC = () => {
  const { user, completeOnboarding, setRoute, t, language } = useApp();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 16;

  // Questionnaire State Model
  const [fullName, setFullName] = useState(user.name || (language === 'am' ? 'ዳንኤል መኮንን' : 'Daniel Mekonnen'));
  const [goal, setGoal] = useState<UserGoal>(user.goal || 'build_muscle');
  const [gender, setGender] = useState<Gender>(user.gender || 'male');
  const [age, setAge] = useState<number>(user.age || 26);
  const [heightCm, setHeightCm] = useState<number>(user.heightCm || 178);
  const [weightKg, setWeightKg] = useState<number>(user.weightKg || 76.5);
  const [weightInput, setWeightInput] = useState<string>(String(user.weightKg || 76.5));
  const [targetWeightKg, setTargetWeightKg] = useState<number>(user.targetWeightKg || 80);
  const [targetWeightInput, setTargetWeightInput] = useState<string>(String(user.targetWeightKg || 80));
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(user.experience || 'intermediate');
  const [trainingDaysPerWeek, setTrainingDaysPerWeek] = useState<number>(user.workoutFrequencyDays || 4);
  const [preferredWorkoutDuration, setPreferredWorkoutDuration] = useState<number>(user.workoutDurationMin || 60);
  const [equipment, setEquipment] = useState<EquipmentType[]>(user.equipment || ['gym', 'barbell', 'dumbbells', 'machines']);
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'very_active'>('moderate');
  const [waterIntake, setWaterIntake] = useState<'less_1L' | '1_2L' | '2_3L' | '3L_plus'>('2_3L');
  const [dietPreference, setDietPreference] = useState<'no_pref' | 'high_protein' | 'balanced' | 'vegetarian' | 'vegan' | 'other'>('high_protein');
  const [allergies, setAllergies] = useState<string[]>(['None']);
  const [sleepHours, setSleepHours] = useState<number>(8);
  
  // Optional measurements
  const [waistCm, setWaistCm] = useState<number | undefined>(undefined);
  const [chestCm, setChestCm] = useState<number | undefined>(undefined);
  const [armsCm, setArmsCm] = useState<number | undefined>(undefined);
  const [bodyFatPct, setBodyFatPct] = useState<number | undefined>(undefined);

  const toggleEquipment = (eq: EquipmentType) => {
    setEquipment((prev) =>
      prev.includes(eq) ? (prev.length > 1 ? prev.filter((e) => e !== eq) : prev) : [...prev, eq]
    );
  };

  const toggleAllergy = (allergy: string) => {
    if (allergy === 'None' || allergy === 'ምንም') {
      setAllergies(['None']);
      return;
    }
    setAllergies((prev) => {
      const filtered = prev.filter((a) => a !== 'None' && a !== 'ምንም');
      return filtered.includes(allergy)
        ? filtered.length > 0
          ? filtered.filter((a) => a !== allergy)
          : ['None']
        : [...filtered, allergy];
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finished all 16 questions -> Save to state and navigate to plan generation
      const firstName = fullName.trim().split(' ')[0] || (language === 'am' ? 'አትሌት' : 'Athlete');
      const completeProfile: FitnessProfile = {
        fullName: fullName.trim(),
        firstName,
        email: user.email || 'athlete@dagifitness.com',
        language,
        goal,
        gender,
        age,
        heightCm,
        weightKg,
        targetWeightKg,
        experienceLevel,
        trainingDaysPerWeek,
        preferredWorkoutDuration,
        equipment,
        activityLevel,
        waterIntake,
        dietPreference,
        allergies,
        sleepHours,
        bodyMeasurements: {
          waistCm,
          chestCm,
          armsCm,
          bodyFatPct,
        },
      };

      completeOnboarding({
        name: completeProfile.fullName,
        goal: completeProfile.goal,
        gender: completeProfile.gender,
        age: completeProfile.age,
        heightCm: completeProfile.heightCm,
        weightKg: completeProfile.weightKg,
        targetWeightKg: completeProfile.targetWeightKg,
        experience: completeProfile.experienceLevel,
        workoutFrequencyDays: completeProfile.trainingDaysPerWeek,
        workoutDurationMin: completeProfile.preferredWorkoutDuration,
        equipment: completeProfile.equipment,
      });

      setRoute('plan-generating');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setRoute('onboarding');
    }
  };

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="relative flex-1 flex flex-col justify-between p-6 bg-[#F5F6FA] overflow-y-auto no-scrollbar">
      {/* Top Progress & Header */}
      <div>
        <div className="flex items-center justify-between pt-2 mb-3">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-2xl bg-white border border-[#EBEBF4] flex items-center justify-center text-[#1E1E2D] card-shadow cursor-pointer hover:border-[#5C71F3]/40 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <span className="text-[12px] font-bold text-[#8E8E9F]">
            {language === 'am' ? `ጥያቄ ${currentStep} ከ ${totalSteps}` : `Question ${currentStep} of ${totalSteps}`}
          </span>

          <span className="text-[12px] font-extrabold text-[#5C71F3]">
            {progressPercent}%
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-[#5C71F3] rounded-full"
          />
        </div>
      </div>

      {/* Question Canvas */}
      <div className="my-auto py-2">
        <AnimatePresence mode="wait">
          {/* Q1: Name */}
          {currentStep === 1 && (
            <motion.div
              key="q-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-[22px] font-extrabold text-[#1E1E2D] tracking-tight">
                  {t('q1_name_title')}
                </h2>
                <p className="text-[13px] text-[#8E8E9F] mt-1">{t('q1_name_sub')}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#EBEBF4] card-shadow mt-4">
                <label className="text-[11px] font-bold text-[#8E8E9F] uppercase tracking-wider block mb-1">
                  {language === 'am' ? 'ሙሉ ስም / የሚጠሩበት ስም' : 'Full Name / Preferred Call Name'}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={language === 'am' ? 'ለምሳሌ ዳንኤል መኮንን' : 'e.g. Daniel Mekonnen'}
                  className="w-full text-[18px] font-bold text-[#1E1E2D] outline-none border-b-2 border-[#5C71F3] pb-1 pt-1"
                />
              </div>
            </motion.div>
          )}

          {/* Q2: Primary Goal */}
          {currentStep === 2 && (
            <motion.div
              key="q-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-[22px] font-extrabold text-[#1E1E2D] tracking-tight">
                  {t('q2_goal_title')}
                </h2>
                <p className="text-[13px] text-[#8E8E9F] mt-1">{t('q2_goal_sub')}</p>
              </div>

              <div className="space-y-2.5 pt-1">
                {[
                  { id: 'build_muscle', title: language === 'am' ? 'ጡንቻ መገንባት' : 'Build Muscle', sub: language === 'am' ? 'የጡንቻ መጠን እና ጥንካሬ ማሳደግ' : 'Hypertrophy & muscle fullness', icon: <Dumbbell className="w-5 h-5 text-[#5C71F3]" /> },
                  { id: 'lose_weight', title: language === 'am' ? 'ክብደት መቀነስ' : 'Lose Weight', sub: language === 'am' ? 'ካሎሪ ማቃጠል እና ስብ መቀነስ' : 'Calorie deficit & fat oxidation', icon: <Flame className="w-5 h-5 text-[#FF5C5C]" /> },
                  { id: 'burn_fat', title: language === 'am' ? 'ስብ ማቃጠል' : 'Burn Fat', sub: language === 'am' ? 'የተስተካከለ እና የጠነከረ ቅርጽ' : 'Lean muscle retention & metabolic toning', icon: <Activity className="w-5 h-5 text-[#FFB020]" /> },
                  { id: 'get_stronger', title: language === 'am' ? 'የበለጠ መጠከር' : 'Get Stronger', sub: language === 'am' ? 'ከፍተኛ ኃይል እና ጉልበት' : 'Compound power & raw strength', icon: <Zap className="w-5 h-5 text-[#9D5CE5]" /> },
                  { id: 'improve_endurance', title: language === 'am' ? 'ጽናት ማሻሻል' : 'Improve Endurance', sub: language === 'am' ? 'የልብ እና የመተንፈስ አቅም' : 'Aerobic capacity & stamina', icon: <Heart className="w-5 h-5 text-[#00C48C]" /> },
                  { id: 'improve_fitness', title: language === 'am' ? 'አጠቃላይ ጤንነት ማሻሻል' : 'Improve Overall Fitness', sub: language === 'am' ? 'ተለዋዋጭነት፣ ጤንነት እና ረጅም ዕድሜ' : 'Mobility, wellness & longevity', icon: <ShieldCheck className="w-5 h-5 text-[#00D09E]" /> },
                ].map((item) => {
                  const isSelected = goal === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setGoal(item.id as UserGoal)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#5C71F3] shadow-md ring-2 ring-[#5C71F3]/10'
                          : 'bg-white border-[#EBEBF4] hover:border-[#5C71F3]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F5F6FA] flex items-center justify-center">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="text-[14px] font-bold text-[#1E1E2D]">{item.title}</h4>
                          <p className="text-[11px] text-[#8E8E9F]">{item.sub}</p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isSelected
                            ? 'bg-[#5C71F3] border-[#5C71F3] text-white'
                            : 'border-[#D9DCED]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Q3: Gender */}
          {currentStep === 3 && (
            <motion.div
              key="q-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-[22px] font-extrabold text-[#1E1E2D] tracking-tight">
                  {t('q3_gender_title')}
                </h2>
                <p className="text-[13px] text-[#8E8E9F] mt-1">{t('q3_gender_sub')}</p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { id: 'male', label: t('gender_male') },
                  { id: 'female', label: t('gender_female') },
                  { id: 'other', label: t('gender_other') },
                ].map((g) => {
                  const isSelected = gender === g.id;
                  return (
                    <div
                      key={g.id}
                      onClick={() => setGender(g.id as Gender)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#5C71F3] shadow-md ring-2 ring-[#5C71F3]/10'
                          : 'bg-white border-[#EBEBF4]'
                      }`}
                    >
                      <span className="text-[15px] font-bold text-[#1E1E2D]">{g.label}</span>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                          isSelected ? 'bg-[#5C71F3] border-[#5C71F3] text-white' : 'border-[#D9DCED]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Q4: Age */}
          {currentStep === 4 && (
            <motion.div
              key="q-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-[22px] font-extrabold text-[#1E1E2D] tracking-tight">
                  {t('q4_age_title')}
                </h2>
                <p className="text-[13px] text-[#8E8E9F] mt-1">{t('q4_age_sub')}</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#EBEBF4] card-shadow text-center space-y-4">
                <div className="text-[48px] font-black text-[#5C71F3]">{age}</div>
                <span className="text-[13px] font-bold text-[#8E8E9F] uppercase">{t('years_old_unit')}</span>
                <input
                  type="range"
                  min="16"
                  max="80"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="w-full accent-[#5C71F3]"
                />
              </div>
            </motion.div>
          )}

          {/* Q5: Height */}
          {currentStep === 5 && (
            <motion.div
              key="q-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-[22px] font-extrabold text-[#1E1E2D] tracking-tight">
                  {t('q5_height_title')}
                </h2>
                <p className="text-[13px] text-[#8E8E9F] mt-1">{t('q5_height_sub')}</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#EBEBF4] card-shadow text-center space-y-4">
                <div className="text-[48px] font-black text-[#5C71F3]">
                  {heightCm} <span className="text-[20px] font-bold text-[#8E8E9F]">cm</span>
                </div>
                <input
                  type="range"
                  min="130"
                  max="220"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseInt(e.target.value))}
                  className="w-full accent-[#5C71F3]"
                />
              </div>
            </motion.div>
          )}

          {/* Q6: Weight */}
          {currentStep === 6 && (
            <motion.div
              key="q-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-[22px] font-extrabold text-[#1E1E2D] tracking-tight">
                  {t('q6_weight_title')}
                </h2>
                <p className="text-[13px] text-[#8E8E9F] mt-1">{t('q6_weight_sub')}</p>
              </div>

              {/* Current Weight Card */}
              <div className="bg-white p-4.5 rounded-2xl border border-[#EBEBF4] card-shadow space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#8E8E9F] uppercase tracking-wider">
                    {t('current_weight')}
                  </label>
                  <span className="text-[11px] font-extrabold text-[#5C71F3] bg-[#EEF2FF] px-2 py-0.5 rounded-md">
                    {language === 'am' ? 'የአሁን ክብደት' : 'Active Weight'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = Math.max(35, Math.round((weightKg - 0.5) * 10) / 10);
                      setWeightKg(updated);
                      setWeightInput(String(updated));
                    }}
                    className="w-11 h-11 rounded-xl bg-[#F5F6FA] hover:bg-[#ECEEF5] active:scale-95 text-[#1E1E2D] flex items-center justify-center font-black transition-all border border-[#EBEBF4] cursor-pointer"
                    aria-label="Decrease current weight"
                  >
                    <Minus className="w-5 h-5 text-[#475569]" />
                  </button>

                  <div className="flex-1 flex items-baseline justify-center gap-1 bg-[#F8FAFC] py-2 px-3 rounded-xl border border-[#E2E8F0]">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={weightInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        // Allow digits, single dot, or empty while typing
                        if (/^\d*\.?\d*$/.test(val)) {
                          setWeightInput(val);
                          const parsed = parseFloat(val);
                          if (!isNaN(parsed) && parsed > 0 && parsed <= 300) {
                            setWeightKg(parsed);
                          }
                        }
                      }}
                      onBlur={() => {
                        const parsed = parseFloat(weightInput);
                        if (isNaN(parsed) || parsed < 30) {
                          setWeightKg(70);
                          setWeightInput('70.0');
                        } else {
                          const normalized = Math.min(250, Math.max(35, parsed));
                          setWeightKg(normalized);
                          setWeightInput(String(normalized));
                        }
                      }}
                      className="w-24 text-center text-[28px] font-black text-[#1E1E2D] outline-none bg-transparent"
                    />
                    <span className="text-base font-bold text-[#8E8E9F]">kg</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = Math.min(250, Math.round((weightKg + 0.5) * 10) / 10);
                      setWeightKg(updated);
                      setWeightInput(String(updated));
                    }}
                    className="w-11 h-11 rounded-xl bg-[#F5F6FA] hover:bg-[#ECEEF5] active:scale-95 text-[#1E1E2D] flex items-center justify-center font-black transition-all border border-[#EBEBF4] cursor-pointer"
                    aria-label="Increase current weight"
                  >
                    <Plus className="w-5 h-5 text-[#475569]" />
                  </button>
                </div>

                {/* Quick adjustments */}
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  {[-5, -1, 1, 5].map((delta) => (
                    <button
                      key={`curr-${delta}`}
                      type="button"
                      onClick={() => {
                        const updated = Math.min(250, Math.max(35, Math.round((weightKg + delta) * 10) / 10));
                        setWeightKg(updated);
                        setWeightInput(String(updated));
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] active:scale-95 transition-all cursor-pointer"
                    >
                      {delta > 0 ? `+${delta} kg` : `${delta} kg`}
                    </button>
                  ))}
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min="40"
                  max="160"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => {
                    const parsed = parseFloat(e.target.value);
                    setWeightKg(parsed);
                    setWeightInput(String(parsed));
                  }}
                  className="w-full accent-[#5C71F3] cursor-pointer"
                />
              </div>

              {/* Target Weight Card */}
              <div className="bg-white p-4.5 rounded-2xl border border-[#EBEBF4] card-shadow space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#8E8E9F] uppercase tracking-wider">
                    {t('target_weight')}
                  </label>
                  <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${
                    targetWeightKg > weightKg 
                      ? 'text-emerald-700 bg-emerald-50' 
                      : targetWeightKg < weightKg 
                        ? 'text-amber-700 bg-amber-50' 
                        : 'text-slate-700 bg-slate-100'
                  }`}>
                    {targetWeightKg > weightKg 
                      ? `+${(targetWeightKg - weightKg).toFixed(1)} kg (${language === 'am' ? 'ጡንቻ መገንባት' : 'Muscle Gain'})`
                      : targetWeightKg < weightKg 
                        ? `${(targetWeightKg - weightKg).toFixed(1)} kg (${language === 'am' ? 'ክብደት መቀነስ' : 'Fat Loss'})`
                        : (language === 'am' ? 'ክብደት መጠበቅ' : 'Maintenance')}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = Math.max(35, Math.round((targetWeightKg - 0.5) * 10) / 10);
                      setTargetWeightKg(updated);
                      setTargetWeightInput(String(updated));
                    }}
                    className="w-11 h-11 rounded-xl bg-[#F5F6FA] hover:bg-[#ECEEF5] active:scale-95 text-[#5C71F3] flex items-center justify-center font-black transition-all border border-[#EBEBF4] cursor-pointer"
                    aria-label="Decrease target weight"
                  >
                    <Minus className="w-5 h-5 text-[#5C71F3]" />
                  </button>

                  <div className="flex-1 flex items-baseline justify-center gap-1 bg-[#EEF2FF]/40 py-2 px-3 rounded-xl border border-[#C7D2FE]">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={targetWeightInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*\.?\d*$/.test(val)) {
                          setTargetWeightInput(val);
                          const parsed = parseFloat(val);
                          if (!isNaN(parsed) && parsed > 0 && parsed <= 300) {
                            setTargetWeightKg(parsed);
                          }
                        }
                      }}
                      onBlur={() => {
                        const parsed = parseFloat(targetWeightInput);
                        if (isNaN(parsed) || parsed < 30) {
                          setTargetWeightKg(75);
                          setTargetWeightInput('75.0');
                        } else {
                          const normalized = Math.min(250, Math.max(35, parsed));
                          setTargetWeightKg(normalized);
                          setTargetWeightInput(String(normalized));
                        }
                      }}
                      className="w-24 text-center text-[28px] font-black text-[#5C71F3] outline-none bg-transparent"
                    />
                    <span className="text-base font-bold text-[#5C71F3]">kg</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = Math.min(250, Math.round((targetWeightKg + 0.5) * 10) / 10);
                      setTargetWeightKg(updated);
                      setTargetWeightInput(String(updated));
                    }}
                    className="w-11 h-11 rounded-xl bg-[#F5F6FA] hover:bg-[#ECEEF5] active:scale-95 text-[#5C71F3] flex items-center justify-center font-black transition-all border border-[#EBEBF4] cursor-pointer"
                    aria-label="Increase target weight"
                  >
                    <Plus className="w-5 h-5 text-[#5C71F3]" />
                  </button>
                </div>

                {/* Quick adjustments */}
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  {[-5, -1, 1, 5].map((delta) => (
                    <button
                      key={`tgt-${delta}`}
                      type="button"
                      onClick={() => {
                        const updated = Math.min(250, Math.max(35, Math.round((targetWeightKg + delta) * 10) / 10));
                        setTargetWeightKg(updated);
                        setTargetWeightInput(String(updated));
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#EEF2FF] text-[#5C71F3] hover:bg-[#E0E7FF] active:scale-95 transition-all cursor-pointer"
                    >
                      {delta > 0 ? `+${delta} kg` : `${delta} kg`}
                    </button>
                  ))}
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min="40"
                  max="160"
                  step="0.5"
                  value={targetWeightKg}
                  onChange={(e) => {
                    const parsed = parseFloat(e.target.value);
                    setTargetWeightKg(parsed);
                    setTargetWeightInput(String(parsed));
                  }}
                  className="w-full accent-[#5C71F3] cursor-pointer"
                />
              </div>
            </motion.div>
          )}

          {/* Q7: Experience */}
          {currentStep === 7 && (
            <motion.div
              key="q-7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-[22px] font-extrabold text-[#1E1E2D] tracking-tight">
                  {t('q7_exp_title')}
                </h2>
                <p className="text-[13px] text-[#8E8E9F] mt-1">{t('q7_exp_sub')}</p>
              </div>

              <div className="space-y-3 pt-1">
                {[
                  { id: 'beginner', title: language === 'am' ? 'ጀማሪ' : 'Beginner', desc: language === 'am' ? 'ከ 6 ወር በታች የጂም ልምድ' : 'Less than 6 months of regular gym training' },
                  { id: 'intermediate', title: language === 'am' ? 'መካከለኛ' : 'Intermediate', desc: language === 'am' ? 'ከ 6 ወር እስከ 2 ዓመት ተከታታይ ስልጠና' : '6 months to 2 years of structured resistance workouts' },
                  { id: 'advanced', title: language === 'am' ? 'ከፍተኛ' : 'Advanced', desc: language === 'am' ? 'ከ 2 ዓመት በላይ ከባድ ልምድ' : '2+ years of heavy lifting & progressive overload' },
                ].map((exp) => {
                  const isSelected = experienceLevel === exp.id;
                  return (
                    <div
                      key={exp.id}
                      onClick={() => setExperienceLevel(exp.id as ExperienceLevel)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#5C71F3] shadow-md ring-2 ring-[#5C71F3]/10'
                          : 'bg-white border-[#EBEBF4]'
                      }`}
                    >
                      <div>
                        <h4 className="text-[15px] font-bold text-[#1E1E2D]">{exp.title}</h4>
                        <p className="text-[12px] text-[#8E8E9F] mt-0.5">{exp.desc}</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                          isSelected ? 'bg-[#5C71F3] border-[#5C71F3] text-white' : 'border-[#D9DCED]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Q8: Training Days Per Week */}
          {currentStep === 8 && (
            <motion.div
              key="q-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-[22px] font-extrabold text-[#1E1E2D] tracking-tight">
                  {t('q8_days_title')}
                </h2>
                <p className="text-[13px] text-[#8E8E9F] mt-1">{t('q8_days_sub')}</p>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-2">
                {[2, 3, 4, 5, 6, 7].map((num) => {
                  const isSelected = trainingDaysPerWeek === num;
                  return (
                    <button
                      key={num}
                      onClick={() => setTrainingDaysPerWeek(num)}
                      className={`py-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#5C71F3] border-[#5C71F3] text-white shadow-md'
                          : 'bg-white border-[#EBEBF4] text-[#1E1E2D]'
                      }`}
                    >
                      <span className="text-[22px] font-black">{num}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5 opacity-80">
                        {t('days_unit')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Q9: Workout Duration */}
          {currentStep === 9 && (
            <motion.div
              key="q-9"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-[22px] font-extrabold text-[#1E1E2D] tracking-tight">
                  {t('q9_duration_title')}
                </h2>
                <p className="text-[13px] text-[#8E8E9F] mt-1">{t('q9_duration_sub')}</p>
              </div>

              <div className="space-y-2.5 pt-1">
                {[
                  { value: 20, label: language === 'am' ? '20 ደቂቃዎች' : '20 minutes', desc: language === 'am' ? 'ፈጣን እና ከፍተኛ ጉልበት' : 'Express high-intensity burst' },
                  { value: 30, label: language === 'am' ? '30 ደቂቃዎች' : '30 minutes', desc: language === 'am' ? 'አጭር እና ትኩረት ያደረገ' : 'Quick focused session' },
                  { value: 45, label: language === 'am' ? '45 ደቂቃዎች' : '45 minutes', desc: language === 'am' ? 'መደበኛ ሚዛናዊ ስልጠና' : 'Balanced standard workout' },
                  { value: 60, label: language === 'am' ? '60 ደቂቃዎች' : '60 minutes', desc: language === 'am' ? 'ሙሉ የጡንቻ እና ጥንካሬ ስራ' : 'Full hypertrophy & strength' },
                  { value: 75, label: language === 'am' ? '75+ ደቂቃዎች' : '75+ minutes', desc: language === 'am' ? 'ከፍተኛ የክብደት እና የድግግሞሽ ስልጠና' : 'Complete powerlifter / high volume' },
                ].map((dur) => {
                  const isSelected = preferredWorkoutDuration === dur.value;
                  return (
                    <div
                      key={dur.value}
                      onClick={() => setPreferredWorkoutDuration(dur.value)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#5C71F3] shadow-md ring-2 ring-[#5C71F3]/10'
                          : 'bg-white border-[#EBEBF4]'
                      }`}
                    >
                      <div>
                        <h4 className="text-[14px] font-bold text-[#1E1E2D]">{dur.label}</h4>
                        <p className="text-[11px] text-[#8E8E9F]">{dur.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isSelected ? 'bg-[#5C71F3] border-[#5C71F3] text-white' : 'border-[#D9DCED]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Q10: Equipment */}
          {currentStep === 10 && (
            <motion.div
              key="q-10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-[22px] font-extrabold text-[#1E1E2D] tracking-tight">
                  {t('q10_equipment_title')}
                </h2>
                <p className="text-[13px] text-[#8E8E9F] mt-1">{t('q10_equipment_sub')}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {[
                  { id: 'gym', label: language === 'am' ? 'ሙሉ ጂም' : 'Full Gym' },
                  { id: 'dumbbells', label: language === 'am' ? 'ዳምቤሎች' : 'Dumbbells' },
                  { id: 'barbell', label: language === 'am' ? 'ባርቤል' : 'Barbell & Rack' },
                  { id: 'machines', label: language === 'am' ? 'ኬብል ማሽኖች' : 'Cable Machines' },
                  { id: 'resistance_bands', label: language === 'am' ? 'ላስቲኮች (Bands)' : 'Bands' },
                  { id: 'bodyweight', label: language === 'am' ? 'የሰውነት ክብደት ብቻ' : 'Bodyweight Only' },
                  { id: 'mixed', label: language === 'am' ? 'የተቀላቀለ መሣሪያ' : 'Mixed Equipment' },
                ].map((eq) => {
                  const isSelected = equipment.includes(eq.id as EquipmentType);
                  return (
                    <div
                      key={eq.id}
                      onClick={() => toggleEquipment(eq.id as EquipmentType)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#5C71F3] shadow-xs ring-2 ring-[#5C71F3]/10'
                          : 'bg-white border-[#EBEBF4]'
                      }`}
                    >
                      <span className="text-[12.5px] font-bold text-[#1E1E2D]">{eq.label}</span>
                      <div
                        className={`w-4.5 h-4.5 rounded-full flex items-center justify-center border ${
                          isSelected ? 'bg-[#5C71F3] border-[#5C71F3] text-white' : 'border-[#D9DCED]'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Q11: Activity Level */}
          {currentStep === 11 && (
            <motion.div
              key="q-11"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-[22px] font-extrabold text-[#1E1E2D] tracking-tight">
                  {t('q11_activity_title')}
                </h2>
                <p className="text-[13px] text-[#8E8E9F] mt-1">{t('q11_activity_sub')}</p>
              </div>

              <div className="space-y-2.5 pt-1">
                {[
                  { id: 'sedentary', label: language === 'am' ? 'አነስተኛ እንቅስቃሴ' : 'Mostly sedentary', sub: language === 'am' ? 'የጠረጴዛ ስራ፣ አነስተኛ እርምጃዎች' : 'Desk job, low daily steps' },
                  { id: 'light', label: language === 'am' ? 'ቀላል እንቅስቃሴ' : 'Lightly active', sub: language === 'am' ? 'አልፎ አልፎ የእግር ጉዞ' : 'Occasional walks, light household tasks' },
                  { id: 'moderate', label: language === 'am' ? 'መካከለኛ እንቅስቃሴ' : 'Moderately active', sub: language === 'am' ? 'በቀን 7,000+ እርምጃዎች' : 'On feet part of the day, 7k+ steps' },
                  { id: 'very_active', label: language === 'am' ? 'በጣም ንቁ' : 'Very active', sub: language === 'am' ? 'አካላዊ ስራ ወይም ከፍተኛ እንቅስቃሴ' : 'Physical job or high daily movement' },
                ].map((act) => {
                  const isSelected = activityLevel === act.id;
                  return (
                    <div
                      key={act.id}
                      onClick={() => setActivityLevel(act.id as any)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#5C71F3] shadow-md ring-2 ring-[#5C71F3]/10'
                          : 'bg-white border-[#EBEBF4]'
                      }`}
                    >
                      <div>
                        <h4 className="text-[14px] font-bold text-[#1E1E2D]">{act.label}</h4>
                        <p className="text-[11px] text-[#8E8E9F]">{act.sub}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isSelected ? 'bg-[#5C71F3] border-[#5C71F3] text-white' : 'border-[#D9DCED]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Q12: Water Intake */}
          {currentStep === 12 && (
            <motion.div
              key="q-12"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-[22px] font-extrabold text-[#1E1E2D] tracking-tight">
                  {t('q12_water_title')}
                </h2>
                <p className="text-[13px] text-[#8E8E9F] mt-1">{t('q12_water_sub')}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { id: 'less_1L', label: language === 'am' ? 'ከ 1 ሊትር በታች' : 'Less than 1L', sub: language === 'am' ? 'ዝቅተኛ ውኃ' : 'Low hydration' },
                  { id: '1_2L', label: '1 – 2L', sub: language === 'am' ? 'መካከለኛ' : 'Moderate' },
                  { id: '2_3L', label: '2 – 3L', sub: language === 'am' ? 'ተስማሚ መጠን' : 'Optimal baseline' },
                  { id: '3L_plus', label: '3L+', sub: language === 'am' ? 'ከፍተኛ ውኃ' : 'High hydration' },
                ].map((w) => {
                  const isSelected = waterIntake === w.id;
                  return (
                    <div
                      key={w.id}
                      onClick={() => setWaterIntake(w.id as any)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white border-[#00D09E] shadow-sm ring-2 ring-[#00D09E]/15'
                          : 'bg-white border-[#EBEBF4]'
                      }`}
                    >
                      <Droplets className="w-6 h-6 text-[#00D09E] mb-2" />
                      <span className="text-[14px] font-bold text-[#1E1E2D]">{w.label}</span>
                      <span className="text-[10px] text-[#8E8E9F] mt-0.5">{w.sub}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Q13: Diet Preference */}
          {currentStep === 13 && (
            <motion.div
              key="q-13"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-[22px] font-extrabold text-[#1E1E2D] tracking-tight">
                  {t('q13_diet_title')}
                </h2>
                <p className="text-[13px] text-[#8E8E9F] mt-1">{t('q13_diet_sub')}</p>
              </div>

              <div className="space-y-2 pt-1">
                {[
                  { id: 'high_protein', label: language === 'am' ? 'ከፍተኛ ፕሮቲን' : 'High Protein', desc: language === 'am' ? 'ዶሮ፣ እንቁላል፣ ስጋ፣ አኩሪ አተር እና ፕሮቲን ዱቄት' : 'Focus on chicken, eggs, beef, whey & legumes' },
                  { id: 'balanced', label: language === 'am' ? 'ሚዛናዊ አመጋገብ' : 'Balanced', desc: language === 'am' ? 'የተመጣጠነ ካርቦሃይድሬት፣ ፕሮቲን እና ጤናማ ስብ' : 'Balanced macronutrients with diverse whole foods' },
                  { id: 'vegetarian', label: language === 'am' ? 'ቬጀቴሪያን (የአትክልት)' : 'Vegetarian', desc: language === 'am' ? 'ከስጋ ነፃ ከአይብ እና እንቁላል ጋር' : 'Plant-based with dairy & eggs' },
                  { id: 'vegan', label: language === 'am' ? 'ቪጋን' : 'Vegan', desc: language === 'am' ? '100% ሙሉ የእፅዋት ምግቦች ብቻ' : 'Strict 100% plant sources' },
                  { id: 'no_pref', label: language === 'am' ? 'የተለየ ምርጫ የለኝም' : 'No Specific Preference', desc: language === 'am' ? 'የተለመደ የተለያዩ ምግቦች' : 'Standard varied nutrition' },
                ].map((d) => {
                  const isSelected = dietPreference === d.id;
                  return (
                    <div
                      key={d.id}
                      onClick={() => setDietPreference(d.id as any)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#5C71F3] shadow-md ring-2 ring-[#5C71F3]/10'
                          : 'bg-white border-[#EBEBF4]'
                      }`}
                    >
                      <div>
                        <h4 className="text-[13.5px] font-bold text-[#1E1E2D]">{d.label}</h4>
                        <p className="text-[11px] text-[#8E8E9F]">{d.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isSelected ? 'bg-[#5C71F3] border-[#5C71F3] text-white' : 'border-[#D9DCED]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Q14: Allergies */}
          {currentStep === 14 && (
            <motion.div
              key="q-14"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-[22px] font-extrabold text-[#1E1E2D] tracking-tight">
                  {t('q14_allergies_title')}
                </h2>
                <p className="text-[13px] text-[#8E8E9F] mt-1">{t('q14_allergies_sub')}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {[
                  { id: 'None', label: language === 'am' ? 'ምንም' : 'None' },
                  { id: 'Dairy', label: language === 'am' ? 'ወተት / የወተት ተዋጽኦ' : 'Dairy' },
                  { id: 'Eggs', label: language === 'am' ? 'እንቁላል' : 'Eggs' },
                  { id: 'Nuts', label: language === 'am' ? 'ለውዝ' : 'Nuts' },
                  { id: 'Gluten', label: language === 'am' ? 'ግሉተን' : 'Gluten' },
                  { id: 'Seafood', label: language === 'am' ? 'የባህር ምግቦች' : 'Seafood' },
                  { id: 'Other', label: language === 'am' ? 'ሌላ' : 'Other' },
                ].map((allergy) => {
                  const isSelected = allergies.includes(allergy.id);
                  return (
                    <div
                      key={allergy.id}
                      onClick={() => toggleAllergy(allergy.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#5C71F3] shadow-xs ring-2 ring-[#5C71F3]/10'
                          : 'bg-white border-[#EBEBF4]'
                      }`}
                    >
                      <span className="text-[13px] font-bold text-[#1E1E2D]">{allergy.label}</span>
                      <div
                        className={`w-4.5 h-4.5 rounded-full flex items-center justify-center border ${
                          isSelected ? 'bg-[#5C71F3] border-[#5C71F3] text-white' : 'border-[#D9DCED]'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Q15: Sleep */}
          {currentStep === 15 && (
            <motion.div
              key="q-15"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-[22px] font-extrabold text-[#1E1E2D] tracking-tight">
                  {t('q15_sleep_title')}
                </h2>
                <p className="text-[13px] text-[#8E8E9F] mt-1">{t('q15_sleep_sub')}</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#EBEBF4] card-shadow text-center space-y-4">
                <Moon className="w-10 h-10 text-[#00C48C] mx-auto" />
                <div className="text-[44px] font-black text-[#1E1E2D]">
                  {sleepHours} <span className="text-[20px] font-bold text-[#8E8E9F]">{t('hours_unit')}</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="10"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="w-full accent-[#00C48C]"
                />
              </div>
            </motion.div>
          )}

          {/* Q16: Body Measurements (Optional) */}
          {currentStep === 16 && (
            <motion.div
              key="q-16"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[22px] font-extrabold text-[#1E1E2D] tracking-tight">
                    {t('q16_measurements_title')}
                  </h2>
                  <span className="text-[10px] uppercase font-bold text-[#5C71F3] bg-[#EEF1FE] px-2 py-0.5 rounded">
                    {t('optional_badge')}
                  </span>
                </div>
                <p className="text-[13px] text-[#8E8E9F] mt-1">{t('q16_measurements_sub')}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-white p-3 rounded-2xl border border-[#EBEBF4]">
                  <label className="text-[10px] font-bold text-[#8E8E9F] uppercase">{language === 'am' ? 'ወገብ (cm)' : 'Waist (cm)'}</label>
                  <input
                    type="number"
                    value={waistCm || ''}
                    onChange={(e) => setWaistCm(parseFloat(e.target.value) || undefined)}
                    placeholder="e.g. 82"
                    className="w-full text-[16px] font-bold text-[#1E1E2D] outline-none mt-1"
                  />
                </div>

                <div className="bg-white p-3 rounded-2xl border border-[#EBEBF4]">
                  <label className="text-[10px] font-bold text-[#8E8E9F] uppercase">{language === 'am' ? 'ደረት (cm)' : 'Chest (cm)'}</label>
                  <input
                    type="number"
                    value={chestCm || ''}
                    onChange={(e) => setChestCm(parseFloat(e.target.value) || undefined)}
                    placeholder="e.g. 102"
                    className="w-full text-[16px] font-bold text-[#1E1E2D] outline-none mt-1"
                  />
                </div>

                <div className="bg-white p-3 rounded-2xl border border-[#EBEBF4]">
                  <label className="text-[10px] font-bold text-[#8E8E9F] uppercase">{language === 'am' ? 'ክንድ (cm)' : 'Arms (cm)'}</label>
                  <input
                    type="number"
                    value={armsCm || ''}
                    onChange={(e) => setArmsCm(parseFloat(e.target.value) || undefined)}
                    placeholder="e.g. 38"
                    className="w-full text-[16px] font-bold text-[#1E1E2D] outline-none mt-1"
                  />
                </div>

                <div className="bg-white p-3 rounded-2xl border border-[#EBEBF4]">
                  <label className="text-[10px] font-bold text-[#8E8E9F] uppercase">{language === 'am' ? 'የስብ መጠን (%)' : 'Body Fat (%)'}</label>
                  <input
                    type="number"
                    value={bodyFatPct || ''}
                    onChange={(e) => setBodyFatPct(parseFloat(e.target.value) || undefined)}
                    placeholder="e.g. 15"
                    className="w-full text-[16px] font-bold text-[#1E1E2D] outline-none mt-1"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Continue CTA */}
      <div className="pt-3">
        <button
          id="btn-qa-continue"
          onClick={handleNext}
          className="w-full h-14 rounded-2xl bg-[#5C71F3] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-[#5C71F3]/30 hover:bg-[#4B62EB] transition-all cursor-pointer"
        >
          <span>{currentStep === totalSteps ? (language === 'am' ? 'ቪአይፒ ፕላን አዘጋጅ' : 'Generate VIP Plan') : t('continue_btn')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
