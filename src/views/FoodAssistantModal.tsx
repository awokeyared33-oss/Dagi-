import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Sparkles, Plus, Check, Utensils, MessageSquare, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FOOD_DATABASE, parseNaturalLanguageFood, ParsedFoodResult, queryJossyAI } from '../data/foodDatabase';
import { FoodItem } from '../types';

interface FoodAssistantModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const FoodAssistantModal: React.FC<FoodAssistantModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
}) => {
  const { logMeal, user, language, t, getLocalizedMealType, isJossyAIOpen, setIsJossyAIOpen } = useApp();

  const isAmharic = language === 'am';
  const isOpen = propIsOpen !== undefined ? propIsOpen : isJossyAIOpen;
  const handleClose = () => {
    if (propOnClose) propOnClose();
    setIsJossyAIOpen(false);
  };

  const [activeTab, setActiveTab] = useState<'nlp' | 'catalog' | 'ai_coach'>('nlp');
  const [nlpInput, setNlpInput] = useState('');
  const [parsedResult, setParsedResult] = useState<ParsedFoodResult | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // AI Coach Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'assistant' | 'user'; content: string }>>([
    {
      role: 'assistant',
      content:
        isAmharic
          ? `ሰላም ${user.name ? user.name.split(' ')[0] : 'ስፖርተኛ'}! ስለ ኢትዮጵያ ምግቦች፣ ፕሮቲን እና ካሎሪ ማንኛውንም ጥያቄ ጠይቀኝ።`
          : `Hi ${user.name ? user.name.split(' ')[0] : 'Athlete'}! I'm your Dagi Fitness AI Nutrition Coach. Ask me about Ethiopian meals, macro splits, or healthy substitutions.`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const quickSamples = isAmharic
    ? [
        '2 እንጀራ',
        '150g የዶሮ ደረት',
        '3 የተቀቀለ እንቁላል',
        '1 ሳህን ሽሮ',
        '200g የበሬ ጥብስ',
        '1 ኩባያ አጃ (Oatmeal)',
        '1 ማንኪያ ዌይ ፕሮቲን',
      ]
    : [
        '2 rolls of injera',
        '150g chicken breast',
        '3 boiled eggs',
        '1 bowl shiro',
        '200g beef tibs',
        '1 cup oatmeal',
        '1 scoop whey protein',
      ];

  const handleParse = (query: string) => {
    setNlpInput(query);
    const result = parseNaturalLanguageFood(query);
    setParsedResult(result);
  };

  const handleLogParsed = () => {
    if (!parsedResult) return;
    logMeal({
      foodId: parsedResult.foodItem.id,
      name: isAmharic
        ? `${parsedResult.foodItem.nameAm} (${parsedResult.portionLabel})`
        : `${parsedResult.foodItem.nameEn} (${parsedResult.portionLabel})`,
      mealType: selectedMealType,
      servings: parsedResult.quantity,
      portionDescription: parsedResult.portionLabel,
      calories: parsedResult.calculatedCalories,
      proteinG: parsedResult.calculatedProtein,
      carbsG: parsedResult.calculatedCarbs,
      fatG: parsedResult.calculatedFat,
      sugarG: (parsedResult.foodItem.sugarG || 0) * parsedResult.quantity,
      fiberG: (parsedResult.foodItem.fiberG || 0) * parsedResult.quantity,
    });
    setToastMsg(isAmharic ? 'ምግቡ ተመዝግቧል!' : 'Meal logged to diary!');
    setTimeout(() => {
      setToastMsg('');
      handleClose();
    }, 700);
  };

  const handleLogFoodItem = (food: FoodItem) => {
    logMeal({
      foodId: food.id,
      name: isAmharic ? `${food.nameAm} (${food.servingSize})` : `${food.nameEn} (${food.servingSize})`,
      mealType: selectedMealType,
      servings: 1,
      portionDescription: food.servingSize,
      calories: food.calories,
      proteinG: food.proteinG,
      carbsG: food.carbsG,
      fatG: food.fatG,
      sugarG: food.sugarG || 0,
      fiberG: food.fiberG || 0,
    });
    setToastMsg(isAmharic ? `${food.nameAm} ተጨምሯል!` : `Added ${food.nameEn}!`);
    setTimeout(() => {
      setToastMsg('');
      handleClose();
    }, 700);
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setIsAiLoading(true);

    try {
      const response = await queryJossyAI(userText, user);
      setChatMessages((prev) => [...prev, { role: 'assistant', content: response.reply }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: isAmharic
            ? 'እንጀራ እና ከፍተኛ ፕሮቲን ያላቸው እንደ ዶሮ ወጥ ወይም የበሬ ጥብስ ያሉ ምግቦች ለስፖርት ግብዎ ተስማሚ ናቸው።'
            : 'Injera and high protein stew like Doro Wat or Beef Tibs provide balanced fuel for your target.',
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredFoods = FOOD_DATABASE.filter(
    (f) =>
      f.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.nameAm.includes(searchQuery) ||
      (f.isEthiopianTraditional && searchQuery.toLowerCase().includes('ethiop'))
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/45 backdrop-blur-xs"
        />

        {/* Modal Bottom Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative w-full max-w-[430px] bg-white rounded-t-3xl p-5 shadow-2xl z-10 max-h-[90vh] flex flex-col pb-safe"
        >
          {/* Drag Handle */}
          <div className="w-12 h-1.5 bg-[#E2E4F0] rounded-full mx-auto mb-3" />

          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#FFF7E6] text-[#FFB020] flex items-center justify-center">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[17px] font-black text-[#1E1E2D] tracking-tight">
                  {isAmharic ? 'የዳጊ ስነ-ምግብ ረዳት' : 'Dagi Fitness AI Nutrition Assistant'}
                </h3>
                <span className="text-[11px] text-[#8E8E9F] font-medium">
                  {isAmharic ? 'የኢትዮጵያ ምግብ ዳታቤዝ እና የ AI ምክር' : 'Ethiopian Food Database & AI Advice'}
                </span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-[#F5F6FA] flex items-center justify-center text-[#8E8E9F] hover:text-[#1E1E2D]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 3 Navigation Tabs */}
          <div className="flex p-1 bg-[#F5F6FA] rounded-2xl mb-3">
            <button
              onClick={() => setActiveTab('nlp')}
              className={`flex-1 py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                activeTab === 'nlp' ? 'bg-white text-[#1E1E2D] shadow-xs' : 'text-[#8E8E9F]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5C71F3]" />
              <span>{isAmharic ? 'ብልጥ መዝጋቢ' : 'Smart Log'}</span>
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex-1 py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                activeTab === 'catalog' ? 'bg-white text-[#1E1E2D] shadow-xs' : 'text-[#8E8E9F]'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-[#00D09E]" />
              <span>{isAmharic ? 'የምግብ ዝርዝር' : 'Catalog'}</span>
            </button>
            <button
              onClick={() => setActiveTab('ai_coach')}
              className={`flex-1 py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                activeTab === 'ai_coach' ? 'bg-white text-[#1E1E2D] shadow-xs' : 'text-[#8E8E9F]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#9D5CE5]" />
              <span>{isAmharic ? 'AI አሰልጣኝ' : 'AI Coach'}</span>
            </button>
          </div>

          {/* Meal Category Selector (for logging) */}
          {activeTab !== 'ai_coach' && (
            <div className="flex gap-1.5 mb-3 overflow-x-auto no-scrollbar">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedMealType(type)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold capitalize transition-all cursor-pointer ${
                    selectedMealType === type
                      ? 'bg-[#5C71F3] text-white shadow-xs'
                      : 'bg-[#F5F6FA] text-[#8E8E9F]'
                  }`}
                >
                  {getLocalizedMealType(type)}
                </button>
              ))}
            </div>
          )}

          {toastMsg ? (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#00D09E]/20 text-[#00D09E] flex items-center justify-center mb-2">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <p className="text-[15px] font-bold text-[#1E1E2D]">{toastMsg}</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar pr-0.5">
              {/* TAB 1: NLP FOOD PARSER */}
              {activeTab === 'nlp' && (
                <>
                  <div className="bg-[#F8F9FD] p-3.5 rounded-2xl border border-[#EFEFF8]">
                    <label className="text-[11px] font-bold text-[#8E8E9F] uppercase tracking-wider block mb-1.5">
                      {isAmharic ? 'የበሉትን ይጻፉ (በአማርኛ ወይም በእንግሊዝኛ)' : 'Type what you ate (English or Amharic)'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={nlpInput}
                        onChange={(e) => handleParse(e.target.value)}
                        placeholder={
                          isAmharic
                            ? 'ለምሳሌ፡ 2 እንጀራ፣ 1 ሳህን ሽሮ፣ 3 እንቁላል'
                            : 'e.g. 2 rolls of injera, 1 bowl shiro, 3 eggs'
                        }
                        className="flex-1 h-11 rounded-xl bg-white border border-[#D9DCED] px-3.5 text-[14px] font-semibold text-[#1E1E2D] outline-none focus:border-[#5C71F3]"
                      />
                    </div>

                    {/* Suggested Quick Chips */}
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {quickSamples.map((sample) => (
                        <button
                          key={sample}
                          onClick={() => handleParse(sample)}
                          className="text-[11px] font-semibold text-[#5C71F3] bg-[#EEF1FE] hover:bg-[#5C71F3] hover:text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          + {sample}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Deterministic Parser Output */}
                  {parsedResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-4 border-2 border-[#5C71F3]/30 card-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[18px]">{parsedResult.foodItem.emoji || '🥗'}</span>
                            <h4 className="text-[15px] font-extrabold text-[#1E1E2D]">
                              {isAmharic ? parsedResult.foodItem.nameAm : parsedResult.foodItem.nameEn}
                            </h4>
                          </div>
                          <p className="text-[12px] text-[#8E8E9F] mt-0.5 font-medium">
                            {isAmharic ? parsedResult.foodItem.nameEn : parsedResult.foodItem.nameAm} •{' '}
                            <span className="text-[#5C71F3] font-bold">{parsedResult.portionLabel}</span>
                          </p>
                        </div>

                        <span className="text-[16px] font-black text-[#1E1E2D]">
                          {parsedResult.calculatedCalories} {t('unitKcal')}
                        </span>
                      </div>

                      {/* Macro Breakdown */}
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#F1F2FA] text-center">
                        <div className="bg-[#EEF1FE] p-2 rounded-xl">
                          <span className="text-[10px] font-bold text-[#5C71F3] uppercase block">{t('protein')}</span>
                          <span className="text-[13px] font-black text-[#1E1E2D]">{parsedResult.calculatedProtein}g</span>
                        </div>
                        <div className="bg-[#FFF7E6] p-2 rounded-xl">
                          <span className="text-[10px] font-bold text-[#FFB020] uppercase block">{t('carbs')}</span>
                          <span className="text-[13px] font-black text-[#1E1E2D]">{parsedResult.calculatedCarbs}g</span>
                        </div>
                        <div className="bg-[#FFEBEB] p-2 rounded-xl">
                          <span className="text-[10px] font-bold text-[#FF5C5C] uppercase block">{t('fats')}</span>
                          <span className="text-[13px] font-black text-[#1E1E2D]">{parsedResult.calculatedFat}g</span>
                        </div>
                      </div>

                      <button
                        onClick={handleLogParsed}
                        className="w-full h-12 rounded-xl bg-[#5C71F3] text-white font-bold text-[14px] flex items-center justify-center gap-2 mt-3 cursor-pointer hover:bg-[#4B62EB] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>
                          {isAmharic
                            ? `ወደ ${getLocalizedMealType(selectedMealType)} መዝግብ`
                            : `Log to ${selectedMealType}`}
                        </span>
                      </button>
                    </motion.div>
                  )}
                </>
              )}

              {/* TAB 2: FOOD CATALOG */}
              {activeTab === 'catalog' && (
                <div className="space-y-3">
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-[#8E8E9F] absolute left-3.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        isAmharic
                          ? 'ምግብ ፈልግ (እንጀራ፣ ሽሮ፣ ጥብስ፣ ኦትስ...)'
                          : 'Search Injera, Shiro, Tibs, Oats, Chicken...'
                      }
                      className="w-full h-11 rounded-xl bg-[#F5F6FA] border border-[#E5E7EB] pl-10 pr-4 text-[13px] font-semibold text-[#1E1E2D] outline-none focus:border-[#5C71F3]"
                    />
                  </div>

                  <div className="space-y-2">
                    {filteredFoods.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-3 rounded-2xl border border-[#EBEBF4] flex items-center justify-between hover:border-[#5C71F3]/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[20px]">{item.emoji || '🍲'}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 className="text-[13px] font-bold text-[#1E1E2D]">
                                {isAmharic ? item.nameAm : item.nameEn}
                              </h5>
                              {item.isEthiopianTraditional && (
                                <span className="text-[9px] font-black uppercase text-[#00C48C] bg-[#E6FAF3] px-1.5 py-0.5 rounded">
                                  {isAmharic ? '🇪🇹 ባህላዊ' : 'Ethiopian'}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#8E8E9F]">
                              {isAmharic ? item.nameEn : item.nameAm} • {item.servingSize} • {item.calories} {t('unitKcal')} ({isAmharic ? 'ፕ' : 'P'}: {item.proteinG}g, {isAmharic ? 'ካ' : 'C'}: {item.carbsG}g)
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleLogFoodItem(item)}
                          className="w-8 h-8 rounded-xl bg-[#EEF1FE] text-[#5C71F3] flex items-center justify-center cursor-pointer hover:bg-[#5C71F3] hover:text-white transition-colors"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: AI COACH CHAT */}
              {activeTab === 'ai_coach' && (
                <div className="flex flex-col h-[360px]">
                  <div className="flex-1 overflow-y-auto space-y-2.5 p-1 no-scrollbar">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] ${
                            msg.role === 'user'
                              ? 'bg-[#5C71F3] text-white font-medium rounded-br-none'
                              : 'bg-[#F5F6FA] text-[#1E1E2D] border border-[#E8EAF2] rounded-bl-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isAiLoading && (
                      <div className="flex justify-start">
                        <div className="bg-[#F5F6FA] text-[#8E8E9F] text-[12px] px-3 py-2 rounded-2xl animate-pulse">
                          {isAmharic ? 'ዳጊ ፊትነስ AI እያሰበ ነው...' : 'Dagi Fitness AI is analyzing...'}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#F1F2FA] flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                      placeholder={
                        isAmharic
                          ? 'ስለ እንጀራ፣ ማክሮ ወይም ከስፖርት በኋላ ስለሚበሉ ምግቦች ይጠይቁ...'
                          : 'Ask about Injera, macros, post-workout...'
                      }
                      className="flex-1 h-11 rounded-xl bg-[#F5F6FA] border border-[#E5E7EB] px-3.5 text-[13px] text-[#1E1E2D] outline-none focus:border-[#5C71F3]"
                    />
                    <button
                      onClick={handleSendChatMessage}
                      disabled={isAiLoading || !chatInput.trim()}
                      className="w-11 h-11 rounded-xl bg-[#5C71F3] text-white flex items-center justify-center cursor-pointer disabled:opacity-50 hover:bg-[#4B62EB] transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

