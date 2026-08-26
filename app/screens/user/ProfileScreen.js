import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/Button';
import { colors, typography, spacing, radius } from '../../theme/colors';

export default function ProfileScreen({ navigation }) {
  const { user, logout, isLoading } = useContext(AuthContext);

  const calculateBMI = () => {
    if (!user?.currentWeight || !user?.height) return '--';
    // Assuming weight in kg, height in cm
    const heightInMeters = user.height / 100;
    const bmi = user.currentWeight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const renderStatBox = (title, value, unit = '') => (
    <View style={styles.statBox}>
      <Text style={styles.statTitle}>{title}</Text>
      <View style={styles.statValueRow}>
        <Text style={styles.statValue}>{value}</Text>
        {unit ? <Text style={styles.statUnit}>{unit}</Text> : null}
      </View>
    </View>
  );

  const renderSettingRow = (icon, label, onPress) => (
    <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.settingIconBox}>
        <Ionicons name={icon} size={20} color={colors.textPrimary} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.border} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Image
              source={require('../../../assets/images/avatars/default-profile.png')}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.name}>{user?.name || 'Athlete'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          
          <View style={styles.badgeContainer}>
            <Ionicons name="checkmark-circle" size={14} color={colors.accent} />
            <Text style={styles.badgeText}>{user?.experienceLevel || 'Beginner'}</Text>
          </View>
        </View>

        {/* Physical Stats Grid */}
        <Text style={styles.sectionTitle}>My Body</Text>
        <View style={styles.statsGrid}>
          {renderStatBox('Weight', user?.currentWeight || '--', user?.weightUnit || 'kg')}
          {renderStatBox('Target', user?.targetWeight || '--', user?.weightUnit || 'kg')}
          {renderStatBox('Height', user?.height || '--', user?.heightUnit || 'cm')}
          {renderStatBox('BMI', calculateBMI())}
        </View>

        {/* Goal Banner */}
        <View style={styles.goalBanner}>
          <View style={styles.goalIconBox}>
            <Ionicons name="flag-outline" size={24} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.goalLabel}>Current Goal</Text>
            <Text style={styles.goalValue}>{user?.fitnessGoal || 'Not set'}</Text>
          </View>
        </View>

        {/* Settings Menu */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          {renderSettingRow('person-outline', 'Edit Profile', () => navigation.navigate('EditProfile'))}
          {renderSettingRow('notifications-outline', 'Notifications')}
          {renderSettingRow('lock-closed-outline', 'Privacy & Security')}
          {renderSettingRow('help-circle-outline', 'Help & Support')}
        </View>

        {/* Logout */}
        <View style={styles.footer}>
          <Button
            title="Log Out"
            onPress={logout}
            loading={isLoading}
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
          />
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
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.screen,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.hairline,
    marginBottom: spacing.xl,
    marginTop: spacing.xs,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.surfaceDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    ...typography.screenTitle,
    color: colors.textPrimary,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.micro,
    borderRadius: radius.control,
    marginTop: spacing.sm,
    gap: spacing.micro,
  },
  badgeText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statBox: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.card,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'flex-start',
  },
  statTitle: {
    ...typography.statLabel,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValueRow: {
    flexDirection: 'row', 
    alignItems: 'baseline', 
    gap: 2,
  },
  statValue: {
    ...typography.statNumber,
    fontSize: 28,
    color: colors.textPrimary,
  },
  statUnit: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  goalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceDark,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  goalIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.control,
    backgroundColor: colors.surfaceDark2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  goalLabel: {
    color: colors.mutedOnDark,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  goalValue: {
    color: colors.textOnDark,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: spacing.micro,
  },
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.control,
    backgroundColor: colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    marginTop: spacing.xs,
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.control,
  },
  logoutButtonText: {
    color: colors.danger,
    fontWeight: '400',
  },
});
