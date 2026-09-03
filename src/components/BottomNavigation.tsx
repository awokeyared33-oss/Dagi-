import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Home, Dumbbell, UtensilsCrossed, Apple, User } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { route, setRoute, t } = useApp();

  return (
    <div
      id="mobile-bottom-nav-container"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 pointer-events-auto"
    >
      <nav className="h-16 bg-white/95 backdrop-blur-md border-t border-slate-100 px-2 flex justify-around items-center relative shadow-[0_-4px_20px_rgba(0,0,0,0.04)] pb-safe">
        {/* Tab 1: Home / Dashboard */}
        <button
          id="nav-tab-dashboard"
          onClick={() => setRoute('dashboard')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all py-1 ${
            route === 'dashboard' ? 'text-[#5C71F3]' : 'text-[#8E8E9F] hover:text-[#1E1E2D]'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${route === 'dashboard' ? 'bg-[#EEF1FE]' : ''}`}>
            <Home className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className={`text-[10px] tracking-tight ${route === 'dashboard' ? 'font-black' : 'font-bold'}`}>
            {t('nav_home')}
          </span>
        </button>

        {/* Tab 2: Train */}
        <button
          id="nav-tab-train"
          onClick={() => setRoute('train')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all py-1 ${
            route === 'train' ? 'text-[#5C71F3]' : 'text-[#8E8E9F] hover:text-[#1E1E2D]'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${route === 'train' ? 'bg-[#EEF1FE]' : ''}`}>
            <Dumbbell className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className={`text-[10px] tracking-tight ${route === 'train' ? 'font-black' : 'font-bold'}`}>
            {t('nav_train')}
          </span>
        </button>

        {/* Center Tab: Jossy AI */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.button
            id="nav-tab-food-tracker"
            whileTap={{ scale: 0.92 }}
            onClick={() => setRoute('food-tracker')}
            className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all ${
              route === 'food-tracker' ? 'text-[#5C71F3]' : 'text-[#8E8E9F] hover:text-[#1E1E2D]'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                route === 'food-tracker'
                  ? 'bg-[#5C71F3] text-white shadow-md shadow-[#5C71F3]/30 scale-105 p-1'
                  : 'bg-[#FFF7E6] text-[#FFB020] border border-[#FFE8B8] p-1'
              }`}
            >
              <img
                src="/dagi-logo.jpg"
                alt="Dagi Fitness AI"
                className="w-7 h-7 object-cover rounded-xl"
              />
            </div>
            <span
              className={`text-[10px] tracking-tight mt-0.5 ${
                route === 'food-tracker' ? 'font-black text-[#5C71F3]' : 'font-bold text-[#8E8E9F]'
              }`}
            >
              {t('nav_tracker')}
            </span>
          </motion.button>
        </div>

        {/* Tab 4: Eat / Meal Plans */}
        <button
          id="nav-tab-nutrition"
          onClick={() => setRoute('nutrition')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all py-1 ${
            route === 'nutrition' ? 'text-[#5C71F3]' : 'text-[#8E8E9F] hover:text-[#1E1E2D]'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${route === 'nutrition' ? 'bg-[#EEF1FE]' : ''}`}>
            <Apple className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className={`text-[10px] tracking-tight ${route === 'nutrition' ? 'font-black' : 'font-bold'}`}>
            {t('nav_eat')}
          </span>
        </button>

        {/* Tab 5: Profile */}
        <button
          id="nav-tab-profile"
          onClick={() => setRoute('profile')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all py-1 ${
            route === 'profile' ? 'text-[#5C71F3]' : 'text-[#8E8E9F] hover:text-[#1E1E2D]'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${route === 'profile' ? 'bg-[#EEF1FE]' : ''}`}>
            <User className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className={`text-[10px] tracking-tight ${route === 'profile' ? 'font-black' : 'font-bold'}`}>
            {t('nav_profile')}
          </span>
        </button>
      </nav>
    </div>
  );
};
