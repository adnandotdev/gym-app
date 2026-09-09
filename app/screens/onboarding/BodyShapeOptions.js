import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, typography } from '../../theme/colors';
import { useAppTheme } from '../../context/ThemeContext';
import useThemedStyles from '../../theme/useThemedStyles';

// Keep numeric values stable for existing onboarding profiles.
export const BODY_SHAPE_OPTIONS = [
  { value: 1, label: 'Athletic' },
  { value: 2, label: 'Lean' },
  { value: 3, label: 'Average' },
  { value: 4, label: 'Fuller build' },
  { value: 5, label: 'Larger build' },
];

export default function BodyShapeOptions({ value, onChange }) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.options} accessibilityRole="radiogroup">
      {BODY_SHAPE_OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <TouchableOpacity key={option.value} style={[styles.option, selected && styles.selected]} onPress={() => onChange(option.value)} activeOpacity={0.8} accessibilityRole="radio" accessibilityState={{ checked: selected }} accessibilityLabel={option.label}>
            <Text style={[styles.label, selected && styles.selectedLabel]}>{option.label}</Text>
            <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={22} color={selected ? colors.primary : colors.muted} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (colors) => ({
  options: { gap: spacing.xs },
  option: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 48, paddingVertical: spacing.xs, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radius.control, borderCurve: 'continuous', backgroundColor: colors.surface },
  selected: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  label: { ...typography.body, color: colors.textPrimary, flex: 1 },
  selectedLabel: { fontFamily: typography.cardTitle.fontFamily, color: colors.primary },
});
