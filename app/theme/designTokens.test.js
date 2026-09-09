const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');
const themeSource = read('app/theme/colors.js');

describe('MuscleMap Figma-aligned design contracts', () => {
  it('keeps the exported Figma palette in one shared theme', () => {
    ['#7C4DFF', '#1E1E22', '#FFFFFF', '#F3F6FB', '#9C9BC2', '#CFCFE2'].forEach(
      (color) => assert.match(themeSource, new RegExp(color, 'i')),
    );
  });

  it('keeps the 24px grid and Figma control geometry reusable', () => {
    assert.match(themeSource, /screen:\s*24/);
    assert.match(themeSource, /control:\s*12/);
    assert.match(themeSource, /card:\s*16/);
    assert.match(themeSource, /primaryButtonHeight:\s*52/);
    assert.match(themeSource, /tabBarHeight:\s*56/);
  });

  it('keeps the bottom navigation compact without dropping safe-area space', () => {
    const tabs = read('app/navigation/MainTabNavigator.js');

    assert.match(tabs, /useSafeAreaInsets/);
    assert.match(tabs, /height:\s*componentSizes\.tabBarHeight \+ insets\.bottom/);
    assert.match(tabs, /paddingBottom:\s*insets\.bottom \+ spacing\.micro/);
    assert.match(tabs, /paddingTop:\s*spacing\.micro/);
    assert.match(tabs, /tabBarItemStyle:\s*\{ minHeight:\s*44 \}/);
    assert.match(tabs, /size=\{20\}/);
    assert.match(tabs, /fontSize:\s*11/);
    assert.match(tabs, /lineHeight:\s*14/);
  });

  it('keeps loading and disabled feedback accessible', () => {
    const button = read('app/components/Button.js');
    assert.match(button, /accessibilityRole="button"/);
    assert.match(button, /accessibilityState=\{\{ disabled: isButtonDisabled, busy: Boolean\(loading\) \}\}/);
    assert.match(button, /styles\.buttonDisabled/);
    assert.match(button, /styles\.textDisabled/);
  });

  it('retains accessible filtering and anatomy controls', () => {
    const library = read('app/screens/user/ExerciseLibraryScreen.js');
    const visualizer = read('app/components/MuscleVisualizer.js');
    assert.match(library, /accessibilityState=\{\{ selected: selectedMuscle === item \}\}/);
    assert.match(library, /clearSearchButton:\s*\{[\s\S]*width:\s*44,[\s\S]*height:\s*44/);
    assert.match(visualizer, /accessibilityLabel=\{accessibilityLabel\}/);
    assert.match(visualizer, /resizeMode="contain"/);
  });

  it('keeps workout-plan destructive actions labelled and reachable', () => {
    const plan = read('app/screens/user/WorkoutPlanScreen.js');
    assert.match(plan, /Remove.*item\.name.*selectedDay/);
    assert.match(plan, /deleteBtn:\s*\{[\s\S]*width:\s*44,[\s\S]*height:\s*44/);
    assert.match(plan, /clearBtn:\s*\{[\s\S]*width:\s*44,[\s\S]*height:\s*44/);
  });

  it('uses bundled home imagery instead of remote temporary URLs', () => {
    const home = read('app/screens/user/HomeScreen.js');
    assert.match(home, /assets\/images\/home\/training-coach-white\.png/);
    assert.doesNotMatch(home, /figma\.com\/api\/mcp\/asset/);

    const image = fs.readFileSync(path.join(ROOT, 'assets/images/home/training-coach-white.png'));
    assert.equal(image.toString('ascii', 1, 4), 'PNG');
    assert.equal(image[25], 6, 'The homepage coach must be a genuine RGBA cutout');
  });
});
