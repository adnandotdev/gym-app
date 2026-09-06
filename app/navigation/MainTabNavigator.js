import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { colors, componentSizes } from '../theme/colors';

// Import Screens
import HomeScreen from '../screens/user/HomeScreen';
import ActivityScreen from '../screens/user/ActivityScreen';
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
          backgroundColor: colors.primary,
          borderTopWidth: 0,
          height: componentSizes.tabBarHeight,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.78)',
        tabBarLabelStyle: {
          fontFamily: 'Overpass_600SemiBold',
          fontSize: 12,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Activity') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          else if (route.name === 'My Plan') iconName = 'calendar-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

          return (
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={24} color={color} />
            </View>
          );
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

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
