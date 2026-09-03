import { WorkoutRoutine, Exercise, UserGoal, ExperienceLevel, EquipmentType, CompletedWorkout } from '../types';

// Comprehensive Master Exercise Database with Biomechanical Details, Tips, and Safety Protocols
export const MASTER_EXERCISES: Exercise[] = [
  // --- CHEST & PUSH (Gym / Barbell / DB) ---
  {
    id: 'ex-barbell-bench-press',
    name: 'Barbell Flat Bench Press',
    targetMuscle: 'Mid Pecs & Front Delts',
    secondaryMuscles: ['Triceps', 'Serratus Anterior'],
    equipment: 'Barbell & Flat Bench',
    instructions: [
      'Lie flat, plant feet firmly into the floor, and pull shoulder blades together and down.',
      'Grip the bar slightly wider than shoulder width with wrists vertically stacked.',
      'Unrack and lower the bar under control (3 seconds) to the lower sternum.',
      'Press upward explosively while driving through the floor and contracting pecs.',
    ],
    trainingTip: 'Focus on bending the bar slightly inwards to maximize pec recruitment and protect shoulder joints.',
    safety: 'Always use a safety rack or spotter when lifting near failure. Keep lower back with a natural mild arch, not hyper-extended.',
    tempo: '3-1-1-0',
    defaultRestSec: 120,
    animationType: 'chest_press',
    phaseDescriptions: {
      start: 'Wrists stacked over elbows, scapulae fully retracted.',
      movement: 'Lower bar smoothly to lower sternum over 3 controlled seconds.',
      peak: 'Brief pause at chest without bouncing off ribcage.',
      finish: 'Drive up with full pectoral squeeze, lock out elbows softly.',
    },
    sets: [
      { setNumber: 1, reps: 8, weightKg: 70, isCompleted: false },
      { setNumber: 2, reps: 8, weightKg: 75, isCompleted: false },
      { setNumber: 3, reps: 6, weightKg: 80, isCompleted: false },
    ],
  },
  {
    id: 'ex-incline-db-press',
    name: 'Incline Dumbbell Press',
    targetMuscle: 'Upper Clavicular Pecs',
    secondaryMuscles: ['Anterior Deltoids', 'Triceps'],
    equipment: 'Dumbbells & 30° Incline Bench',
    instructions: [
      'Set bench to a 30 to 45 degree angle for optimal clavicular activation.',
      'Kick dumbbells to shoulder height, keep scapulae pinned to bench.',
      'Lower dumbbells until upper arms are slightly below parallel to ground.',
      'Press up in a converging arc without banging dumbbells together at peak.',
    ],
    trainingTip: 'Avoid bench angles higher than 45° to prevent excessive front shoulder takeover.',
    safety: 'Lower weights smoothly; never drop dumbbells directly outward to the side.',
    tempo: '3-0-1-0',
    defaultRestSec: 90,
    animationType: 'chest_press',
    phaseDescriptions: {
      start: 'Dumbbells at shoulder height, chest proud, core braced.',
      movement: 'Lower dumbbells wide with elbows angled at 45 degrees.',
      peak: 'Deep pectoral stretch at bottom without shoulder strain.',
      finish: 'Drive upwards in a slight inward arc, contracting upper pecs.',
    },
    sets: [
      { setNumber: 1, reps: 10, weightKg: 24, isCompleted: false },
      { setNumber: 2, reps: 10, weightKg: 26, isCompleted: false },
      { setNumber: 3, reps: 8, weightKg: 28, isCompleted: false },
    ],
  },
  {
    id: 'ex-cable-chest-fly',
    name: 'Standing Cable Chest Fly',
    targetMuscle: 'Sternal Pectorals',
    secondaryMuscles: ['Anterior Delts'],
    equipment: 'Dual Cable Pulley',
    instructions: [
      'Set pulleys at chest height, step forward into a staggered stance.',
      'Keep slight bend in elbows and sweep hands together in front of chest.',
      'Squeeze pecs hard for 1 second at peak convergence.',
      'Resist cable tension back slowly until feeling a comfortable stretch.',
    ],
    trainingTip: 'Think about bringing your inner elbows together rather than just your hands.',
    safety: 'Do not let cables violently pull shoulders behind torso.',
    tempo: '2-1-1-1',
    defaultRestSec: 60,
    animationType: 'chest_press',
    sets: [
      { setNumber: 1, reps: 12, weightKg: 15, isCompleted: false },
      { setNumber: 2, reps: 12, weightKg: 17.5, isCompleted: false },
      { setNumber: 3, reps: 12, weightKg: 17.5, isCompleted: false },
    ],
  },

  // --- SHOULDERS & TRICEPS (Gym / DB) ---
  {
    id: 'ex-seated-db-overhead-press',
    name: 'Seated DB Overhead Shoulder Press',
    targetMuscle: 'Anterior & Lateral Deltoids',
    secondaryMuscles: ['Triceps', 'Upper Traps'],
    equipment: 'Dumbbells & 90° Bench',
    instructions: [
      'Sit tall with core engaged and feet planted flat.',
      'Press dumbbells vertically overhead in a smooth natural line of motion.',
      'Pause slightly at peak overhead reach with arms aligned with ears.',
      'Lower weights down with control until elbows reach 90 degrees.',
    ],
    trainingTip: 'Avoid flaring elbows 90° directly to the side; keep elbows angled 30° forward in the scapular plane.',
    safety: 'Keep ribcage pulled down; do not arch lower back away from the bench backrest.',
    tempo: '3-0-1-0',
    defaultRestSec: 90,
    animationType: 'shoulder_press',
    phaseDescriptions: {
      start: 'Dumbbells at ear level, forearms vertical.',
      movement: 'Press upward smoothly while bracing the midsection.',
      peak: 'Dumbbells centered overhead over crown of head.',
      finish: 'Lower controlled back to ear height.',
    },
    sets: [
      { setNumber: 1, reps: 10, weightKg: 18, isCompleted: false },
      { setNumber: 2, reps: 10, weightKg: 20, isCompleted: false },
      { setNumber: 3, reps: 8, weightKg: 22, isCompleted: false },
    ],
  },
  {
    id: 'ex-cable-lateral-raise',
    name: 'Cable Lateral Raise',
    targetMuscle: 'Lateral Deltoids',
    secondaryMuscles: ['Traps'],
    equipment: 'Low Cable Pulley',
    instructions: [
      'Set pulley to wrist height, stand tall with cable crossing behind or in front.',
      'Raise arm smoothly out to side until parallel to floor.',
      'Lead with elbows slightly higher than wrists.',
      'Lower slowly over 3 seconds under active cable tension.',
    ],
    trainingTip: 'Pour the water: keep pinkies slightly tilted upwards at peak contraction.',
    safety: 'Do not use torso swing or momentum to heave the load.',
    tempo: '2-1-1-0',
    defaultRestSec: 60,
    animationType: 'lateral_raise',
    sets: [
      { setNumber: 1, reps: 15, weightKg: 7.5, isCompleted: false },
      { setNumber: 2, reps: 15, weightKg: 7.5, isCompleted: false },
      { setNumber: 3, reps: 12, weightKg: 10, isCompleted: false },
    ],
  },
  {
    id: 'ex-tricep-rope-pushdown',
    name: 'Triceps Rope Cable Pushdown',
    targetMuscle: 'Triceps Lateral & Medial Head',
    secondaryMuscles: ['Anconeus'],
    equipment: 'High Cable & Rope',
    instructions: [
      'Pin elbows firmly against your ribcage with chest upright.',
      'Extend forearms downward, spreading rope ends apart at full lockout.',
      'Squeeze triceps for 1 full second at bottom contraction.',
      'Control the return back to a 90 degree elbow bend.',
    ],
    trainingTip: 'Keep upper arms completely stationary throughout the entire rep.',
    safety: 'Avoid leaning over the cable or using bodyweight to push down.',
    tempo: '2-1-1-1',
    defaultRestSec: 60,
    animationType: 'tricep_dips',
    sets: [
      { setNumber: 1, reps: 12, weightKg: 22.5, isCompleted: false },
      { setNumber: 2, reps: 12, weightKg: 25, isCompleted: false },
      { setNumber: 3, reps: 10, weightKg: 27.5, isCompleted: false },
    ],
  },

  // --- BACK & BICEPS (Gym / Barbell / DB) ---
  {
    id: 'ex-lat-pulldown',
    name: 'Wide-Grip Lat Pulldown',
    targetMuscle: 'Latissimus Dorsi',
    secondaryMuscles: ['Biceps', 'Rhomboids', 'Teres Major'],
    equipment: 'Lat Pulldown Machine',
    instructions: [
      'Grip bar slightly wider than shoulders, secure thighs under pads.',
      'Initiate pull by depressing shoulder blades down and back.',
      'Drive elbows down towards hips until bar reaches upper chest.',
      'Slowly extend arms overhead with full lat stretch at top.',
    ],
    trainingTip: 'Think of pulling with your elbows rather than pulling with your grip.',
    safety: 'Never pull the bar behind your neck to protect cervical spine and rotator cuffs.',
    tempo: '3-1-1-0',
    defaultRestSec: 90,
    animationType: 'pullup',
    phaseDescriptions: {
      start: 'Full arm extension with active lat pre-stretch.',
      movement: 'Depress scapulae and drive elbows down toward ribs.',
      peak: 'Bar touches collarbone, lats fully contracted.',
      finish: 'Return upward over 3 controlled seconds.',
    },
    sets: [
      { setNumber: 1, reps: 10, weightKg: 55, isCompleted: false },
      { setNumber: 2, reps: 10, weightKg: 60, isCompleted: false },
      { setNumber: 3, reps: 8, weightKg: 65, isCompleted: false },
    ],
  },
  {
    id: 'ex-bent-over-barbell-row',
    name: 'Bent-Over Barbell Row',
    targetMuscle: 'Mid-Back, Rhomboids & Lats',
    secondaryMuscles: ['Biceps', 'Rear Delts', 'Spinal Erectors'],
    equipment: 'Barbell',
    instructions: [
      'Hinge at hips at 45 degrees with knees slightly bent and spine flat.',
      'Grip bar overhand slightly outside knee width.',
      'Row the bar smoothly towards lower abdomen/belly button.',
      'Squeeze shoulder blades firmly together at top contraction.',
    ],
    trainingTip: 'Maintain neutral spine from tailbone to neck; avoid jerking torso upright.',
    safety: 'Keep abdominal wall braced to protect lumbar spine.',
    tempo: '2-1-1-0',
    defaultRestSec: 90,
    animationType: 'row',
    sets: [
      { setNumber: 1, reps: 8, weightKg: 60, isCompleted: false },
      { setNumber: 2, reps: 8, weightKg: 65, isCompleted: false },
      { setNumber: 3, reps: 6, weightKg: 70, isCompleted: false },
    ],
  },
  {
    id: 'ex-seated-cable-row',
    name: 'Seated Cable Row',
    targetMuscle: 'Rhomboids & Mid Trapezius',
    secondaryMuscles: ['Lats', 'Biceps'],
    equipment: 'Low Cable Row Machine & V-Bar',
    instructions: [
      'Sit upright with knees softly bent, chest lifted.',
      'Pull handle to navel while pulling shoulders back and squeezing mid-back.',
      'Hold contraction for 1 second.',
      'Return handle slowly until arms are fully extended without slouching.',
    ],
    trainingTip: 'Avoid rocking back and forth; isolate movement to shoulder blades and arms.',
    safety: 'Never round lower back when reaching forward.',
    tempo: '2-1-1-0',
    defaultRestSec: 75,
    animationType: 'row',
    sets: [
      { setNumber: 1, reps: 12, weightKg: 50, isCompleted: false },
      { setNumber: 2, reps: 10, weightKg: 55, isCompleted: false },
      { setNumber: 3, reps: 10, weightKg: 55, isCompleted: false },
    ],
  },
  {
    id: 'ex-incline-db-bicep-curl',
    name: 'Incline DB Bicep Curl',
    targetMuscle: 'Biceps Long Head',
    secondaryMuscles: ['Brachialis', 'Forearms'],
    equipment: 'Dumbbells & 45° Incline Bench',
    instructions: [
      'Lie back on 45° incline with arms hanging straight down.',
      'Keep upper arms pinned behind torso line to emphasize long head stretch.',
      'Curl dumbbells upward while supinating wrists (palms facing upward).',
      'Lower under strict control over 3 seconds.',
    ],
    trainingTip: 'Full extension at the bottom creates the deepest muscle hypertrophic response.',
    safety: 'Do not swing weights forward using shoulder momentum.',
    tempo: '3-0-1-1',
    defaultRestSec: 60,
    animationType: 'bicep_curl',
    sets: [
      { setNumber: 1, reps: 10, weightKg: 12, isCompleted: false },
      { setNumber: 2, reps: 10, weightKg: 12, isCompleted: false },
      { setNumber: 3, reps: 8, weightKg: 14, isCompleted: false },
    ],
  },

  // --- LEGS & LOWER BODY (Gym / Barbell / DB) ---
  {
    id: 'ex-barbell-back-squat',
    name: 'Barbell Back Squat',
    targetMuscle: 'Quads & Glutes',
    secondaryMuscles: ['Hamstrings', 'Core', 'Adductors'],
    equipment: 'Barbell & Squat Rack',
    instructions: [
      'Rest barbell securely across upper traps, feet shoulder-width apart.',
      'Inhale deeply and create 360° intra-abdominal pressure.',
      'Descend by breaking at hips and knees simultaneously until thighs are parallel or below.',
      'Drive powerfully through mid-foot to stand, exhaling at top lockout.',
    ],
    trainingTip: 'Keep chest proud and ensure knees track in the same line as your toes.',
    safety: 'Always set safety pin catches inside the power rack at hip depth.',
    tempo: '3-1-1-0',
    defaultRestSec: 150,
    animationType: 'squat',
    phaseDescriptions: {
      start: 'Bar set on traps, feet rooted firmly, core braced.',
      movement: 'Hinge hips back and bend knees smoothly to parallel depth.',
      peak: 'Deep stretch at bottom with flat neutral spine.',
      finish: 'Drive up explosively through mid-foot to starting position.',
    },
    sets: [
      { setNumber: 1, reps: 8, weightKg: 85, isCompleted: false },
      { setNumber: 2, reps: 8, weightKg: 90, isCompleted: false },
      { setNumber: 3, reps: 6, weightKg: 95, isCompleted: false },
    ],
  },
  {
    id: 'ex-romanian-deadlift',
    name: 'Romanian Deadlift (RDL)',
    targetMuscle: 'Hamstrings & Gluteal Complex',
    secondaryMuscles: ['Erector Spinae', 'Lats', 'Core'],
    equipment: 'Barbell or Heavy Dumbbells',
    instructions: [
      'Stand tall holding bar at thighs with shoulder-width stance.',
      'Push hips straight backward with soft knees, keeping bar close against shins.',
      'Descend until feeling deep stretch across hamstrings without rounding back.',
      'Drive hips forward to stand tall and squeeze glutes at top.',
    ],
    trainingTip: 'This is a horizontal hip hinge, not a vertical squat. Keep your shins nearly vertical.',
    safety: 'Never let your lower spine round into flexion during descent.',
    tempo: '3-1-1-0',
    defaultRestSec: 120,
    animationType: 'deadlift',
    phaseDescriptions: {
      start: 'Upright posture, shoulders locked down, soft knee bend.',
      movement: 'Send hips straight backward like touching a wall behind you.',
      peak: 'Deep hamstring stretch at mid-shin level with flat back.',
      finish: 'Squeeze glutes and drive hips forward to full upright position.',
    },
    sets: [
      { setNumber: 1, reps: 10, weightKg: 75, isCompleted: false },
      { setNumber: 2, reps: 10, weightKg: 80, isCompleted: false },
      { setNumber: 3, reps: 8, weightKg: 85, isCompleted: false },
    ],
  },
  {
    id: 'ex-bulgarian-split-squat',
    name: 'DB Bulgarian Split Squat',
    targetMuscle: 'Quads & Glute Max',
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core Stabilizers'],
    equipment: 'Dumbbells & Flat Bench',
    instructions: [
      'Place rear foot laces-down on bench behind you, front foot forward.',
      'Lower torso down and slightly forward until front thigh is parallel to ground.',
      'Drive through front heel and midfoot to return to top.',
      'Complete all reps on one leg before switching sides.',
    ],
    trainingTip: 'Lean torso slightly forward (15°) to increase glute recruitment and reduce hip flexor strain.',
    safety: 'Maintain balance; place front foot wide enough to keep knee stacked over ankle.',
    tempo: '3-0-1-0',
    defaultRestSec: 90,
    animationType: 'lunge',
    sets: [
      { setNumber: 1, reps: 10, weightKg: 14, isCompleted: false },
      { setNumber: 2, reps: 10, weightKg: 14, isCompleted: false },
      { setNumber: 3, reps: 8, weightKg: 16, isCompleted: false },
    ],
  },
  {
    id: 'ex-standing-calf-raise',
    name: 'Standing Calf Raise',
    targetMuscle: 'Gastrocnemius & Soleus',
    secondaryMuscles: ['Achilles Tendon'],
    equipment: 'Calf Machine or DB on Ledge',
    instructions: [
      'Place balls of feet on edge of platform with heels hanging off.',
      'Lower heels as low as possible for a full calf stretch (2 second pause).',
      'Drive high on balls of feet, squeezing calves at top lockout.',
      'Lower slowly under control.',
    ],
    trainingTip: 'Eliminate bounce at the bottom to ensure muscle fibers do the work, not tendon elasticity.',
    safety: 'Keep ankles neutral without rolling outwards.',
    tempo: '2-2-1-1',
    defaultRestSec: 60,
    animationType: 'squat',
    sets: [
      { setNumber: 1, reps: 15, weightKg: 40, isCompleted: false },
      { setNumber: 2, reps: 15, weightKg: 45, isCompleted: false },
      { setNumber: 3, reps: 15, weightKg: 45, isCompleted: false },
    ],
  },

  // --- HOME / DUMBBELL / HYBRID EXERCISES ---
  {
    id: 'ex-db-goblet-squat',
    name: 'Dumbbell Goblet Squat',
    targetMuscle: 'Quads & Glutes',
    secondaryMuscles: ['Core', 'Upper Back'],
    equipment: 'Single Dumbbell or Kettlebell',
    instructions: [
      'Hold dumbbell vertically against your chest with both hands cradling top plate.',
      'Stand with feet shoulder-width, toes angled slightly out.',
      'Squat deep between knees while keeping elbows inside thighs.',
      'Drive through floor to return to standing position.',
    ],
    trainingTip: 'The anterior weight helps keep your torso naturally upright, improving quad isolation.',
    safety: 'Keep dumbbell in contact with chest throughout movement; do not let it drift forward.',
    tempo: '3-1-1-0',
    defaultRestSec: 75,
    animationType: 'squat',
    sets: [
      { setNumber: 1, reps: 12, weightKg: 20, isCompleted: false },
      { setNumber: 2, reps: 12, weightKg: 22, isCompleted: false },
      { setNumber: 3, reps: 10, weightKg: 24, isCompleted: false },
    ],
  },
  {
    id: 'ex-db-floor-press',
    name: 'Dumbbell Floor Press',
    targetMuscle: 'Mid Pecs & Triceps',
    secondaryMuscles: ['Anterior Deltoids'],
    equipment: 'Dumbbells & Mat',
    instructions: [
      'Lie flat on the floor with knees bent and feet flat.',
      'Hold dumbbells at chest with elbows at 45 degree angle.',
      'Press dumbbells straight up until arms are fully extended.',
      'Lower until upper arms lightly touch the floor, pause briefly, then press.',
    ],
    trainingTip: 'The floor naturally prevents excessive shoulder hyperextension, making this gentle on joints.',
    safety: 'Touch floor gently with upper arms; do not slam elbows into the ground.',
    tempo: '2-1-1-0',
    defaultRestSec: 75,
    animationType: 'chest_press',
    sets: [
      { setNumber: 1, reps: 12, weightKg: 20, isCompleted: false },
      { setNumber: 2, reps: 10, weightKg: 22, isCompleted: false },
      { setNumber: 3, reps: 10, weightKg: 22, isCompleted: false },
    ],
  },
  {
    id: 'ex-db-single-arm-row',
    name: 'Single-Arm Dumbbell Row',
    targetMuscle: 'Lats & Upper Back',
    secondaryMuscles: ['Biceps', 'Rear Delts'],
    equipment: 'Dumbbell & Sturdy Chair/Bench',
    instructions: [
      'Place one knee and hand on support, keeping back flat and parallel to floor.',
      'Hold dumbbell with free hand hanging straight down.',
      'Pull dumbbell towards hip crease while driving elbow up and back.',
      'Lower smoothly to full lat stretch.',
    ],
    trainingTip: 'Pull to your hip rather than your armpit to maximize lat recruitment.',
    safety: 'Keep spine neutral; avoid rotating torso as you lift.',
    tempo: '2-1-1-0',
    defaultRestSec: 60,
    animationType: 'row',
    sets: [
      { setNumber: 1, reps: 12, weightKg: 18, isCompleted: false },
      { setNumber: 2, reps: 10, weightKg: 20, isCompleted: false },
      { setNumber: 3, reps: 10, weightKg: 20, isCompleted: false },
    ],
  },

  // --- BODYWEIGHT / NO EQUIPMENT EXERCISES ---
  {
    id: 'ex-bw-pushup',
    name: 'Tempo Strict Push-Up',
    targetMuscle: 'Chest & Triceps',
    secondaryMuscles: ['Anterior Delts', 'Core Plank'],
    equipment: 'Bodyweight Only',
    instructions: [
      'Start in strong high plank with hands slightly wider than shoulders.',
      'Squeeze glutes and brace core to maintain straight line from head to heels.',
      'Lower chest down until 1 inch above floor (3 seconds down).',
      'Press the floor away explosively to full extension.',
    ],
    trainingTip: 'Keep elbows tucked at a 45° angle like an arrow, not flared out at 90° like a T.',
    safety: 'Do not let hips sag or butt pike up into the air.',
    tempo: '3-1-1-0',
    defaultRestSec: 60,
    animationType: 'pushup',
    phaseDescriptions: {
      start: 'High plank, core braced 360°, glutes squeezed.',
      movement: 'Lower chest to floor over 3 smooth seconds.',
      peak: 'Chest hovering 1 inch above mat with full pec stretch.',
      finish: 'Press floor away explosively with full pec lockout.',
    },
    sets: [
      { setNumber: 1, reps: 15, weightKg: 0, isCompleted: false },
      { setNumber: 2, reps: 12, weightKg: 0, isCompleted: false },
      { setNumber: 3, reps: 12, weightKg: 0, isCompleted: false },
    ],
  },
  {
    id: 'ex-bw-air-squats',
    name: 'Deep Bodyweight Air Squats',
    targetMuscle: 'Quads, Glutes & Hip Mobility',
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    equipment: 'Bodyweight Only',
    instructions: [
      'Stand with feet shoulder-width apart, arms extended forward for counterbalance.',
      'Break at hips and knees, sitting deep below parallel with chest upright.',
      'Hold bottom depth for 1 second.',
      'Drive through midfoot and squeeze glutes at top.',
    ],
    trainingTip: 'Push your knees outward over pinky toes to open up hip socket depth.',
    safety: 'Keep entire foot flat on ground; do not rise onto toes.',
    tempo: '3-1-1-0',
    defaultRestSec: 45,
    animationType: 'squat',
    sets: [
      { setNumber: 1, reps: 20, weightKg: 0, isCompleted: false },
      { setNumber: 2, reps: 20, weightKg: 0, isCompleted: false },
      { setNumber: 3, reps: 15, weightKg: 0, isCompleted: false },
    ],
  },
  {
    id: 'ex-bw-walking-lunges',
    name: 'Dynamic Walking Lunges',
    targetMuscle: 'Quads & Glutes',
    secondaryMuscles: ['Hamstrings', 'Balance & Calves'],
    equipment: 'Bodyweight Only',
    instructions: [
      'Step forward with long stride, lowering back knee to gently kiss the ground.',
      'Keep front shin vertical and torso upright.',
      'Drive through front heel to step directly into the next stride.',
      'Alternate legs continuously.',
    ],
    trainingTip: 'Maintain a hip-width track between feet rather than walking on a tightrope.',
    safety: 'Do not let front knee collapse inwards.',
    tempo: '2-0-1-0',
    defaultRestSec: 60,
    animationType: 'lunge',
    sets: [
      { setNumber: 1, reps: 20, weightKg: 0, isCompleted: false },
      { setNumber: 2, reps: 20, weightKg: 0, isCompleted: false },
      { setNumber: 3, reps: 20, weightKg: 0, isCompleted: false },
    ],
  },
  {
    id: 'ex-bw-pullups-or-incline',
    name: 'Strict Bodyweight Pull-Up / Inverted Row',
    targetMuscle: 'Lats & Upper Back',
    secondaryMuscles: ['Biceps', 'Rear Delts', 'Grip'],
    equipment: 'Pull-Up Bar or Doorframe / Table Support',
    instructions: [
      'Full hang from bar with overhand grip slightly wider than shoulders.',
      'Depress scapulae down first before pulling elbows towards ribs.',
      'Pull until chin clears the bar with zero swinging.',
      'Lower smoothly to dead-hang start position.',
    ],
    trainingTip: 'Engage core and point toes down or forward to eliminate body sway.',
    safety: 'Control the descent; do not drop abruptly into shoulder joints.',
    tempo: '3-1-1-0',
    defaultRestSec: 90,
    animationType: 'pullup',
    sets: [
      { setNumber: 1, reps: 8, weightKg: 0, isCompleted: false },
      { setNumber: 2, reps: 8, weightKg: 0, isCompleted: false },
      { setNumber: 3, reps: 6, weightKg: 0, isCompleted: false },
    ],
  },
  {
    id: 'ex-bw-pike-pushup',
    name: 'Pike Push-Up (Shoulder Builder)',
    targetMuscle: 'Anterior & Lateral Deltoids',
    secondaryMuscles: ['Triceps', 'Upper Traps'],
    equipment: 'Bodyweight Only',
    instructions: [
      'Form an inverted V-shape (downward dog position) with hips high.',
      'Lower crown of head forward in front of hands, creating a tripod shape.',
      'Press through palms back up to full pike lockout.',
    ],
    trainingTip: 'Look back at your toes, not at your hands, to keep proper neck alignment.',
    safety: 'Control descent carefully to avoid head contact with floor.',
    tempo: '2-1-1-0',
    defaultRestSec: 60,
    animationType: 'shoulder_press',
    sets: [
      { setNumber: 1, reps: 10, weightKg: 0, isCompleted: false },
      { setNumber: 2, reps: 10, weightKg: 0, isCompleted: false },
      { setNumber: 3, reps: 8, weightKg: 0, isCompleted: false },
    ],
  },
  {
    id: 'ex-bw-plank-hold',
    name: 'Forearm Core Plank Hold',
    targetMuscle: 'Transverse Abdominis & Rectus Abdominis',
    secondaryMuscles: ['Glutes', 'Serratus', 'Lower Back'],
    equipment: 'Bodyweight & Mat',
    instructions: [
      'Rest on forearms and toes with elbows stacked directly beneath shoulders.',
      'Pull belly button hard towards spine and squeeze glutes.',
      'Create tension by actively pulling elbows towards toes.',
      'Hold rigid straight line without hip sag for target duration.',
    ],
    trainingTip: 'Active tension is better than passive duration. Make 45 seconds feel grueling.',
    safety: 'Stop if lower back arches and takes on tension.',
    tempo: 'Isometric Hold',
    defaultRestSec: 45,
    animationType: 'plank',
    sets: [
      { setNumber: 1, reps: 45, weightKg: 0, isCompleted: false },
      { setNumber: 2, reps: 45, weightKg: 0, isCompleted: false },
      { setNumber: 3, reps: 45, weightKg: 0, isCompleted: false },
    ],
  },
  {
    id: 'ex-bw-glute-bridge',
    name: 'Single-Leg Elevated Glute Bridge',
    targetMuscle: 'Gluteus Maximus & Hamstrings',
    secondaryMuscles: ['Lower Back', 'Pelvic Core'],
    equipment: 'Bodyweight & Floor/Bench',
    instructions: [
      'Lie on back with knees bent at 90 degrees and feet flat.',
      'Extend one leg straight into the air.',
      'Drive through grounded heel to bridge hips up until thigh and torso align.',
      'Squeeze glute at top for 2 seconds before lowering.',
    ],
    trainingTip: 'Do not arch with your lower back; focus all squeeze directly into the active glute.',
    safety: 'Keep hips level throughout the entire single-leg repetition.',
    tempo: '2-2-1-0',
    defaultRestSec: 45,
    animationType: 'squat',
    sets: [
      { setNumber: 1, reps: 12, weightKg: 0, isCompleted: false },
      { setNumber: 2, reps: 12, weightKg: 0, isCompleted: false },
      { setNumber: 3, reps: 12, weightKg: 0, isCompleted: false },
    ],
  },
];

