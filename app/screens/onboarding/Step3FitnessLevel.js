import React, { useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import Button from '../../components/Button';
import MotionPressable from '../../components/MotionPressable';
import { radius, spacing, typography } from '../../theme/colors';
import { useAppTheme } from '../../context/ThemeContext';
import useThemedStyles from '../../theme/useThemedStyles';

const FITNESS_LEVELS = [
  {
    id: 'Beginner',
    label: 'Beginner',
    description: 'New to structured training or returning after a break.',
    icon: 'walk-outline',
  },
  {
    id: 'Intermediate',
    label: 'Intermediate',
    description: 'Training consistently for 6+ months with solid exercise form.',
    icon: 'fitness-outline',
  },
  {
    id: 'Advanced',
    label: 'Advanced',
    description: 'Training for years with confident form and programming experience.',
    icon: 'barbell-outline',
  },
];

const Step3FitnessLevel = ({ navigation }) => {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const { onboardingData, updateField } = useContext(OnboardingContext);
  const selectedLevel = onboardingData.fitnessLevel;

  const handleSelect = (level) => {
    updateField('fitnessLevel', level);
  };

  const handleContinue = () => {
    if (selectedLevel) {
      navigation.navigate('Step4Age');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader currentStep={3} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>How would you rate your fitness level?</Text>
          <Text style={styles.subtitle}>Choose the option that best matches your current training experience.</Text>
        </View>

        <View style={styles.levelsContainer} accessibilityRole="radiogroup">
          {FITNESS_LEVELS.map((level) => {
            const isSelected = selectedLevel === level.id;

            return (
              <MotionPressable
                key={level.id}
                style={[styles.levelCard, isSelected && styles.selectedLevelCard]}
                onPress={() => handleSelect(level.id)}
                accessibilityRole="radio"
                accessibilityLabel={`${level.label}. ${level.description}`}
                accessibilityState={{ selected: isSelected }}
              >
                <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
                  <Ionicons name={level.icon} size={24} color={isSelected ? colors.accentOnDark : colors.primary} />
                </View>

                <View style={styles.textColumn}>
                  <Text style={styles.levelLabel}>{level.label}</Text>
                  <Text style={styles.levelDesc}>{level.description}</Text>
                </View>

                <View style={[styles.radioOuter, isSelected && styles.selectedRadioOuter]}>
                  {isSelected ? <View style={styles.radioInner} /> : null}
                </View>
              </MotionPressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="CONTINUE"
          onPress={handleContinue}
          disabled={!selectedLevel}
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
    paddingBottom: spacing.screen,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.screenTitle,
    color: colors.ink,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  levelsContainer: {
    width: '100%',
    gap: spacing.sm,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 96,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  selectedLevelCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.control,
    borderCurve: 'continuous',
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIconContainer: {
    backgroundColor: colors.primary,
  },
  textColumn: {
    flex: 1,
    gap: spacing.micro,
  },
  levelLabel: {
    ...typography.cardTitle,
    color: colors.ink,
  },
  levelDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.borderStrong,
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
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
});

export default Step3FitnessLevel;
