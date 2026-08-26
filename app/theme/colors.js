import { Platform } from 'react-native';

const displayFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

export const colors = {
  ink: '#17140F',
  canvas: '#F7F3EA',
  stage: '#E5DFD2',
  surface: '#FFFCF5',
  surfaceWarm: '#F0E9DC',
  surfaceIron: '#292622',
  surfaceIronSoft: '#38332D',
  hairline: '#E2D8C8',
  border: '#CFC4B3',
  borderStrong: '#A79B88',
  muted: '#82786A',
  mutedStrong: '#514B43',
  bodySecondary: '#332E27',
  disabledBg: '#DDD5C8',
  disabledText: '#A79F92',
  selectedSoft: '#EDE5D7',
  recovery: '#2F4A3C',
  recoverySoft: '#DDE8DE',
  performance: '#C27A2C',
  performanceSoft: '#F4E3C9',
  danger: '#9B2F1D',
  white: '#FFFFFF',

  background: '#F7F3EA',
  parchment: '#F7F3EA',
  ceramic: '#E5DFD2',
  surfaceCool: '#F0E9DC',
  surfaceDark: '#17140F',
  surfaceDark2: '#292622',
  textPrimary: '#17140F',
  textSecondary: '#82786A',
  textOnDark: '#F7F3EA',
  mutedOnDark: 'rgba(247, 243, 234, 0.72)',
  accent: '#2F4A3C',
  accentFocus: '#17140F',
  accentOnDark: '#F7F3EA',
  accentLight: '#DDE8DE',
  houseGreen: '#2F4A3C',
  upliftGreen: '#38332D',
  gold: '#C27A2C',
  goldLight: '#E6BE86',
  goldLightest: '#F4E3C9',
  blue: '#2F4A3C',
  chip: '#EDE5D7',
  success: '#2F4A3C',
};

export const spacing = {
  micro: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  screen: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  subtle: 2,
  control: 3,
  card: 8,
  chip: 999,
  avatar: 999,
};

export const componentSizes = {
  primaryButtonHeight: 52,
  secondaryButtonHeight: 44,
  searchHeight: 46,
  tabBarHeight: 72,
  floatingActionSize: 52,
};

export const motion = {
  pressDuration: '120ms',
  stateDuration: 180,
  pressScale: 0.97,
  easeOut: [0.23, 1, 0.32, 1],
};

export const typography = {
  heroDisplay: { fontFamily: displayFont, fontSize: 40, fontWeight: '500', lineHeight: 42, letterSpacing: -0.3 },
  displayLarge: { fontFamily: displayFont, fontSize: 30, fontWeight: '500', lineHeight: 34, letterSpacing: -0.3 },
  lead: { fontSize: 16, fontWeight: '400', lineHeight: 24, letterSpacing: 0 },
  statNumber: { fontSize: 34, fontWeight: '600', lineHeight: 38, letterSpacing: 0 },
  statLabel: { fontSize: 12, fontWeight: '600', lineHeight: 17, color: colors.muted, letterSpacing: 0 },
  screenTitle: { fontFamily: displayFont, fontSize: 24, fontWeight: '500', lineHeight: 29, letterSpacing: -0.2 },
  cardTitle: { fontSize: 18, fontWeight: '600', lineHeight: 23, letterSpacing: 0 },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 23, letterSpacing: 0 },
  caption: { fontSize: 13, fontWeight: '500', lineHeight: 19, letterSpacing: 0 },
  action: { fontSize: 14, fontWeight: '700', lineHeight: 17, letterSpacing: 0 },
  metaSmall: { fontSize: 11, fontWeight: '600', lineHeight: 16, letterSpacing: 0 },
};
