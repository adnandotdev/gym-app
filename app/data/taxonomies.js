const EQUIPMENT_CATEGORIES = Object.freeze([
  'machine', 'cable', 'barbell', 'dumbbell', 'kettlebell',
  'bench', 'rack', 'band', 'bodyweight', 'cardio', 'other',
]);

const CANONICAL_EQUIPMENT = Object.freeze([
  { id: 'bodyweight', name: 'Bodyweight', category: 'bodyweight', aliases: ['none'] },
  { id: 'floor-mat', name: 'Floor Mat', category: 'other', aliases: ['mat', 'floor space'] },
  { id: 'resistance-band', name: 'Resistance Band', category: 'band', aliases: ['band', 'bands'] },
  { id: 'dumbbell', name: 'Dumbbell', category: 'dumbbell', aliases: ['dumbbells'] },
  { id: 'barbell', name: 'Barbell', category: 'barbell', aliases: ['olympic bar'] },
  { id: 'weight-plates', name: 'Weight Plates', category: 'other', aliases: ['plates', 'plate', 'weight plate'] },
  { id: 'flat-bench', name: 'Flat Bench', category: 'bench', aliases: ['bench'] },
  { id: 'adjustable-bench', name: 'Adjustable Bench', category: 'bench', aliases: ['incline bench', 'decline bench'] },
  { id: 'squat-rack', name: 'Squat Rack', category: 'rack', aliases: ['power rack', 'half rack', 'rack'] },
  { id: 'cable-machine', name: 'Cable Machine', category: 'cable', aliases: ['cables', 'cable station', 'pulley'] },
  { id: 'pull-up-bar', name: 'Pull-Up Bar', category: 'other', aliases: ['chin-up bar'] },
  { id: 'dip-station', name: 'Dip Station', category: 'other', aliases: ['dip bars', 'parallel bars'] },
  { id: 'medicine-ball', name: 'Medicine Ball', category: 'other', aliases: ['med ball'] },
  { id: 'stability-ball', name: 'Stability Ball', category: 'other', aliases: ['swiss ball', 'physio ball', 'yoga ball'] },
  { id: 'kettlebell', name: 'Kettlebell', category: 'kettlebell', aliases: ['kettlebells'] },
  { id: 'smith-machine', name: 'Smith Machine', category: 'machine', aliases: [] },
  { id: 'leg-press-machine', name: 'Leg Press Machine', category: 'machine', aliases: ['leg press'] },
  { id: 'leg-extension-machine', name: 'Leg Extension Machine', category: 'machine', aliases: [] },
  { id: 'leg-curl-machine', name: 'Leg Curl Machine', category: 'machine', aliases: ['seated leg curl', 'lying leg curl'] },
  { id: 'calf-machine', name: 'Calf Machine', category: 'machine', aliases: ['standing calf machine', 'seated calf machine'] },
  { id: 'hip-thrust-machine', name: 'Hip Thrust Machine', category: 'machine', aliases: [] },
  { id: 'lat-pulldown-machine', name: 'Lat Pulldown Machine', category: 'machine', aliases: ['lat pulldown'] },
  { id: 't-bar-machine', name: 'T-Bar Machine', category: 'machine', aliases: ['t-bar row'] },
  { id: 'pec-deck-machine', name: 'Pec Deck Machine', category: 'machine', aliases: ['pec deck', 'reverse pec deck'] },
  { id: 'assisted-pull-up-machine', name: 'Assisted Pull-up Machine', category: 'machine', aliases: [] },
  { id: 'assisted-dip-machine', name: 'Assisted Dip Machine', category: 'machine', aliases: [] },
  { id: 'landmine', name: 'Landmine', category: 'other', aliases: [] },
  { id: 'ez-bar', name: 'EZ Bar', category: 'barbell', aliases: ['ez curl bar'] },
  { id: 'captains-chair', name: 'Captain\'s Chair', category: 'other', aliases: [] },
  { id: 'sliders', name: 'Sliders', category: 'other', aliases: [] },
  { id: 'heel-wedge', name: 'Heel Wedge', category: 'other', aliases: [] },
]);

const MOVEMENT_PATTERNS = Object.freeze([
  'horizontal-push',
  'vertical-push',
  'horizontal-pull',
  'vertical-pull',
  'squat',
  'hinge',
  'lunge',
  'carry',
  'rotation',
  'anti-extension',
  'anti-rotation',
  'anti-lateral-flexion',
  'mobility',
  'locomotion',
  'isolation-flexion',
  'isolation-extension',
]);

const normalizeEquipmentAlias = (alias) => {
  if (!alias || typeof alias !== 'string') return null;
  const lowerAlias = alias.toLowerCase().trim();

  const exactMatch = CANONICAL_EQUIPMENT.find((eq) => eq.id === lowerAlias || eq.name.toLowerCase() === lowerAlias);
  if (exactMatch) return exactMatch.id;

  const aliasMatch = CANONICAL_EQUIPMENT.find((eq) => eq.aliases.includes(lowerAlias));
  if (aliasMatch) return aliasMatch.id;

  return null; // Unknown equipment
};

const getEquipmentById = (id) => {
  return CANONICAL_EQUIPMENT.find((eq) => eq.id === id) || null;
};

const isValidMovementPattern = (pattern) => {
  return MOVEMENT_PATTERNS.includes(pattern);
};

module.exports = {
  EQUIPMENT_CATEGORIES,
  CANONICAL_EQUIPMENT,
  MOVEMENT_PATTERNS,
  normalizeEquipmentAlias,
  getEquipmentById,
  isValidMovementPattern,
};
