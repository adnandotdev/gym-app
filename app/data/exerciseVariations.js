const VARIATION_GROUPS = Object.freeze([
  'Recommended',
  'Same movement',
  'Different emphasis',
  'Progression or alternative',
]);
const VARIATION_GROUP_LABELS = Object.freeze(Object.fromEntries(
  VARIATION_GROUPS.map((group) => [group, group]),
));

const V = (slug, name, summary, setupCue, options = {}) => ({
  slug,
  name,
  summary,
  setupCue,
  ...options,
});

const CATALOG = {
  'chest-1': {
    defaults: { equipment: 'Barbell', difficulty: 'Intermediate', primaryMuscles: ['Pectoralis major'], secondaryMuscles: ['Anterior deltoids', 'Triceps'] },
    variations: [
      V('flat-medium-grip', 'Flat Barbell Bench Press', 'Balanced press for the sternocostal chest.', 'Use a medium grip and lower the bar to mid-chest.'),
      V('close-grip', 'Close-Grip Bench Press', 'Pressing variation with greater triceps contribution.', 'Keep the elbows close and hands just inside shoulder width.', { group: 'Different emphasis' }),
      V('incline-30', '30° Incline Barbell Press', 'Incline press with greater upper-chest emphasis.', 'Set the bench near 30 degrees and touch the upper chest.', { group: 'Different emphasis' }),
      V('decline', 'Decline Barbell Press', 'Decline press emphasizing the lower sternocostal region.', 'Secure the legs and lower the bar below the nipple line.', { group: 'Different emphasis' }),
    ],
  },
  'chest-2': {
    defaults: { equipment: 'Dumbbells', difficulty: 'Intermediate', primaryMuscles: ['Clavicular pectoralis major'], secondaryMuscles: ['Anterior deltoids', 'Triceps'] },
    variations: [
      V('incline-30', '30° Incline Dumbbell Press', 'Stable upper-chest press at a moderate incline.', 'Set the bench near 30 degrees and press over the upper chest.'),
      V('low-incline-15', '15° Low-Incline Dumbbell Press', 'Low incline blending upper and middle chest demand.', 'Use a shallow incline and keep forearms vertical.', { group: 'Same movement' }),
      V('neutral-grip', 'Neutral-Grip Incline Dumbbell Press', 'Shoulder-friendly incline press with palms facing inward.', 'Keep palms facing each other and elbows slightly tucked.', { group: 'Same movement' }),
      V('single-arm', 'Single-Arm Incline Dumbbell Press', 'Unilateral press adding anti-rotation demand.', 'Brace the trunk and press one dumbbell without rotating.', { group: 'Progression or alternative' }),
    ],
  },
  'chest-3': {
    defaults: { equipment: 'Bodyweight', difficulty: 'Beginner', primaryMuscles: ['Pectoralis major'], secondaryMuscles: ['Triceps', 'Anterior deltoids', 'Serratus anterior'] },
    variations: [
      V('standard', 'Standard Push-Up', 'Balanced bodyweight press for chest and triceps.', 'Keep a straight body line and lower the chest between the hands.'),
      V('incline', 'Incline Push-Up', 'Accessible regression using an elevated hand position.', 'Place hands on a stable bench and keep the body rigid.', { difficulty: 'Beginner', group: 'Progression or alternative' }),
      V('decline', 'Feet-Elevated Push-Up', 'Harder push-up with more upper-chest and shoulder demand.', 'Elevate the feet while maintaining a strong plank.', { difficulty: 'Intermediate', group: 'Different emphasis' }),
      V('diamond', 'Diamond Push-Up', 'Narrow-hand push-up with greater triceps demand.', 'Form a narrow hand base and keep elbows close.', { difficulty: 'Intermediate', group: 'Different emphasis' }),
    ],
  },
  'chest-4': {
    defaults: { equipment: 'Cable', difficulty: 'Intermediate', primaryMuscles: ['Pectoralis major'], secondaryMuscles: ['Anterior deltoids', 'Serratus anterior'] },
    variations: [
      V('midline', 'Midline Cable Crossover', 'Horizontal cable fly for balanced chest adduction.', 'Set handles near chest height and hug the arms forward.'),
      V('low-to-high', 'Low-to-High Cable Crossover', 'Rising cable path emphasizing the upper chest.', 'Sweep the handles upward toward the upper chest.', { group: 'Different emphasis', primaryMuscles: ['Clavicular pectoralis major'] }),
      V('high-to-low', 'High-to-Low Cable Crossover', 'Descending cable path emphasizing lower chest fibers.', 'Sweep the handles down toward the front pockets.', { group: 'Different emphasis', primaryMuscles: ['Sternocostal pectoralis major'] }),
      V('single-arm', 'Single-Arm Cable Crossover', 'Unilateral fly adding trunk anti-rotation demand.', 'Keep the torso square while one arm crosses the chest.', { group: 'Progression or alternative' }),
    ],
  },
  'chest-5': {
    defaults: { equipment: 'Dip Station', difficulty: 'Advanced', primaryMuscles: ['Sternocostal pectoralis major'], secondaryMuscles: ['Triceps', 'Anterior deltoids'] },
    variations: [
      V('forward-lean', 'Forward-Lean Chest Dip', 'Chest-focused dip using a controlled forward torso lean.', 'Lean forward, let elbows travel out slightly, and press smoothly.'),
      V('assisted', 'Assisted Chest Dip', 'Supported regression preserving the chest-dip pattern.', 'Use enough assistance to control the full range.', { difficulty: 'Beginner', equipment: 'Assisted Dip Machine', group: 'Progression or alternative' }),
      V('weighted', 'Weighted Chest Dip', 'Loaded progression for experienced dip performers.', 'Secure the load and maintain the same forward lean.', { equipment: 'Dip Belt', group: 'Progression or alternative' }),
      V('upright', 'Upright Dip', 'More vertical dip with increased triceps contribution.', 'Keep the torso tall and elbows close to the ribs.', { group: 'Different emphasis' }),
    ],
  },
  'chest-6': {
    defaults: { equipment: 'Machine', difficulty: 'Beginner', primaryMuscles: ['Pectoralis major'], secondaryMuscles: ['Anterior deltoids'] },
    variations: [
      V('standard', 'Standard Pec Deck', 'Stable machine fly for controlled chest adduction.', 'Align elbows with mid-chest and keep the back on the pad.'),
      V('single-arm', 'Single-Arm Pec Deck', 'Unilateral fly for side-to-side control.', 'Keep the torso still while one arm closes the machine.', { difficulty: 'Intermediate', group: 'Progression or alternative' }),
      V('low-seat', 'Low-Seat Pec Deck', 'Slight rising arm path that biases the upper chest.', 'Lower the seat so the elbows travel slightly upward.', { group: 'Different emphasis' }),
      V('paused', 'Paused Pec Deck', 'Controlled fly with a deliberate shortened-position pause.', 'Hold the handles together briefly without rounding forward.', { group: 'Same movement' }),
    ],
  },

  'back-1': {
    defaults: { equipment: 'Pull-up Bar', difficulty: 'Advanced', primaryMuscles: ['Latissimus dorsi', 'Teres major'], secondaryMuscles: ['Biceps', 'Brachialis', 'Lower trapezius'] },
    variations: [
      V('pronated', 'Pronated Pull-Up', 'Balanced vertical pull using an overhand grip.', 'Grip just outside shoulder width and pull the chest toward the bar.'),
      V('chin-up', 'Supinated Chin-Up', 'Vertical pull with greater elbow-flexor contribution.', 'Use an underhand grip and keep elbows tracking forward.', { group: 'Different emphasis' }),
      V('neutral-grip', 'Neutral-Grip Pull-Up', 'Joint-friendly vertical pull with palms facing inward.', 'Pull between parallel handles without swinging.', { group: 'Same movement' }),
      V('assisted', 'Assisted Pull-Up', 'Scalable regression for developing vertical-pull strength.', 'Choose assistance that permits a controlled full range.', { difficulty: 'Beginner', equipment: 'Assisted Pull-up Machine', group: 'Progression or alternative' }),
    ],
  },
  'back-2': {
    defaults: { equipment: 'Cable', difficulty: 'Beginner', primaryMuscles: ['Latissimus dorsi', 'Teres major'], secondaryMuscles: ['Biceps', 'Brachialis', 'Rhomboids'] },
    variations: [
      V('medium-pronated', 'Medium Pronated-Grip Lat Pulldown', 'Balanced pulldown for the lats and elbow flexors.', 'Grip just outside shoulder width and pull to the upper chest.'),
      V('close-neutral', 'Close Neutral-Grip Lat Pulldown', 'Comfortable close-grip pulldown through a long range.', 'Use a neutral handle and drive elbows toward the ribs.', { group: 'Same movement' }),
      V('underhand', 'Underhand Lat Pulldown', 'Supinated pulldown with greater biceps contribution.', 'Keep the chest tall and pull with elbows close.', { group: 'Different emphasis' }),
      V('single-arm', 'Single-Arm Lat Pulldown', 'Unilateral pulldown for independent side control.', 'Keep the torso square and pull the elbow toward the hip.', { difficulty: 'Intermediate', group: 'Progression or alternative' }),
    ],
  },
  'back-3': {
    defaults: { equipment: 'Barbell', difficulty: 'Intermediate', primaryMuscles: ['Latissimus dorsi', 'Rhomboids', 'Middle trapezius'], secondaryMuscles: ['Posterior deltoids', 'Biceps', 'Erector spinae'] },
    variations: [
      V('pronated', 'Pronated Barbell Row', 'Balanced free-weight row for lats and mid-back.', 'Hinge firmly and row the bar toward the lower ribs.'),
      V('underhand', 'Underhand Barbell Row', 'Tucked-elbow row with increased biceps contribution.', 'Use an underhand grip and row toward the waist.', { group: 'Different emphasis' }),
      V('wide-grip', 'Wide-Grip Barbell Row', 'Elbows-out row emphasizing upper back and rear delts.', 'Take a wider grip and row toward the upper abdomen.', { group: 'Different emphasis', primaryMuscles: ['Rhomboids', 'Middle trapezius', 'Posterior deltoids'] }),
      V('pendlay', 'Pendlay Row', 'Dead-stop row emphasizing power from a fixed torso.', 'Reset the bar on the floor between strict repetitions.', { difficulty: 'Advanced', group: 'Progression or alternative' }),
    ],
  },
  'back-4': {
    defaults: { equipment: 'Cable', difficulty: 'Beginner', primaryMuscles: ['Latissimus dorsi', 'Rhomboids', 'Middle trapezius'], secondaryMuscles: ['Biceps', 'Posterior deltoids'] },
    variations: [
      V('close-neutral', 'Close Neutral-Grip Cable Row', 'Balanced seated row with a tucked elbow path.', 'Pull the neutral handle toward the lower ribs.'),
      V('wide-pronated', 'Wide-Grip Cable Row', 'Elbows-out row emphasizing mid-back and rear delts.', 'Pull a wide bar toward the upper abdomen.', { group: 'Different emphasis', primaryMuscles: ['Rhomboids', 'Middle trapezius', 'Posterior deltoids'] }),
      V('single-arm', 'Single-Arm Cable Row', 'Unilateral row adding anti-rotation control.', 'Keep shoulders square as the elbow travels behind the body.', { difficulty: 'Intermediate', group: 'Progression or alternative' }),
      V('high-row', 'High Cable Row', 'High line of pull for upper back and rear delts.', 'Set the cable high and row toward the upper chest.', { group: 'Different emphasis' }),
    ],
  },
  'back-5': {
    defaults: { equipment: 'Dumbbell', difficulty: 'Intermediate', primaryMuscles: ['Latissimus dorsi', 'Teres major'], secondaryMuscles: ['Rhomboids', 'Biceps', 'Posterior deltoids'] },
    variations: [
      V('elbow-to-hip', 'Lat-Biased One-Arm Dumbbell Row', 'Tucked row emphasizing shoulder extension through the lats.', 'Drive the elbow back toward the hip without twisting.'),
      V('elbow-out', 'Upper-Back One-Arm Dumbbell Row', 'Elbows-out row emphasizing rear delts and mid-back.', 'Row toward the upper ribs with the elbow angled outward.', { group: 'Different emphasis', primaryMuscles: ['Rhomboids', 'Middle trapezius', 'Posterior deltoids'] }),
      V('chest-supported', 'Chest-Supported One-Arm Row', 'Supported row reducing lower-back stabilization.', 'Brace the chest on an incline bench and row one side.', { equipment: 'Dumbbell and Bench', group: 'Progression or alternative' }),
      V('dead-stop', 'Dead-Stop Dumbbell Row', 'Strict row with each repetition reset on the floor.', 'Set the weight down gently before starting each pull.', { difficulty: 'Advanced', group: 'Same movement' }),
    ],
  },
  'back-6': {
    defaults: { equipment: 'T-Bar Machine', difficulty: 'Intermediate', primaryMuscles: ['Latissimus dorsi', 'Rhomboids', 'Middle trapezius'], secondaryMuscles: ['Biceps', 'Posterior deltoids', 'Erector spinae'] },
    variations: [
      V('close-neutral', 'Close Neutral-Grip T-Bar Row', 'Balanced T-bar row with a tucked elbow path.', 'Pull the close handles toward the lower chest.'),
      V('wide-pronated', 'Wide-Grip T-Bar Row', 'Wide row emphasizing upper back and posterior delts.', 'Use wide handles and row with elbows angled outward.', { group: 'Different emphasis' }),
      V('chest-supported', 'Chest-Supported T-Bar Row', 'Stable row reducing demands on the spinal erectors.', 'Keep the chest on the pad throughout every repetition.', { group: 'Progression or alternative' }),
      V('single-arm-landmine', 'Single-Arm Landmine Row', 'Unilateral landmine row for independent lat control.', 'Stand beside the bar and row one end toward the hip.', { equipment: 'Landmine', difficulty: 'Advanced', group: 'Progression or alternative' }),
    ],
  },

  'shoulder-1': {
    defaults: { equipment: 'Barbell', difficulty: 'Intermediate', primaryMuscles: ['Anterior deltoids', 'Lateral deltoids'], secondaryMuscles: ['Triceps', 'Upper trapezius', 'Serratus anterior'] },
    variations: [
      V('standing-barbell', 'Standing Barbell Overhead Press', 'Compound standing press for shoulders and triceps.', 'Brace the trunk and press the bar vertically overhead.'),
      V('seated-dumbbell', 'Seated Dumbbell Shoulder Press', 'Stable independent-arm overhead press.', 'Keep the back supported and press dumbbells overhead.', { equipment: 'Dumbbells', group: 'Progression or alternative' }),
      V('neutral-grip', 'Neutral-Grip Dumbbell Press', 'Shoulder-friendly press with palms facing inward.', 'Keep elbows slightly forward in the scapular plane.', { equipment: 'Dumbbells', group: 'Same movement' }),
      V('single-arm-landmine', 'Single-Arm Landmine Press', 'Angled unilateral press with added trunk control.', 'Press the bar up and forward without rotating the torso.', { equipment: 'Landmine', group: 'Progression or alternative' }),
    ],
  },
  'shoulder-2': {
    defaults: { equipment: 'Dumbbells', difficulty: 'Beginner', primaryMuscles: ['Lateral deltoids'], secondaryMuscles: ['Supraspinatus', 'Upper trapezius'] },
    variations: [
      V('standing', 'Standing Dumbbell Lateral Raise', 'Classic lateral raise for the side deltoids.', 'Raise in the scapular plane with softly bent elbows.'),
      V('cable', 'Single-Arm Cable Lateral Raise', 'Cable variation maintaining tension through the range.', 'Stand side-on and lead upward with the elbow.', { equipment: 'Cable', group: 'Progression or alternative' }),
      V('behind-body-cable', 'Behind-Body Cable Lateral Raise', 'Cable raise loading the deltoid in a longer position.', 'Start with the cable passing behind the body.', { equipment: 'Cable', difficulty: 'Intermediate', group: 'Different emphasis' }),
      V('machine', 'Machine Lateral Raise', 'Stable side-delt isolation with a guided path.', 'Align the machine pivot with the shoulders.', { equipment: 'Machine', group: 'Progression or alternative' }),
    ],
  },
  'shoulder-3': {
    defaults: { equipment: 'Dumbbells', difficulty: 'Beginner', primaryMuscles: ['Anterior deltoids'], secondaryMuscles: ['Clavicular pectoralis major', 'Lateral deltoids'] },
    variations: [
      V('alternating', 'Alternating Dumbbell Front Raise', 'Controlled unilateral raise for the front deltoids.', 'Raise one dumbbell to shoulder height without leaning.'),
      V('neutral-grip', 'Neutral-Grip Front Raise', 'Front raise using a shoulder-friendly thumb-up grip.', 'Keep thumbs pointing upward and ribs stacked.', { group: 'Same movement' }),
      V('cable', 'Cable Front Raise', 'Cable variation with continuous resistance.', 'Face away from a low cable and raise to shoulder height.', { equipment: 'Cable', group: 'Progression or alternative' }),
      V('plate', 'Plate Front Raise', 'Bilateral front raise with a fixed hand position.', 'Hold a plate securely and lift without arching the back.', { equipment: 'Weight Plate', group: 'Progression or alternative' }),
    ],
  },
  'shoulder-4': {
    defaults: { equipment: 'Machine', difficulty: 'Beginner', primaryMuscles: ['Posterior deltoids'], secondaryMuscles: ['Rhomboids', 'Middle trapezius', 'Infraspinatus'] },
    variations: [
      V('standard', 'Standard Reverse Pec Deck', 'Stable rear-delt fly with upper-back assistance.', 'Set handles at shoulder height and sweep arms outward.'),
      V('single-arm', 'Single-Arm Reverse Pec Deck', 'Unilateral rear-delt fly for side-to-side control.', 'Keep the chest on the pad while one arm opens.', { difficulty: 'Intermediate', group: 'Progression or alternative' }),
      V('high-elbow', 'High-Elbow Reverse Pec Deck', 'Elbows-out path emphasizing posterior deltoids.', 'Keep elbows near shoulder height throughout the sweep.', { group: 'Different emphasis' }),
      V('cable-reverse-fly', 'Cable Reverse Fly', 'Free cable alternative with continuous tension.', 'Cross the cables and open the arms without shrugging.', { equipment: 'Cable', group: 'Progression or alternative' }),
    ],
  },
  'shoulder-5': {
    defaults: { equipment: 'Dumbbells', difficulty: 'Intermediate', primaryMuscles: ['Anterior deltoids', 'Lateral deltoids'], secondaryMuscles: ['Triceps', 'Upper trapezius'] },
    variations: [
      V('seated', 'Seated Arnold Press', 'Rotating seated press for the front and side delts.', 'Rotate smoothly as the dumbbells travel overhead.'),
      V('standing', 'Standing Arnold Press', 'Standing variation adding greater trunk stabilization.', 'Brace the ribs down while rotating and pressing.', { group: 'Same movement' }),
      V('single-arm', 'Single-Arm Arnold Press', 'Unilateral press adding anti-rotation demand.', 'Keep the torso square as one arm rotates overhead.', { difficulty: 'Advanced', group: 'Progression or alternative' }),
      V('alternating', 'Alternating Arnold Press', 'Alternating press allowing focused side-to-side control.', 'Complete each repetition before changing arms.', { group: 'Same movement' }),
    ],
  },
  'shoulder-6': {
    defaults: { equipment: 'Cable', difficulty: 'Intermediate', primaryMuscles: ['Posterior deltoids', 'Infraspinatus', 'Teres minor'], secondaryMuscles: ['Rhomboids', 'Middle trapezius', 'Lower trapezius'] },
    variations: [
      V('rope-forehead', 'Rope Face Pull', 'Balanced face pull for rear delts and external rotators.', 'Pull the rope toward the forehead and separate the ends.'),
      V('external-rotation', 'Face Pull with External Rotation', 'Face pull finishing with stronger external rotation.', 'Finish with fists above elbows without arching the back.', { group: 'Different emphasis' }),
      V('seated', 'Seated Cable Face Pull', 'Stable seated variation that reduces body movement.', 'Sit tall and pull without leaning backward.', { group: 'Same movement' }),
      V('banded', 'Band Face Pull', 'Portable regression with accommodating resistance.', 'Anchor the band at face height and control the return.', { equipment: 'Resistance Band', difficulty: 'Beginner', group: 'Progression or alternative' }),
    ],
  },

  'arms-1': {
    defaults: { equipment: 'Barbell', difficulty: 'Beginner', primaryMuscles: ['Biceps brachii'], secondaryMuscles: ['Brachialis', 'Brachioradialis', 'Forearm flexors'] },
    variations: [
      V('medium-grip', 'Medium-Grip Barbell Curl', 'Balanced standing curl for both biceps heads.', 'Keep elbows beside the ribs and avoid torso swing.'),
      V('ez-bar', 'EZ-Bar Curl', 'Angled-grip curl that may feel easier on the wrists.', 'Use the angled grips and keep wrists neutral.', { equipment: 'EZ Bar', group: 'Progression or alternative' }),
      V('strict-wall', 'Strict Wall Barbell Curl', 'Strict curl minimizing shoulder and torso movement.', 'Keep the upper back against a wall as the bar rises.', { difficulty: 'Intermediate', group: 'Same movement' }),
      V('reverse-grip', 'Reverse Barbell Curl', 'Pronated curl emphasizing brachioradialis and forearms.', 'Use an overhand grip and keep wrists straight.', { group: 'Different emphasis', primaryMuscles: ['Brachioradialis', 'Brachialis'] }),
    ],
  },
  'arms-2': {
    defaults: { equipment: 'Cable', difficulty: 'Beginner', primaryMuscles: ['Triceps brachii'], secondaryMuscles: ['Anconeus'] },
    variations: [
      V('rope', 'Rope Tricep Pushdown', 'Cable extension allowing a natural wrist position.', 'Pin elbows to the sides and separate the rope at lockout.'),
      V('straight-bar', 'Straight-Bar Tricep Pushdown', 'Stable bilateral pushdown with a fixed grip.', 'Press the bar down without letting elbows drift forward.', { group: 'Same movement' }),
      V('reverse-grip', 'Reverse-Grip Tricep Pushdown', 'Supinated pushdown using lighter controlled loading.', 'Use an underhand grip and keep wrists aligned.', { group: 'Same movement' }),
      V('single-arm', 'Single-Arm Cable Pushdown', 'Unilateral extension for independent arm control.', 'Fully extend one elbow while the shoulder stays still.', { difficulty: 'Intermediate', group: 'Progression or alternative' }),
    ],
  },
  'arms-3': {
    defaults: { equipment: 'Dumbbells', difficulty: 'Beginner', primaryMuscles: ['Brachialis', 'Brachioradialis'], secondaryMuscles: ['Biceps brachii'] },
    variations: [
      V('standard', 'Standard Hammer Curl', 'Neutral-grip curl for brachialis and forearms.', 'Keep palms facing inward throughout the curl.'),
      V('cross-body', 'Cross-Body Hammer Curl', 'Diagonal neutral-grip curl with focused forearm demand.', 'Curl each dumbbell toward the opposite shoulder.', { group: 'Same movement' }),
      V('rope-cable', 'Rope Cable Hammer Curl', 'Continuous-tension hammer curl using a rope.', 'Keep rope ends neutral and elbows beside the body.', { equipment: 'Cable', group: 'Progression or alternative' }),
      V('incline', 'Incline Hammer Curl', 'Supported neutral curl from a lengthened arm position.', 'Let arms hang behind the torso and avoid shoulder movement.', { difficulty: 'Intermediate', group: 'Different emphasis' }),
    ],
  },
  'arms-4': {
    defaults: { equipment: 'Dumbbell', difficulty: 'Intermediate', primaryMuscles: ['Triceps long head'], secondaryMuscles: ['Triceps lateral head', 'Triceps medial head'] },
    variations: [
      V('two-hand-dumbbell', 'Two-Hand Dumbbell Overhead Extension', 'Overhead extension loading the long head at length.', 'Keep elbows pointed forward as the weight lowers behind the head.'),
      V('single-arm', 'Single-Arm Overhead Dumbbell Extension', 'Unilateral overhead extension for independent control.', 'Support the upper arm and extend one elbow overhead.', { group: 'Progression or alternative' }),
      V('rope-cable', 'Rope Cable Overhead Extension', 'Cable version maintaining tension through the range.', 'Face away from the stack and extend the rope overhead.', { equipment: 'Cable', group: 'Progression or alternative' }),
      V('seated-ez', 'Seated EZ-Bar Overhead Extension', 'Bilateral bar variation suited to progressive loading.', 'Keep upper arms vertical while lowering behind the head.', { equipment: 'EZ Bar', difficulty: 'Advanced', group: 'Same movement' }),
    ],
  },
  'arms-5': {
    defaults: { equipment: 'Dumbbell', difficulty: 'Intermediate', primaryMuscles: ['Biceps brachii'], secondaryMuscles: ['Brachialis', 'Forearm flexors'] },
    variations: [
      V('seated', 'Seated Concentration Curl', 'Strict supported curl emphasizing controlled elbow flexion.', 'Brace the upper arm against the inner thigh.'),
      V('supinating', 'Supinating Concentration Curl', 'Curl adding active forearm supination through the lift.', 'Rotate the palm upward as the dumbbell rises.', { group: 'Same movement' }),
      V('cable', 'Cable Concentration Curl', 'Cable variation maintaining tension near the top.', 'Set a low cable and keep the upper arm braced.', { equipment: 'Cable', group: 'Progression or alternative' }),
      V('standing', 'Standing Concentration Curl', 'Unsupported bent-over variation requiring more body control.', 'Brace the elbow against the thigh and avoid swinging.', { difficulty: 'Advanced', group: 'Progression or alternative' }),
    ],
  },
  'arms-6': {
    defaults: { equipment: 'EZ Bar', difficulty: 'Advanced', primaryMuscles: ['Triceps brachii'], secondaryMuscles: ['Anconeus'] },
    variations: [
      V('ez-bar-forehead', 'EZ-Bar Skullcrusher', 'Lying elbow extension with a wrist-friendly bar.', 'Keep upper arms still and lower toward the forehead.'),
      V('behind-head', 'Behind-Head EZ-Bar Extension', 'Longer-range variation loading the triceps long head.', 'Let upper arms angle back and lower beyond the crown.', { group: 'Different emphasis', primaryMuscles: ['Triceps long head'] }),
      V('dumbbell-neutral', 'Neutral-Grip Dumbbell Skullcrusher', 'Independent-arm extension with neutral wrists.', 'Lower dumbbells beside the head while elbows stay narrow.', { equipment: 'Dumbbells', group: 'Progression or alternative' }),
      V('cable', 'Cable Skullcrusher', 'Cable variation providing continuous resistance.', 'Set the bench near a low cable and extend without moving shoulders.', { equipment: 'Cable', group: 'Progression or alternative' }),
    ],
  },

  'abs-1': {
    defaults: { equipment: 'Bodyweight', difficulty: 'Beginner', primaryMuscles: ['Rectus abdominis'], secondaryMuscles: ['Internal obliques', 'External obliques'] },
    variations: [
      V('standard', 'Standard Crunch', 'Short-range spinal flexion for the rectus abdominis.', 'Curl the ribs toward the pelvis without pulling the neck.'),
      V('reverse', 'Reverse Crunch', 'Pelvic-curl variation emphasizing controlled posterior tilt.', 'Lift the pelvis gently rather than swinging the legs.', { group: 'Different emphasis' }),
      V('stability-ball', 'Stability-Ball Crunch', 'Crunch using a longer starting range over a ball.', 'Support the lumbar curve and curl the ribs upward.', { equipment: 'Stability Ball', group: 'Progression or alternative' }),
      V('weighted', 'Weighted Crunch', 'Loaded progression for rectus-abdominis strength.', 'Hold a plate securely and keep the movement controlled.', { equipment: 'Weight Plate', difficulty: 'Intermediate', group: 'Progression or alternative' }),
    ],
  },
  'abs-2': {
    defaults: { equipment: 'Bodyweight', difficulty: 'Beginner', primaryMuscles: ['Rectus abdominis', 'Transverse abdominis'], secondaryMuscles: ['Obliques', 'Gluteus maximus', 'Serratus anterior'] },
    variations: [
      V('forearm', 'Forearm Plank', 'Foundational anti-extension hold for the entire trunk.', 'Squeeze glutes and keep ribs stacked over the pelvis.'),
      V('high', 'High Plank', 'Straight-arm plank adding shoulder and serratus demand.', 'Push the floor away and maintain a straight body line.', { group: 'Same movement' }),
      V('side', 'Side Plank', 'Lateral hold emphasizing obliques and hip stabilizers.', 'Stack shoulders and hips while lifting the waist.', { group: 'Different emphasis', primaryMuscles: ['Internal obliques', 'External obliques'] }),
      V('long-lever', 'Long-Lever Plank', 'Harder anti-extension plank with elbows farther forward.', 'Move elbows forward only while the lower back stays neutral.', { difficulty: 'Advanced', group: 'Progression or alternative' }),
    ],
  },
  'abs-3': {
    defaults: { equipment: 'Pull-up Bar', difficulty: 'Advanced', primaryMuscles: ['Rectus abdominis', 'Hip flexors'], secondaryMuscles: ['Obliques', 'Forearm flexors'] },
    variations: [
      V('bent-knee-pelvic-curl', 'Hanging Knee Raise with Pelvic Curl', 'Bent-knee raise finished with posterior pelvic rotation.', 'Curl the pelvis upward after lifting the knees.'),
      V('straight-leg', 'Hanging Straight-Leg Raise', 'Long-lever raise increasing hip-flexor and abdominal demand.', 'Raise straight legs without swinging or arching.', { group: 'Progression or alternative' }),
      V('captains-chair', "Captain's Chair Knee Raise", 'Supported regression reducing grip demands.', 'Press into the pads and curl knees toward the chest.', { equipment: "Captain's Chair", difficulty: 'Intermediate', group: 'Progression or alternative' }),
      V('toes-to-bar', 'Toes-to-Bar', 'Advanced full-range hanging leg-raise progression.', 'Use controlled trunk compression and avoid uncontrolled swing.', { difficulty: 'Advanced', group: 'Progression or alternative' }),
    ],
  },
  'abs-4': {
    defaults: { equipment: 'Dumbbell', difficulty: 'Intermediate', primaryMuscles: ['Internal obliques', 'External obliques'], secondaryMuscles: ['Rectus abdominis', 'Hip flexors'] },
    variations: [
      V('feet-down', 'Feet-Down Russian Twist', 'Controlled seated rotation with a stable foot base.', 'Rotate through the upper trunk while keeping feet planted.'),
      V('feet-up', 'Feet-Elevated Russian Twist', 'Harder twist adding balance and hip-flexor demand.', 'Keep the spine long and move without rushing.', { difficulty: 'Advanced', group: 'Progression or alternative' }),
      V('medicine-ball', 'Medicine-Ball Russian Twist', 'Loaded rotation using an easy-to-hold ball.', 'Move the shoulders with the ball rather than only the arms.', { equipment: 'Medicine Ball', group: 'Same movement' }),
      V('cable-rotation', 'Standing Cable Rotation', 'Standing alternative with controlled transverse resistance.', 'Rotate through the torso while hips remain stable.', { equipment: 'Cable', group: 'Progression or alternative' }),
    ],
  },
  'abs-5': {
    defaults: { equipment: 'Cable', difficulty: 'Intermediate', primaryMuscles: ['Rectus abdominis'], secondaryMuscles: ['Internal obliques', 'External obliques'] },
    variations: [
      V('kneeling-rope', 'Kneeling Rope Cable Crunch', 'Loaded spinal flexion with stable kneeling support.', 'Curl ribs toward the pelvis while hips remain nearly still.'),
      V('standing', 'Standing Cable Crunch', 'Standing variation requiring more whole-body stabilization.', 'Flex the trunk without turning the movement into a squat.', { group: 'Progression or alternative' }),
      V('single-side', 'Single-Side Cable Crunch', 'Asymmetric crunch increasing oblique contribution.', 'Crunch one shoulder toward the opposite hip.', { group: 'Different emphasis', primaryMuscles: ['Rectus abdominis', 'Obliques'] }),
      V('machine', 'Abdominal Crunch Machine', 'Stable machine alternative for progressive loading.', 'Adjust the pivot and curl the torso against the pad.', { equipment: 'Machine', group: 'Progression or alternative' }),
    ],
  },

  'legs-1': {
    defaults: { equipment: 'Barbell', difficulty: 'Intermediate', primaryMuscles: ['Quadriceps', 'Gluteus maximus', 'Adductor magnus'], secondaryMuscles: ['Erector spinae', 'Abdominals'] },
    variations: [
      V('high-bar', 'High-Bar Back Squat', 'Balanced squat with substantial knee and hip demand.', 'Place the bar on the upper traps and squat between the hips.'),
      V('low-bar', 'Low-Bar Back Squat', 'Hip-dominant bar position with more torso lean.', 'Set the bar below the upper traps and keep it over midfoot.', { group: 'Different emphasis' }),
      V('front', 'Front Squat', 'Upright squat variation emphasizing the quadriceps.', 'Keep elbows high and the torso tall throughout.', { group: 'Different emphasis' }),
      V('heel-elevated', 'Heel-Elevated Back Squat', 'Squat allowing greater forward knee travel and quad demand.', 'Raise heels securely while keeping the whole foot supported.', { equipment: 'Barbell and Heel Wedge', group: 'Different emphasis' }),
    ],
  },
  'legs-2': {
    defaults: { equipment: 'Leg Press Machine', difficulty: 'Beginner', primaryMuscles: ['Quadriceps'], secondaryMuscles: ['Gluteus maximus', 'Adductor magnus'] },
    variations: [
      V('standard', 'Standard 45° Leg Press', 'Balanced machine press for quadriceps and glutes.', 'Place feet near the middle and use a controlled depth.'),
      V('low-foot', 'Low-Foot Leg Press', 'Lower foot placement increasing knee-dominant demand.', 'Place feet lower only as far as heels stay planted.', { group: 'Different emphasis' }),
      V('high-foot', 'High-Foot Leg Press', 'Higher foot placement increasing hip-dominant mechanics.', 'Set feet higher and keep the pelvis against the pad.', { group: 'Different emphasis' }),
      V('single-leg', 'Single-Leg Press', 'Unilateral press for independent leg control.', 'Use a centered foot and prevent the pelvis from rotating.', { difficulty: 'Intermediate', group: 'Progression or alternative' }),
    ],
  },
  'legs-3': {
    defaults: { equipment: 'Barbell', difficulty: 'Intermediate', primaryMuscles: ['Hamstrings', 'Gluteus maximus', 'Adductor magnus'], secondaryMuscles: ['Erector spinae', 'Forearm flexors'] },
    variations: [
      V('barbell', 'Barbell Romanian Deadlift', 'Loaded hip hinge for hamstrings and glutes.', 'Push hips back while the bar tracks close to the legs.'),
      V('dumbbell', 'Dumbbell Romanian Deadlift', 'Independent-weight hinge with flexible hand position.', 'Keep dumbbells close and stop before the back rounds.', { equipment: 'Dumbbells', group: 'Progression or alternative' }),
      V('b-stance', 'B-Stance Romanian Deadlift', 'Staggered-stance hinge emphasizing the front leg.', 'Use the rear foot as a light kickstand.', { difficulty: 'Advanced', group: 'Progression or alternative' }),
      V('single-leg', 'Single-Leg Romanian Deadlift', 'Unilateral hinge challenging balance and hip stability.', 'Keep hips square as the free leg reaches backward.', { equipment: 'Dumbbell', difficulty: 'Advanced', group: 'Progression or alternative' }),
    ],
  },
  'legs-4': {
    defaults: { equipment: 'Leg Extension Machine', difficulty: 'Beginner', primaryMuscles: ['Quadriceps'], secondaryMuscles: [] },
    variations: [
      V('bilateral', 'Bilateral Leg Extension', 'Stable open-chain exercise for all quadriceps heads.', 'Align knees with the pivot and extend without bouncing.'),
      V('single-leg', 'Single-Leg Extension', 'Unilateral extension for independent quadriceps control.', 'Keep hips level while one knee fully extends.', { difficulty: 'Intermediate', group: 'Progression or alternative' }),
      V('reclined', 'Reclined-Seat Leg Extension', 'Hip-flexed setup loading rectus femoris at longer length.', 'Recline only while the lower back remains supported.', { group: 'Different emphasis' }),
      V('paused', 'Paused Leg Extension', 'Controlled extension with a deliberate top contraction.', 'Pause briefly at lockout without swinging the weight.', { group: 'Same movement' }),
    ],
  },
  'legs-5': {
    defaults: { equipment: 'Leg Curl Machine', difficulty: 'Beginner', primaryMuscles: ['Hamstrings'], secondaryMuscles: ['Gastrocnemius'] },
    variations: [
      V('seated', 'Seated Leg Curl', 'Curl loading the biarticular hamstrings at longer length.', 'Keep hips against the pad and curl through a full range.'),
      V('lying', 'Lying Leg Curl', 'Prone curl with hips in a more extended position.', 'Keep the pelvis down as heels move toward the glutes.', { group: 'Same movement' }),
      V('standing-single-leg', 'Standing Single-Leg Curl', 'Unilateral curl for independent hamstring control.', 'Keep thighs aligned while one heel curls upward.', { difficulty: 'Intermediate', group: 'Progression or alternative' }),
      V('slider', 'Slider Hamstring Curl', 'Bodyweight curl combining knee flexion and hip extension.', 'Keep hips lifted as heels slide toward the body.', { equipment: 'Sliders', difficulty: 'Intermediate', group: 'Progression or alternative' }),
    ],
  },
  'legs-6': {
    defaults: { equipment: 'Standing Calf Machine', difficulty: 'Beginner', primaryMuscles: ['Gastrocnemius', 'Soleus'], secondaryMuscles: [] },
    variations: [
      V('standing', 'Standing Calf Raise', 'Straight-knee raise emphasizing the gastrocnemius.', 'Use a deep heel drop and rise through the big toe.', { primaryMuscles: ['Gastrocnemius', 'Soleus'] }),
      V('seated', 'Seated Calf Raise', 'Bent-knee raise emphasizing the soleus.', 'Keep knees bent and pause at the bottom stretch.', { equipment: 'Seated Calf Machine', group: 'Different emphasis', primaryMuscles: ['Soleus'] }),
      V('single-leg', 'Single-Leg Calf Raise', 'Unilateral raise for independent ankle control.', 'Use support for balance and keep the heel tracking straight.', { equipment: 'Bodyweight', difficulty: 'Intermediate', group: 'Progression or alternative' }),
      V('leg-press', 'Leg-Press Calf Raise', 'Loaded straight-knee calf raise on a sled.', 'Move only at the ankle and keep knees softly extended.', { equipment: 'Leg Press Machine', group: 'Progression or alternative' }),
    ],
  },

  'glutes-1': {
    defaults: { equipment: 'Barbell', difficulty: 'Intermediate', primaryMuscles: ['Gluteus maximus'], secondaryMuscles: ['Hamstrings', 'Adductor magnus', 'Gluteus medius'] },
    variations: [
      V('barbell', 'Barbell Hip Thrust', 'Heavy horizontal hip extension for the gluteus maximus.', 'Tuck the chin and finish with ribs and pelvis stacked.'),
      V('machine', 'Machine Hip Thrust', 'Stable guided alternative for progressive glute loading.', 'Align the belt or pad over the hip crease.', { equipment: 'Hip Thrust Machine', group: 'Progression or alternative' }),
      V('b-stance', 'B-Stance Hip Thrust', 'Staggered variation emphasizing the working-side glute.', 'Keep most pressure through the front foot.', { difficulty: 'Advanced', group: 'Progression or alternative' }),
      V('single-leg', 'Single-Leg Hip Thrust', 'Unilateral progression adding pelvic-stability demand.', 'Keep the pelvis level as one hip extends.', { equipment: 'Bodyweight or Dumbbell', difficulty: 'Advanced', group: 'Progression or alternative' }),
    ],
  },
  'glutes-2': {
    defaults: { equipment: 'Cable', difficulty: 'Beginner', primaryMuscles: ['Gluteus maximus'], secondaryMuscles: ['Hamstrings', 'Gluteus medius'] },
    variations: [
      V('bent-knee-cable', 'Bent-Knee Cable Kickback', 'Hip extension reducing hamstring contribution.', 'Keep the knee bent and move from the hip without arching.'),
      V('straight-leg-cable', 'Straight-Leg Cable Kickback', 'Hip extension with greater hamstring assistance.', 'Keep the leg long and stop before the pelvis rotates.', { group: 'Different emphasis' }),
      V('diagonal', 'Diagonal Cable Kickback', 'Extension with slight abduction adding upper-glute demand.', 'Drive the leg back and slightly outward with square hips.', { group: 'Different emphasis', primaryMuscles: ['Gluteus maximus', 'Gluteus medius'] }),
      V('machine', 'Glute Kickback Machine', 'Stable guided alternative for hip extension.', 'Align the working hip with the machine and avoid lumbar motion.', { equipment: 'Machine', group: 'Progression or alternative' }),
    ],
  },
  'glutes-3': {
    defaults: { equipment: 'Dumbbells', difficulty: 'Advanced', primaryMuscles: ['Gluteus maximus', 'Quadriceps'], secondaryMuscles: ['Adductor magnus', 'Gluteus medius', 'Hamstrings'] },
    variations: [
      V('balanced', 'Dumbbell Bulgarian Split Squat', 'Balanced unilateral squat for glutes and quadriceps.', 'Use a comfortable stride and descend straight down.'),
      V('long-stride', 'Glute-Biased Bulgarian Split Squat', 'Longer stride and torso lean increasing hip demand.', 'Lean forward slightly while keeping the front foot planted.', { group: 'Different emphasis', primaryMuscles: ['Gluteus maximus', 'Adductor magnus'] }),
      V('heel-elevated', 'Quad-Biased Bulgarian Split Squat', 'Heel-elevated setup increasing knee and quadriceps demand.', 'Stay upright and allow the front knee to travel forward.', { equipment: 'Dumbbells and Heel Wedge', group: 'Different emphasis', primaryMuscles: ['Quadriceps'] }),
      V('smith', 'Smith-Machine Bulgarian Split Squat', 'Guided variation providing greater external stability.', 'Set the stance first and keep pressure through the front foot.', { equipment: 'Smith Machine', group: 'Progression or alternative' }),
    ],
  },
  'glutes-4': {
    defaults: { equipment: 'Barbell', difficulty: 'Advanced', primaryMuscles: ['Gluteus maximus', 'Adductors', 'Quadriceps'], secondaryMuscles: ['Hamstrings', 'Erector spinae'] },
    variations: [
      V('standard', 'Standard Sumo Deadlift', 'Wide-stance deadlift combining hip and knee extension.', 'Set shins near vertical and push the floor apart.'),
      V('moderate-stance', 'Moderate-Stance Sumo Deadlift', 'Less extreme stance suited to individual hip comfort.', 'Choose a width that lets knees track over toes.', { group: 'Same movement' }),
      V('deficit', 'Deficit Sumo Deadlift', 'Longer-range progression increasing start-position demand.', 'Use a small stable platform and preserve the same brace.', { difficulty: 'Advanced', group: 'Progression or alternative' }),
      V('kettlebell', 'Kettlebell Sumo Deadlift', 'Accessible regression using a centered load.', 'Stand wide and lift the bell from between the feet.', { equipment: 'Kettlebell', difficulty: 'Beginner', group: 'Progression or alternative' }),
    ],
  },
  'glutes-5': {
    defaults: { equipment: 'Cable', difficulty: 'Intermediate', primaryMuscles: ['Gluteus maximus', 'Hamstrings'], secondaryMuscles: ['Adductor magnus', 'Erector spinae'] },
    variations: [
      V('rope', 'Rope Cable Pull-Through', 'Cable hip hinge for glutes and hamstrings.', 'Walk forward for tension and push hips back toward the stack.'),
      V('band', 'Band Pull-Through', 'Portable regression with accommodating resistance.', 'Anchor the band low and hinge without squatting.', { equipment: 'Resistance Band', difficulty: 'Beginner', group: 'Progression or alternative' }),
      V('wide-stance', 'Wide-Stance Cable Pull-Through', 'Wide hinge adding adductor contribution.', 'Turn toes out slightly and keep knees tracking over them.', { group: 'Different emphasis' }),
      V('paused', 'Paused Cable Pull-Through', 'Controlled pull-through with a deliberate hip-extension pause.', 'Pause at full hip extension without leaning backward.', { group: 'Same movement' }),
    ],
  },
};

