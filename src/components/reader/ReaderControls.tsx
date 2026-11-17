// ============================================================
// ReaderControls — the narration dock under the book.
// Status line (page + what the narrator is doing), page track,
// then: replay page · previous · PLAY · next · language badge.
// ============================================================

import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Trans, useTranslation } from 'react-i18next';
import { BorderRadius, Spacing, Typography, ReaderTheme } from '../../constants/theme';
import { PlaybackStatus } from '../../store/playbackStore';
import { PageTrack } from '../ui/ProgressBar';

interface ReaderControlsProps {
  status: PlaybackStatus;
  currentPageIndex: number;
  totalPages: number;
  /** Active Reading Appearance (Paper · Moonlight). */
  readerTheme: ReaderTheme;
  /** Language the narrator is reading (or will read) right now. */
  narrationLanguage?: 'en' | 'vi';
  onPlay: () => void;
  onPause: () => void;
  onReplay: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const ReaderControls: React.FC<ReaderControlsProps> = ({
  status,
  currentPageIndex,
  totalPages,
  readerTheme: t,
  narrationLanguage = 'en',
  onPlay,
  onPause,
  onReplay,
  onPrevPage,
  onNextPage,
}) => {
  const insets = useSafeAreaInsets();
  // `t` is the reader theme here, so the translator is `tr`.
  const { t: tr } = useTranslation();
  const languageName = tr(`narrationLanguages.${narrationLanguage}`);
  const isPlaying = status === 'playing' || status === 'loading';
  const atStart = currentPageIndex === 0;
  const atEnd = currentPageIndex >= totalPages - 1;

  const statusText =
    status === 'loading'
      ? tr('controls.statusLoading')
      : status === 'playing'
        ? tr('controls.statusPlaying', { language: languageName })
        : status === 'paused'
          ? tr('controls.statusPaused')
          : status === 'finished'
            ? tr('controls.statusFinished')
            : tr('controls.statusIdle');

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: t.controlBg,
          borderColor: t.border,
          paddingBottom: Math.max(insets.bottom, Spacing.sm) + 6,
        },
        t.name === 'paper' ? styles.daylift : null,
      ]}
    >
      <View style={styles.statusRow}>
        <Text style={[styles.pageText, { color: t.textSecondary }]}>
          <Trans
            i18nKey="controls.pageOf"
            values={{ page: currentPageIndex + 1, total: totalPages }}
            components={{ muted: <Text style={{ color: t.textMuted }} /> }}
          />
        </Text>
        <View style={styles.narrState} accessibilityLiveRegion="polite">
          {status === 'playing' ? <PulseDot color={t.highlightBar} /> : null}
          <Text style={[styles.narrText, { color: t.textMuted }]}>{statusText}</Text>
        </View>
      </View>

      <PageTrack total={totalPages} current={currentPageIndex} active={t.highlightBar} inactive={t.dotInactive} />

      <View style={styles.controls}>
        <RoundButton t={t} onPress={onReplay} label={tr('controls.replayPage')}>
          <RotateCcw size={18} color={t.textSecondary} strokeWidth={2} />
        </RoundButton>
        <RoundButton t={t} onPress={onPrevPage} label={tr('controls.previousPage')} disabled={atStart}>
          <ChevronLeft size={24} color={atStart ? t.disabled : t.text} strokeWidth={2} />
        </RoundButton>

        <Pressable
          style={({ pressed }) => [styles.playBtn, { backgroundColor: t.primary }, pressed && styles.pressed]}
          onPress={isPlaying ? onPause : onPlay}
          accessibilityRole="button"
          accessibilityLabel={
            isPlaying ? tr('controls.pause') : status === 'finished' ? tr('controls.readAgain') : tr('controls.play')
          }
        >
          {isPlaying ? (
            <Pause size={26} color={t.onPrimary} fill={t.onPrimary} />
          ) : (
            <Play size={26} color={t.onPrimary} fill={t.onPrimary} style={{ marginLeft: 3 }} />
          )}
        </Pressable>

        <RoundButton t={t} onPress={onNextPage} label={tr('controls.nextPage')} disabled={atEnd}>
          <ChevronRight size={24} color={atEnd ? t.disabled : t.text} strokeWidth={2} />
        </RoundButton>
        <View
          style={[styles.langBadge, { borderColor: t.border }]}
          accessible
          accessibilityLabel={tr('controls.narrationLanguage', { language: languageName })}
        >
          <Text
            style={[styles.langText, { color: narrationLanguage === 'vi' ? t.vi : t.textSecondary }]}
            maxFontSizeMultiplier={1.4}
          >
            {narrationLanguage.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
};

function RoundButton({
  t,
  onPress,
  label,
  disabled,
  children,
}: {
  t: ReaderTheme;
  onPress: () => void;
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.navBtn, { borderColor: t.border }, pressed && !disabled && styles.pressed]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
    >
      {children}
    </Pressable>
  );
}

function PulseDot({ color }: { color: string }) {
  const v = useRef(new Animated.Value(0.35)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(v, { toValue: 0.35, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [v]);
  return <Animated.View style={[styles.dot, { backgroundColor: color, opacity: v }]} />;
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.gutter,
    gap: Spacing.sm + 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
  },
  daylift: {
    shadowColor: '#2A2214',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm },
  pageText: { fontFamily: Typography.serif, fontSize: Typography.sm, fontWeight: '700' },
  narrState: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 },
  narrText: { fontSize: Typography.xs, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
    marginTop: 2,
  },
  navBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
  },
  langBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.8 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.96 }] },
});
