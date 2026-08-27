const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const usersById = new Map();
const usersByEmail = new Map();
const workoutPlansByUserId = new Map();

const createEmptyWeek = () => ({
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
});

const toPublicUser = (user) => {
  if (!user) return null;
  const { password, ...publicUser } = user;
  return publicUser;
};

const findUserById = (id) => toPublicUser(usersById.get(id));

const findUserByEmail = (email) => usersByEmail.get(email.toLowerCase());

const createUser = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase();
  if (usersByEmail.has(normalizedEmail)) {
    return null;
  }

  const id = crypto.randomUUID();
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    _id: id,
    id,
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: 'user',
    onboardingComplete: false,
    heightUnit: 'cm',
    weightUnit: 'kg',
    trainingReminder: false,
    focusAreas: [],
    trainingDays: [],
    injuries: [],
    createdAt: new Date().toISOString(),
  };

  usersById.set(id, user);
  usersByEmail.set(normalizedEmail, user);
  return toPublicUser(user);
};

const validateUser = async ({ email, password }) => {
  const user = findUserByEmail(email);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? toPublicUser(user) : null;
};

const updateUser = (id, fields) => {
  const user = usersById.get(id);
  if (!user) return null;

  const updatedUser = { ...user, ...fields };
  usersById.set(id, updatedUser);
  usersByEmail.set(updatedUser.email, updatedUser);
  return toPublicUser(updatedUser);
};

const getWorkoutPlan = (userId) => workoutPlansByUserId.get(userId) || createEmptyWeek();

const getExerciseIdentity = (exercise) => {
  if (exercise.exerciseVariantId) return exercise.exerciseVariantId;
  return exercise.id;
};

const isSamePlannedExercise = (existingExercise, incomingExercise) =>
  getExerciseIdentity(existingExercise) === getExerciseIdentity(incomingExercise) ||
  (incomingExercise.isDefaultVariation === true &&
    existingExercise.id === incomingExercise.exerciseFamilyId) ||
  (existingExercise.isDefaultVariation === true &&
    incomingExercise.id === existingExercise.exerciseFamilyId);

const copyExercise = (exercise) => ({
  ...exercise,
  instructions: [...(exercise.instructions || [])],
  primaryMuscles: [...(exercise.primaryMuscles || [])],
  secondaryMuscles: [...(exercise.secondaryMuscles || [])],
});

const setWorkoutPlanDay = (userId, day, exercises) => {
  const currentPlan = getWorkoutPlan(userId);
  const nextPlan = { ...currentPlan, [day]: (exercises || []).map(copyExercise) };
  workoutPlansByUserId.set(userId, nextPlan);
  return nextPlan;
};

const addWorkoutExercise = (userId, day, exercise) => {
  const currentPlan = getWorkoutPlan(userId);
  const dayExercises = currentPlan[day] || [];
  const exists = dayExercises.some(
    (item) => isSamePlannedExercise(item, exercise)
  );
  if (exists) return { duplicate: true, exercises: dayExercises };

  const nextExercises = [...dayExercises, copyExercise(exercise)];
  const nextPlan = { ...currentPlan, [day]: nextExercises };
  workoutPlansByUserId.set(userId, nextPlan);
  return { duplicate: false, exercises: nextExercises };
};

const removeWorkoutExercise = (userId, day, exerciseId) => {
  const currentPlan = getWorkoutPlan(userId);
  const nextExercises = (currentPlan[day] || []).filter((item) => item.id !== exerciseId);
  const nextPlan = { ...currentPlan, [day]: nextExercises };
  workoutPlansByUserId.set(userId, nextPlan);
  return nextExercises;
};

module.exports = {
  addWorkoutExercise,
  createEmptyWeek,
  createUser,
  findUserById,
  findUserByEmail,
  getWorkoutPlan,
  removeWorkoutExercise,
  setWorkoutPlanDay,
  updateUser,
  validateUser,
};
