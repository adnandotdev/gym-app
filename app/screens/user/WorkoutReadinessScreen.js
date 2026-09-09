import React, { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MotionPressable from '../../components/MotionPressable';
import Button from '../../components/Button';
import { radius, spacing, typography } from '../../theme/colors';
import { useAppTheme } from '../../context/ThemeContext';
import useThemedStyles from '../../theme/useThemedStyles';
import { buildSession } from '../../domain/decisionEngine';
import { generateWarmup } from '../../domain/warmupGenerator';

const ENERGY_OPTIONS = ['Low', 'Normal', 'High'];
const SLEEP_OPTIONS = ['Poor', 'Good'];
const SORENESS_OPTIONS = ['None', 'Mild', 'Pain'];

export default function WorkoutReadinessScreen({ navigation, route }) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const { day, exercises } = route.params || {};

  const [step, setStep] = useState('questions'); // 'questions' | 'preview' | 'blocked'
  const [energy, setEnergy] = useState('Normal');
  const [sleep, setSleep] = useState('Good');
  const [soreness, setSoreness] = useState('None');

  const [adaptedPlan, setAdaptedPlan] = useState(null);
  const [warmups, setWarmups] = useState([]);

  const handleEvaluate = () => {
    const plan = { items: exercises || [] };
    const context = {
      readiness: { energy, sleep, soreness }
    };

    const result = buildSession(plan, context);

    if (result.decision === 'blocked') {
      setStep('blocked');
      return;
    }

    const generatedWarmups = generateWarmup(result);
    setAdaptedPlan(result);
    setWarmups(generatedWarmups);
    setStep('preview');
  };

  const handleStartWorkout = () => {
    // Combine warmups and adapted items for the session
    const sessionExercises = [...warmups, ...adaptedPlan.items];
    navigation.replace('WorkoutSession', { day, exercises: sessionExercises });
  };

  if (step === 'blocked') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerCard}>
          <Ionicons name="warning" size={64} color={colors.performance} />
          <Text style={styles.title}>Safety Stop</Text>
          <Text style={styles.bodyCopy}>
            You reported experiencing pain. To prevent injury, this workout has been blocked.
            Please prioritize recovery and consult a professional if pain persists.
          </Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'preview') {
    const isAdapted = adaptedPlan.adaptations.length > 0;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Workout Plan</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          {isAdapted ? (
            <View style={styles.adaptationAlert}>
              <Ionicons name="alert-circle" size={20} color={colors.primary} />
              <Text style={styles.adaptationText}>Volume reduced due to your reported fatigue. Take it easy today!</Text>
            </View>
          ) : (
            <View style={styles.readyAlert}>
              <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
              <Text style={styles.readyText}>You're ready to go! Original targets maintained.</Text>
            </View>
          )}

          <Text style={styles.sectionHeader}>Warm-Up Sequence</Text>
          {warmups.length > 0 ? warmups.map((w, idx) => (
            <View key={w.id || idx} style={styles.itemRow}>
              <Ionicons name="flame-outline" size={20} color={colors.primary} />
              <View style={styles.itemCopy}>
                <Text style={styles.itemTitle}>{w.name}</Text>
                <Text style={styles.itemMeta}>{w.reps} reps · {w.equipment}</Text>
              </View>
            </View>
          )) : (
            <Text style={styles.bodyCopy}>No specific warm-up generated.</Text>
          )}

          <Text style={styles.sectionHeader}>Main Workout</Text>
          {adaptedPlan.items.map((item, idx) => (
            <View key={item.id || idx} style={styles.itemRow}>
              <Ionicons name="barbell-outline" size={20} color={colors.ink} />
              <View style={styles.itemCopy}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemMeta}>
                  {item.sets} sets · {item.reps} reps
                  {item.isAdapted ? ' (Adapted)' : ''}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.footer}>
          <Button title="Confirm & Start Workout" onPress={handleStartWorkout} />
        </View>
      </SafeAreaView>
    );
  }

  // default: 'questions'
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MotionPressable style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={colors.ink} />
        </MotionPressable>
        <Text style={styles.headerTitle}>Readiness Check</Text>
        <View style={styles.iconButton} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.prompt}>How are you feeling today?</Text>

        <Text style={styles.questionLabel}>Energy Level</Text>
        <View style={styles.optionsRow}>
          {ENERGY_OPTIONS.map(opt => (
            <MotionPressable
              key={opt}
              style={[styles.optionChip, energy === opt && styles.optionChipActive]}
              onPress={() => setEnergy(opt)}
            >
              <Text style={[styles.optionText, energy === opt && styles.optionTextActive]}>{opt}</Text>
            </MotionPressable>
          ))}
        </View>

        <Text style={styles.questionLabel}>Sleep Quality</Text>
        <View style={styles.optionsRow}>
          {SLEEP_OPTIONS.map(opt => (
            <MotionPressable
              key={opt}
              style={[styles.optionChip, sleep === opt && styles.optionChipActive]}
              onPress={() => setSleep(opt)}
            >
              <Text style={[styles.optionText, sleep === opt && styles.optionTextActive]}>{opt}</Text>
            </MotionPressable>
          ))}
        </View>

        <Text style={styles.questionLabel}>Muscle Soreness / Pain</Text>
        <View style={styles.optionsRow}>
          {SORENESS_OPTIONS.map(opt => (
            <MotionPressable
              key={opt}
              style={[
                styles.optionChip,
                soreness === opt && (opt === 'Pain' ? styles.optionChipDanger : styles.optionChipActive)
              ]}
              onPress={() => setSoreness(opt)}
            >
              <Text style={[
                styles.optionText,
                soreness === opt && (opt === 'Pain' ? styles.optionTextDanger : styles.optionTextActive)
              ]}>
                {opt}
              </Text>
            </MotionPressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Evaluate Readiness" onPress={handleEvaluate} />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors) => ({
  container: { flex: 1, backgroundColor: colors.canvas },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingTop: spacing.xs, paddingBottom: spacing.xs },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.cardTitle, color: colors.ink },
  content: { paddingHorizontal: spacing.screen, paddingVertical: spacing.md },
  prompt: { ...typography.screenTitle, color: colors.ink, marginBottom: spacing.xl },
  questionLabel: { ...typography.cardTitle, color: colors.ink, marginBottom: spacing.sm },
  optionsRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.lg },
  optionChip: { flex: 1, minHeight: 44, paddingVertical: spacing.sm, paddingHorizontal: spacing.xs, alignItems: 'center', justifyContent: 'center', borderRadius: radius.control, backgroundColor: colors.surfaceWarm, borderWidth: 1, borderColor: colors.border },
  optionChipActive: { backgroundColor: colors.selectedSoft, borderColor: colors.primary },
  optionChipDanger: { backgroundColor: colors.performanceSoft, borderColor: colors.performance },
  optionText: { ...typography.action, color: colors.textSecondary, textAlign: 'center' },
  optionTextActive: { ...typography.action, color: colors.primary },
  optionTextDanger: { ...typography.action, color: colors.performance },
  footer: { paddingHorizontal: spacing.screen, paddingVertical: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, backgroundColor: colors.canvas },
  centerCard: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.screen, gap: spacing.md },
  title: { ...typography.screenTitle, color: colors.ink, textAlign: 'center' },
  bodyCopy: { ...typography.body, color: colors.muted, textAlign: 'center', marginBottom: spacing.xl },
  adaptationAlert: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.selectedSoft, padding: spacing.md, borderRadius: radius.control, marginBottom: spacing.xl },
  adaptationText: { ...typography.body, color: colors.primary, flex: 1 },
  readyAlert: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.accentLight, padding: spacing.md, borderRadius: radius.control, marginBottom: spacing.xl },
  readyText: { ...typography.body, color: colors.accent, flex: 1 },
  sectionHeader: { ...typography.metaSmall, color: colors.muted, marginBottom: spacing.md, marginTop: spacing.lg },
  itemRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center', backgroundColor: colors.surfaceWarm, padding: spacing.md, borderRadius: radius.control, marginBottom: spacing.xs },
  itemCopy: { flex: 1 },
  itemTitle: { ...typography.cardTitle, color: colors.ink },
  itemMeta: { ...typography.caption, color: colors.muted, marginTop: 2 },
});
