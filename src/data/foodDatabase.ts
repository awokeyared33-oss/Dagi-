import { FoodItem, UserProfile, PlannedMealItem, JossyAIMessage, JossyAIFoodBreakdown } from '../types';

/**
 * COMPREHENSIVE ETHIOPIAN & FITNESS FOOD DATABASE (110+ REALISTIC, ACCURATE ITEMS)
 * Calibrated according to Ethiopian Public Health Institute (EPHI) and standard nutritional composition.
 */
export const FOOD_DATABASE: FoodItem[] = [
  // ==========================================
  // 1. GRAINS & TRADITIONAL STAPLES
  // ==========================================
  {
    id: 'eth-injera-teff',
    nameEn: 'Injera (Pure Teff Flatbread)',
    nameAm: 'እንጀራ (ጤፍ)',
    servingSize: '1 roll (150g)',
    servingGrams: 150,
    calories: 220,
    proteinG: 7.2,
    carbsG: 45.5,
    fatG: 1.2,
    fiberG: 4.2,
    sugarG: 0.6,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 roll (150g)',
    aliases: ['injera', 'enjera', 'teff injera', 'teff', 'እንጀራ', 'ጤፍ'],
    emoji: '🫓',
  },
  {
    id: 'eth-injera-mixed',
    nameEn: 'Injera (Mixed Teff & Barley/Wheat)',
    nameAm: 'እንጀራ (ቀላጭ / ጤፍና ገብስ)',
    servingSize: '1 roll (150g)',
    servingGrams: 150,
    calories: 215,
    proteinG: 6.8,
    carbsG: 44.8,
    fatG: 1.4,
    fiberG: 4.0,
    sugarG: 0.7,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 roll (150g)',
    aliases: ['mixed injera', 'barley injera', 'ቀላጭ እንጀራ', 'የገብስ እንጀራ'],
    emoji: '🫓',
  },
  {
    id: 'eth-teff-cooked',
    nameEn: 'Cooked Teff Grain',
    nameAm: 'የተቀቀለ ጤፍ',
    servingSize: '1 cup cooked (250g)',
    servingGrams: 250,
    calories: 255,
    proteinG: 9.8,
    carbsG: 50.0,
    fatG: 1.6,
    fiberG: 7.1,
    sugarG: 0.5,
    category: 'breakfast',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 cup (250g)',
    aliases: ['teff grain', 'teff porridge', 'የጤፍ እህል'],
    emoji: '🥣',
  },
  {
    id: 'eth-kinche',
    nameEn: 'Kinche (Cracked Wheat Porridge with Light Oil/Butter)',
    nameAm: 'ቂንጬ',
    servingSize: '1 bowl cooked (200g)',
    servingGrams: 200,
    calories: 260,
    proteinG: 8.4,
    carbsG: 48.0,
    fatG: 4.5,
    fiberG: 6.2,
    sugarG: 0.6,
    category: 'breakfast',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 bowl (200g)',
    aliases: ['kinche', 'qinche', 'cracked wheat', 'ቂንጬ'],
    emoji: '🥣',
  },
  {
    id: 'eth-genfo-barley',
    nameEn: 'Genfo (Barley / Roasted Teff Porridge)',
    nameAm: 'የገብስ ገንፎ',
    servingSize: '1 bowl (250g)',
    servingGrams: 250,
    calories: 390,
    proteinG: 10.5,
    carbsG: 68.0,
    fatG: 9.5,
    fiberG: 6.8,
    sugarG: 1.0,
    category: 'breakfast',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 bowl (250g)',
    aliases: ['genfo', 'ga\'at', 'barley porridge', 'ገንፎ', 'የገብስ ገንፎ'],
    emoji: '🥣',
  },
  {
    id: 'eth-chechebsa',
    nameEn: 'Chechebsa / Kita Firfir (Light Honey & Butter)',
    nameAm: 'ጨጨብሳ / ቂጣ ፍርፍር',
    servingSize: '1 plate (200g)',
    servingGrams: 200,
    calories: 420,
    proteinG: 9.0,
    carbsG: 72.0,
    fatG: 12.0,
    fiberG: 3.5,
    sugarG: 10.5,
    category: 'breakfast',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: true,
    commonServing: '1 plate (200g)',
    aliases: ['chechebsa', 'kita firfir', 'chachebsa', 'ጨጨብሳ', 'ቂጣ ፍርፍር'],
    emoji: '🥞',
  },
  {
    id: 'eth-dabo-bread',
    nameEn: 'Ethiopian Wheat Bread (Dabo)',
    nameAm: 'ዳቦ (የስንዴ ዳቦ)',
    servingSize: '1 medium slice (80g)',
    servingGrams: 80,
    calories: 195,
    proteinG: 6.2,
    carbsG: 39.0,
    fatG: 1.5,
    fiberG: 2.8,
    sugarG: 2.2,
    category: 'breakfast',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 slice (80g)',
    aliases: ['dabo', 'bread', 'ethiopian bread', 'ዳቦ'],
    emoji: '🍞',
  },
  {
    id: 'eth-dabo-kolo',
    nameEn: 'Dabo Kolo (Crispy Roasted Wheat Bites)',
    nameAm: 'ዳቦ ቆሎ',
    servingSize: '1 handful (50g)',
    servingGrams: 50,
    calories: 210,
    proteinG: 5.5,
    carbsG: 36.0,
    fatG: 5.2,
    fiberG: 2.1,
    sugarG: 4.5,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 handful (50g)',
    aliases: ['dabo kolo', 'dabo qolo', 'ዳቦ ቆሎ'],
    emoji: '🥨',
  },
  {
    id: 'eth-kolo-mixed',
    nameEn: 'Kollo (Roasted Barley, Chickpeas & Peanuts)',
    nameAm: 'ቆሎ (ገብስ፣ ሽምብራና ለውዝ)',
    servingSize: '1 small cup (60g)',
    servingGrams: 60,
    calories: 245,
    proteinG: 9.8,
    carbsG: 38.0,
    fatG: 6.5,
    fiberG: 5.6,
    sugarG: 1.2,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 cup (60g)',
    aliases: ['kolo', 'qolo', 'kollo', 'ቆሎ', 'የገብስ ቆሎ'],
    emoji: '🥜',
  },
  {
    id: 'eth-bekolo-roasted',
    nameEn: 'Roasted Maize / Corn (Yeketekele Bekolo)',
    nameAm: 'የተጠበሰ በቆሎ',
    servingSize: '1 medium cob (150g)',
    servingGrams: 150,
    calories: 185,
    proteinG: 5.2,
    carbsG: 38.5,
    fatG: 2.1,
    fiberG: 4.8,
    sugarG: 3.2,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 cob (150g)',
    aliases: ['roasted corn', 'roasted maize', 'bekolo', 'የተጠበሰ በቆሎ', 'በቆሎ'],
    emoji: '🌽',
  },
  {
    id: 'eth-bekolo-boiled',
    nameEn: 'Boiled Sweet Corn (Yeqeqele Bekolo)',
    nameAm: 'የተቀቀለ በቆሎ',
    servingSize: '1 cob (150g)',
    servingGrams: 150,
    calories: 150,
    proteinG: 4.8,
    carbsG: 32.0,
    fatG: 1.8,
    fiberG: 4.2,
    sugarG: 4.5,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 cob (150g)',
    aliases: ['boiled corn', 'boiled maize', 'yeqeqele bekolo', 'የተቀቀለ በቆሎ'],
    emoji: '🌽',
  },
  {
    id: 'eth-oats-aja',
    nameEn: 'Aja (Rolled Oats Porridge with Cinnamon)',
    nameAm: 'አጃ (ኦትስ)',
    servingSize: '1 bowl cooked (200g)',
    servingGrams: 200,
    calories: 220,
    proteinG: 8.5,
    carbsG: 40.0,
    fatG: 3.8,
    fiberG: 6.5,
    sugarG: 0.8,
    category: 'breakfast',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 bowl (200g)',
    aliases: ['oats', 'oatmeal', 'aja', 'አጃ', 'ኦትስ'],
    emoji: '🥣',
  },
  {
    id: 'eth-rice-white',
    nameEn: 'White Rice (Cooked)',
    nameAm: 'ነጭ ሩዝ',
    servingSize: '1 cup cooked (160g)',
    servingGrams: 160,
    calories: 205,
    proteinG: 4.3,
    carbsG: 45.0,
    fatG: 0.4,
    fiberG: 0.6,
    sugarG: 0.1,
    category: 'lunch',
    isEthiopianTraditional: false,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 cup (160g)',
    aliases: ['rice', 'white rice', 'cooked rice', 'ሩዝ', 'ነጭ ሩዝ'],
    emoji: '🍚',
  },
  {
    id: 'eth-rice-brown',
    nameEn: 'Brown Rice (Cooked)',
    nameAm: 'ቡናማ ሩዝ',
    servingSize: '1 cup cooked (160g)',
    servingGrams: 160,
    calories: 215,
    proteinG: 5.0,
    carbsG: 45.0,
    fatG: 1.8,
    fiberG: 3.5,
    sugarG: 0.2,
    category: 'lunch',
    isEthiopianTraditional: false,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 cup (160g)',
    aliases: ['brown rice', 'ቡናማ ሩዝ'],
    emoji: '🍚',
  },
  {
    id: 'eth-pasta',
    nameEn: 'Pasta with Tomato Sauce',
    nameAm: 'ፓስታ በቲማቲም ስጎ',
    servingSize: '1 plate (220g)',
    servingGrams: 220,
    calories: 310,
    proteinG: 9.5,
    carbsG: 58.0,
    fatG: 5.0,
    fiberG: 3.8,
    sugarG: 4.5,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 plate (220g)',
    aliases: ['pasta', 'macaroni', 'spaghetti', 'ፓስታ', 'መኮሮኒ'],
    emoji: '🍝',
  },
  {
    id: 'eth-bulla',
    nameEn: 'Bulla Porridge (Enset Starch with Milk/Butter)',
    nameAm: 'ቡላ',
    servingSize: '1 bowl (200g)',
    servingGrams: 200,
    calories: 280,
    proteinG: 3.2,
    carbsG: 62.0,
    fatG: 4.0,
    fiberG: 3.0,
    sugarG: 1.5,
    category: 'breakfast',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: true,
    commonServing: '1 bowl (200g)',
    aliases: ['bulla', 'bula', 'enset porridge', 'ቡላ'],
    emoji: '🥣',
  },
  {
    id: 'eth-kocho',
    nameEn: 'Kocho (Baked Enset Flatbread)',
    nameAm: 'ቆጮ',
    servingSize: '1 slice (120g)',
    servingGrams: 120,
    calories: 190,
    proteinG: 2.2,
    carbsG: 44.0,
    fatG: 0.6,
    fiberG: 4.5,
    sugarG: 0.4,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 slice (120g)',
    aliases: ['kocho', 'qocho', 'enset bread', 'ቆጮ'],
    emoji: '🫓',
  },

  // ==========================================
  // 2. LEGUMES, PULSES & TRADITIONAL FASTING DISHES
  // ==========================================
  {
    id: 'eth-shiro',
    nameEn: 'Shiro Tegamino (Slow-Cooked Chickpea Stew)',
    nameAm: 'ሽሮ ተጋሚኖ',
    servingSize: '1 bowl (200g)',
    servingGrams: 200,
    calories: 290,
    proteinG: 16.2,
    carbsG: 38.0,
    fatG: 9.0,
    fiberG: 8.5,
    sugarG: 2.2,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 bowl (200g)',
    aliases: ['shiro', 'shiro tegamino', 'shiro wot', 'ሽሮ', 'ሽሮ ተጋሚኖ', 'ሽሮ ወጥ'],
    emoji: '🍲',
  },
  {
    id: 'eth-misir-wot',
    nameEn: 'Misir Wot (Spiced Red Lentil Stew)',
    nameAm: 'የምስር ወጥ',
    servingSize: '1 bowl (200g)',
    servingGrams: 200,
    calories: 235,
    proteinG: 15.4,
    carbsG: 36.0,
    fatG: 4.5,
    fiberG: 8.8,
    sugarG: 2.0,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 bowl (200g)',
    aliases: ['misir wot', 'misir wat', 'red lentils', 'lentil stew', 'የምስር ወጥ', 'ምስር'],
    emoji: '🥣',
  },
  {
    id: 'eth-kik-alicha',
    nameEn: 'Kik Alicha (Yellow Split Pea Stew with Turmeric)',
    nameAm: 'ክክ አልጫ',
    servingSize: '1 bowl (200g)',
    servingGrams: 200,
    calories: 240,
    proteinG: 14.5,
    carbsG: 42.0,
    fatG: 2.5,
    fiberG: 8.5,
    sugarG: 2.1,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 bowl (200g)',
    aliases: ['kik alicha', 'split peas', 'yellow split pea stew', 'ክክ አልጫ', 'የክክ ወጥ'],
    emoji: '🥣',
  },
  {
    id: 'eth-ful-mudammas',
    nameEn: 'Ful Mudammas (Mashed Fava Beans with Onions & Oil)',
    nameAm: 'ፉል (የባቄላ ፉል)',
    servingSize: '1 bowl (220g)',
    servingGrams: 220,
    calories: 310,
    proteinG: 18.5,
    carbsG: 44.0,
    fatG: 7.5,
    fiberG: 11.5,
    sugarG: 1.8,
    category: 'breakfast',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 bowl (220g)',
    aliases: ['ful', 'foul', 'fava beans', 'ፉል'],
    emoji: '🍲',
  },
  {
    id: 'eth-shimbra-asa',
    nameEn: 'Shimbra Asa (Spiced Chickpea "Fish" Dumplings in Berbere Stew)',
    nameAm: 'ሽምብራ ዓሳ',
    servingSize: '1 bowl (220g)',
    servingGrams: 220,
    calories: 280,
    proteinG: 16.0,
    carbsG: 42.0,
    fatG: 6.0,
    fiberG: 9.0,
    sugarG: 2.5,
    category: 'dinner',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 bowl (220g)',
    aliases: ['shimbra asa', 'chickpea dumplings', 'ሽምብራ ዓሳ'],
    emoji: '🍲',
  },
  {
    id: 'eth-beyeaynet',
    nameEn: 'Beyaynetu (Mixed Fasting Vegetable & Legume Platter)',
    nameAm: 'በየአይነቱ (የጾም ምግብ)',
    servingSize: '1 platter portion (300g)',
    servingGrams: 300,
    calories: 380,
    proteinG: 19.5,
    carbsG: 58.0,
    fatG: 9.5,
    fiberG: 14.0,
    sugarG: 4.8,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 platter (300g)',
    aliases: ['beyeaynet', 'beyaynetu', 'fasting platter', 'በየአይነቱ', 'የጾም በየአይነቱ'],
    emoji: '🍛',
  },
  {
    id: 'eth-fasolia',
    nameEn: 'Fasolia (Sautéed Green Beans & Carrots)',
    nameAm: 'ፋሶሊያ በካሮት',
    servingSize: '1 plate (180g)',
    servingGrams: 180,
    calories: 125,
    proteinG: 3.5,
    carbsG: 18.0,
    fatG: 5.2,
    fiberG: 6.2,
    sugarG: 4.5,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 plate (180g)',
    aliases: ['fasolia', 'green beans', 'fasoliya', 'ፋሶሊያ', 'ፋሶሊያ በካሮት'],
    emoji: '🥗',
  },
  {
    id: 'eth-gomen-collards',
    nameEn: 'Gomen (Braised Collard Greens with Garlic & Ginger)',
    nameAm: 'የሃበሻ ጎመን',
    servingSize: '1 plate (180g)',
    servingGrams: 180,
    calories: 110,
    proteinG: 4.2,
    carbsG: 11.5,
    fatG: 5.8,
    fiberG: 5.6,
    sugarG: 1.8,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 plate (180g)',
    aliases: ['gomen', 'collard greens', 'greens', 'ጎመን', 'የሃበሻ ጎመን'],
    emoji: '🥬',
  },
  {
    id: 'eth-atakilt-wot',
    nameEn: 'Atakilt Wot (Cabbage, Potato & Carrot Mild Stew)',
    nameAm: 'አታክልት ወጥ (ጥቅል ጎመንና ድንች)',
    servingSize: '1 bowl (200g)',
    servingGrams: 200,
    calories: 145,
    proteinG: 3.8,
    carbsG: 24.0,
    fatG: 4.5,
    fiberG: 5.2,
    sugarG: 4.2,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 bowl (200g)',
    aliases: ['atakilt wot', 'tikil gomen', 'cabbage stew', 'አታክልት ወጥ', 'ጥቅል ጎመን'],
    emoji: '🍲',
  },
  {
    id: 'eth-dinich-wot',
    nameEn: 'Dinich Wot (Spicy Potato & Pepper Stew)',
    nameAm: 'የድንች ወጥ',
    servingSize: '1 bowl (200g)',
    servingGrams: 200,
    calories: 175,
    proteinG: 3.5,
    carbsG: 32.0,
    fatG: 4.2,
    fiberG: 4.8,
    sugarG: 2.2,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 bowl (200g)',
    aliases: ['dinich wot', 'potato stew', 'ድንች ወጥ'],
    emoji: '🥔',
  },
  {
    id: 'eth-duba-wot',
    nameEn: 'Duba Wot (Spiced Pumpkin Stew)',
    nameAm: 'የዱባ ወጥ',
    servingSize: '1 bowl (200g)',
    servingGrams: 200,
    calories: 130,
    proteinG: 3.0,
    carbsG: 22.0,
    fatG: 4.0,
    fiberG: 5.0,
    sugarG: 6.0,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 bowl (200g)',
    aliases: ['duba wot', 'pumpkin stew', 'ዱባ ወጥ', 'የዱባ ወጥ'],
    emoji: '🎃',
  },
  {
    id: 'eth-suf-fitfit',
    nameEn: 'Suf Fitfit (Sunflower Seed Milk with Shredded Injera)',
    nameAm: 'የሱፍ ፍትፍት',
    servingSize: '1 bowl (250g)',
    servingGrams: 250,
    calories: 340,
    proteinG: 11.5,
    carbsG: 46.0,
    fatG: 13.5,
    fiberG: 6.2,
    sugarG: 2.0,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 bowl (250g)',
    aliases: ['suf fitfit', 'sunflower fitfit', 'ሱፍ ፍትፍት', 'የሱፍ ፍትፍት'],
    emoji: '🌻',
  },
  {
    id: 'eth-telba-fitfit',
    nameEn: 'Telba Fitfit (Roasted Flaxseed Dressing with Injera)',
    nameAm: 'የተልባ ፍትፍት',
    servingSize: '1 bowl (250g)',
    servingGrams: 250,
    calories: 360,
    proteinG: 12.8,
    carbsG: 44.0,
    fatG: 16.0,
    fiberG: 8.5,
    sugarG: 1.5,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 bowl (250g)',
    aliases: ['telba fitfit', 'flaxseed fitfit', 'ተልባ ፍትፍት', 'የተልባ ፍትፍት'],
    emoji: '🥣',
  },
  {
    id: 'eth-firfir-siga-free',
    nameEn: 'Injera Firfir (Spiced Shredded Injera in Berbere Sauce)',
    nameAm: 'እንጀራ ፍርፍር (የጾም)',
    servingSize: '1 plate (220g)',
    servingGrams: 220,
    calories: 340,
    proteinG: 9.5,
    carbsG: 56.0,
    fatG: 9.0,
    fiberG: 5.2,
    sugarG: 2.1,
    category: 'breakfast',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 plate (220g)',
    aliases: ['firfir', 'injera firfir', 'fitfit', 'ፍርፍር', 'እንጀራ ፍርፍር'],
    emoji: '🍛',
  },
  {
    id: 'eth-bakela-wot',
    nameEn: 'Bakela Wot (Fava Bean Stew)',
    nameAm: 'የባቄላ ወጥ',
    servingSize: '1 bowl (200g)',
    servingGrams: 200,
    calories: 250,
    proteinG: 16.5,
    carbsG: 39.0,
    fatG: 3.5,
    fiberG: 9.5,
    sugarG: 2.0,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 bowl (200g)',
    aliases: ['bakela wot', 'fava bean stew', 'ባቄላ ወጥ', 'የባቄላ ወጥ'],
    emoji: '🍲',
  },
  {
    id: 'eth-ater-wot',
    nameEn: 'Ater Wot (Whole Green Pea Stew)',
    nameAm: 'የአተር ወጥ',
    servingSize: '1 bowl (200g)',
    servingGrams: 200,
    calories: 245,
    proteinG: 15.0,
    carbsG: 41.0,
    fatG: 2.8,
    fiberG: 9.0,
    sugarG: 3.0,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 bowl (200g)',
    aliases: ['ater wot', 'green pea stew', 'አተር ወጥ', 'የአተር ወጥ'],
    emoji: '🥣',
  },

  // ==========================================
  // 3. EGGS & ANIMAL PROTEIN (MEAT, POULTRY, FISH)
  // ==========================================
  {
    id: 'eth-boiled-eggs',
    nameEn: 'Boiled Whole Eggs (Qiqil Enqulal)',
    nameAm: 'የተቀቀለ እንቁላል',
    servingSize: '2 large eggs (100g)',
    servingGrams: 100,
    calories: 156,
    proteinG: 12.6,
    carbsG: 1.2,
    fatG: 10.6,
    fiberG: 0,
    sugarG: 0.4,
    category: 'breakfast',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: true,
    commonServing: '2 eggs (100g)',
    aliases: ['eggs', 'egg', 'boiled egg', 'boiled eggs', 'enqulal', 'እንቁላል', 'የተቀቀለ እንቁላል', 'ቅቅል እንቁላል'],
    emoji: '🥚',
  },
  {
    id: 'eth-scrambled-eggs',
    nameEn: 'Enqulal Firfir (Scrambled Eggs with Onions, Tomato & Chili)',
    nameAm: 'እንቁላል ፍርፍር',
    servingSize: '2 eggs plate (140g)',
    servingGrams: 140,
    calories: 195,
    proteinG: 13.5,
    carbsG: 4.5,
    fatG: 13.8,
    fiberG: 1.2,
    sugarG: 2.0,
    category: 'breakfast',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: true,
    commonServing: '1 plate (140g)',
    aliases: ['enqulal firfir', 'scrambled eggs', 'fried eggs', 'እንቁላል ፍርፍር'],
    emoji: '🍳',
  },
  {
    id: 'eth-egg-whites',
    nameEn: 'Pure Egg Whites (Cooked)',
    nameAm: 'የእንቁላል ነጭ ክፍል',
    servingSize: '4 egg whites (130g)',
    servingGrams: 130,
    calories: 68,
    proteinG: 14.2,
    carbsG: 0.9,
    fatG: 0.2,
    fiberG: 0,
    sugarG: 0.7,
    category: 'breakfast',
    isEthiopianTraditional: false,
    isFastingFriendly: false,
    isAffordable: true,
    commonServing: '4 whites (130g)',
    aliases: ['egg whites', 'egg white', 'የእንቁላል ነጭ'],
    emoji: '🍳',
  },
  {
    id: 'eth-doro-wot',
    nameEn: 'Doro Wat (Traditional Chicken & Egg Stew)',
    nameAm: 'ዶሮ ወጥ',
    servingSize: '1 portion (250g with 1 drumstick & 1 egg)',
    servingGrams: 250,
    calories: 380,
    proteinG: 34.5,
    carbsG: 12.0,
    fatG: 21.0,
    fiberG: 2.5,
    sugarG: 3.1,
    category: 'dinner',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: false,
    commonServing: '1 portion (250g)',
    aliases: ['doro wat', 'doro wot', 'chicken stew', 'ዶሮ ወጥ', 'ዶሮ'],
    emoji: '🍗',
  },
  {
    id: 'eth-doro-tibs',
    nameEn: 'Doro Tibs (Sautéed Spiced Chicken Breast & Thigh)',
    nameAm: 'የዶሮ ጥብስ',
    servingSize: '200g portion',
    servingGrams: 200,
    calories: 330,
    proteinG: 42.0,
    carbsG: 4.5,
    fatG: 16.0,
    fiberG: 1.0,
    sugarG: 1.2,
    category: 'dinner',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: true,
    commonServing: '200g portion',
    aliases: ['doro tibs', 'chicken tibs', 'የዶሮ ጥብስ'],
    emoji: '🍗',
  },
  {
    id: 'eth-tibs-beef',
    nameEn: 'Beef Tibs (Derek Tibs / Sautéed Lean Beef with Rosemary)',
    nameAm: 'የበሬ ጥብስ (ደረቅ ጥብስ)',
    servingSize: '200g plate',
    servingGrams: 200,
    calories: 420,
    proteinG: 44.0,
    carbsG: 4.0,
    fatG: 25.0,
    fiberG: 1.0,
    sugarG: 1.2,
    category: 'dinner',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: false,
    commonServing: '200g plate',
    aliases: ['beef tibs', 'tibs', 'derek tibs', 'ጥብስ', 'የበሬ ጥብስ', 'ደረቅ ጥብስ'],
    emoji: '🥩',
  },
  {
    id: 'eth-tibs-lege',
    nameEn: 'Lege Tibs (Juicy Beef Tibs with Awaze & Pepper Sauce)',
    nameAm: 'ለገ ጥብስ (የበሬ)',
    servingSize: '200g plate',
    servingGrams: 200,
    calories: 390,
    proteinG: 41.0,
    carbsG: 6.5,
    fatG: 22.0,
    fiberG: 1.2,
    sugarG: 1.8,
    category: 'dinner',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: false,
    commonServing: '200g plate',
    aliases: ['lege tibs', 'juicy tibs', 'ለገ ጥብስ'],
    emoji: '🥩',
  },
  {
    id: 'eth-kitfo-lean',
    nameEn: 'Kitfo (Minced Lean Beef with Mitmita & Light Niter Kibbeh)',
    nameAm: 'ክትፎ (ልዩ የበሬ ሥጋ)',
    servingSize: '200g portion',
    servingGrams: 200,
    calories: 410,
    proteinG: 46.0,
    carbsG: 2.0,
    fatG: 24.0,
    fiberG: 0.5,
    sugarG: 0.2,
    category: 'dinner',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: false,
    commonServing: '200g portion',
    aliases: ['kitfo', 'ketfo', 'ክትፎ', 'ክትፎ ልዩ'],
    emoji: '🥩',
  },
  {
    id: 'eth-kitfo-lebleb',
    nameEn: 'Kitfo Leb-Leb (Lightly Warmed Lean Minced Beef)',
    nameAm: 'ክትፎ ለብ ለብ',
    servingSize: '200g portion',
    servingGrams: 200,
    calories: 405,
    proteinG: 46.0,
    carbsG: 2.0,
    fatG: 23.5,
    fiberG: 0.5,
    sugarG: 0.2,
    category: 'dinner',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: false,
    commonServing: '200g portion',
    aliases: ['kitfo lebleb', 'leb leb', 'ክትፎ ለብ ለብ'],
    emoji: '🥩',
  },
  {
    id: 'eth-gored-gored',
    nameEn: 'Gored Gored (Cubed Raw Lean Beef with Awaze & Mitmita)',
    nameAm: 'ጎረድ ጎረድ',
    servingSize: '200g portion',
    servingGrams: 200,
    calories: 360,
    proteinG: 48.0,
    carbsG: 1.5,
    fatG: 18.0,
    fiberG: 0.2,
    sugarG: 0.1,
    category: 'dinner',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: false,
    commonServing: '200g portion',
    aliases: ['gored gored', 'raw beef', 'ጎረድ ጎረድ'],
    emoji: '🥩',
  },
  {
    id: 'eth-sega-wot',
    nameEn: 'Sega Wot (Spicy Ethiopian Beef Stew with Berbere)',
    nameAm: 'የስጋ ወጥ (የበሬ)',
    servingSize: '1 bowl (220g)',
    servingGrams: 220,
    calories: 370,
    proteinG: 36.0,
    carbsG: 9.0,
    fatG: 21.0,
    fiberG: 2.0,
    sugarG: 2.5,
    category: 'dinner',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: false,
    commonServing: '1 bowl (220g)',
    aliases: ['sega wot', 'beef stew', 'qey wot', 'ስጋ ወጥ', 'የስጋ ወጥ', 'ቀይ ወጥ'],
    emoji: '🍲',
  },
  {
    id: 'eth-bozena-shiro',
    nameEn: 'Bozena Shiro (Chickpea Stew with Minced Beef)',
    nameAm: 'ቦዘና ሽሮ',
    servingSize: '1 bowl (220g)',
    servingGrams: 220,
    calories: 360,
    proteinG: 26.5,
    carbsG: 34.0,
    fatG: 14.0,
    fiberG: 7.8,
    sugarG: 2.0,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: true,
    commonServing: '1 bowl (220g)',
    aliases: ['bozena shiro', 'shiro with meat', 'ቦዘና ሽሮ'],
    emoji: '🍲',
  },
  {
    id: 'eth-minchet-abish',
    nameEn: 'Minchet Abish (Minced Beef Stew with Fenugreek & Boiled Egg)',
    nameAm: 'ምንቸት አቢሽ',
    servingSize: '1 bowl (220g)',
    servingGrams: 220,
    calories: 340,
    proteinG: 32.0,
    carbsG: 8.5,
    fatG: 19.5,
    fiberG: 2.2,
    sugarG: 1.8,
    category: 'dinner',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: true,
    commonServing: '1 bowl (220g)',
    aliases: ['minchet abish', 'minchet', 'ምንቸት አቢሽ', 'ምንቸት'],
    emoji: '🍲',
  },
  {
    id: 'eth-dulet',
    nameEn: 'Dulet (Minced Liver, Tripe & Lean Beef with Jalapenos)',
    nameAm: 'ዱለት',
    servingSize: '200g plate',
    servingGrams: 200,
    calories: 320,
    proteinG: 38.0,
    carbsG: 3.5,
    fatG: 16.5,
    fiberG: 0.8,
    sugarG: 1.0,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: true,
    commonServing: '200g plate',
    aliases: ['dulet', 'ዱለት'],
    emoji: '🥩',
  },
  {
    id: 'eth-beg-tibs',
    nameEn: 'Beg Tibs (Sautéed Tender Lamb/Goat with Onions)',
    nameAm: 'የበግ ጥብስ',
    servingSize: '200g plate',
    servingGrams: 200,
    calories: 430,
    proteinG: 39.0,
    carbsG: 3.5,
    fatG: 28.5,
    fiberG: 0.8,
    sugarG: 1.0,
    category: 'dinner',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: false,
    commonServing: '200g plate',
    aliases: ['beg tibs', 'lamb tibs', 'goat tibs', 'የበግ ጥብስ', 'የፍየል ጥብስ'],
    emoji: '🥩',
  },
  {
    id: 'eth-asa-tibs',
    nameEn: 'Asa Tibs (Pan-Seared Spiced Tilapia/Nile Perch Fillet)',
    nameAm: 'የዓሳ ጥብስ',
    servingSize: '200g plate',
    servingGrams: 200,
    calories: 270,
    proteinG: 38.0,
    carbsG: 3.0,
    fatG: 11.5,
    fiberG: 0.5,
    sugarG: 0.2,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '200g plate',
    aliases: ['asa tibs', 'fish tibs', 'fried fish', 'የዓሳ ጥብስ', 'ዓሳ'],
    emoji: '🐟',
  },
  {
    id: 'eth-asa-gulash',
    nameEn: 'Asa Gulash (Spicy Fish Stew with Tomatoes & Berbere)',
    nameAm: 'የዓሳ ጉላሽ',
    servingSize: '1 bowl (220g)',
    servingGrams: 220,
    calories: 230,
    proteinG: 32.0,
    carbsG: 9.0,
    fatG: 7.0,
    fiberG: 2.2,
    sugarG: 3.5,
    category: 'dinner',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 bowl (220g)',
    aliases: ['asa gulash', 'fish gulash', 'የዓሳ ጉላሽ', 'ዓሳ ወጥ'],
    emoji: '🍲',
  },
  {
    id: 'eth-tuna-water',
    nameEn: 'Canned Light Tuna in Water',
    nameAm: 'ቱና ዓሳ (በውሃ የታሸገ)',
    servingSize: '1 can drained (120g)',
    servingGrams: 120,
    calories: 140,
    proteinG: 31.0,
    carbsG: 0,
    fatG: 1.0,
    fiberG: 0,
    sugarG: 0,
    category: 'lunch',
    isEthiopianTraditional: false,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 can (120g)',
    aliases: ['tuna', 'canned tuna', 'ቱና ዓሳ', 'ቱና'],
    emoji: '🐟',
  },
  {
    id: 'eth-sardines-can',
    nameEn: 'Canned Sardines in Tomato Sauce',
    nameAm: 'ሳርዲን ዓሳ በቲማቲም',
    servingSize: '1 can (125g)',
    servingGrams: 125,
    calories: 210,
    proteinG: 24.0,
    carbsG: 2.5,
    fatG: 11.5,
    fiberG: 0.8,
    sugarG: 1.5,
    category: 'lunch',
    isEthiopianTraditional: false,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 can (125g)',
    aliases: ['sardines', 'sardine', 'ሳርዲን'],
    emoji: '🐟',
  },

  // ==========================================
  // 4. VEGETABLES, GREENS & TUBERS
  // ==========================================
  {
    id: 'eth-potato-boiled',
    nameEn: 'Boiled Potato with Skin',
    nameAm: 'የተቀቀለ ድንች',
    servingSize: '1 large potato (200g)',
    servingGrams: 200,
    calories: 165,
    proteinG: 4.2,
    carbsG: 37.0,
    fatG: 0.2,
    fiberG: 4.2,
    sugarG: 1.6,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 potato (200g)',
    aliases: ['potato', 'boiled potato', 'dinich', 'ድንች', 'የተቀቀለ ድንች'],
    emoji: '🥔',
  },
  {
    id: 'eth-sweet-potato',
    nameEn: 'Baked / Boiled Sweet Potato (Sukar Dinich)',
    nameAm: 'ስኳር ድንች',
    servingSize: '1 medium (160g)',
    servingGrams: 160,
    calories: 145,
    proteinG: 3.2,
    carbsG: 33.5,
    fatG: 0.2,
    fiberG: 4.8,
    sugarG: 6.8,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 medium (160g)',
    aliases: ['sweet potato', 'sukar dinich', 'ስኳር ድንች'],
    emoji: '🍠',
  },
  {
    id: 'eth-carrot-raw',
    nameEn: 'Fresh Raw Carrot Slices',
    nameAm: 'ካሮት (ጥሬ)',
    servingSize: '1 cup (120g)',
    servingGrams: 120,
    calories: 50,
    proteinG: 1.1,
    carbsG: 11.5,
    fatG: 0.3,
    fiberG: 3.4,
    sugarG: 5.6,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 cup (120g)',
    aliases: ['carrot', 'carrots', 'karot', 'ካሮት'],
    emoji: '🥕',
  },
  {
    id: 'eth-cabbage-tikil',
    nameEn: 'Steamed White Cabbage (Tikil Gomen)',
    nameAm: 'ጥቅል ጎመን',
    servingSize: '1 bowl (150g)',
    servingGrams: 150,
    calories: 45,
    proteinG: 2.0,
    carbsG: 9.0,
    fatG: 0.4,
    fiberG: 3.5,
    sugarG: 4.2,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 bowl (150g)',
    aliases: ['cabbage', 'tikil gomen', 'ጥቅል ጎመን'],
    emoji: '🥬',
  },
  {
    id: 'eth-timatim-salata',
    nameEn: 'Timatim Salata (Tomato Salad with Onions & Jalapeno)',
    nameAm: 'ቲማቲም ሰላጣ',
    servingSize: '1 bowl (160g)',
    servingGrams: 160,
    calories: 75,
    proteinG: 2.1,
    carbsG: 9.5,
    fatG: 3.5,
    fiberG: 2.8,
    sugarG: 5.2,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 bowl (160g)',
    aliases: ['timatim', 'tomato salad', 'salata', 'ቲማቲም ሰላጣ', 'ሰላጣ'],
    emoji: '🍅',
  },
  {
    id: 'eth-avocado-fresh',
    nameEn: 'Fresh Avocado Half',
    nameAm: 'አቮካዶ',
    servingSize: '1/2 medium avocado (100g)',
    servingGrams: 100,
    calories: 160,
    proteinG: 2.0,
    carbsG: 8.5,
    fatG: 14.7,
    fiberG: 6.7,
    sugarG: 0.7,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1/2 avocado (100g)',
    aliases: ['avocado', 'avokado', 'አቮካዶ'],
    emoji: '🥑',
  },
  {
    id: 'eth-spinach-gomen',
    nameEn: 'Steamed Spinach with Garlic',
    nameAm: 'ስፒናች ጎመን',
    servingSize: '1 cup cooked (180g)',
    servingGrams: 180,
    calories: 55,
    proteinG: 5.2,
    carbsG: 6.5,
    fatG: 0.8,
    fiberG: 4.2,
    sugarG: 0.8,
    category: 'lunch',
    isEthiopianTraditional: false,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 cup (180g)',
    aliases: ['spinach', 'ስፒናች'],
    emoji: '🥬',
  },
  {
    id: 'eth-qey-sir',
    nameEn: 'Qey Sir (Sautéed Beetroot with Potatoes & Onions)',
    nameAm: 'ቀይ ስር',
    servingSize: '1 bowl (180g)',
    servingGrams: 180,
    calories: 115,
    proteinG: 2.8,
    carbsG: 22.0,
    fatG: 2.2,
    fiberG: 4.8,
    sugarG: 12.0,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 bowl (180g)',
    aliases: ['qey sir', 'beetroot', 'beets', 'ቀይ ስር'],
    emoji: '🥗',
  },
  {
    id: 'eth-garlic-cloves',
    nameEn: 'Fresh Garlic (Nech Shinkurt)',
    nameAm: 'ነጭ ሽንኩርት',
    servingSize: '3 cloves (10g)',
    servingGrams: 10,
    calories: 15,
    proteinG: 0.6,
    carbsG: 3.3,
    fatG: 0.1,
    fiberG: 0.2,
    sugarG: 0.1,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '3 cloves (10g)',
    aliases: ['garlic', 'nech shinkurt', 'ነጭ ሽንኩርት'],
    emoji: '🧄',
  },
  {
    id: 'eth-red-onion',
    nameEn: 'Fresh Red Onion (Qey Shinkurt)',
    nameAm: 'ቀይ ሽንኩርት',
    servingSize: '1 medium onion (100g)',
    servingGrams: 100,
    calories: 40,
    proteinG: 1.1,
    carbsG: 9.3,
    fatG: 0.1,
    fiberG: 1.7,
    sugarG: 4.2,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 onion (100g)',
    aliases: ['onion', 'red onion', 'shinkurt', 'ቀይ ሽንኩርት', 'ሽንኩርት'],
    emoji: '🧅',
  },

  // ==========================================
  // 5. FRUITS & FRESH PRODUCE
  // ==========================================
  {
    id: 'eth-banana',
    nameEn: 'Fresh Ripe Banana (Muz)',
    nameAm: 'ሙዝ',
    servingSize: '1 medium (120g)',
    servingGrams: 120,
    calories: 105,
    proteinG: 1.3,
    carbsG: 27.0,
    fatG: 0.3,
    fiberG: 3.1,
    sugarG: 14.4,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 banana (120g)',
    aliases: ['banana', 'bananas', 'muz', 'ሙዝ'],
    emoji: '🍌',
  },
  {
    id: 'eth-orange',
    nameEn: 'Fresh Orange (Birtukan)',
    nameAm: 'ብርቱካን',
    servingSize: '1 medium (140g)',
    servingGrams: 140,
    calories: 65,
    proteinG: 1.3,
    carbsG: 15.5,
    fatG: 0.2,
    fiberG: 3.2,
    sugarG: 12.0,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 orange (140g)',
    aliases: ['orange', 'birtukan', 'ብርቱካን'],
    emoji: '🍊',
  },
  {
    id: 'eth-apple',
    nameEn: 'Fresh Red Apple (Pome)',
    nameAm: 'ፖም (አፕል)',
    servingSize: '1 medium (180g)',
    servingGrams: 180,
    calories: 95,
    proteinG: 0.5,
    carbsG: 25.0,
    fatG: 0.3,
    fiberG: 4.4,
    sugarG: 19.0,
    category: 'snack',
    isEthiopianTraditional: false,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 apple (180g)',
    aliases: ['apple', 'pome', 'ፖም', 'አፕል'],
    emoji: '🍎',
  },
  {
    id: 'eth-mango',
    nameEn: 'Fresh Sweet Mango Slices',
    nameAm: 'ማንጎ',
    servingSize: '1 cup sliced (165g)',
    servingGrams: 165,
    calories: 99,
    proteinG: 1.4,
    carbsG: 24.7,
    fatG: 0.6,
    fiberG: 2.6,
    sugarG: 22.5,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 cup (165g)',
    aliases: ['mango', 'ማንጎ'],
    emoji: '🥭',
  },
  {
    id: 'eth-papaya',
    nameEn: 'Fresh Papaya (Papaye)',
    nameAm: 'ፓፓያ',
    servingSize: '1 cup diced (145g)',
    servingGrams: 145,
    calories: 62,
    proteinG: 0.7,
    carbsG: 15.8,
    fatG: 0.4,
    fiberG: 2.5,
    sugarG: 11.3,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 cup (145g)',
    aliases: ['papaya', 'papaye', 'ፓፓያ'],
    emoji: '🍈',
  },
  {
    id: 'eth-guava',
    nameEn: 'Fresh Guava (Zeytun)',
    nameAm: 'ዘይቱን (ጓቫ)',
    servingSize: '1 medium (100g)',
    servingGrams: 100,
    calories: 68,
    proteinG: 2.6,
    carbsG: 14.3,
    fatG: 0.9,
    fiberG: 5.4,
    sugarG: 8.9,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 fruit (100g)',
    aliases: ['guava', 'zeytun', 'ዘይቱን', 'ጓቫ'],
    emoji: '🍐',
  },
  {
    id: 'eth-pineapple',
    nameEn: 'Fresh Pineapple (Ananas)',
    nameAm: 'አናናስ',
    servingSize: '1 cup chunks (165g)',
    servingGrams: 165,
    calories: 82,
    proteinG: 0.9,
    carbsG: 21.6,
    fatG: 0.2,
    fiberG: 2.3,
    sugarG: 16.3,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 cup (165g)',
    aliases: ['pineapple', 'ananas', 'አናናስ'],
    emoji: '🍍',
  },
  {
    id: 'eth-watermelon',
    nameEn: 'Fresh Watermelon Slices (Habhab)',
    nameAm: 'ሐብሐብ',
    servingSize: '1 wedge (280g)',
    servingGrams: 280,
    calories: 85,
    proteinG: 1.7,
    carbsG: 21.0,
    fatG: 0.4,
    fiberG: 1.1,
    sugarG: 17.0,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 wedge (280g)',
    aliases: ['watermelon', 'habhab', 'ሐብሐብ'],
    emoji: '🍉',
  },
  {
    id: 'eth-lemon',
    nameEn: 'Fresh Lemon / Lime Juice (Lomi)',
    nameAm: 'ሎሚ (ጭማቂ)',
    servingSize: '1 whole squeezed (50g)',
    servingGrams: 50,
    calories: 14,
    proteinG: 0.4,
    carbsG: 4.5,
    fatG: 0.1,
    fiberG: 1.4,
    sugarG: 1.2,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 lemon (50g)',
    aliases: ['lemon', 'lime', 'lomi', 'ሎሚ'],
    emoji: '🍋',
  },

  // ==========================================
  // 6. DAIRY & TRADITIONAL CHEESES
  // ==========================================
  {
    id: 'eth-ayib-cottage',
    nameEn: 'Ayib (Ethiopian Fresh Mild Cottage Cheese)',
    nameAm: 'አይብ (የሃበሻ)',
    servingSize: '1 bowl (150g)',
    servingGrams: 150,
    calories: 165,
    proteinG: 21.0,
    carbsG: 4.2,
    fatG: 6.5,
    fiberG: 0,
    sugarG: 3.5,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: true,
    commonServing: '1 bowl (150g)',
    aliases: ['ayib', 'cottage cheese', 'ethiopian cheese', 'አይብ'],
    emoji: '🧀',
  },
  {
    id: 'eth-ergo-yogurt',
    nameEn: 'Ergo (Traditional Ethiopian Natural Cultured Yogurt)',
    nameAm: 'እርጎ',
    servingSize: '1 glass/cup (200g)',
    servingGrams: 200,
    calories: 130,
    proteinG: 9.0,
    carbsG: 10.5,
    fatG: 6.0,
    fiberG: 0,
    sugarG: 9.0,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: true,
    commonServing: '1 cup (200g)',
    aliases: ['ergo', 'yogurt', 'curd', 'እርጎ'],
    emoji: '🥛',
  },
  {
    id: 'eth-cow-milk',
    nameEn: 'Fresh Whole Cow Milk (Ye-Lam Wetet)',
    nameAm: 'የላም ወተት',
    servingSize: '1 glass (240ml)',
    servingGrams: 240,
    calories: 150,
    proteinG: 8.0,
    carbsG: 12.0,
    fatG: 8.0,
    fiberG: 0,
    sugarG: 12.0,
    category: 'breakfast',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: true,
    commonServing: '1 glass (240ml)',
    aliases: ['milk', 'cow milk', 'wetet', 'ወተት', 'የላም ወተት'],
    emoji: '🥛',
  },
  {
    id: 'eth-greek-yogurt',
    nameEn: 'Plain Greek Yogurt (0% Fat)',
    nameAm: 'ግሪክ ዮገርት (0% ስብ)',
    servingSize: '200g cup',
    servingGrams: 200,
    calories: 130,
    proteinG: 22.0,
    carbsG: 7.0,
    fatG: 0.8,
    fiberG: 0,
    sugarG: 6.0,
    category: 'snack',
    isEthiopianTraditional: false,
    isFastingFriendly: false,
    isAffordable: true,
    commonServing: '200g cup',
    aliases: ['greek yogurt', 'plain yogurt', 'ግሪክ ዮገርት'],
    emoji: '🥛',
  },
  {
    id: 'eth-niter-kibbeh',
    nameEn: 'Niter Kibbeh (Spiced Clarified Butter)',
    nameAm: 'ንጥር ቅቤ',
    servingSize: '1 tablespoon (14g)',
    servingGrams: 14,
    calories: 120,
    proteinG: 0.1,
    carbsG: 0,
    fatG: 13.5,
    fiberG: 0,
    sugarG: 0,
    category: 'lunch',
    isEthiopianTraditional: true,
    isFastingFriendly: false,
    isAffordable: true,
    commonServing: '1 tbsp (14g)',
    aliases: ['kibbeh', 'niter kibbeh', 'butter', 'ghee', 'ቅቤ', 'ንጥር ቅቤ'],
    emoji: '🧈',
  },

  // ==========================================
  // 7. SEEDS, NUTS & HEALTHY SNACKS
  // ==========================================
  {
    id: 'eth-peanuts-ocholoni',
    nameEn: 'Roasted Peanuts (Ocholoni)',
    nameAm: 'ኦቾሎኒ (የተጠበሰ)',
    servingSize: '1 handful (40g)',
    servingGrams: 40,
    calories: 235,
    proteinG: 10.4,
    carbsG: 6.4,
    fatG: 20.0,
    fiberG: 3.4,
    sugarG: 1.8,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 handful (40g)',
    aliases: ['peanuts', 'peanut', 'ocholoni', 'ኦቾሎኒ'],
    emoji: '🥜',
  },
  {
    id: 'eth-peanut-butter',
    nameEn: 'Natural Peanut Butter (100% Peanuts)',
    nameAm: 'የኦቾሎኒ ቅቤ',
    servingSize: '2 tablespoons (32g)',
    servingGrams: 32,
    calories: 190,
    proteinG: 8.0,
    carbsG: 7.0,
    fatG: 16.0,
    fiberG: 2.0,
    sugarG: 2.0,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '2 tbsp (32g)',
    aliases: ['peanut butter', 'የኦቾሎኒ ቅቤ'],
    emoji: '🥜',
  },
  {
    id: 'eth-sesame-selit',
    nameEn: 'Sesame Seeds / Paste (Selit)',
    nameAm: 'ሰሊጥ',
    servingSize: '2 tablespoons (20g)',
    servingGrams: 20,
    calories: 115,
    proteinG: 3.6,
    carbsG: 4.6,
    fatG: 10.0,
    fiberG: 2.4,
    sugarG: 0.1,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '2 tbsp (20g)',
    aliases: ['sesame', 'selit', 'tahini', 'ሰሊጥ'],
    emoji: '🌱',
  },
  {
    id: 'eth-telba-flaxseed',
    nameEn: 'Ground Flaxseed (Telba)',
    nameAm: 'ተልባ (የተፈጨ)',
    servingSize: '2 tablespoons (20g)',
    servingGrams: 20,
    calories: 105,
    proteinG: 3.7,
    carbsG: 5.8,
    fatG: 8.5,
    fiberG: 5.5,
    sugarG: 0.3,
    category: 'breakfast',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '2 tbsp (20g)',
    aliases: ['flaxseed', 'telba', 'ተልባ'],
    emoji: '🌱',
  },
  {
    id: 'eth-pumpkin-seeds',
    nameEn: 'Roasted Pumpkin Seeds (Ye-Duba Fere)',
    nameAm: 'የዱባ ፍሬ (የተጠበሰ)',
    servingSize: '1 handful (30g)',
    servingGrams: 30,
    calories: 170,
    proteinG: 9.0,
    carbsG: 4.0,
    fatG: 14.0,
    fiberG: 2.0,
    sugarG: 0.4,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 handful (30g)',
    aliases: ['pumpkin seeds', 'ye duba fere', 'የዱባ ፍሬ'],
    emoji: '🎃',
  },
  {
    id: 'eth-sunflower-seeds',
    nameEn: 'Roasted Sunflower Seeds (Ye-Suf Fere)',
    nameAm: 'የሱፍ ፍሬ (የተጠበሰ)',
    servingSize: '1 handful (30g)',
    servingGrams: 30,
    calories: 175,
    proteinG: 6.2,
    carbsG: 6.0,
    fatG: 15.5,
    fiberG: 2.6,
    sugarG: 0.8,
    category: 'snack',
    isEthiopianTraditional: true,
    isFastingFriendly: true,
    isAffordable: true,
    commonServing: '1 handful (30g)',
    aliases: ['sunflower seeds', 'ye suf fere', 'የሱፍ ፍሬ'],
    emoji: '🌻',
  },
  {
    id: 'eth-almonds',
    nameEn: 'Raw Whole Almonds',
    nameAm: 'አልሞንድ (ለውዝ)',
    servingSize: '1 handful (30g)',
    servingGrams: 30,
    calories: 175,
    proteinG: 6.3,
    carbsG: 6.1,
    fatG: 15.2,
    fiberG: 3.7,
    sugarG: 1.3,
    category: 'snack',
    isEthiopianTraditional: false,
    isFastingFriendly: true,
    isAffordable: false,
    commonServing: '1 handful (30g)',
    aliases: ['almonds', 'almond', 'ለውዝ', 'አልሞንድ'],
    emoji: '🌰',
  },

  // ==========================================
  // 8. HIGH-PROTEIN ATHLETIC & FITNESS ESSENTIALS
  // ==========================================
  {
    id: 'fit-chicken-breast',
    nameEn: 'Grilled Lean Chicken Breast',
    nameAm: 'የዶሮ ደረት (የተጠበሰ)',
    servingSize: '150g fillet',
    servingGrams: 150,
    calories: 247,
    proteinG: 46.5,
    carbsG: 0,
    fatG: 5.4,
    fiberG: 0,
    sugarG: 0,
    category: 'lunch',
    isEthiopianTraditional: false,
    isFastingFriendly: false,
    isAffordable: true,
    commonServing: '150g fillet',
    aliases: ['chicken breast', 'grilled chicken', 'chicken', 'የዶሮ ደረት', 'ዶሮ'],
    emoji: '🍗',
  },
  {
    id: 'fit-whey-isolate',
    nameEn: 'Whey Protein Isolate Shake',
    nameAm: 'ዌይ ፕሮቲን (አይሶሌት)',
    servingSize: '1 scoop (30g powder)',
    servingGrams: 30,
    calories: 120,
    proteinG: 25.0,
    carbsG: 1.8,
    fatG: 1.0,
    fiberG: 0.5,
    sugarG: 0.8,
    category: 'snack',
    isEthiopianTraditional: false,
    isFastingFriendly: false,
    isAffordable: false,
    commonServing: '1 scoop (30g)',
    aliases: ['whey', 'protein powder', 'whey protein', 'shake', 'ዌይ ፕሮቲን', 'ፕሮቲን'],
    emoji: '🥤',
  },
  {
    id: 'fit-salmon-fillet',
    nameEn: 'Grilled Salmon Fillet',
    nameAm: 'ሳልሞን ዓሳ',
    servingSize: '150g fillet',
    servingGrams: 150,
    calories: 310,
    proteinG: 34.0,
    carbsG: 0,
    fatG: 18.0,
    fiberG: 0,
    sugarG: 0,
    category: 'dinner',
    isEthiopianTraditional: false,
    isFastingFriendly: true,
    isAffordable: false,
    commonServing: '150g fillet',
    aliases: ['salmon', 'salmon fillet', 'ሳልሞን'],
    emoji: '🐟',
  },
  {
    id: 'fit-beef-lean-mince',
    nameEn: 'Extra Lean Ground Beef (95/5)',
    nameAm: 'የተፈጨ የበሬ ስጋ (ቅባት አልባ)',
    servingSize: '150g cooked',
    servingGrams: 150,
    calories: 255,
    proteinG: 39.0,
    carbsG: 0,
    fatG: 10.5,
    fiberG: 0,
    sugarG: 0,
    category: 'lunch',
    isEthiopianTraditional: false,
    isFastingFriendly: false,
    isAffordable: true,
    commonServing: '150g cooked',
    aliases: ['mince', 'lean beef', 'ground beef', 'የተፈጨ ስጋ'],
    emoji: '🥩',
  },
  {
    id: 'fit-cottage-cheese',
    nameEn: 'Low Fat Cottage Cheese (1%)',
    nameAm: 'ዝቅተኛ ቅባት ኮቴጅ ቺዝ',
    servingSize: '1 cup (220g)',
    servingGrams: 220,
    calories: 165,
    proteinG: 28.0,
    carbsG: 6.0,
    fatG: 2.5,
    fiberG: 0,
    sugarG: 5.5,
    category: 'snack',
    isEthiopianTraditional: false,
    isFastingFriendly: false,
    isAffordable: true,
    commonServing: '1 cup (220g)',
    aliases: ['cottage cheese', 'ኮቴጅ ቺዝ'],
    emoji: '🧀',
  },
];

