import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Dumbbell, Droplets, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationDrawer: React.FC = () => {
  const { isNotificationDrawerOpen, setIsNotificationDrawerOpen, notifications, t, getLocalizedNotification } = useApp();

  return (
    <AnimatePresence>
      {isNotificationDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="fixed inset-0 bg-black/35 backdrop-blur-xs"
          />

          {/* Drawer Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-[430px] bg-white rounded-t-3xl p-6 shadow-2xl z-10 max-h-[85vh] flex flex-col pb-safe"
          >
            <div className="w-12 h-1.5 bg-[#E2E4F0] rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EEF1FE] flex items-center justify-center text-[#5C71F3]">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="text-[18px] font-bold text-[#1E1E2D] tracking-tight">
                  {t('notifications_title')}
                </h3>
              </div>
              <button
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F5F6FA] flex items-center justify-center text-[#8E8E9F] hover:text-[#1E1E2D]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 pr-1">
              {notifications.map((item) => {
                const locItem = getLocalizedNotification(item);
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#F8F9FD] border border-[#EFEFF8] flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#EAEAF5] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      {item.type === 'workout' && <Dumbbell className="w-4 h-4 text-[#5C71F3]" />}
                      {item.type === 'nutrition' && <Droplets className="w-4 h-4 text-[#00D09E]" />}
                      {item.type === 'streak' && <Flame className="w-4 h-4 text-[#FFB020]" />}
                      {item.type === 'general' && <Bell className="w-4 h-4 text-[#9D5CE5]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[13px] font-bold text-[#1E1E2D]">{locItem.title}</h4>
                        <span className="text-[10px] text-[#8E8E9F] font-medium">{locItem.timestamp}</span>
                      </div>
                      <p className="text-[12px] text-[#8E8E9F] mt-1 leading-relaxed">{locItem.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
