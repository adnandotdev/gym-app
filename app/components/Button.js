import React from 'react';
import { Text, ActivityIndicator } from 'react-native';
import { typography, radius, componentSizes, spacing } from '../theme/colors';
import { useAppTheme } from '../context/ThemeContext';
import useThemedStyles from '../theme/useThemedStyles';
import MotionPressable from './MotionPressable';

const Button = ({ title, onPress, loading, disabled, style, textStyle }) => {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const isButtonDisabled = loading || disabled;
  
  return (
    <MotionPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isButtonDisabled, busy: Boolean(loading) }}
      onPress={onPress}
      disabled={isButtonDisabled}
      style={[
        styles.button,
        style,
        isButtonDisabled && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.accentOnDark} />
      ) : (
        <Text style={[styles.text, textStyle, isButtonDisabled && styles.textDisabled]}>{title}</Text>
      )}
    </MotionPressable>
  );
};

const createStyles = (colors) => ({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.control,
    minHeight: componentSizes.primaryButtonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: colors.disabledBg,
  },
  text: {
    ...typography.action,
    color: colors.accentOnDark,
    textAlign: 'center',
  },
  textDisabled: {
    color: colors.disabledText,
  },
});

export default Button;