const freezeArray = (values) => Object.freeze([...(values || [])]);

const createVariation = (familyId, defaults, variation, index) => Object.freeze({
  id: `${familyId}--${variation.slug}`,
  familyId,
  name: variation.name,
  summary: variation.summary,
  setupCue: variation.setupCue,
  equipment: variation.equipment || defaults.equipment,
  difficulty: variation.difficulty || defaults.difficulty,
  primaryMuscles: freezeArray(variation.primaryMuscles || defaults.primaryMuscles),
  secondaryMuscles: freezeArray(variation.secondaryMuscles || defaults.secondaryMuscles),
  group: variation.group || (index === 0 ? 'Recommended' : 'Same movement'),
  anatomyExerciseId: variation.anatomyExerciseId || familyId,
  isDefault: index === 0,
});

const EXERCISE_VARIATIONS = Object.freeze(Object.fromEntries(
  Object.entries(CATALOG).map(([familyId, family]) => [
    familyId,
    Object.freeze(family.variations.map((variation, index) =>
      createVariation(familyId, family.defaults, variation, index))),
  ]),
));

const getExerciseVariations = (familyId) => EXERCISE_VARIATIONS[familyId] || Object.freeze([]);

const getDefaultVariation = (familyId) =>
  getExerciseVariations(familyId).find((variation) => variation.isDefault) || null;

