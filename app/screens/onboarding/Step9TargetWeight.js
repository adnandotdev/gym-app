import React, { useContext, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import Button from '../../components/Button';

const TICK_WIDTH = 10;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RULER_PADDING = SCREEN_WIDTH / 2;

const Step9TargetWeight = ({ navigation }) => {
  const { onboardingData, updateField } = useContext(OnboardingContext);
  const flatListRef = useRef(null);

  const unit = onboardingData.weightUnit || 'kg';
  const currentWeight = onboardingData.currentWeight || 70;
  const [localTargetWeightKg, setLocalTargetWeightKg] = useState(onboardingData.targetWeight || currentWeight);

  // Conversion helpers
  const kgToLb = (kg) => Math.round(kg / 0.45359237);
  const lbToKg = (lb) => Math.round(lb * 0.45359237);

  const minKg = 30;
  const maxKg = 200;
  const kgRange = Array.from({ length: maxKg - minKg + 1 }, (_, i) => minKg + i);

  const minLb = 66;
  const maxLb = 440;
  const lbRange = Array.from({ length: maxLb - minLb + 1 }, (_, i) => minLb + i);

  const displayWeight = () => {
    return unit === 'kg' ? localTargetWeightKg : kgToLb(localTargetWeightKg);
  };

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
      syncRulerToWeight(localTargetWeightKg, unit, false);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / TICK_WIDTH);

    if (unit === 'kg') {
      const kgVal = minKg + index;
      if (kgVal >= minKg && kgVal <= maxKg && kgVal !== localTargetWeightKg) {
        setLocalTargetWeightKg(kgVal);
      }
    } else {
      const lbVal = minLb + index;
      if (lbVal >= minLb && lbVal <= maxLb) {
        const kgVal = lbToKg(lbVal);
        if (kgVal !== localTargetWeightKg) {
          setLocalTargetWeightKg(kgVal);
        }
      }
    }
  };

  // Dynamic weight diff calculations
  const calculateInsight = () => {
    const diff = localTargetWeightKg - currentWeight;
    const absDiff = Math.abs(diff);
    
    let percent = 0;
    if (currentWeight > 0) {
      percent = Math.round((absDiff / currentWeight) * 100);
    }

    const displayDiff = unit === 'kg' ? absDiff : Math.round(absDiff / 0.45359237);

    if (diff < 0) {
      return {
        title: `Lose ${displayDiff} ${unit.toUpperCase()}`,
        subtitle: `You'll shed approximately ${percent}% of your body weight. You got this! 👌`,
        color: '#3B82F6', // Blue
        emoji: '👌',
      };
    } else if (diff > 0) {
      return {
        title: `Gain ${displayDiff} ${unit.toUpperCase()}`,
        subtitle: `You'll build approximately ${percent}% of your body weight. Time to construct lean muscle! 💪`,
        color: '#10B981', // Green
        emoji: '💪',
      };
    } else {
      return {
        title: 'Maintain Weight',
        subtitle: "You're at your perfect target! Let's work on body conditioning and stamina! ⚡",
        color: '#2F4A3C', // Yellow
        emoji: '👌',
      };
    }
  };

  const insight = calculateInsight();

  const handleContinue = () => {
    updateField('targetWeight', localTargetWeightKg);
    navigation.navigate('Step10FocusAreas');
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
      <OnboardingHeader currentStep={9} navigation={navigation} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Your target weight</Text>
        </View>

        <Text style={styles.unitDisplay}>{unit.toUpperCase()}</Text>

        {/* Dynamic Numerical Target Box */}
        <View style={styles.weightBox}>
          <Text style={styles.weightText}>{displayWeight()}</Text>
          <Text style={styles.weightUnitText}>{unit.toUpperCase()}</Text>
        </View>

        {/* Horizontal weight ruler picker */}
        <View style={styles.rulerOuter}>
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

        {/* Motivational Card */}
        <View style={styles.insightCard}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.statusDot, { backgroundColor: insight.color }]} />
            <Text style={styles.insightTitle}>{insight.title}</Text>
            <Text style={styles.emoji}>{insight.emoji}</Text>
          </View>
          <Text style={styles.insightSubtitle}>{insight.subtitle}</Text>
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
  unitDisplay: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A79F92',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
  },
  weightBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 24,
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
    marginBottom: 36,
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
  insightCard: {
    width: '100%',
    backgroundColor: '#F4E3C9',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E6BE86',
    padding: 20,
    shadowColor: '#2F4A3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#17140F',
    flex: 1,
  },
  emoji: {
    fontSize: 18,
  },
  insightSubtitle: {
    fontSize: 14,
    color: '#514B43',
    lineHeight: 20,
    fontWeight: '500',
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

export default Step9TargetWeight;
