import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useReducedMotion } from 'react-native-reanimated';
import { OnboardingProvider } from '../context/OnboardingContext';

// Import all 13 step screens
import Step1FitnessGoal from '../screens/onboarding/Step1FitnessGoal';
import Step2Gender from '../screens/onboarding/Step2Gender';
import Step3FitnessLevel from '../screens/onboarding/Step3FitnessLevel';
import Step4Age from '../screens/onboarding/Step4Age';
import Step5Height from '../screens/onboarding/Step5Height';
import Step6CurrentWeight from '../screens/onboarding/Step6CurrentWeight';
import Step7CurrentBodyShape from '../screens/onboarding/Step7CurrentBodyShape';
import Step8DesiredBodyShape from '../screens/onboarding/Step8DesiredBodyShape';
import Step9TargetWeight from '../screens/onboarding/Step9TargetWeight';
import Step10FocusAreas from '../screens/onboarding/Step10FocusAreas';
import Step11TrainingDays from '../screens/onboarding/Step11TrainingDays';
import Step12Equipment from '../screens/onboarding/Step12Equipment';
import Step13Injuries from '../screens/onboarding/Step13Injuries';

const Stack = createNativeStackNavigator();

const OnboardingNavigator = () => {
  const reducedMotion = useReducedMotion();

  return (
    <OnboardingProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: reducedMotion ? 'fade' : 'default',
        }}
      >
        <Stack.Screen name="Step1FitnessGoal" component={Step1FitnessGoal} />
        <Stack.Screen name="Step2Gender" component={Step2Gender} />
        <Stack.Screen name="Step3FitnessLevel" component={Step3FitnessLevel} />
        <Stack.Screen name="Step4Age" component={Step4Age} />
        <Stack.Screen name="Step5Height" component={Step5Height} />
        <Stack.Screen name="Step6CurrentWeight" component={Step6CurrentWeight} />
        <Stack.Screen name="Step7CurrentBodyShape" component={Step7CurrentBodyShape} />
        <Stack.Screen name="Step8DesiredBodyShape" component={Step8DesiredBodyShape} />
        <Stack.Screen name="Step9TargetWeight" component={Step9TargetWeight} />
        <Stack.Screen name="Step10FocusAreas" component={Step10FocusAreas} />
        <Stack.Screen name="Step11TrainingDays" component={Step11TrainingDays} />
        <Stack.Screen name="Step12Equipment" component={Step12Equipment} />
        <Stack.Screen name="Step13Injuries" component={Step13Injuries} />
      </Stack.Navigator>
    </OnboardingProvider>
  );
};

export default OnboardingNavigator;
