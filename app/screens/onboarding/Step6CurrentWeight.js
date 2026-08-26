import React, { useContext, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import Button from '../../components/Button';

const TICK_WIDTH = 10; // width of each tick item in pixels
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RULER_PADDING = SCREEN_WIDTH / 2; // offset to align the center pointer

const Step6CurrentWeight = ({ navigation }) => {
  const { onboardingData, updateField } = useContext(OnboardingContext);
  const flatListRef = useRef(null);

  const [unit, setUnit] = useState(onboardingData.weightUnit || 'kg'); // 'kg' or 'lb'
  const [localWeightKg, setLocalWeightKg] = useState(onboardingData.currentWeight || 70);

  // Conversion helpers
  const kgToLb = (kg) => Math.round(kg / 0.45359237);
  const lbToKg = (lb) => Math.round(lb * 0.45359237);

  // Ranges
  const minKg = 30;
  const maxKg = 200;
  const kgRange = Array.from({ length: maxKg - minKg + 1 }, (_, i) => minKg + i);

  const minLb = 66;
  const maxLb = 440;
  const lbRange = Array.from({ length: maxLb - minLb + 1 }, (_, i) => minLb + i);

  const displayWeight = () => {
    return unit === 'kg' ? localWeightKg : kgToLb(localWeightKg);
  };

  // Sync horizontal FlatList to the active weight value
  const syncRulerToWeight = (kgValue, currentUnit, animate = false) => {
    if (!flatListRef.current) return;

    if (currentUnit === 'kg') {
      const index = kgValue - minKg;
      flatListRef.current.scrollToOffset({
        offset: index * TICK_WIDTH,
        animated: animate,
      });
    } else {
      const lbVal = kgToLb(kgValue);
      const index = Math.max(0, lbVal - minLb);
      flatListRef.current.scrollToOffset({
        offset: index * TICK_WIDTH,
        animated: animate,
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      syncRulerToHeight(localWeightKg, unit, false);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const syncRulerToHeight = (kgValue, currentUnit, animate = false) => {
    syncRulerToWeight(kgValue, currentUnit, animate);
  };

  const handleScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / TICK_WIDTH);

    if (unit === 'kg') {
      const kgVal = minKg + index;
      if (kgVal >= minKg && kgVal <= maxKg && kgVal !== localWeightKg) {
        setLocalWeightKg(kgVal);
      }
    } else {
      const lbVal = minLb + index;
      if (lbVal >= minLb && lbVal <= maxLb) {
        const kgVal = lbToKg(lbVal);
        if (kgVal !== localWeightKg) {
          setLocalWeightKg(kgVal);
        }
      }
    }
  };

  const handleUnitChange = (newUnit) => {
    if (newUnit === unit) return;
    setUnit(newUnit);
    setTimeout(() => {
      syncRulerToWeight(localWeightKg, newUnit, false);
    }, 50);
  };

  // Calculate BMI dynamically
  const heightCm = onboardingData.height || 170;
  const heightM = heightCm / 100;
  const bmi = parseFloat((localWeightKg / (heightM * heightM)).toFixed(1));

  // Determine BMI category details
  const getBmiDetails = () => {
    if (bmi < 18.5) {
      return {
        category: 'Underweight',
        color: '#3B82F6', // Blue
        message: 'A structured surplus will help you build solid muscle! Let\'s fuel those gains. 🍎',
        ratio: Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100)), // dynamic pointer ratio
      };
    } else if (bmi < 25) {
      return {
        category: 'Normal',
        color: '#10B981', // Green
        message: 'Fantastic! Your BMI is in the healthy zone. Let\'s build strength and tone up! 💪',
        ratio: Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100)),
      };
    } else {
      return {
        category: 'Overweight',
        color: '#9B2F1D', // Red
        message: 'A consistent routine and high-quality protein will support your body transformation! 🏃‍♂️',
        ratio: Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100)),
      };
    }
  };

  const bmiDetails = getBmiDetails();

  const handleContinue = () => {
    updateField('currentWeight', localWeightKg);
    updateField('weightUnit', unit);
    updateField('bmi', bmi);
    navigation.navigate('Step7CurrentBodyShape');
  };

  const renderRulerItem = ({ item }) => {
    const isMajor = item % 5 === 0;
    return (
      <View style={styles.tickContainer}>
        <View style={[styles.tickLine, isMajor ? styles.tickLineMajor : styles.tickLineMinor]} />
        {isMajor ? (
          <Text style={styles.tickLabel}>{item}</Text>
        ) : (
          <View style={{ height: 16 }} />
        )}
      </View>
    );
  };

  const listData = unit === 'kg' ? kgRange : lbRange;

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader currentStep={6} navigation={navigation} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Your current weight</Text>
        </View>

        {/* Toggle Pill */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.togglePill, unit === 'lb' && styles.togglePillActive]}
            onPress={() => handleUnitChange('lb')}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, unit === 'lb' && styles.toggleTextActive]}>LB</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.togglePill, unit === 'kg' && styles.togglePillActive]}
            onPress={() => handleUnitChange('kg')}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, unit === 'kg' && styles.toggleTextActive]}>KG</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Numerical Weight Box */}
        <View style={styles.weightBox}>
          <Text style={styles.weightText}>{displayWeight()}</Text>
          <Text style={styles.weightUnitText}>{unit.toUpperCase()}</Text>
        </View>

        {/* Horizontal weight ruler picker */}
        <View style={styles.rulerOuter}>
          {/* Vertical yellow indicator line */}
          <View style={styles.centerIndicator} />
          
          <FlatList
            ref={flatListRef}
            data={listData}
            horizontal
            renderItem={renderRulerItem}
            keyExtractor={(item) => item.toString()}
            showsHorizontalScrollIndicator={false}
            snapToInterval={TICK_WIDTH}
            decelerationRate="fast"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{
              paddingLeft: RULER_PADDING - TICK_WIDTH / 2,
              paddingRight: RULER_PADDING - TICK_WIDTH / 2,
            }}
            style={styles.rulerList}
          />
        </View>

        {/* BMI Card */}
        <View style={styles.bmiCard}>
          <Text style={styles.bmiTitle}>Current BMI</Text>
          
          {/* BMI Value Indicator Row */}
          <View style={styles.bmiValueRow}>
            <View style={[styles.bmiBadge, { backgroundColor: bmiDetails.color }]}>
              <Text style={styles.bmiBadgeText}>{bmi}</Text>
            </View>
            <Text style={[styles.bmiCategoryText, { color: bmiDetails.color }]}>
              {bmiDetails.category}
            </Text>
          </View>

          {/* Color Gradient Slider Bar */}
          <View style={styles.gradientBarContainer}>
            <View style={styles.gradientBar}>
              <View style={[styles.gradientSegment, { backgroundColor: '#3B82F6', borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }]} />
              <View style={[styles.gradientSegment, { backgroundColor: '#10B981' }]} />
              <View style={[styles.gradientSegment, { backgroundColor: '#9B2F1D', borderTopRightRadius: 6, borderBottomRightRadius: 6 }]} />
            </View>
            {/* Dynamic Sliding Triangle Pin pointer */}
            <View style={[styles.bmiPin, { left: `${bmiDetails.ratio}%` }]} />
          </View>

          <Text style={styles.bmiMessage}>{bmiDetails.message}</Text>
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
    alignItems: 'center',
  },
  header: {
    marginBottom: 16,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#17140F',
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#E2D8C8',
    borderRadius: 24,
    padding: 4,
    marginBottom: 20,
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
  weightBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 20,
  },
  weightText: {
    fontSize: 64,
    fontWeight: '700',
    color: '#17140F',
  },
  weightUnitText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#C27A2C',
    marginLeft: 8,
  },
  rulerOuter: {
    width: SCREEN_WIDTH,
    height: 70,
    position: 'relative',
    backgroundColor: '#F0E9DC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#CFC4B3',
    marginBottom: 28,
  },
  centerIndicator: {
    position: 'absolute',
    left: SCREEN_WIDTH / 2 - 1.5,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#2F4A3C',
    zIndex: 10,
    pointerEvents: 'none',
  },
  rulerList: {
    flex: 1,
  },
  tickContainer: {
    width: TICK_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  tickLine: {
    backgroundColor: '#A79F92',
    marginBottom: 8,
  },
  tickLineMajor: {
    width: 2,
    height: 24,
    backgroundColor: '#17140F',
  },
  tickLineMinor: {
    width: 1,
    height: 12,
    backgroundColor: '#A79B88',
  },
  tickLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#82786A',
  },
  bmiCard: {
    width: '100%',
    backgroundColor: '#F0E9DC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CFC4B3',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  bmiTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#82786A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  bmiValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bmiBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  bmiBadgeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFCF5',
  },
  bmiCategoryText: {
    fontSize: 18,
    fontWeight: '700',
  },
  gradientBarContainer: {
    width: '100%',
    height: 14,
    position: 'relative',
    marginBottom: 16,
  },
  gradientBar: {
    flexDirection: 'row',
    width: '100%',
    height: 8,
    backgroundColor: '#CFC4B3',
    borderRadius: 4,
    marginTop: 3,
  },
  gradientSegment: {
    flex: 1,
    height: '100%',
  },
  bmiPin: {
    position: 'absolute',
    top: 0,
    width: 12,
    height: 14,
    backgroundColor: '#17140F',
    borderRadius: 2,
    transform: [{ translateX: -6 }], // center it on the active ratio coordinate
  },
  bmiMessage: {
    fontSize: 13,
    color: '#514B43',
    lineHeight: 18,
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

export default Step6CurrentWeight;