// Helper to filter exercises strictly by available user equipment
export function filterExercisesByEquipment(exercises: Exercise[], userEquipment: EquipmentType[]): Exercise[] {
  const isGym = userEquipment.includes('gym');
  const isHome = userEquipment.includes('home');
  const hasDumbbells = userEquipment.includes('dumbbells') || isHome || isGym;
  const isBodyweightOnly = userEquipment.includes('bodyweight') && !isGym && !userEquipment.includes('barbell') && !userEquipment.includes('machines');

  if (isBodyweightOnly) {
    return exercises.filter(
      (e) =>
        e.equipment.toLowerCase().includes('bodyweight') ||
        e.equipment.toLowerCase().includes('mat') ||
        e.equipment.toLowerCase().includes('floor')
    );
  }

  if (!isGym) {
    // Home / Dumbbell user
    return exercises.filter((e) => {
      const eq = e.equipment.toLowerCase();
      if (eq.includes('barbell') && !hasDumbbells) return false;
      if (eq.includes('machine') || eq.includes('cable') || eq.includes('lat pulldown') || eq.includes('squat rack')) return false;
      return true;
    });
  }

  // Full Gym: all exercises permitted
  return exercises;
}

// Adjust sets and rep schemes based on user Goal & Experience
export function customizeExerciseForGoal(
  exercise: Exercise,
  goal: UserGoal,
  experience: ExperienceLevel
): Exercise {
  const cloned: Exercise = JSON.parse(JSON.stringify(exercise));

  let targetReps = 10;
  let setCount = 3;
  let restSec = exercise.defaultRestSec;

  if (goal === 'build_muscle') {
    targetReps = 8;
    setCount = experience === 'advanced' ? 4 : experience === 'beginner' ? 3 : 3;
    restSec = 90;
  } else if (goal === 'get_stronger') {
    targetReps = 5;
    setCount = experience === 'beginner' ? 3 : 4;
    restSec = 120;
  } else if (goal === 'lose_weight' || goal === 'burn_fat') {
    targetReps = 12;
    setCount = 3;
    restSec = 60;
  } else if (goal === 'improve_endurance') {
    targetReps = 15;
    setCount = 3;
    restSec = 45;
  } else {
    // improve_fitness
    targetReps = 10;
    setCount = 3;
    restSec = 60;
  }

  // Adjust starting weight recommendation based on experience
  const weightMultiplier = experience === 'advanced' ? 1.25 : experience === 'beginner' ? 0.75 : 1.0;

  cloned.defaultRestSec = restSec;
  cloned.sets = Array.from({ length: setCount }, (_, i) => {
    const baseWeight = exercise.sets[0]?.weightKg || 0;
    const scaledWeight = baseWeight > 0 ? Math.round(baseWeight * weightMultiplier * 2) / 2 : 0;
    return {
      setNumber: i + 1,
      reps: targetReps,
      weightKg: scaledWeight,
      isCompleted: false,
    };
  });

  return cloned;
}

