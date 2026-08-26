# 💪 MuscleMap

Welcome to **MuscleMap**, a premium, production-ready React Native mobile application boilerplate built using Expo, Node.js, Express, and MongoDB. Designed as a robust base for fitness and gym workout companions, it features full secure user authentication, role-based navigation, high-fidelity responsive layouts, and dynamic modern styling.

---

## 🚀 Features

### Frontend (React Native + Expo)
- **Role-Based Navigation**: Automatic routing logic based on user roles (`user` → `Home`, `admin` → `AdminHome`).
- **Secure Authentication Flow**: Integrated Login, Signup (with complexity password strength validation), and Password Reset screens.
- **Premium UX Aesthetics**: Elegant custom input focus indicators, interactive eye icon toggle for password fields, harmonious spacing, custom card grid with standard modern `Ionicons`, and polished toast notifications.
- **Form Validation**: Strict email format checking and dynamic validation feedbacks under fields with beautiful red indicators.

### Backend (Node.js + Express)
- **JWT Authentication**: Secure token-based user sessions.
- **MongoDB Database integration**: Mongoose schemas for clean User and session data models.
- **Robust Error Handling**: Graceful database disconnection fallbacks (supports starting in Offline mode for local dev).
- **Health Check API**: Easily auditable `/health` check status responses.

---

## 📁 Repository Structure

```text
MuscleMap/
├── app/                        # Frontend Expo App Source
│   ├── components/
│   │   └── Button.js           # Shared Custom Reusable Button component
│   ├── context/
│   │   └── AuthContext.js      # Global Auth state management (JWT, user storage)
│   ├── navigation/
│   │   └── AppNavigator.js     # React Navigation configuration (Auth vs App stacks)
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js          # Rebranded Sign In
│   │   │   ├── RegisterScreen.js       # Signup with Password Strength Meter
│   │   │   └── ForgotPasswordScreen.js # Rebranded password reset link
│   │   ├── admin/
│   │   │   └── AdminHomeScreen.js      # MuscleMap Admin panel actions
│   │   └── user/
│   │       └── HomeScreen.js           # MuscleMap Athlete Dashboard
│   └── utils/
│       └── api.js              # Centralized Axios connection handler
├── backend/                    # Backend API Source
│   ├── middleware/             # Route guards and JWT parsers
│   ├── models/                 # Mongoose schemas (User schema with roles)
│   ├── routes/                 # Auth routers (/api/auth/register, login)
│   ├── .env                    # Backend environment config (MONGO_URI, JWT_SECRET, PORT)
│   └── server.js               # Express app entry & database connector
├── assets/                     # Splash screens, favicon, and icons
├── app.json                    # Expo Configuration
├── App.js                      # Main React Native entry wrapping context & toast
└── package.json                # Project dependencies
```

---

## 🛠️ Step-by-Step Setup Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Expo Go](https://expo.dev/go) client app installed on your physical device (iOS or Android) to preview the mobile application.

---

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install standard dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `backend/` folder and populate it with your environment variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/musclemap?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_signing_secret_key_here
   ```
4. Start the backend development server:
   ```bash
   npm start
   ```
   *You should see a console log stating:* `MuscleMap Backend running on port 5000`.

---

### 3. Frontend Setup
1. Return to the root directory and install Expo package dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file at the **root** of the project and set your local machine IP address so the simulator/physical device can connect to the local server API:
   ```env
   EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP_ADDRESS>:5000/api
   ```
3. Boot the Expo development server:
   ```bash
   npx expo start
   ```
4. Scan the QR code with your phone camera (iOS) or the Expo Go application (Android) to load the rebranded **MuscleMap** interface!

---

## 🔌 API Documentation

### Health Check
- **Endpoint**: `/health`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "OK",
    "message": "MuscleMap backend is running."
  }
  ```

### Authentication Router (`/api/auth`)
- **Register User**: `POST /register`
  - Body: `{ "name": "Name", "email": "email@test.com", "password": "Password123!" }`
- **Login User**: `POST /login`
  - Body: `{ "email": "email@test.com", "password": "Password123!" }`
