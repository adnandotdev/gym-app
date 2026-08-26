import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import Button from '../../components/Button';

const Step13Injuries = ({ navigation }) => {
  const { onboardingData, updateField, submitOnboarding } = useContext(OnboardingContext);
  
  const [selectedInjuries, setSelectedInjuries] = useState(onboardingData.injuries || []);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // We use standard React useRef for persistence, but since we are within a function, we must import useRef or define it cleanly.
  // Wait, let's make sure useRef is imported from 'react'. Yes, we added 'useState, useEffect' but forgot 'useRef'. Let's ensure we import 'useRef' at the top.
  
  const handleSelectInjury = (id) => {
    let updated;
    if (id === 'No injuries') {
      if (selectedInjuries.includes('No injuries')) {
        updated = [];
      } else {
        updated = ['No injuries'];
      }
    } else {
      const filterNo = selectedInjuries.filter((x) => x !== 'No injuries');
      if (selectedAreasIncludes(id)) {
        updated = filterNo.filter((x) => x !== id);
      } else {
        updated = [...filterNo, id];
      }
    }
    setSelectedInjuries(updated);
  };

  const selectedAreasIncludes = (id) => {
    return selectedInjuries.includes(id);
  };

  const handleFinish = async () => {
    // Save to context
    updateField('injuries', selectedInjuries);
    
    setIsSaving(true);
    // Submit onboarding answers to backend API
    const result = await submitOnboarding();
    
    if (result && result.success) {
      setIsSaving(false);
      setShowSuccess(true);
      
      // Trigger checkmark pop-in animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();

      // Show success screen briefly, then let global Auth state route to Home
      setTimeout(() => {
        // Handled dynamically by state change. AuthNavigator will automatically switch
        // but let's make sure if there is any delay, we don't block.
      }, 1800);
    } else {
      setIsSaving(false);
    }
  };

  const injuryOptions = [
    { id: 'No injuries', label: 'No injuries', color: '#DDE8DE', hasBlob: false },
    { id: 'Shoulders', label: 'Shoulders', color: '#E2D8C8', hasBlob: true, blobPos: { top: 6, left: 24 } },
    { id: 'Back', label: 'Back', color: '#E2D8C8', hasBlob: true, blobPos: { top: 22, left: 24 } },
    { id: 'Waist', label: 'Waist', color: '#E2D8C8', hasBlob: true, blobPos: { top: 34, left: 24 } },
    { id: 'Wrist', label: 'Wrist', color: '#E2D8C8', hasBlob: true, blobPos: { top: 28, left: 10 } },
    { id: 'Knee', label: 'Knee', color: '#E2D8C8', hasBlob: true, blobPos: { top: 48, left: 16 } },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader currentStep={13} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Have you suffered any injuries recently?</Text>
        </View>

        {/* 2x3 Grid */}
        <View style={styles.gridContainer}>
          {/* Row 1 */}
          <View style={styles.row}>
            {injuryOptions.slice(0, 2).map((opt) => {
              const isSelected = selectedInjuries.includes(opt.id);
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.injuryCard,
                    isSelected && styles.selectedInjuryCard,
                  ]}
                  onPress={() => handleSelectInjury(opt.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.cardLabel, isSelected && styles.selectedCardLabel]}>{opt.label}</Text>
                  
                  {/* Visual Silhouette placeholder in card */}
                  <View style={[styles.miniBody, { backgroundColor: opt.color }]}>
                    <View style={styles.miniHead} />
                    <View style={styles.miniTorso} />
                    {opt.hasBlob && (
                      <View style={[styles.redBlob, opt.blobPos]} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Row 2 */}
          <View style={styles.row}>
            {injuryOptions.slice(2, 4).map((opt) => {
              const isSelected = selectedInjuries.includes(opt.id);
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.injuryCard,
                    isSelected && styles.selectedInjuryCard,
                  ]}
                  onPress={() => handleSelectInjury(opt.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.cardLabel, isSelected && styles.selectedCardLabel]}>{opt.label}</Text>
                  
                  <View style={[styles.miniBody, { backgroundColor: opt.color }]}>
                    <View style={styles.miniHead} />
                    <View style={styles.miniTorso} />
                    {opt.hasBlob && (
                      <View style={[styles.redBlob, opt.blobPos]} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Row 3 */}
          <View style={styles.row}>
            {injuryOptions.slice(4, 6).map((opt) => {
              const isSelected = selectedInjuries.includes(opt.id);
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.injuryCard,
                    isSelected && styles.selectedInjuryCard,
                  ]}
                  onPress={() => handleSelectInjury(opt.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.cardLabel, isSelected && styles.selectedCardLabel]}>{opt.label}</Text>
                  
                  <View style={[styles.miniBody, { backgroundColor: opt.color }]}>
                    <View style={styles.miniHead} />
                    <View style={styles.miniTorso} />
                    {opt.hasBlob && (
                      <View style={[styles.redBlob, opt.blobPos]} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Footer Area with FINISH Button */}
      <View style={styles.footer}>
        <Button
          title="FINISH"
          onPress={handleFinish}
          disabled={selectedInjuries.length === 0}
          style={styles.finishButton}
        />
      </View>

      {/* Loading Overlay */}
      {isSaving && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2F4A3C" />
          <Text style={styles.loadingText}>Tailoring your training profile...</Text>
        </View>
      )}

      {/* Success Animation Overlay */}
      {showSuccess && (
        <Animated.View style={[styles.successOverlay, { opacity: opacityAnim }]}>
          <Animated.View style={[styles.successCard, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.successIconWrapper}>
              <Ionicons name="checkmark" size={64} color="#17140F" />
            </View>
            <Text style={styles.successTitle}>Profile Created!</Text>
            <Text style={styles.successSubtitle}>Let's begin your fitness journey with MuscleMap.</Text>
          </Animated.View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

// Insert React.useRef into Step13Injuries import or use it inline


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
    textAlign: 'center',
    lineHeight: 34,
  },
  gridContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  injuryCard: {
    width: '47%',
    height: 120,
    backgroundColor: '#F0E9DC',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#CFC4B3',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  selectedInjuryCard: {
    borderColor: '#2F4A3C',
    backgroundColor: '#F4E3C9',
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#82786A',
    width: '55%',
  },
  selectedCardLabel: {
    color: '#17140F',
  },
  miniBody: {
    width: 52,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#CFC4B3',
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  miniHead: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFCF5',
    marginBottom: 6,
  },
  miniTorso: {
    width: 26,
    height: 48,
    borderRadius: 4,
    backgroundColor: '#FFFCF5',
  },
  redBlob: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#9B2F1D',
    borderWidth: 1.5,
    borderColor: '#FFFCF5',
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
  finishButton: {
    backgroundColor: '#17140F',
    shadowColor: '#17140F',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#17140F',
    marginTop: 16,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 26, 26, 0.98)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    paddingHorizontal: 36,
  },
  successCard: {
    backgroundColor: '#FFFCF5',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#2F4A3C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#2F4A3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#17140F',
    marginBottom: 10,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#82786A',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
});

export default Step13Injuries;
