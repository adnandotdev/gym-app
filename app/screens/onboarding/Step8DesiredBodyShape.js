import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import Button from '../../components/Button';

const bodyShapeImages = {
  1: require('../../../assets/images/onboarding/body-shape-1-athletic.png'),
  2: require('../../../assets/images/onboarding/body-shape-2-lean.png'),
  3: require('../../../assets/images/onboarding/body-shape-3-average.png'),
  4: require('../../../assets/images/onboarding/body-shape-4-heavy.png'),
  5: require('../../../assets/images/onboarding/body-shape-5-obese.png'),
};

const Step8DesiredBodyShape = ({ navigation }) => {
  const { onboardingData, updateField } = useContext(OnboardingContext);
  
  const currentShape = onboardingData.currentBodyShape || 3;
  const [localShape, setLocalShape] = useState(onboardingData.desiredBodyShape || 3);

  const bodyShapes = [
    { value: 1, label: 'Athletic', fatRange: 'Body Fat < 15%', color: '#F4E3C9' },
    { value: 2, label: 'Lean', fatRange: 'Body Fat 15% - 22%', color: '#E6BE86' },
    { value: 3, label: 'Average', fatRange: 'Body Fat 22% - 30%', color: '#2F4A3C' },
    { value: 4, label: 'Heavy', fatRange: 'Body Fat 30% - 38%', color: '#B96D24' },
    { value: 5, label: 'Obese', fatRange: 'Body Fat > 38%', color: '#9A5A1E' },
  ];

  const currentDetails = bodyShapes[currentShape - 1];
  const desiredDetails = bodyShapes[localShape - 1];

  const handleSelectDot = (val) => {
    setLocalShape(val);
  };

  const handleContinue = () => {
    updateField('desiredBodyShape', localShape);
    navigation.navigate('Step9TargetWeight');
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader currentStep={8} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose your desired body shape</Text>
        </View>

        {/* Side by Side Comparative Visualizer Card */}
        <View style={styles.comparisonCard}>
          <View style={styles.shapesRow}>
            {/* Left: Current Body Shape */}
            <View style={styles.silhouetteContainer}>
              <Text style={styles.cardHeader}>Current</Text>
              <View style={styles.shapeImageFrame}>
                <Image source={bodyShapeImages[currentShape]} style={styles.shapeImage} resizeMode="contain" />
              </View>
              <Text style={styles.shapeLabel}>{currentDetails.label}</Text>
            </View>

            {/* Center Orange Chevrons */}
            <View style={styles.arrowContainer}>
              <Ionicons name="chevron-forward" size={28} color="#FB923C" />
              <Ionicons name="chevron-forward" size={28} color="#FB923C" style={{ marginTop: -14 }} />
            </View>

            {/* Right: Desired Body Shape */}
            <View style={styles.silhouetteContainer}>
              <Text style={styles.cardHeader}>Target</Text>
              <View style={styles.shapeImageFrame}>
                <Image source={bodyShapeImages[localShape]} style={styles.shapeImage} resizeMode="contain" />
              </View>
              <Text style={styles.shapeLabel}>{desiredDetails.label}</Text>
            </View>
          </View>
          
          <Text style={styles.targetFatRange}>{desiredDetails.fatRange}</Text>
        </View>

        {/* Custom 5-Dot Slider */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderLine} />
          <View style={styles.dotsRow}>
            {bodyShapes.map((shape) => {
              const isActive = shape.value === localShape;
              return (
                <TouchableOpacity
                  key={shape.value}
                  onPress={() => handleSelectDot(shape.value)}
                  style={[
                    styles.dotOuter,
                    isActive && styles.dotOuterActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.dotInner,
                    isActive && styles.dotInnerActive,
                  ]} />
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.labelsRow}>
            <Text style={styles.edgeLabel}>Body fat &lt; 15%</Text>
            <Text style={styles.edgeLabel}>&gt; 40%</Text>
          </View>
        </View>
      </ScrollView>

      {/* Continue button at bottom */}
      <View style={styles.footer}>
        <Button
          title="CONTINUE"
          onPress={handleContinue}
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
    alignItems: 'center',
  },
  header: {
    marginBottom: 36,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#17140F',
    textAlign: 'center',
  },
  comparisonCard: {
    width: '100%',
    backgroundColor: '#F0E9DC',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#CFC4B3',
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  shapesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  silhouetteContainer: {
    alignItems: 'center',
    flex: 1,
  },
  cardHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#82786A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  shapeImageFrame: {
    width: 90,
    height: 140,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  shapeImage: {
    width: '100%',
    height: '100%',
  },
  shapeLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#17140F',
  },
  arrowContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
  },
  targetFatRange: {
    fontSize: 14,
    color: '#C27A2C',
    fontWeight: '700',
    marginTop: 18,
  },
  sliderContainer: {
    width: '100%',
    paddingHorizontal: 16,
    position: 'relative',
  },
  sliderLine: {
    position: 'absolute',
    left: 28,
    right: 28,
    top: 14,
    height: 3,
    backgroundColor: '#CFC4B3',
    borderRadius: 1.5,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  dotOuter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFCF5',
    borderWidth: 2,
    borderColor: '#A79B88',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotOuterActive: {
    borderColor: '#2F4A3C',
    transform: [{ scale: 1.25 }],
    shadowColor: '#2F4A3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#A79B88',
  },
  dotInnerActive: {
    backgroundColor: '#2F4A3C',
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
  },
  edgeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#82786A',
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

export default Step8DesiredBodyShape;
