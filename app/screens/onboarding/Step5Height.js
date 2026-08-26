import React, { useContext, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import Button from '../../components/Button';

const TICK_INTERVAL = 12; // vertical height of each tick item in pixels
const RULER_HEIGHT = 320; // total height of the visible ruler list container
const RULER_PADDING = RULER_HEIGHT / 2; // offset to align the center pointer

const Step5Height = ({ navigation }) => {
  const { onboardingData, updateField } = useContext(OnboardingContext);
  const flatListRef = useRef(null);

  const [unit, setUnit] = useState(onboardingData.heightUnit || 'cm'); // 'cm' or 'ft'
  const [localHeightCm, setLocalHeightCm] = useState(onboardingData.height || 170);

  // Conversion helpers
  const cmToFtIn = (cm) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  };

  const ftInToCm = (feet, inches) => {
    const totalInches = (feet * 12) + inches;
    return Math.round(totalInches * 2.54);
  };

  // Setup list data ranges based on the selected unit
  // CM Range: 100 to 220 (min = 100, max = 220)
  // FT Range: 36 inches to 84 inches (3ft to 7ft)
  const minCm = 100;
  const maxCm = 220;
  const cmRange = Array.from({ length: maxCm - minCm + 1 }, (_, i) => minCm + i);

  const minInches = 36; // 3ft
  const maxInches = 84; // 7ft
  const inchesRange = Array.from({ length: maxInches - minInches + 1 }, (_, i) => minInches + i);

  // Determine current display value
  const displayValue = () => {
    if (unit === 'cm') {
      return localHeightCm;
    } else {
      const { feet, inches } = cmToFtIn(localHeightCm);
      return `${feet}'${inches}"`;
    }
  };

  // Align FlatList scroll to the height value
  const syncRulerToHeight = (cmValue, currentUnit, animate = false) => {
    if (!flatListRef.current) return;
    
    if (currentUnit === 'cm') {
      const index = cmValue - minCm;
      flatListRef.current.scrollToOffset({
        offset: index * TICK_INTERVAL,
        animated: animate,
      });
    } else {
      const totalInches = Math.round(cmValue / 2.54);
      const index = Math.max(0, totalInches - minInches);
      flatListRef.current.scrollToOffset({
        offset: index * TICK_INTERVAL,
        animated: animate,
      });
    }
  };

  // Set initial scroll alignment
  useEffect(() => {
    const timer = setTimeout(() => {
      syncRulerToHeight(localHeightCm, unit, false);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.y;
    const index = Math.round(offset / TICK_INTERVAL);

    if (unit === 'cm') {
      const cmVal = minCm + index;
      if (cmVal >= minCm && cmVal <= maxCm && cmVal !== localHeightCm) {
        setLocalHeightCm(cmVal);
      }
    } else {
      const inchesVal = minInches + index;
      if (inchesVal >= minInches && inchesVal <= maxInches) {
        const cmVal = Math.round(inchesVal * 2.54);
        if (cmVal !== localHeightCm) {
          setLocalHeightCm(cmVal);
        }
      }
    }
  };

  const handleUnitChange = (newUnit) => {
    if (newUnit === unit) return;
    setUnit(newUnit);
    // Align ruler list with current height under new unit dimensions
    setTimeout(() => {
      syncRulerToHeight(localHeightCm, newUnit, false);
    }, 50);
  };

  const handleContinue = () => {
    updateField('height', localHeightCm);
    updateField('heightUnit', unit);
    navigation.navigate('Step6CurrentWeight');
  };

  const renderRulerItem = ({ item, index }) => {
    let isMajor = false;
    let label = '';

    if (unit === 'cm') {
      // Major ticks every 5 cm
      isMajor = item % 5 === 0;
      label = item.toString();
    } else {
      // Major ticks every foot (12 inches) or 6 inches
      isMajor = item % 6 === 0;
      if (item % 12 === 0) {
        label = `${item / 12} ft`;
      } else {
        label = `${Math.floor(item / 12)}'6"`;
      }
    }

    return (
      <View style={styles.tickContainer}>
        <View style={[styles.tickLine, isMajor ? styles.tickLineMajor : styles.tickLineMinor]} />
        {isMajor ? (
          <Text style={styles.tickLabel}>{label}</Text>
        ) : (
          <View style={{ width: 32 }} />
        )}
      </View>
    );
  };

  const listData = unit === 'cm' ? cmRange : inchesRange;

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader currentStep={5} navigation={navigation} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Your height</Text>
          <Text style={styles.subtitle}>Height information helps us calculate your BMI more accurately</Text>
        </View>

        {/* Toggle Pill at Top */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.togglePill, unit === 'cm' && styles.togglePillActive]}
            onPress={() => handleUnitChange('cm')}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, unit === 'cm' && styles.toggleTextActive]}>CM</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.togglePill, unit === 'ft' && styles.togglePillActive]}
            onPress={() => handleUnitChange('ft')}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, unit === 'ft' && styles.toggleTextActive]}>FT</Text>
          </TouchableOpacity>
        </View>

        {/* Main interactive display section */}
        <View style={styles.interactiveArea}>
          {/* Height numeric visualization */}
          <View style={styles.displayCard}>
            <Text style={styles.displayNumber}>{displayValue()}</Text>
            <Text style={styles.displayUnit}>{unit.toUpperCase()}</Text>
          </View>

          {/* Vertical scrollable ruler on the right */}
          <View style={styles.rulerContainer}>
            {/* Center Pointer (Yellow horizontal line indicator) */}
            <View style={styles.pointerContainer}>
              <View style={styles.pointerLine} />
              <View style={styles.pointerTriangle} />
            </View>

            <FlatList
              ref={flatListRef}
              data={listData}
              renderItem={renderRulerItem}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={false}
              snapToInterval={TICK_INTERVAL}
              decelerationRate="fast"
              onScroll={handleScroll}
              scrollEventThrottle={16}
              contentContainerStyle={{
                paddingTop: RULER_PADDING,
                paddingBottom: RULER_PADDING,
              }}
              style={styles.rulerList}
            />
          </View>
        </View>
      </View>

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
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
  },
  header: {
    marginBottom: 24,
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
  toggleContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#E2D8C8',
    borderRadius: 24,
    padding: 4,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#CFC4B3',
  },
  togglePill: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  togglePillActive: {
    backgroundColor: '#2F4A3C',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#82786A',
  },
  toggleTextActive: {
    color: '#17140F',
  },
  interactiveArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 80,
  },
  displayCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0E9DC',
    borderRadius: 24,
    padding: 24,
    height: 180,
    marginRight: 28,
    borderWidth: 2,
    borderColor: '#CFC4B3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  displayNumber: {
    fontSize: 54,
    fontWeight: '700',
    color: '#17140F',
  },
  displayUnit: {
    fontSize: 16,
    fontWeight: '700',
    color: '#C27A2C',
    marginTop: 4,
    letterSpacing: 1,
  },
  rulerContainer: {
    width: 110,
    height: RULER_HEIGHT,
    position: 'relative',
    backgroundColor: '#F0E9DC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CFC4B3',
    overflow: 'hidden',
  },
  rulerList: {
    flex: 1,
  },
  pointerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: RULER_HEIGHT / 2 - 1, // align exactly with the vertical center
    height: 2,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    pointerEvents: 'none',
  },
  pointerLine: {
    flex: 1,
    height: 3,
    backgroundColor: '#2F4A3C',
  },
  pointerTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftColor: '#2F4A3C',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: -1,
  },
  tickContainer: {
    height: TICK_INTERVAL,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 12,
  },
  tickLine: {
    backgroundColor: '#A79F92',
    marginRight: 12,
  },
  tickLineMajor: {
    width: 28,
    height: 2,
    backgroundColor: '#17140F',
  },
  tickLineMinor: {
    width: 14,
    height: 1,
    backgroundColor: '#A79B88',
  },
  tickLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#514B43',
    width: 44,
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

export default Step5Height;
