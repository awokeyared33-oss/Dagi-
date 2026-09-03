import { FitnessKnowledgeArticle, UserProfile, LoggedMeal, CompletedWorkout, MembershipSummary } from '../types';
import { FOOD_DATABASE } from './foodDatabase';
import { MASTER_EXERCISES } from './workoutDatabase';

/**
 * COMPREHENSIVE PROFESSIONAL FITNESS & NUTRITION KNOWLEDGE DATABASE
 * Structured for deterministic, evidence-based fitness answering ($0 API architecture).
 */

export const FITNESS_KNOWLEDGE_ARTICLES: FitnessKnowledgeArticle[] = [
  // ==========================================
  // 1. HUMAN BODY & MUSCLE ANATOMY
  // ==========================================
  {
    id: 'art-muscle-chest',
    title: 'Pectoralis Major & Minor (Chest Anatomy & Function)',
    titleAm: 'የደረት ጡንቻዎች አናቶሚና ስራ (Pectorals)',
    category: 'anatomy',
    keywords: ['chest', 'pecs', 'pectoralis', 'ደረት', 'የደረት ጡንቻ', 'bench press', 'chest workout'],
    summary: 'The pectoralis major comprises clavicular (upper) and sternal (mid-lower) heads responsible for shoulder horizontal adduction, flexion, and internal rotation.',
    detailedContent: `The chest consists of two main muscles:
1. Pectoralis Major: Clavicular head (upper chest originating at the clavicle) and sternocostal head (mid and lower chest originating at the sternum and rib cartilage). Its primary biomechanical actions are horizontal adduction (bringing arms together across the chest), flexion (raising arms forward), and internal rotation.
2. Pectoralis Minor: Lies underneath the major, originating from ribs 3–5, stabilizing and depressing the scapula.

Effective Training Strategy:
• Upper Chest: 30° Incline Dumbbell Press, Incline Barbell Press, Low-to-High Cable Flyes.
• Mid & Lower Chest: Flat Barbell Bench Press, Weighted Dips, Chest Flyes.
• Hypertrophy rep range: 6–12 reps with 2–3 minutes rest for compound presses, 10–15 reps with 60–90s rest for isolation flyes.`,
    practicalApplication: 'To maximize chest hypertrophy, train with full active range of motion allowing a deep stretch at the bottom without excessively rolling shoulders forward.',
    coachingCue: 'Retract your scapulae (pinch shoulder blades back and down), flare elbows at ~45° (not 90°), and squeeze your biceps towards each other at peak contraction.',
  },
  {
    id: 'art-muscle-back-lats',
    title: 'Latissimus Dorsi & Upper Back (Back Anatomy & Function)',
    titleAm: 'የጀርባ ጡንቻዎች አናቶሚና ስራ (Lats & Back)',
    category: 'anatomy',
    keywords: ['lats', 'latissimus dorsi', 'back', 'upper back', 'traps', 'ጀርባ', 'የጀርባ ጡንቻ', 'pull up', 'lat pulldown', 'row'],
    summary: 'The back features the Latissimus Dorsi for vertical/horizontal pulling (adduction & extension) and Upper Back (Rhomboids, Trapezius) for scapular retraction.',
    detailedContent: `The back is a complex network of major muscle groups:
1. Latissimus Dorsi (Lats): The largest back muscle, pulling the arms down and back towards the pelvis (shoulder adduction and extension). Provides the "V-taper" aesthetic.
2. Rhomboids & Mid/Lower Trapezius: Pull shoulder blades together (scapular retraction and depression), critical for posture and joint stability.
3. Upper Trapezius: Elevates scapulae (shrugs), supporting heavy loads in deadlifts and carries.
4. Erector Spinae: Runs down the spine for spinal extension and posture stabilization.

Effective Training Strategy:
• Vertical Pulling (Lat Width): Neutral-grip Pull-ups, Lat Pulldowns.
• Horizontal Pulling (Back Thickness): Barbell Bent-Over Rows, Chest-Supported T-Bar Rows, Seated Cable Rows.
• Spinal Strength: Romanian Deadlifts, Barbell Deadlifts.`,
    practicalApplication: 'Incorporate at least one vertical pull and one horizontal row in your weekly program for balanced back development.',
    coachingCue: 'Initiate all rowing and pulldown movements by pulling with your elbows rather than gripping too tightly with your forearms and biceps.',
  },
  {
    id: 'art-muscle-shoulders',
    title: 'Deltoids & Rotator Cuff (Shoulder Anatomy & Function)',
    titleAm: 'የትከሻ ጡንቻዎች (Deltoids & Rotator Cuff)',
    category: 'anatomy',
    keywords: ['shoulders', 'delts', 'deltoids', 'overhead press', 'lateral raise', 'ትከሻ', 'የትከሻ ጡንቻ'],
    summary: 'The deltoid consists of anterior (front), lateral (side), and posterior (rear) heads. Balanced training of all three heads ensures complete 3D shoulder shape and joint integrity.',
    detailedContent: `The shoulder complex comprises three distinct deltoid heads and the rotator cuff:
1. Anterior Deltoid (Front): Drives shoulder flexion. Heavily stimulated during all bench and chest pressing exercises.
2. Lateral Deltoid (Side): Drives shoulder abduction. Creates shoulder width and capping. Highly responsive to lateral raises.
3. Posterior Deltoid (Rear): Drives horizontal abduction and external rotation. Essential for posture and balancing heavy pressing.
4. Rotator Cuff (Supraspinatus, Infraspinatus, Teres Minor, Subscapularis): Stabilizes the humeral head in the glenoid fossa.

Effective Training Strategy:
• Anterior: Overhead Barbell/Dumbbell Press.
• Lateral: Dumbbell Lateral Raises, Cable Lateral Raises (cables maintain constant tension).
• Posterior: Face Pulls, Rear Delt Reverse Flyes.`,
    practicalApplication: 'Because the anterior delt gets worked in all chest presses, dedicate extra isolation volume to the lateral and rear deltoids for round, 3D shoulders.',
    coachingCue: 'On lateral raises, lead with the elbows, keep a slight forward lean, and raise in the scapular plane (~30° forward) to avoid impingement.',
  },
  {
    id: 'art-muscle-arms',
    title: 'Biceps, Triceps & Forearms (Arm Anatomy & Training)',
    titleAm: 'የክንድ ጡንቻዎች (Biceps, Triceps & Forearms)',
    category: 'anatomy',
    keywords: ['biceps', 'triceps', 'arms', 'forearms', 'bicep', 'tricep', 'እጅ', 'የክንድ ጡንቻ', 'curls'],
    summary: 'Triceps make up ~60% of upper arm mass (long, lateral, and medial heads) while biceps consist of long and short heads plus the underlying brachialis.',
    detailedContent: `Arms comprise anterior and posterior compartments:
1. Triceps Brachii: Three heads (Long head, Lateral head, Medial head). Responsible for elbow extension. The long head crosses the shoulder joint, requiring overhead movements for maximum stretch.
2. Biceps Brachii: Two heads (Long head for peak, Short head for inner thickness) plus the Brachialis (underneath, pushes biceps up) and Brachioradialis (forearm). Responsible for elbow flexion and forearm supination.

Top Exercises:
• Triceps: Overhead Cable Rope Extension, Heavy Triceps Pushdowns, Close-Grip Bench Press, Dips.
• Biceps: Incline Dumbbell Curls (long head stretch), Standing Barbell Curls (general mass), Hammer Curls (brachialis & forearm).`,
    practicalApplication: 'To grow bigger arms, prioritize triceps first since they comprise the majority of arm volume.',
    coachingCue: 'Keep elbows fixed at your sides during curls and pushdowns. Do not swing your torso or use momentum.',
  },
  {
    id: 'art-muscle-legs',
    title: 'Quadriceps, Hamstrings, Glutes & Calves (Lower Body Anatomy)',
    titleAm: 'የእግርና የታችኛው የሰውነት ክፍል ጡንቻዎች (Lower Body Anatomy)',
    category: 'anatomy',
    keywords: ['legs', 'quads', 'hamstrings', 'glutes', 'calves', 'squat', 'deadlift', 'እግር', 'የእግር ጡንቻ', 'ጭን'],
    summary: 'The lower body contains the largest muscle mass in the human body: Quadriceps for knee extension, Glutes for hip extension, Hamstrings for hip extension/knee flexion, and Calves for plantarflexion.',
    detailedContent: `Lower body anatomy includes:
1. Quadriceps (Rectus Femoris, Vastus Lateralis, Medialis, Intermedius): Extend the knee joint. Rectus femoris also assists hip flexion.
2. Gluteus Maximus, Medius, Minimus: The most powerful hip extensors and abductors. Critical for sprint speed, jumping, posture, and pelvic alignment.
3. Hamstrings (Biceps Femoris, Semitendinosus, Semimembranosus): Dual function: Hip extension and knee flexion.
4. Calves (Gastrocnemius & Soleus): Gastrocnemius crosses the knee (trained straight-legged), Soleus active during seated calf raises.

Essential Exercises:
• Quads: Barbell Back Squats, Front Squats, Leg Press, Bulgarian Split Squats, Leg Extensions.
• Glutes & Hamstrings: Romanian Deadlifts (RDLs), Barbell Hip Thrusts, Lying/Seated Leg Curls, Walking Lunges.
• Calves: Standing Calf Raises, Seated Calf Raises.`,
    practicalApplication: 'Train both knee flexion (leg curls) and hip extension (RDLs) to stimulate all heads of the hamstrings completely.',
    coachingCue: 'During squats and lunges, push your knees outward in line with your middle toes and drive through your midfoot and heels.',
  },
  {
    id: 'art-muscle-core',
    title: 'Core, Rectus Abdominis, Obliques & Lower Back (Core Stability)',
    titleAm: 'የሆድና የጀርባ አጥንት ደጋፊ ጡንቻዎች (Core & Abs)',
    category: 'anatomy',
    keywords: ['abs', 'core', 'obliques', 'rectus abdominis', 'lower back', 'six pack', 'ሆድ', 'የሆድ ጡንቻ'],
    summary: 'The core functions primarily to resist spinal motion (anti-extension, anti-rotation, anti-lateral flexion) and transfer force between upper and lower body.',
    detailedContent: `The core includes the Rectus Abdominis (six-pack muscle), Transverse Abdominis (internal corset), Internal and External Obliques (rotational control), and Quadratus Lumborum/Erectors (spinal stability).

Core Training Dimensions:
1. Anti-Extension: Planks, Ab Wheel Rollouts.
2. Anti-Rotation: Pallof Press, Bird-Dogs.
3. Spinal Flexion with Resistance: Hanging Leg Raises, Cable Crunches.
4. Anti-Lateral Flexion: Suitcase Carries, Side Planks.

Key Principle: Visible abs are primarily a result of low body fat percentage (typically <12-14% for men, <20-22% for women) combined with direct hypertrophy of the rectus abdominis.`,
    practicalApplication: 'Treat abs like any other muscle group: apply progressive overload with resistance rather than doing 500 unweighted crunches.',
    coachingCue: 'During crunches and leg raises, round your lower spine slightly to contract the rectus abdominis; do not simply flex at the hip flexors.',
  },

  // ==========================================
  // 2. MUSCLE BUILDING / HYPERTROPHY
  // ==========================================
  {
    id: 'art-hypertrophy-principles',
    title: 'Scientific Principles of Muscle Hypertrophy',
    titleAm: 'የጡንቻ ግንባታ ሳይንሳዊ መርሆዎች (Hypertrophy)',
    category: 'hypertrophy',
    keywords: ['hypertrophy', 'muscle building', 'build muscle', 'muscle growth', 'progressive overload', 'ጡንቻ መገንባት', 'ጡንቻ ማሳደግ', 'የጡንቻ እድገት'],
    summary: 'Hypertrophy is driven by Mechanical Tension, sufficient Training Volume (10–20 weekly sets per muscle), proximity to failure (0–3 RIR), and caloric/protein sufficiency.',
    detailedContent: `To maximize muscle growth, training must satisfy these evidence-based pillars:

1. Mechanical Tension (The Primary Driver):
Lifting challenging loads through a full active range of motion recruits and exposes high-threshold motor units to stretch and contraction.

2. Progressive Overload:
Gradually increasing the stimulus over time. You can progressively overload by:
• Adding weight to the bar (same reps)
• Adding repetitions (same weight)
• Improving execution tempo, depth, and control
• Adding sets (volume progression)

3. Weekly Set Volume:
10 to 20 hard working sets per muscle group per week is the optimal range for most trainees. Beginners grow well on 8–10 sets; intermediates require 12–18 sets.

4. Proximity to Failure (RIR & RPE):
Working sets should finish within 1 to 3 Reps in Reserve (RIR 1–3, or RPE 7–9). Training to complete failure on compound lifts generates disproportionate systemic fatigue with minimal extra hypertrophy benefit.

5. Frequency:
Training each muscle group 2 times per week provides superior muscle protein synthesis signaling compared to once-per-week "bro splits."`,
    practicalApplication: 'Pick 2–4 exercises per muscle group, track your weights and reps in your workout log, and strive to beat your previous week’s performance.',
    coachingCue: 'Control the eccentric (lowering) phase for 2–3 seconds on every rep to maximize mechanical tension on the muscle fibers.',
  },
  {
    id: 'art-rir-rpe-explained',
    title: 'RPE & RIR Explained: Autoregulation in Training',
    titleAm: 'RPE እና RIR ስሌት በስፖርት (Intensity & Failure)',
    category: 'hypertrophy',
    keywords: ['rpe', 'rir', 'reps in reserve', 'rate of perceived exertion', 'failure', 'intensity'],
    summary: 'RIR (Reps in Reserve) and RPE (Rate of Perceived Exertion) quantify how close a set was to absolute muscular failure.',
    detailedContent: `Understanding RIR and RPE allows you to train at optimal intensity without burning out:

• RPE 10 (0 RIR): Absolute failure. Could not perform another repetition even with maximum effort.
• RPE 9 (1 RIR): Could perform 1 more rep with proper form.
• RPE 8 (2 RIR): Could perform 2 more reps. The sweet spot for compound strength and hypertrophy.
• RPE 7 (3 RIR): Could perform 3 more reps. Good for warmups, speed sets, or deload weeks.
• RPE <6 (>4 RIR): Low stimulus for hypertrophy; too far from failure.

Why Stop at 1–2 RIR on Compounds?
Training to failure on Squats or Deadlifts drastically increases injury risk and central nervous system (CNS) fatigue. Leaving 1–2 reps in the tank produces 95%+ of the hypertrophic stimulus with a fraction of the recovery cost.`,
    practicalApplication: 'Use 1–2 RIR on heavy compound barbell lifts (Squat, Bench, Deadlift, OHP) and 0–1 RIR on safer isolation machines and cables (Curls, Pushdowns, Lateral Raises, Leg Extensions).',
    coachingCue: 'Be honest with your RIR assessment. Most beginners underestimate how many reps they have left by 3–4 reps.',
  },
  {
    id: 'art-rest-intervals',
    title: 'Rest Periods Between Sets for Strength & Hypertrophy',
    titleAm: 'በስብስቦች መካከል የእረፍት ጊዜ (Rest Periods)',
    category: 'hypertrophy',
    keywords: ['rest between sets', 'rest time', 'rest period', 'how long to rest', 'ስንት ደቂቃ እረፍት', 'እረፍት'],
    summary: 'Rest 2–3+ minutes for heavy multi-joint compound lifts, and 60–90 seconds for single-joint isolation exercises to ensure full adenosine triphosphate (ATP) and nervous system replenishment.',
    detailedContent: `Scientific research shows that resting too little (e.g. 30–45 seconds) impairs performance on subsequent sets, reducing total mechanical tension and volume load:

Recommended Rest Guidelines:
• Heavy Compound Exercises (Squats, Deadlifts, Bench Press, Barbell Rows, Overhead Press): 2 to 3.5 minutes.
• Secondary Compound Exercises (Leg Press, Incline DB Press, Lat Pulldowns, Romanian Deadlifts): 90 seconds to 2 minutes.
• Isolation Exercises (Lateral Raises, Biceps Curls, Triceps Pushdowns, Calf Raises): 60 to 90 seconds.

Signs You Are Ready for Your Next Set:
1. Breathing has returned to normal.
2. The target muscle is no longer burning with lactic acid.
3. You feel mentally focused and physically primed to match or exceed previous performance.`,
    practicalApplication: 'Do not rush your rest periods if your goal is building muscle or strength. Use a timer to stay consistent.',
    coachingCue: 'If your heart is pounding and you feel out of breath, you are testing your cardiovascular recovery rather than muscular strength.',
  },

  // ==========================================
  // 3. STRENGTH TRAINING
  // ==========================================
  {
    id: 'art-strength-fundamentals',
    title: 'Strength Training Foundations & Neuromuscular Adaptations',
    titleAm: 'የጥንካሬ ስልጠና መሰረታዊ መርሆዎች (Strength Fundamentals)',
    category: 'strength',
    keywords: ['strength', 'strength training', 'powerlifting', 'heavy lifting', 'ጥንካሬ', 'ክብደት ማንሳት'],
    summary: 'Strength is the ability to produce maximum force against external resistance. It is driven by neuromuscular coordination, motor unit recruitment, rate coding, and muscle cross-sectional area.',
    detailedContent: `Strength development depends on two primary factors:
1. Neural Adaptations:
• Motor Unit Recruitment: Activating more muscle fibers simultaneously.
• Rate Coding: Increasing the firing frequency of motor neurons.
• Inter-muscular Coordination: Agonist-antagonist coordination and stabilization.

2. Morphological Adaptations:
• Increase in muscle fiber cross-sectional area (hypertrophy).
• Tendon stiffness and bone mineral density enhancement.

Key Strength Programming Principles:
• Intensity: 75–90% of 1-Rep Max (1RM), typically working in the 1–5 rep range for main lifts.
• Specificity: Regularly practicing the specific movement pattern with high technical proficiency.
• Fatigue Management: Lower volume per session than bodybuilding to maintain high movement velocity and bar speed.`,
    practicalApplication: 'Base your strength program around the "Big 4" compound lifts: Squat, Bench Press, Deadlift, and Overhead Press.',
    coachingCue: 'Create full-body tension before every heavy lift by taking a diaphragmatic breath, bracing your core (Valsalva maneuver), and gripping the bar tightly.',
  },

  // ==========================================
  // 4. NUTRITION & MACRONUTRIENTS
  // ==========================================
  {
    id: 'art-nutrition-protein',
    title: 'Protein: The Building Block of Muscle Tissue',
    titleAm: 'ፕሮቲን፡ የጡንቻ ግንባታ መሰረት (Protein Science)',
    category: 'nutrition',
    keywords: ['protein', 'what is protein', 'how much protein', 'protein synthesis', 'ፕሮቲን', 'የፕሮቲን ጥቅም', 'ስንት ፕሮቲን'],
    summary: 'Protein provides the essential amino acids (especially Leucine) required for Muscle Protein Synthesis (MPS). Optimal intake is 1.6–2.2g per kg of bodyweight per day.',
    detailedContent: `Protein is composed of 20 amino acids, 9 of which are essential (meaning the body cannot synthesize them and they must come from food).

Why You Need Protein:
1. Muscle Protein Synthesis (MPS): L-Leucine acts as the molecular trigger activating the mTOR pathway, which signals the body to repair and synthesize new muscle proteins after resistance training.
2. Muscle Preservation in a Deficit: High protein intake prevents catabolism (muscle loss) when dieting for fat loss.
3. High Satiety (TEF): Protein has the highest Thermic Effect of Food (TEF ~20–30%), meaning 20–30% of its calories are burned during digestion and assimilation.

Optimal Daily Targets:
• Muscle Building (Hypertrophy): 1.6 to 2.2 grams per kg of total bodyweight (0.8–1.0g per lb).
• Fat Loss & Cutting: 2.0 to 2.4 grams per kg to protect lean mass.
• Distribution: 3 to 5 meals per day, each containing 25–45g of high-quality protein (containing at least 2.5–3g of leucine).

Top Ethiopian Protein Sources:
• Non-Fasting: Beef Tibs, Chicken Breast, Eggs, Whole Milk, Ayib (Ethiopian cottage cheese), Fresh Fish.
• Fasting (Plant-based): Shiro (Chickpea flour), Misir Wot (Red Lentils), Kik Alicha (Split Peas), Roasted Peanuts (Ocholoni), Guaya, Roasted Chickpeas (Kolo).`,
    practicalApplication: 'Multiply your bodyweight in kg by 1.8 to 2.0 to establish your daily protein target in grams.',
    coachingCue: 'Spread your protein evenly across your daily meals rather than consuming all of it in a single large dinner.',
  },
  {
    id: 'art-nutrition-calories-energy',
    title: 'Energy Balance: Calories, Maintenance, Deficit & Surplus',
    titleAm: 'የካሎሪ ሚዛን እና ክብደት ቁጥጥር (Energy Balance & Calories)',
    category: 'nutrition',
    keywords: ['calories', 'calorie deficit', 'calorie surplus', 'maintenance calories', 'tdee', 'bmr', 'ካሎሪ', 'የካሎሪ እጥረት', 'ክብደት መቀነስ', 'ክብደት መጨመር'],
    summary: 'Energy balance governs body mass change: Calorie Deficit = Weight Loss; Calorie Surplus = Weight Gain; Caloric Maintenance (TDEE) = Weight Stability.',
    detailedContent: `The Law of Thermodynamics dictates changes in body weight:

1. Total Daily Energy Expenditure (TDEE) consists of:
• Basal Metabolic Rate (BMR ~60–70%): Energy expended at complete rest.
• Non-Exercise Activity Thermogenesis (NEAT ~15%): Unconscious movement, walking, fidgeting.
• Thermic Effect of Food (TEF ~10%): Digestion energy cost.
• Exercise Activity Thermogenesis (EAT ~5–10%): Direct workouts.

2. Calorie Deficit (Fat Loss):
Consuming 300–500 kcal below your TDEE creates steady, sustainable fat loss of approximately 0.5–1.0% of bodyweight per week without excessive hunger or muscle loss.

3. Calorie Surplus (Muscle Gain / Lean Bulking):
Consuming 200–300 kcal above TDEE provides the energetic surplus needed for optimal muscle protein synthesis while keeping fat accumulation minimal.`,
    practicalApplication: 'Track your bodyweight average weekly. If your weight is stagnant over 2 weeks, adjust your daily calories by 200–250 kcal.',
    coachingCue: 'Do not create extreme 1,000+ calorie deficits. Starvation crashes your metabolism, destroys lean muscle, and causes rebound bingeing.',
  },
  {
    id: 'art-nutrition-carbs-fats',
    title: 'Carbohydrates & Dietary Fats: Performance & Hormones',
    titleAm: 'ካርቦሃይድሬት እና ጤናማ ስብ (Carbohydrates & Healthy Fats)',
    category: 'nutrition',
    keywords: ['carbs', 'carbohydrates', 'fats', 'dietary fat', 'fiber', 'ካርቦሃይድሬት', 'ስብ', 'ቅባት', 'ጉልበት'],
    summary: 'Carbohydrates are the primary fuel for high-intensity muscular contractions via glycogen; dietary fats are essential for hormone synthesis (testosterone, estrogen) and cellular health.',
    detailedContent: `Macronutrient Breakdown:

1. Carbohydrates (4 kcal per gram):
• Muscle Glycogen: Anaerobic resistance training relies directly on glycogen stores. Low-carb diets reduce training volume, pump, and bar speed.
• Good Sources: Teff Injera, Oats, Sweet Potatoes, Brown Rice, Barley, Bananas, Papaya.
• Fiber: Aim for 14g of fiber per 1,000 kcal consumed (25–38g daily) for gut microbiome health and glycemic stability.

2. Dietary Fats (9 kcal per gram):
• Hormone Production: Cholesterol and fatty acids are required precursors for steroid hormone synthesis including testosterone.
• Minimum Safe Intake: Never drop dietary fat below 0.6–0.8g per kg of bodyweight (or 20% of total daily calories).
• Sources: Olive oil, Avocados, Whole Eggs, Nuts & Peanuts, Flaxseed (Telba), Fatty Fish.`,
    practicalApplication: 'Structure your carbs around your workouts (pre-workout and post-workout) to maximize training energy and glycogen resynthesis.',
    coachingCue: 'Eat complex carbs (like Teff Injera, Kinche, or Oats) 2–3 hours before training, and simpler carbs (like a banana) 30–45 mins prior.',
  },
  {
    id: 'art-nutrition-hydration',
    title: 'Hydration, Water Intake & Electrolytes for Athletes',
    titleAm: 'የውሃና ኤሌክትሮላይት ፍላጎት በስፖርት (Hydration & Electrolytes)',
    category: 'nutrition',
    keywords: ['water', 'hydration', 'electrolytes', 'how much water', 'ውሃ', 'የውሃ ጥቅም', 'ውሃ መጠጣት'],
    summary: 'Even a 2% loss in body weight from dehydration reduces muscular strength by up to 10% and significantly impairs cognitive focus and recovery.',
    detailedContent: `Why Hydration Matters for Training:
• Intracellular Hydration: Muscle tissue is ~75% water. Adequate cellular hydration increases cell swelling, which acts as an anabolic signal for protein synthesis.
• Joint Lubrication: Synovial fluid in knees, shoulders, and hips requires continuous hydration.
• Thermoregulation: Sweat production cools the body during intense lifting in warm climates.

Daily Water Recommendation:
• Baseline: Bodyweight in kg × 0.035 to 0.040 Liters per day (e.g. 70kg person = ~2.5 to 2.8 Liters).
• Add for Training: +500ml per hour of intense gym training.
• Electrolytes (Sodium, Potassium, Magnesium): Critical for muscular contractions and avoiding cramping. Add a pinch of sea salt to your water on heavy training days.`,
    practicalApplication: 'Monitor your urine color: pale yellow indicates optimal hydration; dark amber signals dehydration.',
    coachingCue: 'Drink 500ml of water immediately upon waking to kickstart metabolic processes and rehydrate after 8 hours of sleep.',
  },

  // ==========================================
  // 5. ETHIOPIAN FOOD KNOWLEDGE & MACROS
  // ==========================================
  {
    id: 'art-ethiopian-food-teff-injera',
    title: 'Teff Injera: The Super-Grain Nutritional Profile',
    titleAm: 'የጤፍ እንጀራ ስነ-ምግብ ይዘት (Teff Injera Nutrition)',
    category: 'ethiopian_food',
    keywords: ['injera', 'teff', 'teff injera', 'እንጀራ', 'ጤፍ', 'የእንጀራ ካሎሪ', 'የጤፍ ጥቅም'],
    summary: 'Teff is an ancient iron-rich gluten-free cereal with a low glycemic index, prebiotic fermentative benefits, and ~7.2g of plant protein per 150g roll.',
    detailedContent: `Teff (Eragrostis tef) is one of the world's most nutrient-dense grains:

Nutritional Profile per 1 Roll Teff Injera (150g cooked):
• Calories: 220 kcal
• Protein: 7.2g
• Carbohydrates: 45.5g
• Fat: 1.2g
• Dietary Fiber: 4.2g
• Micronutrients: Exceptionally rich in Iron, Calcium, Magnesium, Zinc, and resistant starch due to traditional fermentation (Ersho).

Benefits for Athletes:
1. Sustained Glycemic Fuel: Complex slow-digesting carbohydrates keep blood sugar steady without insulin spikes or post-meal sluggishness.
2. Gut Health: Natural 3-day lactic acid fermentation produces prebiotics and probiotics that improve nutrient absorption.
3. Oxygen Transport: High bioavailable iron supports red blood cell production and stamina.`,
    practicalApplication: 'Pair 1–2 rolls of Teff Injera with lean protein sources like Shiro, Misir, Tibs, or Eggs for a balanced bodybuilding meal.',
    coachingCue: 'Pure Teff injera has darker tone, rich fermentation taste, and higher fiber compared to wheat-mixed varieties.',
  },
  {
    id: 'art-ethiopian-food-shiro',
    title: 'Shiro (Chickpea & Pea Stew): Protein, Calories & Calculations',
    titleAm: 'የሽሮ ወጥ ስነ-ምግብ ይዘት እና ስሌት (Shiro Nutrition & Grams)',
    category: 'ethiopian_food',
    keywords: ['shiro', 'shiro wot', 'tegamino', 'ሽሮ', 'ሽሮ ወጥ', 'ተጋሚኖ', 'የሽሮ ፕሮቲን'],
    summary: 'Shiro made from chickpea and split-pea flour is Ethiopia’s premier plant-based protein staple. 1 bowl (200g cooked) provides 290 kcal, 16.2g protein, 38g carbs, and 8.5g fiber.',
    detailedContent: `Shiro is made by grinding dried chickpeas (Shimbira) and split peas (Kik) with garlic, ginger, berbere, and traditional aromatics.

Exact Nutrition Breakdown:
• 100g Cooked Shiro: 145 kcal | 8.1g Protein | 19.0g Carbs | 4.5g Fat | 4.2g Fiber
• 200g Cooked Bowl (Standard): 290 kcal | 16.2g Protein | 38.0g Carbs | 9.0g Fat | 8.5g Fiber
• 250g Cooked Bowl: 362 kcal | 20.3g Protein | 47.5g Carbs | 11.2g Fat | 10.6g Fiber
• 300g Cooked Bowl: 435 kcal | 24.3g Protein | 57.0g Carbs | 13.5g Fat | 13.5g Fiber

Gym Performance Advantages:
1. High Fiber & Satiety: Packed with soluble fiber, preventing hunger during fat-loss phases.
2. Complete Amino Acid Profile when paired with Teff Injera (Chickpea lysine + Teff methionine form a complete complementary plant protein).
3. Cost-Effective: The most budget-friendly athletic fuel in Ethiopia.`,
    practicalApplication: 'To boost protein even further during non-fasting periods, cook Shiro Tegamino with 2 whole scrambled eggs stirred in (Bozena style) for an extra 13g of protein.',
    coachingCue: 'Control the amount of cooking oil or butter (Niter Kibbeh) used in preparation if you are in a fat-loss cutting phase.',
  },
  {
    id: 'art-ethiopian-food-fasting-protein',
    title: 'Fasting (Tsom) High-Protein Ethiopian Foods',
    titleAm: 'የጾም ከፍተኛ ፕሮቲን የኢትዮጵያ ምግቦች (Fasting High Protein Foods)',
    category: 'ethiopian_food',
    keywords: ['fasting', 'tsom', 'የጾም ምግብ', 'ጾም', 'vegan ethiopian', 'የጾም ፕሮቲን'],
    summary: 'You can easily hit 150g+ of daily protein during fasting seasons using combinations of Shiro, Misir, Kik, Guaya, Telba (Flax), Roasted Ocholoni (Peanuts), and Kolo.',
    detailedContent: `Ethiopian fasting traditions are 100% vegan. You can easily meet bodybuilding protein requirements with these staples:

Top Fasting Protein Sources per Serving:
1. Shiro Tegamino (250g): 20.3g Protein
2. Misir Wot / Red Lentils (200g): 17.8g Protein
3. Kik Alicha / Split Peas (200g): 15.6g Protein
4. Roasted Peanuts / Ocholoni (50g handful): 13.0g Protein
5. Kolo / Roasted Barley & Chickpeas (50g): 8.5g Protein
6. Teff Injera (2 rolls, 300g): 14.4g Protein
7. Flaxseed / Telba Juice (2 tbsp ground): 4.0g Protein + Omega-3s

Sample 150g Protein Fasting Daily Meal Plan:
• Breakfast: Kinche (200g) + 40g Roasted Peanuts (22g Protein)
• Lunch: 1.5 Roll Teff Injera + 250g Shiro + Gomen (33g Protein)
• Afternoon Snack: 1 Cup Kolo + Banana (11g Protein)
• Dinner: 1.5 Roll Teff Injera + 200g Misir Wot + Salata (31g Protein)
• Post-workout / Night: Oat-Telba Shake or Soya Milk (25g Protein)
Total: ~122–140g+ clean plant protein.`,
    practicalApplication: 'Combine legumes (lentils, chickpeas, peas) with whole grains (teff, barley, oats) to achieve a complete amino acid profile throughout the day.',
    coachingCue: 'Drink extra water during fasting days because high-fiber legume intake requires adequate hydration for optimal digestive motility.',
  },

  // ==========================================
  // 6. WEIGHT LOSS & FAT LOSS
  // ==========================================
  {
    id: 'art-fat-loss-science',
    title: 'Sustainable Fat Loss: Science, Deficits & Muscle Retention',
    titleAm: 'የስብ ማቃጠልና ዘላቂ ክብደት መቀነስ (Fat Loss Science)',
    category: 'weight_loss',
    keywords: ['fat loss', 'weight loss', 'lose fat', 'burn fat', 'cutting', 'ስብ ማቃጠል', 'ክብደት መቀነስ', 'ቦርጭ ማጥፋት'],
    summary: 'Fat loss requires a controlled calorie deficit (300–500 kcal/day), high protein (2.0–2.4g/kg), heavy resistance training to signal muscle retention, and 7–9 hours of sleep.',
    detailedContent: `Effective fat loss is about maximizing adipose tissue reduction while retaining 100% of your hard-earned muscle mass:

Core Pillars of Fat Loss:
1. Moderate Caloric Deficit:
Aim to lose 0.5% to 1.0% of your total bodyweight per week (e.g. 0.4kg to 0.8kg/week for an 80kg person). Faster weight loss results in muscle wasting and hormonal downregulation.

2. Maintain Heavy Resistance Training:
Do NOT switch to light weights and high reps for "toning." Heavy lifting provides the mechanical tension signal that tells your body: "This muscle tissue is critically needed, burn body fat instead."

3. High Protein Intake (2.0–2.4g/kg):
Protects against muscle catabolism, satisfies hunger via peptide YY release, and burns calories through the thermic effect of food.

4. Daily Steps (NEAT):
Walk 8,000 to 12,000 steps daily. Walking burns calories without elevating cortisol or driving excessive appetite spikes.`,
    practicalApplication: 'Focus on high-volume, low-calorie foods (like Gomen, Timatim Salata, Shiro, and Teff Injera) to keep your stomach full while staying in your calorie deficit.',
    coachingCue: 'Track your weekly average scale weight and waist circumference in centimeters rather than obsessing over day-to-day water weight fluctuations.',
  },

  // ==========================================
  // 7. MUSCLE GAIN & BULKING
  // ==========================================
  {
    id: 'art-muscle-gain-bulking',
    title: 'Lean Bulking: Maximizing Muscle Growth Without Excess Fat',
    titleAm: 'የጡንቻ ክብደት መጨመር (Lean Bulking)',
    category: 'muscle_gain',
    keywords: ['muscle gain', 'bulking', 'lean bulk', 'gain weight', 'ክብደት መጨመር', 'ጡንቻ ማሳደግ', 'የጡንቻ ክብደት'],
    summary: 'A lean bulk uses a modest surplus of 200–350 kcal/day, targeting 1–2 kg of weight gain per month for beginners, and 0.5–1 kg/month for intermediates to minimize fat gain.',
    detailedContent: `The maximum rate of natural muscle synthesis is physiologically limited:
• Beginner Lifters: Can gain ~1.0 to 1.5 kg of muscle per month.
• Intermediate Lifters: Can gain ~0.5 to 0.8 kg of muscle per month.
• Advanced Lifters: Can gain ~0.2 to 0.4 kg of muscle per month.

Dirty Bulking vs Lean Bulking:
• "Dirty Bulking" (1,000+ kcal surplus) results in 80% fat gain and only 20% muscle, leading to insulin resistance, sluggishness, and long painful cutting phases.
• "Lean Bulking" (250–350 kcal surplus) delivers 70–80% lean muscle gain with minimal fat accumulation.

Diet Strategy:
• Base your surplus on clean carbohydrates (Teff Injera, Rice, Oats, Potatoes, Pasta) to fuel heavy progressive overload in the gym.
• Keep protein at 1.8–2.0g/kg.`,
    practicalApplication: 'If your bodyweight increases by more than 2kg in a month after the initial week, reduce your daily calories by 200 kcal.',
    coachingCue: 'Log all your gym lifts diligently. If your bodyweight is going up but your lifting numbers are flat, you are gaining fat, not muscle.',
  },

  // ==========================================
  // 8. RECOVERY & SLEEP
  // ==========================================
  {
    id: 'art-recovery-sleep',
    title: 'Recovery, Sleep & Central Nervous System Fatigue',
    titleAm: 'የእረፍት፣ እንቅልፍ እና የጡንቻ ማገገም ሳይንስ (Recovery & Sleep)',
    category: 'recovery',
    keywords: ['recovery', 'sleep', 'rest day', 'fatigue', 'soreness', 'doms', 'እንቅልፍ', 'እረፍት', 'የጡንቻ ህመም', 'ማገገም'],
    summary: 'Muscles do not grow in the gym; they are broken down during workouts and grow during deep Stage 3 Slow-Wave Sleep when Growth Hormone (GH) and protein synthesis peak.',
    detailedContent: `Recovery encompasses muscular, hormonal, and central nervous system (CNS) restoration:

1. Sleep: The Ultimate Anabolic Tool:
• 7 to 9 hours of quality sleep per night is non-negotiable for serious lifters.
• Deep slow-wave sleep is when 70%+ of daily human growth hormone is secreted.
• Sleeping <6 hours reduces testosterone by 10–15% and increases muscle catabolism by up to 60% during dieting.

2. Delayed Onset Muscle Soreness (DOMS):
• Muscle soreness peak 24–48 hours post-workout due to micro-tears in the myofibrils and connective tissue.
• Soreness is NOT a mandatory indicator of a good workout; progressive overload is the true metric.

3. Deload Weeks:
Every 6 to 10 weeks of hard progressive training, schedule a deload week: reduce training volume by 50% while keeping weights moderate (RPE 6–7) to allow joints, tendons, and the nervous system to fully regenerate.`,
    practicalApplication: 'Keep your bedroom dark, quiet, and cool, and avoid bright smartphone screens 45 minutes before sleep.',
    coachingCue: 'Listen to your body. If your resting heart rate is elevated and your motivation has plummeted for 3 straight days, take an active rest day.',
  },

  // ==========================================
  // 9. CARDIO & CONDITIONING
  // ==========================================
  {
    id: 'art-cardio-conditioning',
    title: 'Cardiovascular Training: Zone 2, HIIT & Strength Integration',
    titleAm: 'የካርዲዮና የልብ ጤና ስልጠና (Cardio & Conditioning)',
    category: 'cardio',
    keywords: ['cardio', 'running', 'hiit', 'zone 2', 'walking', 'cycling', 'ካርዲዮ', 'መሮጥ', 'ዋኪንግ', 'የልብ ጤና'],
    summary: 'Combining Zone 2 low-intensity steady-state (LISS) with lifting enhances mitochondrial density, capillary network, and recovery between heavy sets without interfering with muscle gains.',
    detailedContent: `Cardio is essential for cardiovascular longevity, work capacity, and fat loss:

Cardio Modalities:
1. Low-Intensity Steady State (Zone 2 LISS):
• Performed at 60–70% of max heart rate (you can maintain a conversation without gasping).
• Examples: Incline treadmill walking, brisk outdoor walking, light cycling.
• Benefit: Zero impact on joints, negligible CNS fatigue, builds mitochondrial base.

2. High-Intensity Interval Training (HIIT):
• Short bursts of maximal effort (e.g. 20s sprint / 40s rest for 10–15 mins).
• Benefit: High calorie burn per minute, improves VO2 max.
• Recovery cost: Higher CNS fatigue; limit to 1–2 sessions weekly.

The "Interference Effect":
Doing excessive high-impact running immediately before lifting activates AMPK, which can blunt the mTOR muscle-building pathway.
Solution: Perform cardio AFTER your lifting session or on separate days / separate times.`,
    practicalApplication: 'Aim for 150 minutes of moderate aerobic activity per week (or 8,000–10,000 steps daily) alongside 3–5 resistance training sessions.',
    coachingCue: 'Do your heavy squats and presses first when your energy and nervous system are freshest, then finish with cardio.',
  },

  // ==========================================
  // 10. MOBILITY & DYNAMIC WARMUPS
  // ==========================================
  {
    id: 'art-mobility-warmup',
    title: 'Dynamic Warmup & Mobility Protocols for Injury Prevention',
    titleAm: 'የሰውነት ማፍታታት እና የመተጣጠፍ ስልጠና (Mobility & Warmup)',
    category: 'mobility',
    keywords: ['mobility', 'flexibility', 'warmup', 'stretching', 'dynamic warmup', 'ማፍታታት', 'የሰውነት ማሟሟቅ', 'መወጠር'],
    summary: 'Perform dynamic mobility before workouts to elevate core temperature and synovial fluid; save passive static stretching for post-workout or recovery days.',
    detailedContent: `Proper preparation optimizes joint biomechanics and reduces acute injury risk:

1. Dynamic Warmup (Pre-Workout, 5–10 mins):
• Goal: Increase core temperature, lubricate joint capsules, activate nervous system.
• Exercises: Arm circles, Cat-Cow, World’s Greatest Stretch, Hip 90/90s, Bodyweight Squats, Leg Swings.
• Why Avoid Static Stretching Pre-Workout? Prolonged passive stretching (>45s per muscle) temporarily reduces peak force output and tendon stiffness by 5–8%.

2. Specific Exercise Warmup:
Always perform 2–3 ramp-up sets on your first heavy compound movement:
• Set 1: Bar only × 10 reps (warmup)
• Set 2: 50% working weight × 5 reps
• Set 3: 75% working weight × 2 reps
• Working Sets: Full target weight.

3. Post-Workout Static Stretching:
Hold stretches for 30–60 seconds after your workout when muscles are warm to improve resting muscle length and reduce tendon tension.`,
    practicalApplication: 'Spend 5 minutes on dynamic hip and thoracic mobility before every leg and push workout.',
    coachingCue: 'Move through your warmup with control; do not bounce aggressively at the end range of motion.',
  },

  // ==========================================
  // 11. PROGRAM DESIGN
  // ==========================================
  {
    id: 'art-program-design',
    title: 'Professional Program Design & Weekly Training Splits',
    titleAm: 'የስልጠና ፕሮግራም አወቃቀርና ምርጫ (Program Design & Splits)',
    category: 'programming',
    keywords: ['program design', 'workout routine', 'split', 'ppl', 'full body', 'upper lower', 'የስፖርት ፕሮግራም', 'ሳምንታዊ ፕሮግራም'],
    summary: 'Match your training split to your weekly frequency: 3 days = Full Body; 4 days = Upper/Lower; 5–6 days = Push/Pull/Legs (PPL) or Arnold Split.',
    detailedContent: `The best training program is the one you can adhere to consistently for 12+ weeks:

Evidence-Based Weekly Splits:

1. 3 Days Per Week: Full Body (Mon / Wed / Fri)
• Best for: Beginners, busy professionals, general fitness.
• Structure: 1 Squat pattern, 1 Hinge pattern, 1 Push, 1 Pull, 1 Core per session.
• Benefit: Hits every muscle 3 times per week with high frequency.

2. 4 Days Per Week: Upper / Lower (Mon / Tue / Thu / Fri)
• Best for: Intermediate lifters, building strength and balanced hypertrophy.
• Structure: Upper A, Lower A, Rest, Upper B, Lower B, Rest, Rest.
• Benefit: Optimal recovery balance and exercise focus.

3. 5–6 Days Per Week: Push / Pull / Legs (PPL)
• Best for: Dedicated bodybuilders and advanced trainees.
• Structure: Push (Chest/Shoulders/Triceps), Pull (Back/Biceps/Rear Delts), Legs (Quads/Hamstrings/Glutes/Calves), Rest, Repeat.
• Benefit: Maximum volume per muscle group with dedicated specialization.`,
    practicalApplication: 'Choose a program based on your true lifestyle availability. A 3-day routine completed 100% beats an abandoned 6-day plan.',
    coachingCue: 'Order your exercises from most neurologically demanding (heavy multi-joint barbell compounds) to least demanding (isolated machine single-joint cables).',
  },

  // ==========================================
  // 12. SAFETY & MEDICAL BOUNDARIES
  // ==========================================
  {
    id: 'art-safety-medical-boundaries',
    title: 'Safety Guidelines, Red Flags & Professional Boundaries',
    titleAm: 'የደህንነት ደንቦች እና የህክምና ማስጠንቀቂያዎች (Safety & Red Flags)',
    category: 'safety',
    keywords: ['safety', 'injury', 'pain', 'doctor', 'medical', 'warning', 'ደህንነት', 'ህመም', 'ጉዳት'],
    summary: 'Train with safe biomechanics, avoid dangerous extremes (dehydration, starvation, steroids), and always refer acute joint pain or medical symptoms to a licensed healthcare professional.',
    detailedContent: `Professional Personal Trainer Ethical & Safety Code:

1. Discomfort vs Sharp Joint Pain:
• Normal: Deep muscular burning, metabolic fatigue, mild post-workout soreness (DOMS).
• Red Flags: Sharp shooting pain, joint clicking with pain, nerve numbness, sudden dizziness, or chest tightness. STOP the exercise immediately.

2. Zero Tolerance for Dangerous Practices:
• Never engage in extreme dehydration or sauna suits for rapid weight loss.
• Never adopt starvation diets (<1,000 kcal).
• Avoid anabolic steroids, unverified black-market fat burners, or dangerous stimulants.

3. Medical Referral Protocol:
Fitness coaches and AI trainers do NOT diagnose medical conditions, prescribe pharmaceuticals, or treat orthopedic pathologies. When a user presents with acute injury, cardiac symptoms, or chronic metabolic disease, the system must immediately and unequivocally advise consulting a licensed physician.`,
    practicalApplication: 'Warm up properly, use safety spotter arms on barbell racks, and check your ego at the door.',
    coachingCue: 'Weight is only a tool to challenge the muscle; never sacrifice technique for vanity numbers.',
  },
];

