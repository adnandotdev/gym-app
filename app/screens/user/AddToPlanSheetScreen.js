import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import Button from '../../components/Button';
import MotionPressable from '../../components/MotionPressable';
import { useWorkoutPlan } from '../../context/WorkoutPlanContext';
import { colors, componentSizes, radius, spacing, typography } from '../../theme/colors';
import { resolveExerciseDemonstration } from '../../data/exerciseDemonstrationImages';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const triggerHaptic = async (callback) => {
  try {
    await callback();
  } catch (error) {
    console.warn('Haptic feedback was unavailable.', error);
  }
};

export default function AddToPlanSheetScreen({ route, navigation }) {
  const { exercise } = route.params;
  const { addExercise } = useWorkoutPlan();
  const demonstration = resolveExerciseDemonstration(
    exercise.exerciseVariantId || exercise.id,
    exercise.exerciseFamilyId,
    'male',
  );
  const [selectedDay, setSelectedDay] = useState(null);
  const [addingDay, setAddingDay] = useState(null);

  const selectDay = (day) => {
    if (day === selectedDay) return;

    setSelectedDay(day);
    void triggerHaptic(() => Haptics.selectionAsync());
  };

  const handleAddToPlan = async () => {
    if (!selectedDay || addingDay) return;

    setAddingDay(selectedDay);
    try {
      await addExercise(selectedDay, exercise);
      void triggerHaptic(() =>
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      );
      Toast.show({
        type: 'success',
        text1: 'Added to Plan',
        text2: `${exercise.name} added to ${selectedDay}.`,
      });
      navigation.goBack();
    } catch (error) {
      if (error.message?.includes('already in plan')) {
        void triggerHaptic(() =>
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
        );
        Toast.show({
          type: 'info',
          text1: 'Already Added',
          text2: `${exercise.name} is already in ${selectedDay}'s plan.`,
        });
        navigation.goBack();
      } else {
        void triggerHaptic(() =>
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        );
        Toast.show({
          type: 'error',
          text1: 'Could Not Add Exercise',
          text2: 'Please try again.',
        });
      }
    } finally {
      setAddingDay(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Add to Workout Plan</Text>
          <Text style={styles.subtitle}>Choose a training day for {exercise.name}.</Text>
        </View>
        <MotionPressable
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Close Add to Workout Plan"
        >
          <Ionicons name="close" size={22} color={colors.textPrimary} />
        </MotionPressable>
      </View>

      {demonstration && (
        <View style={styles.exercisePreview}>
          <Image
            source={demonstration.start}
            style={styles.exercisePreviewImage}
            resizeMode="cover"
            accessible
            accessibilityLabel={`${exercise.name} male exercise demonstration`}
          />
          <View style={styles.exercisePreviewCopy}>
            <Text style={styles.exercisePreviewEyebrow}>Selected variation</Text>
            <Text style={styles.exercisePreviewTitle} numberOfLines={2}>{exercise.name}</Text>
            <Text style={styles.exercisePreviewMeta}>{exercise.equipment}</Text>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.dayList} showsVerticalScrollIndicator={false}>
        {DAYS.map((day) => {
          const selected = selectedDay === day;

          return (
            <MotionPressable
              key={day}
              style={[styles.dayButton, selected && styles.dayButtonSelected]}
              onPress={() => selectDay(day)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
            >
              <Text style={[styles.dayText, selected && styles.dayTextSelected]}>{day}</Text>
              <Ionicons
                name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={selected ? colors.canvas : colors.muted}
              />
            </MotionPressable>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Confirm Add"
          onPress={handleAddToPlan}
          loading={Boolean(addingDay)}
          disabled={!selectedDay}
        />
        <Text style={styles.progressText} accessibilityLiveRegion="polite">
          {addingDay ? `Adding to ${addingDay}` : 'Select a day to continue'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
    gap: spacing.sm,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...typography.screenTitle,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.micro,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.control,
    backgroundColor: colors.surfaceWarm,
  },
  exercisePreview: {
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.screen,
    marginTop: spacing.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.card,
    backgroundColor: colors.surfaceWarm,
  },
  exercisePreviewImage: {
    width: 112,
    aspectRatio: 4 / 3,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
  },
  exercisePreviewCopy: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  exercisePreviewEyebrow: {
    ...typography.metaSmall,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  exercisePreviewTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    marginTop: spacing.micro,
  },
  exercisePreviewMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.micro,
  },
  dayList: {
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  dayButton: {
    minHeight: componentSizes.primaryButtonHeight,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.control,
    backgroundColor: colors.surfaceWarm,
  },
  dayButtonSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  dayText: {
    ...typography.action,
    color: colors.textPrimary,
  },
  dayTextSelected: {
    color: colors.canvas,
  },
  footer: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  progressText: {
    ...typography.caption,
    color: colors.textSecondary,
    minHeight: 24,
    textAlign: 'center',
  },
});
