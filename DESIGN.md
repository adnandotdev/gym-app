# MuscleMap Editorial Gym Design System

## Purpose

MuscleMap uses the pasted Tasteful editorial mobile system as its structure: compact screens, calm density, serif-like display hierarchy, flat surfaces, hairline dividers, and quiet actions. The colors are adapted for a gym app: warm training-room neutrals, charcoal ink, muted iron, olive recovery accents, and amber performance signals.

The interface should feel like a serious training journal and exercise guide, not a flashy fitness marketplace.

## Design Thesis

- Editorial first: large page titles, compact metadata, and meaningful hierarchy.
- Warm and physical: bone canvas, iron ink, and muted training accents.
- Dense, not crowded: show sets, reps, muscles, difficulty, and progress without heavy cards.
- Trust through context: exercise rows show equipment, difficulty, and programmed volume.
- Actions stay quiet: selected states use ink; performance color is reserved for stats and difficulty.
- Flat by default: avoid glossy gradients, heavy shadows, oversized pills, and neon gym colors.

## Color Tokens

| Token | Value | Use |
|---|---:|---|
| `colors.ink` | `#17140F` | Primary text, active tabs, selected chips, main buttons |
| `colors.canvas` | `#F7F3EA` | Main app background and button text on ink |
| `colors.stage` | `#E5DFD2` | Secondary warm background |
| `colors.surface` | `#FFFCF5` | Flat list rows, panels, and sheet surfaces |
| `colors.surfaceWarm` | `#F0E9DC` | Search fields and quiet inset surfaces |
| `colors.surfaceIron` | `#292622` | Dark training panels |
| `colors.hairline` | `#E2D8C8` | Section dividers and light borders |
| `colors.border` | `#CFC4B3` | Standard control borders |
| `colors.muted` | `#82786A` | Secondary copy and inactive metadata |
| `colors.bodySecondary` | `#332E27` | Supporting body copy |
| `colors.recovery` | `#2F4A3C` | Positive/recovery/accent state |
| `colors.recoverySoft` | `#DDE8DE` | Quiet recovery tint |
| `colors.performance` | `#C27A2C` | Difficulty, PR, rating, and performance data |
| `colors.performanceSoft` | `#F4E3C9` | Performance stat background |
| `colors.danger` | `#9B2F1D` | Error and destructive actions |

Legacy aliases in `app/theme/colors.js` intentionally map existing imports such as `colors.accent`, `colors.parchment`, and `colors.gold` onto this palette.

## Typography

Use Georgia on iOS/web and the platform serif on Android for display tokens. Use the platform system sans-serif for interface text. Do not download fonts at runtime; the app must remain available offline.

| Token | Size / line height | Weight | Use |
|---|---:|---:|---|
| `heroDisplay` | `40 / 42` | 500 | Brand and welcome statements |
| `displayLarge` | `30 / 34` | 500 | Main screen headings |
| `screenTitle` | `24 / 29` | 500 | Detail and profile titles |
| `cardTitle` | `18 / 23` | 600 | Exercise names and section cards |
| `body` | `15 / 23` | 400 | Standard copy |
| `caption` | `13 / 19` | 500 | Helper text |
| `action` | `14 / 17` | 700 | Buttons and selected controls |
| `metaSmall` | `11 / 16` | 600 | Navigation and compact metadata |

Interface letter spacing is `0`; display styles use a subtle `-0.2` to `-0.3px` editorial tightening. Do not scale font size with viewport width.

## Spacing And Shape

Base unit: `4px`.

| Token | Value | Use |
|---|---:|---|
| `spacing.micro` | `4` | Small offsets |
| `spacing.xs` | `8` | Tight row gaps |
| `spacing.sm` | `12` | Compact component rhythm |
| `spacing.md` | `16` | List row padding |
| `spacing.lg` | `20` | Panel padding |
| `spacing.screen` | `24` | Screen gutter |
| `spacing.xl` | `32` | Section separation |
| `spacing.xxl` | `48` | Empty/loading state offset |

| Token | Value | Use |
|---|---:|---|
| `radius.control` | `3` | Buttons, inputs, icon boxes, compact controls |
| `radius.card` | `8` | Repeated content cards and panels |
| `radius.chip` | `999` | Filter chips only |
| `componentSizes.primaryButtonHeight` | `52` | Primary actions |
| `componentSizes.secondaryButtonHeight` | `44` | Secondary actions |
| `componentSizes.searchHeight` | `46` | Search field |

Cards are flat with a hairline border. Shadows are reserved for real overlays such as modals and sheets.

## Screen Rules

