import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { colors, componentSizes } from '../theme/colors';

// Import Screens
import HomeScreen from '../screens/user/HomeScreen';
import ExerciseLibraryScreen from '../screens/user/ExerciseLibraryScreen';
import WorkoutPlanScreen from '../screens/user/WorkoutPlanScreen';
import ProfileScreen from '../screens/user/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: 'none',
        tabBarStyle: {
          backgroundColor: colors.canvas,
          borderTopWidth: 1,
          borderTopColor: colors.hairline,
          height: componentSizes.tabBarHeight,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.disabledText,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Exercises') iconName = 'barbell-outline';
          else if (route.name === 'My Plan') iconName = 'calendar-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';

          return (
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={24} color={color} />
              {focused && <View style={styles.activeDot} />}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Exercises" component={ExerciseLibraryScreen} />
      <Tab.Screen name="My Plan" component={WorkoutPlanScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 18,
    height: 1,
    backgroundColor: colors.ink,
    marginTop: 4,
  },
});
