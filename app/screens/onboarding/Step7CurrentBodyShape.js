import React, { useContext, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import BodyShapeOptions from './BodyShapeOptions';
import Button from '../../components/Button';
import { spacing, typography } from '../../theme/colors';
import { useAppTheme } from '../../context/ThemeContext';
import useThemedStyles from '../../theme/useThemedStyles';

export default function Step7CurrentBodyShape({ navigation }) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const { onboardingData, updateField } = useContext(OnboardingContext);
  const [localShape, setLocalShape] = useState(onboardingData.currentBodyShape || 3);
  const handleContinue = () => {
    updateField('currentBodyShape', localShape);
    navigation.navigate('Step8DesiredBodyShape');
  };
  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader currentStep={7} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Your current build</Text>
          <Text style={styles.subtitle}>Choose the description that feels closest to you. This is a preference, not a body-fat measurement.</Text>
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
  footer: { flexShrink: 0, paddingHorizontal: spacing.screen, paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.hairline },
});
