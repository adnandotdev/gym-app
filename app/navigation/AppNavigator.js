import React, { useContext, useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useReducedMotion } from 'react-native-reanimated';
import { AuthContext } from '../context/AuthContext';

// Import Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import MainTabNavigator from './MainTabNavigator';
import ExerciseDetailScreen from '../screens/user/ExerciseDetailScreen';
import AddToPlanSheetScreen from '../screens/user/AddToPlanSheetScreen';
import EditProfileScreen from '../screens/user/EditProfileScreen';
import NotificationsScreen from '../screens/user/NotificationsScreen';
import WorkoutSessionScreen from '../screens/user/WorkoutSessionScreen';
import WorkoutReadinessScreen from '../screens/user/WorkoutReadinessScreen';
import ExerciseLibraryScreen from '../screens/user/ExerciseLibraryScreen';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import OnboardingNavigator from './OnboardingNavigator';

import { WorkoutPlanProvider } from '../context/WorkoutPlanContext';
import { WorkoutActivityProvider } from '../context/WorkoutActivityContext';
import { useAppTheme } from '../context/ThemeContext';
import useThemedStyles from '../theme/useThemedStyles';

const Stack = createNativeStackNavigator();
const AppStackNav = createNativeStackNavigator();

const AppStack = () => {
  const reducedMotion = useReducedMotion();
  const { colors } = useAppTheme();

  return (
    <WorkoutPlanProvider>
      <WorkoutActivityProvider>
        <AppStackNav.Navigator
          screenOptions={{
            headerShown: false,
            animation: reducedMotion ? 'fade' : 'default',
          }}
        >
          <AppStackNav.Screen name="MainTabs" component={MainTabNavigator} />
          <AppStackNav.Screen name="ExerciseLibrary" component={ExerciseLibraryScreen} />
          <AppStackNav.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
          <AppStackNav.Screen name="EditProfile" component={EditProfileScreen} />
          <AppStackNav.Screen name="Notifications" component={NotificationsScreen} />
          <AppStackNav.Screen name="WorkoutSession" component={WorkoutSessionScreen} />
          <AppStackNav.Screen name="WorkoutReadiness" component={WorkoutReadinessScreen} />
          <AppStackNav.Screen
            name="AddToPlan"
            component={AddToPlanSheetScreen}
            options={{
              presentation: 'formSheet',
              sheetAllowedDetents: [0.65, 0.9],
              sheetInitialDetentIndex: 0,
              sheetGrabberVisible: true,
              contentStyle: { backgroundColor: colors.surface },
            }}
          />
        </AppStackNav.Navigator>
      </WorkoutActivityProvider>
    </WorkoutPlanProvider>
  );
};

const AppNavigator = () => {
  const { token, user, isLoading } = useContext(AuthContext);
  const { colors, isDark } = useAppTheme();
  const reducedMotion = useReducedMotion();
  const styles = useThemedStyles(createStyles);
  const navigationTheme = useMemo(() => ({
    dark: isDark,
    colors: {
      primary: colors.primary,
      background: colors.canvas,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.danger,
    },
    fonts: DefaultTheme.fonts,
  }), [colors, isDark]);

  // Show a fullscreen loading indicator while checking auth token on launch
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme} documentTitle={{ formatter: (options, route) => `${options?.title ?? route?.name ?? 'Workout guidance'} · LiftSutra` }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: reducedMotion ? 'fade' : 'default',
        }}
      >
        {token === null ? (
          // AuthStack: Exposed to unauthenticated users
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : (
          // AppStack: Exposed to authenticated users (Role-Based)
          <>
            {user?.role === 'admin' ? (
              <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
            ) : user?.onboardingComplete ? (
              <Stack.Screen name="App" component={AppStack} />
            ) : (
              <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const createStyles = (colors) => ({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default AppNavigator;
