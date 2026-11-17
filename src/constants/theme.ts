// ============================================================
// Design Tokens — StoryMoon
//
// Two independent appearance systems:
//
//   1. App appearance (Light · Dark) — every screen's chrome: tabs,
//      cards, settings, story detail, sheets, search, legal. Screens
//      never read colours from here directly; they call useTheme()
//      (src/theme) and get the semantic `AppColors` for the resolved
//      scheme. Light is "paper by lamplight"; Dark is "ink by
//      moonlight" — warm charcoal, candle-coloured text, moonlit sage.
//
//   2. Reading appearance (Paper · Moonlight) — only the reading
//      canvas and in-reader controls (`ReaderThemes`). Chosen
//      separately, so a parent can keep a dark app and a paper page,
//      or a light app and a moonlit bedtime reader.
//
// Story-specific colour comes only from each story's art direction
// (Story.art.palette), so the app chrome stays calm and coherent.
// ============================================================

import { Platform, TextStyle, ViewStyle } from 'react-native';

// ─── Raw brand palette (theme-independent) ────────────────────
// Brand marks, illustrations and the always-night premium surfaces
// use these. Screen chrome must use AppColors instead.

export const Palette = {
  ivory: '#F7F3E9',
  warmWhite: '#FDFAF3',
  parchment: '#F0E9D6',
  charcoal: '#26271F',
  gold: '#C6A66B',
  goldLight: '#E2CB97',
  /** The brand mark's book cover (app icon / splash). */
  sage: '#7C8B6E',
  moonlight: '#B8C9B0',
  moonGlow: '#F3E3B5',
  night: '#141826',
  indigo: '#1C2240',
  indigoDeep: '#151A31',
  indigoSurface: '#252C4D',
  candle: '#E8DFC8',
  candleGold: '#D4B47A',
  /** Text and icons laid on dark ink overlays over illustrations (both schemes). */
  onOverlay: '#F7F3E9',
  overlaySoft: 'rgba(16, 19, 28, 0.42)',
  overlay: 'rgba(16, 19, 28, 0.55)',
  overlayStrong: 'rgba(16, 19, 28, 0.62)',
} as const;

// ─── App appearance ───────────────────────────────────────────

export type ColorScheme = 'light' | 'dark';

/** The user's App Appearance setting. 'system' follows the device. */
export type AppAppearance = 'system' | 'light' | 'dark';
export const APP_APPEARANCES: readonly AppAppearance[] = ['system', 'light', 'dark'];

/** Semantic colour roles for app chrome. Every screen styles itself from these. */
export interface AppColors {
  // Surfaces
  /** Screen background (paper / night ink). */
  background: string;
  /** Cards, sheets, inputs, tab bar — one step above the background. */
  surface: string;
  /** Recessed fills: segmented tracks, soft buttons, meta pills, pressed rows. */
  surfaceSunken: string;
  /** Neutral placeholder fill (skeletons, empty covers). */
  surfaceMuted: string;
  /** Background with a little transparency, for bars laid over scrolling content. */
  surfaceTranslucent: string;

  // Lines
  border: string;
  /** Stronger neutral: switch-off tracks, sheet grabbers, dashed outlines. */
  borderStrong: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  /** Captions, eyebrows, placeholders — still ≥ 4.5:1 on background and surface. */
  textMuted: string;
  /** Warm gold for small emphasis text (eyebrows, stats). */
  textAccent: string;
  /** Inline actions ("See all"). */
  textLink: string;

  // Brand & interaction
  /** Filled buttons, selected chips, switch-on tracks. */
  primary: string;
  primaryPressed: string;
  /** Text and icons on `primary`. */
  onPrimary: string;
  onPrimaryMuted: string;
  /** Tinted wells behind icons; selected tab pill. */
  primarySoft: string;
  /** Icon ink and selected text (sage). Also secondary-button text. */
  accent: string;
  /** Decorative gold: progress fills, moon marks, stars. Not for body text. */
  gold: string;
  goldHalo: string;
  /** Glow colour of the moonlight pool in the screen backdrop. */
  backdropGlow: string;
  backdropGlowOpacity: number;

  // Feedback
  success: string;
  error: string;
  warning: string;

  // Overlays
  /** Dims content behind modals and dialogs. */
  scrim: string;
  /** Empty part of progress tracks. */
  track: string;
  /** Shadow tint (warm on paper; deep ink at night). */
  shadow: string;
}

