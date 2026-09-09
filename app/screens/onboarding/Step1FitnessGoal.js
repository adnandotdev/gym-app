import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import Button from '../../components/Button';
import { typography, spacing } from '../../theme/colors';
import { useAppTheme } from '../../context/ThemeContext';
import useThemedStyles from '../../theme/useThemedStyles';

const Step1FitnessGoal = ({ navigation }) => {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const { onboardingData, updateField } = useContext(OnboardingContext);
  const selectedGoal = onboardingData.fitnessGoal;

  const handleSelect = (goal) => {
    updateField('fitnessGoal', goal);
  };

  const handleContinue = () => {
    if (selectedGoal) {
      navigation.navigate('Step2Gender');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader currentStep={1} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>What's your fitness goal?</Text>
          <Text style={styles.subtitle}>Choose the plan direction that should shape your training.</Text>
        </View>

        <View style={styles.cardsRow}>
          {/* Card 1: Weight Loss */}
          <TouchableOpacity
            style={[
              styles.goalCard,
              selectedGoal === 'Weight Loss' && styles.selectedGoalCard,
            ]}
            onPress={() => handleSelect('Weight Loss')}
            activeOpacity={0.8}
          >
            <View style={styles.goalImageFrame}>
              <Ionicons name="walk-outline" size={48} color={colors.primary} />
            </View>
            <Text style={styles.cardLabel}>Weight Loss</Text>
          </TouchableOpacity>

          {/* Card 2: Muscle Build */}
          <TouchableOpacity
            style={[
              styles.goalCard,
              selectedGoal === 'Muscle Build' && styles.selectedGoalCard,
            ]}
            onPress={() => handleSelect('Muscle Build')}
            activeOpacity={0.8}
          >
            <View style={styles.goalImageFrame}>
              <Ionicons name="barbell-outline" size={48} color={colors.primary} />
            </View>
            <Text style={styles.cardLabel}>Muscle Build</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Continue button at bottom */}
      <View style={styles.footer}>
        <Button
          title="CONTINUE"
          onPress={handleContinue}
          disabled={!selectedGoal}
          style={styles.continueButton}
        />
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.parchment,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  header: {
    marginBottom: spacing.screen,
  },
  title: {
    ...typography.displayLarge,
    color: colors.accentFocus,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  goalCard: {
    width: '47%',
    minHeight: 156,
    backgroundColor: colors.canvas,
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  selectedGoalCard: {
    borderColor: colors.accent,
    backgroundColor: colors.goldLightest,
  },
  goalImageFrame: {
    width: '100%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: colors.accentLight,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  footer: {
    flexShrink: 0,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.screen,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  continueButton: {
    backgroundColor: colors.accent,
  },
});

export default Step1FitnessGoal;
