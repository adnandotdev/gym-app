import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MotionPressable from '../../components/MotionPressable';
import { useWorkoutActivity } from '../../context/WorkoutActivityContext';
import { useWorkoutPlan } from '../../context/WorkoutPlanContext';
import { getRecordsForDate, getTodayName } from '../../domain/workoutSession';
import { colors, radius, spacing, typography } from '../../theme/colors';

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
};

export default function ActivityScreen({ navigation }) {
  const { history, loading } = useWorkoutActivity();
  const { plan } = useWorkoutPlan();
  const todayName = getTodayName();
  const todayExercises = plan[todayName] || [];
  const todayHistory = useMemo(() => getRecordsForDate(history), [history]);

  const startToday = () => {
    if (todayExercises.length === 0) {
      navigation.navigate('My Plan', { initialDay: todayName });
      return;
    }
    navigation.navigate('WorkoutSession', { day: todayName, exercises: todayExercises, source: 'plan' });
  };

  const renderHistory = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={styles.historyIcon}>
        <Ionicons name={item.completedCount > 0 ? 'checkmark' : 'play-skip-forward'} size={20} color={colors.primary} />
      </View>
      <View style={styles.historyCopy}>
        <Text style={styles.historyTitle}>{item.day} workout</Text>
        <Text style={styles.historyMeta}>
          {item.completedCount} completed · {item.skippedCount} skipped · {formatDuration(item.totalElapsedSeconds)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderHistory}
        contentContainerStyle={styles.content}
        ListHeaderComponent={(
          <>
            <Text style={styles.title}>Activity</Text>
            <Text style={styles.subtitle}>Your planned workouts and completed sessions.</Text>

            <View style={styles.todayCard}>
              <View style={styles.todayHeader}>
                <View>
                  <Text style={styles.eyebrow}>TODAY · {todayName.toUpperCase()}</Text>
                  <Text style={styles.todayTitle}>{todayExercises.length} exercises planned</Text>
                  <Text style={styles.todayMeta}>{todayHistory.length} sessions recorded today</Text>
                </View>
                <View style={styles.countCircle}><Text style={styles.countText}>{todayExercises.length}</Text></View>
              </View>
              <MotionPressable style={styles.primaryAction} onPress={startToday} accessibilityRole="button">
                <Text style={styles.primaryActionText}>{todayExercises.length ? 'Start Today’s Workout' : 'Plan Today’s Workout'}</Text>
              </MotionPressable>
            </View>

            <MotionPressable style={styles.libraryAction} onPress={() => navigation.navigate('ExerciseLibrary')} accessibilityRole="button">
              <View style={styles.libraryIcon}><Ionicons name="barbell-outline" size={24} color={colors.primary} /></View>
              <View style={styles.libraryCopy}>
                <Text style={styles.libraryTitle}>Exercise Library</Text>
                <Text style={styles.libraryMeta}>Browse categories, search movements, and add exercises to your plan.</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.primary} />
            </MotionPressable>

            <Text style={styles.sectionTitle}>Recent workouts</Text>
          </>
        )}
        ListEmptyComponent={loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="stats-chart-outline" size={40} color={colors.muted} />
            <Text style={styles.emptyTitle}>No workout history yet</Text>
            <Text style={styles.emptyMeta}>Complete or skip through a planned workout and it will appear here.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.screen, paddingBottom: spacing.xl, gap: spacing.md },
  title: { ...typography.displayLarge, color: colors.ink },
  subtitle: { ...typography.body, color: colors.muted, marginTop: spacing.micro },
  todayCard: { marginTop: spacing.lg, padding: spacing.lg, borderRadius: radius.card, backgroundColor: colors.primary },
  todayHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { ...typography.metaSmall, color: 'rgba(255,255,255,0.78)' },
  todayTitle: { ...typography.cardTitle, color: colors.white, marginTop: spacing.micro },
  todayMeta: { ...typography.caption, color: 'rgba(255,255,255,0.78)', marginTop: spacing.micro },
  countCircle: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  countText: { ...typography.cardTitle, color: colors.white },
  primaryAction: { minHeight: 48, borderRadius: radius.control, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginTop: spacing.md },
  primaryActionText: { ...typography.action, color: colors.primary },
  libraryAction: { minHeight: 96, borderRadius: radius.card, backgroundColor: colors.surfaceWarm, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.md },
  libraryIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  libraryCopy: { flex: 1 },
  libraryTitle: { ...typography.cardTitle, color: colors.ink },
  libraryMeta: { ...typography.caption, color: colors.muted, marginTop: spacing.micro },
  sectionTitle: { ...typography.cardTitle, color: colors.ink, marginTop: spacing.lg, marginBottom: spacing.xs },
  historyCard: { minHeight: 78, backgroundColor: colors.surfaceWarm, borderRadius: radius.control, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  historyIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  historyCopy: { flex: 1 },
  historyTitle: { ...typography.action, color: colors.ink },
  historyMeta: { ...typography.caption, color: colors.muted, marginTop: spacing.micro },
  loader: { marginTop: spacing.xl },
  emptyState: { alignItems: 'center', padding: spacing.xl, backgroundColor: colors.surfaceWarm, borderRadius: radius.card },
  emptyTitle: { ...typography.cardTitle, color: colors.ink, marginTop: spacing.md },
  emptyMeta: { ...typography.caption, color: colors.muted, textAlign: 'center', marginTop: spacing.xs },
});
