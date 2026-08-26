import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import Button from '../../components/Button';
import { colors, typography } from '../../theme/colors';

const Step1FitnessGoal = ({ navigation }) => {
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

  const goalImages = {
    'Weight Loss': require('../../../assets/images/onboarding/goal-weight-loss.png'),
    'Muscle Build': require('../../../assets/images/onboarding/goal-muscle-build.png'),
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
              <Image
                source={goalImages['Weight Loss']}
                style={styles.goalImage}
                resizeMode="cover"
              />
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
              <Image
                source={goalImages['Muscle Build']}
                style={styles.goalImage}
                resizeMode="cover"
              />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.parchment,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 36,
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
    height: 180,
    backgroundColor: colors.canvas,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  selectedGoalCard: {
    borderColor: colors.accent,
    backgroundColor: colors.goldLightest,
    borderColor: colors.gold,
  },
  goalImageFrame: {
    width: '100%',
    height: 108,
    borderRadius: 12,
    backgroundColor: colors.accentLight,
    marginBottom: 16,
    overflow: 'hidden',
  },
  goalImage: {
    width: '100%',
    height: '100%',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  continueButton: {
    backgroundColor: colors.accent,
  },
});

export default Step1FitnessGoal;
