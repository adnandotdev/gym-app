Markdown
# MuscleMap Image Asset Prompts

This file targets the current places in the app where the UI uses placeholder icons, emoji, initials, or simple 2D/SVG body drawings and replaces them with generated assets based on the established 3D stylized anatomy/fitness model.

## Global Style Rules & Model Consistency

Use one consistent image style and character model across the entire product:

- Master Model Reference: Use the exact stylized 3D athletic male fitness character established previously (smooth matte skin, clean anatomical contours, defined lean musculature, neutral facial features, dark fitted athletic shorts, barefoot).
- Visual style: Premium stylized 3D fitness asset, clean studio rendering, smooth matte/satin materials, soft ambient occlusion, controlled neutral lighting. Palette: warm cream, dark house-green, and subtle gold accents for UI elements.
- Backgrounds: Transparent PNG for UI cutouts and anatomical overlays; light neutral studio gray or cream/house-green only for full cards.
- Muscle Highlights: Vibrant glowing red overlays (or soft warm gold/mint depending on UI state) aligned with the exact base model geometry.
- Avoid: Real human photographic skin/pores, excessive veins/vascularity, extreme bodybuilder mass, medical gore/cadavers, text/labels baked into images, logos, watermarks, distorted limbs/fingers.
- Export color space: sRGB.

Recommended asset folders:

- `assets/images/onboarding/`
- `assets/images/anatomy/`
- `assets/images/exercises/`
- `assets/images/avatars/`
- `assets/images/ui/`

## 1. App Icon And Launch Assets

Current location:

- `assets/icon.png`
- `assets/adaptive-icon.png`
- `assets/splash-icon.png`
- `assets/favicon.png`

### App Icon

File: `assets/icon.png`
Format: PNG, 1024x1024, no transparency required

Prompt:

