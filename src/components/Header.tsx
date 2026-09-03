import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { Globe } from 'lucide-react';
import { getEthiopianNow } from '../services/ethiopianCalendar';

export const Header: React.FC = () => {
  const {
    greeting,
    motivationalSubtitle,
    unreadNotificationCount,
    setIsNotificationDrawerOpen,
    markNotificationsAsRead,
    language,
    setLanguage,
  } = useApp();

  const ethNow = getEthiopianNow();

  const handleNotificationClick = () => {
    markNotificationsAsRead();
    setIsNotificationDrawerOpen(true);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'am' : 'en');
  };

  return (
    <header className="px-4 pt-3 pb-2 space-y-2">
      {/* Top micro-bar with Ethiopian Date */}
      <div className="flex items-center justify-between text-[10px] font-bold text-[#8E8E9F]">
        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-slate-100 shadow-xs">
          <span className="text-[#5C71F3]">📅</span>
          <span>{ethNow.formatted}</span>
        </div>
      </div>

      <div className="flex justify-between items-start">
        <div className="flex flex-col flex-1 pr-3 min-w-0">
          <motion.h1
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-xl font-black text-[#1E1E2D] tracking-tight leading-tight"
          >
            {greeting}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-xs text-[#8E8E9F] mt-0.5"
          >
            {motivationalSubtitle}
          </motion.p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Language Switcher */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleLanguage}
            className="px-2.5 py-2 bg-white rounded-xl shadow-xs border border-slate-100 flex items-center gap-1 text-[11px] font-black text-[#5C71F3] cursor-pointer hover:border-[#5C71F3]/40 transition-colors"
            title={language === 'en' ? 'Switch to Amharic' : 'ወደ እንግሊዝኛ ቀይር'}
          >
            <Globe className="w-3.5 h-3.5 text-[#5C71F3]" />
            <span>{language === 'en' ? 'አማ' : 'EN'}</span>
          </motion.button>

          <motion.button
            id="notification-bell-btn"
            whileTap={{ scale: 0.92 }}
            onClick={handleNotificationClick}
            className="relative shrink-0 p-2.5 bg-white rounded-xl shadow-xs border border-slate-100 flex items-center justify-center text-[#1E1E2D] cursor-pointer transition-colors hover:border-[#5C71F3]/30"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5 text-[#1E1E2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF5C5C] ring-2 ring-white" />
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};