export const LightColors: AppColors = {
  background: '#F7F3E9',
  surface: '#FDFAF3',
  surfaceSunken: '#F0E9D6',
  surfaceMuted: '#EDE8D8',
  surfaceTranslucent: 'rgba(247, 243, 233, 0.97)',

  border: '#E6DECA',
  borderStrong: '#D9CFB6',

  textPrimary: '#26271F',
  textSecondary: '#4F5048',
  textMuted: '#6E6F66',
  textAccent: '#85652B',
  textLink: '#5E6C52',

  primary: '#4E5B43',
  primaryPressed: '#414C38',
  onPrimary: '#F7F3E9',
  onPrimaryMuted: 'rgba(247, 243, 233, 0.75)',
  primarySoft: '#E3E8DA',
  accent: '#4A5641',
  gold: '#C6A66B',
  goldHalo: 'rgba(198, 166, 107, 0.16)',
  backdropGlow: '#F3E3B5',
  backdropGlowOpacity: 0.55,

  success: '#466E4B',
  error: '#8A4A4A',
  warning: '#82623A',

  scrim: 'rgba(20, 24, 38, 0.55)',
  track: 'rgba(38, 39, 31, 0.09)',
  shadow: '#2A2214',
};

/**
 * Dark: warm night ink rather than black, candle-toned text rather than white,
 * and the brand sage lifted to "moonlit sage" so filled controls stay legible.
 * Elevation reads through lighter surfaces and hairlines, not shadows.
 */
export const DarkColors: AppColors = {
  background: '#131518',
  surface: '#1C1F23',
  surfaceSunken: '#262A2F',
  surfaceMuted: '#22252A',
  surfaceTranslucent: 'rgba(19, 21, 24, 0.97)',

  border: '#2E3238',
  borderStrong: '#40454C',

  textPrimary: '#EEE7D6',
  textSecondary: '#C6BFAE',
  textMuted: '#9E988A',
  textAccent: '#D9BC85',
  textLink: '#B2C5A4',

  primary: '#A5BA96',
  primaryPressed: '#91A782',
  onPrimary: '#141810',
  onPrimaryMuted: 'rgba(20, 24, 16, 0.72)',
  primarySoft: 'rgba(165, 186, 150, 0.16)',
  accent: '#B5C7A7',
  gold: '#D4B47A',
  goldHalo: 'rgba(212, 180, 122, 0.14)',
  backdropGlow: '#3A4466',
  backdropGlowOpacity: 0.5,

  success: '#9CC5A0',
  error: '#E3A99C',
  warning: '#DDBD8A',

  scrim: 'rgba(0, 0, 0, 0.62)',
  track: 'rgba(238, 231, 214, 0.12)',
  shadow: '#000000',
};

// ─── Typography (scheme-independent sizes) ────────────────────

/** Platform serif with full Vietnamese coverage (Georgia on iOS, Noto Serif on Android). */
const SERIF = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia, "Iowan Old Style", "Noto Serif", serif',
});

export const Typography = {
  // Font families
  serif: SERIF as string | undefined,
  sansSerif: undefined as string | undefined, // system UI font

  // Font sizes
  xs: 12,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 30,
  display: 36,

  // Line heights (multipliers)
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
  story: 1.62,

  // Letter spacing
  tight_ls: -0.4,
  normal_ls: 0,
  wide_ls: 0.5,
  wider_ls: 1.4,
} as const;

export type TextStyleName =
  | 'display'
  | 'title'
  | 'heading'
  | 'cardTitle'
  | 'viTitle'
  | 'body'
  | 'caption'
  | 'eyebrow'
  | 'button';

