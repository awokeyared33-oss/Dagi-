import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { FoodAssistantModal } from './FoodAssistantModal';
import { generatePersonalizedMealPlan } from '../data/foodDatabase';
import { PlannedMealItem } from '../types';
import { Utensils, Droplets, Sparkles, Trash2, Plus, Flame, Check, PlusCircle } from 'lucide-react';

export const NutritionView: React.FC = () => {
  const {
    user,
    language,
    t,
    getLocalizedMealType,
    loggedMeals,
    logFoodItem,
    deleteMeal,
    consumedCalories,
    consumedProteinG,
    consumedCarbsG,
    consumedFatG,
    currentWaterL,
    addWaterL,
  } = useApp();

  const isAmharic = language === 'am';
  const [isFoodAssistantOpen, setIsFoodAssistantOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Generate personalized meal plan based on user profile
  const plannedMeals = generatePersonalizedMealPlan(user);
  const firstName = user.name ? user.name.trim().split(' ')[0] : (isAmharic ? 'ስፖርተኛ' : 'Athlete');

  // Math percentages
  const calPercent = user.targetCalories > 0
    ? Math.min(100, Math.round((consumedCalories / user.targetCalories) * 100))
    : 0;
  const proteinPercent = user.targetProteinG > 0
    ? Math.min(100, Math.round((consumedProteinG / user.targetProteinG) * 100))
    : 0;
  const carbsPercent = user.targetCarbsG > 0
    ? Math.min(100, Math.round((consumedCarbsG / user.targetCarbsG) * 100))
    : 0;
  const fatPercent = user.targetFatG > 0
    ? Math.min(100, Math.round((consumedFatG / user.targetFatG) * 100))
    : 0;

  const isMealTypeLogged = (type: string) => {
    return loggedMeals.some((m) => m.mealType === type);
  };

  const handleLogPlannedMeal = (meal: PlannedMealItem) => {
    const isCurrentlyLogged = isMealTypeLogged(meal.mealType);
    if (isCurrentlyLogged) {
      // Remove previously logged items for this meal type
      const toDelete = loggedMeals.filter((m) => m.mealType === meal.mealType);
      toDelete.forEach((m) => deleteMeal(m.id));
      setToastMessage(
        isAmharic
          ? `${getLocalizedMealType(meal.mealType)} ከማስታወሻ ተሰርዟል`
          : `${getLocalizedMealType(meal.mealType)} removed from diary`
      );
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }

    meal.foods.forEach(({ foodItem, servingMultiplier }) => {
      logFoodItem(
        foodItem,
        servingMultiplier,
        meal.mealType as any,
        `${servingMultiplier}x ${foodItem.servingSize}`
      );
    });

    setToastMessage(
      isAmharic
        ? `${getLocalizedMealType(meal.mealType)} ተመዝግቧል! (+${meal.calories} kcal, ${meal.proteinG}g ፕ)`
        : `${getLocalizedMealType(meal.mealType)} logged! (+${meal.calories} kcal, ${meal.proteinG}g protein)`
    );
    setTimeout(() => setToastMessage(null), 2500);
  };

  const getMealEmoji = (type: string) => {
    switch (type) {
      case 'breakfast':
        return '🥣';
      case 'lunch':
        return '🍲';
      case 'snack':
        return '🍌';
      case 'dinner':
        return '🥩';
      default:
        return '🍽️';
    }
  };

  return (
    <div className="flex-1 flex flex-col pt-3 pb-28 px-4 bg-[#F5F6FA] min-h-full relative">
      {/* Toast Notification */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-18 left-4 right-4 z-50 max-w-[400px] mx-auto bg-[#1E1E2D] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between text-[13px] font-bold"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#00D09E]" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white">
            <span className="text-xs">✕</span>
          </button>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#1E1E2D] tracking-tight">
            {isAmharic ? `የ ${firstName} የምግብ ዕቅድ` : `Meal Plan for ${firstName}`}
          </h1>
          <p className="text-[13px] text-[#8E8E9F] font-medium mt-0.5">
            {isAmharic ? 'የተሰላው ለ' : 'Calibrated for'}{' '}
            <span className="text-[#5C71F3] font-bold">{user.targetCalories} {t('unitKcal')}</span> •{' '}
            <span className="text-[#5C71F3] font-bold">{user.targetProteinG}g {t('protein')}</span>
          </p>
        </div>

        <button
          onClick={() => setIsFoodAssistantOpen(true)}
          className="px-3 py-2 rounded-2xl bg-[#5C71F3] text-white text-[12px] font-extrabold flex items-center gap-1.5 shadow-md shadow-[#5C71F3]/25 cursor-pointer hover:bg-[#4B62EB] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('jossyAIBtn')}</span>
        </button>
      </div>

      {/* Main Calorie & Macro Target Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-5 card-shadow border border-[#EFEFF8] mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] font-bold text-[#8E8E9F] uppercase tracking-wider">
            {t('dailyCaloricProgress')}
          </span>
          <span className="text-[12px] font-black text-[#5C71F3] bg-[#EEF1FE] px-2.5 py-0.5 rounded-full">
            {calPercent}% {t('percentOfTarget')}
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-[28px] font-black text-[#1E1E2D] tracking-tight">
              {consumedCalories.toLocaleString()}
            </span>
            <span className="text-[14px] font-bold text-[#8E8E9F] ml-1.5">
              / {user.targetCalories.toLocaleString()} {t('unitKcal')}
            </span>
          </div>
          <span className="text-[12px] font-bold text-[#8E8E9F]">
            {Math.max(0, user.targetCalories - consumedCalories)} {t('kcalLeft')}
          </span>
        </div>

        {/* Primary Calorie Progress Bar */}
        <div className="w-full h-3.5 bg-[#F1F2FA] rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${calPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#5C71F3] to-[#7B8DF7] rounded-full"
          />
        </div>

        {/* 3 Macro Target Progress Bars */}
        <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-[#F1F2FA]">
          {/* Protein */}
          <div className="bg-[#F8F9FD] p-2.5 rounded-2xl border border-[#ECEEF5]">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase text-[#5C71F3]">
              <span>{t('protein')}</span>
              <span>{proteinPercent}%</span>
            </div>
            <p className="text-[13px] font-extrabold text-[#1E1E2D] mt-1">
              {consumedProteinG} / {user.targetProteinG}g
            </p>
            <div className="w-full h-1.5 bg-[#E2E6FA] rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-[#5C71F3] rounded-full" style={{ width: `${proteinPercent}%` }} />
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-[#F8F9FD] p-2.5 rounded-2xl border border-[#ECEEF5]">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase text-[#FFB020]">
              <span>{t('carbs')}</span>
              <span>{carbsPercent}%</span>
            </div>
            <p className="text-[13px] font-extrabold text-[#1E1E2D] mt-1">
              {consumedCarbsG} / {user.targetCarbsG}g
            </p>
            <div className="w-full h-1.5 bg-[#FFF0D4] rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-[#FFB020] rounded-full" style={{ width: `${carbsPercent}%` }} />
            </div>
          </div>

          {/* Fat */}
          <div className="bg-[#F8F9FD] p-2.5 rounded-2xl border border-[#ECEEF5]">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase text-[#FF5C5C]">
              <span>{t('fats')}</span>
              <span>{fatPercent}%</span>
            </div>
            <p className="text-[13px] font-extrabold text-[#1E1E2D] mt-1">
              {consumedFatG} / {user.targetFatG}g
            </p>
            <div className="w-full h-1.5 bg-[#FFDADA] rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-[#FF5C5C] rounded-full" style={{ width: `${fatPercent}%` }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hydration Tracker Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-3xl p-5 card-shadow border border-[#EFEFF8] mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E6FAF5] text-[#00D09E] flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#1E1E2D]">{t('hydrationTarget')}</h3>
              <span className="text-[11px] text-[#8E8E9F] font-medium">{t('optimalCellularRecovery')}</span>
            </div>
          </div>

          <span className="text-[14px] font-black text-[#00D09E]">
            {currentWaterL.toFixed(1)} / {user.targetWaterL.toFixed(1)} L
          </span>
        </div>

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {[0.25, 0.5, 0.75].map((amt) => (
            <button
              key={amt}
              onClick={() => addWaterL(amt)}
              className="py-2.5 rounded-xl bg-[#E6FAF5] border border-[#00D09E]/20 text-[#00D09E] text-[12px] font-extrabold flex items-center justify-center gap-1 cursor-pointer hover:bg-[#00D09E] hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{amt * 1000} ml</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Personalized Meal Schedule (Ethiopian & Clean Fuel) */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[16px] font-bold text-[#1E1E2D] tracking-tight">
            {t('todaysPrescribedMeals')}
          </h3>
          <span className="text-[11px] font-bold text-[#5C71F3] uppercase">
            {t('ethiopianFuelBadge')}
          </span>
        </div>

        <div className="space-y-3">
          {plannedMeals.map((meal) => {
            const isLogged = isMealTypeLogged(meal.mealType);
            return (
              <div
                key={meal.mealType}
                className="bg-white rounded-3xl p-4.5 card-shadow border border-[#EFEFF8] space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#F5F6FA] text-[20px] flex items-center justify-center shrink-0">
                      {getMealEmoji(meal.mealType)}
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C71F3]">
                        {getLocalizedMealType(meal.mealType)}
                      </span>
                      <h4 className="text-[14px] font-bold text-[#1E1E2D] leading-snug mt-0.5">
                        {isAmharic && meal.titleAm ? meal.titleAm : meal.title}
                      </h4>
                      <p className="text-[11px] text-[#8E8E9F] mt-0.5">
                        {meal.portionDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Macro pill summary */}
                <div className="bg-[#F8F9FD] rounded-2xl p-2.5 border border-[#ECEEF5] flex items-center justify-between text-[11px] font-bold">
                  <div className="text-[#1E1E2D]">
                    <span className="text-[#5C71F3] font-black">{meal.calories}</span> {t('unitKcal')}
                  </div>
                  <div className="text-[#8E8E9F]">
                    {isAmharic ? 'ፕ' : 'P'}: <span className="text-[#1E1E2D]">{meal.proteinG}g</span>
                  </div>
                  <div className="text-[#8E8E9F]">
                    {isAmharic ? 'ካ' : 'C'}: <span className="text-[#1E1E2D]">{meal.carbsG}g</span>
                  </div>
                  <div className="text-[#8E8E9F]">
                    {isAmharic ? 'ስ' : 'F'}: <span className="text-[#1E1E2D]">{meal.fatG}g</span>
                  </div>
                  <div className="text-[#8E8E9F]">
                    {isAmharic ? 'ፋ' : 'Fib'}: <span className="text-[#1E1E2D]">{meal.fiberG}g</span>
                  </div>
                </div>

                {/* 1-Tap Log Meal CTA */}
                <button
                  onClick={() => handleLogPlannedMeal(meal)}
                  className={`w-full py-2.5 rounded-xl font-extrabold text-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isLogged
                      ? 'bg-[#E6FAF5] text-[#00D09E] border border-[#00D09E]/30'
                      : 'bg-[#EEF1FE] text-[#5C71F3] hover:bg-[#5C71F3] hover:text-white'
                  }`}
                >
                  {isLogged ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{t('mealLoggedBadge')}</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>{t('logThisMeal1Tap')}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Logged Food Diary */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[16px] font-bold text-[#1E1E2D] tracking-tight">
            {t('todaysFoodDiary')} ({loggedMeals.length})
          </h3>
          <button
            onClick={() => setIsFoodAssistantOpen(true)}
            className="text-[12px] font-bold text-[#5C71F3] flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('addCustomMealBtn')}</span>
          </button>
        </div>

        {loggedMeals.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-[#EFEFF8] card-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F6FA] text-[#8E8E9F] flex items-center justify-center mx-auto mb-2 text-[22px]">
              🥗
            </div>
            <h4 className="text-[14px] font-bold text-[#1E1E2D]">{t('noMealsLoggedYet')}</h4>
            <p className="text-[12px] text-[#8E8E9F] mt-1 max-w-[260px] mx-auto">
              {t('noMealsLoggedDesc')}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {loggedMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-white rounded-2xl p-3.5 card-shadow border border-[#EFEFF8] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F6FA] text-[#1E1E2D] flex items-center justify-center text-[18px]">
                    {getMealEmoji(meal.mealType)}
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#1E1E2D] leading-tight">{meal.name}</h4>
                    <p className="text-[11px] text-[#8E8E9F] mt-0.5">
                      {meal.timestamp} • <span className="text-[#5C71F3] font-semibold">{meal.calories} {t('unitKcal')}</span> (P: {meal.proteinG}g, C: {meal.carbsG}g, F: {meal.fatG}g)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => deleteMeal(meal.id)}
                  className="w-8 h-8 rounded-xl text-[#8E8E9F] hover:text-[#FF5C5C] hover:bg-[#FFEBEB] flex items-center justify-center cursor-pointer transition-colors"
                  title={isAmharic ? 'ሰርዝ' : 'Delete'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Food Assistant Modal */}
      <FoodAssistantModal
        isOpen={isFoodAssistantOpen}
        onClose={() => setIsFoodAssistantOpen(false)}
      />
    </div>
  );
};


