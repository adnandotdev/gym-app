import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import Button from '../../components/Button';

const Step11TrainingDays = ({ navigation }) => {
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

        {/* 7 Day Grid */}
        <View style={styles.gridContainer}>
          {/* Top Row: Sun, Mon, Tue */}
          <View style={styles.row}>
            {days.slice(0, 3).map((day) => {
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
                >
                  {isToday && (
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayBadgeText}>TODAY</Text>
                    </View>
                  )}
                  <Text style={[styles.dayLabel, isSelected && styles.dayLabelActive]}>{day.label}</Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={16} color="#17140F" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bottom Row: Wed, Thu, Fri, Sat */}
          <View style={styles.row}>
            {days.slice(3).map((day) => {
              const isSelected = selectedDays.includes(day.key);
              const isToday = day.index === todayIndex;
              return (
                <TouchableOpacity
                  key={day.key}
                  style={[
                    styles.dayButton,
                    styles.dayButtonFour,
                    isSelected && styles.dayButtonActive,
                  ]}
                  onPress={() => handleToggleDay(day.key)}
                  activeOpacity={0.8}
                >
                  {isToday && (
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayBadgeText}>TODAY</Text>
                    </View>
                  )}
                  <Text style={[styles.dayLabel, isSelected && styles.dayLabelActive]}>{day.label}</Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={16} color="#17140F" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
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
            trackColor={{ false: '#A79B88', true: '#2F4A3C' }}
            thumbColor={reminder ? '#17140F' : '#F0E9DC'}
            ios_backgroundColor="#A79B88"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCF5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 44,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#17140F',
    textAlign: 'center',
    lineHeight: 34,
  },
  gridContainer: {
    width: '100%',
    marginBottom: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    width: '100%',
  },
  dayButton: {
    width: '30%',
    height: 72,
    backgroundColor: '#F0E9DC',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#CFC4B3',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  dayButtonFour: {
    width: '22%',
  },
  dayButtonActive: {
    backgroundColor: '#2F4A3C',
    borderColor: '#2F4A3C',
    shadowColor: '#2F4A3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#82786A',
  },
  dayLabelActive: {
    color: '#17140F',
    fontWeight: '700',
  },
  checkIcon: {
    position: 'absolute',
    bottom: 6,
    right: 6,
  },
  todayBadge: {
    position: 'absolute',
    top: -12,
    backgroundColor: '#17140F',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#FFFCF5',
  },
  todayBadgeText: {
    color: '#2F4A3C',
    fontSize: 8,
    fontWeight: '700',
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0E9DC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CFC4B3',
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
    color: '#17140F',
    marginBottom: 4,
  },
  reminderSubtitle: {
    fontSize: 13,
    color: '#82786A',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFCF5',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2D8C8',
    zIndex: 10,
  },
  continueButton: {
    backgroundColor: '#17140F',
    shadowColor: '#17140F',
  },
});

export default Step11TrainingDays;
