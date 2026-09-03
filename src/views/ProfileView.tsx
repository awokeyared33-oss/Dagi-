import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { translations, LanguageCode } from '../data/translations';
import { UserGoal, ExperienceLevel, Gender, EquipmentType } from '../types';
import { FitnessCalculator } from '../services/fitnessServices';
import {
  User,
  Zap,
  Globe,
  Smartphone,
  RotateCcw,
  ChevronRight,
  Check,
  Edit3,
  Save,
  Camera,
  X,
  Dumbbell,
  Flame,
  Droplets,
  Activity,
  Heart,
  Calendar,
  Clock,
  Sparkles,
  LogOut,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, updateUserProfile, resetAllDataToDefaults, signOutMember, setRoute, language, t } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAmharic = language === 'am';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Profile Edit Form State
  const [editForm, setEditForm] = useState({
    name: user.name || '',
    email: user.email || '',
    age: user.age || 26,
    gender: user.gender || 'male',
    heightCm: user.heightCm || 175,
    weightKg: user.weightKg || 75,
    targetWeightKg: user.targetWeightKg || 78,
    goal: user.goal || 'build_muscle',
    experience: user.experience || 'intermediate',
    workoutFrequencyDays: user.workoutFrequencyDays || 4,
    workoutDurationMin: user.workoutDurationMin || 60,
    dietPreference: user.dietPreference || 'high_protein',
    equipment: user.equipment || ['gym', 'barbell', 'dumbbells', 'machines'],
    language: user.language || 'en',
  });

  const handleOpenEdit = () => {
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      age: user.age || 26,
      gender: user.gender || 'male',
      heightCm: user.heightCm || 175,
      weightKg: user.weightKg || 75,
      targetWeightKg: user.targetWeightKg || 78,
      goal: user.goal || 'build_muscle',
      experience: user.experience || 'intermediate',
      workoutFrequencyDays: user.workoutFrequencyDays || 4,
      workoutDurationMin: user.workoutDurationMin || 60,
      dietPreference: user.dietPreference || 'high_protein',
      equipment: user.equipment || ['gym', 'barbell', 'dumbbells', 'machines'],
      language: user.language || 'en',
    });
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    updateUserProfile(editForm);
    setIsEditing(false);
    showToast(isAmharic ? 'መገለጫዎ በትክክል ተዘምኗል!' : 'Profile & targets updated successfully!');
  };

  // Avatar Upload Handler
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          updateUserProfile({ avatarUrl: reader.result as string });
          showToast(isAmharic ? 'ፎቶ ተቀይሯል!' : 'Profile photo updated!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    updateUserProfile({ avatarUrl: undefined });
    showToast(isAmharic ? 'ፎቶ ተሰርዟል' : 'Photo removed, using initials avatar.');
  };

  // Generate dynamic initials for the user (e.g. "DT" for Dawit Tadesse)
  const userInitials = (user.name || 'Athlete')
    .trim()
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AT';

  // Calculate BMI
  const bmiData = FitnessCalculator.calculateBMI(user.weightKg, user.heightCm);

  // Dynamic Personalization Summary text
  const dynamicPlanSummary = isAmharic
    ? `የእርስዎ የጆሲ ዕቅድ በ${
        user.goal === 'build_muscle'
          ? 'ጡንቻ ግንባታ'
          : user.goal === 'lose_weight'
          ? 'ክብደት መቀነስ'
          : user.goal === 'burn_fat'
          ? 'ስብ ማቃጠል'
          : user.goal === 'get_stronger'
          ? 'ጥንካሬ ማሳደግ'
          : 'አጠቃላይ የአካል ብቃት'
      } ግብ፣ የ${user.experience} ልምድ ደረጃ፣ እና በሳምንት ${
        user.workoutFrequencyDays
      } ቀናት ልምምድ ላይ የተመሰረተ ነው።`
    : `Your Dagi Fitness plan is custom-tailored around your goal of ${user.goal
        .replace('_', ' ')
        .toUpperCase()}, your ${user.experience} athletic background, and your ${
        user.workoutFrequencyDays
      }-day weekly training frequency.`;

  return (
    <div className="flex-1 flex flex-col pt-3 pb-28 px-4 bg-[#F5F6FA] min-h-full">
      {/* Hidden File Input for Avatar */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-[#1E1E2D] text-white px-4 py-2.5 rounded-2xl shadow-xl border border-white/10 flex items-center gap-2 text-[13px] font-bold"
          >
            <Check className="w-4 h-4 text-[#00D09E]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <div>
          <h1 className="text-[24px] font-extrabold text-[#1E1E2D] tracking-tight">
            {isAmharic ? 'የአትሌት መገለጫ' : 'Athlete Profile'}
          </h1>
          <p className="text-[12px] text-[#8E8E9F] font-semibold">
            {isAmharic ? 'የግል መረጃ እና የሰውነት ግቦች' : 'Personal biometrics & verified targets'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenEdit}
            className="px-3.5 py-1.5 rounded-2xl bg-[#5C71F3] text-white text-[11px] font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#5C71F3]/25 hover:bg-[#4B62EB]"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isAmharic ? 'አስተካክል' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* User Hero Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-5 card-shadow border border-[#EFEFF8] mb-4"
      >
        <div className="flex items-center gap-4">
          {/* Avatar Container with Upload overlay */}
          <div className="relative group shrink-0">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-18 h-18 rounded-3xl overflow-hidden border-2 border-[#5C71F3]/30 shadow-md bg-gradient-to-tr from-[#5C71F3] to-[#735BF2] flex items-center justify-center cursor-pointer transition-transform group-hover:scale-105"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[22px] font-black text-white tracking-wider">
                  {userInitials}
                </span>
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#5C71F3] text-white border-2 border-white flex items-center justify-center cursor-pointer shadow-xs"
              title="Change Photo"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-[19px] font-black text-[#1E1E2D] tracking-tight truncate">
                {user.name || (isAmharic ? 'አትሌት' : 'Athlete')}
              </h2>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#5C71F3] bg-[#EEF1FE] px-2 py-0.5 rounded-full shrink-0">
                VIP Member
              </span>
            </div>

            <p className="text-[12px] text-[#8E8E9F] font-semibold truncate mt-0.5">
              {user.email || 'athlete@blueskyfitness.com'}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] font-extrabold text-[#5C71F3] bg-[#EEF1FE] px-2.5 py-1 rounded-xl capitalize">
                {user.goal.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-extrabold text-[#FFB020] bg-[#FFF7E6] px-2.5 py-1 rounded-xl capitalize">
                {user.experience}
              </span>
            </div>
          </div>
        </div>

        {user.avatarUrl && (
          <button
            onClick={handleRemoveAvatar}
            className="text-[11px] font-bold text-[#8E8E9F] hover:text-[#FF5C5C] mt-2 block text-right w-full cursor-pointer"
          >
            {isAmharic ? 'ፎቶ ሰርዝ (በፊደላት ተካ)' : 'Remove photo (use initials)'}
          </button>
        )}
      </motion.div>

      {/* Personalization Summary ("Your Jossy Plan") */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-gradient-to-br from-[#5C71F3] to-[#455DE8] rounded-3xl p-5 text-white mb-4 shadow-lg shadow-[#5C71F3]/25 relative overflow-hidden"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#FFD700]" />
          <h3 className="text-[13px] font-black uppercase tracking-wider">
            {isAmharic ? 'የእርስዎ የግል የዳጊ ፊትነስ ዕቅድ' : 'Your Dagi Fitness Personalized Plan'}
          </h3>
        </div>
        <p className="text-[13px] font-medium leading-relaxed text-white/95">
          {dynamicPlanSummary}
        </p>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-white/75 block">
              {isAmharic ? 'ድግግሞሽ' : 'Frequency'}
            </span>
            <span className="text-[14px] font-black mt-0.5 block">
              {user.workoutFrequencyDays} {isAmharic ? 'ቀናት / ሳምንት' : 'Days / Wk'}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/75 block">
              {isAmharic ? 'ቆይታ' : 'Duration'}
            </span>
            <span className="text-[14px] font-black mt-0.5 block">
              {user.workoutDurationMin} {isAmharic ? 'ደቂቃ / ክፍለ-ጊዜ' : 'Min / Sess'}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/75 block">
              {isAmharic ? 'የካሎሪ ዒላማ' : 'Calorie Target'}
            </span>
            <span className="text-[14px] font-black mt-0.5 block">{user.targetCalories} {t('unitKcal')}</span>
          </div>
        </div>
      </motion.div>

      {/* Profile Information Card */}
      <div className="bg-white rounded-3xl p-5 card-shadow border border-[#EFEFF8] mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-extrabold text-[#1E1E2D] uppercase tracking-wider">
            {isAmharic ? 'የአትሌት ባዮ-መረጃ' : 'Athlete Biometric Profile'}
          </h3>
          <span className="text-[11px] font-bold text-[#5C71F3]">{isAmharic ? 'የተረጋገጠ' : 'Verified'}</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
            <span className="text-[10px] font-bold text-[#8E8E9F] uppercase block">
              {isAmharic ? 'እድሜ እና ጾታ' : 'Age & Gender'}
            </span>
            <p className="text-[14px] font-black text-[#1E1E2D] mt-0.5 capitalize">
              {user.age} {isAmharic ? 'ዓመት' : 'yrs'} • {user.gender === 'male' ? (isAmharic ? 'ወንድ' : 'Male') : user.gender === 'female' ? (isAmharic ? 'ሴት' : 'Female') : user.gender}
            </p>
          </div>

          <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
            <span className="text-[10px] font-bold text-[#8E8E9F] uppercase block">
              {isAmharic ? 'ቁመት እና ክብደት' : 'Height & Weight'}
            </span>
            <p className="text-[14px] font-black text-[#1E1E2D] mt-0.5">
              {user.heightCm} {t('unitCm')} • {user.weightKg} {t('unitKg')}
            </p>
          </div>

          <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
            <span className="text-[10px] font-bold text-[#8E8E9F] uppercase block">
              {isAmharic ? 'የሰውነት ኢንዴክስ (BMI)' : 'Body Mass Index (BMI)'}
            </span>
            <p className="text-[14px] font-black text-[#1E1E2D] mt-0.5">
              {bmiData.bmi} <span className="text-[11px] font-bold text-[#00D09E]">({bmiData.category})</span>
            </p>
          </div>

          <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
            <span className="text-[10px] font-bold text-[#8E8E9F] uppercase block">
              {isAmharic ? 'ዒላማ ክብደት' : 'Target Weight'}
            </span>
            <p className="text-[14px] font-black text-[#1E1E2D] mt-0.5">
              {user.targetWeightKg ? `${user.targetWeightKg} ${t('unitKg')}` : (isAmharic ? 'አልተወሰነም' : 'Not set')}
            </p>
          </div>

          <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5] col-span-2">
            <span className="text-[10px] font-bold text-[#8E8E9F] uppercase block">
              {isAmharic ? 'የመሣሪያ አቅርቦት' : 'Equipment Access'}
            </span>
            <p className="text-[12px] font-black text-[#1E1E2D] mt-0.5 capitalize">
              {user.equipment && user.equipment.length > 0
                ? user.equipment.join(', ')
                : (isAmharic ? 'ሙሉ የጂም መሣሪያዎች' : 'Full Gym Equipment')}
            </p>
          </div>
        </div>
      </div>

      {/* Calculated Bio-Targets (Metabolic Engine) */}
      <div className="bg-white rounded-3xl p-5 card-shadow border border-[#EFEFF8] mb-4">
        <h3 className="text-[13px] font-extrabold text-[#1E1E2D] uppercase tracking-wider mb-3">
          {isAmharic ? 'የተሰሉ የቀን ግቦች' : 'Calculated Nutrition & Bio-Targets'}
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
            <span className="text-[10px] font-bold text-[#8E8E9F] uppercase block">
              {isAmharic ? 'የቀን ካሎሪ ዒላማ' : 'Daily Calorie Target'}
            </span>
            <p className="text-[17px] font-black text-[#5C71F3] mt-0.5">{user.targetCalories} {t('unitKcal')}</p>
          </div>

          <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
            <span className="text-[10px] font-bold text-[#8E8E9F] uppercase block">
              {isAmharic ? 'የቀን ፕሮቲን ዒላማ' : 'Daily Protein Goal'}
            </span>
            <p className="text-[17px] font-black text-[#FF5C5C] mt-0.5">{user.targetProteinG} g</p>
          </div>

          <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
            <span className="text-[10px] font-bold text-[#8E8E9F] uppercase block">
              {isAmharic ? 'የቀን ካርቦሃይድሬት ዒላማ' : 'Daily Carbs Goal'}
            </span>
            <p className="text-[17px] font-black text-[#FFB020] mt-0.5">{user.targetCarbsG} g</p>
          </div>

          <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
            <span className="text-[10px] font-bold text-[#8E8E9F] uppercase block">
              {isAmharic ? 'የቀን ስብ ዒላማ' : 'Daily Fats Goal'}
            </span>
            <p className="text-[17px] font-black text-[#735BF2] mt-0.5">{user.targetFatG} g</p>
          </div>

          <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
            <span className="text-[10px] font-bold text-[#8E8E9F] uppercase block">
              {isAmharic ? 'የውሃ ፍጆታ ዒላማ' : 'Hydration Target'}
            </span>
            <p className="text-[17px] font-black text-[#00D09E] mt-0.5">{user.targetWaterL} {isAmharic ? 'ሊትር' : 'Liters'}</p>
          </div>

          <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#ECEEF5]">
            <span className="text-[10px] font-bold text-[#8E8E9F] uppercase block">
              {isAmharic ? 'የቀን የእርምጃ ዒላማ' : 'Daily Step Target'}
            </span>
            <p className="text-[17px] font-black text-[#1E1E2D] mt-0.5">
              {(user.targetDailySteps || 8000).toLocaleString()} {isAmharic ? 'እርምጃዎች' : 'steps'}
            </p>
          </div>
        </div>
      </div>

      {/* Preferences & System Actions */}
      <div className="bg-white rounded-3xl p-5 card-shadow border border-[#EFEFF8] mb-4 space-y-3">
        <h3 className="text-[13px] font-extrabold text-[#1E1E2D] uppercase tracking-wider mb-2">
          {isAmharic ? 'የስርዓት ምርጫዎች' : 'System Preferences'}
        </h3>

        {/* Language Selection */}
        <div className="flex items-center justify-between py-2 border-b border-[#F1F2FA]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EEF1FE] text-[#5C71F3] flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[13px] font-bold text-[#1E1E2D] block">
                {isAmharic ? 'ቋንቋ' : 'Language'}
              </span>
              <span className="text-[11px] text-[#8E8E9F]">English / አማርኛ (Amharic)</span>
            </div>
          </div>

          <div className="flex gap-1 bg-[#F5F6FA] p-1 rounded-xl">
            <button
              onClick={() => updateUserProfile({ language: 'en' })}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                user.language === 'en' ? 'bg-white text-[#5C71F3] shadow-xs' : 'text-[#8E8E9F]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => updateUserProfile({ language: 'am' })}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                user.language === 'am' ? 'bg-white text-[#5C71F3] shadow-xs' : 'text-[#8E8E9F]'
              }`}
            >
              አማ
            </button>
          </div>
        </div>

        {/* Recalibrate Goals */}
        <button
          onClick={() => setRoute('assessment')}
          className="w-full flex items-center justify-between py-2 border-b border-[#F1F2FA] text-left cursor-pointer hover:opacity-80"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFF7E6] text-[#FFB020] flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[13px] font-bold text-[#1E1E2D] block">
                {isAmharic ? 'የአካል ብቃት ግቦችን እንደገና አስተካክል' : 'Recalibrate Fitness Goals'}
              </span>
              <span className="text-[11px] text-[#8E8E9F]">
                {isAmharic ? 'የ16-ደረጃ ግምገማን ይድገሙ' : 'Re-take 16-step athletic assessment'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8E8E9F]" />
        </button>

        {/* Sign Out Action */}
        <div className="pt-2">
          {showSignOutConfirm ? (
            <div className="bg-[#FFEBEB] p-3.5 rounded-2xl border border-[#FF5C5C]/30 space-y-2">
              <p className="text-[12px] font-bold text-[#FF5C5C] text-center">
                {isAmharic ? 'እርግጠኛ ነዎት መውጣት ይፈልጋሉ?' : 'Are you sure you want to sign out?'}
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={async () => {
                    setShowSignOutConfirm(false);
                    await signOutMember();
                  }}
                  className="px-4 py-1.5 bg-[#FF5C5C] text-white rounded-xl text-[11px] font-extrabold cursor-pointer"
                >
                  {isAmharic ? 'አዎ ውጣ' : 'Yes, Sign Out'}
                </button>
                <button
                  onClick={() => setShowSignOutConfirm(false)}
                  className="px-4 py-1.5 bg-white text-[#1E1E2D] rounded-xl text-[11px] font-bold border border-[#D9DCED] cursor-pointer"
                >
                  {isAmharic ? 'ተመለስ' : 'Cancel'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowSignOutConfirm(true)}
              className="w-full flex items-center justify-between py-2 text-left cursor-pointer hover:opacity-80 text-[#8E8E9F] hover:text-[#FF5C5C]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FFEBEB] text-[#FF5C5C] flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[13px] font-bold text-[#FF5C5C] block">
                    {isAmharic ? 'ውጣ' : 'Sign Out'}
                  </span>
                  <span className="text-[11px] text-[#8E8E9F]">
                    {isAmharic ? 'የአሁኑን ክፍለ-ጊዜ ያቋርጡ' : 'Exit current athletic session'}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8E8E9F]" />
            </button>
          )}
        </div>
      </div>

      {/* Reset Data Control */}
      <div className="mt-1 text-center">
        {showResetConfirm ? (
          <div className="bg-[#FFEBEB] p-4 rounded-2xl border border-[#FF5C5C]/30 space-y-2">
            <p className="text-[12px] font-bold text-[#FF5C5C]">
              {isAmharic
                ? 'ሁሉንም ምግቦች፣ ልምምዶች እና መገለጫ ዳግም ማስጀመር ይፈልጋሉ?'
                : 'Reset all logs, meals, workouts & profile?'}
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={resetAllDataToDefaults}
                className="px-4 py-1.5 bg-[#FF5C5C] text-white rounded-xl text-[11px] font-bold cursor-pointer"
              >
                {isAmharic ? 'አዎ ዳግም ጀምር' : 'Yes, Reset Everything'}
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-1.5 bg-white text-[#1E1E2D] rounded-xl text-[11px] font-bold border border-[#D9DCED] cursor-pointer"
              >
                {isAmharic ? 'ተመለስ' : 'Cancel'}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="text-[11px] font-bold text-[#8E8E9F] hover:text-[#FF5C5C] flex items-center gap-1.5 mx-auto transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{isAmharic ? 'መረጃዎችን ዳግም አስጀምር' : 'Reset All Records & Re-start'}</span>
          </button>
        )}
      </div>

      {/* Edit Profile Full Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative w-full max-w-[430px] bg-white rounded-t-3xl p-5 shadow-2xl z-10 max-h-[90vh] overflow-y-auto no-scrollbar pb-safe"
            >
              <div className="w-12 h-1.5 bg-[#E2E4F0] rounded-full mx-auto mb-3" />

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[18px] font-black text-[#1E1E2D]">
                    {isAmharic ? 'መገለጫዎን ያርትዑ' : 'Edit Athlete Profile'}
                  </h3>
                  <span className="text-[11px] font-bold text-[#5C71F3]">
                    {isAmharic ? 'ዒላማዎች ወዲያውኑ ይሰላሉ' : 'All targets recalculate automatically'}
                  </span>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-8 h-8 rounded-full bg-[#F5F6FA] flex items-center justify-center text-[#8E8E9F] hover:text-[#1E1E2D]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-[#8E8E9F] uppercase block mb-1">
                    {isAmharic ? 'ሙሉ ስም' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9FD] border border-[#ECEEF5] text-[13px] font-bold text-[#1E1E2D] focus:border-[#5C71F3]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-[#8E8E9F] uppercase block mb-1">
                      {isAmharic ? 'እድሜ' : 'Age'}
                    </label>
                    <input
                      type="number"
                      value={editForm.age}
                      onChange={(e) => setEditForm({ ...editForm, age: parseInt(e.target.value) || 25 })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9FD] border border-[#ECEEF5] text-[13px] font-bold text-[#1E1E2D]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#8E8E9F] uppercase block mb-1">
                      {isAmharic ? 'ጾታ' : 'Gender'}
                    </label>
                    <select
                      value={editForm.gender}
                      onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as Gender })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9FD] border border-[#ECEEF5] text-[13px] font-bold text-[#1E1E2D]"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#8E8E9F] uppercase block mb-1">
                      {isAmharic ? 'ቁመት (ሴ.ሜ)' : 'Height (cm)'}
                    </label>
                    <input
                      type="number"
                      value={editForm.heightCm}
                      onChange={(e) => setEditForm({ ...editForm, heightCm: parseInt(e.target.value) || 175 })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9FD] border border-[#ECEEF5] text-[13px] font-bold text-[#1E1E2D]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#8E8E9F] uppercase block mb-1">
                      {isAmharic ? 'የአሁን ክብደት (ኪ.ግ)' : 'Current Weight (kg)'}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="35"
                      max="250"
                      value={editForm.weightKg}
                      onChange={(e) => setEditForm({ ...editForm, weightKg: parseFloat(e.target.value) || 70 })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9FD] border border-[#ECEEF5] text-[13px] font-bold text-[#1E1E2D]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#8E8E9F] uppercase block mb-1">
                      {isAmharic ? 'ዒላማ ክብደት (ኪ.ግ)' : 'Target Weight (kg)'}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="35"
                      max="250"
                      value={editForm.targetWeightKg}
                      onChange={(e) =>
                        setEditForm({ ...editForm, targetWeightKg: parseFloat(e.target.value) || 75 })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9FD] border border-[#ECEEF5] text-[13px] font-bold text-[#1E1E2D]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#8E8E9F] uppercase block mb-1">
                      {isAmharic ? 'ልምምድ በሳምንት' : 'Days / Week'}
                    </label>
                    <select
                      value={editForm.workoutFrequencyDays}
                      onChange={(e) =>
                        setEditForm({ ...editForm, workoutFrequencyDays: parseInt(e.target.value) || 4 })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9FD] border border-[#ECEEF5] text-[13px] font-bold text-[#1E1E2D]"
                    >
                      <option value={3}>3 Days (Full Body)</option>
                      <option value={4}>4 Days (Upper / Lower)</option>
                      <option value={5}>5 Days (PPL Split)</option>
                      <option value={6}>6 Days (Advanced)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#8E8E9F] uppercase block mb-1">
                    {isAmharic ? 'ዋና የአካል ብቃት ግብ' : 'Primary Fitness Goal'}
                  </label>
                  <select
                    value={editForm.goal}
                    onChange={(e) => setEditForm({ ...editForm, goal: e.target.value as UserGoal })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9FD] border border-[#ECEEF5] text-[13px] font-bold text-[#1E1E2D]"
                  >
                    <option value="build_muscle">Build Muscle (Hypertrophy Surplus)</option>
                    <option value="lose_weight">Lose Weight (Caloric Deficit)</option>
                    <option value="burn_fat">Burn Fat & Tone</option>
                    <option value="get_stronger">Gain Strength (Powerlifting)</option>
                    <option value="improve_endurance">Improve Endurance</option>
                    <option value="improve_fitness">General Health & Fitness</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#8E8E9F] uppercase block mb-1">
                    {isAmharic ? 'የስፖርት ልምድ' : 'Experience Level'}
                  </label>
                  <select
                    value={editForm.experience}
                    onChange={(e) => setEditForm({ ...editForm, experience: e.target.value as ExperienceLevel })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9FD] border border-[#ECEEF5] text-[13px] font-bold text-[#1E1E2D]"
                  >
                    <option value="beginner">Beginner (0 - 6 months)</option>
                    <option value="intermediate">Intermediate (6m - 2 years)</option>
                    <option value="advanced">Advanced (2+ years)</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 py-3 bg-[#5C71F3] text-white font-extrabold rounded-2xl text-[13px] shadow-lg shadow-[#5C71F3]/25 cursor-pointer hover:bg-[#4B62EB]"
                  >
                    {isAmharic ? 'አስቀምጥ እና ዒላማዎችን አስላ' : 'Save & Recalculate Plans'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-3 bg-[#F5F6FA] text-[#8E8E9F] font-bold rounded-2xl text-[13px] cursor-pointer"
                  >
                    {isAmharic ? 'ተመለስ' : 'Cancel'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