/**
 * Fuzzy search helper for robust keyword & typo tolerance
 */
export function searchFitnessKnowledge(query: string): FitnessKnowledgeArticle[] {
  const cleanQ = query.toLowerCase().trim();
  if (!cleanQ) return [];

  // Normalize common variations and typos
  const normalized = cleanQ
    .replace(/\b(bicep|bycep)\b/g, 'biceps')
    .replace(/\b(tricep|trycep)\b/g, 'triceps')
    .replace(/\b(protien|protin)\b/g, 'protein')
    .replace(/\b(calory|calori)\b/g, 'calorie')
    .replace(/\b(lat pull down|latpull down)\b/g, 'lat pulldown')
    .replace(/\b(shirow|shirro)\b/g, 'shiro')
    .replace(/\b(enjera|injara)\b/g, 'injera');

  const matches: { article: FitnessKnowledgeArticle; score: number }[] = [];

  for (const art of FITNESS_KNOWLEDGE_ARTICLES) {
    let score = 0;

    // Check title matches
    if (art.title.toLowerCase().includes(normalized)) score += 10;
    if (art.titleAm && art.titleAm.includes(normalized)) score += 10;

    // Check keyword matches
    for (const kw of art.keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        score += 8;
      } else if (kw.toLowerCase().includes(normalized)) {
        score += 5;
      }
    }

    // Check content summary
    if (art.summary.toLowerCase().includes(normalized)) score += 3;
    if (art.detailedContent.toLowerCase().includes(normalized)) score += 2;

    if (score > 0) {
      matches.push({ article: art, score });
    }
  }

  return matches.sort((a, b) => b.score - a.score).map((m) => m.article);
}

