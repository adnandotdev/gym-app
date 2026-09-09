import React, { useContext, useRef, useState } from 'react';
import { ActivityIndicator, Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import Button from '../../components/Button';
import { radius, spacing, typography } from '../../theme/colors';
import { useAppTheme } from '../../context/ThemeContext';
import useThemedStyles from '../../theme/useThemedStyles';

const INJURY_OPTIONS = [
  { id: 'No injuries', label: 'No injuries', icon: 'shield-checkmark-outline' },
  { id: 'Shoulders', label: 'Shoulders', icon: 'body-outline' },
  { id: 'Back', label: 'Back', icon: 'body-outline' },
  { id: 'Waist', label: 'Waist', icon: 'body-outline' },
  { id: 'Wrist', label: 'Wrist', icon: 'hand-left-outline' },
  { id: 'Knee', label: 'Knee', icon: 'walk-outline' },
];

export default function Step13Injuries({ navigation }) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const { onboardingData, updateField, submitOnboarding } = useContext(OnboardingContext);
  const [selectedInjuries, setSelectedInjuries] = useState(onboardingData.injuries || []);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const handleSelectInjury = (id) => {
    setSelectedInjuries((current) => {
      if (id === 'No injuries') return current.includes(id) ? [] : ['No injuries'];
      const withoutNone = current.filter((item) => item !== 'No injuries');
      return withoutNone.includes(id) ? withoutNone.filter((item) => item !== id) : [...withoutNone, id];
    });
  };

  const handleFinish = async () => {
    updateField('injuries', selectedInjuries);
    setIsSaving(true);
    const result = await submitOnboarding({ injuries: selectedInjuries });
    setIsSaving(false);
    if (!result?.success) return;
    setShowSuccess(true);
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 40, friction: 6, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader currentStep={13} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Have you suffered any injuries recently?</Text>
          <Text style={styles.subtitle}>Select every area that needs extra care. This helps personalize suggestions and is not a medical diagnosis.</Text>
        </View>
        <View style={styles.grid}>
          {INJURY_OPTIONS.map((option) => {
            const selected = selectedInjuries.includes(option.id);
            return (
              <TouchableOpacity key={option.id} style={[styles.card, selected && styles.selectedCard]} onPress={() => handleSelectInjury(option.id)} activeOpacity={0.8} accessibilityRole="checkbox" accessibilityState={{ checked: selected }} accessibilityLabel={option.label}>
                <View style={[styles.injuryIcon, selected && styles.selectedInjuryIcon]}>
                  <Ionicons name={option.icon} size={32} color={selected ? colors.accentOnDark : colors.primary} />
                </View>
                <View style={styles.cardFooter}>
                  <Text style={[styles.cardLabel, selected && styles.selectedLabel]}>{option.label}</Text>
                  <Ionicons name={selected ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={selected ? colors.primary : colors.borderStrong} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}><Button title="FINISH" onPress={handleFinish} disabled={selectedInjuries.length === 0} /></View>

      {isSaving && <View style={styles.loadingOverlay}><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.loadingText}>Tailoring your training profile...</Text></View>}
      {showSuccess && (
        <Animated.View style={[styles.successOverlay, { opacity: opacityAnim }]}>
          <Animated.View style={[styles.successCard, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.successIcon}><Ionicons name="checkmark" size={54} color={colors.accentOnDark} /></View>
            <Text style={styles.successTitle}>Profile created</Text>
            <Text style={styles.successSubtitle}>Let’s begin your fitness journey with LiftSutra.</Text>
          </Animated.View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors) => ({
  container: { flex: 1, backgroundColor: colors.canvas },
  scrollContent: { flexGrow: 1, paddingHorizontal: spacing.screen, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  header: { gap: spacing.xs, marginBottom: spacing.md },
  title: { ...typography.screenTitle, color: colors.ink, textAlign: 'center' },
  subtitle: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  card: { width: '48%', height: 168, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, borderRadius: radius.card, borderCurve: 'continuous', backgroundColor: colors.surfaceWarm, padding: spacing.xs },
  selectedCard: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  injuryIcon: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: radius.control, backgroundColor: colors.primarySoft },
  selectedInjuryIcon: { backgroundColor: colors.primary },
  cardFooter: { minHeight: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.micro },
  cardLabel: { ...typography.caption, fontFamily: typography.cardTitle.fontFamily, color: colors.textSecondary },
  selectedLabel: { color: colors.textPrimary },
  footer: { flexShrink: 0, backgroundColor: colors.canvas, paddingHorizontal: spacing.screen, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.hairline },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.canvas, alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  loadingText: { ...typography.body, fontFamily: typography.cardTitle.fontFamily, color: colors.ink, marginTop: spacing.md },
  successOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.scrim, alignItems: 'center', justifyContent: 'center', zIndex: 200, paddingHorizontal: spacing.xl },
  successCard: { width: '100%', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 24, padding: spacing.xl },
  successIcon: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, marginBottom: spacing.lg },
  successTitle: { ...typography.displayLarge, color: colors.ink, marginBottom: spacing.xs },
  successSubtitle: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
});
