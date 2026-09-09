import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

export default function useThemedStyles(styleFactory) {
  const { colors } = useAppTheme();
  return useMemo(() => StyleSheet.create(styleFactory(colors)), [colors, styleFactory]);
}
