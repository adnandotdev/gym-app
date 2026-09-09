import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutPlan } from '../../context/WorkoutPlanContext';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { typography, spacing, radius, componentSizes } from '../../theme/colors';
import { useAppTheme } from '../../context/ThemeContext';
import useThemedStyles from '../../theme/useThemedStyles';
import { resolveExerciseDemonstration } from '../../data/exerciseDemonstrationImages';
import { getTodayName } from '../../domain/workoutSession';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WorkoutPlanScreen({ navigation, route }) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const [selectedDay, setSelectedDay] = useState(route?.params?.initialDay || getTodayName());
  const { plan, loading, loadPlan, removeExercise, clearDay } = useWorkoutPlan();
  const [refreshing, setRefreshing] = useState(false);

  const todayName = getTodayName();

  const planExercises = plan[selectedDay] || [];

  useEffect(() => {
    if (DAYS.includes(route?.params?.initialDay)) setSelectedDay(route.params.initialDay);
  }, [route?.params?.initialDay]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPlan();
    setRefreshing(false);
  };

  const handleRemoveExercise = (id) => {
    Alert.alert(
      "Remove Exercise",
      "Are you sure you want to remove this exercise?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: async () => {
            try {
              await removeExercise(selectedDay, id);
              Toast.show({ type: 'success', text1: 'Removed', text2: 'Exercise removed from plan.' });
            } catch (e) {
              console.log(e);
            }
          }
        }
      ]
    );
  };

  const handleClearDay = () => {
    if (planExercises.length === 0) return;
    Alert.alert(
      "Clear Day",
      `Are you sure you want to remove all exercises for ${selectedDay}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: async () => {
            try {
              await clearDay(selectedDay);
              Toast.show({ type: 'success', text1: 'Cleared', text2: `${selectedDay} is now empty.` });
            } catch (e) {
              console.log(e);
            }
          }
        }
      ]
    );
  };

  const renderDayPill = ({ item }) => (
    <View style={styles.dayPillContainer}>
      <TouchableOpacity
        style={[styles.dayPill, selectedDay === item && styles.dayPillActive]}
        onPress={() => setSelectedDay(item)}
        accessibilityRole="button"
        accessibilityLabel={item === todayName ? `${item}, today` : item}
        accessibilityState={{ selected: selectedDay === item }}
      >
        <Text style={[styles.dayPillText, selectedDay === item && styles.dayPillTextActive]}>
          {item.charAt(0)}
        </Text>
      </TouchableOpacity>
      {item === todayName && <View style={styles.todayDot} />}
    </View>
  );

  const renderPlanExercise = ({ item }) => {
    const targetLabel = /[a-z]/i.test(String(item.reps)) ? item.reps : `${item.reps} reps`;
    const demonstration = resolveExerciseDemonstration(
      item.exerciseVariantId || item.id,
      item.exerciseFamilyId,
      'male',
    );

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardOpenArea}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })}
          accessibilityRole="button"
          accessibilityLabel={`${item.name}. ${item.variationSummary || item.muscleGroup}. ${item.sets} sets of ${targetLabel}.`}
        >
          <View style={styles.cardImageBox}>
            {demonstration ? (
              <Image
                source={demonstration.thumbnail}
                style={styles.cardImage}
                resizeMode="contain"
                accessible={false}
                importantForAccessibility="no"
              />
            ) : (
              <Ionicons name="barbell-outline" size={24} color={colors.accent} />
            )}
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
            {item.variationSummary ? (
              <Text style={styles.cardVariation} numberOfLines={2}>{item.variationSummary}</Text>
            ) : null}
            <Text style={styles.cardSubtitle}>
              {item.sets} Sets • {targetLabel}{item.equipment ? ` • ${item.equipment}` : ''}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleRemoveExercise(item.exerciseVariantId || item.id)}
          style={styles.deleteBtn}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${item.name} from ${selectedDay}`}
        >
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>My Workout Plan</Text>
          <Text style={styles.headerCopy}>Choose a day and build your workout.</Text>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Clear ${selectedDay} workout`}
          accessibilityState={{ disabled: planExercises.length === 0 }}
          onPress={handleClearDay}
          style={styles.clearBtn}
          disabled={planExercises.length === 0}
        >
          <Ionicons name="trash-bin" size={24} color={planExercises.length === 0 ? colors.textSecondary : colors.danger} />
        </TouchableOpacity>
      </View>

      <View style={styles.daysContainer}>
        <FlatList
          data={DAYS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={renderDayPill}
          style={styles.dayList}
          contentContainerStyle={styles.daysContent}
        />
      </View>

      {planExercises.length > 0 ? (
        <TouchableOpacity
          style={styles.startWorkoutButton}
          onPress={() => navigation.navigate('WorkoutReadiness', { day: selectedDay, exercises: planExercises, source: 'plan' })}
          accessibilityRole="button"
          accessibilityLabel={`Start ${selectedDay} workout with ${planExercises.length} exercises`}
        >
          <Ionicons name="play" size={20} color={colors.accentOnDark} />
          <Text style={styles.startWorkoutText}>Start {selectedDay === todayName ? 'Today’s' : `${selectedDay}’s`} Workout</Text>
        </TouchableOpacity>
      ) : null}

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={planExercises}
          keyExtractor={(item) => item.id}
          renderItem={renderPlanExercise}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingBottom: componentSizes.floatingActionSize + spacing.xl + insets.bottom,
            },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBox}>
                <Ionicons name="calendar-clear-outline" size={48} color={colors.accent} />
              </View>
              <Text style={styles.emptyTitle}>Rest Day</Text>
              <Text style={styles.emptyText}>No exercises planned for {selectedDay}.</Text>
              
              <TouchableOpacity 
                style={styles.emptyBtn} 
                onPress={() => navigation.navigate('ExerciseLibrary')}
              >
                <Text style={styles.emptyBtnText}>Browse Exercises</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      <TouchableOpacity 
        style={[styles.fab, { bottom: spacing.screen + insets.bottom }]}
        accessibilityRole="button"
        accessibilityLabel="Add exercise to workout plan"
        activeOpacity={0.8}
        onPress={() => navigation.navigate('ExerciseLibrary')}
      >
        <Ionicons name="add" size={28} color={colors.accentOnDark} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const createStyles = (colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.canvas,
  },
  headerTitle: {
    ...typography.displayLarge,
    color: colors.textPrimary,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    paddingRight: spacing.sm,
  },
  headerCopy: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.micro,
  },
  clearBtn: {
    width: 44,
    height: 44,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daysContainer: {
    paddingTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  dayList: { flexGrow: 0 },
  daysContent: {
    paddingHorizontal: spacing.screen,
  },
  startWorkoutButton: {
    minHeight: 52,
    marginHorizontal: spacing.screen,
    marginBottom: spacing.md,
    borderRadius: radius.control,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  startWorkoutText: { ...typography.action, color: colors.accentOnDark, flexShrink: 1, textAlign: 'center' },
  dayPillContainer: {
    alignItems: 'center',
    marginRight: spacing.xs,
    minHeight: 54,
  },
  dayPill: {
    width: 44,
    height: 44,
    borderRadius: radius.control,
    backgroundColor: colors.surfaceWarm,
    borderWidth: 1,
    borderColor: colors.hairline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayPillActive: {
    backgroundColor: colors.primary,
  },
  dayPillText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
  dayPillTextActive: {
    color: colors.accentOnDark,
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.performance,
    marginTop: spacing.micro,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screen,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceWarm,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
  },
  cardOpenArea: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImageBox: {
    width: 80,
    aspectRatio: 4 / 3,
    borderRadius: radius.subtle,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    flex: 1,
  },
  cardVariation: {
    ...typography.caption,
    color: colors.bodySecondary,
    marginTop: spacing.micro,
  },
  cardSubtitle: {
    ...typography.statLabel,
    color: colors.textSecondary,
    marginTop: spacing.micro,
  },
  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.control,
    backgroundColor: colors.selectedSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.micro,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.xxl,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: spacing.md,
  },
  emptyText: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontSize: 15,
  },
  emptyBtn: {
    marginTop: spacing.screen,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: radius.control,
  },
  emptyBtnText: {
    color: colors.accentOnDark,
    fontWeight: '400',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: spacing.screen,
    width: componentSizes.floatingActionSize,
    height: componentSizes.floatingActionSize,
    borderRadius: radius.control,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
