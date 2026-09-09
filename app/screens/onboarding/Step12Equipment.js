import React, { useContext } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import Button from '../../components/Button';
import MotionPressable from '../../components/MotionPressable';
import { radius, spacing, typography } from '../../theme/colors';
import { useAppTheme } from '../../context/ThemeContext';
import useThemedStyles from '../../theme/useThemedStyles';

const EQUIPMENT_OPTIONS = [
  { id: 'Bodyweight', label: 'Bodyweight', description: 'Train anywhere using your own body weight—no equipment needed.', icon: 'body-outline' },
  { id: 'Portable', label: 'Portable equipment', description: 'Dumbbells, kettlebells, or resistance bands for a flexible setup.', icon: 'barbell-outline' },
  { id: 'Gym', label: 'Full gym', description: 'Machines, barbells, cable towers, benches, and other gym equipment.', icon: 'fitness-outline' },
];

export default function Step12Equipment({ navigation }) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const { onboardingData, updateField } = useContext(OnboardingContext);
  const selectedEquipment = onboardingData.equipment;

  const handleContinue = () => {
    if (selectedEquipment) navigation.navigate('Step13Injuries');
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader currentStep={12} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose your preferred training equipment</Text>
          <Text style={styles.subtitle}>We’ll use this to surface exercises you can actually perform.</Text>
        </View>
        <View style={styles.options} accessibilityRole="radiogroup">
          {EQUIPMENT_OPTIONS.map((option) => {
            const selected = selectedEquipment === option.id;
            return (
              <MotionPressable key={option.id} style={[styles.card, selected && styles.selectedCard]} onPress={() => updateField('equipment', option.id)} accessibilityRole="radio" accessibilityLabel={`${option.label}. ${option.description}`} accessibilityState={{ checked: selected }}>
                <View style={[styles.iconTile, selected && styles.selectedIconTile]}>
                  <Ionicons name={option.icon} size={24} color={selected ? colors.accentOnDark : colors.primary} />
                </View>
                <View style={styles.textColumn}>
                  <Text style={styles.cardTitle}>{option.label}</Text>
                  <Text style={styles.cardDescription}>{option.description}</Text>
                </View>
                <View style={[styles.radioOuter, selected && styles.selectedRadioOuter]}>{selected ? <View style={styles.radioInner} /> : null}</View>
              </MotionPressable>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}><Button title="CONTINUE" onPress={handleContinue} disabled={!selectedEquipment} /></View>
    </SafeAreaView>
  );
}

const createStyles = (colors) => ({
  container: { flex: 1, backgroundColor: colors.canvas },
  scrollContent: { flexGrow: 1, paddingHorizontal: spacing.screen, paddingTop: spacing.lg, paddingBottom: spacing.screen },
  header: { gap: spacing.xs, marginBottom: spacing.lg },
  title: { ...typography.screenTitle, color: colors.ink, textAlign: 'center' },
  subtitle: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  options: { gap: spacing.sm },
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 104, padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radius.card, borderCurve: 'continuous', backgroundColor: colors.surface },
  selectedCard: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  iconTile: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radius.control, borderCurve: 'continuous', backgroundColor: colors.primarySoft },
  selectedIconTile: { backgroundColor: colors.primary },
  textColumn: { flex: 1, gap: spacing.micro },
  cardTitle: { ...typography.cardTitle, color: colors.textPrimary },
  cardDescription: { ...typography.caption, color: colors.textSecondary },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  selectedRadioOuter: { borderColor: colors.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  footer: { flexShrink: 0, backgroundColor: colors.canvas, paddingHorizontal: spacing.screen, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.hairline },
});
