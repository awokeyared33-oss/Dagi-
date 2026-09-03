import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Activity, ShieldCheck, Flame } from 'lucide-react';
import { Exercise } from '../types';
import { useApp } from '../context/AppContext';

interface ExerciseVisualGuideProps {
  exercise: Exercise;
}

export const ExerciseVisualGuide: React.FC<ExerciseVisualGuideProps> = ({ exercise }) => {
  const { language, getLocalizedMuscle } = useApp();
  const isAmharic = language === 'am';

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentPhase, setCurrentPhase] = useState<number>(0); // 0: Start, 1: Concentric/Eccentric, 2: Peak, 3: Reset

  const phases = isAmharic
    ? [
        { label: '01 ዝግጅት', title: 'የመጀመሪያ አቋም', desc: 'የተረጋጋ መሰረት ያዘጋጁ፣ ሆድዎን ያጥብቁ፣ እና ክብደቱን በትክክል ያመቻቹ።' },
        { label: '02 እንቅስቃሴ', title: 'ቁጥጥር የተደረገበት ግፊት', desc: 'በተገቢው ፍጥነት እና ቁጥጥር ዋናውን ጡንቻ በመጠቀም ክብደቱን ያንቀሳቅሱ።' },
        { label: '03 ከፍተኛ ግፊት', title: 'የጡንቻ መኮማተር', desc: 'በእንቅስቃሴው ጫፍ ላይ ጡንቻውን አጥብቀው ለ1 ሰከንድ ያህል ይያዙ።' },
        { label: '04 መመለስ', title: 'ቁጥጥር የተደረገበት መመለሻ', desc: 'የጡንቻውን ውጥረት ሳይለቁ በተረጋጋ ሁኔታ ወደ መጀመሪያው አቋም ይመለሱ።' },
      ]
    : [
        { label: '01 Setup', title: 'Starting Position', desc: exercise.phaseDescriptions?.start || 'Set stable base, lock core, and position weights in active alignment.' },
        { label: '02 Motion', title: 'Controlled Movement', desc: exercise.phaseDescriptions?.movement || 'Drive through the primary muscle group with controlled cadence (3s descent).' },
        { label: '03 Peak', title: 'Peak Contraction', desc: exercise.phaseDescriptions?.peak || 'Hold tension at peak muscle shortening for 1 full second.' },
        { label: '04 Return', title: 'Controlled Return', desc: exercise.phaseDescriptions?.finish || 'Reset smoothly back to start while maintaining constant muscle tension.' },
      ];


  // Auto-progress animation loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % 4);
    }, 2200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Movement animation geometry helper based on animationType
  const renderVisualSilhouette = () => {
    const type = exercise.animationType || 'chest_press';

    // Different animated vector paths and poses per exercise movement pattern
    return (
      <div className="relative w-full h-48 bg-gradient-to-b from-[#181A2A] to-[#121320] rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-[#2B2D42]">
        {/* Athletic Grid Background */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#5C71F3_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Dynamic Biomechanical Vector Rig */}
        <div className="relative z-10 w-full max-w-[240px] h-32 flex items-center justify-center">
          {type === 'chest_press' && (
            <div className="relative flex flex-col items-center">
              {/* Bench */}
              <div className="w-36 h-2.5 bg-[#3B3D54] rounded-full mt-12" />
              {/* Torso */}
              <motion.div
                animate={{
                  scaleY: currentPhase === 2 ? 0.95 : 1,
                }}
                className="absolute bottom-2.5 w-14 h-5 bg-[#5C71F3] rounded-md"
              />
              {/* Barbell / Dumbbell Rig */}
              <motion.div
                animate={{
                  y: currentPhase === 0 ? -12 : currentPhase === 1 ? 6 : currentPhase === 2 ? -28 : -12,
                  scale: currentPhase === 2 ? 1.05 : 1,
                }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="absolute top-2 w-32 flex flex-col items-center"
              >
                <div className="w-full h-2 bg-[#F1F3FF] rounded-full shadow-lg shadow-[#5C71F3]/40 flex justify-between px-1">
                  <div className="w-3 h-5 -mt-1.5 bg-[#FFB020] rounded-xs" />
                  <div className="w-3 h-5 -mt-1.5 bg-[#FFB020] rounded-xs" />
                </div>
                <span className="text-[9px] font-black text-[#5C71F3] bg-white/90 px-1.5 py-0.5 rounded-full mt-1">
                  {currentPhase === 2 ? 'MAX FORCE' : 'TENSION'}
                </span>
              </motion.div>
            </div>
          )}

          {type === 'squat' && (
            <div className="relative flex flex-col items-center justify-end h-full pb-2">
              {/* Floor */}
              <div className="w-40 h-1.5 bg-[#3B3D54] rounded-full absolute bottom-0" />
              {/* Animated Figure */}
              <motion.div
                animate={{
                  y: currentPhase === 0 ? 0 : currentPhase === 1 ? 18 : currentPhase === 2 ? 22 : 0,
                  scaleY: currentPhase === 2 ? 0.82 : 1,
                }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="flex flex-col items-center"
              >
                {/* Head */}
                <div className="w-5 h-5 rounded-full bg-[#E5E7EB] mb-0.5" />
                {/* Barbell on Traps */}
                <div className="w-28 h-1.5 bg-[#FFB020] rounded-full shadow-md flex justify-between px-0.5">
                  <div className="w-2 h-4 -mt-1 bg-white rounded-xs" />
                  <div className="w-2 h-4 -mt-1 bg-white rounded-xs" />
                </div>
                {/* Torso */}
                <div className="w-8 h-9 bg-[#5C71F3] rounded-md mt-0.5" />
                {/* Legs */}
                <div className="flex gap-4 mt-0.5">
                  <div className="w-2 h-10 bg-[#7B8DF7] rounded-sm" />
                  <div className="w-2 h-10 bg-[#7B8DF7] rounded-sm" />
                </div>
              </motion.div>
            </div>
          )}

          {type === 'pullup' && (
            <div className="relative flex flex-col items-center justify-start h-full pt-1">
              {/* Pull-Up Bar */}
              <div className="w-40 h-2 bg-[#E5E7EB] rounded-full shadow-lg" />
              {/* Body */}
              <motion.div
                animate={{
                  y: currentPhase === 0 ? 30 : currentPhase === 1 ? 12 : currentPhase === 2 ? 0 : 30,
                }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="flex flex-col items-center"
              >
                {/* Arms */}
                <div className="flex gap-6">
                  <div className="w-2 h-6 bg-[#FFB020] rounded-full" />
                  <div className="w-2 h-6 bg-[#FFB020] rounded-full" />
                </div>
                {/* Head */}
                <div className="w-5 h-5 rounded-full bg-[#E5E7EB] -mt-1" />
                {/* Lats / Torso */}
                <div className="w-9 h-11 bg-[#5C71F3] rounded-md mt-0.5 shadow-md shadow-[#5C71F3]/40" />
                {/* Legs */}
                <div className="flex gap-1 mt-0.5">
                  <div className="w-2 h-8 bg-[#7B8DF7] rounded-full" />
                  <div className="w-2 h-8 bg-[#7B8DF7] rounded-full" />
                </div>
              </motion.div>
            </div>
          )}

          {type === 'shoulder_press' && (
            <div className="relative flex flex-col items-center justify-end h-full pb-3">
              {/* Overhead Weight */}
              <motion.div
                animate={{
                  y: currentPhase === 2 ? -25 : currentPhase === 0 ? 0 : -10,
                }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="w-32 h-2 bg-[#FFB020] rounded-full shadow-md flex justify-between px-1 mb-1"
              >
                <div className="w-2.5 h-4.5 -mt-1 bg-white rounded-xs" />
                <div className="w-2.5 h-4.5 -mt-1 bg-white rounded-xs" />
              </motion.div>
              {/* Head & Shoulders */}
              <div className="w-5 h-5 rounded-full bg-[#E5E7EB]" />
              <div className="w-12 h-12 bg-[#5C71F3] rounded-md mt-1" />
            </div>
          )}

          {type === 'bicep_curl' && (
            <div className="relative flex flex-col items-center justify-center h-full">
              <div className="w-6 h-6 rounded-full bg-[#E5E7EB] mb-1" />
              <div className="w-10 h-14 bg-[#5C71F3] rounded-lg relative flex items-center justify-center">
                {/* Forearm & Dumbbell */}
                <motion.div
                  animate={{
                    rotate: currentPhase === 2 ? -75 : currentPhase === 0 ? 10 : -35,
                  }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="absolute right-[-10px] bottom-2 origin-bottom-left w-3 h-8 bg-[#FFB020] rounded-sm flex items-start justify-center"
                >
                  <div className="w-6 h-3 bg-white rounded-xs -mt-1" />
                </motion.div>
              </div>
            </div>
          )}

          {type === 'deadlift' && (
            <div className="relative flex flex-col items-center justify-end h-full pb-2">
              <div className="w-40 h-1.5 bg-[#3B3D54] rounded-full absolute bottom-0" />
              <motion.div
                animate={{
                  y: currentPhase === 0 ? 18 : currentPhase === 2 ? 0 : 8,
                }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="flex flex-col items-center"
              >
                <div className="w-5 h-5 rounded-full bg-[#E5E7EB]" />
                <div className="w-8 h-10 bg-[#5C71F3] rounded-md mt-0.5" />
                <div className="w-32 h-2 bg-[#FFB020] rounded-full shadow-md flex justify-between px-1 mt-1">
                  <div className="w-3 h-5 -mt-1.5 bg-white rounded-xs" />
                  <div className="w-3 h-5 -mt-1.5 bg-white rounded-xs" />
                </div>
              </motion.div>
            </div>
          )}

          {type === 'plank' && (
            <div className="relative flex flex-col items-center justify-center h-full">
              <div className="w-44 h-1.5 bg-[#3B3D54] rounded-full absolute bottom-4" />
              <motion.div
                animate={{
                  opacity: currentPhase % 2 === 0 ? 1 : 0.85,
                  y: currentPhase === 2 ? -2 : 0,
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-32 h-3.5 bg-[#5C71F3] rounded-full transform -rotate-3 mb-2 shadow-lg shadow-[#5C71F3]/40"
              />
              <span className="text-[10px] font-black text-[#00D09E] tracking-wider uppercase mt-1">
                {isAmharic ? 'የሆድ ጡንቻ ቁጥጥር' : 'ISOMETRIC CORE HOLD'}
              </span>
            </div>
          )}

          {/* Fallback & Other Compound Movement */}
          {!['chest_press', 'squat', 'pullup', 'shoulder_press', 'bicep_curl', 'deadlift', 'plank'].includes(type) && (
            <div className="relative flex flex-col items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-14 h-14 rounded-2xl bg-[#5C71F3]/20 border border-[#5C71F3] flex items-center justify-center text-white"
              >
                <Activity className="w-7 h-7 text-[#5C71F3]" />
              </motion.div>
              <span className="text-[11px] font-bold text-[#E5E7EB] mt-2">
                {isAmharic ? `የጡንቻ መስመር፡ ${getLocalizedMuscle(exercise.targetMuscle)}` : `Biomechanic Track: ${exercise.targetMuscle}`}
              </span>
            </div>
          )}
        </div>

        {/* Phase Pill Status */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="text-[10px] font-extrabold tracking-wider uppercase text-white bg-[#5C71F3] px-2.5 py-0.5 rounded-full shadow-xs">
            {phases[currentPhase].label}
          </span>
          <span className="text-[11px] font-bold text-white/90">
            {phases[currentPhase].title}
          </span>
        </div>

        {/* Media Controls Bar */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-20">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors backdrop-blur-xs"
            title={isPlaying ? (isAmharic ? 'አቁም' : 'Pause Guide') : (isAmharic ? 'አጫውት' : 'Play Guide')}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>
          <button
            onClick={() => {
              setCurrentPhase(0);
              setIsPlaying(true);
            }}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors backdrop-blur-xs"
            title={isAmharic ? 'እንደገና ጀምር' : 'Restart Guide'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3.5">
      {/* Animated Motion Canvas */}
      {renderVisualSilhouette()}

      {/* Interactive Phase Scrubber */}
      <div className="grid grid-cols-4 gap-1.5">
        {phases.map((p, idx) => (
          <button
            key={p.label}
            onClick={() => {
              setCurrentPhase(idx);
              setIsPlaying(false);
            }}
            className={`py-1.5 px-2 rounded-xl text-left transition-all cursor-pointer border ${
              currentPhase === idx
                ? 'bg-[#EEF1FE] border-[#5C71F3] text-[#5C71F3]'
                : 'bg-white border-[#ECEEF5] text-[#8E8E9F] hover:border-[#D5D8ED]'
            }`}
          >
            <span className="text-[9px] font-bold block">{p.label}</span>
            <span className="text-[11px] font-black truncate block mt-0.5">{p.title}</span>
          </button>
        ))}
      </div>

      {/* Current Phase Detailed Coaching Cue */}
      <div className="p-3 bg-[#F8F9FD] rounded-2xl border border-[#ECEEF5] flex items-start gap-2.5">
        <div className="w-6 h-6 rounded-lg bg-[#5C71F3]/15 text-[#5C71F3] flex items-center justify-center shrink-0 mt-0.5">
          <Activity className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 text-left">
          <span className="text-[10px] font-bold text-[#5C71F3] uppercase tracking-wider block">
            {isAmharic ? `ደረጃ ${currentPhase + 1} መመሪያ` : `Phase ${currentPhase + 1} Cue`}
          </span>
          <p className="text-[12px] text-[#1E1E2D] font-medium leading-snug mt-0.5">
            {phases[currentPhase].desc}
          </p>
        </div>
      </div>
    </div>
  );
};
