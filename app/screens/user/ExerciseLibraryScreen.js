import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, TextInput, StatusBar, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { LinearTransition, ReduceMotion } from 'react-native-reanimated';
import { exercises } from '../../data/exercises';
import { colors, typography, spacing, radius, componentSizes } from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';
import { resolveExerciseAnatomyImage } from '../../data/exerciseAnatomyImages';
import { resolveExerciseDemonstration } from '../../data/exerciseDemonstrationImages';
import MotionPressable from '../../components/MotionPressable';
import { getCategoryById, getCategoryExercises } from '../../data/workoutCategories';
import {
  getDefaultVariation,
  getExerciseVariations,
  getVariationCount,
} from '../../data/exerciseVariations';

const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Abs', 'Legs', 'Glutes'];
const EXERCISE_LAYOUT = LinearTransition.duration(180).reduceMotion(ReduceMotion.System);

export default function ExerciseLibraryScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState(route?.params?.initialMuscle || 'All');
  const [activeCategoryId, setActiveCategoryId] = useState(route?.params?.initialCategoryId || null);
  const activeCategory = getCategoryById(activeCategoryId);
  const categoryExercises = useMemo(
    () => (activeCategoryId ? getCategoryExercises(activeCategoryId) : exercises),
    [activeCategoryId],
  );

  useEffect(() => {
    const requestedMuscle = route?.params?.initialMuscle;
    if (requestedMuscle && MUSCLE_GROUPS.includes(requestedMuscle)) {
      setSelectedMuscle(requestedMuscle);
    }
  }, [route?.params?.initialMuscle]);

  useEffect(() => {
    const requestedCategory = route?.params?.initialCategoryId;
    setActiveCategoryId(getCategoryById(requestedCategory)?.id || null);
    if (requestedCategory) setSelectedMuscle('All');
  }, [route?.params?.initialCategoryId]);

  // Filter exercises based on search and selected muscle group
  const filteredExercises = categoryExercises.filter((ex) => {
    const familyId = ex.exerciseFamilyId || ex.id;
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const variationSearchText = getExerciseVariations(familyId)
      .map((variation) => `${variation.name} ${variation.summary} ${variation.primaryMuscles.join(' ')}`)
      .join(' ')
      .toLowerCase();
    const matchesSearch =
      normalizedQuery.length === 0 ||
      ex.name.toLowerCase().includes(normalizedQuery) ||
      variationSearchText.includes(normalizedQuery);
    const matchesMuscle = selectedMuscle === 'All' || ex.muscleGroup === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  const selectMuscle = (muscle) => {
    if (muscle === selectedMuscle) return;

    setSelectedMuscle(muscle);
    void Haptics.selectionAsync().catch((error) => {
      console.warn('Haptic feedback was unavailable.', error);
    });
  };

  const renderFilterPill = ({ item }) => (
    <MotionPressable
      style={[
        styles.filterPill,
        selectedMuscle === item && styles.filterPillActive,
      ]}
      onPress={() => selectMuscle(item)}
      accessibilityRole="button"
      accessibilityState={{ selected: selectedMuscle === item }}
    >
      <Text
        style={[
          styles.filterPillText,
          selectedMuscle === item && styles.filterPillTextActive,
        ]}
      >
        {item}
      </Text>
    </MotionPressable>
  );

  const renderExerciseCard = ({ item }) => {
    const familyId = item.exerciseFamilyId || item.id;
    const selectedVariation = item.exerciseVariantId
      ? getExerciseVariations(familyId).find((variation) => variation.id === item.exerciseVariantId)
      : getDefaultVariation(familyId);
    const defaultVariation = selectedVariation || getDefaultVariation(familyId);
    const demonstration = resolveExerciseDemonstration(item.exerciseVariantId, familyId, 'male');
    const thumbnailSource = demonstration
      ? demonstration.thumbnail
      : resolveExerciseAnatomyImage(item.id, user?.gender, 'front');
    const variationCount = getVariationCount(familyId);

    return (
      <MotionPressable
        style={styles.card}
        onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })}
        accessibilityRole="button"
        accessibilityLabel={`${item.name}. ${variationCount} variations. ${item.muscleGroup}.`}
      >
        <View style={styles.cardImageFrame}>
          <Image
            source={thumbnailSource}
            style={styles.cardImage}
            resizeMode={demonstration ? 'cover' : 'contain'}
            accessible
            accessibilityLabel={demonstration
              ? `${defaultVariation.name} male exercise demonstration`
              : `${item.name} front muscle target preview`}
          />
        </View>
      
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.border}
              style={styles.cardChevron}
            />
          </View>
          <Text style={styles.cardMuscle}>{item.muscleGroup} · {variationCount} variations</Text>

          <View style={styles.cardTagsRow}>
            <View style={styles.tag}>
              <Ionicons name="fitness-outline" size={14} color={colors.accent} />
              <Text style={[styles.tagText, { color: colors.accent }]}>{item.equipment}</Text>
            </View>
            <View style={styles.tag}>
              <Ionicons name="speedometer-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.tagText}>{item.difficulty}</Text>
            </View>
            <View style={styles.tag}>
              <Ionicons name="repeat-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.tagText}>{item.sets}x{item.reps}</Text>
            </View>
          </View>
        </View>
      </MotionPressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{activeCategory?.title || 'Exercise Library'}</Text>
        <Text style={styles.headerCopy}>{activeCategory?.description || 'Find the right movement for today’s workout.'}</Text>
      </View>

      {activeCategory ? (
        <View style={styles.categoryBanner}>
          <View style={styles.categoryBannerCopy}>
            <Text style={styles.categoryBannerTitle}>{filteredExercises.length} mapped exercise{filteredExercises.length === 1 ? '' : 's'}</Text>
            <Text style={styles.categoryBannerMeta}>Search and muscle filters apply inside this category.</Text>
          </View>
          <MotionPressable
            onPress={() => setActiveCategoryId(null)}
            accessibilityRole="button"
            accessibilityLabel="Clear category"
            style={styles.clearCategoryButton}
          >
            <Text style={styles.clearCategoryText}>Clear</Text>
          </MotionPressable>
        </View>
      ) : null}
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.accent} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <MotionPressable
            style={styles.clearSearchButton}
            onPress={() => setSearchQuery('')}
            accessibilityRole="button"
            accessibilityLabel="Clear exercise search"
          >
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </MotionPressable>
        )}
      </View>

      {/* Filter Pills */}
      <View style={styles.filterContainer}>
        <FlatList
          data={MUSCLE_GROUPS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={renderFilterPill}
          contentContainerStyle={{ paddingHorizontal: spacing.screen }}
        />
      </View>

      {/* Exercise List */}
      <Animated.FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseCard}
        itemLayoutAnimation={EXERCISE_LAYOUT}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="barbell-outline" size={48} color={colors.accent} />
            </View>
            <Text style={styles.emptyText}>No exercises found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  header: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.canvas,
  },
  headerTitle: {
    ...typography.displayLarge,
    color: colors.textPrimary,
  },
  headerCopy: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.micro,
  },
  categoryBanner: {
    marginHorizontal: spacing.screen,
    padding: spacing.md,
    borderRadius: radius.control,
    backgroundColor: colors.selectedSoft,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryBannerCopy: { flex: 1 },
  categoryBannerTitle: { ...typography.action, color: colors.primary },
  categoryBannerMeta: { ...typography.caption, color: colors.muted, marginTop: spacing.micro },
  clearCategoryButton: { minWidth: 52, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  clearCategoryText: { ...typography.action, color: colors.primary },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceWarm,
    marginHorizontal: spacing.screen,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.control,
    paddingHorizontal: spacing.md,
    height: componentSizes.searchHeight,
    borderWidth: 1,
    borderColor: colors.surfaceWarm,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
  },
  clearSearchButton: {
    width: 44,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  filterContainer: {
    marginBottom: spacing.md,
  },
  filterPill: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.white,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
  },
  filterPillText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  filterPillTextActive: {
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.screen,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceWarm,
    borderRadius: radius.control,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 0,
    alignItems: 'center',
  },
  cardImageFrame: {
    width: 72,
    height: 56,
    borderRadius: radius.control,
    backgroundColor: colors.white,
    marginRight: spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: 0,
  },
  cardTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    flex: 1,
    flexShrink: 1,
  },
  cardChevron: {
    flexShrink: 0,
    marginLeft: spacing.xs,
  },
  cardMuscle: {
    ...typography.statLabel,
    color: colors.textSecondary,
    marginTop: radius.subtle,
    marginBottom: spacing.sm,
  },
  cardTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.selectedSoft,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.micro,
    borderRadius: radius.control,
    gap: spacing.micro,
  },
  tagText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: spacing.xxl,
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
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
});
