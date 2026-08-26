import React, { useContext } from 'react';
import { 
  View, Text, StyleSheet, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import MuscleVisualizer from '../../components/MuscleVisualizer';
import MotionPressable from '../../components/MotionPressable';
import { colors, typography, spacing, radius, componentSizes } from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';

export default function ExerciseDetailScreen({ route, navigation }) {
  const { exercise } = route.params;
  const { user } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <MotionPressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </MotionPressable>
        <Text style={styles.headerTitle}>{exercise.name}</Text>
        <MotionPressable
          accessibilityRole="button"
          accessibilityLabel="Bookmark exercise"
          accessibilityState={{ disabled: true }}
          disabled
          style={styles.headerBtn}
        >
          <Ionicons name="bookmark-outline" size={24} color={colors.textPrimary} />
        </MotionPressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <MuscleVisualizer
          exerciseId={exercise.id}
          exerciseName={exercise.name}
          gender={user?.gender}
          primaryMuscles={[exercise.muscleGroup]}
          secondaryMuscles={exercise.secondaryMuscles}
        />

        <View style={styles.statsRow}>
          <View style={[styles.statBadge, { backgroundColor: colors.accentLight }]}>
            <Ionicons name="fitness" size={16} color={colors.accent} />
            <Text style={[styles.statText, { color: colors.accent }]}>{exercise.equipment}</Text>
          </View>
          <View style={[styles.statBadge, { backgroundColor: colors.performanceSoft }]}>
            <Ionicons name="speedometer" size={16} color={colors.performance} />
            <Text style={[styles.statText, { color: colors.performance }]}>{exercise.difficulty}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <View style={styles.instructionsCard}>
            {exercise.instructions.map((step, index) => (
              <View key={index} style={styles.instructionRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomAction}>
        <MotionPressable
          style={styles.addButton}
          onPress={() => navigation.navigate('AddToPlan', { exercise })}
        >
          <Text style={styles.addButtonText}>Add to Plan</Text>
        </MotionPressable>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screen,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginVertical: spacing.lg,
  },
  statBadge: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.control,
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  instructionsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  instructionRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: radius.control,
    backgroundColor: colors.ink,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    marginTop: radius.subtle,
  },
  stepNumberText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  bottomAction: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.canvas,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addButton: {
    backgroundColor: colors.ink,
    minHeight: componentSizes.primaryButtonHeight,
    borderRadius: radius.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    ...typography.action,
    color: colors.canvas,
  },
});
