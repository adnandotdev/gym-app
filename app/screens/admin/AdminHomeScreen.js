import React, { useContext } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/Button';
import { colors, radius, spacing, typography } from '../../theme/colors';

const AdminHomeScreen = () => {
  const { user, logout, isLoading } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  const handleCardPress = (featureName) => {
    Toast.show({
      type: 'info',
      text1: 'Coming Soon!',
      text2: `${featureName} is under active development.`,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        {/* Top Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>MuscleMap Admin</Text>
          <Text style={styles.subtitle}>Manage your app content ⚡</Text>
        </View>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{user?.name || 'Administrator'}!</Text>
          <Text style={styles.emailText}>{user?.email}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>System Admin</Text>
          </View>
        </View>

        {/* Grid/List of Tappable Action Cards */}
        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => handleCardPress('Manage Exercises')}
          >
            <View style={styles.cardIconContainer}>
              <Image
                source={require('../../../assets/images/ui/admin-manage-exercises.png')}
                style={styles.cardIconImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Manage Exercises</Text>
              <Text style={styles.cardSubtitle}>Add, edit, or delete workouts</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => handleCardPress('Manage Users')}
          >
            <View style={styles.cardIconContainer}>
              <Image
                source={require('../../../assets/images/ui/admin-manage-users.png')}
                style={styles.cardIconImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Manage Users</Text>
              <Text style={styles.cardSubtitle}>Audit logs, roles, and permissions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </TouchableOpacity>
        </View>

        {/* Footer Area */}
        <View style={styles.footer}>
          <Button
            title="Log Out"
            onPress={handleLogout}
            loading={isLoading}
            style={styles.logoutButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    flex: 1,
    padding: spacing.screen,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    ...typography.screenTitle,
    color: colors.ink,
  },
  subtitle: {
    fontSize: 15,
    color: colors.mutedStrong,
    marginTop: 4,
  },
  welcomeCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.card,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    position: 'relative',
  },
  welcomeText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 4,
  },
  emailText: {
    fontSize: 14,
    color: colors.mutedStrong,
    marginTop: 4,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 11,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceWarm,
    borderRadius: radius.control,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.surfaceWarm,
  },
  cardIconContainer: {
    backgroundColor: colors.primarySoft,
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  cardIconImage: {
    width: 30,
    height: 30,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.ink,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.mutedStrong,
    marginTop: 2,
  },
  footer: {
    width: '100%',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: colors.danger,
  },
});

export default AdminHomeScreen;
