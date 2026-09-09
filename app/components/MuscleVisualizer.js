import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import * as Haptics from 'expo-haptics';
import { radius, spacing } from '../theme/colors';
import useThemedStyles from '../theme/useThemedStyles';
import MotionPressable from './MotionPressable';
import {
  hasExerciseAnatomyImage,
  resolveExerciseAnatomyImage,
} from '../data/exerciseAnatomyImages';

const overlayImages = [
  { id: 'Chest', view: 'front', source: require('../../assets/images/anatomy/highlight-chest.png') },
  { id: 'Shoulders', view: 'front', source: require('../../assets/images/anatomy/highlight-shoulders.png') },
  { id: 'Arms', view: 'front', source: require('../../assets/images/anatomy/highlight-arms.png') },
  { id: 'Abs', view: 'front', source: require('../../assets/images/anatomy/highlight-abs.png') },
  { id: 'Legs', view: 'front', source: require('../../assets/images/anatomy/highlight-legs.png') },
  { id: 'Back', view: 'back', source: require('../../assets/images/anatomy/highlight-back.png') },
  { id: 'Glutes', view: 'back', source: require('../../assets/images/anatomy/highlight-glutes.png') },
];

const ViewToggle = ({ view, onChange }) => {
  const styles = useThemedStyles(createStyles);
  const selectView = (nextView) => {
    if (nextView === view) return;

    onChange(nextView);
    void Haptics.selectionAsync().catch((error) => {
      console.warn('Haptic feedback was unavailable.', error);
    });
  };

  return (
    <View style={styles.toggleContainer}>
      {['front', 'back'].map((item) => (
        <MotionPressable
          key={item}
          style={[styles.toggleBtn, view === item && styles.toggleBtnActive]}
          onPress={() => selectView(item)}
          accessibilityRole="button"
          accessibilityState={{ selected: view === item }}
        >
          <Text style={[styles.toggleText, view === item && styles.toggleTextActive]}>
            {item === 'front' ? 'Front' : 'Back'}
          </Text>
        </MotionPressable>
      ))}
    </View>
  );
};

export default function MuscleVisualizer({
  exerciseId,
  exerciseName,
  gender,
  primaryMuscles = [],
  secondaryMuscles = [],
}) {
  const styles = useThemedStyles(createStyles);
  const [view, setView] = useState('front');
  const imageSource = resolveExerciseAnatomyImage(exerciseId, gender, view);
  const accessibilityLabel = exerciseName
    ? `${exerciseName} targeted muscles, ${view} anatomical view`
    : `Neutral ${view} anatomical fitness model`;

  if (exerciseId && !hasExerciseAnatomyImage(exerciseId)) {
    return (
      <View style={styles.viewerContainer}>
        <ViewToggle view={view} onChange={setView} />

        <View style={[styles.imageCard, styles.legacyImageFrame]}>
          <View
            style={styles.imageMapContainer}
            accessible
            accessibilityRole="image"
            accessibilityLabel={accessibilityLabel}
          >
            <Image
              source={
                view === 'front'
                  ? require('../../assets/images/anatomy/body-map-front-base.png')
                  : require('../../assets/images/anatomy/body-map-back-base.png')
              }
              style={styles.baseBodyImage}
              resizeMode="contain"
              importantForAccessibility="no-hide-descendants"
            />
            {overlayImages.map((overlay) => {
              const isActive =
                overlay.view === view &&
                (primaryMuscles.includes(overlay.id) || secondaryMuscles.includes(overlay.id));

              return isActive ? (
                <Image
                  key={overlay.id}
                  source={overlay.source}
                  style={styles.overlayHighlightImage}
                  resizeMode="contain"
                  importantForAccessibility="no-hide-descendants"
                />
              ) : null;
            })}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.viewerContainer}>
      <ViewToggle view={view} onChange={setView} />
      <View style={[styles.imageCard, styles.anatomyImageFrame]}>
        <Image
          source={imageSource}
          style={styles.anatomyImage}
          resizeMode="contain"
          accessible
          accessibilityLabel={accessibilityLabel}
        />
      </View>
    </View>
  );
}

const createStyles = (colors) => ({
  viewerContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: spacing.sm,
    gap: spacing.sm,
  },
  imageCard: {
    width: '100%',
    borderRadius: radius.card,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  anatomyImageFrame: {
    aspectRatio: 849 / 926,
    position: 'relative',
    backgroundColor: colors.surfaceWarm,
  },
  anatomyImage: {
    width: '100%',
    height: '100%',
  },
  legacyImageFrame: {
    aspectRatio: 2 / 3,
    backgroundColor: colors.surfaceDark2,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceDark,
    borderRadius: radius.control,
    padding: spacing.micro,
  },
  toggleBtn: {
    minHeight: 44,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.screen,
    borderRadius: radius.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnActive: {
    backgroundColor: colors.accent,
  },
  toggleText: {
    color: colors.mutedOnDark,
    fontWeight: '400',
  },
  toggleTextActive: {
    color: colors.accentOnDark,
  },
  imageMapContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseBodyImage: {
    width: '100%',
    height: '100%',
  },
  overlayHighlightImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
