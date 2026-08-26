import React, { useContext } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { colors, typography, spacing, radius, componentSizes } from '../../theme/colors';
import MuscleVisualizer from '../../components/MuscleVisualizer';

const MOTIVATIONAL_QUOTES = [
  "The only bad workout is the one that didn't happen.",
  "Push yourself, because no one else is going to do it for you.",
  "Success starts with self-discipline.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction."
];

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        
        {/* Header: Greeting & Avatar */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.name}>{user?.name || 'Athlete'}</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardLight]}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={[styles.statCard, styles.statCardPearl]}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={[styles.statCard, styles.statCardLight]}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>PRs</Text>
          </View>
        </View>

        {/* Today's Workout Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <Text style={styles.heroTitle}>Today's Workout</Text>
          </View>
          <Text style={styles.heroSubtitle}>Upper Body Power</Text>
          <MuscleVisualizer gender={user?.gender} />
          
          <View style={styles.heroMetaRow}>
            <View style={styles.heroMetaItem}>
              <Ionicons name="time-outline" size={16} color={colors.mutedOnDark} />
              <Text style={styles.heroMetaText}>45 min</Text>
            </View>
            <View style={styles.heroMetaItem}>
              <Ionicons name="flame-outline" size={16} color={colors.mutedOnDark} />
              <Text style={styles.heroMetaText}>254 kcal</Text>
            </View>
            <View style={styles.heroMetaItem}>
              <Ionicons name="barbell-outline" size={16} color={colors.mutedOnDark} />
              <Text style={styles.heroMetaText}>6 Exercises</Text>
            </View>
          </View>

          <View style={styles.heroActions}>
            <TouchableOpacity 
              style={styles.heroBtnOutline} 
              activeOpacity={0.8} 
              onPress={() => navigation.navigate('My Plan')}
            >
              <Text style={styles.heroBtnOutlineText}>Details</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.heroBtnSolid} 
              activeOpacity={0.8} 
              onPress={() => navigation.navigate('My Plan')}
            >
              <Text style={styles.heroBtnSolidText}>Start</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Exercises')}>
            <View style={styles.iconBox}>
              <Image
                source={require('../../../assets/images/ui/action-exercises.png')}
                style={styles.actionIconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.gridItemText}>Exercises</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('My Plan')}>
            <View style={styles.iconBox}>
              <Image
                source={require('../../../assets/images/ui/action-planner.png')}
                style={styles.actionIconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.gridItemText}>Planner</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Profile')}>
            <View style={styles.iconBox}>
              <Image
                source={require('../../../assets/images/ui/action-progress.png')}
                style={styles.actionIconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.gridItemText}>Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Profile')}>
            <View style={styles.iconBox}>
              <Image
                source={require('../../../assets/images/ui/action-profile.png')}
                style={styles.actionIconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.gridItemText}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Motivational Quote */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>"{randomQuote}"</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContent: {
    padding: spacing.screen,
    paddingBottom: spacing.xl,
    gap: spacing.screen,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  greeting: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  name: {
    ...typography.displayLarge,
    color: colors.textPrimary,
    marginTop: 4,
  },
  avatarContainer: {
    width: 46,
    height: 46,
    borderRadius: radius.control,
    backgroundColor: colors.selectedSoft,
    borderWidth: 1,
    borderColor: colors.hairline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.card,
    alignItems: 'flex-start',
    minHeight: 104,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  statCardLight: {
    backgroundColor: colors.surface,
  },
  statCardPearl: {
    backgroundColor: colors.performanceSoft,
    borderColor: colors.goldLight,
  },
  statValue: {
    ...typography.statNumber,
    fontSize: 30,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.statLabel,
    marginTop: 4,
  },
  heroCard: {
    backgroundColor: colors.ink,
    borderRadius: radius.card,
    padding: spacing.screen,
    overflow: 'hidden',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.mutedOnDark,
  },
  heroSubtitle: {
    ...typography.displayLarge,
    color: colors.textOnDark,
    marginTop: spacing.xs,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.screen,
    flexWrap: 'wrap',
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.micro,
  },
  heroMetaText: {
    fontSize: 14,
    color: colors.mutedOnDark,
    fontWeight: '400',
  },
  heroActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  heroBtnOutline: {
    flex: 1,
    minHeight: componentSizes.secondaryButtonHeight,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.textOnDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBtnOutlineText: {
    color: colors.textOnDark,
    ...typography.action,
  },
  heroBtnSolid: {
    flex: 1,
    minHeight: componentSizes.secondaryButtonHeight,
    borderRadius: radius.control,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBtnSolidText: {
    ...typography.action,
    color: colors.ink,
  },
  sectionTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
  },
  gridItem: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.card,
    alignItems: 'flex-start',
    minHeight: 124,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.control,
    backgroundColor: colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconImage: {
    width: 32,
    height: 32,
  },
  gridItemText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  quoteCard: {
    backgroundColor: colors.surface,
    padding: spacing.screen,
    borderRadius: radius.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  quoteText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
});
