import React, { useContext, useRef, useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingContext } from '../../context/OnboardingContext';
import OnboardingHeader from './OnboardingHeader';
import Button from '../../components/Button';
import { spacing } from '../../theme/colors';
import useThemedStyles from '../../theme/useThemedStyles';

const ITEM_HEIGHT = 60;

const Step4Age = ({ navigation }) => {
  const styles = useThemedStyles(createStyles);
  const { onboardingData, updateField } = useContext(OnboardingContext);
  const selectedAge = onboardingData.age;
  
  const flatListRef = useRef(null);
  const [localAge, setLocalAge] = useState(selectedAge || 25);

  // Generate range 10 to 80
  const numbers = [];
  for (let i = 10; i <= 80; i++) {
    numbers.push(i);
  }

  // Prepend and append empty elements for visual padding so first and last numbers can align to center
  const data = [null, null, ...numbers, null, null];

  // Two padding items center the selection in the five-row viewport.
  const getIndexForAge = (age) => age - 10 + 2;

  useEffect(() => {
    // Scroll to default or previously selected age after component mounts
    const timer = setTimeout(() => {
      const idx = getIndexForAge(localAge);
      flatListRef.current?.scrollToOffset({
        offset: (idx - 2) * ITEM_HEIGHT,
        animated: false,
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleScroll = (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / ITEM_HEIGHT);
    
    if (index >= 0 && index < numbers.length) {
      const ageVal = numbers[index];
      if (ageVal !== localAge) {
        setLocalAge(ageVal);
      }
    }
  };

  const handleScrollEnd = () => {
    updateField('age', localAge);
  };

  const handleContinue = () => {
    updateField('age', localAge);
    navigation.navigate('Step5Height');
  };

  const renderItem = ({ item, index }) => {
    if (item === null) {
      return <View style={{ height: ITEM_HEIGHT }} />;
    }

    // Determine the distance from the currently selected age
    const distance = Math.abs(item - localAge);

    let textStyle = styles.fadedTextLevel3;
    if (distance === 0) {
      textStyle = styles.selectedText;
    } else if (distance === 1) {
      textStyle = styles.fadedTextLevel1;
    } else if (distance === 2) {
      textStyle = styles.fadedTextLevel2;
    }

    return (
      <View style={styles.itemContainer}>
        {distance === 0 ? (
          <View style={styles.selectedBackground}>
            <Text style={textStyle}>{item}</Text>
            <Text style={styles.unitLabel}>years old</Text>
          </View>
        ) : (
          <Text style={textStyle}>{item}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingHeader currentStep={4} navigation={navigation} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Your age</Text>
          <Text style={styles.subtitle}>Age information helps us more accurately assess your metabolic level</Text>
        </View>

        <View style={styles.pickerWrapper}>
          {/* Subtle guide indicators */}
          <View style={styles.selectionIndicator} />

          <FlatList
            ref={flatListRef}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onScroll={handleScroll}
            onMomentumScrollEnd={handleScrollEnd}
            onScrollEndDrag={handleScrollEnd}
            scrollEventThrottle={16}
            getItemLayout={(data, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
            style={styles.flatList}
            contentContainerStyle={styles.flatListContent}
          />
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

const createStyles = (colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    alignItems: 'center',
  },
  header: {
    marginBottom: spacing.screen,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  pickerWrapper: {
    height: ITEM_HEIGHT * 5,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionIndicator: {
    position: 'absolute',
    height: ITEM_HEIGHT + 10,
    width: '100%',
    backgroundColor: colors.primarySoft,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.primary,
    zIndex: 1,
  },
  flatList: {
    width: '100%',
    zIndex: 2,
  },
  flatListContent: {
    alignItems: 'center',
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  selectedBackground: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  selectedText: {
    fontSize: 44,
    fontWeight: '700',
    color: colors.ink,
  },
  unitLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  fadedTextLevel1: {
    fontSize: 26,
    fontWeight: '600',
    color: colors.muted,
  },
  fadedTextLevel2: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.muted,
  },
  fadedTextLevel3: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.border,
  },
  footer: {
    flexShrink: 0,
    backgroundColor: colors.canvas,
    paddingHorizontal: spacing.screen,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    zIndex: 10,
  },
  continueButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.ink,
  },
});

export default Step4Age;
