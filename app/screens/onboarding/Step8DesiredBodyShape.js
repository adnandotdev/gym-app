import React, { useContext, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import BodyShapeOptions, { BODY_SHAPE_OPTIONS } from './BodyShapeOptions';
import Button from '../../components/Button';
import { spacing, radius, typography } from '../../theme/colors';
import { useAppTheme } from '../../context/ThemeContext';
import useThemedStyles from '../../theme/useThemedStyles';

export default function Step8DesiredBodyShape({ navigation }) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const { onboardingData, updateField } = useContext(OnboardingContext);
  const [localShape, setLocalShape] = useState(onboardingData.desiredBodyShape || 3);
  const currentLabel = BODY_SHAPE_OPTIONS.find((option) => option.value === onboardingData.currentBodyShape)?.label || 'Average';
  const handleContinue = () => {
    updateField('desiredBodyShape', localShape);
    navigation.navigate('Step9TargetWeight');
  };
  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader currentStep={8} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Your preferred build</Text>
          <Text style={styles.subtitle}>Choose what you would like to work toward. Maintaining your current build is a valid goal too.</Text>
        </View>
        <View style={styles.currentChoice}>
          <Text style={styles.currentLabel}>Current build</Text><Text style={styles.currentValue}>{currentLabel}</Text>
        </View>
        <BodyShapeOptions value={localShape} onChange={setLocalShape} />
      </ScrollView>
      <View style={styles.footer}><Button title="CONTINUE" onPress={handleContinue} /></View>
    </SafeAreaView>
  );
}

const createStyles = (colors) => ({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { flexGrow: 1, paddingHorizontal: spacing.screen, paddingVertical: spacing.lg },
  header: { marginBottom: spacing.lg, gap: spacing.xs },
  title: { ...typography.screenTitle, color: colors.textPrimary, textAlign: 'center' },
  subtitle: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  currentChoice: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.xs, padding: spacing.sm, backgroundColor: colors.surfaceWarm, borderRadius: radius.control, marginBottom: spacing.md },
  currentLabel: { ...typography.caption, color: colors.textSecondary },
  currentValue: { ...typography.cardTitle, color: colors.textPrimary },
  footer: { flexShrink: 0, paddingHorizontal: spacing.screen, paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.hairline },
});