```text
Create a premium mobile app icon for a fitness app called MuscleMap. Show a simplified stylized 3D anatomical torso map matching the established matte-finish male fitness character, combined with a subtle location-map pin shape. Deep Starbucks-style green #006241, green accent #00754A, warm cream #F2F0EB, and a small gold accent #CBA258. Clean rounded geometry, modern retail wellness feel, high contrast, no text, no letters, no dumbbell cliché, no watermark. Centered composition, app icon ready, sRGB.
Adaptive Icon Foreground
File: assets/adaptive-icon.png
Format: PNG, 1024x1024, transparent background

Prompt:

Plaintext
Create only the foreground symbol for a fitness app adaptive icon: a clean 3D anatomical torso-map mark derived from the established stylized 3D fitness model, blended with a sleek location pin, deep green and warm cream with a tiny gold accent. Transparent background, centered, generous safe padding, no text, no border, no shadow, app icon foreground only.
Splash Image
File: assets/splash-icon.png
Format: PNG, 1536x1536, transparent background

Prompt:

Plaintext
Create a polished splash-screen mark for MuscleMap: a centered stylized 3D fitness anatomy-map torso symbol with soft depth, matching the master 3D character design. Deep green #006241, green accent #00754A, warm cream highlights, small gold accent. Transparent background, no text, no watermark, balanced for a white or cream launch screen.
2. Auth Screens Hero Artwork
Current screens:

app/screens/auth/LoginScreen.js

app/screens/auth/RegisterScreen.js

app/screens/auth/ForgotPasswordScreen.js

Auth Hero
File: assets/images/onboarding/auth-hero.webp
Format: WebP, 1600x1000

Prompt:

Plaintext
Premium fitness app hero image in a warm cafe-inspired studio. A neat 3D rendered gym bag, water bottle, towel, and workout journal arranged on a warm cream tabletop with deep green accents, soft studio lighting matching the master 3D asset style. No people, no text, no logos, no clutter, clean retail flagship composition, space for UI copy.
3. Onboarding Step 1 Fitness Goal
Current file:

app/screens/onboarding/Step1FitnessGoal.js

Weight Loss Goal Card
File: assets/images/onboarding/goal-weight-loss.webp
Format: WebP, 1200x900

Prompt:

Plaintext
Warm premium fitness goal card image for weight loss. Stylized 3D composition showing a clean meal prep bowl, running shoes, measuring tape, and water bottle on a warm cream surface with subtle deep green accents. Clean retail wellness style, soft studio lighting matching the 3D model aesthetic, 12px-card composition, no text, no logo, no human face.
Muscle Build Goal Card
File: assets/images/onboarding/goal-muscle-build.webp
Format: WebP, 1200x900

Prompt:

Plaintext
Warm premium fitness goal card image for muscle building. Stylized 3D composition showing dumbbells, resistance band, protein shaker, and neatly folded gym towel on a warm cream surface with deep green accents and a small gold detail. Clean retail wellness 3D asset style, soft studio lighting matching the master character aesthetic, no text, no logo, no human face.
4. Onboarding Step 2 Gender
Current file:

app/screens/onboarding/Step2Gender.js

Male Option Avatar
File: assets/images/onboarding/gender-male.png
Format: PNG, 512x512, transparent background

Prompt:

Plaintext
Create a friendly premium fitness avatar bust for a male user using the exact face, haircut, and stylized 3D matte aesthetic of the established 3D male fitness character. Athletic lean build, clean smooth 3D geometry, simple deep-green fitted workout crewneck top, soft studio lighting, transparent background, centered composition, no text, no logo, clean mobile UI cutout.
Female Option Avatar
File: assets/images/onboarding/gender-female.png
Format: PNG, 512x512, transparent background

Prompt:

Plaintext
Create a friendly premium fitness avatar bust for a female user designed in the exact same stylized 3D matte aesthetic and geometry style as the established 3D male fitness model. Athletic lean build, clean smooth skin material, simple deep-green fitted workout top, soft studio lighting, transparent background, centered composition, no text, no logo, respectful and polished UI cutout.
Neutral Option Avatar
File: assets/images/onboarding/gender-neutral.png
Format: PNG, 512x512, transparent background

Prompt:

Plaintext
Create a gender-neutral premium fitness avatar bust matching the exact stylized 3D aesthetic, matte skin texture, and soft lighting of the established 3D character. Natural athletic build, clean geometric contours, simple cream and deep-green athletic clothing, transparent background, no text, no logo, inclusive and friendly UI cutout.
5. Current And Desired Body Shape
Current files:

app/screens/onboarding/Step7CurrentBodyShape.js

app/screens/onboarding/Step8DesiredBodyShape.js

Shared Body Shape Prompt Rules
Add this line to every body-shape prompt:

Plaintext
Must use the exact same character identity, face, hairstyle, skin material, and dark fitted athletic shorts as the established stylized 3D male fitness model. Front-facing anatomical standing pose, arms relaxed slightly away from torso, barefoot, transparent background, identical camera distance, orthographic perspective, identical studio lighting, no labels, no text, clean app cutout.
Shape 1 Athletic
File: assets/images/onboarding/body-shape-1-athletic.png
Format: PNG, 900x1400, transparent background

Prompt:

Plaintext
Create body-shape asset 1 of 5: Athletic muscular and lean build with defined abdominals, chest, deltoids, and quadriceps matching the master 3D male fitness model directly. Must use the exact same character identity, face, hairstyle, skin material, and dark fitted athletic shorts as the established stylized 3D male fitness model. Front-facing anatomical standing pose, arms relaxed slightly away from torso, barefoot, transparent background, identical camera distance, orthographic perspective, identical studio lighting, no labels, no text, clean app cutout.
Shape 2 Lean
File: assets/images/onboarding/body-shape-2-lean.png
Format: PNG, 900x1400, transparent background

Prompt:

Plaintext
Create body-shape asset 2 of 5: Lean runner-style build, slightly narrower shoulders and flatter chest, moderate muscle tone, natural waist. Must use the exact same character identity, face, hairstyle, skin material, and dark fitted athletic shorts as the established stylized 3D male fitness model. Front-facing anatomical standing pose, arms relaxed slightly away from torso, barefoot, transparent background, identical camera distance, orthographic perspective, identical studio lighting, no labels, no text, clean app cutout.
Shape 3 Average
File: assets/images/onboarding/body-shape-3-average.png
Format: PNG, 900x1400, transparent background

Prompt:

Plaintext
Create body-shape asset 3 of 5: Average everyday build, softer abdominal region with minimal muscle definition, natural arms and legs. Must use the exact same character identity, face, hairstyle, skin material, and dark fitted athletic shorts as the established stylized 3D male fitness model. Front-facing anatomical standing pose, arms relaxed slightly away from torso, barefoot, transparent background, identical camera distance, orthographic perspective, identical studio lighting, no labels, no text, clean app cutout.
Shape 4 Heavy
File: assets/images/onboarding/body-shape-4-heavy.png
Format: PNG, 900x1400, transparent background

Prompt:

Plaintext
Create body-shape asset 4 of 5: Heavier/stocky build, wider waist, fuller torso, softer chest and limbs, healthy realistic proportions. Must use the exact same character identity, face, hairstyle, skin material, and dark fitted athletic shorts as the established stylized 3D male fitness model. Front-facing anatomical standing pose, arms relaxed slightly away from torso, barefoot, transparent background, identical camera distance, orthographic perspective, identical studio lighting, no labels, no text, clean app cutout.
Shape 5 Obese
File: assets/images/onboarding/body-shape-5-obese.png
Format: PNG, 900x1400, transparent background

Prompt:

Plaintext
Create body-shape asset 5 of 5: Obese body shape, larger rounded midsection, broader hips, fuller arms and legs, dignified presentation. Must use the exact same character identity, face, hairstyle, skin material, and dark fitted athletic shorts as the established stylized 3D male fitness model. Front-facing anatomical standing pose, arms relaxed slightly away from torso, barefoot, transparent background, identical camera distance, orthographic perspective, identical studio lighting, no labels, no text, clean app cutout.
6. Target Focus Areas Body Map
Current file:

app/screens/onboarding/Step10FocusAreas.js

Base Body Front
File: assets/images/anatomy/body-map-front-base.png
Format: PNG, 1200x1800, transparent background

Prompt:

Plaintext
The established stylized 3D athletic male fitness model shown in a direct front anatomical view. Lean muscular build, smooth matte skin, clean muscle contour geometry, wearing simple fitted dark-gray athletic shorts, barefoot. Standing upright, arms held slightly away from sides, hands relaxed, looking straight ahead. Soft neutral studio lighting, orthographic camera, centered full-body framing from head to toe, transparent background, completely unhighlighted neutral base, no text, no UI.
Base Body Back
File: assets/images/anatomy/body-map-back-base.png
Format: PNG, 1200x1800, transparent background

Prompt:

Plaintext
The established stylized 3D athletic male fitness model shown in a direct rear/back anatomical view (180-degree rotation of the front base). Identical proportions, height, lighting, and dark athletic shorts. Defined trapezius, lats, glutes, and calves. Standing upright, arms slightly away from sides, barefoot. Soft neutral studio lighting, orthographic camera, centered full-body framing from head to toe, transparent background, completely unhighlighted neutral base, no text, no UI.
Chest Highlight Overlay
File: assets/images/anatomy/highlight-chest.png
Format: PNG, 1200x1800, transparent background

Prompt:

Plaintext
Pixel-perfect overlay matching the chest geometry of the established front 3D male fitness model. Highlight pectoralis major and minor in semi-transparent glowing red (#FF3B30 / #CBA258 option) with soft inner anatomical glow. All other areas 100% transparent. No base body, no background, no text, no labels.
Back Highlight Overlay
File: assets/images/anatomy/highlight-back.png
Format: PNG, 1200x1800, transparent background

Prompt:

Plaintext
Pixel-perfect overlay matching the back geometry of the established rear 3D male fitness model. Highlight trapezius, latissimus dorsi, and rhomboids in semi-transparent glowing red with soft inner anatomical glow. All other areas 100% transparent. No base body, no background, no text, no labels.
Arms Highlight Overlay
File: assets/images/anatomy/highlight-arms.png
Format: PNG, 1200x1800, transparent background

Prompt:

Plaintext
Pixel-perfect overlay matching both arms of the established front 3D male fitness model. Highlight biceps, triceps, and forearms in semi-transparent glowing red with soft inner anatomical glow. All other areas 100% transparent. No base body, no background, no text, no labels.
Abs Highlight Overlay
File: assets/images/anatomy/highlight-abs.png
Format: PNG, 1200x1800, transparent background

Prompt:

Plaintext
Pixel-perfect overlay matching the core geometry of the established front 3D male fitness model. Highlight rectus abdominis and obliques in semi-transparent glowing red with soft inner anatomical glow. All other areas 100% transparent. No base body, no background, no text, no labels.
Glutes Highlight Overlay
File: assets/images/anatomy/highlight-glutes.png
Format: PNG, 1200x1800, transparent background

Prompt:

Plaintext
Pixel-perfect overlay matching the gluteal geometry of the established rear 3D male fitness model. Highlight gluteus maximus and medius in semi-transparent glowing red with soft inner anatomical glow. All other areas 100% transparent. No base body, no background, no text, no labels.
Legs Highlight Overlay
File: assets/images/anatomy/highlight-legs.png
Format: PNG, 1200x1800, transparent background

Prompt:

Plaintext
Pixel-perfect overlay matching the lower body geometry of the established front 3D male fitness model. Highlight quadriceps, tibialis anterior, and calves in semi-transparent glowing red with soft inner anatomical glow. All other areas 100% transparent. No base body, no background, no text, no labels.
Full Body Highlight Overlay
File: assets/images/anatomy/highlight-full-body.png
Format: PNG, 1200x1800, transparent background

Prompt:

Plaintext
Pixel-perfect full-body overlay matching all major muscle groups of the established front 3D male fitness model simultaneously. Highlight all muscle regions in semi-transparent glowing red (45% opacity) with soft contour glow. All non-muscle areas 100% transparent. No base body, no background, no text.
7. Muscle Visualizer For Home And Exercise Detail
Current files:

app/components/MuscleVisualizer.js

app/screens/user/HomeScreen.js

app/screens/user/ExerciseDetailScreen.js

Shoulders Highlight Overlay
File: assets/images/anatomy/highlight-shoulders.png
Format: PNG, 1200x1800, transparent background

Prompt:

Plaintext
Pixel-perfect overlay matching the shoulder deltoids of the established front 3D male fitness model. Highlight anterior, lateral, and posterior deltoids in semi-transparent glowing red with soft anatomical glow. All other areas 100% transparent. No base body, no background, no text.
Secondary Muscle Overlay (Synergists)
File: assets/images/anatomy/highlight-secondary-soft.png
Format: PNG, 1200x1800, transparent background

Prompt:

Plaintext
Reusable secondary muscle highlight overlay style matching the geometry of the established 3D male fitness model. Rendered in soft glowing amber-orange (#FF9500) or pale mint (#D4E9E2) at 55% opacity with gentle edges to signify secondary muscle activation. 100% transparent background, no base body, no text.
8. Exercise Library And Workout Plan Cards
Current files:

app/screens/user/ExerciseLibraryScreen.js

app/screens/user/WorkoutPlanScreen.js

app/data/exercises.js

Muscle Group Thumbnail Set
Format for each: WebP, 1200x900

Prompt template:

Plaintext
A stylized 3D card render featuring the established 3D athletic male fitness model performing a representative exercise for [MUSCLE_GROUP]. Same character model, smooth matte skin, fitted dark shorts. The primary active muscles glow in vibrant semi-transparent red. Warm studio environment, soft lighting, cream background with subtle deep-green accents, clean landscape mobile card framing, no text, no UI.
Muscle-specific substitutions:

Chest: assets/images/exercises/group-chest.webp (Model performing dumbbell flat bench press, chest glowing red).

Back: assets/images/exercises/group-back.webp (Model performing cable lat pulldown from rear view, lats and upper back glowing red).

Shoulders: assets/images/exercises/group-shoulders.webp (Model performing seated dumbbell shoulder press, deltoids glowing red).

Arms: assets/images/exercises/group-arms.webp (Model performing standing dumbbell bicep curls, biceps glowing red).

Abs: assets/images/exercises/group-abs.webp (Model in a plank/crunch position, abdominals glowing red).

Legs: assets/images/exercises/group-legs.webp (Model performing a barbell squat, quadriceps glowing red).

Glutes: assets/images/exercises/group-glutes.webp (Model performing a barbell hip thrust, glutes glowing red).

Per-Exercise Prompt Template
File naming:

assets/images/exercises/[exercise-id].webp

Format: WebP, 1200x900

Prompt:

Plaintext
Stylized 3D rendering of the established 3D athletic male fitness model performing "[EXERCISE_NAME]" with anatomically correct form. Same character model, matte skin texture, dark fitted athletic shorts. The primary targeted muscles ([PRIMARY_MUSCLES]) are highlighted in vibrant glowing red. Clean warm studio gym setting, soft lighting, neutral cream wall, landscape composition for mobile UI card, no text, no watermark.
9. Exercise Detail Hero & Video Animations
Current file:

app/screens/user/ExerciseDetailScreen.js

Looping Exercise Form Animation (10–15 Seconds)
File naming:

assets/images/exercises/[exercise-id]-loop.mp4

Format: MP4 (H.264), 1080x1080 or 1280x720, 30fps

Prompt:

Plaintext
A 10 to 15 second looping 3D biomechanical animation of the established stylized athletic male fitness model performing "[EXERCISE_NAME]" with perfect form. Clean matte skin, fitted dark shorts, barefoot. As the model executes the movement, the [PRIMARY_MUSCLES] glow in vibrant semi-transparent red to show peak activation, and [SECONDARY_MUSCLES] glow in subtle orange. Smooth controlled tempo, full range of motion, fitness app UI asset style, neutral soft studio lighting, seamless light-gray background, fixed medium-shot orthographic camera, no text, no UI overlays.
10. Home Screen Quick Actions
Current file:

app/screens/user/HomeScreen.js

Exercises Quick Action
File: assets/images/ui/action-exercises.png
Format: PNG, 512x512, transparent background

Prompt:

Plaintext
Create a premium 3D mobile UI icon for exercise library: compact stylized dumbbell and a 3D muscle-map glyph matching the master model aesthetic, deep green #006241 and cream with tiny gold accent, transparent background, no text, no logo.
Planner Quick Action
File: assets/images/ui/action-planner.png
Format: PNG, 512x512, transparent background

Prompt:

Plaintext
Create a premium 3D mobile UI icon for workout planner: small calendar card with green checkmarks and a stylized resistance band, deep green and cream palette, tiny gold accent, transparent background, no text, no logo.
Progress Quick Action
File: assets/images/ui/action-progress.png
Format: PNG, 512x512, transparent background

Prompt:

Plaintext
Create a premium 3D mobile UI icon for fitness progress: simple upward progress chart with a stylized 3D body contour silhouette, deep green, cream, and small gold accent, transparent background, no text, no logo.
Profile Quick Action
File: assets/images/ui/action-profile.png
Format: PNG, 512x512, transparent background

Prompt:

Plaintext
Create a premium 3D mobile UI icon for user profile: 3D avatar bust matching the master character design inside a rounded badge, deep green and cream palette, tiny gold accent, transparent background, no text, no logo.
11. Profile Avatar
Current file:

app/screens/user/ProfileScreen.js

Default Profile Avatar
File: assets/images/avatars/default-profile.png
Format: PNG, 1024x1024, transparent background

Prompt:

Plaintext
Create a premium default fitness profile avatar featuring the bust of the established stylized 3D male fitness character. Friendly neutral expression, clean short hair, matte skin, deep-green athletic crewneck top, soft studio lighting, transparent background, centered framing, no text, no logo.
Admin Avatar
File: assets/images/avatars/admin-profile.png
Format: PNG, 1024x1024, transparent background

Prompt:

Plaintext
Create a premium default admin avatar featuring the bust of the established stylized 3D fitness character wearing a sleek deep-green track jacket with a subtle gold status badge. Soft studio lighting, matte 3D finish, transparent background, no text, no logo.
12. Target Weight Insight Card
Current file:

app/screens/onboarding/Step9TargetWeight.js

Weight Loss Insight
File: assets/images/onboarding/insight-weight-loss.png
Format: PNG, 512x512, transparent background

Prompt:

Plaintext
Premium 3D UI still life for weight loss insight: stylized measuring tape, minimalist running shoe, and sleek water bottle matching the matte 3D asset style, deep green and cream palette, small gold accent, transparent background, no text, no logo.
Muscle Gain Insight
File: assets/images/onboarding/insight-muscle-gain.png
Format: PNG, 512x512, transparent background

Prompt:

Plaintext
Premium 3D UI still life for muscle gain insight: stylized dumbbell, shaker bottle, and fitness towel matching the master 3D asset style, deep green and cream palette, small gold accent, transparent background, no text, no logo.
Maintain Weight Insight
File: assets/images/onboarding/insight-maintain.png
Format: PNG, 512x512, transparent background

Prompt:

Plaintext
Premium 3D UI still life for maintain weight insight: stylized balanced mechanical scale, calendar checkmark badge, and water bottle in 3D matte finish, deep green and cream palette, small gold accent, transparent background, no text, no logo.
13. Admin Screen Cards
Current file:

app/screens/admin/AdminHomeScreen.js

Manage Exercises Admin Card
File: assets/images/ui/admin-manage-exercises.png
Format: PNG, 512x512, transparent background

Prompt:

Plaintext
Premium 3D admin dashboard icon for managing exercises: 3D clipboard with checkmarks, stylized dumbbell, and anatomical body icon matching the master model aesthetic, deep green and cream palette with gold accent, transparent background, no text, no logo.
Manage Users Admin Card
File: assets/images/ui/admin-manage-users.png
Format: PNG, 512x512, transparent background

Prompt:

Plaintext
Premium 3D admin dashboard icon for managing users: three stylized 3D avatar bust icons derived from the master character with a small gold settings gear, deep green and cream palette, transparent background, no text, no logo.
14. Recommended Implementation Order
Generate base anatomical models first (body-map-front-base.png & body-map-back-base.png).

Generate anatomical highlight overlays (highlight-*.png) ensuring pixel alignment.

Wire up MuscleVisualizer.js and Step10FocusAreas.js.

Generate the 5 body-shape variations (body-shape-*.png) for Steps 7 and 8.

Generate onboarding goal, avatar, and insight card assets.

Generate exercise group thumbnails and per-exercise looping video assets.