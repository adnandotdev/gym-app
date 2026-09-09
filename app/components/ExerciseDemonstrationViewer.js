import React, { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MotionPressable from './MotionPressable';
import { resolveExerciseDemonstration } from '../data/exerciseDemonstrationImages';
import { radius, spacing, typography } from '../theme/colors';
import { useAppTheme } from '../context/ThemeContext';
import useThemedStyles from '../theme/useThemedStyles';

const PHASES = Object.freeze([
  Object.freeze({ id: 'start', label: 'Start position' }),
  Object.freeze({ id: 'finish', label: 'Finish position' }),
]);

export default function ExerciseDemonstrationViewer({
  variationId,
  familyId,
  exerciseName,
  equipment,
  compact = false,
}) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const [phase, setPhase] = useState('start');
  const demonstration = useMemo(
    () => resolveExerciseDemonstration(variationId, familyId, 'male'),
    [familyId, variationId],
  );

  useEffect(() => {
    setPhase('start');
  }, [variationId]);

  if (!demonstration) return null;

  const selectedIndex = PHASES.findIndex(({ id }) => id === phase);
  const selectedPhase = PHASES[selectedIndex];

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <View style={styles.headingRow}>
        <View style={styles.headingCopy}>
          <Text style={styles.eyebrow}>Movement demonstration</Text>
          <Text style={styles.title} numberOfLines={1}>{exerciseName}</Text>
        </View>
        <Text style={styles.counter}>{selectedIndex + 1} of {PHASES.length}</Text>
      </View>

      <View style={styles.imageFrame}>
        <Image
          source={demonstration[phase]}
          style={styles.image}
          resizeMode="contain"
          accessible
          accessibilityLabel={`${exerciseName}, ${selectedPhase.label.toLowerCase()}, male model using ${equipment}`}
        />
      </View>

      <View style={styles.phaseTabs} accessibilityRole="tablist">
        {PHASES.map((item) => {
          const selected = item.id === phase;

          return (
            <MotionPressable
              key={item.id}
              style={[styles.phaseTab, selected && styles.phaseTabSelected]}
              onPress={() => setPhase(item.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: item.id === phase }}
              accessibilityLabel={`${item.label} for ${exerciseName}`}
            >
              <Ionicons
                name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                size={18}
                color={selected ? colors.accentOnDark : colors.textSecondary}
              />
              <Text style={[styles.phaseLabel, selected && styles.phaseLabelSelected]}>
                {item.label}
              </Text>
            </MotionPressable>
          );
        })}
      </View>

      <View style={styles.equipmentRow}>
        <Ionicons name="fitness-outline" size={16} color={colors.accent} />
        <Text style={styles.equipmentText}>{equipment}</Text>
      </View>
    </View>
  );
}

const createStyles = (colors) => ({
  container: {
    marginBottom: spacing.lg,
  },
  containerCompact: {
    marginBottom: spacing.lg,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  headingCopy: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    ...typography.metaSmall,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.micro,
  },
  title: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  counter: {
    ...typography.metaSmall,
    color: colors.accent,
    paddingBottom: spacing.micro,
  },
  imageFrame: {
    aspectRatio: 4 / 3,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: colors.surfaceWarm,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  phaseTabs: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  phaseTab: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  phaseTabSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  phaseLabel: {
    ...typography.action,
    flexShrink: 1,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  phaseLabelSelected: {
    color: colors.accentOnDark,
  },
  equipmentRow: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  equipmentText: {
    ...typography.caption,
    flex: 1,
    color: colors.textSecondary,
  },
});
