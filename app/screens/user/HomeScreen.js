import React, { useMemo } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MotionPressable from '../../components/MotionPressable';
import { useWorkoutActivity } from '../../context/WorkoutActivityContext';
import { useWorkoutPlan } from '../../context/WorkoutPlanContext';
import { WORKOUT_CATEGORIES, getCategorySummary } from '../../data/workoutCategories';
import { DAY_NAMES, getRecordsForDate, getTodayName } from '../../domain/workoutSession';
import { colors, radius, spacing, typography } from '../../theme/colors';

const CATEGORY_IMAGES = {
  'full-body-warm-up': require('../../../assets/images/figma/warmup.png'),
  'strength-exercise': require('../../../assets/images/figma/strength.png'),
  'both-side-plank': require('../../../assets/images/figma/side-plank.png'),
  'abs-workout': require('../../../assets/images/figma/abs.png'),
  'torso-trap-workout': require('../../../assets/images/figma/torso.png'),
  'lower-back-exercise': require('../../../assets/images/figma/lower-back.png'),
};

const categoryChips = [
  { label: 'All', categoryId: null },
  { label: 'Warm Up', categoryId: 'full-body-warm-up' },
  { label: 'Strength', categoryId: 'strength-exercise' },
  { label: 'Core', categoryId: 'abs-workout' },
  { label: 'Lower Back', categoryId: 'lower-back-exercise' },
];

