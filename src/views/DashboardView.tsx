import React from 'react';
import { Header } from '../components/Header';
import { MembershipStatusCard } from '../components/MembershipStatusCard';
import { OverallProgressCard } from '../components/OverallProgressCard';
import { WeeklyOverviewCard } from '../components/WeeklyOverviewCard';
import { StatCards } from '../components/StatCards';
import { TodayGoalsList } from '../components/TodayGoalsList';

export const DashboardView: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col pt-3 bg-[#F5F6FA] min-h-full">
      {/* 1. Header with dynamic greeting and notifications */}
      <Header />

      {/* 2. Membership Status Card (Ethiopian Calendar 30-Day Cycle Tracking) */}
      <MembershipStatusCard />

      {/* 3. Overall Progress Card with circular gauge and 4 legend stats */}
      <OverallProgressCard />

      {/* 4. Weekly Overview with 7 animated daily bars */}
      <WeeklyOverviewCard />

      {/* 5. Two Stat Cards (Current Streak & Success Rate) */}
      <StatCards />

      {/* 6. Today's Fitness Goals list (Workout, Nutrition, Hydration, Steps, Recovery) */}
      <TodayGoalsList />
    </div>
  );
};
