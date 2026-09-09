import React, { createContext, useState, useContext } from 'react';
import Toast from 'react-native-toast-message';
import { AuthContext } from './AuthContext';
import api from '../utils/api';

export const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
  const { updateUser } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-populate with defaults specified in requirements
  const [onboardingData, setOnboardingData] = useState({
    fitnessGoal: '',
    gender: '',
    fitnessLevel: '',
    age: 25,
    height: 170,
    heightUnit: 'cm',
    currentWeight: 70,
    weightUnit: 'kg',
    bmi: 24.2,
    currentBodyShape: 3,
    desiredBodyShape: 3,
    targetWeight: null,
    focusAreas: [],
    trainingDays: [],
    trainingReminder: false,
    equipment: '',
    injuries: [],
  });

  const updateField = (key, value) => {
    setOnboardingData((prev) => {
      const updated = { ...prev, [key]: value };
      
      // If updating height or weight (or their units), let's automatically recompute the BMI
      if (
        key === 'height' ||
        key === 'heightUnit' ||
        key === 'currentWeight' ||
        key === 'weightUnit'
      ) {
        let weightKg = updated.currentWeight;
        let heightCm = updated.height;

        // Convert weight to kg for BMI calculation if unit is LB
        if (updated.weightUnit.toLowerCase() === 'lb') {
          weightKg = updated.currentWeight * 0.45359237;
        }

        // Convert height to cm for BMI calculation if unit is FT
        if (updated.heightUnit.toLowerCase() === 'ft') {
          // Convert ft to inches, e.g. 5.6 ft -> 5 ft 7 in? Or just decimal ft?
          // Since default range is 3 to 7 feet, height holds decimal feet or inches
          // Let's assume standard decimal representation of feet: height in cm = height * 30.48
          heightCm = updated.height * 30.48;
        }

        if (heightCm > 0) {
          const heightM = heightCm / 100;
          const calculatedBmi = weightKg / (heightM * heightM);
          updated.bmi = parseFloat(calculatedBmi.toFixed(1));
        }
      }

      return updated;
    });
  };

  const submitOnboarding = async (overrides = {}) => {
    setIsSubmitting(true);
    try {
      const payload = { ...onboardingData, ...overrides };
      const response = await api.put('/auth/onboarding', payload);
      
      if (response.data && response.data.success) {
        // Sync the updated complete user object in AuthContext and AsyncStorage
        await updateUser(response.data.user);
        
        Toast.show({
          type: 'success',
          text1: 'Profile Setup Complete!',
          text2: 'Welcome to LiftSutra!',
        });
        return { success: true };
      } else {
        Toast.show({
          type: 'error',
          text1: 'Submission Failed',
          text2: response.data.message || 'Failed to save onboarding data.',
        });
        return { success: false };
      }
    } catch (error) {
      console.error('Onboarding submission error:', error);
      const message = error.response?.data?.message || error.message || 'Network error';
      Toast.show({
        type: 'error',
        text1: 'Connection Error',
        text2: message,
      });
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        updateField,
        submitOnboarding,
        isSubmitting,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
