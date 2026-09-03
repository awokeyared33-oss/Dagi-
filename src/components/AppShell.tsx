import React from 'react';
import { useApp } from '../context/AppContext';
import { BottomNavigation } from './BottomNavigation';
import { QuickLogModal } from './QuickLogModal';
import { NotificationDrawer } from './NotificationDrawer';
import { FoodAssistantModal } from '../views/FoodAssistantModal';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { route } = useApp();

  // Bottom navigation only appears on main app views after Q&A assessment and plan setup
  const showBottomNav = ['dashboard', 'train', 'food-tracker', 'nutrition', 'progress', 'profile'].includes(route);

  return (
    <div className="min-h-[100dvh] w-full bg-[#ECEEF5] flex justify-center items-stretch antialiased">
      {/* Root Mobile App Shell (390-430px max width, centered on desktop) */}
      <div className="app-shell shadow-xl">
        {/* Main Scrolling Content Container */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col w-full">
          {children}
        </main>

        {/* Fixed Mobile Bottom Navigation (Visible only after Q&A assessment has completed) */}
        {showBottomNav && <BottomNavigation />}

        {/* Floating Modals */}
        <QuickLogModal />
        <NotificationDrawer />
        <FoodAssistantModal />
      </div>
    </div>
  );
};

