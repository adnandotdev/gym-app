import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import Button from '../../components/Button';
import { spacing } from '../../theme/colors';
import { useAppTheme } from '../../context/ThemeContext';
import useThemedStyles from '../../theme/useThemedStyles';

const Step2Gender = ({ navigation }) => {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const { onboardingData, updateField } = useContext(OnboardingContext);
  const selectedGender = onboardingData.gender;

  const handleSelect = (gender) => {
    updateField('gender', gender);
  };

  const handleContinue = () => {
    if (selectedGender) {
      navigation.navigate('Step3FitnessLevel');
    }
  };

  const options = [
    { id: 'Male', label: 'Male' },
    { id: 'Female', label: 'Female' },
    { id: 'Prefer not to say', label: 'Prefer not to say' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader currentStep={2} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Let's Start with the Basics</Text>
          <Text style={styles.subtitle}>We'll tailor your plan based on your gender for better result</Text>
        </View>

        <View style={styles.optionsContainer}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={[
                styles.optionRow,
                selectedGender === opt.id && styles.selectedOptionRow,
              ]}
              onPress={() => handleSelect(opt.id)}
              activeOpacity={0.8}
            >
              <View style={[
                styles.iconContainer,
                selectedGender === opt.id && styles.selectedIconContainer,
              ]}>
                <Ionicons name={opt.id === 'Male' ? 'male-outline' : opt.id === 'Female' ? 'female-outline' : 'person-outline'} size={24} color={colors.primary} />
              </View>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <View style={[
                styles.radioOuter,
                selectedGender === opt.id && styles.selectedRadioOuter,
              ]}>
                {selectedGender === opt.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Continue button at bottom */}
      <View style={styles.footer}>
        <Button
          title="CONTINUE"
          onPress={handleContinue}
          disabled={!selectedGender}
          style={styles.continueButton}
        />
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
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
    fontSize: 28,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: spacing.screen,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceWarm,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  selectedOptionRow: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  selectedIconContainer: {
    backgroundColor: colors.primarySoft,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.ink,
    flex: 1,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioOuter: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  footer: {
    flexShrink: 0,
    backgroundColor: colors.canvas,
    paddingHorizontal: spacing.screen,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  continueButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.ink,
  },
});

export default Step2Gender;
