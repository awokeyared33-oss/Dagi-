import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { SupabaseService } from '../services/supabaseClient';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { loadUserSession, setRoute, t, language } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage(language === 'am' ? 'እባክዎ ትክክለኛ የኢሜይል አድራሻ ያስገቡ።' : 'Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage(language === 'am' ? 'እባክዎ የይለፍ ቃልዎን ያስገቡ።' : 'Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await SupabaseService.login(email.trim(), password);

      if (!result.success || !result.member) {
        setErrorMessage(
          result.errorMessage
            ? (language === 'am' ? result.errorMessage.am : result.errorMessage.en)
            : (language === 'am'
              ? 'መለያዎ እስካሁን አልተፈጠረም። እባክዎ ዳጊ ፊትነስን ያነጋግሩ።'
              : 'Your account has not been created yet. Please contact Dagi Fitness.')
        );
        setIsLoading(false);
        return;
      }

      const member = result.member;

      // Load full member data bundle from backend/storage
      const isOnboardingDone = await loadUserSession(member.id);

      setIsLoading(false);

      // If returning member already finished onboarding, take them directly to Dashboard!
      if (isOnboardingDone) {
        setRoute('dashboard');
      } else {
        // Genuinely new member proceeds to language & assessment
        setRoute('language');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(
        err?.message ||
        (language === 'am'
          ? 'የመግባት ስህተት አጋጥሟል። እባክዎ እንደገና ይሞክሩ።'
          : 'Sign-in error encountered. Please check your connection and try again.')
      );
    }
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between p-6 bg-[#F5F6FA] overflow-y-auto no-scrollbar">
      {/* Brand Header */}
      <div className="text-center pt-4">
        <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center relative">
          <img
            src="/dagi-logo.jpg"
            alt="Dagi Fitness"
            className="w-full h-full object-cover rounded-3xl drop-shadow-md border border-[#5C71F3]/20"
            referrerPolicy="no-referrer"
          />
        </div>
        <h2 className="text-[24px] font-black text-[#1E1E2D] tracking-tight">
          {language === 'am' ? 'የአባላት መግቢያ' : 'VIP Member Sign In'}
        </h2>
        <p className="text-[13px] text-[#8E8E9F] mt-1 max-w-[280px] mx-auto">
          {language === 'am'
            ? 'አስተዳዳሪው የሰጠዎትን የመለያ መረጃ ያስገቡ'
            : 'Access is reserved for verified Dagi Fitness members'}
        </p>
      </div>

      {/* Auth Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 card-shadow border border-[#EBEBF4] my-auto space-y-4 shadow-sm"
      >
        {/* Error Toast / Alert */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3.5 bg-[#FFF0F0] border border-[#FF5C5C]/30 rounded-xl text-[12px] font-bold text-[#FF5C5C] flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-[#FF5C5C] mt-0.5" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Email Address Field */}
          <div>
            <label className="text-[11px] font-bold text-[#8E8E9F] uppercase tracking-wider block mb-1.5">
              {t('email_label')}
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#8E8E9F] absolute left-3.5" />
              <input
                id="auth-input-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@blueskyfitness.com"
                className="w-full h-12 rounded-xl bg-[#F5F6FA] border border-[#E5E7EB] pl-10 pr-4 text-[13px] font-semibold text-[#1E1E2D] outline-none focus:border-[#5C71F3] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-[11px] font-bold text-[#8E8E9F] uppercase tracking-wider block mb-1.5">
              {t('password_label')}
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#8E8E9F] absolute left-3.5" />
              <input
                id="auth-input-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 rounded-xl bg-[#F5F6FA] border border-[#E5E7EB] pl-10 pr-4 text-[13px] font-semibold text-[#1E1E2D] outline-none focus:border-[#5C71F3] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-2xl bg-[#5C71F3] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-lg shadow-[#5C71F3]/25 hover:bg-[#4B62EB] transition-all cursor-pointer mt-3 disabled:opacity-75"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{language === 'am' ? 'በማረጋገጥ ላይ...' : 'Verifying Member...'}</span>
              </span>
            ) : (
              <>
                <span>{language === 'am' ? 'ይግቡ' : 'Sign In to Dagi Fitness'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Footer Notice */}
      <div className="text-center pt-2 pb-2">
        <p className="text-[11px] text-[#A0A0B5] font-medium">
          {language === 'am'
            ? 'አካውንት ለመክፈት እባክዎ አብሪሽ ፊትነስ አስተዳዳሪን ያነጋግሩ'
            : 'Private gym network • Accounts provisioned by admin'}
        </p>
      </div>
    </div>
  );
};

