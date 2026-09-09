import React, { useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import MotionPressable from '../../components/MotionPressable';
import Button from '../../components/Button';
import FormTipsCarousel from '../../components/FormTipsCarousel';
import EquipmentGuideSheet from '../../components/EquipmentGuideSheet';
import { useWorkoutActivity } from '../../context/WorkoutActivityContext';
import { AuthContext } from '../../context/AuthContext';
import { resolveExerciseDemonstration } from '../../data/exerciseDemonstrationImages';
import { exercises as exerciseCatalog } from '../../data/exercises';
import { generateCooldown } from '../../domain/warmupGenerator';
import { parseSetInput } from '../../domain/workoutSetInput';
import {
  createWorkoutSession,
  getCurrentExercise,
  getSessionSummary,
  getWorkoutSessionProgress,
  workoutSessionReducer,
  computeTimerElapsed,
  computeRestRemaining,
  getRecommendedTarget,
} from '../../domain/workoutSession';
import { radius, spacing, typography } from '../../theme/colors';
import { useAppTheme } from '../../context/ThemeContext';
import useThemedStyles from '../../theme/useThemedStyles';

const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

export default function WorkoutSessionScreen({ navigation, route }) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const [session, dispatch] = useReducer(
    workoutSessionReducer,
    { day: route?.params?.day, exercises: route?.params?.exercises },
    createWorkoutSession,
  );

  const { history, recordWorkout, saveDraft, loadDraft, clearDraft } = useWorkoutActivity();
  const { user } = useContext(AuthContext);
  const guidanceLevel = user?.workoutPreferences?.guidanceLevel || 'beginner';

  const [isSaving, setIsSaving] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);

  // Local state for current set inputs
  const [actualReps, setActualReps] = useState('');
  const [actualLoad, setActualLoad] = useState('');

  // UI Overlays State
  const [skipSheetVisible, setSkipSheetVisible] = useState(false);
  const [skipSubstitution, setSkipSubstitution] = useState(null);
  const [showEquipmentGuide, setShowEquipmentGuide] = useState(false);
  const [hasOfferedCooldown, setHasOfferedCooldown] = useState(false);

  // Hydrate draft if exists
  useEffect(() => {
    const hydrate = async () => {
      if (route?.params?.exercises) {
        setIsHydrating(false);
        return;
      }
      const draft = await loadDraft();
      if (draft && draft.status !== 'completed' && draft.status !== 'empty') {
        dispatch({ type: 'HYDRATE', payload: draft });
      }
      setIsHydrating(false);
    };
    hydrate();
  }, [loadDraft, route?.params?.exercises]);

  // Persist draft on changes
  useEffect(() => {
    if (!isHydrating && session.status !== 'empty' && session.status !== 'completed') {
      saveDraft(session);
    }
  }, [session, isHydrating, saveDraft]);

  const currentExercise = getCurrentExercise(session);
  const currentItem = session.queue[session.currentIndex] || null;
  const currentTarget = currentItem?.targets[currentItem.currentSetIndex];
  const isDurationSet = currentTarget?.targetType === 'duration';
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

  // Automatically update input placeholders when set changes (F09 Progressive Overload pre-fill)
  useEffect(() => {
    if (currentItem) {
      const target = currentItem.targets[currentItem.currentSetIndex];
      let recommendedLoad = '';

      // If we have history for this exercise, recommend the last load used
      if (history) {
        const rec = getRecommendedTarget(currentItem.identity, history);
        if (rec && rec.targetLoadKg !== undefined) {
          recommendedLoad = String(rec.targetLoadKg);
        }
      }

      setActualReps(target ? String(target.targetMin) : '');
      setActualLoad(recommendedLoad);
    }
  }, [currentItem?.currentSetIndex, currentItem?.id, currentItem?.identity, history]);

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
      'You can resume this workout later from the Activity screen, or finish it now to save your progress.',
      [
        { text: 'Keep Training', style: 'cancel' },
        { text: 'Leave (Save Draft)', onPress: () => navigation.goBack() },
        { text: 'Discard', style: 'destructive', onPress: async () => {
            await clearDraft();
            navigation.goBack();
          }
        },
      ],
    );
  };

  const handleStartSet = () => {
    triggerSelectionHaptic();
    dispatch({ type: 'START_SET' });
  };

  const handleCompleteSet = () => {
    const payload = parseSetInput({ targetType: currentTarget?.targetType, value: actualReps, load: actualLoad });
    if (!payload) {
      Alert.alert('Check your set', isDurationSet
        ? 'Enter the number of seconds you completed, greater than zero.'
        : 'Enter completed reps greater than zero and a valid weight. Leave weight blank for bodyweight exercises.');
      return;
    }
    triggerSelectionHaptic();
    dispatch({
      type: 'COMPLETE_SET',
      payload,
    });
  };

  const handleSkipSet = () => {
    triggerSelectionHaptic();
    dispatch({ type: 'SKIP_SET' });
  };

  const handleCompleteRest = () => {
    triggerSelectionHaptic();
    dispatch({ type: 'COMPLETE_REST' });
    dispatch({ type: 'START_SET' });
  };

  const openSkipSheet = () => {
    triggerSelectionHaptic();
    setSkipSheetVisible(true);
    setSkipSubstitution(null);
  };

  const handleSkipReason = (reason) => {
    if (reason === 'Pain') {
      dispatch({ type: 'PAUSE_FOR_SAFETY' });
      setSkipSheetVisible(false);
      Alert.alert('Safety Stop', 'This exercise has been blocked due to reported pain. Please stop and rest.');
      return;
    }

    if (reason === 'Too hard' || reason === 'Equipment unavailable') {
      const currentMuscles = currentItem.exercise.primaryMuscles || [];
      const substitute = exerciseCatalog.find(ex =>
        ex.id !== currentItem.exercise.id &&
        ex.primaryMuscles?.some(m => currentMuscles.includes(m))
      );
      if (substitute) {
        setSkipSubstitution(substitute);
        return; // Stay in sheet, show substitution
      }
    }

    dispatch({ type: 'SKIP_CURRENT' });
    setSkipSheetVisible(false);
  };

  const handleAcceptSubstitution = () => {
    dispatch({ type: 'SUBSTITUTE_CURRENT', payload: skipSubstitution });
    setSkipSubstitution(null);
    setSkipSheetVisible(false);
  };

  const handleSkipWithoutReplacing = () => {
    dispatch({ type: 'SKIP_CURRENT' });
    setSkipSheetVisible(false);
    setSkipSubstitution(null);
  };

  const handleAcceptCooldown = (short = false) => {
    setHasOfferedCooldown(true);
    const cooldownItems = generateCooldown(session.queue.map(q => q.exercise), exerciseCatalog, short ? 3 : 5);
    dispatch({ type: 'APPEND_COOLDOWN', payload: cooldownItems });
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
        partialCount: summary.partial,
        skippedCount: summary.skipped,
        totalCount: summary.total,
        items: session.queue.map((item) => ({
          identity: item.identity,
          name: item.exercise.name,
          status: item.status,
          results: item.results,
          elapsedSeconds: item.elapsedSeconds,
        })),
      });
      await clearDraft();
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      navigation.navigate('MainTabs', { screen: 'Activity' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Could not save activity', text2: 'Please try again.' });
      setIsSaving(false);
    }
  };

  if (isHydrating) {
    return <View style={styles.container} />; // Loading
  }

  if (session.status === 'empty') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <MotionPressable style={styles.iconButton} onPress={() => navigation.goBack()} accessibilityRole="button">
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

  const isResting = session.activeTimer.type === 'rest';
  const restRemaining = computeRestRemaining(session.activeTimer);
  const workElapsed = computeTimerElapsed(session.activeTimer);
  const showCooldownPrompt = session.status === 'completed' && !hasOfferedCooldown && !session.queue.some(q => q.phase === 'cooldown');

  return (
    <SafeAreaView style={styles.container}>
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

      {session.status === 'paused' && currentItem?.status === 'blocked' ? (
        <View style={styles.blockedState}>
          <Ionicons name="warning" size={64} color={colors.performance} />
          <Text style={styles.title}>Session Paused</Text>
          <Text style={styles.blockedCopy}>This exercise was blocked for safety due to reported pain. Please rest.</Text>
          <Button title="Skip Exercise & Continue" onPress={() => {
            dispatch({ type: 'SKIP_CURRENT' });
          }} />
        </View>
      ) : currentExercise ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.eyebrow, currentItem.exercise.phase === 'warmup' && { color: colors.accent }]}>
            {currentItem.exercise.phase === 'warmup' ? 'WARM-UP' : currentItem.exercise.phase === 'cooldown' ? 'COOLDOWN' : 'CURRENT EXERCISE'}
          </Text>
          <Text style={styles.title}>{currentExercise.name}</Text>

          <MotionPressable onPress={() => setShowEquipmentGuide(true)} style={styles.equipmentTrigger}>
             <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
             <Text style={styles.equipmentTriggerText}>Equipment Setup</Text>
          </MotionPressable>

          <View style={styles.imageFrame}>
            <Image
              source={demonstration?.start || require('../../../assets/images/figma/exercise-warmup.png')}
              style={styles.image}
              resizeMode="contain"
              accessible
              accessibilityLabel={`${currentExercise.name} starting position`}
            />
          </View>

          <View style={{ marginTop: spacing.md }}>
            <FormTipsCarousel exerciseName={currentExercise.name} guidanceLevel={guidanceLevel} />
          </View>

          {isResting ? (
            <View style={styles.restCard}>
              <Text style={styles.restEyebrow}>REST</Text>
              <Text style={[styles.restTimer, restRemaining === 0 && { color: colors.primary }]}>
                {formatTime(restRemaining)}
              </Text>
              <Text style={styles.nextSetLabel}>Up next: Set {currentItem.currentSetIndex + 1}</Text>
              <MotionPressable style={styles.completeButton} onPress={handleCompleteRest} accessibilityRole="button">
                <Text style={styles.completeText}>Start Set</Text>
              </MotionPressable>
            </View>
          ) : (
            <View style={styles.setTrackingContainer}>
              <View style={styles.setHeaders}>
                <Text style={styles.setColHeader}>SET</Text>
                {!isDurationSet && <Text style={styles.valColHeader}>KG</Text>}
                <Text style={styles.valColHeader}>{isDurationSet ? 'SECONDS' : 'REPS'}</Text>
                <Text style={styles.checkColHeader}></Text>
              </View>

              {currentItem.results.map((res, idx) => (
                <View key={`res-${idx}`} style={styles.setRow}>
                  <Text style={styles.setNumber}>{res.setNumber}</Text>
                  {!isDurationSet && <Text style={styles.valColText}>{res.actualLoadKg}</Text>}
                  <Text style={styles.valColText}>{isDurationSet ? res.actualSeconds : res.actualReps}</Text>
                  <View style={styles.checkColBox}>
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  </View>
                </View>
              ))}

              {currentItem.currentSetIndex < currentItem.targets.length ? (
                <View style={[styles.setRow, styles.activeSetRow]}>
                  <Text style={styles.activeSetNumber}>{currentItem.currentSetIndex + 1}</Text>
                  {!isDurationSet && <TextInput
                    style={styles.inputBox}
                    keyboardType="numeric"
                    accessibilityLabel="Weight in kilograms"
                    value={actualLoad}
                    onChangeText={setActualLoad}
                    placeholder="—"
                  />}
                  <TextInput
                    style={styles.inputBox}
                    keyboardType="numeric"
                    accessibilityLabel={isDurationSet ? 'Completed seconds' : 'Completed repetitions'}
                    value={actualReps}
                    onChangeText={setActualReps}
                  />
                  <MotionPressable style={styles.checkButton} onPress={handleCompleteSet} accessibilityRole="button" accessibilityLabel="Complete set">
                    <Ionicons name="checkmark" size={20} color={colors.accentOnDark} />
                  </MotionPressable>
                </View>
              ) : null}

              {currentItem.targets.slice(currentItem.currentSetIndex + 1).map((target, idx) => (
                <View key={`fut-${idx}`} style={styles.setRow}>
                  <Text style={styles.setNumber}>{target.setNumber}</Text>
                  {!isDurationSet && <Text style={styles.valColTextPlaceholder}>—</Text>}
                  <Text style={styles.valColTextPlaceholder}>{target.targetMin}</Text>
                  <View style={styles.checkColBox}>
                    <Ionicons name="ellipse-outline" size={24} color={colors.borderStrong} />
                  </View>
                </View>
              ))}

              <View style={styles.workoutActionsRow}>
                {session.activeTimer.type === 'none' ? (
                  <MotionPressable style={styles.secondaryButton} onPress={handleStartSet} accessibilityRole="button">
                    <Text style={styles.secondaryText}>Start Set Timer</Text>
                  </MotionPressable>
                ) : (
                  <View style={styles.activeTimerBox}>
                    <View style={styles.activeTimerReadout}>
                      <Text style={styles.activeTimerLabel}>{session.status === 'paused' ? 'Set Timer Paused' : 'Active Set Time'}</Text>
                      <Text style={styles.activeTimerVal}>{formatTime(workElapsed)}</Text>
                    </View>
                    <View style={styles.timerActions}>
                      <MotionPressable
                        style={styles.timerAction}
                        onPress={() => dispatch({ type: 'TOGGLE_PAUSE' })}
                        accessibilityRole="button"
                        accessibilityLabel={session.status === 'paused' ? 'Resume set timer' : 'Pause set timer'}
                      >
                        <Ionicons name={session.status === 'paused' ? 'play' : 'pause'} size={18} color={colors.primary} />
                      </MotionPressable>
                      <MotionPressable
                        style={styles.timerAction}
                        onPress={() => dispatch({ type: 'RESET_CURRENT_TIMER' })}
                        accessibilityRole="button"
                        accessibilityLabel="Reset set timer"
                      >
                        <Ionicons name="refresh" size={18} color={colors.primary} />
                      </MotionPressable>
                    </View>
                  </View>
                )}

                <MotionPressable style={styles.skipSecondary} onPress={handleSkipSet} accessibilityRole="button">
                  <Text style={styles.skipSecondaryText}>Skip Set</Text>
                </MotionPressable>
              </View>

              <View style={styles.exerciseActions}>
                 <MotionPressable style={styles.skipSecondary} onPress={openSkipSheet} accessibilityRole="button">
                  <Text style={styles.skipSecondaryText}>Skip Full Exercise</Text>
                </MotionPressable>
              </View>
            </View>
          )}

          {nextItem ? (
            <View style={styles.nextCard}>
              <View style={styles.nextIcon}><Ionicons name="play-forward" size={20} color={colors.primary} /></View>
              <View style={styles.nextCopy}><Text style={styles.nextLabel}>UP NEXT</Text><Text style={styles.nextTitle}>{nextItem.exercise.name}</Text></View>
            </View>
          ) : null}
        </ScrollView>
      ) : null}

      {/* Cooldown Prompt Scrim */}
      {showCooldownPrompt && (
        <View style={styles.scrim} accessibilityViewIsModal>
          <View style={styles.bottomSheet}>
            <View style={styles.grabber} />
            <Text style={styles.sheetTitle}>Workout complete!</Text>
            <Text style={styles.cooldownCopy}>Would you like to start a cooldown sequence tailored to the muscles you just used?</Text>
            <Button title="Start Cooldown" onPress={() => handleAcceptCooldown(false)} />
            <View style={{ marginTop: spacing.md }}>
              <Button title="Short 3-minute Cooldown" type="secondary" onPress={() => handleAcceptCooldown(true)} />
            </View>
            <MotionPressable style={{ marginTop: spacing.lg, alignSelf: 'center' }} onPress={() => setHasOfferedCooldown(true)}>
              <Text style={styles.skipSecondaryText}>No thanks, finish now</Text>
            </MotionPressable>
          </View>
        </View>
      )}

      {/* Completion Scrim */}
      {session.status === 'completed' && !showCooldownPrompt && (
        <View style={styles.scrim} accessibilityViewIsModal>
          <View style={styles.bottomSheet}>
            <View style={styles.grabber} />
            <View style={styles.completionIcon}><Ionicons name={summary.didCompleteAny ? 'checkmark' : 'flag-outline'} size={52} color={colors.primary} /></View>
            <Text style={styles.completionTitle}>{summary.didCompleteAny ? 'Workout finished' : 'Workout ended'}</Text>
            <Text style={styles.completionCopy}>{summary.didCompleteAny ? 'Your completed exercises are ready to be saved to Activity.' : 'All exercises were skipped.'}</Text>
            <View style={styles.summary}>
              <View style={styles.summaryCell}><Text style={styles.summaryValue}>{summary.completed}</Text><Text style={styles.summaryLabel}>Completed</Text></View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryCell}><Text style={styles.summaryValue}>{summary.partial}</Text><Text style={styles.summaryLabel}>Partial</Text></View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryCell}><Text style={styles.summaryValue}>{summary.skipped}</Text><Text style={styles.summaryLabel}>Skipped</Text></View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryCell}><Text style={styles.summaryValue}>{formatTime(summary.elapsedSeconds)}</Text><Text style={styles.summaryLabel}>Time</Text></View>
            </View>
            <Button title={isSaving ? 'Saving…' : 'Finish & View Activity'} onPress={finishWorkout} disabled={isSaving} loading={isSaving} />
          </View>
        </View>
      )}

      {/* Skip Sheet Scrim */}
      {skipSheetVisible && (
        <View style={styles.scrim} accessibilityViewIsModal>
          <View style={styles.bottomSheet}>
            <View style={styles.headerRow}>
              <Text style={styles.sheetTitle}>{skipSubstitution ? 'Substitution Found' : 'Why are you skipping?'}</Text>
              <MotionPressable style={styles.iconButton} onPress={() => { setSkipSheetVisible(false); setSkipSubstitution(null); }}>
                <Ionicons name="close" size={24} color={colors.ink} />
              </MotionPressable>
            </View>

            {skipSubstitution ? (
              <View style={styles.substituteBox}>
                <Ionicons name="swap-horizontal" size={32} color={colors.primary} />
                <Text style={styles.substituteTitle}>{skipSubstitution.name}</Text>
                <Text style={styles.substituteCopy}>This targets the same primary muscles.</Text>
                <Button title="Accept Substitution" onPress={handleAcceptSubstitution} />
                <MotionPressable style={{ marginTop: spacing.md }} onPress={handleSkipWithoutReplacing}>
                  <Text style={styles.skipSecondaryText}>No, skip without replacing</Text>
                </MotionPressable>
              </View>
            ) : (
              <View style={styles.skipReasons}>
                {['Too hard', 'Equipment unavailable', 'Pain'].map(reason => (
                  <MotionPressable key={reason} style={styles.reasonRow} onPress={() => handleSkipReason(reason)}>
                    <Text style={[styles.reasonText, reason === 'Pain' && { color: colors.performance }]}>{reason}</Text>
                    <Ionicons name="chevron-forward" size={20} color={reason === 'Pain' ? colors.performance : colors.muted} />
                  </MotionPressable>
                ))}
                <MotionPressable style={[styles.reasonRow, { borderBottomWidth: 0 }]} onPress={handleSkipWithoutReplacing}>
                  <Text style={styles.reasonText}>Skip without replacing</Text>
                </MotionPressable>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Equipment Guide Sheet */}
      {currentExercise && (
        <EquipmentGuideSheet
          visible={showEquipmentGuide}
          onClose={() => setShowEquipmentGuide(false)}
          exerciseName={currentExercise.name}
          equipmentName={(Array.isArray(currentExercise.equipment) ? currentExercise.equipment[0] : currentExercise.equipment) || 'Equipment'}
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors) => ({
  container: { flex: 1, backgroundColor: colors.canvas },
  header: { minHeight: 56, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.cardTitle, color: colors.ink },
  headerProgress: { ...typography.action, color: colors.primary, width: 44, textAlign: 'center' },
  progressTrack: { height: 4, marginHorizontal: spacing.screen, backgroundColor: colors.hairline, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary },
  content: { paddingHorizontal: spacing.screen, paddingTop: spacing.md, paddingBottom: spacing.lg, alignItems: 'stretch' },
  eyebrow: { ...typography.metaSmall, color: colors.primary, textAlign: 'center' },
  title: { ...typography.screenTitle, color: colors.ink, textAlign: 'center', marginTop: spacing.micro },
  equipmentTrigger: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.micro, paddingVertical: spacing.xs },
  equipmentTriggerText: { ...typography.caption, color: colors.primary, flexShrink: 1, textAlign: 'center' },
  imageFrame: { width: '100%', aspectRatio: 4 / 3, borderRadius: radius.card, backgroundColor: colors.surfaceWarm, marginTop: spacing.lg, overflow: 'hidden', alignSelf: 'center' },
  image: { width: '100%', height: '100%' },

  // Set Tracking Styles
  setTrackingContainer: { marginTop: spacing.lg },
  setHeaders: { flexDirection: 'row', marginBottom: spacing.sm, paddingHorizontal: spacing.sm },
  setColHeader: { ...typography.metaSmall, color: colors.muted, width: 40 },
  valColHeader: { ...typography.metaSmall, color: colors.muted, flex: 1, textAlign: 'center' },
  checkColHeader: { width: 50 },

  setRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, marginBottom: spacing.xs },
  activeSetRow: { backgroundColor: colors.surfaceWarm, borderRadius: radius.control },
  setNumber: { ...typography.cardTitle, color: colors.muted, width: 40 },
  activeSetNumber: { ...typography.cardTitle, color: colors.ink, width: 40 },

  valColText: { ...typography.cardTitle, color: colors.ink, flex: 1, textAlign: 'center' },
  valColTextPlaceholder: { ...typography.cardTitle, color: colors.borderStrong, flex: 1, textAlign: 'center' },

  inputBox: { flex: 1, height: 44, backgroundColor: colors.canvas, borderRadius: radius.subtle, marginHorizontal: spacing.xs, textAlign: 'center', ...typography.cardTitle, color: colors.ink, borderWidth: 1, borderColor: colors.border },

  checkColBox: { width: 50, alignItems: 'flex-end', justifyContent: 'center' },
  checkButton: { width: 44, height: 44, backgroundColor: colors.primary, borderRadius: radius.control, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', marginLeft: 6 },

  workoutActionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg },
  activeTimerBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  activeTimerReadout: { minWidth: 94 },
  activeTimerLabel: { ...typography.caption, color: colors.muted },
  activeTimerVal: { ...typography.cardTitle, color: colors.primary, fontVariant: ['tabular-nums'] },
  timerActions: { flexDirection: 'row', gap: spacing.xs },
  timerAction: { width: 44, height: 44, borderRadius: radius.control, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },

  secondaryButton: { paddingHorizontal: spacing.md, height: 44, borderRadius: radius.control, borderWidth: 1, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { ...typography.action, color: colors.primary },

  skipSecondary: { paddingHorizontal: spacing.md, height: 44, alignItems: 'center', justifyContent: 'center' },
  skipSecondaryText: { ...typography.action, color: colors.mutedStrong },

  exerciseActions: { marginTop: spacing.lg, alignItems: 'center' },

  // Rest Timer Styles
  restCard: { backgroundColor: colors.surfaceWarm, padding: spacing.md, borderRadius: radius.card, alignItems: 'center', marginTop: spacing.lg, borderWidth: 1, borderColor: colors.hairline },
  restEyebrow: { ...typography.metaSmall, color: colors.primary },
  restTimer: { fontFamily: 'Overpass_700Bold', fontSize: 54, lineHeight: 64, color: colors.ink, fontVariant: ['tabular-nums'], marginVertical: spacing.md },
  nextSetLabel: { ...typography.body, color: colors.muted, marginBottom: spacing.lg },

  completeButton: { width: '100%', minHeight: 56, borderRadius: radius.control, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  completeText: { ...typography.action, color: colors.accentOnDark },

  nextCard: { width: '100%', minHeight: 72, marginTop: spacing.lg, borderRadius: radius.control, backgroundColor: colors.surfaceWarm, padding: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  nextIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  nextCopy: { flex: 1 },
  nextLabel: { ...typography.metaSmall, color: colors.muted },
  nextTitle: { ...typography.action, color: colors.ink, marginTop: spacing.micro },

  // Bottom Sheets
  scrim: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', backgroundColor: colors.scrim, zIndex: 100 },
  bottomSheet: { backgroundColor: colors.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: spacing.screen, paddingBottom: spacing.xl },
  grabber: { width: 68, height: 4, borderRadius: 2, backgroundColor: colors.hairline, alignSelf: 'center', marginBottom: spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },

  completionIcon: { width: 108, height: 108, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg, borderWidth: 6, borderColor: colors.primary, borderRadius: 54 },
  completionTitle: { ...typography.screenTitle, fontSize: 22, textAlign: 'center', color: colors.ink, marginTop: spacing.md },
  completionCopy: { ...typography.caption, color: colors.muted, textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.lg },
  summary: { minHeight: 94, borderRadius: radius.control, backgroundColor: colors.surfaceWarm, flexDirection: 'row', marginVertical: spacing.md, alignItems: 'center' },
  summaryCell: { flex: 1, alignItems: 'center' },
  summaryValue: { ...typography.cardTitle, color: colors.ink, fontVariant: ['tabular-nums'] },
  summaryLabel: { ...typography.caption, color: colors.muted, marginTop: spacing.micro },
  summaryDivider: { width: 1, height: 48, backgroundColor: colors.border },

  sheetTitle: { ...typography.screenTitle, fontSize: 20, color: colors.ink, textAlign: 'center', marginTop: spacing.sm },
  cooldownCopy: { ...typography.body, color: colors.muted, textAlign: 'center', marginVertical: spacing.lg },
  skipReasons: { marginTop: spacing.sm },
  reasonRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  reasonText: { ...typography.action, color: colors.ink },

  substituteBox: { alignItems: 'center', marginTop: spacing.md },
  substituteTitle: { ...typography.screenTitle, fontSize: 22, color: colors.ink, marginTop: spacing.md, textAlign: 'center' },
  substituteCopy: { ...typography.body, color: colors.muted, textAlign: 'center', marginBottom: spacing.xl },

  blockedState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.screen },
  blockedCopy: { ...typography.body, color: colors.muted, textAlign: 'center', marginTop: spacing.md, marginBottom: spacing.xl },
});
