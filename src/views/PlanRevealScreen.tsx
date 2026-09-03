import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Utensils,
  Droplets,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const PlanRevealScreen: React.FC = () => {
  const { user, currentRoutine, setRoute, t, language, getLocalizedRoutine } = useApp();

  const firstName = user.name ? user.name.trim().split(' ')[0] : (language === 'am' ? 'አትሌት' : 'Athlete');

  const goalLabels: Record<string, string> = {
    build_muscle: language === 'am' ? 'ጡንቻ መገንባት' : 'Build Muscle',
    lose_weight: language === 'am' ? 'ክብደት መቀነስ' : 'Lose Weight',
    burn_fat: language === 'am' ? 'ስብ ማቃጠል' : 'Burn Fat',
    get_stronger: language === 'am' ? 'የበለጠ መጠከር' : 'Get Stronger',
    improve_endurance: language === 'am' ? 'ጽናት ማሻሻል' : 'Improve Endurance',
    improve_fitness: language === 'am' ? 'አጠቃላይ ጤንነት ማሻሻል' : 'Improve Overall Fitness',
  };

  const localizedRoutine = getLocalizedRoutine(currentRoutine);

  const handleStartJourney = () => {
    setRoute('dashboard');
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between p-6 bg-[#F5F6FA] overflow-y-auto no-scrollbar">
      {/* Brand Header */}
      <div className="pt-2 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-14 h-14 mx-auto mb-2 flex items-center justify-center"
        >
          <img
            src="/dagi-logo.jpg"
            alt="Dagi Fitness"
            className="w-full h-full object-cover rounded-2xl drop-shadow-md border border-[#5C71F3]/20"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="inline-flex items-center gap-1 bg-[#EEF1FE] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-[#5C71F3] uppercase tracking-wider mb-1.5">
          <Sparkles className="w-3 h-3" />
          <span>{language === 'am' ? 'የቪአይፒ ፕላን ዝግጁ ነው' : 'VIP Plan Ready'}</span>
        </div>

        <h2 className="text-[22px] font-black text-[#1E1E2D] tracking-tight">
          {firstName}, {t('plan_ready_title')}
        </h2>
        <p className="text-[12px] text-[#8E8E9F] mt-0.5">{t('plan_ready_sub')}</p>
      </div>

      {/* Plan Summary Card Breakdown */}
      <div className="my-auto py-3 space-y-3">
        {/* Core Metric Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-2.5"
        >
          {/* Goal & Frequency */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#EBEBF4] card-shadow">
            <span className="text-[10px] font-bold text-[#8E8E9F] uppercase block">
              {language === 'am' ? 'ዋነኛ ግብ' : 'Goal Target'}
            </span>
            <span className="text-[14px] font-extrabold text-[#5C71F3] block mt-0.5">
              {goalLabels[user.goal] || (language === 'am' ? 'ጡንቻ መገንባት' : 'Build Muscle')}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#8E8E9F] mt-1.5 font-medium">
              <Calendar className="w-3 h-3 text-[#5C71F3]" />
              <span>{user.workoutFrequencyDays || 4} {language === 'am' ? 'ቀናት / በሳምንት' : 'Days / Week'}</span>
            </div>
          </div>

          {/* Calories & Protein */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#EBEBF4] card-shadow">
            <span className="text-[10px] font-bold text-[#8E8E9F] uppercase block">
              {language === 'am' ? 'የዕለት ኃይል' : 'Daily Energy'}
            </span>
            <span className="text-[14px] font-extrabold text-[#FFB020] block mt-0.5">
              {user.targetCalories.toLocaleString()} {t('calories_unit')}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#8E8E9F] mt-1.5 font-medium">
              <Utensils className="w-3 h-3 text-[#00D09E]" />
              <span>{user.targetProteinG}g {language === 'am' ? 'የፕሮቲን ግብ' : 'Protein Target'}</span>
            </div>
          </div>
        </motion.div>

        {/* Secondary Specs: Duration & Hydration */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-3.5 rounded-2xl border border-[#EBEBF4] card-shadow flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EEF1FE] flex items-center justify-center text-[#5C71F3]">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#8E8E9F] uppercase block">
                {language === 'am' ? 'የልምምድ ቆይታ' : 'Session Time'}
              </span>
              <span className="text-[13px] font-extrabold text-[#1E1E2D]">
                {user.workoutDurationMin || 60} {language === 'am' ? 'ደቂቃዎች' : 'minutes'}
              </span>
            </div>
          </div>

          <div className="h-7 w-[1px] bg-[#EBEBF4]" />

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E6FAF5] flex items-center justify-center text-[#00D09E]">
              <Droplets className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#8E8E9F] uppercase block">
                {language === 'am' ? 'የውኃ ግብ' : 'Hydration Target'}
              </span>
              <span className="text-[13px] font-extrabold text-[#1E1E2D]">
                {user.targetWaterL} {language === 'am' ? 'ሊትር / በቀን' : 'Liters / Day'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Training Split Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-4 border border-[#EBEBF4] card-shadow space-y-2.5"
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-extrabold uppercase text-[#1E1E2D] tracking-wider">
              {t('weekly_split')}
            </span>
            <span className="text-[10px] font-bold text-[#5C71F3] bg-[#EEF1FE] px-2 py-0.5 rounded-md">
              {localizedRoutine.category} {language === 'am' ? 'ትኩረት' : 'Focus'}
            </span>
          </div>

          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between items-center p-2 rounded-xl bg-[#F5F6FA]">
              <span className="font-bold text-[#1E1E2D]">{language === 'am' ? 'ሰኞ' : 'Monday'}</span>
              <span className="font-semibold text-[#5C71F3]">{localizedRoutine.title}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-[#F5F6FA]">
              <span className="font-bold text-[#1E1E2D]">{language === 'am' ? 'ማክሰኞ' : 'Tuesday'}</span>
              <span className="font-semibold text-[#5C71F3]">{language === 'am' ? 'ጀርባ እና የላይኛው አካል' : 'Pull & Upper Back Density'}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-[#F5F6FA]">
              <span className="font-bold text-[#1E1E2D]">{language === 'am' ? 'ሐሙስ' : 'Thursday'}</span>
              <span className="font-semibold text-[#5C71F3]">{language === 'am' ? 'እግሮች እና የታችኛው አካል' : 'Legs & Lower Hypertrorophy'}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-[#F5F6FA]">
              <span className="font-bold text-[#1E1E2D]">{language === 'am' ? 'ቅዳሜ' : 'Saturday'}</span>
              <span className="font-semibold text-[#00D09E]">{language === 'am' ? 'ትከሻ፣ እጆች እና ኮንዲሽኒንግ' : 'Shoulders, Arms & Conditioning'}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA to Dashboard */}
      <div className="pt-2">
        <button
          id="btn-start-journey"
          onClick={handleStartJourney}
          className="w-full h-14 rounded-2xl bg-[#5C71F3] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-[#5C71F3]/30 hover:bg-[#4B62EB] transition-all cursor-pointer"
        >
          <span>{t('start_journey_btn')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
