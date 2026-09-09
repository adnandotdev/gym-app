import React from 'react';
import { Image, Text, View } from 'react-native';
import { spacing } from '../theme/colors';
import { useAppTheme } from '../context/ThemeContext';
import useThemedStyles from '../theme/useThemedStyles';

// The original approved artwork remains intact; compact headers use its symbol
// beside live text so the name stays crisp at small sizes and with font scaling.
export default function BrandLogo({ variant = 'compact', style }) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);

  if (variant === 'artwork') {
    return (
      <Image
        source={require('../../assets/branding/liftsutra-lockup.png')}
        style={[styles.artwork, style]}
        resizeMode="contain"
        accessibilityLabel="LiftSutra"
        accessible
      />
    );
  }

  return (
    <View style={[styles.row, style]} accessible accessibilityRole="image" accessibilityLabel="LiftSutra">
      <View style={styles.markViewport}>
        <Image source={require('../../assets/branding/liftsutra-adaptive.png')} style={styles.mark} resizeMode="contain" accessible={false} />
      </View>
      <Text style={styles.wordmark} maxFontSizeMultiplier={1.3} numberOfLines={1}>
        <Text style={styles.accent}>Lift</Text>Sutra
      </Text>
    </View>
  );
}

const createStyles = (colors) => ({
  row: { height: 22, flexDirection: 'row', alignItems: 'center', gap: spacing.micro, flexShrink: 1 },
  markViewport: { width: 20, height: 20, overflow: 'hidden', flexShrink: 0 },
  // Optical framing of the padded 1024px launcher asset: the symbol occupies
  // its central 55%. Only empty margins are outside this viewport, not artwork.
  mark: { position: 'absolute', width: 34, height: 34, left: -7, top: -7 },
  wordmark: { height: 22, margin: 0, padding: 0, fontFamily: 'Overpass_700Bold', fontSize: 22, lineHeight: 22, color: colors.ink, includeFontPadding: false, textAlignVertical: 'center', flexShrink: 1, transform: [{ translateY: 3 }] },
  accent: { color: colors.primary },
  artwork: { width: 192, height: 192 },
});
