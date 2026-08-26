import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { cubicBezier, useReducedMotion } from 'react-native-reanimated';
import { motion } from '../theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function MotionPressable({
  children,
  disabled,
  onPressIn,
  onPressOut,
  pressRetentionOffset = 16,
  style,
  ...props
}) {
  const [pressed, setPressed] = useState(false);
  const reducedMotion = useReducedMotion();

  const handlePressIn = (event) => {
    setPressed(true);
    onPressIn?.(event);
  };

  const handlePressOut = (event) => {
    setPressed(false);
    onPressOut?.(event);
  };

  return (
    <AnimatedPressable
      {...props}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      pressRetentionOffset={pressRetentionOffset}
      style={[
        style,
        !reducedMotion && styles.motion,
        pressed && !disabled && styles.pressedOpacity,
        pressed && !disabled && !reducedMotion && styles.pressedScale,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  motion: {
    opacity: 1,
    transform: [{ scale: 1 }],
    transitionProperty: ['transform', 'opacity'],
    transitionDuration: motion.pressDuration,
    transitionTimingFunction: cubicBezier(...motion.easeOut),
  },
  pressedOpacity: {
    opacity: 0.92,
  },
  pressedScale: {
    transform: [{ scale: 0.97 }],
  },
});
