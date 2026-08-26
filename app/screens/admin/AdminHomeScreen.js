import React, { useContext } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/Button';

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
            <Ionicons name="chevron-forward" size={20} color="#A79F92" />
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
            <Ionicons name="chevron-forward" size={20} color="#A79F92" />
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
    backgroundColor: '#FFFCF5',
  },
  content: {
    flex: 1,
    padding: 28,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#17140F',
  },
  subtitle: {
    fontSize: 15,
    color: '#82786A',
    marginTop: 4,
  },
  welcomeCard: {
    backgroundColor: '#EEF2FF', // Indigo/Blue tint for Admin welcome
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    position: 'relative',
  },
  welcomeText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#17140F',
    marginTop: 4,
  },
  emailText: {
    fontSize: 14,
    color: '#82786A',
    marginTop: 4,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#4F46E5',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFCF5',
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
    backgroundColor: '#F0E9DC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CFC4B3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardIconContainer: {
    backgroundColor: '#EEF2FF',
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
    color: '#17140F',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#82786A',
    marginTop: 2,
  },
  footer: {
    width: '100%',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#9B2F1D',
    shadowColor: '#9B2F1D',
  },
});

export default AdminHomeScreen;
