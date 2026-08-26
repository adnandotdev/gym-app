# 🗺️ MuscleMap Project Tracking & Technical Specification

This document serves as the absolute **Single Source of Truth** for the MuscleMap gym workout application. It logs completed implementations, architectural file structures, environment settings, and the active roadmap to keep all development perfectly on track across subsequent prompts.

---

## 🎯 Project Overview
- **Project Name**: MuscleMap (originally rebranded from generic *BaseApp*)
- **Frontend Stack**: React Native (Expo Go v54.0.0 blank template), React Navigation, Ionicons, React Native Toast Message.
- **Backend Stack**: Node.js, Express, MongoDB Atlas (Mongoose).
- **Communication Layer**: Custom pure-JS `FetchClient` (Axios-mimicking wrapper for native `fetch`).
- **Core Architecture**: JWT session-based token authentication, dynamic multi-role access controls (`admin` vs `user`), and a locked-down 13-step fitness profile onboarding flow.

---

## 📁 Technical Architecture & File Directory

```text
BaseApp/ (MuscleMap App)
├── app/                              # React Native Expo Frontend Code
│   ├── components/
│   │   └── Button.js                 # Premium action buttons (loading & disabled states)
│   ├── context/
│   │   ├── AuthContext.js            # Secure JWT sessions, login, signup, AsyncStorage
│   │   └── OnboardingContext.js      # Global onboarding answers, live BMI formulas, PUT API
│   ├── navigation/
│   │   ├── AppNavigator.js           # Core routing (Auth Stack vs App Stack vs Onboarding)
│   │   └── OnboardingNavigator.js    # Stack holding Steps 1 through 13
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js          # Password eye-toggle, autofocus, custom validation
│   │   │   ├── RegisterScreen.js       # Complexity password check, strength-bar segments
│   │   │   └── ForgotPasswordScreen.js # Password reset flow with mock toast success alerts
│   │   ├── onboarding/                 # Locked 13-Step Fitness Onboarding Flow
│   │   │   ├── OnboardingHeader.js     # Shared 4-part segment progress header with checkmarks
│   │   │   ├── Step1FitnessGoal.js     # Goals side-by-side cards selection
│   │   │   ├── Step2Gender.js          # Gender selection rows (♂/♀/⚧) & logout link
│   │   │   ├── Step3FitnessLevel.js    # Fitness level cards with colored visual placeholders
│   │   │   ├── Step4Age.js             # Snap age scrollwheel list with dynamic fading scale
│   │   │   ├── Step5Height.js          # CM/FT toggle ruler vertical tick selector
│   │   │   ├── Step6CurrentWeight.js   # KG/LB horizontal ruler with live color BMI gauge
│   │   │   ├── Step7CurrentBodyShape.js# Outline body model with 5-dot opacity fat slider
│   │   │   ├── Step8DesiredBodyShape.js# Comparative shapes selector (Current vs Desired)
│   │   │   ├── Step9TargetWeight.js    # Target weight snap ruler with dynamic weight % diff
│   │   │   ├── Step10FocusAreas.js     # Body target pills with custom model connectors
│   │   │   ├── Step11TrainingDays.js   # 7-day grid showing "TODAY" badges and reminder toggle
│   │   │   ├── Step12Equipment.js      # Gear cards (Bodyweight/Portable/Gym) turning yellow
│   │   │   └── Step13Injuries.js       # 2x3 injuries grid with red blobs & success animation
│   │   ├── admin/
│   │   │   └── AdminHomeScreen.js      # Rebranded admin dashboard, action cards, toasts
│   │   └── user/
│   │       └── HomeScreen.js           # Rebranded user home screen, barbell theme, alerts
│   └── utils/
│       └── api.js                    # FetchClient: axios-like wrapper for pure fetch requests
├── backend/                          # Express Server & DB Models
│   ├── middleware/
│   │   └── authMiddleware.js         # JWT protected route guard (attaches req.user)
│   ├── models/
│   │   └── User.js                   # Mongoose Schema (18 profile fields + pre-save hash)
│   ├── routes/
│   │   └── auth.js                   # Auth endpoints (Register, Login, Me, PUT /onboarding)
│   ├── .env                          # Server variables (PORT, MONGO_URI, JWT_SECRET)
│   └── server.js                     # Server entry, DB connector, health check route
├── .env                              # Frontend variables (EXPO_PUBLIC_API_URL)
└── app.json                          # Expo Configurations (Rebranded as MuscleMap)
```

---

## ⚡ Core Features Implemented

### 1. Rebranding & Polished UX
- **Branding**: Renamed the entire application, configuration files, backend health endpoints, and documentation to "MuscleMap".
- **Theme Color Palette**: Migrated to a modern **Light Mode Theme**. Uses `#FFFFFF` & `#F8F9FA` backgrounds, primary accent soft purple `#C9BEF0` (FAB, active states), secondary accent soft yellow `#FBE192` (badges/pills), and rounded card shadows (`elevation/shadowRadius`) instead of flat dark cards.
- **Password Eye/Visibility Toggle**: Built into all password fields across Login, Register, and ForgotPassword screens.
- **Complexity Strength Meter (Register)**: Renders a 4-segment color-coded real-time bar (Weak, Fair, Good, Strong) based on length, digits, symbols, and uppercase variables.
- **Top Toast Alerts**: Replaced ugly native system alerts with high-fidelity `react-native-toast-message` banners at the top of all user frames.

