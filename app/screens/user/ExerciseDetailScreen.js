import React, { useContext, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import MuscleVisualizer from '../../components/MuscleVisualizer';
import ExerciseDemonstrationViewer from '../../components/ExerciseDemonstrationViewer';
import MotionPressable from '../../components/MotionPressable';
import Button from '../../components/Button';
import ExerciseVariationSheet from './ExerciseVariationSheet';
import EquipmentGuideSheet from '../../components/EquipmentGuideSheet';
import FormTipsCarousel from '../../components/FormTipsCarousel';
import { typography, spacing, radius } from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';
import { useAppTheme } from '../../context/ThemeContext';
import useThemedStyles from '../../theme/useThemedStyles';
import { exercises } from '../../data/exercises';
import {
  buildLegacyExerciseFallback,
  buildVariationExercise,
  getExerciseVariations,
  getSelectedVariation,
  resolveExerciseFamily,
} from '../../data/exerciseVariations';

export default function ExerciseDetailScreen({ route, navigation }) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
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
  const [equipmentGuideVisible, setEquipmentGuideVisible] = useState(false);

  // F03: Inherit guidance level from user preferences (defaulting to beginner)
  const userGuidanceLevel = user?.preferences?.guidanceLevel || 'beginner';

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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
          compact
        />

        {hasVariations && (
          <MotionPressable
            style={styles.variationSelector}
            onPress={openVariationPicker}
            accessibilityRole="button"
            accessibilityLabel={`Change variation. Current selection: ${selectedExercise.name}`}
            accessibilityHint="Opens a list of available variations"
          >
            <View style={styles.variationSelectorIcon}>
              <Ionicons name="swap-horizontal" size={20} color={colors.accent} />
            </View>
            <View style={styles.variationSelectorCopy}>
              <View style={styles.variationSelectorEyebrowRow}>
                <Text style={styles.variationSelectorEyebrow}>Current variation</Text>
                {selectedVariation?.isDefault && (
                  <Text style={styles.variationSelectorRecommended}>Recommended</Text>
                )}
              </View>
              <Text style={styles.variationSelectorTitle} numberOfLines={2}>{selectedExercise.name}</Text>
              <Text style={styles.variationSelectorMeta}>{variations.length} options available</Text>
            </View>
            <View style={styles.variationSelectorChevron}>
              <Ionicons name="chevron-forward" size={18} color={colors.textPrimary} />
            </View>
          </MotionPressable>
        )}

        <View style={styles.statsRow}>
          <MotionPressable
            style={[styles.statBadge, styles.equipmentBadge]}
            onPress={() => setEquipmentGuideVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={`View equipment guide for ${selectedExercise.equipment}`}
          >
            <Ionicons name="fitness" size={16} color={colors.accent} />
            <Text style={[styles.statText, styles.equipmentText]}>{selectedExercise.equipment}</Text>
          </MotionPressable>
          <View style={[styles.statBadge, styles.difficultyBadge]}>
            <Ionicons name="speedometer" size={16} color={colors.performance} />
            <Text style={[styles.statText, styles.difficultyText]}>{selectedExercise.difficulty}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>{hasVariations ? 'Variation details' : 'Exercise details'}</Text>
          <Text style={styles.sectionTitle}>
            {hasVariations ? 'About this variation' : selectedExercise.name}
          </Text>

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

          <FormTipsCarousel
            exerciseName={selectedExercise.name}
            guidanceLevel={userGuidanceLevel}
          />

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

      </ScrollView>

      <View style={styles.bottomAction}>
        <Button
          title="Add to Plan"
          onPress={() => navigation.navigate('AddToPlan', { exercise: selectedExercise })}
        />
      </View>

      {equipmentGuideVisible && (
        <EquipmentGuideSheet
          visible={equipmentGuideVisible}
          equipmentName={selectedExercise.equipment}
          exerciseName={selectedExercise.name}
          onClose={() => setEquipmentGuideVisible(false)}
        />
      )}

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

const createStyles = (colors) => ({
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
  contentContainer: { paddingHorizontal: spacing.screen, paddingTop: spacing.md, paddingBottom: spacing.md },
  variationSelector: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceWarm,
  },
  variationSelectorIcon: {
    width: 40,
    height: 40,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.control,
    borderCurve: 'continuous',
    backgroundColor: colors.accentLight,
  },
  variationSelectorCopy: { flex: 1, minWidth: 0 },
  variationSelectorEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  variationSelectorEyebrow: {
    ...typography.metaSmall,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  variationSelectorRecommended: { ...typography.metaSmall, color: colors.accent },
  variationSelectorTitle: { ...typography.cardTitle, color: colors.textPrimary },
  variationSelectorMeta: {
    ...typography.metaSmall,
    color: colors.textSecondary,
    marginTop: spacing.micro,
  },
  variationSelectorChevron: {
    width: 32,
    height: 32,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.chip,
    backgroundColor: colors.surface,
  },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.lg },
  statBadge: {
    minHeight: 44, maxWidth: '100%', flexDirection: 'row', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    borderRadius: radius.control, alignItems: 'center', gap: spacing.xs,
  },
  equipmentBadge: { backgroundColor: colors.accentLight },
  difficultyBadge: { backgroundColor: colors.performanceSoft },
  statText: { ...typography.caption, flexShrink: 1 },
  equipmentText: { color: colors.accent },
  difficultyText: { color: colors.performance },
  section: { marginBottom: spacing.lg },
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
  variationCard: {
    backgroundColor: colors.surface, borderRadius: radius.card, padding: spacing.md,
    borderWidth: 1, borderColor: colors.hairline, marginTop: spacing.md,
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
  instructionsCard: {
    backgroundColor: colors.surface, borderRadius: radius.card, padding: spacing.md,
    borderWidth: 1, borderColor: colors.hairline, marginTop: spacing.md,
  },
  instructionRow: { flexDirection: 'row', marginBottom: spacing.md, alignItems: 'flex-start' },
  lastInstructionRow: { marginBottom: 0 },
  stepNumber: {
    width: 28, height: 28, flexShrink: 0, borderRadius: radius.control, backgroundColor: colors.ink,
    justifyContent: 'center', alignItems: 'center', marginRight: spacing.md, marginTop: radius.subtle,
  },
  stepNumberText: { ...typography.action, color: colors.background },
  instructionText: { ...typography.body, flex: 1, color: colors.textSecondary },
  bottomAction: {
    paddingHorizontal: spacing.screen, paddingTop: spacing.sm, paddingBottom: spacing.sm,
    backgroundColor: colors.canvas, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border,
  },
});
