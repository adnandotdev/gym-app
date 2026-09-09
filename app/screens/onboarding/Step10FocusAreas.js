import React, { useContext, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import Button from '../../components/Button';
import OnboardingFocusModel from '../../components/OnboardingFocusModel';
import { radius, spacing, typography } from '../../theme/colors';
import { useAppTheme } from '../../context/ThemeContext';
import useThemedStyles from '../../theme/useThemedStyles';

const FOCUS_OPTIONS = [
  { id: 'Chest', label: 'Chest' }, { id: 'Back', label: 'Back' },
  { id: 'Arms', label: 'Arms' }, { id: 'Abs', label: 'Abs' },
  { id: 'Glutes', label: 'Glutes' }, { id: 'Legs', label: 'Legs' },
  { id: 'Full Body', label: 'Full body' },
];

const normalizeFocusAreas = (areas = []) => {
  const validIds = FOCUS_OPTIONS.map((option) => option.id);
  const normalized = areas
    .map((area) => (area === 'Leg' ? 'Legs' : area))
    .filter((area) => validIds.includes(area));

  if (normalized.includes('Full Body')) return ['Full Body'];
  return [...new Set(normalized)];
};

export default function Step10FocusAreas({ navigation }) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const { onboardingData, updateField } = useContext(OnboardingContext);
  const [selectedAreas, setSelectedAreas] = useState(() => normalizeFocusAreas(onboardingData.focusAreas));

  const handleSelectArea = (areaId) => {
    setSelectedAreas((current) => {
      if (areaId === 'Full Body') return current.includes(areaId) ? [] : ['Full Body'];
      const withoutFullBody = current.filter((area) => area !== 'Full Body');
      return withoutFullBody.includes(areaId)
        ? withoutFullBody.filter((area) => area !== areaId)
        : [...withoutFullBody, areaId];
    });
  };

  const handleContinue = () => {
    updateField('focusAreas', selectedAreas);
    navigation.navigate('Step11TrainingDays');
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader currentStep={10} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Which areas do you want to focus on?</Text>
          <Text style={styles.subtitle}>Select one or more areas for more relevant workout suggestions.</Text>
        </View>
        <View style={styles.splitRow}>
          <View
            style={styles.bodyColumn}
          >
            <View style={styles.modelContainer}>
              <OnboardingFocusModel gender={onboardingData.gender} selectedAreas={selectedAreas} />
            </View>
          </View>

          <View style={styles.pillsColumn}>
            {FOCUS_OPTIONS.map((option) => {
              const selected = selectedAreas.includes(option.id);
              return (
                <View key={option.id} style={styles.pillContainer}>
                  <View style={styles.dottedConnector} />
                  <TouchableOpacity
                    style={[styles.pillButton, selected && styles.pillButtonActive]}
                    onPress={() => handleSelectArea(option.id)}
                    activeOpacity={0.8}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selected }}
                    accessibilityLabel={option.label}
                  >
                    <Text style={[styles.pillLabel, selected && styles.pillLabelActive]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}><Button title="CONTINUE" onPress={handleContinue} disabled={selectedAreas.length === 0} /></View>
    </SafeAreaView>
  );
}

const createStyles = (colors) => ({
  container: { flex: 1, backgroundColor: colors.canvas },
  scrollContent: { flexGrow: 1, paddingHorizontal: spacing.screen, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  header: { gap: spacing.xs, marginBottom: spacing.md },
  title: { ...typography.screenTitle, color: colors.ink, textAlign: 'center' },
  subtitle: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  splitRow: { flex: 1, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bodyColumn: { width: '44%', alignItems: 'center', justifyContent: 'center' },
  modelContainer: { width: '100%', padding: spacing.xs, backgroundColor: colors.surfaceWarm, borderRadius: radius.card, borderCurve: 'continuous', borderWidth: 1, borderColor: colors.border },
  pillsColumn: { width: '53%', justifyContent: 'center' },
  pillContainer: { width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  dottedConnector: { flex: 1, height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: colors.borderStrong, marginRight: spacing.xs },
  pillButton: { width: '78%', minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.sm, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceWarm, borderRadius: radius.control, borderCurve: 'continuous' },
  pillButtonActive: { borderColor: colors.danger, backgroundColor: colors.dangerSoft },
  pillLabel: { ...typography.caption, fontFamily: typography.cardTitle.fontFamily, color: colors.textSecondary, textAlign: 'center' },
  pillLabelActive: { color: colors.danger },
  footer: { flexShrink: 0, backgroundColor: colors.canvas, paddingHorizontal: spacing.screen, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.hairline },
});
