import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import Button from '../../components/Button';

const Step10FocusAreas = ({ navigation }) => {
  const { onboardingData, updateField } = useContext(OnboardingContext);
  
  const [selectedAreas, setSelectedAreas] = useState(onboardingData.focusAreas || []);

  const focusOptions = [
    { id: 'Chest', label: 'Chest', segment: 'chest' },
    { id: 'Back', label: 'Back', segment: 'back' },
    { id: 'Arms', label: 'Arms', segment: 'arms' },
    { id: 'Abs', label: 'Abs', segment: 'abs' },
    { id: 'Glutes', label: 'Glutes', segment: 'glutes' },
    { id: 'Leg', label: 'Legs', segment: 'legs' },
    { id: 'Full Body', label: 'Full Body', segment: 'full' },
  ];

  const overlayImages = [
    { id: 'Chest', source: require('../../../assets/images/anatomy/highlight-chest.png') },
    { id: 'Back', source: require('../../../assets/images/anatomy/highlight-back.png') },
    { id: 'Arms', source: require('../../../assets/images/anatomy/highlight-arms.png') },
    { id: 'Abs', source: require('../../../assets/images/anatomy/highlight-abs.png') },
    { id: 'Glutes', source: require('../../../assets/images/anatomy/highlight-glutes.png') },
    { id: 'Leg', source: require('../../../assets/images/anatomy/highlight-legs.png') },
  ];

  const handleSelectArea = (areaId) => {
    let updated;
    if (areaId === 'Full Body') {
      // Selecting Full Body toggles everything or resets others
      if (selectedAreas.includes('Full Body')) {
        updated = [];
      } else {
        updated = ['Full Body'];
      }
    } else {
      // Toggle individual focus area, remove "Full Body" if present
      const filterFull = selectedAreas.filter((a) => a !== 'Full Body');
      if (selectedAreas.includes(areaId)) {
        updated = filterFull.filter((a) => a !== areaId);
      } else {
        updated = [...filterFull, areaId];
      }
    }
    setSelectedAreas(updated);
  };

  const handleContinue = () => {
    updateField('focusAreas', selectedAreas);
    navigation.navigate('Step11TrainingDays');
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader currentStep={10} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Which areas do you want to focus on?</Text>
          <Text style={styles.subtitle}>Select the target area for more accurate recommendations</Text>
        </View>

        <View style={styles.splitRow}>
          {/* Left: Human Body Silhouette Model */}
          <View style={styles.bodyColumn}>
            <View style={styles.modelContainer}>
              <Image
                source={require('../../../assets/images/anatomy/body-map-front-base.png')}
                style={styles.bodyMapImage}
                resizeMode="contain"
              />
              {selectedAreas.includes('Full Body') ? (
                <Image
                  source={require('../../../assets/images/anatomy/highlight-full-body.png')}
                  style={styles.bodyMapOverlay}
                  resizeMode="contain"
                />
              ) : (
                overlayImages.map((overlay) =>
                  selectedAreas.includes(overlay.id) ? (
                    <Image
                      key={overlay.id}
                      source={overlay.source}
                      style={styles.bodyMapOverlay}
                      resizeMode="contain"
                    />
                  ) : null
                )
              )}
            </View>
          </View>

          {/* Connective dotted lines space is simulated natively via row layout lines */}

          {/* Right: Selectable Pills */}
          <View style={styles.pillsColumn}>
            {focusOptions.map((opt) => {
              const isSelected = selectedAreas.includes(opt.id);
              return (
                <View key={opt.id} style={styles.pillContainer}>
                  {/* Dotted lines connector */}
                  <View style={styles.dottedConnector} />

                  <TouchableOpacity
                    style={[
                      styles.pillButton,
                      isSelected && styles.pillButtonActive,
                    ]}
                    onPress={() => handleSelectArea(opt.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.pillLabel,
                      isSelected && styles.pillLabelActive,
                    ]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Continue button at bottom */}
      <View style={styles.footer}>
        <Button
          title="CONTINUE"
          onPress={handleContinue}
          disabled={selectedAreas.length === 0}
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#17140F',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#82786A',
    textAlign: 'center',
    lineHeight: 20,
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    flex: 1,
  },
  bodyColumn: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  modelContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F0E9DC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CFC4B3',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  bodyMapImage: {
    width: 112,
    height: 180,
  },
  bodyMapOverlay: {
    position: 'absolute',
    width: 112,
    height: 180,
  },
  pillsColumn: {
    width: '56%',
    justifyContent: 'flex-start',
  },
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  dottedConnector: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#A79B88',
    borderRadius: 1,
    marginRight: 8,
  },
  pillButton: {
    width: '80%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#CFC4B3',
    backgroundColor: '#F0E9DC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  pillButtonActive: {
    backgroundColor: '#2F4A3C',
    borderColor: '#2F4A3C',
  },
  pillLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#82786A',
  },
  pillLabelActive: {
    color: '#17140F',
    fontWeight: '700',
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

export default Step10FocusAreas;
