import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ArrowRight, ArrowLeft, Dumbbell, Utensils, TrendingUp, Sparkles } from 'lucide-react';

export const OnboardingFlow: React.FC = () => {
  const { setRoute, t, language } = useApp();
  const [screenIndex, setScreenIndex] = useState<number>(0);

  const screens = [
    {
      theme: t('onboarding_1_theme'),
      headline: t('onboarding_1_headline'),
      sub: t('onboarding_1_sub'),
      tag: 'PERSONALIZED',
      badgeColor: '#5C71F3',
      bgAura: 'from-[#5C71F3]/15 to-[#5C71F3]/5',
      icon: <Sparkles className="w-12 h-12 text-[#5C71F3]" />,
      svgVisual: (
        <div className="relative w-44 h-44 flex items-center justify-center">
          {/* Subtle Rotating 3D Gym Sphere & Energy Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-[#5C71F3]/30"
          />
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#5C71F3] to-[#4558DC] p-0.5 shadow-xl shadow-[#5C71F3]/25 flex items-center justify-center text-white"
          >
            <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-white/20 to-transparent flex flex-col items-center justify-center p-3 backdrop-blur-xs">
              <img
                src="/dagi-logo.jpg"
                alt="Dagi Fitness"
                className="w-16 h-16 object-cover rounded-2xl drop-shadow-md"
                referrerPolicy="no-referrer"
              />
              <span className="text-[10px] font-black tracking-widest uppercase mt-1 text-white/90">
                {language === 'am' ? 'ቪአይፒ ሥርዓት' : 'VIP SYSTEM'}
              </span>
            </div>
          </motion.div>
        </div>
      ),
    },
    {
      theme: t('onboarding_2_theme'),
      headline: t('onboarding_2_headline'),
      sub: t('onboarding_2_sub'),
      tag: 'SMART TRAINING',
      badgeColor: '#5C71F3',
      bgAura: 'from-[#5C71F3]/15 to-[#00D09E]/10',
      icon: <Dumbbell className="w-12 h-12 text-[#5C71F3]" />,
      svgVisual: (
        <div className="relative w-44 h-44 flex items-center justify-center">
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-36 h-36 rounded-3xl bg-white shadow-xl border border-slate-100 p-4 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold uppercase text-[#5C71F3] bg-[#EEF1FE] px-2 py-0.5 rounded-md">
                {language === 'am' ? 'የደረት ግፊት' : 'Push Power'}
              </span>
              <span className="text-[10px] font-bold text-[#8E8E9F]">52m</span>
            </div>
            <div className="space-y-1.5 my-auto">
              <div className="h-2 w-4/5 bg-[#5C71F3] rounded-full" />
              <div className="h-2 w-3/5 bg-[#00D09E] rounded-full" />
              <div className="h-2 w-full bg-[#FFB020] rounded-full" />
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-[#1E1E2D]">
              <span>{language === 'am' ? 'ኢንክላይን ፕሬስ' : 'Incline Bench'}</span>
              <span className="text-[#00D09E]">4 {language === 'am' ? 'ሴቶች' : 'Sets'}</span>
            </div>
          </motion.div>
        </div>
      ),
    },
    {
      theme: t('onboarding_3_theme'),
      headline: t('onboarding_3_headline'),
      sub: t('onboarding_3_sub'),
      tag: 'NUTRITION & MACROS',
      badgeColor: '#00D09E',
      bgAura: 'from-[#00D09E]/15 to-[#FFB020]/10',
      icon: <Utensils className="w-12 h-12 text-[#00D09E]" />,
      svgVisual: (
        <div className="relative w-44 h-44 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-36 h-36 rounded-3xl bg-white shadow-xl border border-slate-100 p-4 flex flex-col items-center justify-center text-center relative"
          >
            <div className="relative w-20 h-20 flex items-center justify-center mb-1">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#F1F3FF]"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#00D09E]"
                  strokeDasharray="75, 100"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[12px] font-black text-[#1E1E2D]">175g</span>
            </div>
            <span className="text-[11px] font-bold text-[#8E8E9F]">
              {language === 'am' ? 'ዒላማ ፕሮቲን' : 'Target Protein'}
            </span>
          </motion.div>
        </div>
      ),
    },
    {
      theme: t('onboarding_4_theme'),
      headline: t('onboarding_4_headline'),
      sub: t('onboarding_4_sub'),
      tag: 'DATA & PROGRESS',
      badgeColor: '#FFB020',
      bgAura: 'from-[#FFB020]/15 to-[#5C71F3]/10',
      icon: <TrendingUp className="w-12 h-12 text-[#FFB020]" />,
      svgVisual: (
        <div className="relative w-44 h-44 flex items-center justify-center">
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-36 h-36 rounded-3xl bg-white shadow-xl border border-slate-100 p-4 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold uppercase text-[#FFB020] bg-[#FFF7E6] px-2 py-0.5 rounded-md">
                {language === 'am' ? 'ቀጣይነት' : 'Streak'}
              </span>
              <span className="text-[11px] font-black text-[#1E1E2D]">🔥 21 {language === 'am' ? 'ቀናት' : 'Days'}</span>
            </div>
            {/* 7-bar chart preview */}
            <div className="flex justify-between items-end h-12 px-1">
              {[40, 65, 85, 90, 75, 100, 95].map((h, i) => (
                <div key={i} className="w-2.5 bg-[#F1F3FF] rounded-t-full h-full flex items-end">
                  <div
                    style={{ height: `${h}%` }}
                    className="w-full bg-[#5C71F3] rounded-t-full"
                  />
                </div>
              ))}
            </div>
            <div className="text-[9px] font-bold text-[#8E8E9F] text-center">
              {language === 'am' ? 'የስኬት መጠን: 85%' : 'Consistency Rate: 85%'}
            </div>
          </motion.div>
        </div>
      ),
    },
  ];

  const current = screens[screenIndex];

  const handleNext = () => {
    if (screenIndex < 3) {
      setScreenIndex(screenIndex + 1);
    } else {
      setRoute('assessment');
    }
  };

  const handleBack = () => {
    if (screenIndex > 0) {
      setScreenIndex(screenIndex - 1);
    } else {
      setRoute('language');
    }
  };

  const handleSkip = () => {
    setRoute('assessment');
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between p-6 bg-[#F5F6FA] overflow-y-auto no-scrollbar">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-2xl bg-white border border-[#EBEBF4] flex items-center justify-center text-[#1E1E2D] card-shadow cursor-pointer hover:border-[#5C71F3]/40 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* 4 Step Progress Pills */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === screenIndex ? 'w-6 bg-[#5C71F3]' : 'w-2 bg-[#D9DCED]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleSkip}
          className="text-[12px] font-bold text-[#8E8E9F] hover:text-[#5C71F3] transition-colors cursor-pointer"
        >
          {t('skip_btn')}
        </button>
      </div>

      {/* Main Animated Visual Canvas */}
      <div className="my-auto py-4 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={screenIndex}
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center text-center"
          >
            {/* Visual Object Frame with Ambient Aura */}
            <div className="relative mb-6">
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-tr ${current.bgAura} blur-2xl pointer-events-none scale-125`}
              />
              {current.svgVisual}
            </div>

            {/* Tag / Category Badge */}
            <span className="text-[10px] font-black uppercase tracking-wider text-[#5C71F3] bg-[#EEF1FE] px-3 py-1 rounded-full mb-2">
              {current.theme}
            </span>

            {/* Headline */}
            <h2 className="text-[24px] font-black text-[#1E1E2D] tracking-tight leading-tight whitespace-pre-line mt-1">
              {current.headline}
            </h2>

            {/* Supporting Text */}
            <p className="text-[13px] text-[#8E8E9F] leading-relaxed mt-2.5 max-w-[320px]">
              {current.sub}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA & Progress Label */}
      <div className="space-y-3 pt-2">
        <button
          id={`btn-onboarding-${screenIndex + 1}`}
          onClick={handleNext}
          className="w-full h-14 rounded-2xl bg-[#5C71F3] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-[#5C71F3]/30 hover:bg-[#4B62EB] transition-all cursor-pointer"
        >
          <span>{screenIndex === 3 ? t('get_started_btn') : t('continue_btn')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-[11px] text-center text-[#8E8E9F] font-bold">
          {screenIndex + 1} / 4
        </p>
      </div>
    </div>
  );
};
