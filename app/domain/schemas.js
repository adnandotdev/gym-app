const { isValidMovementPattern } = require('../data/taxonomies');

const safeParse = (data, validatorFn) => {
  try {
    const parsedData = validatorFn(data);
    return { success: true, data: parsedData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const validateString = (val, fieldName) => {
  if (typeof val !== 'string' || val.trim().length === 0) {
    throw new Error(`Invalid ${fieldName}: must be a non-empty string`);
  }
  return val.trim();
};

const validateArray = (val, fieldName, itemValidator) => {
  if (!Array.isArray(val)) {
    throw new Error(`Invalid ${fieldName}: must be an array`);
  }
  return val.map((item, index) => {
    try {
      return itemValidator(item);
    } catch (e) {
      throw new Error(`Invalid item at ${fieldName}[${index}]: ${e.message}`);
    }
  });
};

const validateEnum = (val, fieldName, allowedValues) => {
  if (!allowedValues.includes(val)) {
    throw new Error(`Invalid ${fieldName}: must be one of ${allowedValues.join(', ')}`);
  }
  return val;
};

// Exercise Guidance V2 Schema
const parseExerciseGuidanceV2 = (data) => {
  if (!data || typeof data !== 'object') throw new Error('Guidance must be an object');

  const guidance = {
    exerciseVariationId: validateString(data.exerciseVariationId, 'exerciseVariationId'),
    movementPatterns: validateArray(data.movementPatterns || [], 'movementPatterns', (p) => {
      if (!isValidMovementPattern(p)) throw new Error(`Unknown movement pattern: ${p}`);
      return p;
    }),
    requiredEquipmentIds: validateArray(data.requiredEquipmentIds || [], 'requiredEquipmentIds', (e) => validateString(e, 'equipmentId')),
    optionalEquipmentIds: validateArray(data.optionalEquipmentIds || [], 'optionalEquipmentIds', (e) => validateString(e, 'equipmentId')),
    contentVersion: validateString(data.contentVersion, 'contentVersion'),
    reviewStatus: validateEnum(data.reviewStatus, 'reviewStatus', ['draft', 'in_review', 'approved', 'retired']),
  };

  return guidance;
};

// Caution Schema
const parseCaution = (data) => {
  if (!data || typeof data !== 'object') throw new Error('Caution must be an object');

  const caution = {
    id: validateString(data.id, 'id'),
    userId: validateString(data.userId, 'userId'),
    area: validateString(data.area, 'area'),
    status: validateEnum(data.status, 'status', ['active', 'inactive', 'healed']),
    movementsToAvoid: validateArray(data.movementsToAvoid || [], 'movementsToAvoid', (m) => validateString(m, 'movement')),
    updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : Date.now(),
  };

  return caution;
};

// User Preferences Schema
const parseUserPreferences = (data) => {
  if (!data || typeof data !== 'object') throw new Error('Preferences must be an object');

  const prefs = {
    guidanceLevel: validateEnum(data.guidanceLevel, 'guidanceLevel', ['beginner', 'intermediate', 'advanced']),
    defaultEquipmentProfileId: data.defaultEquipmentProfileId ? validateString(data.defaultEquipmentProfileId, 'defaultEquipmentProfileId') : null,
    enabledFormTips: typeof data.enabledFormTips === 'boolean' ? data.enabledFormTips : true,
    enabledReadinessCheck: typeof data.enabledReadinessCheck === 'boolean' ? data.enabledReadinessCheck : true,
    preferredUnits: validateEnum(data.preferredUnits, 'preferredUnits', ['metric', 'imperial']),
    updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : Date.now(),
  };

  return prefs;
};

module.exports = {
  safeParse,
  parseExerciseGuidanceV2,
  parseCaution,
  parseUserPreferences,
};
