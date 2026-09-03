import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/AppShell';
import { SplashScreen } from './views/SplashScreen';
import { LanguageScreen } from './views/LanguageScreen';
import { OnboardingFlow } from './views/OnboardingFlow';
import { AuthScreen } from './views/AuthScreen';
import { AssessmentScreen } from './views/AssessmentScreen';
import { PlanGenerationScreen } from './views/PlanGenerationScreen';
import { PlanRevealScreen } from './views/PlanRevealScreen';
import { DashboardView } from './views/DashboardView';
import { TrainView } from './views/TrainView';
import { FoodTrackerView } from './views/FoodTrackerView';
import { NutritionView } from './views/NutritionView';
import { ProgressView } from './views/ProgressView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';
import { ActiveWorkoutModal } from './views/ActiveWorkoutModal';
import { WorkoutSummaryModal } from './views/WorkoutSummaryModal';
import { AnimatePresence, motion } from 'motion/react';

const MainNavigator: React.FC = () => {
  const { route } = useApp();

  // Admin portal runs in full desktop/responsive mode
  if (route === 'admin') {
    return <AdminView />;
  }

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        {route === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <SplashScreen />
          </motion.div>
        )}

        {route === 'language' && (
          <motion.div
            key="language"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <LanguageScreen />
          </motion.div>
        )}

        {route === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <OnboardingFlow />
          </motion.div>
        )}

        {route === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <AuthScreen />
          </motion.div>
        )}

        {route === 'assessment' && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <AssessmentScreen />
          </motion.div>
        )}

        {route === 'plan-generating' && (
          <motion.div
            key="plan-generating"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            className="flex-1 flex flex-col"
          >
            <PlanGenerationScreen />
          </motion.div>
        )}

        {route === 'plan-ready' && (
          <motion.div
            key="plan-ready"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            <PlanRevealScreen />
          </motion.div>
        )}

        {route === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <DashboardView />
          </motion.div>
        )}

        {route === 'train' && (
          <motion.div
            key="train"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <TrainView />
          </motion.div>
        )}

        {route === 'food-tracker' && (
          <motion.div
            key="food-tracker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <FoodTrackerView />
          </motion.div>
        )}

        {route === 'nutrition' && (
          <motion.div
            key="nutrition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <NutritionView />
          </motion.div>
        )}

        {route === 'progress' && (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <ProgressView />
          </motion.div>
        )}

        {route === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <ProfileView />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Workout Overlays */}
      <ActiveWorkoutModal />
      <WorkoutSummaryModal />
    </AppShell>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainNavigator />
    </AppProvider>
  );
}
