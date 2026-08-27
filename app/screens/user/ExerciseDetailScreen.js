import React, { useContext, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import MuscleVisualizer from '../../components/MuscleVisualizer';
import ExerciseDemonstrationViewer from '../../components/ExerciseDemonstrationViewer';
import MotionPressable from '../../components/MotionPressable';
import Button from '../../components/Button';
import ExerciseVariationSheet from './ExerciseVariationSheet';
import { colors, typography, spacing, radius } from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';
import { exercises } from '../../data/exercises';
import {
  buildLegacyExerciseFallback,
  buildVariationExercise,
  getExerciseVariations,
  getSelectedVariation,
  resolveExerciseFamily,
} from '../../data/exerciseVariations';

export default function ExerciseDetailScreen({ route, navigation }) {
  const routeExercise = route.params.exercise;
  const { user } = useContext(AuthContext);
  const parentExercise = resolveExerciseFamily(routeExercise, exercises) || routeExercise;
  const variations = getExerciseVariations(parentExercise.id);
  const hasVariations = variations.length > 0;
  const initialVariation = getSelectedVariation(
    parentExercise.id,
    routeExercise.exerciseVariantId || routeExercise.id,
  );
  const [selectedVariation, setSelectedVariation] = useState(initialVariation);
  const [draftVariation, setDraftVariation] = useState(initialVariation);
  const [variationSheetVisible, setVariationSheetVisible] = useState(false);

  const selectedExercise = useMemo(
    () => buildVariationExercise(parentExercise, selectedVariation)
      || buildLegacyExerciseFallback(parentExercise),
    [parentExercise, selectedVariation],
  );

  const openVariationPicker = () => {
    if (!hasVariations) return;
    setDraftVariation(selectedVariation);
    setVariationSheetVisible(true);
  };

  const confirmVariation = () => {
    if (!draftVariation) return;
    setSelectedVariation(draftVariation);
    setVariationSheetVisible(false);
  };

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
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle} numberOfLines={1}>{parentExercise.name}</Text>
          <Text style={styles.headerMeta}>
            {hasVariations ? `${variations.length} variations` : 'Saved exercise'}
          </Text>
        </View>
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

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ExerciseDemonstrationViewer
          variationId={selectedExercise.exerciseVariantId}
          familyId={selectedExercise.exerciseFamilyId || parentExercise.id}
          exerciseName={selectedExercise.name}
          equipment={selectedExercise.equipment}
        />

        <View style={styles.statsRow}>
          <View style={[styles.statBadge, styles.equipmentBadge]}>
            <Ionicons name="fitness" size={16} color={colors.accent} />
            <Text style={[styles.statText, styles.equipmentText]}>{selectedExercise.equipment}</Text>
          </View>
          <View style={[styles.statBadge, styles.difficultyBadge]}>
            <Ionicons name="speedometer" size={16} color={colors.performance} />
            <Text style={[styles.statText, styles.difficultyText]}>{selectedExercise.difficulty}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeadingRow}>
            <View style={styles.sectionHeadingCopy}>
              <Text style={styles.sectionEyebrow}>
                {hasVariations ? 'Current variation' : 'Exercise'}
              </Text>
              <Text style={styles.sectionTitle}>{selectedExercise.name}</Text>
            </View>
            {selectedVariation?.isDefault && (
              <Text style={styles.recommendedLabel}>Recommended</Text>
            )}
          </View>

          <View style={styles.variationCard}>
            <Text style={styles.variationSummary}>
              {selectedVariation?.summary
                || selectedExercise.description
                || 'This saved exercise is no longer in the current variation catalog.'}
            </Text>
            {selectedVariation?.setupCue && (
              <Text style={styles.setupCue}>{selectedVariation.setupCue}</Text>
            )}

            <View style={styles.muscleSection}>
              <Text style={styles.muscleLabel}>Target emphasis</Text>
              <View style={styles.muscleTags}>
                {selectedExercise.primaryMuscles.map((muscle) => (
                  <View key={muscle} style={styles.primaryMuscleTag}>
                    <Text style={styles.primaryMuscleText}>{muscle}</Text>
                  </View>
                ))}
                {selectedExercise.secondaryMuscles.slice(0, 2).map((muscle) => (
                  <View key={muscle} style={styles.secondaryMuscleTag}>
                    <Text style={styles.secondaryMuscleText}>{muscle} · secondary</Text>
                  </View>
                ))}
              </View>
            </View>

            {hasVariations && (
              <MotionPressable
                style={styles.chooseVariationButton}
                onPress={openVariationPicker}
                accessibilityRole="button"
                accessibilityLabel={`Choose Variation. Current selection: ${selectedExercise.name}`}
              >
                <View style={styles.chooseVariationCopy}>
                  <Text style={styles.chooseVariationTitle}>Choose Variation</Text>
                  <Text style={styles.chooseVariationMeta}>One selection controls this workout entry</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textPrimary} />
              </MotionPressable>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.musclesWorkedHeading}>
            <Text style={styles.sectionEyebrow}>Anatomy</Text>
            <Text style={styles.sectionTitle}>Muscles worked</Text>
            <Text style={styles.musclesWorkedCopy}>
              Red shows the exercise-family muscle map. The selected variation's exact emphasis is listed above.
            </Text>
          </View>
          <MuscleVisualizer
            exerciseId={selectedExercise.anatomyExerciseId}
            exerciseName={selectedExercise.name}
            gender={user?.gender}
            primaryMuscles={selectedExercise.primaryMuscles}
            secondaryMuscles={selectedExercise.secondaryMuscles}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <View style={styles.instructionsCard}>
            {selectedExercise.instructions.map((step, index) => (
              <View
                key={`${selectedExercise.id}-${index}`}
                style={[
                  styles.instructionRow,
                  index === selectedExercise.instructions.length - 1 && styles.lastInstructionRow,
                ]}
              >
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {hasVariations && (
          <MotionPressable
            style={styles.addAnotherButton}
            onPress={openVariationPicker}
            accessibilityRole="button"
            accessibilityLabel="Add Another Variation"
          >
            <Ionicons name="add" size={20} color={colors.accent} />
            <Text style={styles.addAnotherText}>Add Another Variation</Text>
          </MotionPressable>
        )}
      </ScrollView>

      <View style={styles.bottomAction}>
        <Button
          title="Add to Plan"
          onPress={() => navigation.navigate('AddToPlan', { exercise: selectedExercise })}
        />
      </View>

      {hasVariations && (
        <ExerciseVariationSheet
          visible={variationSheetVisible}
          exerciseName={parentExercise.name}
          variations={variations}
          selectedVariationId={draftVariation?.id}
          onSelect={setDraftVariation}
          onConfirm={confirmVariation}
          onClose={() => setVariationSheetVisible(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.screen,
    paddingTop: spacing.xs, paddingBottom: spacing.md, borderBottomWidth: 1,
    borderBottomColor: colors.hairline, gap: spacing.sm,
  },
  headerBtn: {
    width: 44, height: 44, flexShrink: 0, borderRadius: radius.control,
    backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center',
  },
  headerCopy: { flex: 1, minWidth: 0, alignItems: 'center' },
  headerTitle: { ...typography.cardTitle, color: colors.textPrimary, textAlign: 'center' },
  headerMeta: { ...typography.metaSmall, color: colors.textSecondary, marginTop: spacing.micro },
  content: { flex: 1 },
  contentContainer: { paddingHorizontal: spacing.screen, paddingBottom: spacing.screen },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginVertical: spacing.lg },
  statBadge: {
    minHeight: 36, flexDirection: 'row', paddingHorizontal: spacing.sm,
    borderRadius: radius.control, alignItems: 'center', gap: spacing.xs,
  },
  equipmentBadge: { backgroundColor: colors.accentLight },
  difficultyBadge: { backgroundColor: colors.performanceSoft },
  statText: { ...typography.caption },
  equipmentText: { color: colors.accent },
  difficultyText: { color: colors.performance },
  section: { marginBottom: spacing.xl },
  sectionHeadingRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, marginBottom: spacing.md },
  sectionHeadingCopy: { flex: 1, minWidth: 0 },
  sectionEyebrow: {
    ...typography.metaSmall, color: colors.textSecondary, textTransform: 'uppercase',
    letterSpacing: 0.8, marginBottom: spacing.micro,
  },
  sectionTitle: { ...typography.cardTitle, color: colors.textPrimary },
  musclesWorkedHeading: { marginBottom: spacing.md },
  musclesWorkedCopy: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.micro,
  },
  recommendedLabel: { ...typography.metaSmall, color: colors.accent, paddingBottom: spacing.micro },
  variationCard: {
    backgroundColor: colors.surface, borderRadius: radius.card, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.hairline,
  },
  variationSummary: { ...typography.body, color: colors.bodySecondary },
  setupCue: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  muscleSection: { marginTop: spacing.lg, gap: spacing.xs },
  muscleLabel: {
    ...typography.metaSmall, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8,
  },
  muscleTags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  primaryMuscleTag: {
    backgroundColor: colors.accentLight, borderRadius: radius.chip,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
  },
  primaryMuscleText: { ...typography.metaSmall, color: colors.accent },
  secondaryMuscleTag: {
    backgroundColor: colors.selectedSoft, borderRadius: radius.chip,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
  },
  secondaryMuscleText: { ...typography.metaSmall, color: colors.bodySecondary },
  chooseVariationButton: {
    minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginTop: spacing.lg, paddingTop: spacing.md, borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
  },
  chooseVariationCopy: { flex: 1, minWidth: 0 },
  chooseVariationTitle: { ...typography.action, color: colors.textPrimary },
  chooseVariationMeta: { ...typography.metaSmall, color: colors.textSecondary, marginTop: spacing.micro },
  instructionsCard: {
    backgroundColor: colors.surface, borderRadius: radius.card, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.hairline, marginTop: spacing.md,
  },
  instructionRow: { flexDirection: 'row', marginBottom: spacing.lg, alignItems: 'flex-start' },
  lastInstructionRow: { marginBottom: 0 },
  stepNumber: {
    width: 28, height: 28, borderRadius: radius.control, backgroundColor: colors.ink,
    justifyContent: 'center', alignItems: 'center', marginRight: spacing.md, marginTop: radius.subtle,
  },
  stepNumberText: { ...typography.action, color: colors.background },
  instructionText: { ...typography.body, flex: 1, color: colors.textSecondary },
  addAnotherButton: {
    minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, marginBottom: spacing.lg,
  },
  addAnotherText: { ...typography.action, color: colors.accent },
  bottomAction: {
    paddingHorizontal: spacing.screen, paddingTop: spacing.sm, paddingBottom: spacing.lg,
    backgroundColor: colors.canvas, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border,
  },
});