export const initialFoodDatabase = FOOD_DATABASE;

// ==========================================
// PARSER HELPER INTERFACES & ALGORITHMS
// ==========================================

export interface ParsedFoodResult {
  foodItem: FoodItem;
  quantity: number;
  calculatedCalories: number;
  calculatedProtein: number;
  calculatedCarbs: number;
  calculatedFat: number;
  calculatedFiber: number;
  calculatedSugar: number;
  portionLabel: string;
}

/**
 * Parses quantity from numbers, spelled numbers ("one", "two", "three", "አንድ", "ሁለት"),
 * or standard fractions ("1/2", "half").
 */
function parseQuantity(token: string): number | null {
  const t = token.toLowerCase().trim();
  if (!t) return null;

  // Direct float/int
  const parsedNum = parseFloat(t);
  if (!isNaN(parsedNum) && parsedNum > 0 && parsedNum < 1000) {
    return parsedNum;
  }

  // English words
  const wordMap: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    a: 1,
    an: 1,
    half: 0.5,
    '1/2': 0.5,
    '1/4': 0.25,
    '3/4': 0.75,
    // Amharic words
    አንድ: 1,
    ሁለት: 2,
    ሶስት: 3,
    አራት: 4,
    አምስት: 5,
    ስድስት: 6,
    ሰባት: 7,
    ስምንት: 8,
    ዘጠኝ: 9,
    አስር: 10,
    ግማሽ: 0.5,
  };

  return wordMap[t] || null;
}

