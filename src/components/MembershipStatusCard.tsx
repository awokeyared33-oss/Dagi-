import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { SupabaseService } from '../services/supabaseClient';
import { MembershipSummary } from '../types';
import {
  ShieldCheck,
  Calendar,
  CreditCard,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Info,
  PhoneCall,
  QrCode,
  Sparkles,
  Award,
  RefreshCw,
} from 'lucide-react';

export const MembershipStatusCard: React.FC = () => {
  const { user, language } = useApp();
  const isAmharic = language === 'am';

  const [summary, setSummary] = useState<MembershipSummary | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Load member's live membership calculation
  const loadMembership = () => {
    if (!user?.id && !user?.email) return;
    const s = SupabaseService.getMemberMembershipSummary(user.id || user.email);
    setSummary(s);
  };

  useEffect(() => {
    loadMembership();
  }, [user?.id, user?.email]);

  if (!summary) {
    return null;
  }

  // Calculate 30-day cycle progress
  const totalDays = 30;
  const daysPassed = Math.max(0, Math.min(30, 30 - summary.daysRemaining));
  const progressPercent = Math.min(100, Math.round((daysPassed / totalDays) * 100));

  // Determine badge styling based on payment status
  const isPaid = summary.paymentStatus === 'paid';
  const isDueToday = summary.paymentStatus === 'payment_due';
  const isOverdue = summary.paymentStatus === 'overdue';

  return (
    <div className="px-5 mb-4">
      <div
        className={`rounded-3xl p-4.5 border transition-all relative overflow-hidden shadow-sm ${
          isOverdue
            ? 'bg-gradient-to-br from-red-50/80 via-white to-orange-50/40 border-red-200'
            : isDueToday
            ? 'bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 border-amber-200'
            : 'bg-gradient-to-br from-[#EEF2FF] via-white to-[#F8FAFC] border-[#C7D2FE]'
        }`}
      >
        {/* Decorative corner glow */}
        <div
          className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-40 ${
            isOverdue ? 'bg-red-400' : isDueToday ? 'bg-amber-400' : 'bg-[#5C71F3]'
          }`}
        />

        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                isOverdue
                  ? 'bg-red-500 text-white shadow-red-500/20'
                  : isDueToday
                  ? 'bg-amber-500 text-white shadow-amber-500/20'
                  : 'bg-[#5C71F3] text-white shadow-[#5C71F3]/20'
              }`}
            >
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black text-[#0F172A] tracking-tight">
                  {isAmharic ? 'የአባልነት ክፍያ ሁኔታ' : 'Membership Status'}
                </h3>
                <span className="text-[9.5px] px-1.5 py-0.5 rounded-full font-bold bg-[#E0E7FF] text-[#4338CA]">
                  {summary.tier}
                </span>
              </div>
              <p className="text-[10px] text-[#64748B] font-medium">
                {isAmharic ? `ዙር ${summary.currentCycleNumber} (30 ቀናት)` : `Cycle #${summary.currentCycleNumber} (30-Day Cycle)`}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            {isPaid && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{isAmharic ? 'ተከፍሏል' : 'PAID'}</span>
              </span>
            )}
            {isDueToday && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>{isAmharic ? 'ዛሬ ይከፈላል' : 'DUE TODAY'}</span>
              </span>
            )}
            {isOverdue && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-800 border border-red-300">
                <AlertTriangle className="w-3 h-3 text-red-600" />
                <span>{isAmharic ? 'ጊዜው አልፏል' : 'OVERDUE'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Date Row: Start & Due Date (Ethiopian Calendar Primary) */}
        <div className="grid grid-cols-2 gap-2 bg-white/90 p-2.5 rounded-2xl border border-[#E2E8F0] mb-3 text-[11px]">
          <div>
            <span className="text-[9.5px] font-bold text-[#94A3B8] uppercase block tracking-wider">
              {isAmharic ? 'የተጀመረበት ቀን' : 'Cycle Start Date'}
            </span>
            <span className="font-bold text-[#0F172A] block text-[11.5px] leading-tight">
              {summary.startDateEth}
            </span>
            <span className="text-[9px] text-[#94A3B8]">
              ({summary.startDate})
            </span>
          </div>

          <div className="text-right">
            <span className="text-[9.5px] font-bold text-[#94A3B8] uppercase block tracking-wider">
              {isAmharic ? 'የሚቀጥለው ክፍያ ቀን' : 'Next Renewal Due'}
            </span>
            <span
              className={`font-black block text-[11.5px] leading-tight ${
                isOverdue ? 'text-red-600' : isDueToday ? 'text-amber-600' : 'text-[#5C71F3]'
              }`}
            >
              {summary.dueDateEth}
            </span>
            <span className="text-[9px] text-[#94A3B8]">
              ({summary.dueDate})
            </span>
          </div>
        </div>

        {/* 30-Day Cycle Progress Bar */}
        <div className="space-y-1 mb-3">
          <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-[#64748B]">
              {isOverdue
                ? isAmharic
                  ? `ከክፍያ ቀን በ${Math.abs(summary.daysRemaining)} ቀናት አልፏል`
                  : `Overdue by ${Math.abs(summary.daysRemaining)} day${Math.abs(summary.daysRemaining) === 1 ? '' : 's'}`
                : isDueToday
                ? isAmharic
                  ? 'የ30 ቀናት ዙር ዛሬ ተጠናቋል'
                  : '30-day period expires today'
                : isAmharic
                ? `ቀሪ ${summary.daysRemaining} ቀናት`
                : `${summary.daysRemaining} days remaining in cycle`}
            </span>
            <span className="text-[#0F172A]">
              {summary.monthlyFee.toLocaleString()} ETB / {isAmharic ? 'ወር' : 'mo'}
            </span>
          </div>

          <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                isOverdue
                  ? 'bg-red-500'
                  : isDueToday
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-[#5C71F3] to-[#818cf8]'
              }`}
            />
          </div>
        </div>

        {/* Action Buttons & Helpers */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setShowPayModal(true)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              isOverdue || isDueToday
                ? 'bg-[#5C71F3] hover:bg-[#4E62EB] text-white shadow-[#5C71F3]/25'
                : 'bg-white hover:bg-[#F8FAFC] text-[#334155] border border-[#CBD5E1]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>
              {isAmharic
                ? isOverdue || isDueToday
                  ? 'ክፍያ መረጃ / የቴሌብር ቁጥር'
                  : 'የክፍያ መመሪያ'
                : isOverdue || isDueToday
                ? 'Pay via Telebirr / Front Desk'
                : 'Payment Methods & Info'}
            </span>
          </button>

          <button
            onClick={() => setShowDetailsModal(true)}
            className="p-2 rounded-xl bg-white/80 hover:bg-white text-[#475569] border border-[#E2E8F0] text-xs font-bold transition-colors cursor-pointer"
            title={isAmharic ? 'ዝርዝር መረጃ' : 'View Cycle History'}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Payment Information Modal */}
      <AnimatePresence>
        {showPayModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#5C71F3]/10 text-[#5C71F3] flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#0F172A]">
                    {isAmharic ? 'የአባልነት ክፍያ መመሪያ' : 'Gym Membership Payment'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowPayModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {/* Amount Due Card */}
              <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                    {isAmharic ? 'የ30 ቀናት ክፍያ' : '30-Day Cycle Rate'}
                  </span>
                  <span className="text-lg font-black text-[#0F172A]">
                    {summary.monthlyFee.toLocaleString()} ETB
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#94A3B8] block">
                    {isAmharic ? 'የአባልነት ዓይነት' : 'Membership Tier'}
                  </span>
                  <span className="text-xs font-black text-[#5C71F3]">
                    {summary.tier}
                  </span>
                </div>
              </div>

              {/* Official Payment Channels */}
              <div className="space-y-2.5">
                <span className="text-[10.5px] font-bold text-[#64748B] uppercase tracking-wider block">
                  {isAmharic ? 'ኦፊሴላዊ የክፍያ አማራጮች' : 'Official Payment Channels'}
                </span>

                {/* Telebirr */}
                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-[10px] flex items-center justify-center">
                      TB
                    </div>
                    <div>
                      <span className="text-xs font-bold text-blue-900 block">Telebirr Merchant</span>
                      <span className="text-[11px] font-mono font-bold text-blue-700">0911 234 567</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-200/60 text-blue-800 px-2 py-0.5 rounded-full">
                    Dagi Fitness
                  </span>
                </div>

                {/* CBE Birr */}
                <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-700 text-white font-black text-[10px] flex items-center justify-center">
                      CBE
                    </div>
                    <div>
                      <span className="text-xs font-bold text-purple-900 block">CBE Account</span>
                      <span className="text-[11px] font-mono font-bold text-purple-700">1000 4829 3829</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-purple-200/60 text-purple-800 px-2 py-0.5 rounded-full">
                    Commercial Bank
                  </span>
                </div>

                {/* Front Desk Cash */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center">
                      CASH
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">Gym Front Desk</span>
                      <span className="text-[11px] text-emerald-700">Cash or POS Machine</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-200/60 text-emerald-800 px-2 py-0.5 rounded-full">
                    Reception
                  </span>
                </div>
              </div>

              {/* Notification Note */}
              <p className="text-[11px] text-[#64748B] text-center leading-relaxed">
                {isAmharic
                  ? 'ክፍያ ከፈጸሙ በኋላ ደረሰኙን ለአስተዳዳሪው ያሳዩ ወይም የግብይት ቁጥሩን ያሳውቁ።'
                  : 'After payment, please show your transaction SMS or receipt to the front desk admin to instantly update your 30-day membership cycle.'}
              </p>

              <button
                onClick={() => setShowPayModal(false)}
                className="w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                {isAmharic ? 'ተረድቻለሁ' : 'Got It'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cycle Details Modal */}
      <AnimatePresence>
        {showDetailsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#5C71F3]/10 text-[#5C71F3] flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#0F172A]">
                    {isAmharic ? 'የ30 ቀናት ዙር ዝርዝር' : '30-Day Cycle Breakdown'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#F8FAFC] rounded-2xl flex justify-between">
                  <span className="text-[#64748B] font-medium">{isAmharic ? 'የአሁን ዙር ቁጥር' : 'Current Cycle'}</span>
                  <span className="font-black text-[#0F172A]">#{summary.currentCycleNumber}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-2xl flex justify-between">
                  <span className="text-[#64748B] font-medium">{isAmharic ? 'የመጀመሪያ ምዝገባ ቀን' : 'Initial Registration'}</span>
                  <span className="font-bold text-[#0F172A]">{summary.startDateEth}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-2xl flex justify-between">
                  <span className="text-[#64748B] font-medium">{isAmharic ? 'የአሁን ዙር ማብቂያ' : 'Current Cycle Expiry'}</span>
                  <span className="font-bold text-[#5C71F3]">{summary.dueDateEth}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-2xl flex justify-between">
                  <span className="text-[#64748B] font-medium">{isAmharic ? 'ወርሃዊ ክፍያ መጠን' : 'Membership Fee'}</span>
                  <span className="font-black text-emerald-700">{summary.monthlyFee.toLocaleString()} ETB</span>
                </div>
              </div>

              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full py-2.5 bg-[#5C71F3] hover:bg-[#4E62EB] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                {isAmharic ? 'ዝጋ' : 'Close'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
