import React, { useMemo } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import MotionPressable from '../../components/MotionPressable';
import Button from '../../components/Button';
import { colors, componentSizes, radius, spacing, typography } from '../../theme/colors';
import { VARIATION_GROUP_LABELS, VARIATION_GROUPS } from '../../data/exerciseVariations';
import { resolveExerciseDemonstration } from '../../data/exerciseDemonstrationImages';

const triggerSelectionHaptic = () => {
  void Haptics.selectionAsync().catch((error) => {
    console.warn('Haptic feedback was unavailable.', error);
  });
};

export default function ExerciseVariationSheet({
  visible,
  exerciseName,
  variations,
  selectedVariationId,
  onSelect,
  onConfirm,
  onClose,
}) {
  const groupedVariations = useMemo(
    () =>
      VARIATION_GROUPS.map((group) => ({
        group,
        items: variations.filter((variation) => variation.group === group),
      })).filter(({ items }) => items.length > 0),
    [variations],
  );

  const chooseVariation = (variation) => {
    if (variation.id === selectedVariationId) return;

    onSelect(variation);
    triggerSelectionHaptic();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={styles.container}
        edges={['top', 'bottom']}
        accessibilityViewIsModal
      >
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Choose Variation</Text>
            <Text style={styles.subtitle}>
              Select one version of {exerciseName}. You can add another afterward.
            </Text>
          </View>
          <MotionPressable
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close variation picker"
          >
            <Ionicons name="close" size={22} color={colors.textPrimary} />
          </MotionPressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.groups} accessibilityRole="radiogroup">
            {groupedVariations.map(({ group, items }) => (
              <View key={group} style={styles.group}>
                <Text style={styles.groupTitle}>{VARIATION_GROUP_LABELS[group]}</Text>
                <View style={styles.groupCard}>
                {items.map((variation, index) => {
                  const selected = variation.id === selectedVariationId;
                  const demonstration = resolveExerciseDemonstration(
                    variation.id,
                    variation.familyId,
                    'male',
                  );

                  return (
                    <MotionPressable
                      key={variation.id}
                      style={[
                        styles.variationRow,
                        index < items.length - 1 && styles.variationRowDivider,
                        selected && styles.variationRowSelected,
                      ]}
                      onPress={() => chooseVariation(variation)}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: selected }}
                      accessibilityLabel={`${variation.name}. ${variation.equipment}. ${variation.summary}`}
                    >
                      {demonstration && (
                        <Image
                          source={demonstration.start}
                          style={styles.variationThumbnail}
                          resizeMode="cover"
                          accessible={false}
                          importantForAccessibility="no"
                        />
                      )}
                      <View style={styles.variationCopy}>
                        <View style={styles.variationTitleRow}>
                          <Text style={styles.variationTitle}>{variation.name}</Text>
                          {variation.isDefault && (
                            <Text style={styles.recommendedLabel}>Recommended</Text>
                          )}
                        </View>
                        <Text style={styles.variationSummary}>{variation.summary}</Text>
                        <Text style={styles.variationMeta}>
                          {variation.equipment} · {variation.primaryMuscles.join(', ')}
                        </Text>
                      </View>
                      <Ionicons
                        name={selected ? 'radio-button-on' : 'radio-button-off'}
                        size={22}
                        color={selected ? colors.accent : colors.borderStrong}
                      />
                    </MotionPressable>
                  );
                  })}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button title="Use Selected Variation" onPress={onConfirm} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...typography.screenTitle,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.micro,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.control,
    backgroundColor: colors.surfaceWarm,
  },
  listContent: {
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.lg,
  },
  groups: {
    gap: spacing.lg,
  },
  group: {
    gap: spacing.xs,
  },
  groupTitle: {
    ...typography.metaSmall,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  groupCard: {
    backgroundColor: colors.surfaceWarm,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  variationRow: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  variationRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  variationRowSelected: {
    backgroundColor: colors.selectedSoft,
  },
  variationCopy: {
    flex: 1,
    minWidth: 0,
  },
  variationThumbnail: {
    width: 84,
    aspectRatio: 4 / 3,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
  },
  variationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  variationTitle: {
    ...typography.action,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  recommendedLabel: {
    ...typography.metaSmall,
    color: colors.accent,
  },
  variationSummary: {
    ...typography.caption,
    color: colors.bodySecondary,
    marginTop: spacing.micro,
  },
  variationMeta: {
    ...typography.metaSmall,
    color: colors.textSecondary,
    marginTop: spacing.micro,
  },
  footer: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
    backgroundColor: colors.surface,
    minHeight: componentSizes.primaryButtonHeight + spacing.lg,
  },
});
