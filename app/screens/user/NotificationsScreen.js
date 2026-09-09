import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MotionPressable from '../../components/MotionPressable';
import { radius, spacing, typography } from '../../theme/colors';
import { useAppTheme } from '../../context/ThemeContext';
import useThemedStyles from '../../theme/useThemedStyles';

const initialNotifications = [
  { id: 'hydrate', text: "Don't forget to hydrate during your workout", read: false },
  { id: 'week', text: 'Congrats on completing your first week of workouts!', read: false },
  { id: 'hiit', text: "It's HIIT o'clock! Time for a quick and intense workout", read: false },
  { id: 'log', text: 'Hey fitness enthusiast, time to log your latest workout', read: false },
];

export default function NotificationsScreen({ navigation }) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const [notifications, setNotifications] = useState(initialNotifications);
  const markAllRead = () => setNotifications((items) => items.map((item) => ({ ...item, read: true })));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MotionPressable style={styles.iconButton} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={28} color={colors.ink} />
        </MotionPressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        <MotionPressable style={styles.iconButton} onPress={markAllRead} accessibilityRole="button" accessibilityLabel="Mark all notifications as read">
          <Ionicons name="checkmark-done" size={24} color={colors.primary} />
        </MotionPressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {notifications.map((item, index) => (
            <MotionPressable
              key={item.id}
              style={[styles.row, index < notifications.length - 1 && styles.divider]}
              onPress={() => setNotifications((items) => items.map((entry) => entry.id === item.id ? { ...entry, read: true } : entry))}
              accessibilityRole="button"
              accessibilityState={{ selected: !item.read }}
            >
              <View style={[styles.bell, item.read && styles.bellRead]}>
                <Ionicons name="notifications-outline" size={20} color={item.read ? colors.muted : colors.primary} />
              </View>
              <Text style={[styles.message, item.read && styles.messageRead]}>{item.text}</Text>
              {!item.read && <View style={styles.unreadDot} />}
            </MotionPressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => ({
  container: { flex: 1, backgroundColor: colors.canvas },
  header: { minHeight: 60, paddingTop: spacing.xs, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.xs },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.cardTitle, color: colors.ink, flex: 1, textAlign: 'center' },
  content: { paddingHorizontal: spacing.screen, paddingTop: spacing.sm, paddingBottom: spacing.lg },
  card: { borderRadius: radius.card, borderCurve: 'continuous', backgroundColor: colors.surfaceWarm, overflow: 'hidden' },
  row: { minHeight: 68, padding: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  bell: { width: 36, height: 36, flexShrink: 0, borderRadius: 18, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  bellRead: { backgroundColor: colors.surface },
  message: { ...typography.caption, color: colors.ink, flex: 1 },
  messageRead: { color: colors.mutedStrong },
  unreadDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary },
});
