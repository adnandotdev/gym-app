const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');
const read = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), 'utf8');

test('home categories navigate with stable category ids', () => {
  const source = read('app/screens/user/HomeScreen.js');
  assert.match(source, /initialCategoryId: category\.id/);
  assert.doesNotMatch(source, /initialMuscle: item\.muscle/);
});

test('home starts the real current-day plan through readiness or sends an empty day to Calendar', () => {
  const source = read('app/screens/user/HomeScreen.js');
  assert.match(source, /getTodayName/);
  assert.match(source, /plan\[todayName\]/);
  assert.match(source, /navigate\('WorkoutReadiness', \{ day: todayName, exercises: todayExercises/);
  assert.match(source, /navigate\('My Plan', \{ initialDay: todayName/);
});

test('exercise library resolves category membership before composing search and muscle filters', () => {
  const source = read('app/screens/user/ExerciseLibraryScreen.js');
  assert.match(source, /initialCategoryId/);
  assert.match(source, /getCategoryExercises/);
  assert.match(source, /activeCategory/);
  assert.match(source, /Clear category/);
});

test('workout session uses the queue reducer and skip advances instead of completing a fake session', () => {
  const source = read('app/screens/user/WorkoutSessionScreen.js');
  assert.match(source, /useReducer\(\s*workoutSessionReducer/);
  assert.match(source, /type: 'SKIP_CURRENT'/);
  assert.match(source, /type: 'COMPLETE_SET'/);
  assert.match(source, /getCurrentExercise/);
  assert.doesNotMatch(source, /setIsComplete\(true\)/);
  assert.match(source, /title="Skip Exercise & Continue" onPress=\{\(\) => \{\s*dispatch\(\{ type: 'SKIP_CURRENT' \}\);\s*\}\}/);
});

test('Calendar can start its selected day through readiness and Activity is a real tab', () => {
  const planSource = read('app/screens/user/WorkoutPlanScreen.js');
  const tabsSource = read('app/navigation/MainTabNavigator.js');
  const navigatorSource = read('app/navigation/AppNavigator.js');
  assert.match(planSource, /navigate\('WorkoutReadiness', \{ day: selectedDay, exercises: planExercises/);
  assert.match(tabsSource, /ActivityScreen/);
  assert.match(tabsSource, /name="Activity"/);
  assert.match(navigatorSource, /name="ExerciseLibrary"/);
});

test('completed workout summaries are stored through the activity provider', () => {
  const contextSource = read('app/context/WorkoutActivityContext.js');
  const sessionSource = read('app/screens/user/WorkoutSessionScreen.js');
  assert.match(contextSource, /AsyncStorage/);
  assert.match(contextSource, /recordWorkout/);
  assert.match(sessionSource, /recordWorkout/);
});

test('Activity counts real calendar-day records for the today summary', () => {
  const source = read('app/screens/user/ActivityScreen.js');
  assert.match(source, /getRecordsForDate/);
  assert.doesNotMatch(source, /record\.day === todayName/);
});

test('activity and home treat today as the current calendar date only', () => {
  const homeSource = read('app/screens/user/HomeScreen.js');
  const activitySource = read('app/screens/user/ActivityScreen.js');
  assert.match(homeSource, /getRecordsForDate\(history\)/);
  assert.doesNotMatch(homeSource, /history\.reduce\(\(latest, record\)/);
  assert.match(activitySource, /getRecordsForDate\(history\)/);
  assert.doesNotMatch(activitySource, /record\.day === todayName/);
});

test('workout activity clears stale local history before loading another user bucket', () => {
  const contextSource = read('app/context/WorkoutActivityContext.js');
  assert.match(contextSource, /historyRef\.current = \[\]/);
  assert.match(contextSource, /setHistory\(\[\]\)/);
});

test('workout plan removes saved variations by planned exercise identity', () => {
  const contextSource = read('app/context/WorkoutPlanContext.js');
  const planSource = read('app/screens/user/WorkoutPlanScreen.js');
  const backendSource = read('backend/routes/workoutPlan.js');
  const memoryStoreSource = read('backend/utils/devMemoryStore.js');

  assert.match(planSource, /handleRemoveExercise\(item\.exerciseVariantId \|\| item\.id\)/);
  assert.match(contextSource, /getWorkoutExerciseIdentity\(ex\) !== exerciseId/);
  assert.match(backendSource, /getExerciseIdentity\(ex\) !== normalizedExerciseId/);
  assert.match(memoryStoreSource, /getExerciseIdentity\(item\) !== exerciseId/);
});