// Personalized Workout Generator Engine
export function generatePersonalizedWeeklyPlan(profile: {
  name: string;
  goal: UserGoal;
  experience: ExperienceLevel;
  workoutDaysPerWeek: number;
  preferredDurationMin: number;
  equipment: EquipmentType[];
  completedWorkouts?: CompletedWorkout[];
}): {
  schedule: {
    dayName: string;
    dayIndex: number;
    isRest: boolean;
    routine: WorkoutRoutine | null;
    isToday: boolean;
    dateFormatted: string;
  }[];
  todayRoutine: WorkoutRoutine;
} {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // 0 for Mon ... 6 for Sun
  const availableExercises = filterExercisesByEquipment(MASTER_EXERCISES, profile.equipment);

  // Helper to pick exercises by muscle
  const getExercisesForMuscles = (muscles: string[], count: number = 4) => {
    const matched = availableExercises.filter((e) =>
      muscles.some((m) => e.targetMuscle.toLowerCase().includes(m.toLowerCase()))
    );
    const result = matched.length >= count ? matched.slice(0, count) : matched;
    // Fallback if not enough matching
    if (result.length < count) {
      const remaining = availableExercises.filter((e) => !result.includes(e)).slice(0, count - result.length);
      result.push(...remaining);
    }
    return result.map((e) => customizeExerciseForGoal(e, profile.goal, profile.experience));
  };

  // Determine target exercise count based on preferred duration
  const exerciseCount = profile.preferredDurationMin <= 30 ? 4 : profile.preferredDurationMin <= 45 ? 5 : 6;

  // Build Personalized Routines based on Goal and Equipment
  const pushRoutine: WorkoutRoutine = {
    id: 'routine-push-focus',
    title: profile.goal === 'get_stronger' ? 'Heavy Push & Power Matrix' : 'Chest, Delts & Triceps Hypertrophy',
    subtitle: 'Upper Pushing Mechanics & Pectoral Development',
    category: 'Push',
    targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
    estimatedDurationMin: profile.preferredDurationMin,
    difficulty: profile.experience,
    intensity: profile.goal === 'get_stronger' ? 'Progressive Overload' : 'High',
    equipmentRequired: profile.equipment.map((e) => e.replace('_', ' ')),
    exercises: getExercisesForMuscles(['Chest', 'Deltoids', 'Triceps'], exerciseCount),
    cardioTarget: getGoalCardioTarget(profile.goal, profile.experience),
  };

  const pullRoutine: WorkoutRoutine = {
    id: 'routine-pull-focus',
    title: profile.goal === 'build_muscle' ? 'Pull & Back Density Master' : 'Back, Lats & Biceps Conditioning',
    subtitle: 'Posterior Chain Pulling & Scapular Control',
    category: 'Pull',
    targetMuscles: ['Lats', 'Upper Back', 'Biceps'],
    estimatedDurationMin: profile.preferredDurationMin,
    difficulty: profile.experience,
    intensity: 'High',
    equipmentRequired: profile.equipment.map((e) => e.replace('_', ' ')),
    exercises: getExercisesForMuscles(['Back', 'Lat', 'Bicep'], exerciseCount),
    cardioTarget: getGoalCardioTarget(profile.goal, profile.experience),
  };

  const legsRoutine: WorkoutRoutine = {
    id: 'routine-legs-focus',
    title: profile.goal === 'lose_weight' ? 'Metabolic Lower Body Shred' : 'Legs, Quads & Glute Power',
    subtitle: 'Quad Drive, Hamstrings & Kinetic Balance',
    category: 'Legs',
    targetMuscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
    estimatedDurationMin: profile.preferredDurationMin,
    difficulty: profile.experience,
    intensity: 'High',
    equipmentRequired: profile.equipment.map((e) => e.replace('_', ' ')),
    exercises: getExercisesForMuscles(['Quad', 'Hamstring', 'Glute', 'Squat'], exerciseCount),
    cardioTarget: getGoalCardioTarget(profile.goal, profile.experience),
  };

  const fullBodyARoutine: WorkoutRoutine = {
    id: 'routine-fullbody-a',
    title: 'Full Body Compound Matrix A',
    subtitle: 'Multi-Joint Kinetic Activation & Energy Burn',
    category: 'Full Body',
    targetMuscles: ['Chest', 'Quads', 'Back', 'Core'],
    estimatedDurationMin: profile.preferredDurationMin,
    difficulty: profile.experience,
    intensity: 'Progressive Overload',
    equipmentRequired: profile.equipment.map((e) => e.replace('_', ' ')),
    exercises: getExercisesForMuscles(['Chest', 'Quad', 'Back', 'Core', 'Triceps'], exerciseCount),
    cardioTarget: getGoalCardioTarget(profile.goal, profile.experience),
  };

  const fullBodyBRoutine: WorkoutRoutine = {
    id: 'routine-fullbody-b',
    title: 'Full Body Functional Matrix B',
    subtitle: 'Posterior Chain, Deltoids & Core Stability',
    category: 'Full Body',
    targetMuscles: ['Hamstrings', 'Shoulders', 'Lats', 'Glutes'],
    estimatedDurationMin: profile.preferredDurationMin,
    difficulty: profile.experience,
    intensity: 'High',
    equipmentRequired: profile.equipment.map((e) => e.replace('_', ' ')),
    exercises: getExercisesForMuscles(['Hamstring', 'Shoulder', 'Lat', 'Glute', 'Plank'], exerciseCount),
    cardioTarget: getGoalCardioTarget(profile.goal, profile.experience),
  };

  const upperRoutine: WorkoutRoutine = {
    id: 'routine-upper-focus',
    title: 'Upper Body Power & Tone',
    subtitle: 'Complete Torso, Shoulders & Arm Sculpting',
    category: 'Upper',
    targetMuscles: ['Chest', 'Back', 'Shoulders', 'Arms'],
    estimatedDurationMin: profile.preferredDurationMin,
    difficulty: profile.experience,
    intensity: 'Moderate',
    equipmentRequired: profile.equipment.map((e) => e.replace('_', ' ')),
    exercises: getExercisesForMuscles(['Chest', 'Back', 'Deltoids', 'Bicep'], exerciseCount),
    cardioTarget: getGoalCardioTarget(profile.goal, profile.experience),
  };

  const lowerRoutine: WorkoutRoutine = {
    id: 'routine-lower-focus',
    title: 'Lower Body & Core Fortification',
    subtitle: 'Pelvic Power, Hamstrings & Abdominal Core',
    category: 'Lower',
    targetMuscles: ['Quads', 'Hamstrings', 'Glutes', 'Core'],
    estimatedDurationMin: profile.preferredDurationMin,
    difficulty: profile.experience,
    intensity: 'High',
    equipmentRequired: profile.equipment.map((e) => e.replace('_', ' ')),
    exercises: getExercisesForMuscles(['Quad', 'Hamstring', 'Plank', 'Glute'], exerciseCount),
    cardioTarget: getGoalCardioTarget(profile.goal, profile.experience),
  };

  // Build weekly schedule array according to workout frequency (3, 4, 5, or 6 days)
  const freq = profile.workoutDaysPerWeek || 4;
  const now = new Date();

  const schedule = daysOfWeek.map((dayName, idx) => {
    let isRest = false;
    let routine: WorkoutRoutine | null = null;

    if (freq === 3) {
      // Mon (Full Body A), Wed (Full Body B), Fri (Full Body A)
      if (idx === 0) routine = fullBodyARoutine;
      else if (idx === 2) routine = fullBodyBRoutine;
      else if (idx === 4) routine = fullBodyARoutine;
      else isRest = true;
    } else if (freq === 4) {
      // Mon (Push), Tue (Pull), Thu (Legs), Fri (Upper)
      if (idx === 0) routine = pushRoutine;
      else if (idx === 1) routine = pullRoutine;
      else if (idx === 3) routine = legsRoutine;
      else if (idx === 4) routine = upperRoutine;
      else isRest = true;
    } else if (freq === 5) {
      // Mon (Push), Tue (Pull), Wed (Legs), Thu (Upper), Fri (Lower)
      if (idx === 0) routine = pushRoutine;
      else if (idx === 1) routine = pullRoutine;
      else if (idx === 2) routine = legsRoutine;
      else if (idx === 3) routine = upperRoutine;
      else if (idx === 4) routine = lowerRoutine;
      else isRest = true;
    } else {
      // 6 days (PPL x 2)
      if (idx === 0) routine = pushRoutine;
      else if (idx === 1) routine = pullRoutine;
      else if (idx === 2) routine = legsRoutine;
      else if (idx === 3) routine = pushRoutine;
      else if (idx === 4) routine = pullRoutine;
      else if (idx === 5) routine = legsRoutine;
      else isRest = true;
    }

    // Calculate actual date for this day of current week
    const currentDayOffset = idx - todayDayIndex;
    const targetDate = new Date(now.getTime() + currentDayOffset * 24 * 60 * 60 * 1000);
    const dateFormatted = targetDate.getDate().toString();

    return {
      dayName,
      dayIndex: idx,
      isRest,
      routine,
      isToday: idx === todayDayIndex,
      dateFormatted,
    };
  });

  const todayItem = schedule[todayDayIndex] || schedule[0];
  const todayRoutine = todayItem?.routine || pushRoutine;

  return {
    schedule,
    todayRoutine,
  };
}

