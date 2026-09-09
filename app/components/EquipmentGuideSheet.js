import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import MotionPressable from './MotionPressable';
import Button from './Button';
import { radius, spacing, typography } from '../theme/colors';
import { useAppTheme } from '../context/ThemeContext';
import useThemedStyles from '../theme/useThemedStyles';
import { getEquipmentById, normalizeEquipmentAlias } from '../data/taxonomies';

export default function EquipmentGuideSheet({
  visible,
  equipmentName, // The raw string from the legacy exercise data
  exerciseName,
  onClose,
}) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const normalizedId = normalizeEquipmentAlias(equipmentName);
  const equipment = normalizedId ? getEquipmentById(normalizedId) : null;

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
            <Text style={styles.title}>Equipment Guide</Text>
            <Text style={styles.subtitle}>
              For {exerciseName}
            </Text>
          </View>
          <MotionPressable
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close equipment guide"
          >
            <Ionicons name="close" size={22} color={colors.textPrimary} />
          </MotionPressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {equipment ? (
            <View style={styles.guideCard}>
              <View style={styles.equipmentTitleRow}>
                <Ionicons name="fitness" size={24} color={colors.accent} />
                <Text style={styles.equipmentName}>{equipment.name}</Text>
              </View>
              <Text style={styles.equipmentCategory}>Category: {equipment.category}</Text>

              <Text style={styles.sectionHeader}>Setup Steps</Text>
              <View style={styles.instructionRow}>
                <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
                <Text style={styles.instructionText}>Identify the {equipment.name.toLowerCase()} and inspect it for obvious damage.</Text>
              </View>
              <View style={styles.instructionRow}>
                <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
                <Text style={styles.instructionText}>Adjust the equipment to fit your body size. Follow manufacturer placards if unsure.</Text>
              </View>
              <View style={styles.instructionRow}>
                <View style={styles.stepNumber}><Text style={styles.stepNumberText}>3</Text></View>
                <Text style={styles.instructionText}>Choose a load you can control comfortably before starting the set.</Text>
              </View>

              <Text style={styles.sectionHeader}>Safety Checks</Text>
              <Text style={styles.instructionText}>• Ensure pins are fully inserted (if applicable).</Text>
              <Text style={styles.instructionText}>• Clear the immediate area of obstacles.</Text>

            </View>
          ) : (
            <View style={styles.fallbackCard}>
              <Ionicons name="warning-outline" size={32} color={colors.textSecondary} />
              <Text style={styles.fallbackTitle}>Guide not available yet</Text>
              <Text style={styles.fallbackText}>
                We don't have an approved setup guide for "{equipmentName}" right now. Please follow general safety precautions.
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button title="Ready to Workout" onPress={onClose} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const createStyles = (colors) => ({
  container: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    paddingHorizontal: spacing.screen, paddingTop: spacing.md, paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.hairline,
  },
  headerCopy: { flex: 1, minWidth: 0 },
  title: { ...typography.screenTitle, color: colors.textPrimary },
  subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.micro },
  closeButton: {
    width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.control, backgroundColor: colors.surfaceWarm,
  },
  listContent: { paddingHorizontal: spacing.screen, paddingVertical: spacing.md },
  guideCard: {
    backgroundColor: colors.surfaceWarm, padding: spacing.md, borderRadius: radius.card,
    borderWidth: 1, borderColor: colors.hairline,
  },
  equipmentTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  equipmentName: { ...typography.cardTitle, color: colors.textPrimary, flex: 1 },
  equipmentCategory: { ...typography.metaSmall, color: colors.textSecondary, textTransform: 'capitalize' },
  sectionHeader: { ...typography.action, color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.md },
  instructionRow: { flexDirection: 'row', marginBottom: spacing.md, alignItems: 'flex-start' },
  stepNumber: {
    width: 24, height: 24, flexShrink: 0, borderRadius: radius.control, backgroundColor: colors.ink,
    justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm, marginTop: 2,
  },
  stepNumberText: { ...typography.metaSmall, color: colors.background, fontWeight: 'bold' },
  instructionText: { ...typography.body, flex: 1, color: colors.textSecondary, marginBottom: spacing.xs },
  fallbackCard: {
    backgroundColor: colors.surfaceWarm, padding: spacing.xl, borderRadius: radius.card,
    alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
  },
  fallbackTitle: { ...typography.cardTitle, color: colors.textPrimary, textAlign: 'center' },
  fallbackText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  footer: {
    paddingHorizontal: spacing.screen, paddingTop: spacing.sm, paddingBottom: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.hairline,
    backgroundColor: colors.surface,
  },
});
