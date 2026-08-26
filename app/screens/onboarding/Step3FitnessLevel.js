import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import Button from '../../components/Button';

const Step3FitnessLevel = ({ navigation }) => {
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

  const levels = [
    {
      id: 'Beginner',
      label: 'Beginner',
      description: 'New to gym training or getting back after a break.',
      color: '#93C5FD', // Light blue placeholder
    },
    {
      id: 'Intermediate',
      label: 'Intermediate',
      description: 'Training consistently for 6+ months and know basic forms.',
      color: '#FB923C', // Orange placeholder
    },
    {
      id: 'Advanced',
      label: 'Advanced',
      description: 'Years of serious training and master of key exercises.',
      color: '#9B2F1D', // Red placeholder
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader currentStep={3} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>How would you rate your fitness level?</Text>
        </View>

        <View style={styles.levelsContainer}>
          {levels.map((lvl) => (
            <TouchableOpacity
              key={lvl.id}
              style={[
                styles.levelCard,
                selectedLevel === lvl.id && styles.selectedLevelCard,
              ]}
              onPress={() => handleSelect(lvl.id)}
              activeOpacity={0.8}
            >
              <View style={styles.textColumn}>
                <Text style={styles.levelLabel}>{lvl.label}</Text>
                <Text style={styles.levelDesc}>{lvl.description}</Text>
              </View>

              <View style={[styles.placeholderRect, { backgroundColor: lvl.color }]}>
                <Text style={styles.placeholderText}>{lvl.label.charAt(0)}</Text>
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
          disabled={!selectedLevel}
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
    marginBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#17140F',
    textAlign: 'center',
  },
  levelsContainer: {
    width: '100%',
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0E9DC',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#CFC4B3',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  selectedLevelCard: {
    borderColor: '#2F4A3C',
    backgroundColor: '#F4E3C9',
  },
  textColumn: {
    flex: 1,
    paddingRight: 16,
  },
  levelLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#17140F',
    marginBottom: 4,
  },
  levelDesc: {
    fontSize: 13,
    color: '#82786A',
    lineHeight: 18,
  },
  placeholderRect: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  placeholderText: {
    color: '#FFFCF5',
    fontWeight: '700',
    fontSize: 20,
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
  },
  continueButton: {
    backgroundColor: '#17140F',
    shadowColor: '#17140F',
  },
});

export default Step3FitnessLevel;
