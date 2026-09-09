import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { componentSizes, spacing } from '../theme/colors';
import { useAppTheme } from '../context/ThemeContext';

// Import Screens
import HomeScreen from '../screens/user/HomeScreen';
import ActivityScreen from '../screens/user/ActivityScreen';
import WorkoutPlanScreen from '../screens/user/WorkoutPlanScreen';
import ProfileScreen from '../screens/user/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: 'none',
        tabBarStyle: {
          backgroundColor: isDark ? colors.surface : colors.primary,
          borderTopColor: colors.hairline,
          borderTopWidth: isDark ? 1 : 0,
          height: componentSizes.tabBarHeight + insets.bottom,
          paddingBottom: insets.bottom + spacing.micro,
          paddingTop: spacing.micro,
        },
        tabBarItemStyle: { minHeight: 44 },
        tabBarActiveTintColor: isDark ? colors.accent : colors.white,
        tabBarInactiveTintColor: isDark ? colors.muted : 'rgba(255,255,255,0.78)',
        tabBarLabelStyle: {
          fontFamily: 'Overpass_600SemiBold',
          fontSize: 11,
          lineHeight: 14,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Activity') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          else if (route.name === 'My Plan') iconName = 'calendar-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="My Plan" component={WorkoutPlanScreen} options={{ tabBarLabel: 'Calendar' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