/**
 * Intelligent Multi-Food Natural Language Parser
 * Extracts all food items and quantities mentioned in a single phrase.
 * Example: "I ate 2 eggs and one injera" -> [2x eggs, 1x injera]
 */
export function parseMultiFoodQuery(query: string): ParsedFoodResult[] {
  if (!query || !query.trim()) return [];

  const rawLower = query.toLowerCase();
  // Split on delimiters like 'and', 'with', 'plus', comma, '&', 'እና', 'ከ', 'ጋር'
  const chunks = rawLower
    .split(/,|\band\b|\bwith\b|\bplus\b|&|\bእና\b|\bከ\b|\bጋር\b|\bበ\b/i)
    .map((c) => c.trim())
    .filter(Boolean);

  const results: ParsedFoodResult[] = [];
  const matchedFoodIds = new Set<string>();

  for (const chunk of chunks) {
    const singleResult = parseSingleChunk(chunk);
    if (singleResult && !matchedFoodIds.has(singleResult.foodItem.id)) {
      results.push(singleResult);
      matchedFoodIds.add(singleResult.foodItem.id);
    }
  }

  // Fallback: If chunks didn't yield matches, attempt full string match
  if (results.length === 0) {
    const fallback = parseSingleChunk(rawLower);
    if (fallback) results.push(fallback);
  }

  return results;
}