// Cardio Target Generator based on scientific guidelines
export function getGoalCardioTarget(
  goal: UserGoal,
  experience: ExperienceLevel
): {
  activity: string;
  durationMin: number;
  intensity: string;
  frequencyPerWeek: number;
  tip: string;
} {
  switch (goal) {
    case 'lose_weight':
    case 'burn_fat':
      return {
        activity: 'Incline Treadmill Walk (12% Incline @ 4.8 km/h)',
        durationMin: 25,
        intensity: 'Zone 2 Fat-Oxidation (65-70% Max HR)',
        frequencyPerWeek: 3,
        tip: 'Low-impact incline walking preserves muscle tissue while accelerating adipose lipolysis.',
      };
    case 'build_muscle':
      return {
        activity: 'Low-Impact Zone 2 Cycling or Steady Walk',
        durationMin: 15,
        intensity: 'Gentle Aerobic Recovery (60% Max HR)',
        frequencyPerWeek: 2,
        tip: 'Keeps heart and metabolic pathways healthy without impairing hypertrophic recovery.',
      };
    case 'get_stronger':
      return {
        activity: 'Brisk Outdoor Walk or Airdyne Bike Flow',
        durationMin: 20,
        intensity: 'Easy Recovery Conditioning',
        frequencyPerWeek: 2,
        tip: 'Promotes blood circulation to clear lactate and flush micro-tears in joint connective tissues.',
      };
    case 'improve_endurance':
      return {
        activity: 'Progressive Outdoor Run or 500m Row Repeats',
        durationMin: 35,
        intensity: 'Zone 3/4 Threshold Conditioning (75-85% Max HR)',
        frequencyPerWeek: 4,
        tip: 'Expands VO2 Max ceiling and enhances mitochondrial enzyme density.',
      };
    case 'improve_fitness':
    default:
      return {
        activity: 'Functional Circuit / Brisk Rucking or Rowing',
        durationMin: 20,
        intensity: 'Moderate Aerobic Base (65-75% Max HR)',
        frequencyPerWeek: 3,
        tip: 'Builds versatile cardiovascular stamina and everyday vitality.',
      };
  }
}