/**
 * Deterministic search & query answering for Jossy AI Coach
 */
export interface JossyAIQueryResponse {
  text: string;
  matchedArticle?: FitnessKnowledgeArticle;
  isAcademyRecommendation?: boolean;
  isMedicalWarning?: boolean;
  exerciseRecommendations?: any[];
  foodBreakdowns?: any[];
  totalCalories?: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFat?: number;
  totalFiber?: number;
  isAmbiguous?: boolean;
  ambiguousOptions?: { label: string; query: string }[];
  isUnknownFood?: boolean;
  userProteinTarget?: number;
  userCurrentProtein?: number;
  userCalorieTarget?: number;
  userCurrentCalories?: number;
  memberDaysRemaining?: number;
}

export function handleFitnessAndCoachingQuery(
  rawQuery: string,
  user: UserProfile,
  consumedStats: { calories: number; proteinG: number; carbsG: number; fatG: number; fiberG: number },
  loggedMeals: LoggedMeal[] = [],
  completedWorkouts: CompletedWorkout[] = [],
  membershipSummary?: MembershipSummary | null
): JossyAIQueryResponse {
  const isAmharic = user.language === 'am';
  const firstName = user.name ? user.name.trim().split(' ')[0] : isAmharic ? 'ስፖርተኛ' : 'Athlete';
  const q = rawQuery.toLowerCase().trim();

  // 1. Check for Academy intent (e.g. "I want to become a personal trainer")
  if (
    q.includes('personal trainer') ||
    q.includes('become a trainer') ||
    q.includes('trainer academy') ||
    q.includes('አሰልጣኝ መሆን') ||
    q.includes('የአሰልጣኝ ትምህርት') ||
    q.includes('አካዳሚ') ||
    q.includes('ትምህርት') ||
    q.includes('course')
  ) {
    const text = isAmharic
      ? `እንኳን ደህና መጡ ${firstName}! 🏆\n\nየዳጊ ፊትነስ የግል አሰልጣኝ አካዳሚን (Dagi Fitness Personal Trainer Academy) አዘጋጅቼልዎታለሁ።\n\nከሰውነት አናቶሚና ባዮሜካኒክስ ጀምሮ እስከ ስነ-ምግብ፣ የፕሮግራም አወቃቀር እና የደንበኞች ደህንነት ስልጠና ድረስ ያሉ 20 ጥልቅ ዩኒቶችን (Units) እና የብቃት ማረጋገጫ ፈተናዎችን ደረጃ በደረጃ ይማራሉ።\n\nትምህርቱን ለመጀመር ከታች ያለውን "📚 የግል አሰልጣኝ ይሁኑ" የሚለውን ይጫኑ!`
      : `Welcome ${firstName}! 🏆\n\nI've opened the Dagi Fitness Personal Trainer Academy for you.\n\nOur structured curriculum teaches you step-by-step from human biomechanics and hypertrophy science to sports nutrition, periodization, and client safety across 20 comprehensive units with rigorous 15-question milestone assessments.\n\nClick the "📚 Become a Personal Trainer" button below to begin Unit 1!`;

    return {
      text,
      isAcademyRecommendation: true,
    };
  }

  // 2. Check for Medical symptoms or dangerous requests
  if (
    q.includes('sharp pain') ||
    q.includes('chest pain') ||
    q.includes('dizzy') ||
    q.includes('heart palpitation') ||
    q.includes('steroid') ||
    q.includes('anabolic') ||
    q.includes('starve') ||
    q.includes('የደረት ህመም') ||
    q.includes('ከባድ ህመም') ||
    q.includes('ጭንቅላት ማዞር')
  ) {
    const text = isAmharic
      ? `⚠️ አስፈላጊ የደህንነት እና የህክምና ማሳሰቢያ ${firstName}:\n\nእንደ የግል ስፖርትና ስነ-ምግብ ረዳት፣ የህክምና ምርመራ ወይም ህክምና መስጠት አልችልም። የገለጹት ምልክት የህክምና ክትትል የሚያስፈልገው ሊሆን ስለሚችል ወዲያውኑ ስፖርቱን አቁመው ብቁ የጤና ባለሙያ ወይም ሀኪም እንዲያማክሩ በጥብቅ እመክራለሁ።\n\nደህንነትዎ ሁልጊዜ ቅድሚያ የሚሰጠው ጉዳይ ነው!`
      : `⚠️ Important Safety & Medical Notice ${firstName}:\n\nAs your fitness and nutrition coach, I cannot diagnose medical conditions or prescribe treatments. If you are experiencing sharp joint pain, dizziness, chest tightness, or injury symptoms, please stop exercising immediately and consult a qualified physician or medical professional.\n\nYour health and safety always come first!`;

    return {
      text,
      isMedicalWarning: true,
    };
  }

  // 3. Check for Live User State & Today's Logs
  if (
    q.includes('how many calories did i eat') ||
    q.includes('calories today') ||
    q.includes('how much calories') ||
    q.includes('ዛሬ ስንት ካሎሪ በላሁ') ||
    q.includes('የዛሬ ካሎሪ')
  ) {
    const target = user.targetCalories || 2400;
    const remaining = Math.max(0, target - consumedStats.calories);
    const text = isAmharic
      ? `የዛሬው የካሎሪ መረጃዎ ${firstName}፦\n\n🔥 እስካሁን የተመዘገበው፦ ${consumedStats.calories} kcal\n🎯 የዕለት ዒላማዎ፦ ${target} kcal\n⏳ የሚቀርዎት፦ ${remaining} kcal\n\nየተመዘገቡ ምግቦች ብዛት፦ ${loggedMeals.length}`
      : `Here is your logged calorie status today, ${firstName}:\n\n🔥 Consumed So Far: ${consumedStats.calories} kcal\n🎯 Daily Target: ${target} kcal\n⏳ Remaining: ${remaining} kcal\n\nTotal meals logged today: ${loggedMeals.length}`;

    return {
      text,
      totalCalories: consumedStats.calories,
      userCalorieTarget: target,
    };
  }

  if (
    q.includes('how much protein did i eat') ||
    q.includes('how much protein have i eaten') ||
    q.includes('protein today') ||
    q.includes('ስንት ፕሮቲን በላሁ') ||
    q.includes('የዛሬ ፕሮቲን')
  ) {
    const target = user.targetProteinG || 150;
    const remaining = Math.max(0, target - consumedStats.proteinG);
    const text = isAmharic
      ? `የዛሬው የፕሮቲን እድገትዎ ${firstName}፦\n\n💪 እስካሁን የተመዘገበው፦ ${consumedStats.proteinG}g\n🎯 የዕለት ዒላማዎ፦ ${target}g\n⏳ የሚቀርዎት፦ ${remaining}g ፕሮቲን\n\nየፕሮቲን ግብዎን ለማሳካት እንደ ሽሮ፣ እንቁላል፣ ጥብስ ወይም ምስር ያሉ ምግቦችን ይመገቡ።`
      : `Here is your protein progress today, ${firstName}:\n\n💪 Consumed So Far: ${consumedStats.proteinG}g\n🎯 Daily Target: ${target}g\n⏳ Remaining: ${remaining}g\n\nReach your target with high-protein staples like Shiro, Eggs, Beef Tibs, or Misir.`;

    return {
      text,
      totalProtein: consumedStats.proteinG,
      userProteinTarget: target,
    };
  }

  // 4. Check for Membership status / Days remaining
  if (
    q.includes('membership') ||
    q.includes('days left') ||
    q.includes('how many days are left') ||
    q.includes('payment due') ||
    q.includes('አባልነት') ||
    q.includes('ስንት ቀን ቀረኝ') ||
    q.includes('ክፍያ')
  ) {
    if (membershipSummary) {
      const days = membershipSummary.daysRemaining;
      const status = membershipSummary.paymentStatus;
      const text = isAmharic
        ? `የአባልነት ሁኔታዎ ${firstName}፦\n\n🎫 ደረጃ፦ ${membershipSummary.memberTier}\n📅 የአሁን ዙር፦ ዙር ${membershipSummary.currentCycleNumber}\n⏳ የቀሩት ቀናት፦ ${days} ቀናት\n💳 የክፍያ ሁኔታ፦ ${status === 'paid' ? 'የተከፈለ (Paid) ✅' : 'ክፍያ ይጠበቃል ⚠️'}\n📌 ቀጣይ የመክፈያ ቀን፦ ${membershipSummary.nextPaymentDueDateEth || membershipSummary.nextPaymentDueDate}`
        : `Your Dagi Fitness Membership Status, ${firstName}:\n\n🎫 Tier: ${membershipSummary.memberTier}\n📅 Current Cycle: Cycle #${membershipSummary.currentCycleNumber}\n⏳ Days Remaining: ${days} days\n💳 Payment Status: ${status === 'paid' ? 'Paid & Active ✅' : 'Payment Due ⚠️'}\n📌 Next Due Date: ${membershipSummary.nextPaymentDueDateEth || membershipSummary.nextPaymentDueDate}`;

      return {
        text,
        memberDaysRemaining: days,
      };
    } else {
      const text = isAmharic
        ? `የእርስዎ የቪአይፒ አባልነት ንቁ ነው ${firstName}። የክፍያና የኢትዮጵያ ቀን መረጃዎን በፕሮፋይል ክፍል ውስጥ መመልከት ይችላሉ።`
        : `Your VIP membership is currently active, ${firstName}. You can view your cycle breakdown and Ethiopian calendar dates under your Profile.`;
      return { text };
    }
  }

  // 5. Gram-based Ethiopian Food Calculation (e.g. "How much protein is in 250g of shiro?")
  const gramMatch = q.match(/(\d+)\s*(?:g|grams?|ግራም)\s*(?:of|የ)?\s*([a-z\s]+)/i) ||
                    q.match(/([a-z\s]+)\s*(\d+)\s*(?:g|grams?|ግራም)/i);

  if (gramMatch) {
    let grams = 0;
    let foodTerm = '';

    if (!isNaN(Number(gramMatch[1]))) {
      grams = parseInt(gramMatch[1], 10);
      foodTerm = gramMatch[2].trim();
    } else {
      foodTerm = gramMatch[1].trim();
      grams = parseInt(gramMatch[2], 10);
    }

    // Find food in database
    const food = FOOD_DATABASE.find(
      (f) =>
        f.nameEn.toLowerCase().includes(foodTerm) ||
        f.nameAm.includes(foodTerm) ||
        (f.aliases && f.aliases.some((a) => a.toLowerCase().includes(foodTerm)))
    );

    if (food && grams > 0) {
      const multiplier = grams / (food.servingGrams || 100);
      const calcCalories = Math.round(food.calories * multiplier);
      const calcProt = Math.round(food.proteinG * multiplier * 10) / 10;
      const calcCarb = Math.round(food.carbsG * multiplier * 10) / 10;
      const calcFat = Math.round(food.fatG * multiplier * 10) / 10;
      const calcFiber = Math.round((food.fiberG || 0) * multiplier * 10) / 10;

      const text = isAmharic
        ? `በ ${grams}g ${food.nameAm} ውስጥ የሚገኘው ትክክለኛ የንጥረ-ምግብ ይዘት ከዳጊ ፊትነስ ዳታቤዝ የተሰላው፦\n\n🔥 ካሎሪ፦ ${calcCalories} kcal\n💪 ፕሮቲን፦ ${calcProt}g\n🌾 ካርቦሃይድሬት፦ ${calcCarb}g\n🥑 ስብ፦ ${calcFat}g\n🥗 ፋይበር፦ ${calcFiber}g\n\nይህንን ምግብ ወደ ዕለት ማስታወሻዎ መመዝገብ ይችላሉ!`
        : `Exact verified nutritional breakdown for ${grams}g of ${food.nameEn} calculated from the Dagi Fitness database:\n\n🔥 Calories: ${calcCalories} kcal\n💪 Protein: ${calcProt}g\n🌾 Carbohydrates: ${calcCarb}g\n🥑 Dietary Fat: ${calcFat}g\n🥗 Fiber: ${calcFiber}g\n\nYou can log this meal directly to your daily diary!`;

      const breakdown = {
        foodItem: food,
        quantity: multiplier,
        portionLabel: `${grams}g`,
        calculatedCalories: calcCalories,
        calculatedProtein: calcProt,
        calculatedCarbs: calcCarb,
        calculatedFat: calcFat,
        calculatedFiber: calcFiber,
        calculatedSugar: 0,
      };

      return {
        text,
        foodBreakdowns: [breakdown],
        totalCalories: calcCalories,
        totalProtein: calcProt,
        totalCarbs: calcCarb,
        totalFat: calcFat,
        totalFiber: calcFiber,
      };
    }
  }

  // 6. Custom Workout Creation (e.g. "Create a beginner chest workout")
  if (
    q.includes('chest workout') ||
    q.includes('create a workout') ||
    q.includes('beginner workout') ||
    q.includes('leg workout') ||
    q.includes('back workout') ||
    q.includes('የደረት ስፖርት') ||
    q.includes('የእግር ስፖርት') ||
    q.includes('የጀርባ ስፖርት')
  ) {
    let target = 'Mid Pecs & Front Delts';
    let title = isAmharic ? 'የደረት ስልጠና ፕሮግራም' : 'Chest Hypertrophy Routine';

    if (q.includes('leg') || q.includes('እግር')) {
      target = 'Quads, Glutes & Calves';
      title = isAmharic ? 'የእግር ስልጠና ፕሮግራም' : 'Lower Body Routine';
    } else if (q.includes('back') || q.includes('ጀርባ')) {
      target = 'Lats & Upper Back';
      title = isAmharic ? 'የጀርባ ስልጠና ፕሮግራም' : 'Back & Pull Routine';
    }

    const relevantExercises = MASTER_EXERCISES.filter((ex) =>
      ex.targetMuscle.toLowerCase().includes(target.toLowerCase()) ||
      (ex.secondaryMuscles && ex.secondaryMuscles.some((m) => m.toLowerCase().includes(target.toLowerCase())))
    ).slice(0, 4);

    const expLevel = user.experience || (user as any).experienceLevel || 'intermediate';

    const text = isAmharic
      ? `የተዘጋጀ ${title} ለእርስዎ (${expLevel})፦\n\n` +
        relevantExercises
          .map(
            (ex, i) =>
              `${i + 1}. ${ex.name} — 3 ስብስቦች × 8-12 ድግግሞሽ (እረፍት፡ ${ex.defaultRestSec} ሰከንድ)\n   💡 ጠቃሚ ምክር፡ ${ex.trainingTip || 'ትክክለኛውን ፎርም ይጠብቁ'}`
          )
          .join('\n\n') +
        `\n\n📌 የማሞቂያ መመሪያ፡ 5 ደቂቃ ማፍታታት እና 2 የቀላል ክብደት ስብስቦችን ይስሩ።`
      : `Custom ${title} tailored to your profile (${expLevel} level):\n\n` +
        relevantExercises
          .map(
            (ex, i) =>
              `${i + 1}. ${ex.name} — 3 sets × 8–12 reps (Rest: ${ex.defaultRestSec}s)\n   💡 Trainer Cue: ${ex.trainingTip || 'Control the eccentric phase'}`
          )
          .join('\n\n') +
        `\n\n📌 Warmup Protocol: 5 mins dynamic mobility + 2 ramp-up warmup sets before heavy working sets.`;

    return {
      text,
      exerciseRecommendations: relevantExercises,
    };
  }

  // 7. General Knowledge Database Search (Hypertrophy, Strength, Anatomy, Nutrition, etc.)
  const matchedArticles = searchFitnessKnowledge(q);
  if (matchedArticles.length > 0) {
    const art = matchedArticles[0];
    const text = isAmharic && art.titleAm
      ? `📖 ${art.titleAm}\n\n${art.summary}\n\n${art.detailedContent}\n\n💡 የአሰልጣኝ ምክር፦ ${art.coachingCue || art.practicalApplication}`
      : `📖 ${art.title}\n\n${art.summary}\n\n${art.detailedContent}\n\n💡 Coach's Tip: ${art.coachingCue || art.practicalApplication}`;

    return {
      text,
      matchedArticle: art,
    };
  }

  // Fallback: If no direct fitness article matched, let the regular food parser handle it or return helpful guidance
  return {
    text: '',
  };
}
