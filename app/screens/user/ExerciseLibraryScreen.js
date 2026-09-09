import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, TextInput, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { LinearTransition, ReduceMotion } from 'react-native-reanimated';
import { exercises } from '../../data/exercises';
import { typography, spacing, radius } from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';
import { useAppTheme } from '../../context/ThemeContext';
import { resolveExerciseAnatomyImage } from '../../data/exerciseAnatomyImages';
import { resolveExerciseDemonstration } from '../../data/exerciseDemonstrationImages';
import MotionPressable from '../../components/MotionPressable';
import useThemedStyles from '../../theme/useThemedStyles';
import { CANONICAL_EQUIPMENT, normalizeEquipmentAlias } from '../../data/taxonomies';
import { getCategoryById, getCategoryExercises } from '../../data/workoutCategories';
import {
  getExerciseVariations,
  getVariationCount,
} from '../../data/exerciseVariations';

const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Abs', 'Legs', 'Glutes'];
const EXERCISE_LAYOUT = LinearTransition.duration(180).reduceMotion(ReduceMotion.System);

export default function ExerciseLibraryScreen({ navigation, route }) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState(route?.params?.initialMuscle || 'All');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
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

    // F05: Ensure strict equipment matching using canonical taxonomies
    const normalizedEq = normalizeEquipmentAlias(ex.equipment);
    const matchesEquipment = !selectedEquipmentId || normalizedEq === selectedEquipmentId;

    return matchesSearch && matchesMuscle && matchesEquipment;
  });

  const selectMuscle = (muscle) => {
    if (muscle === selectedMuscle) return;

    setSelectedMuscle(muscle);
    void Haptics.selectionAsync().catch((error) => {
      console.warn('Haptic feedback was unavailable.', error);
    });
  };

  const selectEquipment = (equipmentId) => {
    if (equipmentId === selectedEquipmentId) return;
    setSelectedEquipmentId(equipmentId);
    void Haptics.selectionAsync().catch((error) => {
      console.warn('Haptic feedback was unavailable.', error);
    });
  };

  const equipmentOptions = useMemo(() => [{ id: null, name: 'Any Equipment' }, ...CANONICAL_EQUIPMENT], []);

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

  const renderEquipmentPill = ({ item }) => (
    <MotionPressable
      style={[
        styles.filterPill,
        selectedEquipmentId === item.id && styles.filterPillActive,
      ]}
      onPress={() => selectEquipment(item.id)}
      accessibilityRole="button"
      accessibilityState={{ selected: selectedEquipmentId === item.id }}
    >
      <Text
        style={[
          styles.filterPillText,
          selectedEquipmentId === item.id && styles.filterPillTextActive,
        ]}
      >
        {item.name}
      </Text>
    </MotionPressable>
  );

  const renderExerciseCard = ({ item }) => {
    const familyId = item.exerciseFamilyId || item.id;
    const demonstration = resolveExerciseDemonstration(item.exerciseVariantId, familyId, 'male');
    const thumbnailSource = demonstration
      ? demonstration.thumbnail
      : resolveExerciseAnatomyImage(item.id, user?.gender, 'front');
    const variationCount = getVariationCount(familyId);
    const targetLabel = /[a-z]/i.test(String(item.reps)) ? item.reps : `${item.reps} reps`;

    return (
      <MotionPressable
        style={styles.card}
        onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })}
        accessibilityRole="button"
        accessibilityLabel={`${item.name}. ${item.muscleGroup}. ${variationCount} variations. Equipment: ${item.equipment}. ${item.difficulty}. ${item.sets} sets of ${targetLabel}.`}
        accessibilityHint="Opens exercise instructions and variations"
      >
        <View style={styles.cardImageFrame}>
          <Image
            source={thumbnailSource}
            style={styles.cardImage}
            resizeMode="contain"
            accessible={false}
            importantForAccessibility="no"
          />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.border}
              style={styles.cardChevron}
            />
          </View>
          <Text style={styles.cardMuscle} numberOfLines={1} ellipsizeMode="tail">
            {item.muscleGroup} · {variationCount} variations
          </Text>

          <View style={styles.cardMetaRow}>
            <Ionicons name="fitness-outline" size={14} color={colors.accent} />
            <Text style={styles.cardMetaText} numberOfLines={1} ellipsizeMode="tail">
              {item.equipment} · {item.difficulty} · {item.sets}×{item.reps}
            </Text>
          </View>
        </View>
      </MotionPressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        {navigation.canGoBack() ? (
          <MotionPressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color={colors.ink} />
          </MotionPressable>
        ) : null}
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{activeCategory?.title || 'Exercise Library'}</Text>
          <Text style={styles.headerCopy}>{activeCategory?.description || 'Find the right movement for today’s workout.'}</Text>
        </View>
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
          accessibilityLabel="Search exercises"
          returnKeyType="search"
          autoCorrect={false}
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
          style={styles.filterRow}
          contentContainerStyle={styles.filterRowContent}
          keyboardShouldPersistTaps="handled"
        />
        <FlatList
          data={equipmentOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id || 'any'}
          renderItem={renderEquipmentPill}
          style={styles.filterRow}
          contentContainerStyle={styles.filterRowContent}
          keyboardShouldPersistTaps="handled"
        />
      </View>

      {/* Exercise List */}
      <Animated.FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseCard}
        itemLayoutAnimation={EXERCISE_LAYOUT}
        style={styles.resultsList}
        contentContainerStyle={styles.listContent}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
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

const createStyles = (colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.canvas,
  },
  headerText: { flex: 1, minWidth: 0 },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
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
    padding: spacing.sm,
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
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
    borderRadius: radius.control,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    ...typography.body,
    flex: 1,
    minWidth: 0,
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
  },
  clearSearchButton: {
    width: 44,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  filterContainer: {
    marginBottom: spacing.sm,
    gap: spacing.micro,
  },
  filterRow: { flexGrow: 0 },
  filterRowContent: { paddingHorizontal: spacing.screen, alignItems: 'center' },
  filterPill: {
    minHeight: 44,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.surface,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoft,
  },
  filterPillText: {
    ...typography.metaSmall,
    color: colors.textPrimary,
  },
  filterPillTextActive: {
    color: colors.primary,
  },
  resultsList: { flex: 1 },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.screen,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceWarm,
    borderRadius: radius.control,
    borderCurve: 'continuous',
    minHeight: 96,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 0,
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardImageFrame: {
    width: 96,
    height: 72,
    flexShrink: 0,
    borderRadius: radius.subtle,
    borderCurve: 'continuous',
    backgroundColor: colors.surface,
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
    minHeight: 72,
    justifyContent: 'center',
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
    marginTop: spacing.micro,
    marginBottom: spacing.micro,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.micro,
    minWidth: 0,
  },
  cardMetaText: {
    ...typography.metaSmall,
    flex: 1,
    minWidth: 0,
    color: colors.textSecondary,
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