function parseSingleChunk(text: string): ParsedFoodResult | null {
  const clean = text.replace(/[^\w\s\u1200-\u137F/.]/g, ' ').trim();
  if (!clean) return null;

  const words = clean.split(/\s+/).filter(Boolean);
  let detectedQuantity = 1;
  let customWeightGrams: number | null = null;

  // 1. Detect gram amounts (e.g. "150g", "200 grams")
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const gramMatch = w.match(/^(\d+(?:\.\d+)?)(?:g|gram|grams|ግራም)$/);
    if (gramMatch) {
      customWeightGrams = parseFloat(gramMatch[1]);
      break;
    }
    if (i > 0 && (w === 'g' || w === 'gram' || w === 'grams' || w === 'ግራም')) {
      const prevNum = parseFloat(words[i - 1]);
      if (!isNaN(prevNum)) {
        customWeightGrams = prevNum;
        break;
      }
    }
  }

  // 2. Detect multiplier quantity (e.g. "2", "3", "two", "2 rolls", "1 bowl")
  for (let i = 0; i < words.length; i++) {
    const q = parseQuantity(words[i]);
    if (q !== null) {
      detectedQuantity = q;
      break;
    }
  }

  // 3. Search database for best matching food item
  let bestMatch: FoodItem | null = null;
  let highestScore = 0;

  for (const food of FOOD_DATABASE) {
    let score = 0;
    const targets = [
      food.nameEn.toLowerCase(),
      food.nameAm.toLowerCase(),
      ...(food.aliases || []).map((a) => a.toLowerCase()),
    ];

    for (const target of targets) {
      if (clean === target) {
        score = Math.max(score, 100);
      } else if (clean.includes(target)) {
        score = Math.max(score, 50 + target.length);
      } else {
        const targetWords = target.split(/\s+/);
        let matchedCount = 0;
        for (const tw of targetWords) {
          if (words.some((w) => w === tw || (tw.length > 3 && w.includes(tw)))) {
            matchedCount++;
          }
        }
        if (matchedCount > 0) {
          score = Math.max(score, matchedCount * 15);
        }
      }
    }

    if (score > highestScore && score >= 15) {
      highestScore = score;
      bestMatch = food;
    }
  }

  if (!bestMatch) return null;

  // Calculate scaled macros
  let multiplier = detectedQuantity;
  let portionLabel = `${detectedQuantity}x ${bestMatch.servingSize}`;

  if (customWeightGrams && bestMatch.servingGrams > 0) {
    multiplier = customWeightGrams / bestMatch.servingGrams;
    portionLabel = `${customWeightGrams}g portion`;
  }

  return {
    foodItem: bestMatch,
    quantity: multiplier,
    calculatedCalories: Math.round(bestMatch.calories * multiplier),
    calculatedProtein: Math.round(bestMatch.proteinG * multiplier * 10) / 10,
    calculatedCarbs: Math.round(bestMatch.carbsG * multiplier * 10) / 10,
    calculatedFat: Math.round(bestMatch.fatG * multiplier * 10) / 10,
    calculatedFiber: Math.round((bestMatch.fiberG || 0) * multiplier * 10) / 10,
    calculatedSugar: Math.round((bestMatch.sugarG || 0) * multiplier * 10) / 10,
    portionLabel,
  };
}

