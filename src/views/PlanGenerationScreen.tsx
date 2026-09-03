import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Sparkles, Dumbbell, Utensils, Zap, Activity } from 'lucide-react';

export const PlanGenerationScreen: React.FC = () => {
  const { setRoute, t, language } = useApp();

  const stages = language === 'am' ? [
    { label: 'የቪአይፒ የአካል ብቃት ፕሮፋይልዎን በመተንተን ላይ...', icon: <Activity className="w-4 h-4 text-[#5C71F3]" /> },
    { label: 'BMR፣ TDEE እና የማክሮ ካሎሪ ስርጭትን በማስላት ላይ...', icon: <Utensils className="w-4 h-4 text-[#00D09E]" /> },
    { label: 'የተስተካከለ የልምምድ ክፍፍል እና መጠን በማዘጋጀት ላይ...', icon: <Dumbbell className="w-4 h-4 text-[#FFB020]" /> },
    { label: 'የውኃ እና የእረፍት ግቦችን በማስተካከል ላይ...', icon: <Zap className="w-4 h-4 text-[#9D5CE5]" /> },
    { label: 'የእርስዎን ግላዊ የ አብሪሽ ፊትነስ ፕላን በማጠናቀቅ ላይ!', icon: <Sparkles className="w-4 h-4 text-[#5C71F3]" /> },
  ] : [
    { label: 'Analyzing your VIP athletic profile...', icon: <Activity className="w-4 h-4 text-[#5C71F3]" /> },
    { label: 'Calculating BMR, TDEE & macro distributions...', icon: <Utensils className="w-4 h-4 text-[#00D09E]" /> },
    { label: 'Synthesizing customized workout splits & volume...', icon: <Dumbbell className="w-4 h-4 text-[#FFB020]" /> },
    { label: 'Calibrating hydration & recovery milestones...', icon: <Zap className="w-4 h-4 text-[#9D5CE5]" /> },
    { label: 'Finalizing your Dagi Fitness personalized plan!', icon: <Sparkles className="w-4 h-4 text-[#5C71F3]" /> },
  ];

  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setRoute('plan-ready');
          }, 600);
          return prev;
        }
      });
    }, 650);

    return () => clearInterval(interval);
  }, [setRoute, stages.length]);

  return (
    <div className="relative flex-1 flex flex-col items-center justify-between p-6 bg-[#F5F6FA] overflow-y-auto no-scrollbar">
      {/* Top Brand Logo */}
      <div className="pt-6 text-center">
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 mx-auto mb-3 flex items-center justify-center relative"
        >
          <img
            src="/dagi-logo.jpg"
            alt="Dagi Fitness"
            className="w-full h-full object-cover rounded-2xl drop-shadow-md border border-[#5C71F3]/20"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <h2 className="text-[22px] font-black text-[#1E1E2D] tracking-tight">
          {t('building_plan_title')}
        </h2>
        <p className="text-[13px] text-[#8E8E9F] mt-1 max-w-[280px] mx-auto">
          {t('building_plan_sub')}
        </p>
      </div>

      {/* Centered Orbital 3D Animation Visual */}
      <div className="my-auto py-6 flex flex-col items-center">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Orbital Ring 1 */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-[#5C71F3]/25"
          />
          {/* Orbital Ring 2 */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-4 rounded-full border border-slate-300/60"
          />

          {/* Central Pulsing VIP Hub */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#5C71F3] to-[#4B62EB] flex flex-col items-center justify-center p-3 text-white shadow-xl shadow-[#5C71F3]/30"
          >
            <Sparkles className="w-8 h-8 text-white mb-1" />
            <span className="text-[11px] font-black tracking-wider uppercase">DAGI FITNESS AI</span>
          </motion.div>
        </div>

        {/* Progress Stages List */}
        <div className="w-full max-w-[340px] space-y-2.5 mt-6">
          {stages.map((stg, i) => {
            const isDone = i < currentStageIndex;
            const isCurrent = i === currentStageIndex;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: i <= currentStageIndex ? 1 : 0.4, x: 0 }}
                className={`p-3 rounded-2xl border flex items-center justify-between text-[12px] font-semibold transition-all ${
                  isCurrent
                    ? 'bg-white border-[#5C71F3] text-[#1E1E2D] shadow-sm ring-1 ring-[#5C71F3]/20'
                    : isDone
                    ? 'bg-white/80 border-[#EBEBF4] text-[#8E8E9F]'
                    : 'bg-transparent border-transparent text-[#8E8E9F]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#F5F6FA] flex items-center justify-center">
                    {stg.icon}
                  </div>
                  <span>{stg.label}</span>
                </div>
                {isDone && <CheckCircle2 className="w-4 h-4 text-[#00D09E]" />}
                {isCurrent && (
                  <span className="w-3.5 h-3.5 border-2 border-[#5C71F3] border-t-transparent rounded-full animate-spin" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="pb-4 text-center">
        <span className="text-[11px] font-bold text-[#8E8E9F]">
          {language === 'am' ? 'የእርስዎን ግላዊ የቪአይፒ አልጎሪዝም በማዘጋጀት ላይ...' : 'Optimizing your private VIP algorithm...'}
        </span>
      </div>
    </div>
  );
};
