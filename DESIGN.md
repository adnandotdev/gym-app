# MuscleMap Figma Design System

## Source and scope

MuscleMap follows the supplied Workout App UI Kit in Figma while preserving the app's product name, data, authentication contract, exercise library, and React Navigation structure. The closest reference screens are Home, Categories, Exercise Timer, Exercise Completion, Sign In, and Sign Up.

The Figma file does not show a side drawer. MuscleMap therefore keeps its four-destination bottom navigation instead of introducing an unsupported drawer pattern.

## Foundation

- Typeface: Overpass in weights 400, 500, 600, 700, and 800, bundled through Expo Google Fonts.
- Primary: `#7C4DFF`.
- Hero gradient end: `#6F00FF`.
- Ink: `#1E1E22`.
- Canvas and cards: white with cool inset surfaces at `#F3F6FB`.
- Muted text: `#9C9BC2`.
- Borders: `#CFCFE2`.
- Screen gutter: 24px.
- Standard control radius: 12px; card radius: 16px.
- Primary action height: 56px.
- Bottom navigation height: 80px.

Repeated values live in `app/theme/colors.js`. Screens compose those tokens rather than defining new brand colors.

## Screen patterns

- Authentication uses a centered brand mark, one task per step, cool outlined fields, and a full-width purple primary action.
- Home uses the branded header, notification shortcut, purple workout hero, progress cards, category chips, and compact workout rows.
- Categories use search, horizontal single-select chips, and compact illustrated rows.
- Workout sessions use a centered movement illustration, large timer, paired restart/pause controls, skip action, and a bottom completion sheet.
- Notifications use grouped rows, unread indicators, and an explicit mark-all-read action.
- Exercise Detail retains the existing movement, variation, anatomy, instruction, and add-to-plan capabilities while inheriting the new visual tokens.
- Workout Plan, Profile, onboarding, admin, password recovery, and registration retain their existing behavior while inheriting the shared palette, typography, borders, radii, spacing, and controls.

## Navigation and motion

- The bottom bar labels are Home, Activity, Calendar, and Profile; existing internal route names remain unchanged for compatibility.
- Active destinations use white; inactive destinations use softened lavender on the purple bar.
- Stack navigation keeps native page transitions. Press feedback uses the existing motion pressable component.
- Temporary completion content appears as a bottom sheet over a dimmed scrim.

## Product boundaries

- Social sign-in is visibly marked as coming soon and stays disabled until provider credentials and backend verification exist.
- The staged sign-in UI still submits to the existing email/password login contract.
- Registration and password recovery retain the current backend flow; Figma OTP steps are not simulated without a server contract.
- Notifications and the active workout timer remain local to the current app session. Finished workout summaries persist per signed-in user on the device; backend synchronization still needs an API contract.
- Home progress must use real plan data or an honest empty state; it must never invent completion.

## Category and workout behavior

- Homepage categories use stable IDs and explicit variation-level membership. They do not reuse broad muscle filters as a shortcut.
- Full Body Warm Up contains the lower-intensity bodyweight and resistance-band choices already supported by the catalog. It is not presented as a medically personalized warm-up.
- Both Side Plank resolves only the Side Plank variation. Strength, Abs, Torso and Trap, and Lower Back each resolve their own curated list.
- Card counts are derived from resolvable catalog entries. An invalid or removed entry disappears safely instead of producing a dead detail page.
- Category selection composes with library search and muscle filtering and can be cleared without leaving the screen.
- Start Exercise snapshots today's saved plan in its saved order. An empty day opens Calendar so the user can add exercises first.
- Each workout queue item is pending, completed, or skipped. Complete and Skip both advance to the next pending exercise; Skip never masquerades as completion and can be undone.
- Pause stops the timer, Reset restarts only the current exercise timer, and total session time remains intact.
- The final sheet distinguishes completed and skipped counts. An all-skipped session says the workout ended rather than congratulating the user for completion.
- Activity stores finished summaries separately for each user and computes today's totals from the local calendar date, not merely the weekday name.

## Accessibility and responsive rules

- Use `SafeAreaView` from `react-native-safe-area-context`.
- Interactive controls require at least a 44px target and an accessible label or visible text.
- Disabled integrations must expose their disabled state and explanatory text.
- Selection, progress, and errors cannot rely on color alone.
- Horizontal category chips remain scrollable on narrow screens.
- Reduce gutters before reducing type on screens below 360px.

## Existing exercise asset rules

- Keep concrete exercise variation imagery in the existing static Metro resolver.
- Use the selected variation's start/finish images for demonstrations and keep anatomy as a separate front/back viewer.
- Do not relabel male demonstration assets as female assets.
- Do not fabricate unsupported muscle-isolation claims or workout history.
