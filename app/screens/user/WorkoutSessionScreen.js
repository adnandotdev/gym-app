import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { Alert, Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import MotionPressable from '../../components/MotionPressable';
import Button from '../../components/Button';
import { useWorkoutActivity } from '../../context/WorkoutActivityContext';
import { resolveExerciseDemonstration } from '../../data/exerciseDemonstrationImages';
import {
  createWorkoutSession,
  getCurrentExercise,
  getSessionSummary,
  getWorkoutSessionProgress,
  workoutSessionReducer,
} from '../../domain/workoutSession';
import { colors, radius, spacing, typography } from '../../theme/colors';

const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

export default function WorkoutSessionScreen({ navigation, route }) {
  const [session, dispatch] = useReducer(
    workoutSessionReducer,
    { day: route?.params?.day, exercises: route?.params?.exercises },
    createWorkoutSession,
  );
  const [isSaving, setIsSaving] = useState(false);
  const { recordWorkout } = useWorkoutActivity();
  const currentExercise = getCurrentExercise(session);
  const currentItem = session.queue[session.currentIndex] || null;
  const summary = useMemo(() => getSessionSummary(session), [session]);
  const progress = useMemo(() => getWorkoutSessionProgress(session), [session]);
  const nextItem = session.queue.find((item, index) => index > session.currentIndex && item.status === 'pending');
  const demonstration = currentExercise ? resolveExerciseDemonstration(
    currentExercise.exerciseVariantId || currentExercise.id,
    currentExercise.exerciseFamilyId,
    'male',
  ) : null;

  useEffect(() => {
    if (session.status !== 'active') return undefined;
    const timer = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(timer);
  }, [session.status]);

  const triggerSelectionHaptic = () => {
    void Haptics.selectionAsync().catch(() => undefined);
  };

  const handleBack = () => {
    if (!['active', 'paused'].includes(session.status)) {
      navigation.goBack();
      return;
    }
    Alert.alert(
      'Leave workout?',
      'Your completed and skipped exercises will not be added to Activity until you finish this workout.',
      [
        { text: 'Keep Training', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => navigation.goBack() },
      ],
    );
  };

  const handleComplete = () => {
    triggerSelectionHaptic();
    dispatch({ type: 'COMPLETE_CURRENT' });
  };

  const handleSkip = () => {
    triggerSelectionHaptic();
    dispatch({ type: 'SKIP_CURRENT' });
  };

  const finishWorkout = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await recordWorkout({
        id: session.id,
        day: session.day,
        startedAt: session.startedAt,
        completedAt: session.completedAt || Date.now(),
        totalElapsedSeconds: session.totalElapsedSeconds,
        completedCount: summary.completed,
        skippedCount: summary.skipped,
        totalCount: summary.total,
        items: session.queue.map((item) => ({
          identity: item.identity,
          name: item.exercise.name,
          status: item.status,
          elapsedSeconds: item.elapsedSeconds,
        })),
      });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      navigation.navigate('MainTabs', { screen: 'Activity' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Could not save activity', text2: 'Please try again.' });
      setIsSaving(false);
    }
  };

  if (session.status === 'empty') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <MotionPressable style={styles.iconButton} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={28} color={colors.ink} />
          </MotionPressable>
          <Text style={styles.headerTitle}>Workout</Text>
          <View style={styles.iconButton} />
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}><Ionicons name="calendar-outline" size={42} color={colors.primary} /></View>
          <Text style={styles.emptyTitle}>Nothing planned for this day</Text>
          <Text style={styles.emptyMeta}>Choose exercises in Calendar first. Your saved order will become the workout queue.</Text>
          <Button title="Open Calendar" onPress={() => navigation.navigate('MainTabs', { screen: 'My Plan', params: { initialDay: session.day } })} />
          <MotionPressable style={styles.browseButton} onPress={() => navigation.navigate('ExerciseLibrary')} accessibilityRole="button">
            <Text style={styles.browseText}>Browse Exercise Library</Text>
          </MotionPressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <MotionPressable style={styles.iconButton} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Leave workout">
          <Ionicons name="close" size={28} color={colors.ink} />
        </MotionPressable>
        <Text style={styles.headerTitle}>{session.day || 'Workout'}</Text>
        <Text style={styles.headerProgress}>{progress.currentLabel}/{progress.total}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress.percent}%` }]} />
      </View>

      {currentExercise ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.eyebrow}>CURRENT EXERCISE</Text>
          <Text style={styles.title}>{currentExercise.name}</Text>
          <Text style={styles.prescription}>{currentExercise.sets || '—'} sets · {currentExercise.reps || 'controlled reps'} · {currentExercise.equipment || 'No equipment'}</Text>

          <View style={styles.imageFrame}>
            <Image
              source={demonstration?.start || require('../../../assets/images/figma/exercise-warmup.png')}
              style={styles.image}
              resizeMode={demonstration ? 'cover' : 'contain'}
              accessible
              accessibilityLabel={`${currentExercise.name} starting position`}
            />
            {session.status === 'paused' ? (
              <View style={styles.pausedOverlay}><Ionicons name="pause" size={36} color={colors.white} /><Text style={styles.pausedText}>Paused</Text></View>
            ) : null}
          </View>

          <Text style={styles.timerLabel}>Exercise time</Text>
          <Text style={styles.timer}>{formatTime(currentItem.elapsedSeconds)}</Text>
          <Text style={styles.totalTime}>Total session {formatTime(session.totalElapsedSeconds)}</Text>

          <View style={styles.timerActions}>
            <MotionPressable style={styles.secondaryButton} onPress={() => dispatch({ type: 'RESET_CURRENT_TIMER' })} accessibilityRole="button" accessibilityLabel="Reset current exercise timer">
              <Ionicons name="refresh" size={18} color={colors.primary} />
              <Text style={styles.secondaryText}>Reset</Text>
            </MotionPressable>
            <MotionPressable style={styles.pauseButton} onPress={() => dispatch({ type: 'TOGGLE_PAUSE' })} accessibilityRole="button">
              <Ionicons name={session.status === 'paused' ? 'play' : 'pause'} size={18} color={colors.white} />
              <Text style={styles.primaryText}>{session.status === 'paused' ? 'Resume' : 'Pause'}</Text>
            </MotionPressable>
          </View>

          <MotionPressable style={styles.completeButton} onPress={handleComplete} accessibilityRole="button" accessibilityLabel={`Complete ${currentExercise.name} and continue`}>
            <Text style={styles.completeText}>{nextItem ? 'Complete & Next Exercise' : 'Complete Workout'}</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.white} />
          </MotionPressable>

          <MotionPressable style={styles.skip} onPress={handleSkip} accessibilityRole="button" accessibilityLabel={`Skip ${currentExercise.name}`}>
            <Text style={styles.skipText}>{nextItem ? 'Skip this exercise' : 'Skip and finish'}</Text>
          </MotionPressable>

          {Number.isInteger(session.lastSkippedIndex) ? (
            <View style={styles.undoBanner}>
              <Text style={styles.undoCopy}>{session.queue[session.lastSkippedIndex].exercise.name} skipped</Text>
              <MotionPressable onPress={() => dispatch({ type: 'UNDO_LAST_SKIP' })} accessibilityRole="button"><Text style={styles.undoText}>Undo</Text></MotionPressable>
            </View>
          ) : null}

          {nextItem ? (
            <View style={styles.nextCard}>
              <View style={styles.nextIcon}><Ionicons name="play-forward" size={20} color={colors.primary} /></View>
              <View style={styles.nextCopy}><Text style={styles.nextLabel}>UP NEXT</Text><Text style={styles.nextTitle}>{nextItem.exercise.name}</Text></View>
            </View>
          ) : null}
        </ScrollView>
      ) : null}

      {session.status === 'completed' ? (
        <View style={styles.scrim} accessibilityViewIsModal>
          <View style={styles.completionSheet}>
            <View style={styles.grabber} />
            <View style={styles.completionIcon}><Ionicons name={summary.didCompleteAny ? 'checkmark' : 'flag-outline'} size={52} color={colors.primary} /></View>
            <Text style={styles.completionTitle}>{summary.didCompleteAny ? 'Workout finished' : 'Workout ended'}</Text>
            <Text style={styles.completionCopy}>{summary.didCompleteAny ? 'Your completed exercises are ready to be saved to Activity.' : 'All exercises were skipped. The session will still be recorded honestly.'}</Text>
            <View style={styles.summary}>
              <View style={styles.summaryCell}><Text style={styles.summaryValue}>{summary.completed}</Text><Text style={styles.summaryLabel}>Completed</Text></View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryCell}><Text style={styles.summaryValue}>{summary.skipped}</Text><Text style={styles.summaryLabel}>Skipped</Text></View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryCell}><Text style={styles.summaryValue}>{formatTime(summary.elapsedSeconds)}</Text><Text style={styles.summaryLabel}>Time</Text></View>
            </View>
            {Number.isInteger(session.lastSkippedIndex) ? (
              <MotionPressable style={styles.undoLastButton} onPress={() => dispatch({ type: 'UNDO_LAST_SKIP' })} accessibilityRole="button">
                <Text style={styles.undoText}>Undo last skip</Text>
              </MotionPressable>
            ) : null}
            <Button title={isSaving ? 'Saving…' : 'Finish & View Activity'} onPress={finishWorkout} disabled={isSaving} loading={isSaving} />
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  header: { minHeight: 64, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.cardTitle, color: colors.ink },
  headerProgress: { ...typography.action, color: colors.primary, width: 44, textAlign: 'center' },
  progressTrack: { height: 4, marginHorizontal: spacing.screen, backgroundColor: colors.hairline, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary },
  content: { padding: spacing.screen, paddingBottom: spacing.xl, alignItems: 'center' },
  eyebrow: { ...typography.metaSmall, color: colors.primary },
  title: { ...typography.screenTitle, color: colors.ink, textAlign: 'center', marginTop: spacing.micro },
  prescription: { ...typography.caption, color: colors.muted, textAlign: 'center', marginTop: spacing.xs },
  imageFrame: { width: '100%', aspectRatio: 4 / 3, borderRadius: radius.card, backgroundColor: colors.surfaceWarm, marginTop: spacing.lg, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  pausedOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(30,30,34,0.58)', alignItems: 'center', justifyContent: 'center' },
  pausedText: { ...typography.cardTitle, color: colors.white, marginTop: spacing.xs },
  timerLabel: { ...typography.caption, color: colors.muted, marginTop: spacing.lg },
  timer: { fontFamily: 'Overpass_700Bold', fontSize: 38, lineHeight: 46, color: colors.ink, fontVariant: ['tabular-nums'] },
  totalTime: { ...typography.caption, color: colors.muted },
  timerActions: { flexDirection: 'row', gap: spacing.md, width: '100%', marginTop: spacing.lg },
  secondaryButton: { flex: 1, minHeight: 52, borderRadius: radius.control, borderWidth: 1, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: spacing.xs },
  secondaryText: { ...typography.action, color: colors.primary },
  pauseButton: { flex: 1, minHeight: 52, borderRadius: radius.control, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: spacing.xs },
  primaryText: { ...typography.action, color: colors.white },
  completeButton: { width: '100%', minHeight: 56, marginTop: spacing.md, borderRadius: radius.control, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: spacing.xs },
  completeText: { ...typography.action, color: colors.white },
  skip: { minHeight: 48, marginTop: spacing.xs, alignItems: 'center', justifyContent: 'center' },
  skipText: { ...typography.action, color: colors.mutedStrong },
  undoBanner: { width: '100%', minHeight: 48, borderRadius: radius.control, backgroundColor: colors.selectedSoft, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  undoCopy: { ...typography.caption, color: colors.ink, flex: 1 },
  undoText: { ...typography.action, color: colors.primary },
  nextCard: { width: '100%', minHeight: 72, marginTop: spacing.md, borderRadius: radius.control, backgroundColor: colors.surfaceWarm, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  nextIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  nextCopy: { flex: 1 },
  nextLabel: { ...typography.metaSmall, color: colors.muted },
  nextTitle: { ...typography.action, color: colors.ink, marginTop: spacing.micro },
  emptyState: { flex: 1, padding: spacing.screen, justifyContent: 'center', gap: spacing.md },
  emptyIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.selectedSoft, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { ...typography.screenTitle, color: colors.ink, textAlign: 'center' },
  emptyMeta: { ...typography.body, color: colors.muted, textAlign: 'center' },
  browseButton: { minHeight: 52, alignItems: 'center', justifyContent: 'center' },
  browseText: { ...typography.action, color: colors.primary },
  scrim: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', backgroundColor: 'rgba(30,30,34,0.32)' },
  completionSheet: { backgroundColor: colors.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: spacing.screen, paddingBottom: spacing.xl },
  grabber: { width: 68, height: 4, borderRadius: 2, backgroundColor: colors.hairline, alignSelf: 'center' },
  completionIcon: { width: 108, height: 108, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg, borderWidth: 6, borderColor: colors.primary, borderRadius: 54 },
  completionTitle: { ...typography.screenTitle, fontSize: 22, textAlign: 'center', color: colors.ink, marginTop: spacing.md },
  completionCopy: { ...typography.caption, color: colors.muted, textAlign: 'center', marginTop: spacing.xs },
  summary: { minHeight: 94, borderRadius: radius.control, backgroundColor: colors.surfaceWarm, flexDirection: 'row', marginVertical: spacing.md, alignItems: 'center' },
  summaryCell: { flex: 1, alignItems: 'center' },
  summaryValue: { ...typography.cardTitle, color: colors.ink, fontVariant: ['tabular-nums'] },
  summaryLabel: { ...typography.caption, color: colors.muted, marginTop: spacing.micro },
  summaryDivider: { width: 1, height: 48, backgroundColor: colors.border },
  undoLastButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
});