const getSelectedVariation = (familyId, variationId) =>
  getExerciseVariations(familyId).find((variation) => variation.id === variationId)
  || getDefaultVariation(familyId);

const getVariationCount = (familyId) => getExerciseVariations(familyId).length;

const buildVariationInstructions = (variation) => [
  variation.setupCue,
  `Establish a stable start position for the ${variation.name.toLowerCase()} and brace before moving.`,
  'Use a controlled, pain-free range without bouncing or relying on momentum.',
  'Return to the starting position under control before beginning the next repetition.',
];

const buildVariationExercise = (parentExercise, selectedVariation) => {
  if (!parentExercise || !parentExercise.id) return null;

  const variation = selectedVariation || getDefaultVariation(parentExercise.id);
  if (!variation || variation.familyId !== parentExercise.id) return null;

  return {
    ...parentExercise,
    id: variation.id,
    name: variation.name,
    equipment: variation.equipment,
    difficulty: variation.difficulty,
    secondaryMuscles: [...variation.secondaryMuscles],
    instructions: buildVariationInstructions(variation),
    exerciseFamilyId: parentExercise.id,
    exerciseVariantId: variation.id,
    anatomyExerciseId: variation.anatomyExerciseId,
    variationSummary: variation.summary,
    setupCue: variation.setupCue,
    variationGroup: variation.group,
    isDefaultVariation: variation.isDefault,
    primaryMuscles: [...variation.primaryMuscles],
  };
};

