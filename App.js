import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Overpass_400Regular,
  Overpass_500Medium,
  Overpass_600SemiBold,
  Overpass_700Bold,
  Overpass_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/overpass';
import { AuthProvider } from './app/context/AuthContext';
import { ThemeProvider, useAppTheme } from './app/context/ThemeContext';
import AppNavigator from './app/navigation/AppNavigator';
import BrandLogo from './app/components/BrandLogo';
import useThemedStyles from './app/theme/useThemedStyles';

function ThemeReadyGate({ fontsLoaded }) {
  const { colors, isDark, isReady } = useAppTheme();
  const styles = useThemedStyles(createStyles);

  if (!fontsLoaded || !isReady) {
    return (
      <View style={styles.loading}>
        <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.canvas} />
        {fontsLoaded ? <BrandLogo variant="artwork" /> : null}
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.canvas} />
      <AppNavigator />
      <Toast />
    </AuthProvider>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Overpass_400Regular,
    Overpass_500Medium,
    Overpass_600SemiBold,
    Overpass_700Bold,
    Overpass_800ExtraBold,
  });

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemeReadyGate fontsLoaded={fontsLoaded} />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
});

const createStyles = (colors) => ({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.canvas,
  },
});
