import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { Language } from '../locales';

export const LanguageScreen: React.FC = () => {
  const { language, setLanguage, setRoute, t } = useApp();

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const handleContinue = () => {
    setRoute('onboarding');
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between p-6 bg-[#F5F6FA] overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setRoute('auth')}
          className="w-10 h-10 rounded-2xl bg-white border border-[#EBEBF4] flex items-center justify-center text-[#1E1E2D] card-shadow cursor-pointer hover:border-[#5C71F3]/40 transition-colors"
          aria-label="Back to Login"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-[12px] font-bold text-[#8E8E9F] uppercase tracking-wider">
          {language === 'am' ? 'ደረጃ 1 / ቋንቋ' : 'Step 1 / Language'}
        </span>
        <div className="w-10" />
      </div>

      {/* Brand Header */}
      <div className="pt-2 text-center">
        {/* Subtle Ambient Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 mx-auto mb-4 flex items-center justify-center relative"
        >
          <img
            src="/dagi-logo.jpg"
            alt="Dagi Fitness"
            className="w-full h-full object-cover rounded-2xl drop-shadow-md border border-[#5C71F3]/20"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[24px] font-black text-[#1E1E2D] tracking-tight"
        >
          {t('choose_language')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-[13px] text-[#8E8E9F] mt-1.5"
        >
          {t('choose_language_subtitle')}
        </motion.p>
      </div>

      {/* Language Options Cards */}
      <div className="space-y-3.5 my-auto py-6">
        {/* English */}
        <motion.div
          id="lang-option-en"
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelectLanguage('en')}
          className={`p-4.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            language === 'en'
              ? 'bg-white border-[#5C71F3] shadow-md ring-2 ring-[#5C71F3]/15'
              : 'bg-white border-[#EBEBF4] hover:border-[#5C71F3]/40'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#EEF1FE] flex items-center justify-center text-[#5C71F3]">
              <span className="text-[14px] font-extrabold">EN</span>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#1E1E2D]">English</h3>
              <p className="text-[12px] text-[#8E8E9F] mt-0.5">{language === 'am' ? 'እንግሊዝኛ' : 'Default international language'}</p>
            </div>
          </div>
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
              language === 'en'
                ? 'bg-[#5C71F3] border-[#5C71F3] text-white'
                : 'border-[#D9DCED]'
            }`}
          >
            {language === 'en' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </motion.div>

        {/* Amharic */}
        <motion.div
          id="lang-option-am"
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelectLanguage('am')}
          className={`p-4.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            language === 'am'
              ? 'bg-white border-[#5C71F3] shadow-md ring-2 ring-[#5C71F3]/15'
              : 'bg-white border-[#EBEBF4] hover:border-[#5C71F3]/40'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#FFF7E6] flex items-center justify-center text-[#FFB020]">
              <span className="text-[14px] font-extrabold">አማ</span>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#1E1E2D]">አማርኛ (Amharic)</h3>
              <p className="text-[12px] text-[#8E8E9F] mt-0.5">{language === 'am' ? 'የኢትዮጵያ ቋንቋ' : 'Ethiopian national language'}</p>
            </div>
          </div>
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
              language === 'am'
                ? 'bg-[#5C71F3] border-[#5C71F3] text-white'
                : 'border-[#D9DCED]'
            }`}
          >
            {language === 'am' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="pt-4 pb-2">
        <button
          id="btn-language-continue"
          onClick={handleContinue}
          className="w-full h-14 rounded-2xl bg-[#5C71F3] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-[#5C71F3]/30 hover:bg-[#4B62EB] transition-all cursor-pointer"
        >
          <span>{t('continue_btn')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