- Authentication: warm canvas, serif page title, concise support copy, permanent field labels, and one ink primary action.
- Onboarding: one decision per step, quiet progress, warm flat choices, recovery-green selection, and fixed actions that respect the bottom safe area.
- Home: compact greeting, three quick stats, one dark workout panel, then quick actions and quote.
- Exercises: title, helper text, search, horizontal muscle filters, flat exercise rows.
- Workout Plan: day selector, list of programmed exercises, quiet empty state, ink add action.
- Exercise Detail: movement demonstration first, compact metadata and variation controls, separate anatomy viewer, instruction rows, and a sticky Add to Plan action.
- Exercise variations: keep one library card per exercise family. Exercise Detail owns one concrete selected variation, and an accessible single-select sheet groups recommended, same-movement, different-emphasis, and progression/alternative options. Selecting a variation updates the movement demonstration, equipment, exact muscle-emphasis tags, setup cue, and instructions before the user adds it to the plan. The anatomy image remains an explicitly labeled family-level map until variation-specific anatomy assets exist.
- Exercise demonstrations: movement imagery comes before anatomy. The first card shows the selected variation's male start/finish positions with the complete machine, attachment, grip, stance, and contact points visible. Muscle highlighting never appears on this photographic demonstration.
- Profile: centered identity, four body stats, current goal band, settings rows, outlined destructive logout.

## Exercise Variation Pattern

- The parent exercise is for discovery and education; only a concrete variation is saved to a workout.
- Use radio selection for choosing one variation. Checkboxes are reserved for a future explicit multi-add planner flow.
- Each variation row shows its name, one-sentence difference, equipment, and primary muscle emphasis.
- The default variation is labeled `Recommended`; choosing a different variation never silently adds it.
- `Add Another Variation` reopens the same picker. Different variations from one family may coexist in a workout, while the exact same variation is rejected as a duplicate.
- Preserve history identity with `exerciseFamilyId` and `exerciseVariantId`. Personal records must remain variation-specific.
- Existing anatomy images remain keyed by `anatomyExerciseId`; do not pass a variation ID into the image resolver.
- Avoid unsupported isolation language such as `inner chest`, `lower abs`, or grip-based `lower lat isolation`.

## Exercise Demonstration Pattern

- Each concrete variation owns two male demonstration assets: `male-start.jpg` and `male-finish.jpg`.
- Store them at `assets/images/exercises/demonstrations/<variation-id>/` and resolve them through static Metro `require()` entries in `app/data/exerciseDemonstrationImages.js`.
- Demonstrations use a consistent male identity, almost-white studio background, realistic equipment, correct biomechanics, and a fixed 4:3 landscape frame. Do not add red muscle overlays, labels, arrows, logos, or watermarks.
- Exercise Library uses the recommended variation's start image. The variation sheet uses each option's start image. Workout Plan and Add to Plan use the saved variation's start image.
- Exercise Detail order is movement demonstration, equipment and variation, `Muscles worked` anatomy, instructions, then the sticky plan action.
- Start and Finish are accessible tabs outside the image. Changing the variation resets the demonstration to Start.
- Anatomy stays a separate front/back viewer. Red is reserved for primary and secondary muscle emphasis there.
- This release contains male demonstration assets only. Female demonstration requests must return no image until an independently generated and validated female set is added; never silently relabel a male demonstration as female.

## Navigation

Bottom navigation uses four destinations: Home, Exercises, My Plan, Profile. Active state is ink plus a small underline; inactive items use disabled text. Keep minimum touch targets at `44px`.

## Motion

Use motion to clarify hierarchy, feedback, and temporary surfaces. It should feel athletic and responsive, not decorative.

- Page changes: keep the current React Navigation native stack and configure screen-level transitions through stack options.
- Tab changes: keep tab changes calm; do not add sideways page slides between peer tabs.
- In-screen animation: use `react-native-reanimated` for press feedback, list entry, layout changes, and state transitions that must stay smooth while JavaScript is busy.
- Gestures: use `react-native-gesture-handler` for drag, swipe, pull, and sheet interactions.
- Popups and sheets: prefer native stack `presentation` options for route-level modals; use Reanimated and Gesture Handler for custom inline sheets or transient overlays.
- Haptics: use `expo-haptics` only for user-initiated commits such as selection changes, snap points, success, and failure.
- Illustrations: use `lottie-react-native` only for empty states, success states, and rare delight moments, not for core UI controls.
- Reduced motion: keep opacity/color state changes, but remove large translation, scale, parallax, and overshoot when the system asks for reduced motion.

## Accessibility And Responsive Rules

- Respect top and bottom safe-area insets and never cover scroll content with fixed actions.
- Meaningful anatomy images require accessibility labels.
- Never communicate selection, progress, or error by color alone.
- Preserve readable type with larger system text; below 360px, reduce gutters and spacing before text size.
- Keep filter chips horizontally scrollable.

## Implementation Rules

- `app/theme/colors.js` owns repeated color, spacing, radius, typography, and component-size values.
- Screens may compose tokens but must not redefine brand colors.
- Use `SafeAreaView` from `react-native-safe-area-context`.
- Preserve the current React Navigation architecture and Expo SDK 54 compatibility.
- Do not add the universal `@expo/ui` layer because it requires SDK 56+.
- Continue using genuine per-exercise front/back anatomy artwork through the existing resolver.

## Anti-Patterns

- Do not reintroduce the old green-dominant palette (`#00754A`, `#006241`, `#D4E9E2`).
- Do not use neon gradients, giant circular CTAs, glossy surfaces, or marketing-style hero copy.
- Do not use shadows for ordinary cards.
- Do not nest cards inside cards.
- Do not use rounded pill buttons except for filter chips.
