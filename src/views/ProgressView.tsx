import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { TrendingUp, Scale, Flame, Award, Calendar } from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { weightHistory, currentStreak, bestStreak, successRate, user, completedWorkouts, language, t } = useApp();

  const isAmharic = language === 'am';
  const totalVolumeAllTime = completedWorkouts.reduce((acc, w) => acc + w.totalVolumeKg, 0);

  return (
    <div className="flex-1 flex flex-col pt-3 pb-28 px-4 bg-[#F5F6FA] min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#1E1E2D] tracking-tight">
            {t('progressAnalytics')}
          </h1>
          <p className="text-[13px] text-[#8E8E9F] font-medium mt-0.5">
            {isAmharic ? 'የቀጣይነት እና የሰውነት ለውጥ መለኪያ' : 'Consistency & body metric trajectory'}
          </p>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-white border border-[#EBEBF4] flex items-center justify-center text-[#5C71F3] card-shadow">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* Top 3 Metric Blocks */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <div className="bg-white p-3 rounded-2xl border border-[#EFEFF8] card-shadow text-center">
          <div className="w-7 h-7 rounded-xl bg-[#FFF3E6] text-[#FFB020] flex items-center justify-center mx-auto mb-1">
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-[#8E8E9F] uppercase">{isAmharic ? 'ቀጣይነት' : 'Streak'}</span>
          <p className="text-[16px] font-black text-[#1E1E2D] mt-0.5">{currentStreak} {isAmharic ? 'ቀናት' : 'Days'}</p>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#EFEFF8] card-shadow text-center">
          <div className="w-7 h-7 rounded-xl bg-[#E6FAF5] text-[#00D09E] flex items-center justify-center mx-auto mb-1">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-[#8E8E9F] uppercase">{isAmharic ? 'ውጤት' : 'Success'}</span>
          <p className="text-[16px] font-black text-[#1E1E2D] mt-0.5">{successRate}%</p>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#EFEFF8] card-shadow text-center">
          <div className="w-7 h-7 rounded-xl bg-[#EEF1FE] text-[#5C71F3] flex items-center justify-center mx-auto mb-1">
            <Scale className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-[#8E8E9F] uppercase">{isAmharic ? 'ክብደት' : 'Weight'}</span>
          <p className="text-[16px] font-black text-[#1E1E2D] mt-0.5">{user.weightKg} {t('unitKg')}</p>
        </div>
      </div>

      {/* Weight History Progression Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-5 card-shadow border border-[#EFEFF8] mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[15px] font-bold text-[#1E1E2D]">{isAmharic ? 'የክብደት ለውጥ ታሪክ' : 'Weight History'}</h3>
            <span className="text-[11px] text-[#8E8E9F]">
              {isAmharic ? 'ዒላማ:' : 'Target:'} {user.targetWeightKg || 80} {t('unitKg')}
            </span>
          </div>
          <span className="text-[12px] font-bold text-[#00C48C] bg-[#E6FAF3] px-2.5 py-0.5 rounded-full">
            {isAmharic ? '+1.5 ኪ.ግ የጡንቻ ጭማሪ' : '+1.5 kg Lean Gain'}
          </span>
        </div>

        {/* Minimalist SVG Trend Line */}
        <div className="h-28 w-full flex items-end justify-between pt-4 pb-2 px-2">
          {weightHistory.map((rec, i) => {
            const heightPercent = Math.min(100, Math.max(30, (rec.weightKg - 73) * 20));
            return (
              <div key={rec.date} className="flex flex-col items-center flex-1">
                <span className="text-[10px] font-bold text-[#5C71F3] mb-1">{rec.weightKg}</span>
                <div className="w-2.5 bg-[#EEF1FE] rounded-full flex flex-col justify-end h-16">
                  <div
                    className="w-full bg-[#5C71F3] rounded-full transition-all"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[9px] font-semibold text-[#8E8E9F] mt-1.5">
                  {rec.date.slice(5)}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Total Tonnage Volume Lifted */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-3xl p-5 card-shadow border border-[#EFEFF8] mb-4"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[15px] font-bold text-[#1E1E2D]">{isAmharic ? 'የተነሳ አጠቃላይ ክብደት' : 'Volume Overload'}</h3>
          <span className="text-[11px] font-extrabold uppercase text-[#9D5CE5] bg-[#F5ECFD] px-2.5 py-0.5 rounded-full">
            {isAmharic ? 'የጡንቻ ግንባታ' : 'Hypertrophy'}
          </span>
        </div>
        <p className="text-[26px] font-black text-[#1E1E2D]">
          {totalVolumeAllTime.toLocaleString()} <span className="text-[14px] text-[#8E8E9F] font-bold">{isAmharic ? 'ኪ.ግ ተነስቷል' : 'kg lifted'}</span>
        </p>
        <p className="text-[12px] text-[#8E8E9F] mt-1">
          {isAmharic
            ? `በ${completedWorkouts.length} የተጠናቀቁ የልምምድ ክፍለ-ጊዜዎች ውስጥ የተሰበሰበ።`
            : `Accumulated across ${completedWorkouts.length} logged training sessions.`}
        </p>
      </motion.div>

      {/* Consistency Matrix */}
      <div className="bg-white rounded-3xl p-5 card-shadow border border-[#EFEFF8]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#5C71F3]" />
            <h3 className="text-[15px] font-bold text-[#1E1E2D]">{isAmharic ? 'የቀጣይነት ሰንጠረዥ' : 'Consistency Matrix'}</h3>
          </div>
          <span className="text-[11px] font-bold text-[#5C71F3]">2026</span>
        </div>

        {/* 28 Day Heatmap simulation */}
        <div className="grid grid-cols-7 gap-2 pt-1">
          {Array.from({ length: 28 }).map((_, i) => {
            const isFilled = i % 7 !== 5; // 6 days a week training
            return (
              <div
                key={i}
                className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold ${
                  isFilled
                    ? 'bg-[#5C71F3] text-white shadow-xs'
                    : 'bg-[#F1F2FA] text-[#8E8E9F]'
                }`}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
