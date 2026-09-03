import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/fitnessServices';
import { SupabaseService } from '../services/supabaseClient';
import { ArrowRight } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setRoute, t } = useApp();

  const handleAdvance = () => {
    const currentMemberId = SupabaseService.getCurrentMemberId();
    if (currentMemberId) {
      const bundle = SupabaseService.loadMemberFullBundle(currentMemberId);
      if (bundle.onboardingCompleted) {
        setRoute('dashboard');
        return;
      }
    }
    const hasCompleted = StorageService.getItem<boolean>('onboarding_completed', false);
    if (hasCompleted && currentMemberId) {
      setRoute('dashboard');
    } else {
      setRoute('auth');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleAdvance();
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex-1 flex flex-col items-center justify-between p-8 bg-white overflow-hidden">
      {/* Background Soft Radial Blue Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#5C71F3]/10 blur-3xl pointer-events-none" />

      <div className="w-full flex justify-end">
        <button
          id="splash-skip-btn"
          onClick={handleAdvance}
          className="text-[12px] font-bold text-[#8E8E9F] hover:text-[#5C71F3] transition-colors cursor-pointer"
        >
          {t('skip_btn')}
        </button>
      </div>

      {/* Centered 3D Logo & Brand Intro */}
      <div className="flex flex-col items-center justify-center text-center my-auto">
        {/* Animated Logo Container */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-40 h-40 flex items-center justify-center mb-6"
        >
          {/* Subtle Ambient Pulse Ring */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-[#5C71F3]/15 blur-md"
          />

          <img
            src="/dagi-logo.jpg"
            alt="Dagi Fitness"
            className="w-full h-full object-cover rounded-3xl relative z-10 drop-shadow-xl border-2 border-[#5C71F3]/20"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[28px] font-black tracking-tight text-[#1E1E2D] uppercase font-['Outfit']"
        >
          {t('app_name')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-[13px] font-medium tracking-wide text-[#8E8E9F] uppercase mt-1.5"
        >
          {t('brand_tagline')}
        </motion.p>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="w-full space-y-3"
      >
        <button
          id="splash-get-started-btn"
          onClick={handleAdvance}
          className="w-full h-14 rounded-2xl bg-[#5C71F3] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-[#5C71F3]/30 hover:bg-[#4B62EB] transition-all cursor-pointer"
        >
          <span>{t('get_started_btn')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-[11px] text-center text-[#8E8E9F] font-medium">
          {t('vip_tag')} • v2.4
        </p>
      </motion.div>
    </div>
  );
};
