import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SystemUI from 'expo-system-ui';
import { darkColors, lightColors } from '../theme/colors';

const {
  THEME_PREFERENCE_KEY,
  THEME_PREFERENCES,
  normalizeThemePreference,
  resolveThemePreference,
} = require('../theme/themePreference');

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState('system');
  const [isReady, setIsReady] = useState(false);
  const preferenceWriteQueue = useRef(Promise.resolve());
  const resolvedScheme = resolveThemePreference(preference, systemScheme);
  const colors = resolvedScheme === 'dark' ? darkColors : lightColors;

  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(THEME_PREFERENCE_KEY)
      .then((storedPreference) => {
        if (isMounted) setPreferenceState(normalizeThemePreference(storedPreference));
      })
      .catch((error) => {
        console.warn('Unable to load appearance preference', error);
      })
      .finally(() => {
        if (isMounted) setIsReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (typeof Appearance.setColorScheme === 'function') {
      Appearance.setColorScheme(preference === 'system' ? 'unspecified' : preference);
    }
  }, [isReady, preference]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.canvas).catch((error) => {
      console.warn('Unable to update the system background color', error);
    });
  }, [colors]);

  const setPreference = useCallback((nextPreference) => {
    const normalizedPreference = normalizeThemePreference(nextPreference);
    setPreferenceState(normalizedPreference);
    preferenceWriteQueue.current = preferenceWriteQueue.current
      .catch(() => undefined)
      .then(() => AsyncStorage.setItem(THEME_PREFERENCE_KEY, normalizedPreference))
      .catch((error) => {
        console.warn('Unable to save appearance preference', error);
      });
  }, []);

  const value = useMemo(() => ({
    colors,
    isDark: resolvedScheme === 'dark',
    isReady,
    preference,
    resolvedScheme,
    setPreference,
    themePreferences: THEME_PREFERENCES,
  }), [colors, isReady, preference, resolvedScheme, setPreference]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useAppTheme must be used inside ThemeProvider');
  return value;
}

export { THEME_PREFERENCES };
