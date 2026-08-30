import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
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
import { colors, typography, spacing, radius, componentSizes } from '../../theme/colors';
import { resolveExerciseDemonstration } from '../../data/exerciseDemonstrationImages';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WorkoutPlanScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedDay, setSelectedDay] = useState('Monday');
  const { plan, loading, loadPlan, removeExercise, clearDay } = useWorkoutPlan();
  const [refreshing, setRefreshing] = useState(false);

  const currentDayIndex = new Date().getDay();
  const todayName = currentDayIndex === 0 ? 'Sunday' : DAYS[currentDayIndex - 1];

  const planExercises = plan[selectedDay] || [];

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
      >
        <Text style={[styles.dayPillText, selectedDay === item && styles.dayPillTextActive]}>
          {item.charAt(0)}
        </Text>
      </TouchableOpacity>
      {item === todayName && <View style={styles.todayDot} />}
    </View>
  );

  const renderPlanExercise = ({ item }) => {
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
          accessibilityLabel={`${item.name}. ${item.variationSummary || item.muscleGroup}. ${item.sets} sets of ${item.reps} reps.`}
        >
          <View style={styles.cardImageBox}>
            {demonstration ? (
              <Image
                source={demonstration.thumbnail}
                style={styles.cardImage}
                resizeMode="cover"
                accessible={false}
                importantForAccessibility="no"
              />
            ) : (
              <Ionicons name="barbell-outline" size={24} color={colors.accent} />
            )}
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            {item.variationSummary ? (
              <Text style={styles.cardVariation} numberOfLines={2}>{item.variationSummary}</Text>
            ) : null}
            <Text style={styles.cardSubtitle}>
              {item.sets} Sets • {item.reps} Reps{item.equipment ? ` • ${item.equipment}` : ''}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleRemoveExercise(item.id)}
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
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>My Workout Plan</Text>
          <Text style={styles.headerCopy}>A focused weekly gallery of movement.</Text>
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
          contentContainerStyle={styles.daysContent}
        />
      </View>

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
                onPress={() => navigation.navigate('Exercises')}
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
        onPress={() => navigation.navigate('Exercises')}
      >
        <Ionicons name="add" size={28} color={colors.background} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    backgroundColor: colors.canvas,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
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
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
  },
  daysContent: {
    paddingHorizontal: spacing.screen,
  },
  dayPillContainer: {
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  dayPill: {
    width: 44,
    height: 44,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayPillActive: {
    backgroundColor: colors.ink,
  },
  dayPillText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
  dayPillTextActive: {
    color: colors.textOnDark,
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
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.md,
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
    width: 72,
    aspectRatio: 4 / 3,
    borderRadius: radius.control,
    backgroundColor: colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
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
    marginTop: 4,
  },
  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.control,
    backgroundColor: colors.selectedSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
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
    backgroundColor: colors.ink,
    borderRadius: radius.control,
  },
  emptyBtnText: {
    color: colors.textOnDark,
    fontWeight: '400',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: spacing.screen,
    width: componentSizes.floatingActionSize,
    height: componentSizes.floatingActionSize,
    borderRadius: radius.control,
    backgroundColor: colors.ink,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
