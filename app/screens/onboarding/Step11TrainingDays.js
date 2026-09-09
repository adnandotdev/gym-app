import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import Button from '../../components/Button';
import { spacing } from '../../theme/colors';
import { useAppTheme } from '../../context/ThemeContext';
import useThemedStyles from '../../theme/useThemedStyles';

const Step11TrainingDays = ({ navigation }) => {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const { onboardingData, updateField } = useContext(OnboardingContext);
  
  const [selectedDays, setSelectedDays] = useState(onboardingData.trainingDays || []);
  const [reminder, setReminder] = useState(onboardingData.trainingReminder || false);

  const days = [
    { key: 'Sun', label: 'Sun', index: 0 },
    { key: 'Mon', label: 'Mon', index: 1 },
    { key: 'Tue', label: 'Tue', index: 2 },
    { key: 'Wed', label: 'Wed', index: 3 },
    { key: 'Thu', label: 'Thu', index: 4 },
    { key: 'Fri', label: 'Fri', index: 5 },
    { key: 'Sat', label: 'Sat', index: 6 },
  ];

  // Check which day index is today
  const todayIndex = new Date().getDay();

  const handleToggleDay = (dayKey) => {
    if (selectedDays.includes(dayKey)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayKey));
    } else {
      setSelectedDays([...selectedDays, dayKey]);
    }
  };

  const handleContinue = () => {
    updateField('trainingDays', selectedDays);
    updateField('trainingReminder', reminder);
    navigation.navigate('Step12Equipment');
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader currentStep={11} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Which days of the week would you like to pick as training days?</Text>
        </View>

        {/* One balanced row keeps every weekday aligned. */}
        <View style={styles.gridContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysRow}>
            {days.map((day) => {
              const isSelected = selectedDays.includes(day.key);
              const isToday = day.index === todayIndex;
              return (
                <TouchableOpacity
                  key={day.key}
                  style={[
                    styles.dayButton,
                    isSelected && styles.dayButtonActive,
                  ]}
                  onPress={() => handleToggleDay(day.key)}
                  activeOpacity={0.8}
                  accessibilityRole="checkbox"
                  accessibilityLabel={`${day.label}${isToday ? ', today' : ''}`}
                  accessibilityState={{ checked: isSelected }}
                >
                  {isToday && <View style={styles.todayDot} />}
                  <Text style={[styles.dayLabel, isSelected && styles.dayLabelActive]}>{day.label}</Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={16} color={colors.ink} style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Reminder Toggle Card */}
        <View style={styles.reminderCard}>
          <View style={styles.cardText}>
            <Text style={styles.reminderTitle}>Training Reminder</Text>
            <Text style={styles.reminderSubtitle}>Never miss your training day!</Text>
          </View>
          <Switch
            value={reminder}
            onValueChange={setReminder}
            trackColor={{ false: colors.muted, true: colors.primary }}
            thumbColor={reminder ? colors.accentOnDark : colors.white}
            ios_backgroundColor={colors.muted}
            accessibilityLabel="Training reminder"
          />
        </View>
      </ScrollView>

      {/* Continue button at bottom */}
      <View style={styles.footer}>
        <Button
          title="CONTINUE"
          onPress={handleContinue}
          disabled={selectedDays.length === 0}
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
    fontSize: 26,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 34,
  },
  gridContainer: {
    width: '100%',
    marginBottom: spacing.screen,
  },
  daysRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: 1,
  },
  dayButton: {
    width: 48,
    height: 58,
    backgroundColor: colors.surfaceWarm,
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  dayButtonActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  dayLabelActive: {
    color: colors.ink,
    fontWeight: '700',
  },
  checkIcon: {
    position: 'absolute',
    bottom: 6,
    right: 6,
  },
  todayDot: {
    position: 'absolute',
    top: 7,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceWarm,
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardText: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  reminderSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  footer: {
    flexShrink: 0,
    backgroundColor: colors.canvas,
    paddingHorizontal: spacing.screen,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    zIndex: 10,
  },
  continueButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.ink,
  },
});

export default Step11TrainingDays;
