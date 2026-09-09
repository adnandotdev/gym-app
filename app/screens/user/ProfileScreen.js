import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/Button';
import { typography, spacing, radius } from '../../theme/colors';
import { THEME_PREFERENCES, useAppTheme } from '../../context/ThemeContext';
import useThemedStyles from '../../theme/useThemedStyles';

const APPEARANCE_LABELS = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
};

export default function ProfileScreen({ navigation }) {
  const { user, logout, isLoading } = useContext(AuthContext);
  const { colors, preference, setPreference } = useAppTheme();
  const styles = useThemedStyles(createStyles);

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

  const renderSettingRow = (icon, label, onPress, isLast = false) => (
    <TouchableOpacity
      style={[styles.settingRow, isLast && styles.settingRowLast]}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={onPress ? label : `${label}, unavailable`}
      accessibilityState={{ disabled: !onPress }}
    >
      <View style={styles.settingIconBox}>
        <Ionicons name={icon} size={20} color={colors.textPrimary} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
      {onPress ? <Ionicons name="chevron-forward" size={18} color={colors.muted} /> : <Text style={styles.unavailableLabel}>Unavailable</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
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
          <View style={styles.goalContent}>
            <Text style={styles.goalLabel}>Current Goal</Text>
            <Text style={styles.goalValue}>{user?.fitnessGoal || 'Not set'}</Text>
          </View>
        </View>

        {/* Settings Menu */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          {renderSettingRow('person-outline', 'Edit Profile', () => navigation.navigate('EditProfile'))}
          {renderSettingRow('notifications-outline', 'Notifications', () => navigation.navigate('Notifications'))}
          <View style={styles.appearanceBlock}>
            <View style={styles.appearanceHeader}>
              <View style={styles.settingIconBox}>
                <Ionicons name="contrast-outline" size={20} color={colors.textPrimary} />
              </View>
              <View style={styles.appearanceTitleGroup}>
                <Text style={styles.settingLabel}>Appearance</Text>
                <Text style={styles.appearanceValue}>{APPEARANCE_LABELS[preference]}</Text>
              </View>
            </View>
            <View style={styles.appearanceOptions} accessibilityRole="radiogroup">
              {THEME_PREFERENCES.map((option) => {
                const selected = option === preference;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.appearanceOption, selected && styles.appearanceOptionSelected]}
                    activeOpacity={0.75}
                    onPress={() => setPreference(option)}
                    accessibilityRole="radio"
                    accessibilityLabel={`${APPEARANCE_LABELS[option]} appearance`}
                    accessibilityState={{ selected: option === preference }}
                  >
                    <Ionicons
                      name={option === 'system' ? 'phone-portrait-outline' : option === 'light' ? 'sunny-outline' : 'moon-outline'}
                      size={16}
                      color={selected ? colors.accent : colors.textSecondary}
                    />
                    <Text style={[styles.appearanceOptionText, selected && styles.appearanceOptionTextSelected]}>
                      {APPEARANCE_LABELS[option]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.appearanceHint}>System follows your device setting automatically.</Text>
          </View>
          {renderSettingRow('lock-closed-outline', 'Privacy & Security')}
          {renderSettingRow('help-circle-outline', 'Help & Support', undefined, true)}
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

const createStyles = (colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContent: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderCurve: 'continuous',
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.hairline,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surfaceDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    ...typography.screenTitle,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
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
    marginBottom: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  statBox: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderCurve: 'continuous',
    borderRadius: radius.card,
    marginBottom: spacing.sm,
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
    backgroundColor: colors.accentLight,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  goalIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  goalContent: {
    flex: 1,
  },
  goalLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  goalValue: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: spacing.micro,
  },
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  appearanceBlock: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  appearanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
  },
  appearanceTitleGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appearanceValue: {
    ...typography.metaSmall,
    color: colors.textSecondary,
  },
  appearanceOptions: {
    flexDirection: 'row',
    gap: spacing.micro,
    padding: spacing.micro,
    marginTop: spacing.xs,
    backgroundColor: colors.surfaceWarm,
    borderRadius: radius.control,
    borderCurve: 'continuous',
  },
  appearanceOption: {
    flex: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.micro,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.control,
    borderCurve: 'continuous',
  },
  appearanceOptionSelected: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  appearanceOptionText: {
    ...typography.metaSmall,
    color: colors.textSecondary,
  },
  appearanceOptionTextSelected: {
    color: colors.accent,
  },
  appearanceHint: {
    ...typography.metaSmall,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  unavailableLabel: {
    ...typography.metaSmall,
    color: colors.mutedStrong,
    marginLeft: spacing.xs,
  },
  settingIconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.control,
    backgroundColor: colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
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
