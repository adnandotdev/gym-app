import React from 'react';
import { Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, typography, radius, componentSizes, spacing } from '../theme/colors';
import MotionPressable from './MotionPressable';

const Button = ({ title, onPress, loading, disabled, style, textStyle }) => {
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
        <ActivityIndicator size="small" color={colors.ink} />
      ) : (
        <Text style={[styles.text, textStyle, isButtonDisabled && styles.textDisabled]}>{title}</Text>
      )}
    </MotionPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.ink,
    borderRadius: radius.control,
    minHeight: componentSizes.primaryButtonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    width: '100%',
    marginVertical: spacing.sm,
  },
  buttonDisabled: {
    backgroundColor: colors.disabledBg,
  },
  text: {
    ...typography.action,
    color: colors.canvas,
  },
  textDisabled: {
    color: colors.disabledText,
  },
});

export default Button;