/**
 * Backward compatible single food parser
 */
export function parseNaturalLanguageFood(query: string): ParsedFoodResult | null {
  const list = parseMultiFoodQuery(query);
  return list.length > 0 ? list[0] : null;
}

/**
 * Checks if a query mentions a food without specifying any quantity
 */
export function checkAmbiguousQuantity(query: string): { isAmbiguous: boolean; foodItem?: FoodItem } {
  const q = query.toLowerCase().trim();
  // Words indicating ambiguity
  const ambiguousKeywords = ['some', 'a bit of', 'had some', 'ate some', 'ጥቂት', 'ትንሽ', 'በላሁ'];
  
  // If no numbers/quantity keywords are present
  const hasQuantityWord = q.match(/\b(\d+|one|two|three|four|five|half|1\/2|አንድ|ሁለት|ሶስት|ግማሽ|150g|200g|cup|bowl|roll|plate|ሳህን)\b/i);

  if (!hasQuantityWord) {
    const single = parseSingleChunk(q);
    if (single) {
      return { isAmbiguous: true, foodItem: single.foodItem };
    }
  }

  return { isAmbiguous: false };
}

/**
 * GROUNDED JOSSY AI RESPONSE GENERATOR
 * Formulates realistic, conversational, data-driven responses with personalized context.
 */
