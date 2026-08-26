import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingContext } from '../../context/OnboardingContext';
import { AuthContext } from '../../context/AuthContext';
import OnboardingHeader from './OnboardingHeader';
import Button from '../../components/Button';

const Step2Gender = ({ navigation }) => {
  const { onboardingData, updateField } = useContext(OnboardingContext);
  const { logout } = useContext(AuthContext);
  const selectedGender = onboardingData.gender;

  const handleSelect = (gender) => {
    updateField('gender', gender);
  };

  const handleContinue = () => {
    if (selectedGender) {
      navigation.navigate('Step3FitnessLevel');
    }
  };

  const handleLogout = async () => {
    await logout();
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
                {opt.id === 'Male' ? (
                  <Image source={require('../../../assets/images/onboarding/gender-male.png')} style={styles.avatarImage} />
                ) : opt.id === 'Female' ? (
                  <Image source={require('../../../assets/images/onboarding/gender-female.png')} style={styles.avatarImage} />
                ) : (
                  <Image source={require('../../../assets/images/onboarding/gender-neutral.png')} style={styles.avatarImage} />
                )}
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

        {/* Already have an account logout link */}
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.loginLink}
          activeOpacity={0.7}
        >
          <Text style={styles.loginLinkText}>
            Already have an account? <Text style={styles.underlineText}>Log in</Text>
          </Text>
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCF5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#17140F',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#82786A',
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0E9DC',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#CFC4B3',
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  selectedOptionRow: {
    borderColor: '#2F4A3C',
    backgroundColor: '#F4E3C9',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  selectedIconContainer: {
    backgroundColor: '#E6BE86',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#17140F',
    flex: 1,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#A79B88',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioOuter: {
    borderColor: '#2F4A3C',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2F4A3C',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 10,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#82786A',
    fontWeight: '500',
  },
  underlineText: {
    color: '#2F4A3C',
    fontWeight: '600',
    textDecorationLine: 'underline',
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

export default Step2Gender;
