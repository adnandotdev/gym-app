import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import Button from '../../components/Button';

const Step12Equipment = ({ navigation }) => {
  const { onboardingData, updateField } = useContext(OnboardingContext);
  const selectedEquipment = onboardingData.equipment;

  const handleSelect = (equipment) => {
    updateField('equipment', equipment);
  };

  const handleContinue = () => {
    if (selectedEquipment) {
      navigation.navigate('Step13Injuries');
    }
  };

  const options = [
    {
      id: 'Bodyweight',
      label: 'Bodyweight',
      description: 'Bodyweight training. Ideal for workouts at home or while traveling with no gear.',
      color: '#A7F3D0', // Light green placeholder
    },
    {
      id: 'Portable',
      label: 'Portable',
      description: 'Dumbbells, kettlebells, resistance bands, etc. Great for a versatile home setup.',
      color: '#CFC4B3', // Grey placeholder
    },
    {
      id: 'Gym',
      label: 'Gym',
      description: 'Smith machine, barbells, cable towers, leg press, etc. Full access to professional gym gear.',
      color: '#374151', // Dark placeholder
      textColor: '#FFFCF5', // contrast label inside placeholder
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader currentStep={12} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose your preferred training equipment</Text>
          <Text style={styles.subtitle}>We provide various exercises catering to a variety of equipment</Text>
        </View>

        <View style={styles.optionsContainer}>
          {options.map((opt) => {
            const isSelected = selectedEquipment === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.equipmentCard,
                  isSelected && styles.selectedEquipmentCard,
                ]}
                onPress={() => handleSelect(opt.id)}
                activeOpacity={0.8}
              >
                <View style={styles.textContainer}>
                  <Text style={[
                    styles.cardLabel,
                    isSelected && styles.selectedCardLabel,
                  ]}>
                    {opt.label}
                  </Text>
                  <Text style={[
                    styles.cardDesc,
                    isSelected && styles.selectedCardDesc,
                  ]}>
                    {opt.description}
                  </Text>
                </View>

                {/* Styled colored placeholder rect on right */}
                <View style={[styles.placeholderRect, { backgroundColor: opt.color }]}>
                  <Text style={[styles.placeholderText, opt.textColor ? { color: opt.textColor } : null]}>
                    {opt.label.charAt(0)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Continue button at bottom */}
      <View style={styles.footer}>
        <Button
          title="CONTINUE"
          onPress={handleContinue}
          disabled={!selectedEquipment}
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
    fontSize: 26,
    fontWeight: '700',
    color: '#17140F',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: '#82786A',
    textAlign: 'center',
    lineHeight: 20,
  },
  optionsContainer: {
    width: '100%',
  },
  equipmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0E9DC',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#CFC4B3',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  selectedEquipmentCard: {
    backgroundColor: '#2F4A3C',
    borderColor: '#2F4A3C',
    shadowColor: '#2F4A3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#17140F',
    marginBottom: 4,
  },
  selectedCardLabel: {
    color: '#17140F',
  },
  cardDesc: {
    fontSize: 13,
    color: '#82786A',
    lineHeight: 18,
    fontWeight: '500',
  },
  selectedCardDesc: {
    color: '#17140F',
    opacity: 0.8,
  },
  placeholderRect: {
    width: 68,
    height: 68,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  placeholderText: {
    color: '#17140F',
    fontWeight: '700',
    fontSize: 22,
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

export default Step12Equipment;