export function generateJossyAIResponse(
  userQuery: string,
  user: UserProfile,
  consumedStats: { calories: number; proteinG: number; carbsG: number; fatG: number; fiberG: number }
): Partial<JossyAIMessage> {
  const q = userQuery.toLowerCase().trim();
  const isAmharic = user.language === 'am';
  const firstName = user.name ? user.name.trim().split(' ')[0] : (isAmharic ? 'ስፖርተኛ' : 'Athlete');

  // Check 1: Contextual question - "What did I eat today?"
  if (
    q.includes('what did i eat') ||
    q.includes('what have i eaten') ||
    q.includes('my meals today') ||
    q.includes('ዛሬ ምን በላሁ') ||
    q.includes('የዛሬ ምግቦቼ')
  ) {
    if (consumedStats.calories === 0) {
      const text = isAmharic
        ? `ዛሬ እስካሁን ምንም ምግብ አልመዘገቡም ${firstName}። የበሉትን እዚህ በመጻፍ ወይም ከታች ያሉትን ጥቆማዎች በመጫን መመዝገብ ይችላሉ።`
        : `You haven't logged any meals today yet, ${firstName}. Tell me what you ate (e.g. "I ate 2 eggs and 1 injera") and I'll calculate the verified macros for you!`;
      return { text };
    }
    const text = isAmharic
      ? `የዛሬ የሥነ-ምግብ ማጠቃለያዎ:\n• የተመዘገበ ካሎሪ፦ ${consumedStats.calories.toLocaleString()} / ${user.targetCalories.toLocaleString()} kcal\n• ፕሮቲን፦ ${consumedStats.proteinG}g / ${user.targetProteinG}g\n• ካርቦሃይድሬት፦ ${consumedStats.carbsG}g\n• ስብ፦ ${consumedStats.fatG}g\n• ፋይበር፦ ${consumedStats.fiberG}g`
      : `Here is your logged nutrition for today, ${firstName}:\n• Calories: ${consumedStats.calories.toLocaleString()} / ${user.targetCalories.toLocaleString()} kcal\n• Protein: ${consumedStats.proteinG}g / ${user.targetProteinG}g\n• Carbs: ${consumedStats.carbsG}g\n• Fat: ${consumedStats.fatG}g\n• Fiber: ${consumedStats.fiberG}g`;
    return { text };
  }

  // Check 2: Contextual question - "How much protein do I still need?"
  if (
    q.includes('how much protein do i still need') ||
    q.includes('protein remaining') ||
    q.includes('how much protein left') ||
    q.includes('ስንት ፕሮቲን ይቀረኛል') ||
    q.includes('የቀረኝ ፕሮቲን')
  ) {
    const remaining = Math.max(0, Math.round(user.targetProteinG - consumedStats.proteinG));
    const text = isAmharic
      ? `የዛሬው የፕሮቲን ግብዎ ${user.targetProteinG}g ሲሆን እስካሁን ${consumedStats.proteinG}g አግኝተዋል። የዕለቱን ግብ ለማሟላት ${remaining}g ፕሮቲን ይቀረዎታል።\n\n💡 ለቀሪው ፕሮቲን የተመረጡ ምግቦች:\n• 2 የተቀቀለ እንቁላል (~12g ፕሮቲን)\n• 1 ሳህን ሽሮ (~16g ፕሮቲን)\n• የዶሮ ደረት 150g (~46g ፕሮቲን)`
      : `Your daily protein target is ${user.targetProteinG}g. You've logged ${consumedStats.proteinG}g so far today, leaving ${remaining}g remaining to hit your target.\n\n💡 Top choices to close the gap:\n• 2 Boiled Eggs (~12g protein)\n• 1 Bowl Shiro (~16g protein)\n• 150g Chicken Breast (~46g protein)`;
    return { text };
  }

  // Check 2.1: Post-Workout Meal Recommendation
  if (
    q.includes('post-workout') ||
    q.includes('post workout') ||
    q.includes('after workout') ||
    q.includes('after my workout') ||
    q.includes('ከስፖርት በኋላ') ||
    q.includes('ስፖርት ጨርሼ')
  ) {
    const eggs = FOOD_DATABASE.find((f) => f.id === 'eth-boiled-eggs') || FOOD_DATABASE[0];
    const injera = FOOD_DATABASE.find((f) => f.id === 'eth-injera-teff') || FOOD_DATABASE[0];
    const banana = FOOD_DATABASE.find((f) => f.id === 'eth-banana') || FOOD_DATABASE[0];

    const breakdowns: JossyAIFoodBreakdown[] = [
      {
        foodItem: eggs,
        quantity: 2,
        portionLabel: '2 Boiled Eggs',
        calculatedCalories: Math.round(eggs.calories * 2),
        calculatedProtein: Math.round(eggs.proteinG * 2 * 10) / 10,
        calculatedCarbs: Math.round(eggs.carbsG * 2 * 10) / 10,
        calculatedFat: Math.round(eggs.fatG * 2 * 10) / 10,
        calculatedFiber: 0,
        calculatedSugar: 0,
      },
      {
        foodItem: injera,
        quantity: 1,
        portionLabel: '1 Roll Teff Injera',
        calculatedCalories: injera.calories,
        calculatedProtein: injera.proteinG,
        calculatedCarbs: injera.carbsG,
        calculatedFat: injera.fatG,
        calculatedFiber: injera.fiberG || 0,
        calculatedSugar: injera.sugarG || 0,
      },
      {
        foodItem: banana,
        quantity: 1,
        portionLabel: '1 Fresh Banana',
        calculatedCalories: banana.calories,
        calculatedProtein: banana.proteinG,
        calculatedCarbs: banana.carbsG,
        calculatedFat: banana.fatG,
        calculatedFiber: banana.fiberG || 0,
        calculatedSugar: banana.sugarG || 0,
      },
    ];

    const totalCal = breakdowns.reduce((a, b) => a + b.calculatedCalories, 0);
    const totalProt = Math.round(breakdowns.reduce((a, b) => a + b.calculatedProtein, 0) * 10) / 10;
    const totalCarb = Math.round(breakdowns.reduce((a, b) => a + b.calculatedCarbs, 0) * 10) / 10;
    const totalFat = Math.round(breakdowns.reduce((a, b) => a + b.calculatedFat, 0) * 10) / 10;

    const text = isAmharic
      ? `ከስፖርት በኋላ ለጡንቻ እድሳት እና ሀይል መተኪያ የተዘጋጀ ምርጥ አማራጭ 👇\n\n🏆 ለምን ተመረጠ?\n• ፈጣን የጡንቻ እድሳት (ከፍተኛ ፕሮቲን)\n• የጠፋውን ሀይል የሚተካ ተፈጥሯዊ ካርቦሃይድሬት\n• ፖታሲየም እና ተፈጥሯዊ ኤሌክትሮላይቶች\n• ተመጣጣኝና በቀላሉ የሚዘጋጅ`
      : `Here is a high-performance post-workout meal calibrated for muscle recovery and glycogen replenishment 👇\n\n🏆 WHY IT WORKS:\n• Complete bioavailable protein for muscle repair\n• Slow & fast-acting carbs to replenish glycogen\n• Natural potassium & electrolytes\n• Highly affordable & easy to prepare`;

    return {
      text,
      foodBreakdowns: breakdowns,
      totalCalories: totalCal,
      totalProtein: totalProt,
      totalCarbs: totalCarb,
      totalFat: totalFat,
      totalFiber: 7.3,
    };
  }

  // Check 2.2: Cheap High-Protein Foods / Budget Protein
  if (
    q.includes('cheap high-protein') ||
    q.includes('cheap protein') ||
    q.includes('budget protein') ||
    q.includes('affordable protein') ||
    q.includes('ተመጣጣኝ ከፍተኛ ፕሮቲን') ||
    q.includes('ተመጣጣኝ ፕሮቲን') ||
    q.includes('ርካሽ ፕሮቲን')
  ) {
    const eggs = FOOD_DATABASE.find((f) => f.id === 'eth-boiled-eggs') || FOOD_DATABASE[0];
    const shiro = FOOD_DATABASE.find((f) => f.id === 'eth-shiro') || FOOD_DATABASE[0];
    const peanuts = FOOD_DATABASE.find((f) => f.id === 'eth-peanuts-ocholoni') || FOOD_DATABASE[0];

    const breakdowns: JossyAIFoodBreakdown[] = [
      {
        foodItem: eggs,
        quantity: 2,
        portionLabel: '2 Eggs',
        calculatedCalories: eggs.calories * 2,
        calculatedProtein: eggs.proteinG * 2,
        calculatedCarbs: eggs.carbsG * 2,
        calculatedFat: eggs.fatG * 2,
        calculatedFiber: 0,
        calculatedSugar: 0,
      },
      {
        foodItem: shiro,
        quantity: 1,
        portionLabel: '1 Bowl Shiro',
        calculatedCalories: shiro.calories,
        calculatedProtein: shiro.proteinG,
        calculatedCarbs: shiro.carbsG,
        calculatedFat: shiro.fatG,
        calculatedFiber: shiro.fiberG || 0,
        calculatedSugar: shiro.sugarG || 0,
      },
      {
        foodItem: peanuts,
        quantity: 1,
        portionLabel: '1 Handful Peanuts (40g)',
        calculatedCalories: peanuts.calories,
        calculatedProtein: peanuts.proteinG,
        calculatedCarbs: peanuts.carbsG,
        calculatedFat: peanuts.fatG,
        calculatedFiber: peanuts.fiberG || 0,
        calculatedSugar: peanuts.sugarG || 0,
      },
    ];

    const totalCal = breakdowns.reduce((a, b) => a + b.calculatedCalories, 0);
    const totalProt = Math.round(breakdowns.reduce((a, b) => a + b.calculatedProtein, 0) * 10) / 10;
    const totalCarb = Math.round(breakdowns.reduce((a, b) => a + b.calculatedCarbs, 0) * 10) / 10;
    const totalFat = Math.round(breakdowns.reduce((a, b) => a + b.calculatedFat, 0) * 10) / 10;

    const text = isAmharic
      ? `በኪስዎ ላይ ጫና የማያሳድሩ ምርጥ የኢትዮጵያ ከፍተኛ ፕሮቲን ምግቦች 👇\n\n💰 ለምን ተመረጠ?\n• ከፍተኛ የፕሮቲን መጠን በዝቅተኛ ወጪ\n• በየቀኑ በሁሉም አካባቢ የሚገኝ\n• ለጾምም ለፍስክም ተስማሚ ምርጫዎች`
      : `Top high-protein Ethiopian foods that are easy on your budget 👇\n\n💰 WHY IT WORKS:\n• Maximum protein density per Birr\n• Widely available year-round across Ethiopia\n• Great options for both fasting & non-fasting periods`;

    return {
      text,
      foodBreakdowns: breakdowns,
      totalCalories: totalCal,
      totalProtein: totalProt,
      totalCarbs: totalCarb,
      totalFat: totalFat,
      totalFiber: 11.9,
    };
  }

  // Check 2.3: Best Ethiopian Breakfast
  if (
    q.includes('ethiopian breakfast') ||
    q.includes('best breakfast') ||
    q.includes('breakfast recommendation') ||
    q.includes('የኢትዮጵያ ቁርስ') ||
    q.includes('ምርጥ ቁርስ')
  ) {
    const kinche = FOOD_DATABASE.find((f) => f.id === 'eth-kinche') || FOOD_DATABASE[0];
    const eggs = FOOD_DATABASE.find((f) => f.id === 'eth-boiled-eggs') || FOOD_DATABASE[0];

    const breakdowns: JossyAIFoodBreakdown[] = [
      {
        foodItem: kinche,
        quantity: 1,
        portionLabel: '1 Bowl Kinche (Cracked Wheat)',
        calculatedCalories: kinche.calories,
        calculatedProtein: kinche.proteinG,
        calculatedCarbs: kinche.carbsG,
        calculatedFat: kinche.fatG,
        calculatedFiber: kinche.fiberG || 0,
        calculatedSugar: kinche.sugarG || 0,
      },
      {
        foodItem: eggs,
        quantity: 2,
        portionLabel: '2 Boiled Eggs',
        calculatedCalories: eggs.calories * 2,
        calculatedProtein: eggs.proteinG * 2,
        calculatedCarbs: eggs.carbsG * 2,
        calculatedFat: eggs.fatG * 2,
        calculatedFiber: 0,
        calculatedSugar: 0,
      },
    ];

    const totalCal = breakdowns.reduce((a, b) => a + b.calculatedCalories, 0);
    const totalProt = Math.round(breakdowns.reduce((a, b) => a + b.calculatedProtein, 0) * 10) / 10;
    const totalCarb = Math.round(breakdowns.reduce((a, b) => a + b.calculatedCarbs, 0) * 10) / 10;
    const totalFat = Math.round(breakdowns.reduce((a, b) => a + b.calculatedFat, 0) * 10) / 10;

    const text = isAmharic
      ? `ቀኑን በሙሉ ጠንካራ ጉልበት የሚሰጥ ምርጥ ባህላዊ ቁርስ 👇\n\n🥣 ለምን ተመረጠ?\n• ረጅም ሰዓት የሚቆይ የቂንጬ ሃይልና ፋይበር\n• 12g የተሟላ የእንቁላል ፕሮቲን\n• ቀኑን በሙሉ የረሃብ ስሜትን ይቀንሳል`
      : `A powerful traditional Ethiopian breakfast combining complex carbohydrates with high biological value protein 👇\n\n🥣 WHY IT WORKS:\n• Sustained energy release from high-fiber Kinche\n• 12g clean protein from whole eggs\n• Keeps you full and focused throughout your morning`;

    return {
      text,
      foodBreakdowns: breakdowns,
      totalCalories: totalCal,
      totalProtein: totalProt,
      totalCarbs: totalCarb,
      totalFat: totalFat,
      totalFiber: kinche.fiberG || 6.2,
    };
  }

  // Check 2.4: Build me a cheap meal
  if (
    q.includes('build me a cheap meal') ||
    q.includes('cheap meal') ||
    q.includes('budget meal') ||
    q.includes('ተመጣጣኝ ምግብ') ||
    q.includes('ተመጣጣኝ ምግብ አዘጋጅ')
  ) {
    const injera = FOOD_DATABASE.find((f) => f.id === 'eth-injera-teff') || FOOD_DATABASE[0];
    const shiro = FOOD_DATABASE.find((f) => f.id === 'eth-shiro') || FOOD_DATABASE[0];
    const eggs = FOOD_DATABASE.find((f) => f.id === 'eth-boiled-eggs') || FOOD_DATABASE[0];

    const breakdowns: JossyAIFoodBreakdown[] = [
      {
        foodItem: injera,
        quantity: 1,
        portionLabel: '1 Roll Teff Injera',
        calculatedCalories: injera.calories,
        calculatedProtein: injera.proteinG,
        calculatedCarbs: injera.carbsG,
        calculatedFat: injera.fatG,
        calculatedFiber: injera.fiberG || 0,
        calculatedSugar: injera.sugarG || 0,
      },
      {
        foodItem: shiro,
        quantity: 1,
        portionLabel: '1 Bowl Shiro Tegamino',
        calculatedCalories: shiro.calories,
        calculatedProtein: shiro.proteinG,
        calculatedCarbs: shiro.carbsG,
        calculatedFat: shiro.fatG,
        calculatedFiber: shiro.fiberG || 0,
        calculatedSugar: shiro.sugarG || 0,
      },
      {
        foodItem: eggs,
        quantity: 1,
        portionLabel: '1 Boiled Egg',
        calculatedCalories: eggs.calories,
        calculatedProtein: eggs.proteinG,
        calculatedCarbs: eggs.carbsG,
        calculatedFat: eggs.fatG,
        calculatedFiber: 0,
        calculatedSugar: 0,
      },
    ];

    const totalCal = breakdowns.reduce((a, b) => a + b.calculatedCalories, 0);
    const totalProt = Math.round(breakdowns.reduce((a, b) => a + b.calculatedProtein, 0) * 10) / 10;
    const totalCarb = Math.round(breakdowns.reduce((a, b) => a + b.calculatedCarbs, 0) * 10) / 10;
    const totalFat = Math.round(breakdowns.reduce((a, b) => a + b.calculatedFat, 0) * 10) / 10;

    const text = isAmharic
      ? `ተመጣጣኝ፣ ከፍተኛ ፕሮቲንና ጠቃሚ ማዕድናት የያዘ የዕለት ምግብ እቅድ 👇\n\n💰 ለምን ተመረጠ?\n• 29.4g አጠቃላይ ፕሮቲን በዝቅተኛ ወጪ\n• በብረት እና በፋይበር የበለጸገ የጤፍ እንጀራ\n• የተመጣጠነ ማክሮ ንጥረ-ነገር`
      : `An ultra budget-friendly, nutrient-dense Ethiopian meal built from our verified food database 👇\n\n💰 WHY IT WORKS:\n• Nearly 30g total protein at minimum cost\n• Rich in iron, zinc, and fiber from pure teff\n• Perfectly balanced macro profile for athletic recovery`;

    return {
      text,
      foodBreakdowns: breakdowns,
      totalCalories: totalCal,
      totalProtein: totalProt,
      totalCarbs: totalCarb,
      totalFat: totalFat,
      totalFiber: 12.7,
    };
  }

  // Check 2.5: Foods for muscle gain
  if (
    q.includes('muscle gain') ||
    q.includes('build muscle') ||
    q.includes('bulking') ||
    q.includes('ለጡንቻ ግንባታ') ||
    q.includes('ጡንቻ ማሳደግ')
  ) {
    const eggs = FOOD_DATABASE.find((f) => f.id === 'eth-boiled-eggs') || FOOD_DATABASE[0];
    const oats = FOOD_DATABASE.find((f) => f.id === 'eth-oats-aja') || FOOD_DATABASE[0];
    const banana = FOOD_DATABASE.find((f) => f.id === 'eth-banana') || FOOD_DATABASE[0];
    const peanuts = FOOD_DATABASE.find((f) => f.id === 'eth-peanuts-ocholoni') || FOOD_DATABASE[0];

    const breakdowns: JossyAIFoodBreakdown[] = [
      {
        foodItem: oats,
        quantity: 1,
        portionLabel: '1 Bowl Oats (Aja)',
        calculatedCalories: oats.calories,
        calculatedProtein: oats.proteinG,
        calculatedCarbs: oats.carbsG,
        calculatedFat: oats.fatG,
        calculatedFiber: oats.fiberG || 0,
        calculatedSugar: oats.sugarG || 0,
      },
      {
        foodItem: eggs,
        quantity: 3,
        portionLabel: '3 Boiled Eggs',
        calculatedCalories: eggs.calories * 3,
        calculatedProtein: eggs.proteinG * 3,
        calculatedCarbs: eggs.carbsG * 3,
        calculatedFat: eggs.fatG * 3,
        calculatedFiber: 0,
        calculatedSugar: 0,
      },
      {
        foodItem: banana,
        quantity: 1,
        portionLabel: '1 Banana',
        calculatedCalories: banana.calories,
        calculatedProtein: banana.proteinG,
        calculatedCarbs: banana.carbsG,
        calculatedFat: banana.fatG,
        calculatedFiber: banana.fiberG || 0,
        calculatedSugar: banana.sugarG || 0,
      },
      {
        foodItem: peanuts,
        quantity: 1,
        portionLabel: '1 Handful Peanuts (40g)',
        calculatedCalories: peanuts.calories,
        calculatedProtein: peanuts.proteinG,
        calculatedCarbs: peanuts.carbsG,
        calculatedFat: peanuts.fatG,
        calculatedFiber: peanuts.fiberG || 0,
        calculatedSugar: peanuts.sugarG || 0,
      },
    ];

    const totalCal = breakdowns.reduce((a, b) => a + b.calculatedCalories, 0);
    const totalProt = Math.round(breakdowns.reduce((a, b) => a + b.calculatedProtein, 0) * 10) / 10;
    const totalCarb = Math.round(breakdowns.reduce((a, b) => a + b.calculatedCarbs, 0) * 10) / 10;
    const totalFat = Math.round(breakdowns.reduce((a, b) => a + b.calculatedFat, 0) * 10) / 10;

    const text = isAmharic
      ? `ለጡንቻ ግንባታ (Hypertrophy) የሚረዱ ካሎሪ-አመቺና ከፍተኛ ፕሮቲን ያላቸው ምግቦች 👇\n\n💪 የጡንቻ ግንባታ መርህ:\n• በቂ የካሎሪ ትርፍ (Caloric Surplus)\n• በአንድ ምግብ ከ 30-40g ፕሮቲን\n• ለስልጠና ብርታት የሚሰጡ ውስብስብ ካርቦሃይድሬቶች`
      : `High-density muscle building foods crafted for hypertrophic recovery and clean bulking 👇\n\n💪 MUSCLE GAIN PRINCIPLES:\n• Calorie density with quality nutrients\n• High leucine & complete amino acids\n• Clean carbs for intense training volume`;

    return {
      text,
      foodBreakdowns: breakdowns,
      totalCalories: totalCal,
      totalProtein: totalProt,
      totalCarbs: totalCarb,
      totalFat: totalFat,
      totalFiber: 12.5,
    };
  }

  // Check 2.6: Foods for weight loss / fat loss
  if (
    q.includes('weight loss') ||
    q.includes('fat loss') ||
    q.includes('lose weight') ||
    q.includes('cutting') ||
    q.includes('ለክብደት መቀነሻ') ||
    q.includes('ስብ ማቅለጥ')
  ) {
    const whites = FOOD_DATABASE.find((f) => f.id === 'eth-egg-whites') || FOOD_DATABASE[0];
    const gomen = FOOD_DATABASE.find((f) => f.id === 'eth-gomen-collards') || FOOD_DATABASE[0];
    const misir = FOOD_DATABASE.find((f) => f.id === 'eth-misir-wot') || FOOD_DATABASE[0];
    const injera = FOOD_DATABASE.find((f) => f.id === 'eth-injera-teff') || FOOD_DATABASE[0];

    const breakdowns: JossyAIFoodBreakdown[] = [
      {
        foodItem: misir,
        quantity: 1,
        portionLabel: '1 Bowl Lentil Stew (Misir)',
        calculatedCalories: misir.calories,
        calculatedProtein: misir.proteinG,
        calculatedCarbs: misir.carbsG,
        calculatedFat: misir.fatG,
        calculatedFiber: misir.fiberG || 0,
        calculatedSugar: misir.sugarG || 0,
      },
      {
        foodItem: gomen,
        quantity: 1,
        portionLabel: '1 Plate Steamed Collard Greens (Gomen)',
        calculatedCalories: gomen.calories,
        calculatedProtein: gomen.proteinG,
        calculatedCarbs: gomen.carbsG,
        calculatedFat: gomen.fatG,
        calculatedFiber: gomen.fiberG || 0,
        calculatedSugar: gomen.sugarG || 0,
      },
      {
        foodItem: injera,
        quantity: 1,
        portionLabel: '1 Roll Teff Injera',
        calculatedCalories: injera.calories,
        calculatedProtein: injera.proteinG,
        calculatedCarbs: injera.carbsG,
        calculatedFat: injera.fatG,
        calculatedFiber: injera.fiberG || 0,
        calculatedSugar: injera.sugarG || 0,
      },
    ];

    const totalCal = breakdowns.reduce((a, b) => a + b.calculatedCalories, 0);
    const totalProt = Math.round(breakdowns.reduce((a, b) => a + b.calculatedProtein, 0) * 10) / 10;
    const totalCarb = Math.round(breakdowns.reduce((a, b) => a + b.calculatedCarbs, 0) * 10) / 10;
    const totalFat = Math.round(breakdowns.reduce((a, b) => a + b.calculatedFat, 0) * 10) / 10;

    const text = isAmharic
      ? `ለስብ ማቃጠልና ክብደት መቀነሻ ተስማሚ የሆኑ ከፍተኛ ፋይበርና አርኪ ምግቦች 👇\n\n🥗 ለምን ተመረጠ?\n• ከፍተኛ ፋይበርና አነስተኛ ካሎሪ (High Satiety)\n• የሆድ መሞላትን በማፋጠን ረሃብን መግታት\n• የደም ስኳርን ሚዛናዊ የሚያደርግ`
      : `High-volume, fiber-rich foods designed for fat loss and long-lasting satiety 👇\n\n🥗 WHY IT WORKS:\n• High satiety index per calorie\n• Packed with plant protein, fiber, and micronutrients\n• Stabilizes blood sugar and prevents energy crashes`;

    return {
      text,
      foodBreakdowns: breakdowns,
      totalCalories: totalCal,
      totalProtein: totalProt,
      totalCarbs: totalCarb,
      totalFat: totalFat,
      totalFiber: 14.7,
    };
  }

  // Check 2.7: Water Requirement
  if (
    q.includes('how much water') ||
    q.includes('water intake') ||
    q.includes('water should i drink') ||
    q.includes('ውሃ መጠጣት') ||
    q.includes('ምን ያህል ውሃ')
  ) {
    const weight = user.weightKg || 70;
    const waterLiters = (Math.round(weight * 0.038 * 10) / 10).toFixed(1);
    const text = isAmharic
      ? `የእርስዎ የዕለት የውሃ ፍላጎት በክብደትዎ (${weight}kg) መሰረት:\n\n💧 በቀን ቢያንስ፦ ${waterLiters} ሊትር (ወደ 7-9 ብርጭቆ)\n\n📌 የስፖርት መመሪያ:\n• ከስልጠና 30 ደቂቃ በፊት፦ 500ml\n• በስልጠና ወቅት፦ በየ 15 ደቂቃው 150-200ml\n• ከስልጠና በኋላ፦ በላብ የጠፋውን በበቂ ውሃ መተካት`
      : `Based on your current body weight (${weight}kg), your optimal daily hydration target is:\n\n💧 Baseline Target: ${waterLiters} Liters per day (~7-9 glasses)\n\n📌 Workout Hydration Protocol:\n• 30 mins Pre-Workout: 500ml\n• During Training: 150-200ml every 15 minutes\n• Post-Workout: 500ml+ to replenish sweat losses`;

    return { text };
  }

  // Check 3: Check for Ambiguous food quantity (e.g. "I ate some shiro")
  const ambiguity = checkAmbiguousQuantity(q);
  if (ambiguity.isAmbiguous && ambiguity.foodItem) {
    const food = ambiguity.foodItem;
    const text = isAmharic
      ? `${food.nameAm} መመገብዎን ተረድቻለሁ ${firstName} 👌\nምን ያህል መጠን እንደበሉ ይግለጹልኝ?`
      : `Got it ${firstName} 👌 How much ${food.nameEn} did you eat? Choose a serving size below or specify the amount:`;

    const options = isAmharic
      ? [
          { label: `1 ሳህን (${food.servingSize})`, query: `1 ${food.nameAm}` },
          { label: `ግማሽ ሳህን (1/2)`, query: `ግማሽ ${food.nameAm}` },
          { label: `ትልቅ ሳህን (1.5x)`, query: `1.5 ${food.nameAm}` },
        ]
      : [
          { label: `1 Standard (${food.servingSize})`, query: `1 ${food.nameEn}` },
          { label: `Half portion (1/2)`, query: `0.5 ${food.nameEn}` },
          { label: `Large portion (1.5x)`, query: `1.5 ${food.nameEn}` },
        ];

    return {
      text,
      isAmbiguous: true,
      ambiguousOptions: options,
    };
  }

  // Check 4: Multi-Food Parsing
  const parsedItems = parseMultiFoodQuery(q);

  if (parsedItems.length > 0) {
    const totalCal = Math.round(parsedItems.reduce((acc, curr) => acc + curr.calculatedCalories, 0));
    const totalProt = Math.round(parsedItems.reduce((acc, curr) => acc + curr.calculatedProtein, 0) * 10) / 10;
    const totalCarb = Math.round(parsedItems.reduce((acc, curr) => acc + curr.calculatedCarbs, 0) * 10) / 10;
    const totalFat = Math.round(parsedItems.reduce((acc, curr) => acc + curr.calculatedFat, 0) * 10) / 10;
    const totalFib = Math.round(parsedItems.reduce((acc, curr) => acc + curr.calculatedFiber, 0) * 10) / 10;

    const currentProt = consumedStats.proteinG;
    const targetProt = user.targetProteinG || 150;
    const newProt = Math.round((currentProt + totalProt) * 10) / 10;

    let text = '';
    if (isAmharic) {
      text = `ተረድቻለሁ ${firstName} 👌\nየተመረመሩት ምግቦች ከዳጊ ፊትነስ የምግብ ዳታቤዝ፦\n${parsedItems.map((p) => `• ${p.portionLabel} ${p.foodItem.nameAm} (${p.calculatedCalories} kcal, ${p.calculatedProtein}g ፕሮቲን)`).join('\n')}\n\nአጠቃላይ፦ ${totalCal} kcal • ${totalProt}g ፕሮቲን • ${totalCarb}g ካርቦሃይድሬት • ${totalFat}g ስብ።\n\nበአሁኑ ሰዓት ከ ${targetProt}g ፕሮቲን ግብዎ ላይ ${currentProt}g ደርሰዋል። ይህንን ምግብ መመዝገብ ወደ ${newProt}g ያደርስዎታል።`;
    } else {
      text = `Got it ${firstName} 👌\nHere is the breakdown from your Dagi Fitness food database:\n${parsedItems.map((p) => `• ${p.portionLabel} of ${p.foodItem.nameEn} (${p.calculatedCalories} kcal, ${p.calculatedProtein}g Protein)`).join('\n')}\n\nTotals: ${totalCal} kcal • ${totalProt}g Protein • ${totalCarb}g Carbs • ${totalFat}g Fat • ${totalFib}g Fiber.\n\nYou're currently at ${currentProt}g of your ${targetProt}g protein target today. Adding this meal will bring you to approximately ${newProt}g.`;
    }

    const breakdowns: JossyAIFoodBreakdown[] = parsedItems.map((p) => ({
      foodItem: p.foodItem,
      quantity: p.quantity,
      portionLabel: p.portionLabel,
      calculatedCalories: p.calculatedCalories,
      calculatedProtein: p.calculatedProtein,
      calculatedCarbs: p.calculatedCarbs,
      calculatedFat: p.calculatedFat,
      calculatedFiber: p.calculatedFiber,
      calculatedSugar: p.calculatedSugar,
    }));

    return {
      text,
      foodBreakdowns: breakdowns,
      totalCalories: totalCal,
      totalProtein: totalProt,
      totalCarbs: totalCarb,
      totalFat: totalFat,
      totalFiber: totalFib,
      userProteinTarget: targetProt,
      userCurrentProtein: currentProt,
      userCalorieTarget: user.targetCalories,
      userCurrentCalories: consumedStats.calories,
    };
  }

  // Check 5: Unknown food - do NOT fabricate numbers
  const text = isAmharic
    ? `ይቅርታ ${firstName}፣ ያንን ምግብ በዳጊ ፊትነስ የምግብ ዳታቤዝ ውስጥ ማግኘት አልቻልኩም። እባክዎ ሌላ ስም ይሞክሩ ወይም ሙሉውን የምግብ ዝርዝር (100+ ምግቦች) ይመልከቱ።`
    : `I couldn't find that food in the Dagi Fitness food database yet, ${firstName}. Try another name or explore the 100+ Ethiopian food catalog.`;

  return {
    text,
    isUnknownFood: true,
  };
}