/** Ready-made text styles, coloured for a scheme. Get them from useTheme().type. */
export function makeTextStyles(c: AppColors): Record<TextStyleName, TextStyle> {
  return {
    display: {
      fontFamily: SERIF,
      fontSize: Typography.display,
      lineHeight: Typography.display * 1.12,
      fontWeight: '700',
      letterSpacing: -0.6,
      color: c.textPrimary,
    },
    title: {
      fontFamily: SERIF,
      fontSize: Typography.xxl,
      lineHeight: Typography.xxl * 1.15,
      fontWeight: '700',
      letterSpacing: -0.4,
      color: c.textPrimary,
    },
    heading: {
      fontFamily: SERIF,
      fontSize: Typography.lg,
      lineHeight: Typography.lg * 1.25,
      fontWeight: '700',
      color: c.textPrimary,
    },
    cardTitle: {
      fontFamily: SERIF,
      fontSize: Typography.md,
      lineHeight: Typography.md * 1.25,
      fontWeight: '700',
      color: c.textPrimary,
    },
    /** Vietnamese titles: upright, lighter — diacritics stay crisp for young readers. */
    viTitle: {
      fontSize: Typography.sm,
      lineHeight: Typography.sm * 1.4,
      fontWeight: '500',
      color: c.textSecondary,
    },
    body: {
      fontSize: Typography.base,
      lineHeight: Typography.base * 1.6,
      color: c.textSecondary,
    },
    caption: {
      fontSize: Typography.xs,
      lineHeight: Typography.xs * 1.4,
      color: c.textMuted,
    },
    eyebrow: {
      fontSize: Typography.xs,
      fontWeight: '700',
      letterSpacing: Typography.wider_ls,
      textTransform: 'uppercase',
      color: c.textMuted,
    },
    button: {
      fontSize: Typography.md,
      fontWeight: '700',
      letterSpacing: 0.2,
    },
  };
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 40,
  /** Screen gutter */
  gutter: 20,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 22,
  pill: 100,
} as const;

/** Minimum comfortable touch target. */
export const TouchTarget = 44;

// ─── Elevation ────────────────────────────────────────────────

export type ShadowName = 'paper' | 'card' | 'cover' | 'page' | 'button' | 'hairline' | 'none';

/**
 * On paper, warm soft shadows lift cards. At night shadows barely read, so
 * they get deeper and tighter, and surfaces carry elevation through lighter
 * fills and borders instead.
 */
export function makeShadows(scheme: ColorScheme): Record<ShadowName, ViewStyle> {
  const dark = scheme === 'dark';
  const ink = dark ? '#000000' : '#2A2214';
  const warm = dark ? '#000000' : '#3A2E1A';
  const k = dark ? 2.2 : 1; // opacity multiplier
  const s = (color: string, y: number, opacity: number, radius: number, elevation: number): ViewStyle => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: y },
    shadowOpacity: Math.min(opacity * k, 0.5),
    shadowRadius: radius,
    elevation: dark ? Math.max(elevation - 1, 0) : elevation,
  });
  return {
    paper: s(warm, 2, 0.07, 8, 2),
    card: s(warm, 6, 0.12, 14, 4),
    /** Book cover lifted off the shelf. */
    cover: s(ink, 8, 0.2, 12, 6),
    page: s(ink, 4, 0.14, 18, 6),
    /** Filled buttons and selected chips: a soft lift, not a floating card. */
    button: s(ink, 4, 0.16, 10, 3),
    /** Selected segment / thumb resting on a tinted track. */
    hairline: s(ink, 1, 0.12, 3, 1),
    none: { shadowOpacity: 0, elevation: 0 },
  };
}

// ============================================================
// Bottom tab bar — selected state is carried by four cues, not
// colour alone: a sage pill behind the icon, a filled icon, a
// bolder label and a richer ink-sage colour.
// ============================================================

export interface TabBarColors {
  background: string;
  border: string;
  active: string;
  activeIconFill: string;
  indicator: string;
  inactive: string;
  pressed: string;
}

export function makeTabBarColors(c: AppColors, scheme: ColorScheme): TabBarColors {
  return {
    background: c.surface,
    border: c.border,
    active: c.accent,
    activeIconFill: scheme === 'dark' ? 'rgba(181, 199, 167, 0.22)' : 'rgba(94, 108, 82, 0.20)',
    indicator: c.primarySoft,
    inactive: c.textMuted,
    pressed: c.surfaceSunken,
  };
}

// ============================================================
// Premium surfaces — the "moonlit edition" of the storybook.
// Always night (in both app schemes): the paywall, the premium upgrade
// card and locks on cover art are a deliberate, special moment.
// ============================================================

