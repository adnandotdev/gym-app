import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '../../theme/colors';
import { useAppTheme } from '../../context/ThemeContext';
import useThemedStyles from '../../theme/useThemedStyles';
import BrandLogo from '../../components/BrandLogo';

const OnboardingHeader = ({ currentStep, navigation, onBackPress }) => {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  // Determine which of the 4 parts the current step belongs to
  const getPartForStep = (step) => {
    if (step <= 3) return 1;
    if (step <= 6) return 2;
    if (step <= 9) return 3;
    return 4;
  };

  const currentPart = getPartForStep(currentStep);

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* Upper Navigation Row */}
      <View style={styles.navRow}>
        <View style={styles.backButtonContainer}>
          {currentStep > 1 && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel="Previous step">
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
        </View>

        <BrandLogo />

        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar Row */}
      <View style={styles.progressBarRow}>
        {[1, 2, 3, 4].map((part) => {
          if (part < currentPart) {
            return (
              <View key={part} style={styles.segmentContainer}>
                <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
              </View>
            );
          } else if (part === currentPart) {
            return (
              <View key={part} style={styles.segmentContainer}>
                <View style={styles.activeDot} />
              </View>
            );
          } else {
            return (
              <View key={part} style={styles.segmentContainer}>
                <View style={styles.inactiveDot} />
              </View>
            );
          }
        })}
      </View>
    </View>
  );
};

const createStyles = (colors) => ({
  container: {
    backgroundColor: colors.canvas,
    paddingTop: spacing.micro,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen,
    height: 48,
  },
  backButtonContainer: {
    width: 44,
    alignItems: 'flex-start',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  placeholder: {
    width: 44,
  },
  progressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.micro,
  },
  segmentContainer: {
    marginHorizontal: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.chip,
  },
});

export default OnboardingHeader;