const buildLegacyExerciseFallback = (exercise) => {
  if (!exercise || !exercise.id) return null;

  const primaryMuscles = Array.isArray(exercise.primaryMuscles) && exercise.primaryMuscles.length > 0
    ? exercise.primaryMuscles
    : [exercise.muscleGroup || 'Full body'];

  return {
    ...exercise,
    anatomyExerciseId: exercise.anatomyExerciseId
      || exercise.exerciseFamilyId
      || exercise.id,
    primaryMuscles: [...primaryMuscles],
    secondaryMuscles: [...(exercise.secondaryMuscles || [])],
    instructions: [...(exercise.instructions || [])],
  };
};

const resolveExerciseFamily = (exercise, library = []) => {
  if (!exercise || !Array.isArray(library)) return null;
  const familyId = exercise.exerciseFamilyId || exercise.familyId || exercise.id;
  return library.find((libraryExercise) => libraryExercise.id === familyId) || null;
};

const getWorkoutExerciseIdentity = (exercise) => {
  if (!exercise || !exercise.id) return null;

  if (exercise.exerciseVariantId) return exercise.exerciseVariantId;
  if (exercise.id.includes('--')) return exercise.id;

  const familyId = exercise.exerciseFamilyId || exercise.familyId || exercise.id;
  return getDefaultVariation(familyId)?.id || exercise.id;
};

module.exports = {
  EXERCISE_VARIATIONS,
  VARIATION_GROUP_LABELS,
  VARIATION_GROUPS,
  buildLegacyExerciseFallback,
  buildVariationExercise,
  getDefaultVariation,
  getExerciseVariations,
  getSelectedVariation,
  getVariationCount,
  getWorkoutExerciseIdentity,
  resolveExerciseFamily,
};
