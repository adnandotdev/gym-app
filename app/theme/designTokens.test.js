const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const themeSource = fs.readFileSync(path.join(__dirname, 'colors.js'), 'utf8');
const ROOT = path.resolve(__dirname, '../..');

const readAppFile = (relativePath) =>
  fs.readFileSync(path.join(ROOT, relativePath), 'utf8');

describe('gym editorial design tokens', () => {
  it('uses the warm training palette as the shared source of truth', () => {
    [
      '#17140F',
      '#F7F3EA',
      '#E5DFD2',
      '#2F4A3C',
      '#C27A2C',
      '#9B2F1D',
    ].forEach((token) => {
      assert.match(themeSource, new RegExp(token, 'i'));
    });
  });

  it('keeps repeated component geometry in reusable tokens', () => {
    assert.match(themeSource, /radius\s*=\s*\{[\s\S]*control:\s*3/);
    assert.match(themeSource, /spacing\s*=\s*\{[\s\S]*screen:\s*24/);
    assert.match(themeSource, /componentSizes\s*=\s*\{[\s\S]*primaryButtonHeight:\s*52/);
  });

  it('does not keep the previous green-dominant action palette', () => {
    ['#00754A', '#006241', '#D4E9E2'].forEach((oldColor) => {
      assert.doesNotMatch(themeSource, new RegExp(oldColor, 'i'));
    });
  });

  it('uses the editorial system on the primary signed-in surfaces', () => {
    const primaryFiles = [
      'app/screens/user/HomeScreen.js',
      'app/screens/user/ExerciseLibraryScreen.js',
      'app/screens/user/WorkoutPlanScreen.js',
      'app/screens/user/ProfileScreen.js',
      'app/screens/user/ExerciseDetailScreen.js',
      'app/navigation/MainTabNavigator.js',
    ].map(readAppFile).join('\n');

    assert.doesNotMatch(primaryFiles, /shadowOffset|shadowOpacity|\belevation:/);
    assert.doesNotMatch(primaryFiles, /borderRadius:\s*(12|16|20|24|30)\b/);
    assert.doesNotMatch(primaryFiles, /#00754A|#006241|#F5C518/i);
  });

  it('documents the implemented MuscleMap system instead of the previous retail theme', () => {
    const designGuide = readAppFile('DESIGN.md');

    assert.match(designGuide, /MuscleMap Editorial Gym Design System/);
    assert.match(designGuide, /#17140F/);
    assert.match(designGuide, /#2F4A3C/);
    assert.match(designGuide, /#C27A2C/);
    assert.match(designGuide, /React Navigation native stack/);
    assert.match(designGuide, /react-native-reanimated/);
    assert.match(designGuide, /react-native-gesture-handler/);
    assert.match(designGuide, /expo-haptics/);
    assert.doesNotMatch(designGuide, /Design System Inspired by Starbucks/);
  });

  it('keeps loading feedback visible even when callers override button styles', () => {
    const buttonSource = readAppFile('app/components/Button.js');

    assert.match(
      buttonSource,
      /styles\.button,[\s\S]*style,[\s\S]*isButtonDisabled && styles\.buttonDisabled/
    );
    assert.match(buttonSource, /ActivityIndicator size="small" color=\{colors\.ink\}/);
    assert.match(buttonSource, /accessibilityRole="button"/);
    assert.match(buttonSource, /accessibilityState=\{\{ disabled: isButtonDisabled, busy: Boolean\(loading\) \}\}/);
    assert.match(buttonSource, /isButtonDisabled && styles\.textDisabled/);
  });

  it('keeps the workout plan header, day strip, list, and add action on one grid', () => {
    const workoutPlanSource = readAppFile('app/screens/user/WorkoutPlanScreen.js');

    assert.match(workoutPlanSource, /<View style=\{styles\.headerText\}>/);
    assert.match(workoutPlanSource, /headerText:\s*\{[\s\S]*flex:\s*1,[\s\S]*minWidth:\s*0/);
    assert.match(workoutPlanSource, /daysContent:\s*\{[\s\S]*paddingHorizontal:\s*spacing\.screen/);
    assert.match(workoutPlanSource, /clearBtn:\s*\{[\s\S]*width:\s*44,[\s\S]*height:\s*44/);
    assert.match(workoutPlanSource, /paddingBottom:\s*componentSizes\.floatingActionSize/);
    assert.match(themeSource, /floatingActionSize:\s*52/);
    assert.match(workoutPlanSource, /<SafeAreaView style=\{styles\.container\} edges=\{\['top', 'left', 'right'\]\}>/);
    assert.doesNotMatch(workoutPlanSource, /contentInsetAdjustmentBehavior="automatic"/);
  });

  it('preserves complete anatomy artwork instead of cropping or stretching it', () => {
    const visualizerSource = readAppFile('app/components/MuscleVisualizer.js');
    const librarySource = readAppFile('app/screens/user/ExerciseLibraryScreen.js');

    assert.doesNotMatch(visualizerSource, /resizeMode="stretch"/);
    assert.match(visualizerSource, /style=\{styles\.anatomyImage\}[\s\S]*resizeMode="contain"/);
    assert.match(librarySource, /style=\{styles\.cardImage\}[\s\S]*resizeMode="contain"/);
    assert.match(
      librarySource,
      /cardImageFrame:\s*\{[\s\S]*height:\s*88,[\s\S]*aspectRatio:\s*849 \/ 926/,
    );
    assert.doesNotMatch(librarySource, /cardImageFrame:\s*\{[\s\S]*width:\s*72/);
    assert.match(librarySource, /cardTitle:\s*\{[\s\S]*flexShrink:\s*1/);
    assert.match(librarySource, /cardChevron:\s*\{[\s\S]*flexShrink:\s*0/);
  });

  it('keeps the anatomy view control outside a full-bleed image card', () => {
    const visualizerSource = readAppFile('app/components/MuscleVisualizer.js');

    assert.match(
      visualizerSource,
      /<View style=\{styles\.viewerContainer\}>[\s\S]*<ViewToggle[\s\S]*<View style=\{\[styles\.imageCard, styles\.legacyImageFrame\]\}>/,
    );
    assert.match(
      visualizerSource,
      /<View style=\{styles\.viewerContainer\}>[\s\S]*<ViewToggle[\s\S]*<View style=\{\[styles\.imageCard, styles\.anatomyImageFrame\]\}>/,
    );
    assert.match(visualizerSource, /imageCard:\s*\{[\s\S]*width:\s*'100%'[\s\S]*overflow:\s*'hidden'/);
    assert.match(visualizerSource, /imageMapContainer:\s*\{[\s\S]*width:\s*'100%'[\s\S]*height:\s*'100%'/);
    assert.match(visualizerSource, /toggleBtn:\s*\{[\s\S]*minHeight:\s*44/);
  });

  it('keeps Edit Profile in the same light editorial system as Profile', () => {
    const editProfileSource = readAppFile('app/screens/user/EditProfileScreen.js');

    assert.match(editProfileSource, /<StatusBar barStyle="dark-content"/);
    assert.match(editProfileSource, /container:\s*\{[\s\S]*backgroundColor:\s*colors\.canvas/);
    assert.match(editProfileSource, /headerTitle:\s*\{[\s\S]*\.\.\.typography\.screenTitle/);
    assert.match(editProfileSource, /section:\s*\{[\s\S]*backgroundColor:\s*colors\.surface/);
    assert.match(editProfileSource, /textInput:\s*\{[\s\S]*backgroundColor:\s*colors\.surfaceWarm/);
    assert.doesNotMatch(editProfileSource, /backgroundColor:\s*colors\.surfaceIron/);
    assert.doesNotMatch(editProfileSource, /style=\{styles\.saveBtn\}/);
  });

  it('keeps anatomy and editorial selection controls accessible', () => {
    const visualizerSource = readAppFile('app/components/MuscleVisualizer.js');
    const librarySource = readAppFile('app/screens/user/ExerciseLibraryScreen.js');
    const editProfileSource = readAppFile('app/screens/user/EditProfileScreen.js');

    assert.match(visualizerSource, /style=\{styles\.imageMapContainer\}[\s\S]*accessible[\s\S]*accessibilityLabel=\{accessibilityLabel\}/);
    assert.match(librarySource, /accessibilityState=\{\{ selected: selectedMuscle === item \}\}/);
    assert.match(librarySource, /filterPill:\s*\{[\s\S]*minHeight:\s*44/);
    assert.match(librarySource, /clearSearchButton:\s*\{[\s\S]*width:\s*44,[\s\S]*height:\s*44/);
    assert.match(editProfileSource, /accessibilityRole="radio"/);
    assert.match(editProfileSource, /accessibilityState=\{\{ checked:/);
    assert.match(editProfileSource, /accessibilityRole="checkbox"/);
  });
});
