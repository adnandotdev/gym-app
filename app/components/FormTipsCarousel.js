import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, typography } from '../theme/colors';
import { useAppTheme } from '../context/ThemeContext';
import useThemedStyles from '../theme/useThemedStyles';

// This acts as F04: In-Workout Form Tips
// Using static mocked cues until the actual CMS/database provides them.

export default function FormTipsCarousel({ exerciseName, guidanceLevel = 'beginner' }) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const [availableWidth, setAvailableWidth] = useState(280);
  const cardWidth = Math.min(280, availableWidth);
  // Mock form tips that adapt slightly by guidance level
  const tips = [
    { id: 'tip-1', text: 'Keep your core engaged throughout the entire movement.', level: 'beginner' },
    { id: 'tip-2', text: 'Focus on breathing: exhale on the exertion phase.', level: 'beginner' },
    { id: 'tip-3', text: 'Ensure full range of motion. Do not cut the rep short.', level: 'intermediate' },
    { id: 'tip-4', text: 'Control the eccentric (lowering) phase for 2-3 seconds.', level: 'advanced' },
  ];

  const visibleTips = tips.filter(t => {
    if (guidanceLevel === 'advanced') return true;
    if (guidanceLevel === 'intermediate') return t.level !== 'advanced';
    return t.level === 'beginner';
  });

  if (visibleTips.length === 0) return null;

  return (
    <View style={styles.container} onLayout={({ nativeEvent }) => setAvailableWidth(nativeEvent.layout.width)}>
      <View style={styles.headerRow}>
        <Ionicons name="bulb-outline" size={18} color={colors.accent} />
        <Text style={styles.title}>Form Tips ({guidanceLevel})</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={cardWidth + spacing.sm}
        decelerationRate="fast"
      >
        {visibleTips.map((tip, index) => (
          <View key={tip.id} style={[styles.tipCard, { width: cardWidth }]}>
            <Text style={styles.tipText}>{tip.text}</Text>
            <Text style={styles.tipNumber}>Tip {index + 1} of {visibleTips.length}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors) => ({
  container: {
    marginVertical: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.metaSmall,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  scrollContent: {
    gap: spacing.sm,
  },
  tipCard: {
    backgroundColor: colors.surfaceWarm,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.hairline,
    justifyContent: 'space-between',
  },
  tipText: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  tipNumber: {
    ...typography.metaSmall,
    color: colors.textSecondary,
  },
});