function SectionHeader({ title, onPress }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <MotionPressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`See all ${title.toLowerCase()}`}>
        <Text style={styles.seeAll}>See All</Text>
      </MotionPressable>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { plan, loading } = useWorkoutPlan();
  const { history } = useWorkoutActivity();
  const todayName = getTodayName();
  const todayExercises = plan[todayName] || [];

  const visibleDays = useMemo(() => {
    const todayIndex = DAY_NAMES.indexOf(todayName);
    return [0, 1, 2].map((offset) => DAY_NAMES[(todayIndex + offset) % DAY_NAMES.length]);
  }, [todayName]);

  const todayHistory = useMemo(() => getRecordsForDate(history), [history]);
  const latestTodayRecord = todayHistory.find((record) => record.day === todayName);

  const openCategory = (categoryId) => {
    navigation.navigate('ExerciseLibrary', categoryId ? { initialCategoryId: categoryId } : undefined);
  };

  const startTodayWorkout = () => {
    if (loading) return;
    if (todayExercises.length === 0) {
      navigation.navigate('My Plan', { initialDay: todayName, showEmptyPrompt: true });
      return;
    }
    navigation.navigate('WorkoutSession', { day: todayName, exercises: todayExercises, source: 'plan' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.logo}>Muscle<Text style={styles.logoAccent}>Map</Text></Text>
        <MotionPressable style={styles.notificationButton} onPress={() => navigation.navigate('Notifications')} accessibilityRole="button" accessibilityLabel="Open notifications">
          <Ionicons name="notifications-outline" size={24} color={colors.ink} />
          <View style={styles.notificationDot} />
        </MotionPressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#9747FF', '#6F00FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.banner}>
          <View style={styles.bannerCopy}>
            <Text style={styles.bannerEyebrow}>{todayName.toUpperCase()} · {todayExercises.length} PLANNED</Text>
            <Text style={styles.bannerTitle}>{todayExercises.length ? 'Your workout is ready' : 'Plan today, then start strong'}</Text>
            <MotionPressable style={styles.bannerButton} onPress={startTodayWorkout} disabled={loading} accessibilityRole="button" accessibilityState={{ disabled: loading }}>
              <Text style={styles.bannerButtonText}>{loading ? 'Loading…' : todayExercises.length ? 'Start Exercise' : 'Plan Today'}</Text>
            </MotionPressable>
          </View>
          <Image source={require('../../../assets/images/figma/home-trainer.png')} style={styles.heroImage} resizeMode="cover" />
        </LinearGradient>

        <SectionHeader title="Progress" onPress={() => navigation.navigate('Activity')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.progressRow}>
          {visibleDays.map((day) => {
            const items = plan[day] || [];
            const recent = day === todayName ? latestTodayRecord : null;
            const completed = Math.min(recent?.completedCount || 0, items.length);
            return (
              <MotionPressable key={day} style={styles.progressCard} onPress={() => navigation.navigate('My Plan', { initialDay: day })} accessibilityRole="button">
                <View style={styles.progressRing}><Text style={styles.progressValue}>{completed}/{items.length}</Text></View>
                <Text style={styles.progressTitle} numberOfLines={1}>{day === todayName ? 'Today' : day}</Text>
                <Text style={styles.progressMeta}>{items.length ? `${items.length} exercises planned` : 'No workout planned'}</Text>
              </MotionPressable>
            );
          })}
        </ScrollView>

        <SectionHeader title="Categories" onPress={() => openCategory(null)} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {categoryChips.map((chip, index) => (
            <MotionPressable key={chip.label} style={[styles.chip, index === 0 && styles.chipActive]} onPress={() => openCategory(chip.categoryId)} accessibilityRole="button" accessibilityLabel={`Show ${chip.label} exercises`}>
              <Text style={[styles.chipText, index === 0 && styles.chipTextActive]}>{chip.label}</Text>
            </MotionPressable>
          ))}
        </ScrollView>

        <View style={styles.categoryList}>
          {WORKOUT_CATEGORIES.map((category) => {
            const summary = getCategorySummary(category.id);
            return (
              <MotionPressable key={category.id} style={styles.categoryCard} onPress={() => navigation.navigate('ExerciseLibrary', { initialCategoryId: category.id })} accessibilityRole="button" accessibilityLabel={`${category.title}. ${summary.exerciseCount} exercises.`}>
                <Image source={CATEGORY_IMAGES[category.id]} style={styles.categoryImage} resizeMode="contain" />
                <View style={styles.categoryCopy}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryMeta}>{summary.exerciseCount} mapped exercise{summary.exerciseCount === 1 ? '' : 's'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.primary} />
              </MotionPressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  header: { height: 58, paddingHorizontal: spacing.screen, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { fontFamily: 'Overpass_700Bold', fontSize: 20, color: colors.ink },
  logoAccent: { color: colors.primary },
  notificationButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  notificationDot: { position: 'absolute', right: 8, top: 9, width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, borderWidth: 1, borderColor: colors.white },
  content: { paddingHorizontal: spacing.screen, paddingBottom: spacing.xl, gap: spacing.md },
  banner: { minHeight: 184, borderRadius: radius.card, overflow: 'hidden', padding: spacing.md, flexDirection: 'row' },
  bannerCopy: { width: '66%', zIndex: 1 },
  bannerEyebrow: { ...typography.metaSmall, color: 'rgba(255,255,255,0.75)', marginBottom: spacing.xs },
  bannerTitle: { fontFamily: 'Overpass_800ExtraBold', fontSize: 24, lineHeight: 27, color: colors.white },
  bannerButton: { marginTop: spacing.md, minHeight: 42, alignSelf: 'flex-start', paddingHorizontal: spacing.md, borderRadius: radius.control, backgroundColor: colors.white, justifyContent: 'center' },
  bannerButtonText: { fontFamily: 'Overpass_700Bold', fontSize: 14, color: colors.primary },
  heroImage: { position: 'absolute', right: -28, bottom: -2, width: 176, height: 150 },
  sectionHeader: { marginTop: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontFamily: 'Overpass_700Bold', fontSize: 20, lineHeight: 26, color: colors.ink },
  seeAll: { fontFamily: 'Overpass_600SemiBold', fontSize: 14, color: colors.primary },
  progressRow: { gap: spacing.md, paddingRight: spacing.screen },
  progressCard: { width: 144, minHeight: 152, borderRadius: radius.card, backgroundColor: colors.surfaceWarm, alignItems: 'center', padding: spacing.md },
  progressRing: { width: 60, height: 60, borderRadius: 30, borderWidth: 4, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  progressValue: { fontFamily: 'Overpass_600SemiBold', fontSize: 14, color: colors.primary },
  progressTitle: { ...typography.action, fontSize: 14, marginTop: spacing.xs, color: colors.ink, width: '100%', textAlign: 'center' },
  progressMeta: { fontFamily: 'Overpass_400Regular', fontSize: 12, color: colors.muted, marginTop: spacing.micro, textAlign: 'center' },
  chipRow: { gap: spacing.xs, paddingRight: spacing.screen },
  chip: { minHeight: 44, paddingHorizontal: spacing.md, borderRadius: radius.chip, borderWidth: 1, borderColor: colors.border, justifyContent: 'center' },
  chipActive: { borderColor: colors.primary },
  chipText: { fontFamily: 'Overpass_500Medium', fontSize: 14, color: colors.muted },
  chipTextActive: { color: colors.primary },
  categoryList: { gap: spacing.md },
  categoryCard: { minHeight: 81, borderRadius: radius.control, backgroundColor: colors.surfaceWarm, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  categoryImage: { width: 64, height: 40 },
  categoryCopy: { flex: 1 },
  categoryTitle: { ...typography.cardTitle, color: colors.ink },
  categoryMeta: { ...typography.caption, color: colors.muted, marginTop: spacing.micro },
});
