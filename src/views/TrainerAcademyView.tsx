import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Lock,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  Clock,
  ArrowLeft,
  Flame,
  ShieldCheck,
  Dumbbell,
  GraduationCap,
  FileText,
  Share2,
  Printer,
} from 'lucide-react';
import { UserProfile, TrainerUnit, TrainerLesson, TrainerQuizQuestion } from '../types';
import { TRAINER_ACADEMY_UNITS, getTrainerUnitById } from '../data/trainerAcademyData';
import { TrainerAcademyService } from '../services/fitnessServices';

interface TrainerAcademyViewProps {
  user: UserProfile;
  onBackToChat: () => void;
}

export const TrainerAcademyView: React.FC<TrainerAcademyViewProps> = ({ user, onBackToChat }) => {
  const isAmharic = user.language === 'am';
  const [progress, setProgress] = useState(() => TrainerAcademyService.getProgress(user.id));
  const [selectedUnit, setSelectedUnit] = useState<TrainerUnit | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<{
    passed: boolean;
    score: number;
    maxScore: number;
    nextUnitUnlocked: boolean;
    courseNewlyCompleted: boolean;
  } | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Sync progress on load
  useEffect(() => {
    const p = TrainerAcademyService.getProgress(user.id);
    setProgress(p);
  }, [user.id]);

  const completedCount = progress.completedUnits.length;
  const progressPercent = Math.round((completedCount / 20) * 100);

  const handleOpenUnit = (unit: TrainerUnit) => {
    const isUnlocked = unit.id === 1 || progress.completedUnits.includes(unit.id - 1) || progress.completedUnits.includes(unit.id);
    if (!isUnlocked) return;

    setSelectedUnit(unit);
    setCurrentLessonIndex(0);
    setIsQuizMode(false);
    setQuizResult(null);
    setSelectedAnswers(new Array(unit.quizQuestions.length).fill(-1));
    setCurrentQuestionIndex(0);
  };

  const handleStartQuiz = () => {
    if (!selectedUnit) return;
    setIsQuizMode(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(selectedUnit.quizQuestions.length).fill(-1));
    setQuizResult(null);
  };

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleSubmitQuiz = () => {
    if (!selectedUnit) return;
    const res = TrainerAcademyService.submitQuiz(
      user.id,
      selectedUnit.id,
      selectedAnswers,
      selectedUnit.quizQuestions
    );
    setQuizResult(res);
    const updated = TrainerAcademyService.getProgress(user.id);
    setProgress(updated);
  };

  const certificate = progress.courseCompleted
    ? TrainerAcademyService.getCertificate(user.id, user.name)
    : null;

  return (
    <div className="flex-1 flex flex-col bg-[#F5F6FA] min-h-full w-full max-w-full pb-28 pt-3 px-4 box-border overflow-x-hidden">
      {/* ========================================== */}
      {/* 1. TOP HEADER & NAVIGATION */}
      {/* ========================================== */}
      <header className="bg-white rounded-3xl p-4 border border-[#E8EAF2] card-shadow space-y-3 mb-4 w-full box-border overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => {
              if (isQuizMode) {
                setIsQuizMode(false);
              } else if (selectedUnit) {
                setSelectedUnit(null);
              } else {
                onBackToChat();
              }
            }}
            className="flex items-center gap-1.5 text-[12px] font-bold text-[#5C71F3] hover:text-[#4A5FE3] px-3 py-1.5 rounded-xl bg-[#EEF1FE] transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isQuizMode ? (isAmharic ? 'ወደ ትምህርቱ' : 'Back to Lessons') : selectedUnit ? (isAmharic ? 'ወደ ኮርሱ ዝርዝር' : 'All Units') : (isAmharic ? 'ወደ ቻት' : 'Back to Dagi Fitness AI')}</span>
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-indigo-50 text-[#5C71F3] border border-indigo-200/60">
              <GraduationCap className="w-3.5 h-3.5" />
              {isAmharic ? '20 ዩኒቶች' : '20 Professional Units'}
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-[18px] sm:text-[20px] font-black text-[#1E1E2D] tracking-tight">
              {isAmharic ? 'የዳጊ ፊትነስ የግል አሰልጣኝ አካዳሚ' : 'Dagi Fitness Personal Trainer Academy'}
            </h1>
          </div>
          <p className="text-[12px] text-[#7C8092] font-medium mt-0.5">
            {isAmharic
              ? 'የባለሙያ የአካል ብቃት አሰልጣኝነት ሳይንሳዊ መሰረቶችን ደረጃ በደረጃ ይማሩ'
              : 'Master evidence-based fitness training, biomechanics, nutrition, and client coaching'}
          </p>
        </div>

        {/* Professional Disclaimer */}
        <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-2 text-[11px] text-amber-900 leading-tight">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            {isAmharic
              ? 'የዳጊ ፊትነስ የትምህርት ማጠናቀቂያ ፕሮግራም — የውጭ ሀገር ፍቃድ ሳይሆን የተሟላ የውስጥ የብቃት ማረጋገጫ ትምህርት ነው።'
              : 'Dagi Fitness Educational Completion Program — a structured internal knowledge curriculum designed for aspiring fitness coaches.'}
          </span>
        </div>

        {/* Global Progress Bar */}
        <div className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#E8EAF0] space-y-2">
          <div className="flex items-center justify-between text-[11.5px] font-bold">
            <span className="text-[#1E1E2D] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#5C71F3]" />
              {isAmharic ? 'የአጠቃላይ ኮርስ እድገት' : 'Curriculum Progress'}
            </span>
            <span className="text-[#5C71F3]">
              {completedCount} / 20 {isAmharic ? 'ዩኒቶች ተጠናቀዋል' : 'Units Passed'} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-[#E2E4EB] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#5C71F3] to-[#4557D6] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {progress.courseCompleted && (
            <button
              onClick={() => setShowCertificateModal(true)}
              className="w-full mt-2 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[12px] font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-xs hover:opacity-95 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>{isAmharic ? 'የማጠናቀቂያ ሰርተፍኬት ይመልከቱ' : 'View Completion Certificate'}</span>
            </button>
          )}
        </div>
      </header>

      {/* ========================================== */}
      {/* 2. UNIT SELECTION VIEW (MAIN DASHBOARD) */}
      {/* ========================================== */}
      {!selectedUnit && (
        <div className="space-y-3 w-full box-border">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[14px] font-extrabold text-[#1E1E2D] uppercase tracking-wider">
              {isAmharic ? 'የትምህርት ዩኒቶች (Units)' : 'Course Units Curriculum'}
            </h2>
            <span className="text-[11px] font-semibold text-[#7C8092]">
              {isAmharic ? 'ፈተና ማለፊያ፡ 12/15 (80%)' : 'Passing Score: 12/15 (80%)'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full box-border">
            {Array.from({ length: 20 }, (_, idx) => {
              const unitId = idx + 1;
              const unit = getTrainerUnitById(unitId);
              if (!unit) return null;

              const isCompleted = progress.completedUnits.includes(unitId);
              const isUnlocked = unitId === 1 || progress.completedUnits.includes(unitId - 1) || isCompleted;
              const bestScore = progress.unitHighestScores[unitId];

              return (
                <div
                  key={unitId}
                  onClick={() => isUnlocked && handleOpenUnit(unit)}
                  className={`rounded-3xl p-4 border transition-all card-shadow flex flex-col justify-between ${
                    !isUnlocked
                      ? 'bg-gray-100/80 border-gray-200 opacity-60 cursor-not-allowed'
                      : isCompleted
                      ? 'bg-white border-emerald-200/80 hover:border-emerald-400 cursor-pointer'
                      : 'bg-white border-[#5C71F3]/40 hover:border-[#5C71F3] cursor-pointer'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-[#F0F2FA] text-[#5C71F3]">
                        Unit {unitId}
                      </span>

                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {bestScore ? `${bestScore}/15 Passed` : 'Completed'}
                        </span>
                      ) : isUnlocked ? (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-extrabold text-[#5C71F3] bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                          ▶ {isAmharic ? 'ዝግጁ' : 'In Progress'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-200/70 px-2 py-0.5 rounded-full">
                          <Lock className="w-3 h-3" />
                          {isAmharic ? 'የተቆለፈ' : 'Locked'}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-[14.5px] font-black text-[#1E1E2D] leading-tight">
                        {isAmharic ? unit.titleAm : unit.title}
                      </h3>
                      <p className="text-[11.5px] text-[#7C8092] font-medium mt-1 line-clamp-2">
                        {unit.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-[#F0F1F6] flex items-center justify-between text-[11px] font-semibold text-[#8E92A4]">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#5C71F3]" />
                      {unit.lessonsCount || unit.lessons.length} {isAmharic ? 'ትምህርቶች' : 'Lessons'} + 15 Quiz Qs
                    </span>
                    {isUnlocked && (
                      <span className="text-[#5C71F3] flex items-center font-bold">
                        {isAmharic ? 'ጀምር' : 'Open'} <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. LESSON READER VIEW */}
      {/* ========================================== */}
      {selectedUnit && !isQuizMode && (
        <div className="space-y-4 w-full box-border">
          {/* Unit Header Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8EAF2] card-shadow space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-xl bg-indigo-50 text-[#5C71F3]">
                Unit {selectedUnit.id} of 20
              </span>
              <span className="text-[11px] text-[#7C8092] font-semibold">
                Lesson {currentLessonIndex + 1} of {selectedUnit.lessons.length}
              </span>
            </div>

            <div>
              <h2 className="text-[17px] sm:text-[19px] font-black text-[#1E1E2D]">
                {isAmharic ? selectedUnit.titleAm : selectedUnit.title}
              </h2>
              <p className="text-[12px] text-[#7C8092] font-medium mt-1">
                {selectedUnit.overview}
              </p>
            </div>

            {/* Lesson selector chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
              {selectedUnit.lessons.map((les, idx) => (
                <button
                  key={les.id}
                  onClick={() => setCurrentLessonIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                    currentLessonIndex === idx
                      ? 'bg-[#5C71F3] text-white shadow-xs'
                      : 'bg-[#F1F2F6] text-[#7C8092] hover:text-[#1E1E2D]'
                  }`}
                >
                  Lesson {idx + 1}: {les.title.split(':')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Active Lesson Content */}
          {selectedUnit.lessons[currentLessonIndex] && (
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E8EAF2] card-shadow space-y-4">
              <div className="border-b border-[#F0F1F6] pb-3">
                <h3 className="text-[16px] sm:text-[18px] font-black text-[#1E1E2D]">
                  {isAmharic && selectedUnit.lessons[currentLessonIndex].titleAm
                    ? selectedUnit.lessons[currentLessonIndex].titleAm
                    : selectedUnit.lessons[currentLessonIndex].title}
                </h3>
                <div className="flex items-center gap-3 text-[11px] text-[#7C8092] font-semibold mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ~{selectedUnit.lessons[currentLessonIndex].estimatedReadMin} min read
                  </span>
                </div>
              </div>

              {/* Learning Objectives */}
              {selectedUnit.lessons[currentLessonIndex].learningObjectives.length > 0 && (
                <div className="bg-[#F8F9FD] p-3.5 rounded-2xl border border-[#E2E4EB] space-y-1.5">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#5C71F3]">
                    {isAmharic ? 'የትምህርቱ ዓላማዎች (Learning Objectives)' : 'Learning Objectives'}
                  </div>
                  <ul className="space-y-1">
                    {selectedUnit.lessons[currentLessonIndex].learningObjectives.map((obj, i) => (
                      <li key={i} className="text-[12px] text-[#1E1E2D] font-medium flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5C71F3] shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Content Sections */}
              <div className="space-y-4 text-[13px] sm:text-[13.5px] text-[#1E1E2D] leading-relaxed">
                {selectedUnit.lessons[currentLessonIndex].contentSections.map((sec, i) => (
                  <div key={i} className="space-y-2">
                    <h4 className="text-[14px] font-extrabold text-[#1E1E2D] text-[#5C71F3]">
                      {sec.heading}
                    </h4>
                    <p className="whitespace-pre-line text-[#3F4254]">{sec.body}</p>

                    {sec.bullets && (
                      <ul className="space-y-1 pl-2">
                        {sec.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="text-[12.5px] text-[#3F4254] flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5C71F3] shrink-0 mt-2" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {sec.highlightBox && (
                      <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/60 my-2 space-y-1">
                        <div className="text-[11px] font-black uppercase text-[#5C71F3]">
                          💡 {sec.highlightBox.title}
                        </div>
                        <p className="text-[12px] text-[#1E1E2D] font-medium leading-relaxed">
                          {sec.highlightBox.text}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Trainer Tips & Mistakes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {selectedUnit.lessons[currentLessonIndex].trainerTips.length > 0 && (
                  <div className="bg-emerald-50/60 border border-emerald-200/80 p-3.5 rounded-2xl space-y-1.5">
                    <div className="text-[11px] font-extrabold uppercase text-emerald-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      {isAmharic ? 'የአሰልጣኝ ምክሮች' : 'Trainer Coaching Tips'}
                    </div>
                    <ul className="space-y-1">
                      {selectedUnit.lessons[currentLessonIndex].trainerTips.map((tip, i) => (
                        <li key={i} className="text-[11.5px] text-emerald-950 font-medium">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedUnit.lessons[currentLessonIndex].commonMistakes.length > 0 && (
                  <div className="bg-rose-50/60 border border-rose-200/80 p-3.5 rounded-2xl space-y-1.5">
                    <div className="text-[11px] font-extrabold uppercase text-rose-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      {isAmharic ? 'የተለመዱ ስህተቶች' : 'Common Mistakes to Avoid'}
                    </div>
                    <ul className="space-y-1">
                      {selectedUnit.lessons[currentLessonIndex].commonMistakes.map((mis, i) => (
                        <li key={i} className="text-[11.5px] text-rose-950 font-medium">
                          • {mis}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="pt-4 border-t border-[#F0F1F6] flex items-center justify-between gap-2 flex-wrap">
                <button
                  disabled={currentLessonIndex === 0}
                  onClick={() => setCurrentLessonIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2.5 rounded-xl border border-[#D9DCED] text-[#7C8092] hover:text-[#1E1E2D] text-[12px] font-bold disabled:opacity-40 cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {isAmharic ? 'ቀዳሚ ትምህርት' : 'Previous Lesson'}
                </button>

                {currentLessonIndex < selectedUnit.lessons.length - 1 ? (
                  <button
                    onClick={() => setCurrentLessonIndex((prev) => prev + 1)}
                    className="px-4 py-2.5 rounded-xl bg-[#5C71F3] hover:bg-[#4A5FE3] text-white text-[12px] font-extrabold cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    {isAmharic ? 'ቀጣይ ትምህርት' : 'Next Lesson'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleStartQuiz}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5C71F3] to-[#4557D6] text-white text-[12.5px] font-black cursor-pointer flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-98 transition-all"
                  >
                    <Award className="w-4 h-4" />
                    <span>{isAmharic ? 'የ 15 ጥያቄዎች ፈተና ይጀምሩ' : 'Take 15-Question Unit Quiz'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* 4. 15-QUESTION MASTERY QUIZ MODE */}
      {/* ========================================== */}
      {selectedUnit && isQuizMode && !quizResult && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E8EAF2] card-shadow space-y-4 w-full box-border">
          {/* Quiz Progress Header */}
          <div className="space-y-2 pb-3 border-b border-[#F0F1F6]">
            <div className="flex items-center justify-between text-[11.5px] font-black">
              <span className="text-[#5C71F3] uppercase tracking-wider">
                Unit {selectedUnit.id} Assessment
              </span>
              <span className="text-[#1E1E2D]">
                Question {currentQuestionIndex + 1} of {selectedUnit.quizQuestions.length}
              </span>
            </div>
            <div className="w-full h-2 bg-[#EAEBED] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5C71F3] rounded-full transition-all"
                style={{
                  width: `${((currentQuestionIndex + 1) / selectedUnit.quizQuestions.length) * 100}%`,
                }}
              />
            </div>
            <div className="text-[10.5px] text-[#7C8092] font-semibold text-right">
              {isAmharic ? 'ማለፊያ ነጥብ፡ 12/15 (80%)' : 'Passing Threshold: 12 / 15 (80%)'}
            </div>
          </div>

          {/* Question Text */}
          {selectedUnit.quizQuestions[currentQuestionIndex] && (
            <div className="space-y-4">
              <h3 className="text-[15px] sm:text-[16.5px] font-black text-[#1E1E2D] leading-snug">
                {selectedUnit.quizQuestions[currentQuestionIndex].questionText}
              </h3>

              {/* 4 Options */}
              <div className="space-y-2.5">
                {selectedUnit.quizQuestions[currentQuestionIndex].options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-3.5 sm:p-4 rounded-2xl text-left text-[12.5px] sm:text-[13px] font-semibold transition-all border cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-[#EEF1FE] border-[#5C71F3] text-[#1E1E2D] shadow-xs'
                          : 'bg-[#F8F9FD] border-[#E8EAF2] text-[#3F4254] hover:bg-[#F0F2FA]'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                          isSelected
                            ? 'bg-[#5C71F3] text-white'
                            : 'bg-white border border-[#D9DCED] text-[#7C8092]'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 min-w-0 break-words">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quiz Navigation */}
              <div className="pt-4 border-t border-[#F0F1F6] flex items-center justify-between gap-2">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2.5 rounded-xl border border-[#D9DCED] text-[#7C8092] hover:text-[#1E1E2D] text-[12px] font-bold disabled:opacity-40 cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {isAmharic ? 'ቀዳሚ' : 'Previous'}
                </button>

                {currentQuestionIndex < selectedUnit.quizQuestions.length - 1 ? (
                  <button
                    disabled={selectedAnswers[currentQuestionIndex] === -1}
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-5 py-2.5 rounded-xl bg-[#5C71F3] hover:bg-[#4A5FE3] text-white text-[12px] font-extrabold cursor-pointer flex items-center gap-1 shadow-xs disabled:opacity-40"
                  >
                    {isAmharic ? 'ቀጣይ ጥያቄ' : 'Next Question'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    disabled={selectedAnswers.some((ans) => ans === -1)}
                    onClick={handleSubmitQuiz}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[12.5px] font-black cursor-pointer flex items-center gap-2 shadow-md disabled:opacity-40"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isAmharic ? 'ፈተናውን ጨርስና ውጤት እይ' : 'Submit Assessment'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* 5. QUIZ RESULTS & DETAILED FEEDBACK */}
      {/* ========================================== */}
      {selectedUnit && isQuizMode && quizResult && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E8EAF2] card-shadow space-y-5 w-full box-border">
          <div className="text-center space-y-2">
            <div
              className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-[26px] shadow-sm ${
                quizResult.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
              }`}
            >
              {quizResult.passed ? '🎉' : '❌'}
            </div>

            <h3 className="text-[20px] font-black text-[#1E1E2D]">
              {quizResult.passed
                ? isAmharic
                  ? 'እንኳን ደስ አለዎት! ፈተናውን አልፈዋል'
                  : `Unit ${selectedUnit.id} Assessment Passed!`
                : isAmharic
                ? 'ፈተናውን አላለፉም (አስፈላጊ፡ 12/15)'
                : `Assessment Not Passed (Score: ${quizResult.score}/15)`}
            </h3>

            <div className="text-[13px] font-extrabold text-[#7C8092]">
              {isAmharic
                ? `ያስመዘገቡት ውጤት፡ ${quizResult.score} / ${quizResult.maxScore} (${Math.round((quizResult.score / quizResult.maxScore) * 100)}%)`
                : `Your Score: ${quizResult.score} / ${quizResult.maxScore} (${Math.round((quizResult.score / quizResult.maxScore) * 100)}%)`}
            </div>

            <p className="text-[12px] text-[#7C8092] max-w-sm mx-auto">
              {quizResult.passed
                ? isAmharic
                  ? 'ቀጣዩ ዩኒት በተሳካ ሁኔታ ተከፍቷል። ወደ ቀጣዩ ትምህርት መሻገር ይችላሉ።'
                  : 'Congratulations! You met the 80% passing threshold. The next unit is now unlocked.'
                : isAmharic
                ? 'ቀጣዩን ዩኒት ለመክፈት ቢያንስ 12/15 ማግኘት አለብዎት። ትምህርቱን ደግመው ይከልሱና እንደገና ይፈተኑ።'
                : 'You need at least 12 out of 15 to unlock the next unit. Please review the lesson content and retry.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
            {!quizResult.passed ? (
              <>
                <button
                  onClick={handleStartQuiz}
                  className="px-4 py-2.5 rounded-xl bg-[#5C71F3] text-white text-[12px] font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  {isAmharic ? 'እንደገና ፈተን' : 'Retry Quiz'}
                </button>
                <button
                  onClick={() => setIsQuizMode(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#F1F2F6] text-[#1E1E2D] text-[12px] font-bold cursor-pointer"
                >
                  {isAmharic ? 'ትምህርቱን ከልስ' : 'Review Lessons'}
                </button>
              </>
            ) : (
              <>
                {selectedUnit.id < 20 ? (
                  <button
                    onClick={() => {
                      const next = getTrainerUnitById(selectedUnit.id + 1);
                      if (next) handleOpenUnit(next);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5C71F3] to-[#4557D6] text-white text-[12.5px] font-black flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>{isAmharic ? `ወደ ዩኒት ${selectedUnit.id + 1} ቀጥል` : `Continue to Unit ${selectedUnit.id + 1}`}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[12.5px] font-black flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Award className="w-4 h-4" />
                    <span>{isAmharic ? 'የማጠናቀቂያ ሰርተፍኬት ይቀበሉ' : 'Claim Trainer Certificate'}</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedUnit(null);
                    setIsQuizMode(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#F1F2F6] text-[#1E1E2D] text-[12px] font-bold cursor-pointer"
                >
                  {isAmharic ? 'ወደ ኮርሱ ዝርዝር' : 'All Units'}
                </button>
              </>
            )}
          </div>

          {/* Question-by-Question Review with Explanations */}
          <div className="space-y-3 pt-4 border-t border-[#F0F1F6]">
            <h4 className="text-[13px] font-extrabold text-[#1E1E2D] uppercase tracking-wider">
              {isAmharic ? 'የጥያቄዎችና መልሶች ዝርዝር መግለጫ' : 'Detailed Question Review'}
            </h4>

            <div className="space-y-3">
              {selectedUnit.quizQuestions.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const isCorrect = userAns === q.correctOptionIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-2xl border text-[12px] space-y-2 ${
                      isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-extrabold text-[#1E1E2D]">
                        Q{idx + 1}. {q.questionText}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    <div className="text-[11.5px] space-y-1">
                      <div>
                        <span className="font-bold text-[#7C8092]">Your Answer: </span>
                        <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                          {userAns >= 0 ? q.options[userAns] : 'No answer'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div>
                          <span className="font-bold text-emerald-700">Correct Answer: </span>
                          <span className="text-emerald-800 font-bold">{q.options[q.correctOptionIndex]}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-[#E2E4EB] text-[11px] text-[#55586A] leading-relaxed">
                      <span className="font-bold text-[#5C71F3]">Explanation: </span>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 6. COMPLETION CERTIFICATE MODAL */}
      {/* ========================================== */}
      <AnimatePresence>
        {showCertificateModal && certificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full card-shadow border border-[#D9DCED] space-y-5 text-center relative overflow-hidden"
            >
              <div className="border-4 border-double border-[#5C71F3]/40 p-5 rounded-2xl bg-gradient-to-b from-[#FAFBFD] to-[#F1F3FA] space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5C71F3] to-[#4557D6] text-white flex items-center justify-center mx-auto shadow-md">
                  <Award className="w-8 h-8" />
                </div>

                <div className="text-[11px] font-black uppercase tracking-widest text-[#5C71F3]">
                  {certificate.issuingBody}
                </div>

                <h3 className="text-[20px] font-black text-[#1E1E2D]">
                  CERTIFICATE OF COMPLETION
                </h3>

                <p className="text-[12px] text-[#7C8092]">This certifies that</p>

                <div className="text-[22px] font-black text-[#5C71F3] border-b-2 border-[#5C71F3]/30 pb-1 inline-block px-4">
                  {certificate.learnerName}
                </div>

                <p className="text-[12px] text-[#1E1E2D] font-medium leading-relaxed max-w-sm mx-auto">
                  has successfully completed all 20 units and passed 300 examination questions of the{' '}
                  <strong className="text-[#1E1E2D]">{certificate.courseTitle}</strong>.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-semibold text-[#7C8092] border-t border-[#E2E4EB]">
                  <div>Date: {new Date(certificate.issueDate).toLocaleDateString()}</div>
                  <div>ID: {certificate.certificateId}</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#5C71F3] text-white text-[12.5px] font-black cursor-pointer shadow-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
