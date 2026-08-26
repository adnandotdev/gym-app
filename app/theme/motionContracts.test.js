const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');
const readAppFile = (relativePath) =>
  fs.readFileSync(path.join(ROOT, relativePath), 'utf8');

describe('motion system contracts', () => {
  it('declares the Expo-compatible motion dependencies in both manifests', () => {
    const packageJson = JSON.parse(readAppFile('package.json'));
    const packageLock = JSON.parse(readAppFile('package-lock.json'));
    const motionDependencies = [
      '@expo/vector-icons',
      'expo-font',
      'react-native-reanimated',
      'react-native-worklets',
      'react-native-gesture-handler',
      'expo-haptics',
    ];

    motionDependencies.forEach((dependency) => {
      assert.ok(packageJson.dependencies[dependency], `${dependency} missing from package.json`);
      assert.ok(
        packageLock.packages[''].dependencies[dependency],
        `${dependency} missing from package-lock root`,
      );
      assert.ok(
        packageLock.packages[`node_modules/${dependency}`],
        `${dependency} missing from package-lock packages`,
      );
    });

    assert.match(readAppFile('app.json'), /"newArchEnabled":\s*true/);
  });

  it('wraps the application in the gesture-handler root', () => {
    const appSource = readAppFile('App.js');

    assert.match(appSource, /GestureHandlerRootView/);
    assert.match(appSource, /from 'react-native-gesture-handler'/);
    assert.match(
      appSource,
      /<GestureHandlerRootView style=\{styles\.gestureRoot\}>[\s\S]*<SafeAreaProvider>/,
    );
  });

  it('uses native stack motion with reduced-motion fallback and static tabs', () => {
    const appNavigatorSource = readAppFile('app/navigation/AppNavigator.js');
    const onboardingSource = readAppFile('app/navigation/OnboardingNavigator.js');
    const tabsSource = readAppFile('app/navigation/MainTabNavigator.js');

    assert.match(appNavigatorSource, /useReducedMotion/);
    assert.match(appNavigatorSource, /animation:\s*reducedMotion\s*\?\s*'fade'\s*:\s*'default'/);
    assert.match(onboardingSource, /useReducedMotion/);
    assert.match(onboardingSource, /animation:\s*reducedMotion\s*\?\s*'fade'\s*:\s*'default'/);
    assert.match(tabsSource, /animation:\s*'none'/);
  });

  it('presents Add to Plan as a native form sheet instead of a core Animated modal', () => {
    const navigatorSource = readAppFile('app/navigation/AppNavigator.js');
    const detailSource = readAppFile('app/screens/user/ExerciseDetailScreen.js');
    const sheetSource = readAppFile('app/screens/user/AddToPlanSheetScreen.js');

    assert.match(navigatorSource, /name="AddToPlan"/);
    assert.match(navigatorSource, /presentation:\s*'formSheet'/);
    assert.match(navigatorSource, /sheetAllowedDetents:/);
    assert.match(detailSource, /navigation\.navigate\('AddToPlan',\s*\{ exercise \}\)/);
    assert.doesNotMatch(detailSource, /\bAnimated\b|<Modal\b|TouchableWithoutFeedback|slideAnim/);
    assert.match(sheetSource, /navigation\.goBack\(\)/);
  });

  it('uses reusable Reanimated press feedback and list layout motion', () => {
    const pressableSource = readAppFile('app/components/MotionPressable.js');
    const buttonSource = readAppFile('app/components/Button.js');
    const librarySource = readAppFile('app/screens/user/ExerciseLibraryScreen.js');

    assert.match(pressableSource, /Animated\.createAnimatedComponent\(Pressable\)/);
    assert.match(pressableSource, /useReducedMotion/);
    assert.match(pressableSource, /cubicBezier\(\.\.\.motion\.easeOut\)/);
    assert.doesNotMatch(pressableSource, /cubic-bezier\(/);
    assert.match(pressableSource, /pressed && !disabled && styles\.pressedOpacity/);
    assert.match(pressableSource, /pressed && !disabled && !reducedMotion && styles\.pressedScale/);
    assert.match(pressableSource, /transitionProperty:\s*\['transform',\s*'opacity'\]/);
    assert.match(pressableSource, /transform:\s*\[\{ scale:\s*0\.97 \}\]/);
    assert.match(buttonSource, /MotionPressable/);
    assert.match(librarySource, /Animated\.FlatList/);
    assert.match(librarySource, /itemLayoutAnimation=\{EXERCISE_LAYOUT\}/);
    assert.match(librarySource, /LinearTransition/);
    assert.match(librarySource, /ReduceMotion\.System/);
  });

  it('labels icon-only motion controls for assistive technology', () => {
    const detailSource = readAppFile('app/screens/user/ExerciseDetailScreen.js');

    assert.match(detailSource, /accessibilityRole="button"[\s\S]*accessibilityLabel="Go back"/);
    assert.match(detailSource, /accessibilityRole="button"[\s\S]*accessibilityLabel="Bookmark exercise"/);
  });

  it('adds haptic feedback only to explicit selection and result moments', () => {
    const librarySource = readAppFile('app/screens/user/ExerciseLibraryScreen.js');
    const visualizerSource = readAppFile('app/components/MuscleVisualizer.js');
    const sheetSource = readAppFile('app/screens/user/AddToPlanSheetScreen.js');
    const tabsSource = readAppFile('app/navigation/MainTabNavigator.js');

    assert.match(librarySource, /Haptics\.selectionAsync\(\)/);
    assert.match(visualizerSource, /Haptics\.selectionAsync\(\)/);
    assert.match(sheetSource, /Haptics\.selectionAsync\(\)/);
    assert.match(sheetSource, /Haptics\.notificationAsync/);
    assert.doesNotMatch(tabsSource, /Haptics\./);
  });
});
