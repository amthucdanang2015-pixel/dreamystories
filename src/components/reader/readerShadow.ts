// Reader-only elevation. The reader never follows the app's Light/Dark
// appearance, so its shadows are fixed (warm, paper-style) and Moonlight
// drops page shadows via ReaderTheme.pageShadow.
import { ViewStyle } from 'react-native';

const s = (color: string, y: number, opacity: number, radius: number, elevation: number): ViewStyle => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: y },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation,
});

export const ReaderShadow = {
  page: s('#2A2214', 4, 0.14, 18, 6),
  cover: s('#2A2214', 8, 0.2, 12, 6),
  button: s('#2A2214', 4, 0.16, 10, 3),
  card: s('#3A2E1A', 6, 0.12, 14, 4),
  none: { shadowOpacity: 0, elevation: 0 } as ViewStyle,
} as const;