// Helper to generate dynamic goal sentence
export function getDynamicGoalSentence(goal: UserGoal): string {
  switch (goal) {
    case 'build_muscle':
      return "Today's session is designed to help you build strength and muscle.";
    case 'lose_weight':
    case 'burn_fat':
      return "Today's session is focused on helping you burn energy while building fitness.";
    case 'get_stronger':
      return "Today's session is built around progressive strength development.";
    case 'improve_endurance':
      return "Today's session is designed to improve your stamina and conditioning.";
    case 'improve_fitness':
    default:
      return "Today's session is crafted for balanced strength, mobility, and everyday energy.";
  }
}

// Default export list for initial states
export const DEFAULT_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'routine-push-power',
    title: 'Push Power & Hypertrophy',
    subtitle: 'Chest, Shoulders & Triceps Focus',
    category: 'Push',
    targetMuscles: ['Chest', 'Front Delts', 'Lateral Delts', 'Triceps'],
    estimatedDurationMin: 50,
    difficulty: 'intermediate',
    intensity: 'High',
    equipmentRequired: ['Barbell', 'Dumbbells', 'Cable Machine', 'Bench'],
    exercises: MASTER_EXERCISES.slice(0, 5),
    cardioTarget: getGoalCardioTarget('build_muscle', 'intermediate'),
  },
];

export function getRecommendedRoutine(goal: UserGoal, equipment: EquipmentType[]): WorkoutRoutine {
  const plan = generatePersonalizedWeeklyPlan({
    name: 'Athlete',
    goal,
    experience: 'intermediate',
    workoutDaysPerWeek: 4,
    preferredDurationMin: 45,
    equipment,
  });
  return plan.todayRoutine;
}
