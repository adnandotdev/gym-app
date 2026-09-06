const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');

describe('Flexio Figma design system', () => {
  it('defines the exact Figma palette and geometry in the shared theme', () => {
    const source = read('app/theme/colors.js');

    ['#7C4DFF', '#1E1E22', '#F3F6FB', '#9C9BC2', '#CFCFE2', '#FFFFFF'].forEach(
      (token) => assert.match(source, new RegExp(token, 'i')),
    );
    assert.match(source, /screen:\s*24/);
    assert.match(source, /control:\s*12/);
    assert.match(source, /card:\s*16/);
    assert.match(source, /primaryButtonHeight:\s*56/);
  });

  it('loads Overpass and applies it through the typography tokens', () => {
    const appSource = read('App.js');
    const themeSource = read('app/theme/colors.js');

    assert.match(appSource, /useFonts/);
    assert.match(appSource, /Overpass_400Regular/);
    assert.match(appSource, /Overpass_600SemiBold/);
    assert.match(appSource, /Overpass_700Bold/);
    assert.match(themeSource, /fontFamily:\s*'Overpass_700Bold'/);
  });

  it('provides the Figma notification and workout-session routes', () => {
    const navigator = read('app/navigation/AppNavigator.js');

    assert.match(navigator, /name="Notifications"/);
    assert.match(navigator, /name="WorkoutSession"/);
  });

  it('uses the Figma tab labels and purple navigation bar', () => {
    const tabs = read('app/navigation/MainTabNavigator.js');

    assert.match(tabs, /Activity/);
    assert.match(tabs, /Calendar/);
    assert.match(tabs, /backgroundColor:\s*colors\.primary/);
    assert.match(tabs, /tabBarActiveTintColor:\s*colors\.white/);
  });

  it('uses the exported Figma workout imagery on the home and timer screens', () => {
    const home = read('app/screens/user/HomeScreen.js');
    const session = read('app/screens/user/WorkoutSessionScreen.js');

    assert.match(home, /assets\/images\/figma\/home-trainer\.png/);
    assert.match(home, /assets\/images\/figma\/warmup\.png/);
    assert.match(session, /assets\/images\/figma\/exercise-warmup\.png/);
  });

  it('does not invent completed progress and forwards category filters', () => {
    const home = read('app/screens/user/HomeScreen.js');
    const library = read('app/screens/user/ExerciseLibraryScreen.js');

    assert.match(home, /recent\?\.completedCount \|\| 0/);
    assert.match(home, /initialCategoryId: category\.id/);
    assert.match(home, /getCategorySummary/);
    assert.match(library, /route\?\.params\?\.initialMuscle/);
    assert.match(library, /route\?\.params\?\.initialCategoryId/);
  });

  it('keeps notification and timer state updates immutable and explicit', () => {
    const notifications = read('app/screens/user/NotificationsScreen.js');
    const session = read('app/screens/user/WorkoutSessionScreen.js');

    assert.match(notifications, /items\.map\(\(item\) => \(\{ \.\.\.item, read: true \}\)\)/);
    assert.match(session, /workoutSessionReducer/);
    assert.match(session, /type: 'TOGGLE_PAUSE'/);
    assert.match(session, /type: 'RESET_CURRENT_TIMER'/);
    assert.match(session, /type: 'SKIP_CURRENT'/);
  });
});
