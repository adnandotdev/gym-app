const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const profileShape = {
  name: { type: 'string', min: 1, max: 80 },
  fitnessGoal: { type: 'string', max: 80 },
  gender: { type: 'string', max: 40 },
  fitnessLevel: { type: 'string', max: 80 },
  age: { type: 'number', min: 13, max: 120 },
  height: { type: 'number', min: 50, max: 260 },
  heightUnit: { type: 'enum', values: ['cm', 'ft'] },
  currentWeight: { type: 'number', min: 20, max: 500 },
  targetWeight: { type: 'number', min: 20, max: 500 },
  weightUnit: { type: 'enum', values: ['kg', 'lb'] },
  bmi: { type: 'number', min: 5, max: 100 },
  currentBodyShape: { type: 'number', min: 1, max: 6 },
  desiredBodyShape: { type: 'number', min: 1, max: 6 },
  focusAreas: { type: 'stringArray', maxItems: 20, itemMax: 80 },
  trainingDays: { type: 'stringArray', maxItems: 7, itemMax: 20 },
  trainingReminder: { type: 'boolean' },
  equipment: { type: 'string', max: 80 },
  injuries: { type: 'stringArray', maxItems: 20, itemMax: 120 },
};

const cleanString = (value, max) => value.trim().slice(0, max);

const fail = (message) => ({ ok: false, message });

const validateEmail = (email) => {
  if (typeof email !== 'string') return null;
  const normalized = email.trim().toLowerCase();
  return EMAIL_PATTERN.test(normalized) ? normalized : null;
};

const validatePassword = (password) =>
  typeof password === 'string' && PASSWORD_PATTERN.test(password);

const validateName = (name) => {
  if (typeof name !== 'string') return null;
  const normalized = cleanString(name, 80);
  return normalized.length > 0 ? normalized : null;
};

const validateAuthPayload = ({ name, email, password } = {}, requireName = false) => {
  const normalizedEmail = validateEmail(email);
  if (!normalizedEmail) return fail('Please enter a valid email address');
  if (requireName && !validatePassword(password)) {
    return fail('Password must be at least 8 characters and include an uppercase letter, a number, and a symbol');
  }
  if (!requireName && (typeof password !== 'string' || password.length === 0 || password.length > 128)) {
    return fail('Please enter your password');
  }
  if (requireName) {
    const normalizedName = validateName(name);
    if (!normalizedName) return fail('Please enter your name');
    return { ok: true, value: { name: normalizedName, email: normalizedEmail, password } };
  }
  return { ok: true, value: { email: normalizedEmail, password } };
};

const coerceNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') return Number(value);
  return Number.NaN;
};

const validateField = (field, value, rule) => {
  if (rule.type === 'string') {
    if (typeof value !== 'string') return fail(`${field} must be text`);
    const cleaned = cleanString(value, rule.max);
    if (rule.min && cleaned.length < rule.min) return fail(`${field} is required`);
    return { ok: true, value: cleaned };
  }

  if (rule.type === 'number') {
    const numberValue = coerceNumber(value);
    if (!Number.isFinite(numberValue) || numberValue < rule.min || numberValue > rule.max) {
      return fail(`${field} is out of range`);
    }
    return { ok: true, value: numberValue };
  }

  if (rule.type === 'enum') {
    if (!rule.values.includes(value)) return fail(`${field} is invalid`);
    return { ok: true, value };
  }

  if (rule.type === 'boolean') {
    if (typeof value !== 'boolean') return fail(`${field} must be true or false`);
    return { ok: true, value };
  }

  if (rule.type === 'stringArray') {
    if (!Array.isArray(value) || value.length > rule.maxItems) return fail(`${field} is invalid`);
    const cleaned = value.map((item) => {
      if (typeof item !== 'string') return null;
      const normalized = cleanString(item, rule.itemMax);
      return normalized.length > 0 ? normalized : null;
    });
    if (cleaned.some((item) => item === null)) return fail(`${field} is invalid`);
    return { ok: true, value: cleaned };
  }

  return fail(`${field} is invalid`);
};

const validateProfileUpdates = (input, allowedFields) => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return fail('Invalid profile payload');
  const updates = {};
  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(input, field) && input[field] !== undefined) {
      const result = validateField(field, input[field], profileShape[field]);
      if (!result.ok) return result;
      updates[field] = result.value;
    }
  }
  return { ok: true, value: updates };
};

const validateWorkoutDay = (day, allowedDays) =>
  allowedDays.includes(day) ? { ok: true, value: day } : fail('Invalid day specified');

const validateExercises = (exercises) => {
  if (!Array.isArray(exercises) || exercises.length > 50) return fail('Invalid exercises payload');
  const validated = exercises.map(validateExercise);
  const invalid = validated.find((result) => !result.ok);
  if (invalid) return invalid;
  return { ok: true, value: validated.map((result) => result.value) };
};

const validateExercise = (exercise) => {
  if (!exercise || typeof exercise !== 'object' || Array.isArray(exercise)) return fail('Invalid exercise payload');
  if (typeof exercise.id !== 'string' || exercise.id.trim().length === 0 || exercise.id.length > 120) return fail('Invalid exercise payload');
  const serializedSize = Buffer.byteLength(JSON.stringify(exercise));
  if (serializedSize > 20_000) return fail('Exercise payload is too large');
  return { ok: true, value: { ...exercise, id: exercise.id.trim() } };
};

module.exports = {
  validateAuthPayload,
  validateExercise,
  validateExercises,
  validateProfileUpdates,
  validateWorkoutDay,
};
