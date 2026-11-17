// ============================================================
// SentenceHighlight
// Editorial bilingual typography with live narration highlighting:
// the sentence being read gets a soft wash and a gold margin rule,
// its language line is full strength and the rest of the page rests
// at a calm, still-readable dim. Learning Mode adds tappable words
// and per-language replay buttons.
// ============================================================

import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { RotateCcw } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { BorderRadius, Typography, ReaderTheme } from '../../constants/theme';
import { Sentence, ReadingMode } from '../../types/story';
import { lookupWord, WordDefinition } from '../../data/vocabulary';
import { speechService } from '../../services/speechService';
import { useSentenceAutoScrollContext } from '../../hooks/useSentenceAutoScroll';

interface SentenceHighlightProps {
  sentences: Sentence[];
  activeSentenceIndex: number;
  activeBilingualPhase: 'en' | 'vi';
  readingMode: ReadingMode;
  /** Active Reading Appearance (Paper · Moonlight). */
  readerTheme: ReaderTheme;
  isLearningMode?: boolean;
  /** Narration is currently speaking on this page. */
  isNarrating?: boolean;
  /** Larger type for wide pages (tablets, spreads). */
  large?: boolean;
  onWordSelect?: (definition: WordDefinition) => void;
  onReplaySentence?: (sentenceIndex: number, phase: 'en' | 'vi') => void;
  /** Makes auto-scroll keys unique across pages sharing one scroll container. */
  scrollKeyPrefix?: string;
}

