import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  FOOD_DATABASE,
  generateJossyAIResponse,
  parseMultiFoodQuery,
} from '../data/foodDatabase';
import { handleFitnessAndCoachingQuery } from '../data/fitnessKnowledgeBase';
import { FoodItem, JossyAIMessage, JossyAIFoodBreakdown } from '../types';
import { SafeStorage } from '../services/storageAdapter';
import { TrainerAcademyView } from './TrainerAcademyView';
import {
  Search,
  Plus,
  Trash2,
  Check,
  Utensils,
  Flame,
  X,
  Send,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Sparkles,
  Activity,
  CheckCircle2,
  RotateCcw,
  Zap,
  Dumbbell,
  Droplets,
  BadgePercent,
  Leaf,
  ChevronRight,
  TrendingUp,
  Award,
  GraduationCap,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  BookOpen,
  Info,
  Calendar,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

const JOSSY_LOGO_URL = '/dagi-logo.jpg';

export const FoodTrackerView: React.FC = () => {
  const {
    user,
    language,
    t,
    getLocalizedMealType,
    loggedMeals,
    logMeal,
    deleteMeal,
    consumedCalories,
    consumedProteinG,
    consumedCarbsG,
    consumedFatG,
    consumedFiberG,
    completedWorkouts,
    membershipSummary,
  } = useApp();

  const isAmharic = language === 'am';
  const firstName = user.name ? user.name.trim().split(' ')[0] : isAmharic ? 'ስፖርተኛ' : 'Athlete';

  // Navigation mode within Jossy AI
  const [activeTab, setActiveTab] = useState<'ai_chat' | 'academy' | 'catalog' | 'diary'>('ai_chat');

  // ==========================================
  // SPEECH RECOGNITION & SYNTHESIS (VOICE)
  // ==========================================
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = isAmharic ? 'am-ET' : 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputQuery(transcript);
            handleSendMessage(transcript);
          }
        };
        recognitionRef.current = recognition;
      }
    }
  }, [isAmharic]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // restart if already started
      }
    }
  };

  const speakMessage = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#_`]/g, '').slice(0, 300);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isAmharic ? 'am-ET' : 'en-US';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // ==========================================
  // JOSSY AI CHAT STATE
  // ==========================================
  const [messages, setMessages] = useState<JossyAIMessage[]>(() => {
    const saved = SafeStorage.getItem(`jossy_ai_chat_${user.id || 'default'}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'msg-init-1',
        sender: 'jossy_ai',
        text: isAmharic
          ? `ሰላም ${firstName}! እኔ ዳጊ ፊትነስ AI (Dagi Fitness AI) የግል የአካል ብቃት እና ስነ-ምግብ አሰልጣኝዎ ነኝ።\n\n• የበሉትን ምግብ ይንገሩኝ (ካሎሪና ፕሮቲኑን አስልቼ እመዘግባለሁ)\n• ስለ ስፖርት ፕሮግራም፣ ጡንቻ ግንባታ ወይም ስብ ማቃጠል ይጠይቁኝ\n• "የግል አሰልጣኝ መሆን እፈልጋለሁ" ብለው በመንገር 20 ዩኒቶችን በአካዳሚው ይማሩ!`
          : `Hello ${firstName}! I'm Dagi Fitness AI, your Personal Fitness & Nutrition Coach.\n\n• Tell me what you ate (I'll calculate verified macros and log it)\n• Ask about workout routines, muscle hypertrophy, or fat loss\n• Click "Become a Personal Trainer" to learn our 20-unit coaching curriculum!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiStatusText, setAiStatusText] = useState<string | null>(null);
  const [selectedMealForAiLog, setSelectedMealForAiLog] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [loggingMessageId, setLoggingMessageId] = useState<string | null>(null);
  const [loggedSuccessMap, setLoggedSuccessMap] = useState<Record<string, boolean>>({});

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat smoothly
  useEffect(() => {
    if (activeTab === 'ai_chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAiProcessing, aiStatusText, activeTab]);

  // Persist chat per user safely
  useEffect(() => {
    try {
      SafeStorage.setItem(`jossy_ai_chat_${user.id || 'default'}`, JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
  }, [messages, user.id]);

  // Structured Suggested Question Categories
  const categorizedSuggestions = useMemo(() => {
    if (isAmharic) {
      return [
        {
          category: 'የስፖርት ሳይንስና ጡንቻ ግንባታ',
          icon: Dumbbell,
          items: [
            'ለጡንቻ ግንባታ ተስማሚ ምግቦች',
            'የደረት ስፖርት ፕሮግራም አዘጋጅልኝ',
            'በስብስቦች መካከል ስንት ደቂቃ እረፍት?',
          ],
        },
        {
          category: 'የሃበሻ ምግቦችና ንጥረ-ነገሮች',
          icon: Sparkles,
          items: [
            'በ 250g ሽሮ ውስጥ ስንት ፕሮቲን አለ?',
            'የጤፍ እንጀራ የካሎሪ ይዘት',
            'የጾም ከፍተኛ ፕሮቲን ምግቦች',
          ],
        },
        {
          category: 'የግል እድገትና አባልነት',
          icon: Droplets,
          items: [
            'ዛሬ ስንት ካሎሪ በላሁ?',
            'የአባልነት ቀናት ስንት ቀሩኝ?',
            'ምን ያህል ውሃ መጠጣት አለብኝ?',
          ],
        },
        {
          category: 'የአሰልጣኝነት አካዳሚ',
          icon: GraduationCap,
          items: [
            'የግል አሰልጣኝ መሆን እፈልጋለሁ',
            'የአካዳሚውን ትምህርት ጀምር',
          ],
        },
      ];
    }
    return [
      {
        category: 'Muscle Building & Workouts',
        icon: Dumbbell,
        items: [
          'Create a beginner chest workout',
          'How long should I rest between sets?',
          'Best foods for muscle hypertrophy',
        ],
      },
      {
        category: 'Ethiopian Food & Macros',
        icon: Sparkles,
        items: [
          'How much protein is in 250g of shiro?',
          'Teff injera nutritional breakdown',
          'Best high-protein fasting foods',
        ],
      },
      {
        category: 'Live Status & Membership',
        icon: Droplets,
        items: [
          'How many calories did I eat today?',
          'How many days are left on my membership?',
          'How much water should I drink?',
        ],
      },
      {
        category: 'Trainer Academy',
        icon: GraduationCap,
        items: [
          'I want to become a personal trainer',
          'Open Trainer Academy Curriculum',
        ],
      },
    ];
  }, [isAmharic]);

  // Prompt chips for quick access
  const quickPromptChips = useMemo(() => {
    if (isAmharic) {
      return [
        '📚 የግል አሰልጣኝ ይሁኑ',
        'በ 250g ሽሮ ውስጥ ስንት ፕሮቲን አለ?',
        'የደረት ስፖርት ፕሮግራም',
        'የዛሬ ካሎሪዬ ስንት ነው?',
        'የጾም ከፍተኛ ፕሮቲን ምግቦች',
        'የአባልነት ቀናት ስንት ቀሩኝ?',
      ];
    }
    return [
      '📚 Become a Personal Trainer',
      'How much protein in 250g shiro?',
      'Create a chest workout',
      'How many calories today?',
      'High-protein fasting foods',
      'How many days left on membership?',
    ];
  }, [isAmharic]);

  // Handle sending a message
  const handleSendMessage = (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isAiProcessing) return;

    // Check if user clicked the Academy chip directly
    if (textToSend.includes('Become a Personal Trainer') || textToSend.includes('የግል አሰልጣኝ ይሁኑ')) {
      setActiveTab('academy');
      return;
    }

    const userMsgId = `user-${Date.now()}`;
    const newUserMsg: JossyAIMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputQuery('');
    setIsAiProcessing(true);

    setAiStatusText(isAmharic ? 'ዳጊ ፊትነስ AI መልስ እያዘጋጀ ነው...' : 'Analyzing with Dagi Fitness AI...');

    setTimeout(() => {
      const consumedStats = {
        calories: consumedCalories,
        proteinG: consumedProteinG,
        carbsG: consumedCarbsG,
        fatG: consumedFatG,
        fiberG: consumedFiberG,
      };

      // 1. Try comprehensive Fitness & Coaching Knowledge Query
      const fitnessResponse = handleFitnessAndCoachingQuery(
        textToSend,
        user,
        consumedStats,
        loggedMeals,
        completedWorkouts,
        membershipSummary
      );

      let finalBotMsg: JossyAIMessage;

      if (fitnessResponse && fitnessResponse.text) {
        finalBotMsg = {
          id: `jossy-bot-${Date.now()}`,
          sender: 'jossy_ai',
          text: fitnessResponse.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          foodBreakdowns: fitnessResponse.foodBreakdowns,
          totalCalories: fitnessResponse.totalCalories,
          totalProtein: fitnessResponse.totalProtein,
          totalCarbs: fitnessResponse.totalCarbs,
          totalFat: fitnessResponse.totalFat,
          totalFiber: fitnessResponse.totalFiber,
          isAmbiguous: fitnessResponse.isAmbiguous,
          ambiguousOptions: fitnessResponse.ambiguousOptions,
          isUnknownFood: fitnessResponse.isUnknownFood,
          userProteinTarget: fitnessResponse.userProteinTarget,
          userCurrentProtein: fitnessResponse.userCurrentProtein,
        };
      } else {
        // 2. Fallback to existing Ethiopian food parser & logger
        const foodResponse = generateJossyAIResponse(textToSend, user, consumedStats);
        finalBotMsg = {
          id: `jossy-bot-${Date.now()}`,
          sender: 'jossy_ai',
          text: foodResponse.text || '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          foodBreakdowns: foodResponse.foodBreakdowns,
          totalCalories: foodResponse.totalCalories,
          totalProtein: foodResponse.totalProtein,
          totalCarbs: foodResponse.totalCarbs,
          totalFat: foodResponse.totalFat,
          totalFiber: foodResponse.totalFiber,
          isAmbiguous: foodResponse.isAmbiguous,
          ambiguousOptions: foodResponse.ambiguousOptions,
          isUnknownFood: foodResponse.isUnknownFood,
          userProteinTarget: foodResponse.userProteinTarget,
          userCurrentProtein: foodResponse.userCurrentProtein,
        };
      }

      setMessages((prev) => [...prev, finalBotMsg]);
      setIsAiProcessing(false);
      setAiStatusText(null);
    }, 600);
  };

  // Log parsed meal directly from Assistant Message
  const handleLogAiMeal = (msg: JossyAIMessage, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    if (!msg.foodBreakdowns || msg.foodBreakdowns.length === 0 || loggedSuccessMap[msg.id]) return;

    setLoggingMessageId(msg.id);

    msg.foodBreakdowns.forEach((breakdown) => {
      logMeal({
        foodId: breakdown.foodItem.id,
        name: isAmharic ? breakdown.foodItem.nameAm : breakdown.foodItem.nameEn,
        mealType: mealType,
        servings: breakdown.quantity,
        portionDescription: breakdown.portionLabel,
        calories: breakdown.calculatedCalories,
        proteinG: breakdown.calculatedProtein,
        carbsG: breakdown.calculatedCarbs,
        fatG: breakdown.calculatedFat,
        fiberG: breakdown.calculatedFiber,
        sugarG: breakdown.calculatedSugar,
      });
    });

    setLoggedSuccessMap((prev) => ({ ...prev, [msg.id]: true }));
    setLoggingMessageId(null);

    const confirmMsg: JossyAIMessage = {
      id: `confirm-${Date.now()}`,
      sender: 'jossy_ai',
      text: isAmharic
        ? `ምግቡ በተሳካ ሁኔታ ወደ ${getLocalizedMealType(mealType)} ተመዝግቧል! 🎉 የዛሬው ካሎሪና ፕሮቲን እድገትዎ ተሻሽሏል።`
        : `Meal successfully logged to ${getLocalizedMealType(mealType)}! 🎉 Your daily calorie & protein progress has been updated.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, confirmMsg]);
  };

  const handleClearChat = () => {
    const initMsg: JossyAIMessage = {
      id: `msg-init-${Date.now()}`,
      sender: 'jossy_ai',
      text: isAmharic
        ? `ሰላም ${firstName}! የበሉትን ምግብ ወይም ስለ ስፖርት ማንኛውንም ጥያቄ ይጠይቁኝ፤ በሳይንሳዊ ትክክለኛነት እመልሳለሁ።`
        : `Hello ${firstName}! Tell me what you ate or ask any fitness & nutrition question, and I'll assist you immediately.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([initMsg]);
    setLoggedSuccessMap({});
  };

  // ==========================================
  // CATALOG & MANUAL LOGGING STATE
  // ==========================================
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState<'all' | 'ethiopian' | 'protein' | 'fasting' | 'affordable'>('all');
  const [selectedFoodForModal, setSelectedFoodForModal] = useState<FoodItem | null>(null);
  const [modalServingCount, setModalServingCount] = useState(1);
  const [modalMealType, setModalMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

  const filteredCatalog = useMemo(() => {
    return FOOD_DATABASE.filter((food) => {
      const q = catalogSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        food.nameEn.toLowerCase().includes(q) ||
        food.nameAm.includes(q) ||
        (food.aliases && food.aliases.some((a) => a.toLowerCase().includes(q)));

      if (!matchesSearch) return false;

      if (catalogCategory === 'ethiopian') return food.isEthiopianTraditional;
      if (catalogCategory === 'protein') return food.proteinG >= 15;
      if (catalogCategory === 'fasting') return food.isFastingFriendly;
      if (catalogCategory === 'affordable') return food.isAffordable;
      return true;
    });
  }, [catalogSearch, catalogCategory]);

  const handleLogFromCatalogModal = () => {
    if (!selectedFoodForModal) return;
    const food = selectedFoodForModal;
    const count = modalServingCount;

    logMeal({
      foodId: food.id,
      name: isAmharic ? food.nameAm : food.nameEn,
      mealType: modalMealType,
      servings: count,
      portionDescription: `${count}x ${food.servingSize}`,
      calories: Math.round(food.calories * count),
      proteinG: Math.round(food.proteinG * count * 10) / 10,
      carbsG: Math.round(food.carbsG * count * 10) / 10,
      fatG: Math.round(food.fatG * count * 10) / 10,
      fiberG: Math.round((food.fiberG || 0) * count * 10) / 10,
      sugarG: Math.round((food.sugarG || 0) * count * 10) / 10,
    });

    setSelectedFoodForModal(null);
    setModalServingCount(1);
    setActiveTab('diary');
  };

  const remainingCalories = Math.max(0, user.targetCalories - consumedCalories);
  const showWelcomeHero = messages.length <= 1;

  // Render Academy directly when activeTab === 'academy'
  if (activeTab === 'academy') {
    return (
      <TrainerAcademyView
        user={user}
        onBackToChat={() => setActiveTab('ai_chat')}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col pt-3 pb-28 px-4 bg-[#F5F6FA] min-h-full w-full max-w-full overflow-x-hidden box-border">
      {/* ========================================== */}
      {/* 1. JOSSY AI COACH HEADER */}
      {/* ========================================== */}
      <header className="bg-white rounded-3xl p-4 border border-[#E8EAF2] card-shadow space-y-3 mb-3 w-full box-border overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Glowing Orb / Avatar */}
            <div className="relative flex items-center justify-center shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EEF1FE] to-[#F8F9FD] border-2 border-[#D9DCED] p-1.5 flex items-center justify-center shadow-xs">
                <img
                  src={JOSSY_LOGO_URL}
                  alt="Dagi Fitness AI"
                  className="w-9 h-9 object-contain"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[18px] font-black text-[#1E1E2D] tracking-tight truncate">
                  DAGI FITNESS AI
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-[#5C71F3] border border-indigo-200/60 shrink-0">
                  <Sparkles className="w-2.5 h-2.5 text-[#5C71F3]" />
                  {isAmharic ? 'የግል አሰልጣኝ' : 'Fitness Coach'}
                </span>
              </div>
              <p className="text-[11.5px] font-medium text-[#7C8092] truncate">
                {isAmharic ? 'የግል የአካል ብቃት እና ስነ-ምግብ አሰልጣኝዎ' : 'Your Personal Fitness & Nutrition Coach'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {activeTab === 'ai_chat' && (
              <button
                onClick={handleClearChat}
                title={isAmharic ? 'አዲስ ንግግር' : 'New Chat'}
                className="p-2 rounded-xl text-[#7C8092] hover:text-[#5C71F3] hover:bg-[#F4F5F8] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* DAILY MACRO SUMMARY CAPSULE */}
        <div className="bg-[#F8F9FD] rounded-2xl p-2.5 border border-[#E8EAF0] flex items-center justify-between gap-1 shadow-xs w-full box-border">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center shadow-xs shrink-0">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9px] font-bold uppercase text-[#8E92A4] tracking-wider truncate">
                {isAmharic ? 'ካሎሪ' : 'Calories'}
              </div>
              <div className="text-[12px] sm:text-[13px] font-black text-[#1E1E2D] truncate">
                {consumedCalories.toLocaleString()}{' '}
                <span className="text-[9.5px] text-[#8E92A4] font-medium">/ {user.targetCalories.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-[#E2E4EB] shrink-0" />

          <div className="flex items-center gap-1.5 min-w-0 flex-1 pl-1">
            <div className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-200/60 text-[#5C71F3] flex items-center justify-center shadow-xs shrink-0">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9px] font-bold uppercase text-[#8E92A4] tracking-wider truncate">
                {isAmharic ? 'ፕሮቲን' : 'Protein'}
              </div>
              <div className="text-[12px] sm:text-[13px] font-black text-[#1E1E2D] truncate">
                {consumedProteinG}g{' '}
                <span className="text-[9.5px] text-[#8E92A4] font-medium">/ {user.targetProteinG}g</span>
              </div>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-[#E2E4EB] shrink-0" />

          <div className="text-right min-w-0 flex-1 pl-1">
            <div className="text-[9px] font-bold uppercase text-[#8E92A4] tracking-wider truncate">
              {isAmharic ? 'የቀረ' : 'Remaining'}
            </div>
            <div className="text-[12px] sm:text-[13px] font-black text-emerald-600 truncate">
              {remainingCalories}{' '}
              <span className="text-[9.5px] text-[#8E92A4] font-medium">kcal</span>
            </div>
          </div>
        </div>

        {/* 4 TOP TABS (COACH, ACADEMY, CATALOG, DIARY) */}
        <div className="grid grid-cols-4 p-1 bg-[#F1F2F6] rounded-2xl border border-[#E5E7EB] w-full box-border gap-1">
          <button
            onClick={() => setActiveTab('ai_chat')}
            className={`py-2 px-1 rounded-xl text-[11px] sm:text-[11.5px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer min-w-0 ${
              activeTab === 'ai_chat'
                ? 'bg-white text-[#1E1E2D] shadow-xs'
                : 'text-[#7C8092] hover:text-[#1E1E2D]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5C71F3] shrink-0" />
            <span className="truncate">{isAmharic ? 'ዳጊ AI' : 'Dagi AI'}</span>
          </button>

          <button
            onClick={() => setActiveTab('academy')}
            className={`py-2 px-1 rounded-xl text-[11px] sm:text-[11.5px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer min-w-0 ${
              activeTab === 'academy'
                ? 'bg-white text-[#1E1E2D] shadow-xs'
                : 'text-[#7C8092] hover:text-[#1E1E2D]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">{isAmharic ? 'አካዳሚ' : 'Academy'}</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-2 px-1 rounded-xl text-[11px] sm:text-[11.5px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer min-w-0 ${
              activeTab === 'catalog'
                ? 'bg-white text-[#1E1E2D] shadow-xs'
                : 'text-[#7C8092] hover:text-[#1E1E2D]'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{isAmharic ? 'ዝርዝር' : 'Catalog'}</span>
          </button>

          <button
            onClick={() => setActiveTab('diary')}
            className={`py-2 px-1 rounded-xl text-[11px] sm:text-[11.5px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer min-w-0 ${
              activeTab === 'diary'
                ? 'bg-white text-[#1E1E2D] shadow-xs'
                : 'text-[#7C8092] hover:text-[#1E1E2D]'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">
              {isAmharic ? 'ማስታወሻ' : 'Diary'} ({loggedMeals.length})
            </span>
          </button>
        </div>
      </header>

      {/* ========================================== */}
      {/* TAB 1: JOSSY AI CONVERSATIONAL COACH */}
      {/* ========================================== */}
      {activeTab === 'ai_chat' && (
        <div className="flex-1 flex flex-col w-full box-border">
          {/* WELCOME HERO / PROMINENT ACADEMY CTA */}
          {showWelcomeHero && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8EAF2] card-shadow mb-4 space-y-4 text-center w-full box-border overflow-hidden"
            >
              <div className="relative inline-block mx-auto">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#EEF1FE] to-[#F8F9FD] border-2 border-[#D9DCED] p-2.5 flex items-center justify-center shadow-sm mx-auto">
                  <img
                    src={JOSSY_LOGO_URL}
                    alt="Dagi Fitness AI Avatar"
                    className="w-11 h-11 object-contain"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#5C71F3] to-[#4557D6] text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <h2 className="text-[18px] sm:text-[19px] font-black text-[#1E1E2D] tracking-tight">
                  {isAmharic ? 'ሰላም፣ ዳጊ ፊትነስ AI ነኝ' : "Hi, I'm Dagi Fitness AI"}
                </h2>
                <p className="text-[12.5px] sm:text-[13px] font-normal text-[#7C8092] mt-1 leading-relaxed max-w-sm mx-auto break-words">
                  {isAmharic
                    ? 'የግል የአካል ብቃት፣ ስፖርትና ስነ-ምግብ አሰልጣኝዎ። የበሉትን ምግብ ይመዝግቡ፣ የስልጠና ጥያቄዎችን ይጠይቁ ወይም አሰልጣኝ ለመሆን አካዳሚውን ይቀላቀሉ!'
                    : 'Your Personal Fitness & Nutrition Coach. Log meals with verified Ethiopian macros, ask fitness questions, or join the Personal Trainer Academy!'}
                </p>
              </div>

              {/* Prominent Become a Personal Trainer Button */}
              <button
                onClick={() => setActiveTab('academy')}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#5C71F3] via-[#4F64F0] to-[#4557D6] text-white font-black text-[13px] sm:text-[13.5px] flex items-center justify-between shadow-md hover:scale-[1.01] active:scale-98 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5 text-left min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="leading-tight truncate">
                      {isAmharic ? 'የግል አሰልጣኝ ይሁኑ (20 ዩኒቶች)' : 'BECOME A PERSONAL TRAINER'}
                    </div>
                    <div className="text-[10.5px] text-white/80 font-medium truncate">
                      {isAmharic ? 'የዳጊ ፊትነስ የግል አሰልጣኝ አካዳሚ' : 'Dagi Fitness Personal Trainer Academy'}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 shrink-0" />
              </button>

              {/* Categorized Question Grids */}
              <div className="space-y-3 pt-2 text-left w-full box-border">
                {categorizedSuggestions.map((group, gIdx) => {
                  const Icon = group.icon;
                  return (
                    <div key={gIdx} className="space-y-1.5 w-full">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8E92A4] uppercase tracking-wider px-1">
                        <Icon className="w-3.5 h-3.5 text-[#5C71F3] shrink-0" />
                        <span>{group.category}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 w-full">
                        {group.items.map((item, iIdx) => (
                          <button
                            key={iIdx}
                            onClick={() => handleSendMessage(item)}
                            disabled={isAiProcessing}
                            className="bg-[#F8F9FD] hover:bg-[#EEF1FE] hover:border-[#5C71F3]/40 border border-[#E9ECF2] p-2.5 rounded-2xl text-[12px] sm:text-[12.5px] font-semibold text-[#1E1E2D] text-left transition-all shadow-2xs flex items-center justify-between group cursor-pointer disabled:opacity-50 min-w-0 w-full"
                          >
                            <span className="line-clamp-1 min-w-0 flex-1 pr-1">{item}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#8E92A4] group-hover:text-[#5C71F3] transition-colors shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* CHAT MESSAGES STREAM */}
          <div className="flex-1 space-y-4 mb-3 w-full box-border">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex flex-col w-full ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.sender === 'user' ? (
                  // User Message Bubble
                  <div className="max-w-[85%] bg-[#1E1E2D] text-white rounded-2xl rounded-tr-xs px-4 py-3 card-shadow break-words box-border">
                    <p className="text-[13.5px] sm:text-[14px] font-medium leading-relaxed break-words">{msg.text}</p>
                    <span className="text-[10px] text-white/60 mt-1 block text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                ) : (
                  // Assistant Message Card
                  <div className="w-full bg-white border border-[#E8EAF2] rounded-3xl rounded-tl-sm p-4 sm:p-5 card-shadow space-y-3.5 box-border overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#F0F1F6] flex-wrap">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#EEF1FE] to-[#F8F9FD] p-1 border border-[#D9DCED] flex items-center justify-center shadow-xs shrink-0">
                          <img
                            src={JOSSY_LOGO_URL}
                            alt="Dagi Fitness AI"
                            className="w-5 h-5 object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-black text-[#1E1E2D] leading-tight truncate">
                            DAGI FITNESS AI
                          </div>
                          <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                            {isAmharic ? 'የስፖርትና ስነ-ምግብ አሰልጣኝ' : 'Fitness & Nutrition Coach'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Audio TTS Button */}
                        <button
                          onClick={() => speakMessage(msg.text)}
                          title="Read aloud"
                          className="p-1.5 rounded-lg text-[#7C8092] hover:text-[#5C71F3] hover:bg-[#EEF1FE] transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] text-[#8E92A4] font-medium">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Body Text */}
                    <p className="text-[13px] sm:text-[13.5px] font-normal text-[#1E1E2D] leading-relaxed whitespace-pre-line break-words">
                      {msg.text}
                    </p>

                    {/* Ambiguous portion options */}
                    {msg.isAmbiguous && msg.ambiguousOptions && (
                      <div className="pt-2 flex flex-wrap gap-1.5 w-full">
                        {msg.ambiguousOptions.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(opt.query)}
                            className="text-[11.5px] sm:text-[12px] font-bold text-[#5C71F3] bg-[#EEF1FE] hover:bg-[#5C71F3] hover:text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-all shadow-xs cursor-pointer border border-[#5C71F3]/20"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Food breakdowns if food query */}
                    {msg.foodBreakdowns && msg.foodBreakdowns.length > 0 && (
                      <div className="space-y-3 pt-2 w-full box-border">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#8E92A4] flex items-center justify-between">
                          <span>{isAmharic ? 'የተለዩ ምግቦች' : 'Identified Foods & Portions'}</span>
                          <span className="text-[#5C71F3] lowercase font-semibold">
                            {msg.foodBreakdowns.length} {isAmharic ? 'ምግቦች' : 'items'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-2 w-full">
                          {msg.foodBreakdowns.map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-[#F8F9FD] p-3 rounded-2xl border border-[#E8EAF2] hover:border-[#5C71F3]/30 transition-all space-y-2 box-border overflow-hidden"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E4EB] flex items-center justify-center text-[19px] shadow-2xs shrink-0">
                                    {item.foodItem.emoji || '🍲'}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-[13px] sm:text-[13.5px] font-extrabold text-[#1E1E2D] break-words">
                                      {isAmharic ? item.foodItem.nameAm : item.foodItem.nameEn}
                                    </div>
                                    <div className="text-[11px] text-[#7C8092] font-medium break-words">
                                      {item.portionLabel}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="inline-block px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200/60 text-amber-700 font-extrabold text-[11.5px] sm:text-[12px]">
                                    {item.calculatedCalories} kcal
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#ECEEF5] w-full">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-[#5C71F3] border border-indigo-100">
                                  {item.calculatedProtein}g {isAmharic ? 'ፕሮቲን' : 'Protein'}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100">
                                  {item.calculatedCarbs}g {isAmharic ? 'ካርቦስ' : 'Carbs'}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                                  {item.calculatedFat}g {isAmharic ? 'ስብ' : 'Fat'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Interactive Meal Logging Controller */}
                        <div className="pt-1 w-full box-border">
                          {loggedSuccessMap[msg.id] ? (
                            <div className="w-full py-3 rounded-2xl bg-emerald-50 text-emerald-700 text-[12.5px] sm:text-[13px] font-extrabold flex items-center justify-center gap-2 border border-emerald-200">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="truncate">
                                {isAmharic ? 'ምግቡ በተሳካ ሁኔታ ተመዝግቧል' : 'Meal Logged Successfully to Diary'}
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-2.5 bg-[#F8F9FD] p-3 rounded-2xl border border-[#E8EAF2] w-full box-border">
                              <div className="space-y-1.5">
                                <span className="text-[11px] font-bold text-[#7C8092] block">
                                  {isAmharic ? 'የምግብ ዓይነት ይምረጡ፡' : 'Select Meal Time:'}
                                </span>
                                <div className="grid grid-cols-4 gap-1 w-full">
                                  {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
                                    <button
                                      key={type}
                                      onClick={() => setSelectedMealForAiLog(type)}
                                      className={`py-1.5 px-1 rounded-xl text-[10px] sm:text-[10.5px] font-bold uppercase transition-all cursor-pointer text-center truncate ${
                                        selectedMealForAiLog === type
                                          ? 'bg-[#5C71F3] text-white shadow-xs'
                                          : 'bg-white border border-[#D9DCED] text-[#7C8092] hover:text-[#1E1E2D]'
                                      }`}
                                    >
                                      {getLocalizedMealType(type)}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <button
                                onClick={() => handleLogAiMeal(msg, selectedMealForAiLog)}
                                disabled={loggingMessageId === msg.id}
                                className="w-full py-3 rounded-2xl bg-[#5C71F3] hover:bg-[#4A5FE3] text-white text-[12.5px] sm:text-[13px] font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                              >
                                <Plus className="w-4 h-4 stroke-[3] shrink-0" />
                                <span className="truncate">
                                  {isAmharic
                                    ? `ይህንን ምግብ መዝግብ (${msg.totalCalories} kcal)`
                                    : `+ Log This Meal (${msg.totalCalories} kcal)`}
                                </span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}

            {/* TYPING / THINKING INDICATOR */}
            {isAiProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 bg-white border border-[#E8EAF2] rounded-3xl rounded-tl-sm px-4 py-3 max-w-[90%] card-shadow box-border"
              >
                <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-[#EEF1FE] to-[#F8F9FD] p-1 border border-[#D9DCED] flex items-center justify-center shrink-0">
                  <img
                    src={JOSSY_LOGO_URL}
                    alt="Dagi Fitness AI"
                    className="w-4 h-4 object-contain animate-pulse"
                  />
                </div>
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-[12px] font-semibold text-[#5C71F3] truncate">
                    {aiStatusText || (isAmharic ? 'ዳጊ ፊትነስ AI መልስ እያዘጋጀ ነው...' : 'Analyzing your request...')}
                  </span>
                  <span className="flex gap-1 items-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5C71F3] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5C71F3] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5C71F3] animate-bounce" />
                  </span>
                </div>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* QUICK PROMPT CHIPS */}
          <div className="py-2.5 border-t border-[#EAEBED] w-full box-border">
            <div className="flex items-center justify-between text-[10.5px] font-bold uppercase tracking-wider text-[#8E92A4] mb-2 px-1">
              <span>{isAmharic ? 'ፈጣን ጥያቄዎች' : 'Suggested Questions'}</span>
              <span className="text-[#5C71F3] text-[9.5px] lowercase font-medium">
                {isAmharic ? 'ለመጠየቅ ይጫኑ' : 'tap to ask'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 w-full box-border">
              {quickPromptChips.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isAiProcessing}
                  className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl text-[11px] sm:text-[11.5px] font-semibold text-[#1E1E2D] bg-white border border-[#E2E4EB] hover:bg-[#EEF1FE] hover:border-[#5C71F3]/40 hover:text-[#5C71F3] transition-all card-shadow cursor-pointer disabled:opacity-40 text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* INPUT AREA WITH SPEECH RECOGNITION */}
          <div className="pt-2 w-full box-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-white border-2 border-[#D9DCED] focus-within:border-[#5C71F3] rounded-3xl p-1.5 transition-all card-shadow w-full box-border"
            >
              {/* Mic Speech Button */}
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  title={isListening ? 'Stop listening' : 'Speak to Dagi Fitness AI'}
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse shadow-md'
                      : 'bg-[#F1F2F6] text-[#7C8092] hover:text-[#5C71F3]'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={
                  isAmharic
                    ? 'ስለ ምግብ፣ ስፖርት ወይም አሰልጣኝነት ይጠይቁ...'
                    : 'Ask about food, workouts, or training...'
                }
                disabled={isAiProcessing}
                className="flex-1 min-w-0 bg-transparent px-2 text-[14px] sm:text-[15px] font-medium text-[#1E1E2D] placeholder-[#8E92A4] outline-none"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isAiProcessing}
                className="w-10 h-10 rounded-2xl bg-[#5C71F3] text-white flex items-center justify-center transition-all disabled:opacity-40 active:scale-95 shadow-xs cursor-pointer shrink-0 hover:bg-[#4A5FE3]"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: 100+ ETHIOPIAN FOOD CATALOG */}
      {/* ========================================== */}
      {activeTab === 'catalog' && (
        <div className="flex-1 flex flex-col space-y-3 w-full box-border">
          {/* Search bar */}
          <div className="relative w-full box-border">
            <Search className="w-4 h-4 text-[#8E92A4] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder={
                isAmharic
                  ? 'በ100+ የኢትዮጵያ ምግቦች ውስጥ ይፈልጉ...'
                  : 'Search 100+ Ethiopian & athletic foods...'
              }
              className="w-full h-11 bg-white border border-[#D9DCED] focus:border-[#5C71F3] rounded-2xl pl-10 pr-9 text-[13px] sm:text-[13.5px] font-semibold text-[#1E1E2D] outline-none card-shadow box-border"
            />
            {catalogSearch && (
              <button
                onClick={() => setCatalogSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8E92A4] hover:text-[#1E1E2D]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full box-border">
            {[
              { id: 'all', labelEn: 'All Foods', labelAm: 'ሁሉም ምግቦች' },
              { id: 'ethiopian', labelEn: '🇪🇹 Ethiopian Traditional', labelAm: '🇪🇹 የባህል ምግቦች' },
              { id: 'protein', labelEn: '💪 High Protein (15g+)', labelAm: '💪 ከፍተኛ ፕሮቲን' },
              { id: 'fasting', labelEn: '🌱 Fasting Friendly', labelAm: '🌱 የጾም ምግቦች' },
              { id: 'affordable', labelEn: '💰 Budget / Affordable', labelAm: '💰 ተመጣጣኝ ዋጋ' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCatalogCategory(cat.id as any)}
                className={`px-3 py-2 rounded-2xl text-[11.5px] sm:text-[12px] font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                  catalogCategory === cat.id
                    ? 'bg-[#1E1E2D] text-white border-[#1E1E2D] shadow-xs'
                    : 'bg-white text-[#7C8092] border-[#E8EAF2] hover:text-[#1E1E2D]'
                }`}
              >
                {isAmharic ? cat.labelAm : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Foods Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full box-border">
            {filteredCatalog.map((food) => (
              <div
                key={food.id}
                onClick={() => {
                  setSelectedFoodForModal(food);
                  setModalServingCount(1);
                }}
                className="bg-white p-3.5 rounded-3xl border border-[#E8EAF2] hover:border-[#5C71F3]/40 transition-all card-shadow flex items-center justify-between gap-3 cursor-pointer group box-border overflow-hidden"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-2xl bg-[#F8F9FD] border border-[#E8EAF0] flex items-center justify-center text-[22px] group-hover:scale-105 transition-transform shrink-0">
                    {food.emoji || '🍲'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[13.5px] sm:text-[14px] font-extrabold text-[#1E1E2D] truncate">
                      {isAmharic ? food.nameAm : food.nameEn}
                    </h3>
                    <p className="text-[11px] text-[#7C8092] font-medium truncate">
                      {food.servingSize} • {food.calories} kcal
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-[#5C71F3]">
                        {food.proteinG}g {isAmharic ? 'ፕሮቲን' : 'P'}
                      </span>
                      <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
                        {food.carbsG}g {isAmharic ? 'ካርቦስ' : 'C'}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="w-8 h-8 rounded-xl bg-[#F8F9FD] border border-[#D9DCED] text-[#5C71F3] group-hover:bg-[#5C71F3] group-hover:text-white flex items-center justify-center transition-all shrink-0">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: DIARY (LOGGED MEALS) */}
      {/* ========================================== */}
      {activeTab === 'diary' && (
        <div className="flex-1 flex flex-col space-y-3 w-full box-border">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[14px] font-extrabold text-[#1E1E2D] uppercase tracking-wider">
              {isAmharic ? 'የዛሬ የተመዘገቡ ምግቦች' : "Today's Logged Meals"}
            </h2>
            <span className="text-[11.5px] font-semibold text-[#7C8092]">
              {loggedMeals.length} {isAmharic ? 'ምግቦች' : 'items'}
            </span>
          </div>

          {loggedMeals.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-[#E8EAF2] text-center space-y-3 card-shadow w-full box-border">
              <div className="w-14 h-14 rounded-2xl bg-[#F8F9FD] border border-[#E8EAF0] flex items-center justify-center mx-auto text-[26px]">
                🍽️
              </div>
              <h3 className="text-[16px] font-bold text-[#1E1E2D]">
                {isAmharic ? 'ምንም የተመዘገበ ምግብ የለም' : 'No Meals Logged Today'}
              </h3>
              <p className="text-[12px] text-[#7C8092] max-w-xs mx-auto">
                {isAmharic
                  ? 'የበሉትን ምግብ በዳጊ ፊትነስ AI በኩል ይናገሩ ወይም ከምግብ ዝርዝሩ ውስጥ ይምረጡ።'
                  : 'Tell Dagi Fitness AI what you ate or pick items from the verified Ethiopian food catalog.'}
              </p>
              <button
                onClick={() => setActiveTab('ai_chat')}
                className="px-5 py-2.5 rounded-xl bg-[#5C71F3] text-white text-[12px] font-bold cursor-pointer"
              >
                {isAmharic ? 'ዳጊ ፊትነስ AIን ይክፈቱ' : 'Open Dagi Fitness AI'}
              </button>
            </div>
          ) : (
            <div className="space-y-2 w-full box-border">
              {loggedMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-white p-3.5 rounded-2xl border border-[#E8EAF2] card-shadow flex items-center justify-between gap-3 box-border overflow-hidden"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#F1F2F6] text-[#7C8092]">
                        {getLocalizedMealType(meal.mealType)}
                      </span>
                      <h4 className="text-[13.5px] font-extrabold text-[#1E1E2D] truncate">
                        {meal.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#7C8092] font-medium mt-0.5 truncate">
                      {meal.portionDescription} • {meal.calories} kcal • {meal.proteinG}g P
                    </p>
                  </div>

                  <button
                    onClick={() => deleteMeal(meal.id)}
                    className="p-2 text-[#8E92A4] hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* MANUAL FOOD MODAL */}
      {/* ========================================== */}
      <AnimatePresence>
        {selectedFoodForModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-xs"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-3xl p-5 max-w-sm w-full card-shadow border border-[#D9DCED] space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="text-[24px]">{selectedFoodForModal.emoji || '🍲'}</div>
                  <div>
                    <h3 className="text-[15px] font-black text-[#1E1E2D]">
                      {isAmharic ? selectedFoodForModal.nameAm : selectedFoodForModal.nameEn}
                    </h3>
                    <p className="text-[11px] text-[#7C8092]">
                      {selectedFoodForModal.servingSize}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFoodForModal(null)}
                  className="p-1 text-[#7C8092] hover:text-[#1E1E2D]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Servings counter */}
              <div className="flex items-center justify-between bg-[#F8F9FD] p-3 rounded-2xl border border-[#E8EAF0]">
                <span className="text-[12px] font-bold text-[#1E1E2D]">
                  {isAmharic ? 'የመጠን ብዛት (Servings):' : 'Number of Servings:'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalServingCount((p) => Math.max(0.5, p - 0.5))}
                    className="w-7 h-7 rounded-lg bg-white border border-[#D9DCED] font-black text-[#1E1E2D]"
                  >
                    -
                  </button>
                  <span className="text-[13px] font-black text-[#1E1E2D] w-8 text-center">
                    {modalServingCount}x
                  </span>
                  <button
                    onClick={() => setModalServingCount((p) => p + 0.5)}
                    className="w-7 h-7 rounded-lg bg-white border border-[#D9DCED] font-black text-[#1E1E2D]"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Meal type selector */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#7C8092]">
                  {isAmharic ? 'የምግብ ዓይነት' : 'Meal Time'}
                </span>
                <div className="grid grid-cols-4 gap-1">
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setModalMealType(type)}
                      className={`py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all ${
                        modalMealType === type
                          ? 'bg-[#5C71F3] text-white'
                          : 'bg-[#F8F9FD] border border-[#E8EAF0] text-[#7C8092]'
                      }`}
                    >
                      {getLocalizedMealType(type)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculated nutrients */}
              <div className="grid grid-cols-3 gap-2 text-center bg-[#F8F9FD] p-2.5 rounded-2xl border border-[#E8EAF0]">
                <div>
                  <div className="text-[13px] font-black text-[#1E1E2D]">
                    {Math.round(selectedFoodForModal.calories * modalServingCount)}
                  </div>
                  <div className="text-[9px] font-bold text-[#8E92A4]">kcal</div>
                </div>
                <div>
                  <div className="text-[13px] font-black text-[#5C71F3]">
                    {Math.round(selectedFoodForModal.proteinG * modalServingCount * 10) / 10}g
                  </div>
                  <div className="text-[9px] font-bold text-[#8E92A4]">Protein</div>
                </div>
                <div>
                  <div className="text-[13px] font-black text-amber-600">
                    {Math.round(selectedFoodForModal.carbsG * modalServingCount * 10) / 10}g
                  </div>
                  <div className="text-[9px] font-bold text-[#8E92A4]">Carbs</div>
                </div>
              </div>

              <button
                onClick={handleLogFromCatalogModal}
                className="w-full py-3 rounded-2xl bg-[#5C71F3] text-white font-black text-[13px] shadow-sm hover:bg-[#4A5FE3] cursor-pointer"
              >
                {isAmharic ? 'ወደ ማስታወሻ መዝግብ' : 'Log Food to Diary'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