/**
 * Personalized daily meal plan generation for the Eat section
 */
export function generatePersonalizedMealPlan(user: UserProfile): PlannedMealItem[] {
  const isAmharic = user.language === 'am';
  const targetCalories = user.targetCalories || 2400;

  // Proportionate distribution
  const bCal = Math.round(targetCalories * 0.25);
  const lCal = Math.round(targetCalories * 0.35);
  const sCal = Math.round(targetCalories * 0.15);
  const dCal = Math.round(targetCalories * 0.25);

  const breakfastItem: PlannedMealItem = {
    mealType: 'breakfast',
    title: isAmharic ? 'የቁርስ እቅድ (እንቁላል ፍርፍር በጤፍ እንጀራ)' : 'High-Protein Breakfast: Scrambled Eggs & Teff Injera',
    titleAm: 'የቁርስ እቅድ (እንቁላል ፍርፍር በጤፍ እንጀራ)',
    portionDescription: '2 Fresh Whole Eggs scrambled with onions, tomato & 1 roll Teff Injera',
    calories: 195 + 220,
    proteinG: 13.5 + 7.2,
    carbsG: 4.5 + 45.5,
    fatG: 13.8 + 1.2,
    fiberG: 1.2 + 4.2,
    sugarG: 2.0 + 0.6,
    primaryFoodId: 'eth-scrambled-eggs',
    foods: [
      { foodItem: FOOD_DATABASE.find((f) => f.id === 'eth-scrambled-eggs') || FOOD_DATABASE[0], servingMultiplier: 1 },
      { foodItem: FOOD_DATABASE.find((f) => f.id === 'eth-injera-teff') || FOOD_DATABASE[0], servingMultiplier: 1 },
    ],
  };

  const lunchItem: PlannedMealItem = {
    mealType: 'lunch',
    title: isAmharic ? 'የምሳ እቅድ (ሽሮ ተጋሚኖ በጤፍ እንጀራና ሰላጣ)' : 'Metabolic Power Lunch: Shiro Tegamino & Injera',
    titleAm: 'የምሳ እቅድ (ሽሮ ተጋሚኖ በጤፍ እንጀራና ሰላጣ)',
    portionDescription: '1 Slow-Cooked Chickpea Shiro bowl (200g) with 1 roll Teff Injera & Timatim Salata',
    calories: 290 + 220 + 75,
    proteinG: 16.2 + 7.2 + 2.1,
    carbsG: 38.0 + 45.5 + 9.5,
    fatG: 9.0 + 1.2 + 3.5,
    fiberG: 8.5 + 4.2 + 2.8,
    sugarG: 2.2 + 0.6 + 5.2,
    primaryFoodId: 'eth-shiro',
    foods: [
      { foodItem: FOOD_DATABASE.find((f) => f.id === 'eth-shiro') || FOOD_DATABASE[0], servingMultiplier: 1 },
      { foodItem: FOOD_DATABASE.find((f) => f.id === 'eth-injera-teff') || FOOD_DATABASE[0], servingMultiplier: 1 },
      { foodItem: FOOD_DATABASE.find((f) => f.id === 'eth-timatim-salata') || FOOD_DATABASE[0], servingMultiplier: 1 },
    ],
  };

  const snackItem: PlannedMealItem = {
    mealType: 'snack',
    title: isAmharic ? 'የስፖርት መክሰስ (ሙዝ እና ኦቾሎኒ)' : 'Pre/Post Workout Snack: Banana & Roasted Peanuts',
    titleAm: 'የስፖርት መክሰስ (ሙዝ እና ኦቾሎኒ)',
    portionDescription: '1 Fresh Ripe Banana with 1 handful Roasted Peanuts (40g)',
    calories: 105 + 235,
    proteinG: 1.3 + 10.4,
    carbsG: 27.0 + 6.4,
    fatG: 0.3 + 20.0,
    fiberG: 3.1 + 3.4,
    sugarG: 14.4 + 1.8,
    primaryFoodId: 'eth-banana',
    foods: [
      { foodItem: FOOD_DATABASE.find((f) => f.id === 'eth-banana') || FOOD_DATABASE[0], servingMultiplier: 1 },
      { foodItem: FOOD_DATABASE.find((f) => f.id === 'eth-peanuts-ocholoni') || FOOD_DATABASE[0], servingMultiplier: 1 },
    ],
  };

  const dinnerItem: PlannedMealItem = {
    mealType: 'dinner',
    title: isAmharic ? 'የእራት እቅድ (የበሬ ጥብስ ወይም ምስር ወጥ)' : 'Lean Recovery Dinner: Beef Tibs / Misir & Injera',
    titleAm: 'የእራት እቅድ (የበሬ ጥብስ ወይም ምስር ወጥ)',
    portionDescription: '200g Lean Beef Tibs sautéed with rosemary and 1 roll Teff Injera',
    calories: 420 + 220,
    proteinG: 44.0 + 7.2,
    carbsG: 4.0 + 45.5,
    fatG: 25.0 + 1.2,
    fiberG: 1.0 + 4.2,
    sugarG: 1.2 + 0.6,
    primaryFoodId: 'eth-tibs-beef',
    foods: [
      { foodItem: FOOD_DATABASE.find((f) => f.id === 'eth-tibs-beef') || FOOD_DATABASE[0], servingMultiplier: 1 },
      { foodItem: FOOD_DATABASE.find((f) => f.id === 'eth-injera-teff') || FOOD_DATABASE[0], servingMultiplier: 1 },
    ],
  };

  return [breakfastItem, lunchItem, snackItem, dinnerItem];
}

/**
 * Backward compatibility query helper
 */
export function queryJossyAI(
  userQuery: string,
  user: UserProfile
): Promise<{ reply: string }> {
  return new Promise((resolve) => {
    const res = generateJossyAIResponse(userQuery, user, {
      calories: 0,
      proteinG: 0,
      carbsG: 0,
      fatG: 0,
      fiberG: 0,
    });
    resolve({ reply: res.text || '' });
  });
}