export const PremiumColors = {
  background: Palette.indigoDeep,
  surface: Palette.indigoSurface,
  text: Palette.candle,
  textSecondary: '#C7BFA9',
  textMuted: '#A29C8C', // 6.3:1 on indigoDeep
  gold: Palette.candleGold,
  moon: Palette.moonGlow,
  onMoon: Palette.indigoDeep,
  /** Selection and check marks: StoryMoon sage, lifted for the night. */
  sage: Palette.moonlight,
  onSage: Palette.indigoDeep,
  sageSoft: 'rgba(184, 201, 176, 0.14)',
  border: 'rgba(232, 223, 200, 0.16)',
  borderStrong: Palette.moonGlow,
  borderGold: 'rgba(243, 227, 181, 0.38)',
  borderMoon: 'rgba(243, 227, 181, 0.14)',
  moonDim: 'rgba(243, 227, 181, 0.7)',
  card: 'rgba(232, 223, 200, 0.05)',
  cardSelected: 'rgba(243, 227, 181, 0.10)',
  skeleton: 'rgba(232, 223, 200, 0.08)',
  skeletonBar: 'rgba(232, 223, 200, 0.10)',
  overlay: 'rgba(12, 15, 30, 0.55)',
  error: '#E0A99C',
  success: '#B9D3A8',
} as const;

// ============================================================
// Reading appearance — the reader canvas, its controls and the
// sentence highlight all read from one of these, so Moonlight is
// a designed bedtime palette rather than inverted colours. It is
// chosen independently of the app's Light/Dark appearance.
// ============================================================

export type ReadingAppearance = 'paper' | 'moonlight';
export const READING_APPEARANCES: readonly ReadingAppearance[] = ['paper', 'moonlight'];

export interface ReaderTheme {
  name: ReadingAppearance;
  statusBar: 'dark' | 'light';
  background: string;
  surface: string;
  page: string;
  pageEdge: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  /** Vietnamese line colour (pairs with English in bilingual mode). */
  vi: string;
  viDim: string;
  enDim: string;
  accent: string;
  /** Filled buttons */
  primary: string;
  onPrimary: string;
  highlightBg: string;
  highlightBar: string;
  dotInactive: string;
  disabled: string;
  controlBg: string;
  scrim: string;
  /** Dims illustrations so a bright page never flashes in a dark room (Moonlight only). */
  artDim: string | null;
  /** Page shadows are dropped in Moonlight — no glow around the page. */
  pageShadow: boolean;
}

export const ReaderThemes: Record<ReadingAppearance, ReaderTheme> = {
  paper: {
    name: 'paper',
    statusBar: 'dark',
    background: '#EFE9DA',
    surface: '#FDFAF3',
    page: '#FBF8F0',
    pageEdge: '#E6DDC7',
    border: '#E6DECA',
    text: '#26271F',
    textSecondary: '#4F5048',
    textMuted: '#6E6F66',
    vi: '#4A5641',
    viDim: 'rgba(74, 86, 65, 0.55)',
    enDim: 'rgba(38, 39, 31, 0.5)',
    accent: '#5E6C52',
    primary: '#4E5B43',
    onPrimary: '#F7F3E9',
    highlightBg: 'rgba(198, 166, 107, 0.16)',
    highlightBar: '#C6A66B',
    dotInactive: '#DCD3BD',
    disabled: 'rgba(38, 39, 31, 0.25)',
    controlBg: 'rgba(253, 250, 243, 0.97)',
    scrim: 'rgba(20, 24, 38, 0.82)',
    artDim: null,
    pageShadow: true,
  },
  moonlight: {
    name: 'moonlight',
    statusBar: 'light',
    background: '#12151F',
    surface: '#1A1E2B',
    page: '#1F2332',
    pageEdge: '#2A2F41',
    border: 'rgba(232, 223, 200, 0.09)',
    text: '#E8DFC8',
    textSecondary: '#B9B19C',
    textMuted: '#8F8A7D',
    vi: '#D9BC85',
    viDim: 'rgba(217, 188, 133, 0.45)',
    enDim: 'rgba(232, 223, 200, 0.42)',
    accent: '#D4B47A',
    primary: '#D4B47A',
    onPrimary: '#1A1608',
    highlightBg: 'rgba(212, 180, 122, 0.10)',
    highlightBar: '#D4B47A',
    dotInactive: 'rgba(232, 223, 200, 0.16)',
    disabled: 'rgba(232, 223, 200, 0.22)',
    controlBg: 'rgba(26, 30, 43, 0.97)',
    scrim: 'rgba(8, 10, 18, 0.88)',
    artDim: 'rgba(10, 12, 22, 0.22)',
    pageShadow: false,
  },
};

export const getReaderTheme = (appearance: ReadingAppearance): ReaderTheme =>
  ReaderThemes[appearance] ?? ReaderThemes.paper;