### 2. Multi-Step Onboarding Flow (13 Steps)
- **Part 1 — Goals & Basics (Steps 1-3)**:
  - *Goal*: Two side-by-side cards selection (Weight Loss, Muscle Build) highlighted with yellow borders.
  - *Gender*: Rows featuring Ionicons (Male `♂`, Female `♀`, Prefer not to say `⚧`) and a direct logout path.
  - *Fitness*: Selection cards with colored block representation placeholders (Beginner: light blue, Intermediate: orange, Advanced: dark red).
- **Part 2 — Body Stats (Steps 4-6)**:
  - *Age*: A vertical snapped age scrollwheel that scales down and fades out adjacent options.
  - *Height*: Pill-shaped FT / CM unit toggles, central metric visualizer, and a vertical tick-ruler with a central yellow marker.
  - *Weight*: KG / LB toggle, horizontal snapping weight ruler with vertical center pointer, and a **live BMI card** that dynamically positions a status indicator on a blue-green-red meter.
- **Part 3 — Body Shape & Target (Steps 7-9)**:
  - *Current Body fat*: Custom 5-dot slider that shifts silhouette outline yellow-orange background opacity.
  - *Target Body fat*: Comparative side-by-side shapes selector (Current shape vs Target shape) separated by chevrons (>>).
  - *Target Weight*: Horizontal weight snap ruler alongside motivational weight gain/loss % calculators.
- **Part 4 — Lifestyle & Preferences (Steps 10-13)**:
  - *Focus*: Body focus selector linking muscle groups (Chest, Arms, Abs, Legs) on a model diagram to multi-select pills via connector dotted lines.
  - *Days*: 7-day grid that puts a "TODAY" badge on the active day of the week, multi-select day checkmarks, and a training reminder switch.
  - *Equipment*: Full-width gear choice cards that turn yellow when active (Bodyweight: green, Portable: grey, Gym: dark).
  - *Injuries*: 2x3 grid selection (No injuries, Shoulders, Back, Waist, Wrist, Knee) indicating locations via red blobs.
  - *Finish Animation*: Full-screen saving spinners and a gorgeous Animated pop-up checkmark overlay upon successful save.

### 3. Fetch-Client API Configuration
- Replaced Axios with a pure React Native **`fetch` client** inside `app/utils/api.js`. It mimics Axios exactly (methods like `api.get()`, `api.put()`, and structures like `response.data`), maintaining full codebase compatibility while operating cleanly without large external libraries.

### 4. Mongoose Save and Database Security
- Fixed a critical pre-save hook in `backend/models/User.js` by including `return next()` and an ending `next()`, which prevents Mongoose from triggering double callbacks and double-hashing passwords during user profile updates.
- **Concurrent Update Safety**: Fixed a `VersionError` in the `/api/workout-plan/day` route by swapping `findOne()` + `save()` with an atomic `findOneAndUpdate()` using `$set`. This allows the frontend to safely mass-migrate local offline data into the backend without colliding versions.

---

## 🛠️ Startup & Connection Checklist

### Local Wi-Fi Connection Settings
Mobile devices and Expo Go can only download the app package if your machine and your phone are connected to the **same Wi-Fi network**.
1. **Find Current local IP**: Run `ifconfig` on macOS (look for the IP next to `inet` under `en0`).
2. **Update env**: Set `EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:5000/api` in the root `.env` file.
3. **Wi-Fi Isolation Bypass**: If your router blocks local peer connections (e.g. Guest Wi-Fi), connect both your phone and computer to your **Mobile Hotspot** to create a direct network bridge.

### Launch Commands
- **Backend Launch** (from `backend/`):
  ```bash
  npm install
  npm start
  ```
- **Frontend Launch** (from root/):
  ```bash
  npm install
  npx expo start --clear
  ```
  *(Press `r` in the Expo terminal if you need to force-reload environment files).*

---

## 📈 Roadmap & Upcoming Features

### 5. Core App Navigation & Features (Completed)
- **MainTabNavigator**: Implemented `@react-navigation/bottom-tabs` containing Home, Exercises, My Plan, and Profile screens with a sleek light theme (`#FFFFFF`) and purple/yellow active indicators.
- **HomeScreen**: Redesigned dashboard with a dynamic greeting, user stats row, "Today's Workout" gradient card, motivational quotes, and a quick actions grid with elevated shadow cards.
- **ExerciseLibraryScreen**: Browse 40 compiled exercises with real-time search filtering and scrollable horizontal muscle group pills.
- **ExerciseDetailScreen**: Full-screen modal containing the stylized SVG `MuscleVisualizer` (front/back views), instruction steps, and a custom animated bottom sheet to add the exercise to the weekly plan.
- **WorkoutPlanScreen**: 7-day horizontal selector (Monday-Sunday) allowing users to retrieve, view, and delete saved exercises. Fully synced with **MongoDB backend** across devices (migrated from local AsyncStorage).
- **ProfileScreen**: Displays the user's BMI, onboarding physical stats dynamically linked to MongoDB, settings, and contains the logout functionality. Now links to the Edit Profile screen.
- **EditProfileScreen [NEW]**: Full profile interactive editor allowing users to modify account details, gender, age, height (FT/CM), weight (KG/LB), goals, experience, equipment, muscle focus groups, scheduled days, and injuries.
- **Profile API PUT Route [NEW]**: Custom `/api/auth/profile` Express route that validates, saves, and returns the fully updated user object to the client.
- **Session Profile Sync [NEW]**: Updated frontend login and register handlers to ingest full actual user data immediately upon login.

*(This section will log future feature additions, modifications, and sprints as you supply them).*
- **[COMPLETED]**: Backend Sync for Workout Plans.
- **[COMPLETED]**: Modern Light Theme UI Overhaul (Purple/Yellow).
- **[PENDING]**: Real-time workout tracking feature.