export const SentenceHighlight: React.FC<SentenceHighlightProps> = ({
  sentences,
  activeSentenceIndex,
  activeBilingualPhase,
  readingMode,
  readerTheme: t,
  isLearningMode = false,
  isNarrating = false,
  large = false,
  onWordSelect,
  onReplaySentence,
  scrollKeyPrefix = '',
}) => {
  const { t: tr } = useTranslation(); // `t` is the reader theme here

  // Tell the enclosing scroll container which sentence is being read, so it
  // can bring it near the top (see useSentenceAutoScroll).
  const autoScroll = useSentenceAutoScrollContext();
  const activeBlockRef = useRef<View>(null);
  const activeSentence = activeSentenceIndex >= 0 ? sentences[activeSentenceIndex] : undefined;
  const activeKey = activeSentence ? `${scrollKeyPrefix}:${activeSentence.id}` : null;
  const reportActive = useCallback(() => {
    if (!autoScroll || !activeKey) return;
    autoScroll.reportActiveSentence({
      key: activeKey,
      node: activeBlockRef.current,
      pageStart: activeSentenceIndex === 0,
    });
  }, [autoScroll, activeKey, activeSentenceIndex]);
  useEffect(() => {
    if (!autoScroll || !activeKey) return;
    reportActive();
    return () => autoScroll.clearActiveSentence(activeKey);
  }, [autoScroll, activeKey, isNarrating, reportActive]);
  const enSize = large ? 22 : 19;
  const viSize = large ? 18 : 16;

  // Which language lines this mode shows, and in which order.
  const lines: Array<'en' | 'vi'> =
    readingMode === 'bilingual_parallel'
      ? ['en', 'vi']
      : readingMode === 'single_en'
        ? ['en']
        : readingMode === 'single_vi'
          ? ['vi']
          : [activeBilingualPhase]; // vi_first_en_second shows the round being read

  const replay = (idx: number, lang: 'en' | 'vi') => {
    const sentence = sentences[idx];
    if (onReplaySentence) onReplaySentence(idx, lang);
    else speechService.speak({ text: lang === 'en' ? sentence.en : sentence.vi, language: lang === 'en' ? 'en-US' : 'vi-VN' });
  };

  const renderEnglish = (text: string, color: string) => {
    const style = [styles.en, { color, fontSize: enSize, lineHeight: Math.round(enSize * Typography.story) }];
    if (!isLearningMode) return <Text style={style}>{text}</Text>;
    const words = text.split(' ');
    return (
      <Text style={style}>
        {words.map((w, i) => {
          const def = lookupWord(w.replace(/[^a-zA-Z]/g, ''));
          return (
            <React.Fragment key={i}>
              <Text
                onPress={def && onWordSelect ? () => onWordSelect(def) : undefined}
                style={def ? [styles.vocab, { textDecorationColor: t.highlightBar }] : undefined}
                accessibilityRole={def ? 'button' : undefined}
                accessibilityHint={def ? tr('reader.wordHint') : undefined}
              >
                {w}
              </Text>
              {i < words.length - 1 ? ' ' : ''}
            </React.Fragment>
          );
        })}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      {sentences.map((sentence, idx) => {
        const isActive = idx === activeSentenceIndex;
        const enColor = isActive ? (activeBilingualPhase === 'en' || lines.length === 1 ? t.text : t.textSecondary) : t.enDim;
        const viColor = isActive ? t.vi : t.viDim;
        const speakingLang: 'en' | 'vi' = lines.length === 1 ? lines[0] : activeBilingualPhase;
        return (
          <View
            key={sentence.id}
            ref={isActive ? activeBlockRef : undefined}
            onLayout={isActive ? reportActive : undefined}
            style={[styles.block, isActive && { backgroundColor: t.highlightBg }]}
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={lines.map((l) => (l === 'en' ? sentence.en : sentence.vi)).join('. ')}
          >
            <View style={[styles.rule, { backgroundColor: isActive ? t.highlightBar : 'transparent' }]} />
            <View style={styles.textColumn}>
              {lines.map((lang) =>
                lang === 'en' ? (
                  <View key="en">{renderEnglish(sentence.en, enColor)}</View>
                ) : (
                  <Text
                    key="vi"
                    style={[
                      styles.vi,
                      { color: viColor, fontSize: viSize, lineHeight: Math.round(viSize * 1.6) },
                    ]}
                  >
                    {sentence.vi}
                  </Text>
                )
              )}
            </View>

            {/* Replay: per language in Learning Mode, otherwise only on the sentence being read. */}
            {isLearningMode ? (
              <View style={styles.replayCol}>
                {lines.map((lang) => (
                  <Pressable
                    key={lang}
                    onPress={() => replay(idx, lang)}
                    hitSlop={8}
                    style={({ pressed }) => [styles.langBtn, { borderColor: t.border }, pressed && { opacity: 0.6 }]}
                    accessibilityRole="button"
                    accessibilityLabel={lang === 'en' ? 'Replay in English' : 'Đọc lại bằng tiếng Việt'}
                  >
                    <Text style={[styles.langBtnText, { color: lang === 'en' ? t.textSecondary : t.vi }]} maxFontSizeMultiplier={1.5}>
                      {lang.toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : isActive ? (
              <View style={styles.replayCol}>
                {isNarrating ? (
                  <SpeakingBars color={t.highlightBar} />
                ) : (
                  <Pressable
                    onPress={() => replay(idx, speakingLang)}
                    hitSlop={10}
                    style={({ pressed }) => [styles.replayBtn, { borderColor: t.border }, pressed && { opacity: 0.6 }]}
                    accessibilityRole="button"
                    accessibilityLabel={tr('reader.replaySentence')}
                  >
                    <RotateCcw size={14} color={t.textSecondary} strokeWidth={2.2} />
                  </Pressable>
                )}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
};

/** Three softly breathing bars: "this sentence is being read aloud". */
function SpeakingBars({ color }: { color: string }) {
  const v = useRef([0, 1, 2].map(() => new Animated.Value(0.4))).current;
  useEffect(() => {
    const loops = v.map((val, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 140),
          Animated.timing(val, { toValue: 1, duration: 380, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0.4, duration: 380, useNativeDriver: true }),
        ])
      )
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [v]);
  return (
    <View style={styles.bars} accessibilityLabel="Reading aloud" accessibilityRole="image">
      {v.map((val, i) => (
        <Animated.View key={i} style={[styles.bar, { backgroundColor: color, transform: [{ scaleY: val }] }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  block: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: BorderRadius.lg,
    paddingVertical: 10,
    paddingRight: 8,
    marginHorizontal: -10,
  },
  rule: { width: 3, alignSelf: 'stretch', borderRadius: 2, marginLeft: 0, marginRight: 9 },
  textColumn: { flex: 1, gap: 6 },
  en: { fontFamily: Typography.serif, letterSpacing: 0.1 },
  vi: { fontWeight: '500', letterSpacing: 0.1 },
  vocab: { textDecorationLine: 'underline', textDecorationStyle: 'dotted' },
  replayCol: { marginLeft: 8, gap: 6, alignItems: 'center', paddingTop: 2 },
  replayBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langBtn: {
    minWidth: 34,
    minHeight: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  langBtnText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  bars: { flexDirection: 'row', alignItems: 'center', gap: 3, height: 30, paddingHorizontal: 6 },
  bar: { width: 3, height: 14, borderRadius: 1.5 },
});

