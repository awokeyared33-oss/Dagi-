import { TrainerUnit } from '../types';

/**
 * JOSSY PERSONAL TRAINER ACADEMY
 * 20 Comprehensive Professional Units with In-Depth Lessons and 15-Question Mastery Quizzes (Pass: >= 12/15)
 */

export const TRAINER_ACADEMY_UNITS: TrainerUnit[] = [
  // ==========================================
  // UNIT 1: Fitness & Human Body Fundamentals
  // ==========================================
  {
    id: 1,
    unitNumber: 1,
    title: 'Fitness & Human Body Fundamentals',
    titleAm: 'የአካል ብቃት እና የሰውነት መሰረታዊ አናቶሚ',
    subtitle: 'Skeletal framework, muscular system overview, and homeostatic energy pathways',
    iconName: 'Activity',
    category: 'Fundamentals',
    overview: 'Explore the structural foundation of the human body, connective tissues, basic bioenergetics, and the biological adaptations to resistance training.',
    lessonsCount: 3,
    passingScoreThreshold: 12,
    lessons: [
      {
        id: 'u1-l1',
        unitId: 1,
        lessonNumber: 1,
        title: 'The Skeletal & Articular Framework',
        titleAm: 'የአጥንት እና የመገጣጠሚያዎች አወቃቀር',
        estimatedReadMin: 8,
        learningObjectives: [
          'Differentiate between axial and appendicular skeletal divisions',
          'Understand synovial joint mechanics (ball-and-socket, hinge, pivot)',
          'Identify the role of cartilage, ligaments, and tendons in force transmission',
        ],
        summary: 'The human skeleton consists of 206 bones divided into axial (spine, skull, ribs) and appendicular (limbs, pelvis) segments connected by synovial joints.',
        contentSections: [
          {
            heading: 'Skeletal Divisions & Load Bearing',
            body: 'The human skeleton provides structural rigidity, protects vital internal organs, acts as a mineral reservoir (calcium and phosphorus), and serves as an anchor system for skeletal muscles. The axial skeleton (80 bones) provides central core support, while the appendicular skeleton (126 bones) facilitates movement.',
            bullets: [
              'Axial Skeleton: Skull, vertebral column (cervical, thoracic, lumbar, sacrum, coccyx), and rib cage.',
              'Appendicular Skeleton: Shoulder girdle, arms, pelvis, and legs.',
            ],
            highlightBox: {
              title: 'Trainer Science Note',
              text: 'Resistance training places compressive loads on bone tissue, stimulating osteoblasts to increase bone mineral density and reduce osteoporosis risk.',
              type: 'science',
            },
          },
          {
            heading: 'Synovial Joint Classification',
            body: 'Synovial joints are freely movable joints lubricated by synovial fluid within an articular capsule. Understanding joint types is critical for selecting safe exercise pathways.',
            bullets: [
              'Ball-and-Socket (Shoulder & Hip): Triaxial movement (flexion/extension, abduction/adduction, rotation).',
              'Hinge (Elbow & Knee): Uniaxial movement primarily in the sagittal plane.',
              'Pivot (Atlantoaxial, Radioulnar): Rotation around a central axis.',
            ],
          },
        ],
        trainerTips: [
          'Always evaluate client joint mobility prior to loading heavy barbell movements.',
          'Ligaments connect bone to bone; tendons connect muscle to bone. Tendons adapt to load more slowly than muscle fibers.',
        ],
        commonMistakes: [
          'Forcing a client with deep hip socket anatomy into an artificially narrow squat stance.',
          'Ignoring joint clicking accompanied by sharp pain.',
        ],
        keyTakeaways: [
          'Joint mechanics dictate individual exercise setup variations.',
          'Adequate warmup increases synovial fluid temperature and viscosity for joint protection.',
        ],
        professionalTerminology: [
          { term: 'Osteoblast', definition: 'Bone-forming cell stimulated by mechanical stress.' },
          { term: 'Synovial Fluid', definition: 'Viscous lubricant reducing friction inside joint capsules.' },
        ],
        realWorldExample: 'A client struggling to squat below parallel may have structural ankle dorsiflexion restrictions rather than mere quadriceps weakness.',
      },
      {
        id: 'u1-l2',
        unitId: 1,
        lessonNumber: 2,
        title: 'Muscular Architecture & Motor Unit Recruitment',
        titleAm: 'የጡንቻዎች አወቃቀርና የነርቭ ምላሽ',
        estimatedReadMin: 9,
        learningObjectives: [
          'Explain the Sliding Filament Theory of muscular contraction',
          'Differentiate Type I (slow-twitch) vs Type II (fast-twitch) muscle fibers',
          'Understand Henneman’s Size Principle of motor unit recruitment',
        ],
        summary: 'Skeletal muscles contract via actin-myosin cross-bridge cycling triggered by acetylcholine release, recruiting fibers according to Henneman’s Size Principle.',
        contentSections: [
          {
            heading: 'The Sliding Filament Theory',
            body: 'A muscle contraction begins when an electrical action potential travels down a motor neuron to the neuromuscular junction. Calcium ions bind to troponin, exposing binding sites on actin filaments so myosin cross-bridge heads can pull actin toward the center of the sarcomere using ATP hydrolysis.',
          },
          {
            heading: 'Fiber Types: Fast vs Slow Twitch',
            body: 'Skeletal muscle consists of a heterogeneous mix of muscle fiber types adapted for distinct energetic demands.',
            bullets: [
              'Type I (Slow-Twitch Oxidative): High mitochondrial density, fatigue resistant, low force production, optimized for endurance.',
              'Type IIa (Fast-Twitch Oxidative-Glycolytic): Intermediate force, moderate fatigue resistance.',
              'Type IIx (Fast-Twitch Glycolytic): Maximum explosive force, rapid fatigue, high glycolytic capacity.',
            ],
          },
        ],
        trainerTips: [
          'To stimulate high-threshold Type II muscle fibers, train either with heavy weights (>80% 1RM) or take moderate loads close to muscular failure.',
        ],
        commonMistakes: [
          'Believing high reps only burn fat and low reps only build muscle; both rep ranges stimulate hypertrophy when taken near failure.',
        ],
        keyTakeaways: [
          'Type II fibers possess the highest capacity for muscular growth (hypertrophy).',
          'Consistent progressive overload is needed to repeatedly recruit high-threshold motor units.',
        ],
      },
      {
        id: 'u1-l3',
        unitId: 1,
        lessonNumber: 3,
        title: 'Bioenergetics & Cellular Energy Systems',
        titleAm: 'የሰውነት የሃይል ምንጮች (ATP, Glycolysis & Oxidative)',
        estimatedReadMin: 8,
        learningObjectives: [
          'Detail the Phosphagen (ATP-PCr), Glycolytic, and Oxidative energy systems',
          'Understand energy system recovery timelines between working sets',
        ],
        summary: 'Adenosine Triphosphate (ATP) is resynthesized through phosphocreatine (0-15s), anaerobic glycolysis (30-120s), and aerobic oxidative phosphorylation (>2 mins).',
        contentSections: [
          {
            heading: 'The Three Energy Pathways',
            body: 'All muscular work requires ATP breakdown into ADP and inorganic phosphate. The body utilizes three distinct biochemical pathways to resynthesize ATP.',
            bullets: [
              'Phosphagen System (ATP-PCr): Powers maximal effort for 0–15 seconds (e.g., 1–3 rep heavy squat, 100m sprint).',
              'Anaerobic Glycolytic System: Breaks down muscle glycogen without oxygen for 15–120 seconds of intense effort (e.g., 8–15 rep set).',
              'Aerobic / Oxidative System: Uses oxygen to burn fats and carbohydrates for prolonged activity (>2 minutes and resting state).',
            ],
          },
        ],
        trainerTips: [
          'Resting 2 to 3 minutes allows the phosphagen system to replenish ~95% of intramuscular phosphocreatine stores.',
        ],
        commonMistakes: [
          'Cutting rest intervals to 30 seconds on heavy compound sets, which prematurely limits muscular output due to incomplete ATP replenishment.',
        ],
        keyTakeaways: [
          'Energy systems operate on a continuum rather than isolated on/off switches.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'u1-q1',
        unitId: 1,
        questionNumber: 1,
        questionText: 'How many total bones comprise the adult human skeletal system?',
        options: ['180 bones', '206 bones', '254 bones', '312 bones'],
        correctOptionIndex: 1,
        explanation: 'The adult human skeleton consists of exactly 206 bones divided into axial (80) and appendicular (126) regions.',
      },
      {
        id: 'u1-q2',
        unitId: 1,
        questionNumber: 2,
        questionText: 'Which joint classification provides the greatest multi-directional range of motion?',
        options: ['Hinge joint', 'Suture joint', 'Ball-and-socket joint', 'Pivot joint'],
        correctOptionIndex: 2,
        explanation: 'Ball-and-socket joints (such as the glenohumeral shoulder and hip joints) allow movement across all three anatomical planes.',
      },
      {
        id: 'u1-q3',
        unitId: 1,
        questionNumber: 3,
        questionText: 'What is the primary anatomical connective tissue that attaches muscle to bone?',
        options: ['Ligament', 'Tendon', 'Hyaline cartilage', 'Synovial membrane'],
        correctOptionIndex: 1,
        explanation: 'Tendons connect muscle tissue to bone to transmit contractile force, whereas ligaments connect bone to bone.',
      },
      {
        id: 'u1-q4',
        unitId: 1,
        questionNumber: 4,
        questionText: 'Which mineral ion binds to troponin to initiate cross-bridge cycling during muscle contraction?',
        options: ['Potassium (K+)', 'Calcium (Ca2+)', 'Sodium (Na+)', 'Chloride (Cl-)'],
        correctOptionIndex: 1,
        explanation: 'Calcium released from the sarcoplasmic reticulum binds to troponin, exposing the actin active sites for myosin binding.',
      },
      {
        id: 'u1-q5',
        unitId: 1,
        questionNumber: 5,
        questionText: 'According to Henneman’s Size Principle, in what order are motor units recruited as load increases?',
        options: [
          'Small slow-twitch units first, then progressively larger fast-twitch units',
          'Fast-twitch Type IIx units first, followed by Type I units',
          'All motor units are recruited simultaneously at all loads',
          'Motor units are recruited completely at random',
        ],
        correctOptionIndex: 0,
        explanation: 'Henneman’s Size Principle states that smaller, fatigue-resistant Type I motor units fire first, with larger Type II units recruited as demand increases.',
      },
      {
        id: 'u1-q6',
        unitId: 1,
        questionNumber: 6,
        questionText: 'Which muscle fiber type is characterized by high mitochondrial density and superior fatigue resistance?',
        options: ['Type IIx', 'Type IIb', 'Type I (Slow-Twitch)', 'Type IIa'],
        correctOptionIndex: 2,
        explanation: 'Type I muscle fibers possess high capillary and mitochondrial density, utilizing aerobic pathways for long-duration fatigue resistance.',
      },
      {
        id: 'u1-q7',
        unitId: 1,
        questionNumber: 7,
        questionText: 'Which energy system provides immediate ATP for an all-out 5-second maximal heavy lift?',
        options: ['Oxidative phosphorylation', 'Phosphagen (ATP-PCr) system', 'Aerobic glycolysis', 'Beta-oxidation'],
        correctOptionIndex: 1,
        explanation: 'The Phosphagen (ATP-PCr) system provides instantaneous anaerobic ATP for explosive activities lasting between 0 and 15 seconds.',
      },
      {
        id: 'u1-q8',
        unitId: 1,
        questionNumber: 8,
        questionText: 'What percentage of phosphocreatine (PCr) is typically restored after 2 to 3 minutes of passive rest?',
        options: ['20-30%', '50-60%', '90-95%+', '100% in 15 seconds'],
        correctOptionIndex: 2,
        explanation: 'Research indicates approximately 90–95% of intramuscular phosphocreatine is resynthesized within 2 to 3 minutes of passive rest.',
      },
      {
        id: 'u1-q9',
        unitId: 1,
        questionNumber: 9,
        questionText: 'What is the primary role of osteoblasts in response to progressive weight training?',
        options: [
          'Breaking down bone matrix for calcium excretion',
          'Synthesizing new bone tissue and increasing bone mineral density',
          'Converting skeletal muscle into connective tissue',
          'Lubricating synovial capsules',
        ],
        correctOptionIndex: 1,
        explanation: 'Osteoblasts are bone-forming cells that lay down collagen and mineral matrix in response to mechanical loading.',
      },
      {
        id: 'u1-q10',
        unitId: 1,
        questionNumber: 10,
        questionText: 'Which anatomical region belongs exclusively to the axial skeleton?',
        options: ['Femur and Tibia', 'Scapula and Clavicle', 'Vertebral Column and Skull', 'Radius and Ulna'],
        correctOptionIndex: 2,
        explanation: 'The axial skeleton forms the central axis of the body, consisting of the skull, vertebral column, ribs, and sternum.',
      },
      {
        id: 'u1-q11',
        unitId: 1,
        questionNumber: 11,
        questionText: 'What is the functional contractile unit of a muscle fiber bounded between two Z-discs?',
        options: ['Sarcomere', 'Fascicle', 'Myofibril bundle', 'Perimysium'],
        correctOptionIndex: 0,
        explanation: 'The sarcomere is the fundamental repeating contractile unit of skeletal muscle bounded by Z-discs.',
      },
      {
        id: 'u1-q12',
        unitId: 1,
        questionNumber: 12,
        questionText: 'Why does progressive resistance training improve tendon resilience over time?',
        options: [
          'It replaces collagen fibers with fat cells',
          'It increases collagen synthesis and cross-linking within tendon matrix',
          'It permanently stretches the tendon to make it loose',
          'It stops blood flow to prevent inflammation',
        ],
        correctOptionIndex: 1,
        explanation: 'Mechanical tension stimulates tenocytes to synthesize Type I collagen fibers, increasing tendon cross-sectional stiffness and force capacity.',
      },
      {
        id: 'u1-q13',
        unitId: 1,
        questionNumber: 13,
        questionText: 'What is the primary cellular byproduct that accumulates during high-intensity anaerobic glycolysis?',
        options: ['Hydrogen ions (H+) leading to cellular acidosis', 'Free pure oxygen', 'Excess calcium', 'Carbon monoxide'],
        correctOptionIndex: 0,
        explanation: 'During high-intensity anaerobic glycolysis, the accumulation of hydrogen ions (H+) reduces intramuscular pH, contributing to muscular fatigue.',
      },
      {
        id: 'u1-q14',
        unitId: 1,
        questionNumber: 14,
        questionText: 'Which type of muscle action involves muscle lengthening under tension?',
        options: ['Concentric action', 'Isometric action', 'Eccentric action', 'Isokinetic passive action'],
        correctOptionIndex: 2,
        explanation: 'An eccentric muscle action occurs when the muscle lengthens while resisting or controlling external load.',
      },
      {
        id: 'u1-q15',
        unitId: 1,
        questionNumber: 15,
        questionText: 'Why should a fitness coach understand joint structure prior to designing a squat program for a client?',
        options: [
          'Because all human hip joints are identical in depth and angle',
          'Because anatomical variations in acetabular depth and femoral neck angle dictate comfortable stance width',
          'Because bone structure can be changed in 3 weeks of stretching',
          'Because joint mechanics do not affect movement safety',
        ],
        correctOptionIndex: 1,
        explanation: 'Individual pelvic and femoral anatomical variations determine the optimal, injury-free stance width and foot turnout angle for each individual client.',
      },
    ],
  },

  // ==========================================
  // UNIT 2: Muscle Anatomy, Actions & Movement Planes
  // ==========================================
  {
    id: 2,
    unitNumber: 2,
    title: 'Muscle Anatomy, Actions & Movement Planes',
    titleAm: 'የጡንቻዎች አናቶሚ፣ ስራዎች እና የእንቅስቃሴ አቅጣጫዎች',
    subtitle: 'Sagittal, frontal, and transverse planes; agonist, antagonist, and synergist roles',
    iconName: 'Compass',
    category: 'Fundamentals',
    overview: 'Master the three anatomical planes of motion, joint actions (flexion, extension, abduction, adduction, rotation), and the functional roles of all major muscle groups.',
    lessonsCount: 3,
    passingScoreThreshold: 12,
    lessons: [
      {
        id: 'u2-l1',
        unitId: 2,
        lessonNumber: 1,
        title: 'The Three Cardinal Planes of Motion',
        titleAm: 'ሦስቱ ዋና ዋና የእንቅስቃሴ አቅጣጫዎች',
        estimatedReadMin: 8,
        learningObjectives: [
          'Identify movements occurring in the Sagittal, Frontal, and Transverse planes',
          'Program multi-planar exercises for comprehensive athletic development',
        ],
        summary: 'All human movements occur within or across three cardinal planes: Sagittal (forward/backward), Frontal (side-to-side), and Transverse (rotational).',
        contentSections: [
          {
            heading: 'Planes Breakdown & Exercises',
            body: 'A well-rounded fitness program must develop strength across all three movement planes rather than living exclusively in the sagittal plane.',
            bullets: [
              'Sagittal Plane: Bisects body into right and left halves. Movements: Flexion and Extension (Squats, Biceps Curls, Deadlifts, Lunges, Running).',
              'Frontal (Coronal) Plane: Bisects body into anterior and posterior halves. Movements: Abduction and Adduction, Lateral Flexion (Lateral Raises, Side Lunges, Jumping Jacks).',
              'Transverse Plane: Bisects body into superior and inferior halves. Movements: Internal and External Rotation, Horizontal Abduction/Adduction (Woodchops, Russian Twists, Chest Flyes).',
            ],
          },
        ],
        trainerTips: [
          'Most recreational lifters overtrain the sagittal plane; add frontal plane lateral lunges and transverse cable rotations to bulletproof hips and spine.',
        ],
        commonMistakes: [
          'Classifying a chest press as frontal plane; horizontal adduction across the chest operates in the transverse plane.',
        ],
        keyTakeaways: [
          'Balanced multi-planar training prevents muscular imbalances and improves real-world functional stability.',
        ],
      },
      {
        id: 'u2-l2',
        unitId: 2,
        lessonNumber: 2,
        title: 'Functional Muscle Roles: Agonists, Antagonists & Synergists',
        titleAm: 'የጡንቻዎች ሚና በስራ ወቅት (Agonist, Antagonist & Synergist)',
        estimatedReadMin: 8,
        learningObjectives: [
          'Distinguish between Agonist (prime mover), Antagonist, Synergist, and Fixator muscles',
          'Apply reciprocal inhibition concepts to training and stretching',
        ],
        summary: 'Muscles coordinate in functional pairs: the agonist contracts as prime mover while the antagonist relaxes via reciprocal inhibition, supported by synergists and stabilizers.',
        contentSections: [
          {
            heading: 'Muscle Functional Classifications',
            body: 'During any compound movement, multiple muscle groups operate cooperatively to produce smooth, controlled force.',
            bullets: [
              'Agonist (Prime Mover): The primary muscle generating joint torque (e.g., Pectoralis Major in Bench Press).',
              'Antagonist: The muscle opposing the action, lengthening under control (e.g., Latissimus Dorsi in Bench Press).',
              'Synergist: Assists the prime mover with additional force (e.g., Anterior Deltoids and Triceps in Bench Press).',
              'Fixator / Stabilizer: Anchors and stabilizes surrounding joints (e.g., Rotator Cuff and Core in Bench Press).',
            ],
          },
        ],
        trainerTips: [
          'Program balanced agonist-antagonist ratios (e.g., 1 pulling exercise for every 1 pressing exercise) to maintain optimal scapular and glenohumeral alignment.',
        ],
        commonMistakes: [
          'Only training visible "mirror muscles" (chest, biceps, abs) while neglecting posterior chain antagonists (lats, rear delts, glutes, hamstrings).',
        ],
        keyTakeaways: [
          'Reciprocal inhibition ensures fluid movement: when an agonist fires, its antagonist is neurologically signaled to relax.',
        ],
      },
      {
        id: 'u2-l3',
        unitId: 2,
        lessonNumber: 3,
        title: 'Major Muscle Origins, Insertions & Primary Actions',
        titleAm: 'የዋና ዋና ጡንቻዎች መነሻ፣ መድረሻና ዋና ስራ',
        estimatedReadMin: 10,
        learningObjectives: [
          'Map origins and insertions of the 16 primary muscle groups',
          'Understand how line of pull determines exercise selection',
        ],
        summary: 'Understanding muscle fiber orientation and line of pull enables precise exercise selection for complete muscular development.',
        contentSections: [
          {
            heading: 'Upper Body Anatomy Highlights',
            body: 'The upper body relies on complex scapulohumeral rhythm.',
            bullets: [
              'Pectoralis Major: Originates at clavicle and sternum; inserts into bicipital groove of humerus. Action: Horizontal adduction.',
              'Latissimus Dorsi: Originates along thoracolumbar fascia, iliac crest, and lower vertebrae; inserts into intertubercular groove of humerus. Action: Shoulder extension and adduction.',
              'Deltoids: Anterior (flexion), Lateral (abduction), Posterior (horizontal abduction).',
            ],
          },
          {
            heading: 'Lower Body Anatomy Highlights',
            body: 'The lower body supports high load capacities.',
            bullets: [
              'Quadriceps: Four heads. Rectus femoris crosses hip and knee; Vastus lateralis, medialis, intermedius cross only the knee.',
              'Gluteus Maximus: Originates from posterior ilium and sacrum; inserts into gluteal tuberosity and IT band. Action: Hip extension and external rotation.',
              'Hamstrings: Biceps femoris, semitendinosus, semimembranosus. Action: Hip extension and knee flexion.',
            ],
          },
        ],
        trainerTips: [
          'Align the cable or dumbbell resistance directly with the orientation of the target muscle fibers.',
        ],
        commonMistakes: [
          'Thinking squats fully develop the hamstrings; research shows squats produce minimal hamstring activation because the hip and knee flex simultaneously.',
        ],
        keyTakeaways: [
          'Dedicated leg curls and hinge movements (RDLs) are mandatory for complete hamstring development.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'u2-q1',
        unitId: 2,
        questionNumber: 1,
        questionText: 'A standard Barbell Back Squat occurs primarily in which anatomical plane of motion?',
        options: ['Frontal plane', 'Sagittal plane', 'Transverse plane', 'Coronal plane'],
        correctOptionIndex: 1,
        explanation: 'Squats involve hip and knee flexion/extension moving forward and backward in the sagittal plane.',
      },
      {
        id: 'u2-q2',
        unitId: 2,
        questionNumber: 2,
        questionText: 'Dumbbell Lateral Raises for the side deltoids occur in which plane of motion?',
        options: ['Sagittal plane', 'Transverse plane', 'Frontal plane', 'Horizontal plane'],
        correctOptionIndex: 2,
        explanation: 'Abduction and adduction of the limbs moving side-to-side occur strictly in the frontal (coronal) plane.',
      },
      {
        id: 'u2-q3',
        unitId: 2,
        questionNumber: 3,
        questionText: 'In a Barbell Biceps Curl, what functional role does the Triceps Brachii play?',
        options: ['Prime mover (Agonist)', 'Synergist', 'Antagonist', 'Fixator'],
        correctOptionIndex: 2,
        explanation: 'The triceps brachii acts as the antagonist to the biceps brachii during elbow flexion, relaxing to allow smooth movement.',
      },
      {
        id: 'u2-q4',
        unitId: 2,
        questionNumber: 4,
        questionText: 'Which muscle acts as the primary synergist assisting the Pectoralis Major during a Flat Barbell Bench Press?',
        options: ['Latissimus Dorsi', 'Anterior Deltoid & Triceps Brachii', 'Biceps Brachii', 'Rectus Abdominis'],
        correctOptionIndex: 1,
        explanation: 'The anterior deltoids assist shoulder flexion/horizontal adduction and triceps drive elbow extension as primary synergists.',
      },
      {
        id: 'u2-q5',
        unitId: 2,
        questionNumber: 5,
        questionText: 'Which of the four quadriceps muscles crosses BOTH the hip joint and the knee joint?',
        options: ['Vastus Lateralis', 'Vastus Medialis', 'Vastus Intermedius', 'Rectus Femoris'],
        correctOptionIndex: 3,
        explanation: 'Rectus femoris is a bi-articular muscle originating from the anterior inferior iliac spine, acting as both a hip flexor and knee extensor.',
      },
      {
        id: 'u2-q6',
        unitId: 2,
        questionNumber: 6,
        questionText: 'What is the primary anatomical joint action of the Latissimus Dorsi muscle during a Lat Pulldown?',
        options: ['Shoulder Adduction and Shoulder Extension', 'Shoulder Abduction and Flexion', 'Elbow Flexion only', 'Spinal Lateral Flexion'],
        correctOptionIndex: 0,
        explanation: 'The latissimus dorsi functions to adduct and extend the humerus at the glenohumeral shoulder joint.',
      },
      {
        id: 'u2-q7',
        unitId: 2,
        questionNumber: 7,
        questionText: 'What neurological phenomenon causes an antagonist muscle to relax when its opposing agonist contracts?',
        options: ['Henneman’s Law', 'Reciprocal Inhibition', 'The Stretch Reflex', 'Post-Activation Potentiation'],
        correctOptionIndex: 1,
        explanation: 'Reciprocal inhibition is the neuromuscular process where neural drive to the agonist causes reciprocal relaxation of the antagonist muscle.',
      },
      {
        id: 'u2-q8',
        unitId: 2,
        questionNumber: 8,
        questionText: 'Which muscle group is responsible for external rotation and stabilization of the humeral head in the shoulder socket?',
        options: ['Pectoralis Minor', 'The Rotator Cuff (Supraspinatus, Infraspinatus, Teres Minor, Subscapularis)', 'Latissimus Dorsi', 'Serratus Anterior'],
        correctOptionIndex: 1,
        explanation: 'The four rotator cuff muscles dynamically stabilize the humeral head centrally inside the shallow glenoid fossa.',
      },
      {
        id: 'u2-q9',
        unitId: 2,
        questionNumber: 9,
        questionText: 'Why do barbell back squats produce relatively low direct stimulus for the hamstrings?',
        options: [
          'Because the hamstrings do not have any motor units',
          'Because the hamstrings shorten at the knee while lengthening at the hip, resulting in quasi-isometric contraction',
          'Because the quads prevent blood flow to the hamstrings',
          'Because squats only work the calf muscles',
        ],
        correctOptionIndex: 1,
        explanation: 'During a squat, simultaneous hip and knee flexion keeps hamstring length relatively constant, minimizing dynamic mechanical tension on the hamstrings.',
      },
      {
        id: 'u2-q10',
        unitId: 2,
        questionNumber: 10,
        questionText: 'What is the primary action of the Gluteus Medius during gait and single-leg exercises?',
        options: ['Knee Extension', 'Hip Abduction and Pelvic Frontal Plane Stabilization', 'Spinal Flexion', 'Ankle Plantarflexion'],
        correctOptionIndex: 1,
        explanation: 'Gluteus medius abducts the hip and prevents the opposite side of the pelvis from dropping during single-leg stance (Trendelenburg sign).',
      },
      {
        id: 'u2-q11',
        unitId: 2,
        questionNumber: 11,
        questionText: 'Movement away from the anatomical midline of the body in the frontal plane is termed:',
        options: ['Adduction', 'Abduction', 'Flexion', 'Internal Rotation'],
        correctOptionIndex: 1,
        explanation: 'Abduction refers to moving a limb laterally away from the central midline of the body.',
      },
      {
        id: 'u2-q12',
        unitId: 2,
        questionNumber: 12,
        questionText: 'Which head of the Triceps Brachii crosses the glenohumeral joint and benefits most from overhead extensions?',
        options: ['Lateral head', 'Medial head', 'Long head', 'Anconeus'],
        correctOptionIndex: 2,
        explanation: 'The long head of the triceps originates on the infraglenoid tubercle of the scapula, requiring overhead shoulder flexion for maximum stretch.',
      },
      {
        id: 'u2-q13',
        unitId: 2,
        questionNumber: 13,
        questionText: 'A Russian Twist or Cable Woodchop exercise operates predominantly in which movement plane?',
        options: ['Sagittal plane', 'Frontal plane', 'Transverse plane', 'Vertical plane'],
        correctOptionIndex: 2,
        explanation: 'Rotational core exercises involving spinal twisting operate in the transverse (horizontal) plane.',
      },
      {
        id: 'u2-q14',
        unitId: 2,
        questionNumber: 14,
        questionText: 'Which lower body muscle crosses the knee joint and acts as a plantarflexor only when the knee is straight?',
        options: ['Soleus', 'Gastrocnemius', 'Tibialis Anterior', 'Peroneus Longus'],
        correctOptionIndex: 1,
        explanation: 'Gastrocnemius originates above the femoral condyles and is fully active when the knee is extended; Soleus handles bent-knee calf raises.',
      },
      {
        id: 'u2-q15',
        unitId: 2,
        questionNumber: 15,
        questionText: 'Why is scapular retraction and depression essential during heavy horizontal rowing?',
        options: [
          'To disengage the lats completely',
          'To engage the rhomboids and mid/lower trapezius while protecting the anterior shoulder capsule',
          'To force all load onto the cervical spine',
          'To prevent any biceps activation',
        ],
        correctOptionIndex: 1,
        explanation: 'Active scapular retraction engages the mid back musculature, stabilizes the shoulder girdle, and prevents anterior humeral gliding.',
      },
    ],
  },
];

// Helper to get or generate mock unit items for units 3-20 if needing fast lookup
export function getTrainerUnitById(unitId: number): TrainerUnit | undefined {
  const found = TRAINER_ACADEMY_UNITS.find((u) => u.id === unitId);
  if (found) return found;

  // Generate fallback detailed unit schema for units 3-20
  return generateDynamicUnit(unitId);
}

function generateDynamicUnit(id: number): TrainerUnit {
  const unitTitles: Record<number, { title: string; titleAm: string; subtitle: string; category: any; icon: string }> = {
    3: { title: 'The Science of Muscle Hypertrophy', titleAm: 'የጡንቻ እድገት ሳይንስ', subtitle: 'Mechanical tension, volume thresholds, and protein synthesis triggers', category: 'Hypertrophy & Strength', icon: 'Flame' },
    4: { title: 'Strength Training Fundamentals & Periodization', titleAm: 'የጥንካሬ ስልጠና እና የጊዜ ክፍፍል', subtitle: 'Linear, undulating, and block periodization models', category: 'Hypertrophy & Strength', icon: 'Dumbbell' },
    5: { title: 'Master Exercise Technique & Movement Biomechanics', titleAm: 'የስፖርት ፎርም እና ባዮሜካኒክስ', subtitle: 'Squat, Bench, Deadlift, OHP, and Pullup execution mechanics', category: 'Hypertrophy & Strength', icon: 'ShieldCheck' },
    6: { title: 'Professional Program Design & Weekly Splits', titleAm: 'የስልጠና ፕሮግራም አወቃቀር', subtitle: 'PPL, Upper/Lower, and Full Body split architecture', category: 'Programming & Assessment', icon: 'Calendar' },
    7: { title: 'Sports & Fitness Nutrition Fundamentals', titleAm: 'የስፖርት ስነ-ምግብ መሰረቶች', subtitle: 'Macro distribution, hydration, and nutrient timing', category: 'Nutrition & Metabolism', icon: 'Apple' },
    8: { title: 'Calories, Energy Balance & Macronutrients', titleAm: 'የካሎሪ ሚዛን እና ማክሮዎች', subtitle: 'TDEE calculation, metabolic adaptations, and energy availability', category: 'Nutrition & Metabolism', icon: 'PieChart' },
    9: { title: 'Sustainable Weight Loss & Body Composition', titleAm: 'ዘላቂ ክብደት መቀነስ እና ስብ ማቃጠል', subtitle: 'Evidence-based cutting protocols and lean muscle preservation', category: 'Nutrition & Metabolism', icon: 'TrendingDown' },
    10: { title: 'Muscle Gain & Hypertrophic Bulking', titleAm: 'የጡንቻ ክብደት መጨመር', subtitle: 'Caloric surplus optimization and lean mass accrual', category: 'Hypertrophy & Strength', icon: 'TrendingUp' },
    11: { title: 'Recovery Science, Sleep & Fatigue Management', titleAm: 'የእረፍት ሳይንስ እና እንቅልፍ', subtitle: 'CNS fatigue, sleep architecture, and deload protocols', category: 'Fundamentals', icon: 'Moon' },
    12: { title: 'Cardio & Conditioning Systems', titleAm: 'የልብ ጤና እና የካርዲዮ ስልጠና', subtitle: 'Zone 2, HIIT, and mitigating the interference effect', category: 'Fundamentals', icon: 'Heart' },
    13: { title: 'Mobility, Flexibility & Movement Prep', titleAm: 'የሰውነት ማፍታታት እና መተጣጠፍ', subtitle: 'Dynamic mobility routines and active range of motion', category: 'Fundamentals', icon: 'Sparkles' },
    14: { title: 'Client Assessment, Screening & Goal Profiling', titleAm: 'የደንበኞች ምርመራ እና ግብ አወሳሰን', subtitle: 'PAR-Q+, movement screens, and posture assessments', category: 'Programming & Assessment', icon: 'UserCheck' },
    15: { title: 'Individualized Program Customization', titleAm: 'የግል ፕሮግራም ማስተካከል', subtitle: 'Adapting volume for injuries, age, and individual anatomy', category: 'Programming & Assessment', icon: 'Sliders' },
    16: { title: 'Coaching Psychology, Communication & Adherence', titleAm: 'የአሰልጣኝነት ሳይኮሎጂ እና ተግባቦት', subtitle: 'Motivational interviewing, habit formation, and adherence', category: 'Coaching & Safety', icon: 'MessageCircle' },
    17: { title: 'Injury Prevention, Red Flags & Client Safety', titleAm: 'የጉዳት መከላከል እና የደህንነት ደንቦች', subtitle: 'Identifying contraindications, acute pain, and medical referrals', category: 'Coaching & Safety', icon: 'AlertTriangle' },
    18: { title: 'Advanced Training Concepts (RPE, RIR, Deloads)', titleAm: 'የላቁ የስልጠና ቴክኒኮች', subtitle: 'Autoregulation, fatigue management, and specialized intensity', category: 'Hypertrophy & Strength', icon: 'Zap' },
    19: { title: 'Real-World Client Case Scenarios', titleAm: 'የእውነተኛ ህይወት ደንበኞች ጥናት', subtitle: 'Step-by-step troubleshooting of real client challenges', category: 'Coaching & Safety', icon: 'BookOpen' },
    20: { title: 'Master Trainer Final Comprehensive Assessment', titleAm: 'የማስተር አሰልጣኝ የመጨረሻ አጠቃላይ ፈተና', subtitle: 'Comprehensive cumulative 15-question mastery certification exam', category: 'Coaching & Safety', icon: 'Award' },
  };

  const meta = unitTitles[id] || {
    title: `Unit ${id}: Advanced Fitness Coaching`,
    titleAm: `ዩኒት ${id}፡ የላቀ የአሰልጣኝነት ስልጠና`,
    subtitle: 'Comprehensive training principles and application',
    category: 'Fundamentals',
    icon: 'BookOpen',
  };

  const sampleQuestions = Array.from({ length: 15 }, (_, i) => ({
    id: `u${id}-q${i + 1}`,
    unitId: id,
    questionNumber: i + 1,
    questionText: `Unit ${id} Question ${i + 1}: What is the core evidence-based principle regarding ${meta.title}?`,
    options: [
      `Optimal progress requires consistent progressive overload, structured volume, and proper recovery.`,
      `Extreme rapid exhaustion without technique is the only way to adapt.`,
      `Genetics alone determine 100% of physical outcomes regardless of training.`,
      `Rest periods should always be eliminated completely.`,
    ],
    correctOptionIndex: 0,
    explanation: `Scientific exercise physiology dictates that structured overload, appropriate volume (10-20 weekly sets), and recovery lead to safe, predictable adaptations.`,
  }));

  return {
    id,
    unitNumber: id,
    title: meta.title,
    titleAm: meta.titleAm,
    subtitle: meta.subtitle,
    iconName: meta.icon,
    category: meta.category,
    overview: `Detailed professional coaching module covering ${meta.title}.`,
    lessonsCount: 2,
    passingScoreThreshold: 12,
    lessons: [
      {
        id: `u${id}-l1`,
        unitId: id,
        lessonNumber: 1,
        title: `${meta.title} — Part 1: Scientific Foundations`,
        titleAm: `${meta.titleAm} — ክፍል 1`,
        estimatedReadMin: 8,
        learningObjectives: [
          `Master core physiological concepts of ${meta.title}`,
          `Apply scientific principles to exercise prescription`,
        ],
        summary: `Evidence-based breakdown of ${meta.title} for certified fitness trainers.`,
        contentSections: [
          {
            heading: 'Foundational Principles',
            body: `Understanding the physiological and biomechanical mechanisms behind ${meta.title} is essential for creating safe, effective client training protocols.`,
            bullets: [
              'Evidence-based prescription based on individual client assessment',
              'Systematic progression and fatigue management',
              'Adherence to ethical and medical safety boundaries',
            ],
            highlightBox: {
              title: 'Trainer Science Application',
              text: 'Always tailor volume, load, and rest to the individual client rather than applying rigid generic templates.',
              type: 'science',
            },
          },
        ],
        trainerTips: [
          'Track client feedback and performance metrics at every session.',
          'Never sacrifice movement quality for heavier loading on the bar.',
        ],
        commonMistakes: [
          'Progressing load before a client has demonstrated mastery of movement mechanics.',
        ],
        keyTakeaways: [
          'Consistency, technique, and proper recovery are the ultimate drivers of client success.',
        ],
      },
      {
        id: `u${id}-l2`,
        unitId: id,
        lessonNumber: 2,
        title: `${meta.title} — Part 2: Practical Application`,
        titleAm: `${meta.titleAm} — ክፍል 2`,
        estimatedReadMin: 8,
        learningObjectives: [
          `Implement programming and coaching cues for ${meta.title}`,
          `Troubleshoot common client plateaus and errors`,
        ],
        summary: `Real-world coaching scenarios and programmatic implementation of ${meta.title}.`,
        contentSections: [
          {
            heading: 'Practical Implementation',
            body: `How to translate theoretical concepts into high-impact gym floor results for diverse client populations.`,
          },
        ],
        trainerTips: ['Use positive, concise external coaching cues.'],
        commonMistakes: ['Over-explaining internal anatomy during a live set.'],
        keyTakeaways: ['Simple, clear execution produces the best long-term adherence.'],
      },
    ],
    quizQuestions: sampleQuestions,
  };
}
