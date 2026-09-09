import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MotionPressable from '../../components/MotionPressable';
import { useWorkoutActivity } from '../../context/WorkoutActivityContext';
import { useWorkoutPlan } from '../../context/WorkoutPlanContext';
import { useAppTheme } from '../../context/ThemeContext';
import { getRecordsForDate, getTodayName } from '../../domain/workoutSession';
import { radius, spacing, typography } from '../../theme/colors';
import useThemedStyles from '../../theme/useThemedStyles';

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
};

export default function ActivityScreen({ navigation }) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
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
    navigation.navigate('WorkoutReadiness', { day: todayName, exercises: todayExercises, source: 'plan' });
  };

  const renderHistory = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={styles.historyIcon}>
        <Ionicons name={item.completedCount + item.partialCount > 0 ? 'checkmark' : 'play-skip-forward'} size={20} color={colors.primary} />
      </View>
      <View style={styles.historyCopy}>
        <Text style={styles.historyTitle}>{item.day} workout</Text>
        <Text style={styles.historyMeta}>
          {item.completedCount} completed · {item.partialCount} partial · {item.skippedCount} skipped · {formatDuration(item.totalElapsedSeconds)}
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
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={(
          <>
            <Text style={styles.title}>Activity</Text>
            <Text style={styles.subtitle}>Your planned workouts and completed sessions.</Text>

            <View style={styles.todayCard}>
              <View style={styles.todayHeader}>
                <View style={styles.todayCopy}>
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

const createStyles = (colors) => ({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: spacing.screen, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  title: { ...typography.displayLarge, color: colors.ink },
  subtitle: { ...typography.caption, color: colors.muted, marginTop: spacing.micro },
  todayCard: { marginTop: spacing.md, padding: spacing.md, borderRadius: radius.card, borderCurve: 'continuous', backgroundColor: colors.primary },
  todayHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  todayCopy: { flex: 1, minWidth: 0 },
  eyebrow: { ...typography.metaSmall, color: colors.mutedOnPrimary },
  todayTitle: { ...typography.cardTitle, color: colors.accentOnDark, marginTop: spacing.micro },
  todayMeta: { ...typography.caption, color: colors.mutedOnPrimary, marginTop: spacing.micro },
  countCircle: { width: 48, height: 48, flexShrink: 0, borderRadius: 24, borderWidth: 1, borderColor: colors.accentOnDark, alignItems: 'center', justifyContent: 'center' },
  countText: { ...typography.cardTitle, color: colors.accentOnDark },
  primaryAction: { minHeight: 48, borderRadius: radius.control, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, backgroundColor: colors.accentOnDark, alignItems: 'center', justifyContent: 'center', marginTop: spacing.md },
  primaryActionText: { ...typography.action, color: colors.primary, textAlign: 'center' },
  libraryAction: { minHeight: 88, borderRadius: radius.card, borderCurve: 'continuous', backgroundColor: colors.surfaceWarm, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  libraryIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  libraryCopy: { flex: 1 },
  libraryTitle: { ...typography.cardTitle, color: colors.ink },
  libraryMeta: { ...typography.caption, color: colors.muted, marginTop: spacing.micro },
  sectionTitle: { ...typography.cardTitle, color: colors.ink, marginTop: spacing.lg, marginBottom: spacing.sm },
  historyCard: { minHeight: 72, backgroundColor: colors.surfaceWarm, borderRadius: radius.control, borderCurve: 'continuous', padding: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  historyIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  historyCopy: { flex: 1 },
  historyTitle: { ...typography.action, color: colors.ink },
  historyMeta: { ...typography.caption, color: colors.muted, marginTop: spacing.micro },
  loader: { marginTop: spacing.xl },
  emptyState: { alignItems: 'center', padding: spacing.lg, backgroundColor: colors.surfaceWarm, borderRadius: radius.card, borderCurve: 'continuous' },
  emptyTitle: { ...typography.cardTitle, color: colors.ink, marginTop: spacing.md },
  emptyMeta: { ...typography.caption, color: colors.muted, textAlign: 'center', marginTop: spacing.xs },
});
