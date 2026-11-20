import React, { useEffect, useRef, useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, SlidersHorizontal, MoonStar, RotateCcw, Sparkles } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Spacing,
  BorderRadius,
  Palette,
  getReaderTheme,
  ReaderThemes,
  PremiumColors,
} from '../../src/constants/theme';
import { Button, IconButton, MoonMark } from '../../src/components/ui';
import { ALL_STORIES } from '../../src/data/stories';
import { usePlaybackStore } from '../../src/store/playbackStore';
import { usePreferencesStore } from '../../src/store/preferencesStore';
import { useProgressStore } from '../../src/store/progressStore';
import { useSubscriptionStore } from '../../src/store/subscriptionStore';
import { canAccessStory } from '../../src/constants/entitlements';
import { paywallHref } from '../../src/hooks/usePremiumGate';
import { usePlaybackKeepAwake } from '../../src/hooks/usePlaybackKeepAwake';
import { playbackController } from '../../src/services/playbackController';
import { soundEffectService } from '../../src/services/soundEffectService';
import { speechService } from '../../src/services/speechService';
import { narrationAudioService } from '../../src/services/narrationAudioService';
import { HorizontalReader } from '../../src/components/reader/HorizontalReader';
import { VerticalReader } from '../../src/components/reader/VerticalReader';
import { ReaderControls } from '../../src/components/reader/ReaderControls';
import { WordModal } from '../../src/components/reader/WordModal';
import { ReaderShadow } from '../../src/components/reader/readerShadow';
import { WordDefinition } from '../../src/data/vocabulary';
import { useResponsiveLayout } from '../../src/hooks/useResponsiveLayout';
import { readerColumn } from '../../src/utils/responsiveLayout';

export default function ReaderScreen() {
  const { id, page: pageParam } = useLocalSearchParams<{ id: string; page?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const screen = useResponsiveLayout();
  // `t` is the reader theme in this screen, so the translator is `tr`.
  const { t: tr, i18n } = useTranslation();

  const {
    story,
    storyId,
    status,
    currentPageIndex,
    currentSentenceIndex,
    bilingualPhase,
    viFirstPhase,
    readingMode,
    language,
    layout,
    speed,
    readingAppearance,
    isLearningMode,
    autoTurnPage,
    pageSoundEnabled,
    setStory,
    setStatus,
    setCurrentPage,
    setCurrentSentence,
    setBilingualPhase,
    setViFirstPhase,
    setIsLearningMode,
    initFromPrefs,
    nextPage,
    prevPage,
    reset,
  } = usePlaybackStore();

  const prefs = usePreferencesStore((s) => s.prefs);
  const { saveProgress, markCompleted } = useProgressStore();
  const isPremiumUser = useSubscriptionStore((s) => s.entitlement.isPremium);
  const completionPaywallShown = useSubscriptionStore((s) => s.completionPaywallShown);
  const markCompletionPaywallShown = useSubscriptionStore((s) => s.markCompletionPaywallShown);

  const [selectedWord, setSelectedWord] = useState<WordDefinition | null>(null);
  const [sleepTimerEnded, setSleepTimerEnded] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const isNarratingRef = useRef(false);
  const shouldAutoPlayRef = useRef(false);
  /** Bumped on every stop so pending auto page-turns from old narration are dropped. */
  const narrationSessionRef = useRef(0);
  /** The current page was read to its end (auto-turn off): Play restarts it rather than resuming. */
  const pageFinishedRef = useRef(false);

  // Keep the screen on only while the story is being read aloud on this screen.
  usePlaybackKeepAwake(status);

  // Pick the narration voices before the first sentence is read.
  useEffect(() => {
    speechService.preload();
  }, []);

  // ─── Saved preferences drive the reader (also live, from the settings sheet) ──
  useEffect(() => {
    initFromPrefs({
      language: prefs.defaultLanguage,
      readingMode: prefs.defaultReadingMode,
      layout: prefs.defaultLayout,
      speed: prefs.narrationSpeed,
      autoTurnPage: prefs.autoTurnPage,
      pageSoundEnabled: prefs.pageSoundEnabled,
      readingAppearance: prefs.readingAppearance,
    });
    setIsLearningMode(prefs.learningMode);
  }, [prefs]);

  // Load story if not already loaded, respecting pageParam if provided
  useEffect(() => {
    const found = ALL_STORIES.find((s) => s.id === id);
    if (found && !canAccessStory(found.id, isPremiumUser)) {
      // Premium gate for deep links / direct routes: never open a locked story.
      router.replace(paywallHref('premium_story', found.id));
      return;
    }
    if (found) {
      if (!story || storyId !== id) {
        const parsedPage = pageParam ? parseInt(pageParam, 10) : 0;
        const initialPage =
          !isNaN(parsedPage) && parsedPage >= 0 && parsedPage < found.pages.length ? parsedPage : 0;
        setStory(found, initialPage);
      }
      setViFirstPhase('vi');
    }
  }, [id, pageParam]);

  // Save progress when page changes or story finishes
  useEffect(() => {
    if (story) {
      if (status === 'finished') {
        markCompleted(story.id);
      } else {
        saveProgress(story.id, currentPageIndex, story.pages.length);
      }
    }
  }, [story, currentPageIndex, status]);

  // ─── Page-turn sound: exactly once per real page change, never on open ──
  const lastSoundPageRef = useRef<{ storyId: string; page: number } | null>(null);
  useEffect(() => {
    if (!story) return;
    const prev = lastSoundPageRef.current;
    lastSoundPageRef.current = { storyId: story.id, page: currentPageIndex };
    if (prev && prev.storyId === story.id && prev.page !== currentPageIndex && pageSoundEnabled) {
      soundEffectService.playPageTurn();
    }
  }, [story?.id, currentPageIndex]);

  const stopNarration = useCallback(() => {
    narrationSessionRef.current++;
    playbackController.stop();
    isNarratingRef.current = false;
    shouldAutoPlayRef.current = false;
  }, []);

  // Stop narration when unmounting
  useEffect(() => {
    return () => {
      narrationSessionRef.current++;
      playbackController.stop();
      isNarratingRef.current = false;
    };
  }, []);

  // ─── Sleep timer: counts from the first play in this reading session ──
  const sleepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (prefs.sleepTimerMinutes === 0 && sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
    if (status === 'playing' && prefs.sleepTimerMinutes > 0 && !sleepTimerRef.current) {
      sleepTimerRef.current = setTimeout(() => {
        sleepTimerRef.current = null;
        stopNarration();
        setStatus('paused');
        setSleepTimerEnded(true);
      }, prefs.sleepTimerMinutes * 60_000);
    }
  }, [status, prefs.sleepTimerMinutes]);
  useEffect(
    () => () => {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    },
    []
  );

  // ─── Narration Logic ──────────────────────────────────────

  /**
   * Narrate the current page. By default resumes at the stored reading
   * position (the sentence/phase that was playing when narration paused);
   * page changes and Replay reset that position to the page start.
   */
  const startNarration = useCallback(async (opts?: { fromStart?: boolean }) => {
    if (!story || isNarratingRef.current) return;

    // Capture the position before anything else can move it.
    const resume = opts?.fromStart || pageFinishedRef.current
      ? null
      : (() => {
          const s = usePlaybackStore.getState();
          return { sentenceIndex: s.currentSentenceIndex, phase: s.bilingualPhase };
        })();
    pageFinishedRef.current = false;

    isNarratingRef.current = true;
    setSleepTimerEnded(false);
    setStatus('playing');

    const page = story.pages[currentPageIndex];
    if (!page) {
      setStatus('finished');
      isNarratingRef.current = false;
      return;
    }

    // Determine effective language for vi_first_en_second
    const effectiveLang = readingMode === 'vi_first_en_second' ? viFirstPhase : language;

    playbackController.stop();
    const session = ++narrationSessionRef.current;

    // Small delay to prevent double-start
    await new Promise<void>((r) => setTimeout(r, 60));
    if (session !== narrationSessionRef.current) return;

    // If page-turn sound is active, wait until it finishes before speaking
    if (pageSoundEnabled) {
      await soundEffectService.waitForPageTurn();
      if (session !== narrationSessionRef.current) return;
    }

    playbackController.narratePage(
      {
        storyId: story.id,
        pageIndex: currentPageIndex,
        sentences: page.sentences,
        language: effectiveLang,
        readingMode,
        speed,
        startAt: resume,
      },
      {
        onSentenceStart: (sentenceIndex, phase) => {
          setCurrentSentence(sentenceIndex);
          setBilingualPhase(phase);
        },
        onSentenceDone: () => { },
        onPageDone: () => {
          isNarratingRef.current = false;
          pageFinishedRef.current = true;

          if (!autoTurnPage) {
            setStatus('paused');
            return;
          }

          // Natural pause, then turn the page (unless stopped meanwhile)
          setTimeout(() => {
            if (session !== narrationSessionRef.current) return;

            // End of the Vietnamese round in vi_first_en_second: start English round
            if (
              readingMode === 'vi_first_en_second' &&
              viFirstPhase === 'vi' &&
              currentPageIndex >= story.pages.length - 1
            ) {
              setViFirstPhase('en');
              shouldAutoPlayRef.current = true;
              setCurrentPage(0);
              return;
            }

            if (currentPageIndex < story.pages.length - 1) {
              shouldAutoPlayRef.current = true;
              nextPage();
            } else {
              setStatus('finished');
            }
          }, 700);
        },
        onError: (err) => {
          console.warn('Narration error:', err);
          isNarratingRef.current = false;
          setStatus('paused');
        },
        // A call, alarm, unplugged headphones or the notification's pause
        // button: pause exactly like the in-app Pause button.
        onExternalPause: () => {
          narrationSessionRef.current++;
          isNarratingRef.current = false;
          shouldAutoPlayRef.current = false;
          setStatus('paused');
        },
      }
    );
  }, [story, currentPageIndex, readingMode, viFirstPhase, language, speed, autoTurnPage, pageSoundEnabled]);

  // Auto-start narration when page changes (if shouldAutoPlay is true)
  useEffect(() => {
    if (shouldAutoPlayRef.current) {
      shouldAutoPlayRef.current = false;
      if (story && currentPageIndex < story.pages.length) {
        startNarration();
      } else if (story && currentPageIndex >= story.pages.length) {
        setStatus('finished');
      }
    }
  }, [currentPageIndex, story, startNarration, setStatus]);

  // ─── Control Handlers ─────────────────────────────────────

  const handlePlay = useCallback(() => {
    if (status === 'finished') {
      setViFirstPhase('vi');
      if (currentPageIndex === 0) {
        startNarration({ fromStart: true });
      } else {
        shouldAutoPlayRef.current = true;
        setCurrentPage(0);
      }
      return;
    }
    startNarration();
  }, [status, currentPageIndex, startNarration]);

  // Play pressed in the Android media notification / lock screen while paused:
  // same as the in-app Play button.
  const handlePlayRef = useRef(handlePlay);
  handlePlayRef.current = handlePlay;
  useEffect(() => playbackController.onExternalPlay(() => handlePlayRef.current()), []);

  // Android: the story in the media notification (also what keeps narration
  // running in the background there). Cleared when the story ends or the
  // reader closes; leaving the reader also stops narration (unmount effect).
  const storyTitle = story ? (i18n.language?.startsWith('vi') ? story.title.vi : story.title.en) : null;
  useEffect(() => {
    if (status === 'finished') narrationAudioService.setNowPlaying(null);
    else if (status === 'playing' && storyTitle) {
      narrationAudioService.setNowPlaying({ title: storyTitle, artist: 'Dreamy Stories' });
    }
  }, [status, storyTitle]);
  useEffect(() => () => narrationAudioService.setNowPlaying(null), []);

  const handlePause = useCallback(() => {
    stopNarration();
    setStatus('paused');
  }, [stopNarration]);

  const handleReplay = useCallback(() => {
    stopNarration();
    setCurrentSentence(0);
    setBilingualPhase('en');
    setStatus('idle');
    setTimeout(() => {
      startNarration({ fromStart: true });
    }, 100);
  }, [startNarration, stopNarration]);

  const handlePrevPage = useCallback(() => {
    if (currentPageIndex <= 0) return;

    const wasPlaying = status === 'playing' || status === 'loading' || shouldAutoPlayRef.current;
    playbackController.stop();
    narrationSessionRef.current++;
    isNarratingRef.current = false;

    if (wasPlaying) {
      shouldAutoPlayRef.current = true;
      setStatus('playing');
    } else {
      shouldAutoPlayRef.current = false;
    }

    prevPage();
  }, [currentPageIndex, prevPage, setStatus, status]);

  const handleNextPage = useCallback(() => {
    if (!story || currentPageIndex >= story.pages.length - 1) return;

    const wasPlaying = status === 'playing' || status === 'loading' || shouldAutoPlayRef.current;
    playbackController.stop();
    narrationSessionRef.current++;
    isNarratingRef.current = false;

    if (wasPlaying) {
      shouldAutoPlayRef.current = true;
      setStatus('playing');
    } else {
      shouldAutoPlayRef.current = false;
    }

    nextPage();
  }, [story, currentPageIndex, nextPage, setStatus, status]);

  // Swipes in the book layout (programmatic scrolls are filtered out by the list)
  const handleManualPageChange = useCallback(
    (index: number) => {
      if (index === currentPageIndex) return;

      const wasPlaying = status === 'playing' || status === 'loading' || shouldAutoPlayRef.current;
      playbackController.stop();
      narrationSessionRef.current++;
      isNarratingRef.current = false;

      if (wasPlaying) {
        shouldAutoPlayRef.current = true;
        setStatus('playing');
      } else {
        shouldAutoPlayRef.current = false;
      }

      setCurrentPage(index);
    },
    [currentPageIndex, setCurrentPage, setStatus, status]
  );

  const handleReplaySentence = useCallback(
    (sentenceIndex: number, phase: 'en' | 'vi') => {
      if (!story) return;
      const page = story.pages[currentPageIndex];
      if (!page || !page.sentences[sentenceIndex]) return;

      stopNarration();
      // Play afterwards continues the page from this sentence.
      pageFinishedRef.current = false;
      setCurrentSentence(sentenceIndex);
      setBilingualPhase(phase);
      const sentence = page.sentences[sentenceIndex];

      playbackController.narratePage(
        {
          storyId: story.id,
          pageIndex: currentPageIndex,
          sentences: [sentence],
          sentenceIndexBase: sentenceIndex,
          language: phase,
          readingMode: phase === 'vi' ? 'single_vi' : 'single_en',
          speed,
        },
        {
          onSentenceStart: () => { },
          onSentenceDone: () => { },
          onPageDone: () => setStatus('paused'),
          onError: () => setStatus('paused'),
        }
      );
    },
    [story, currentPageIndex, speed, stopNarration]
  );

  const handleOpenSettings = useCallback(() => {
    // Pause so narration doesn't run behind the sheet; story and page stay put.
    if (status === 'playing') {
      stopNarration();
      setStatus('paused');
    }
    router.push('/reader-settings');
  }, [status, stopNarration, router]);

  const handleClose = useCallback(() => {
    stopNarration();
    if (story) {
      if (status === 'finished') {
        markCompleted(story.id);
      } else {
        saveProgress(story.id, currentPageIndex, story.pages.length);
      }
    }
    reset();
    // After a free story is finished for the first time, offer Premium once
    // (a soft, closable paywall). Otherwise just close the book.
    if (story && status === 'finished' && !isPremiumUser && !completionPaywallShown) {
      markCompletionPaywallShown();
      router.replace(paywallHref('completion', story.id));
      return;
    }
    router.back();
  }, [story, status, currentPageIndex, markCompleted, saveProgress, reset, router, stopNarration, isPremiumUser, completionPaywallShown, markCompletionPaywallShown]);

  const handleExplorePremium = useCallback(() => {
    if (!story) return;
    stopNarration();
    markCompleted(story.id);
    markCompletionPaywallShown();
    const storyId = story.id;
    reset();
    router.replace(paywallHref('completion', storyId));
  }, [story, stopNarration, markCompleted, markCompletionPaywallShown, reset, router]);

  // The reader follows only the Reading Appearance (Paper · Moonlight), never the
  // app's Light/Dark. The store mirrors prefs.readingAppearance (effect above), so
  // changing it in the reader-settings sheet re-themes an open book live.
  const t = getReaderTheme(readingAppearance);

  if (!story) {
    return (
      <View style={[styles.loading, { backgroundColor: t.background }]}>
        <MoonMark size={48} color={t.highlightBar} halo={t.highlightBg} />
        <Text style={[styles.loadingText, { color: t.textMuted }]}>{tr('reader.opening')}</Text>
      </View>
    );
  }

  const modeBadgeText =
    readingMode === 'bilingual_parallel'
      ? tr('reader.modeBilingual')
      : readingMode === 'vi_first_en_second'
        ? viFirstPhase === 'vi'
          ? tr('reader.modeViFirstRound1')
          : tr('reader.modeViFirstRound2')
        : readingMode === 'single_en'
          ? tr('reader.modeEnglishOnly')
          : tr('reader.modeVietnameseOnly');

  // Language the narrator is on right now (for the controls badge).
  const narrationLanguage: 'en' | 'vi' =
    readingMode === 'single_en'
      ? 'en'
      : readingMode === 'single_vi'
        ? 'vi'
        : readingMode === 'vi_first_en_second'
          ? viFirstPhase
          : bilingualPhase;

  const isNarrating = status === 'playing';

  // One reading column for the header, the page and the narration dock, so
  // their edges line up. Phones keep the original full-width page; tablets
  // get a book-sized page (a wider spread in landscape) with real margins.
  const column = readerColumn(screen.width, screen.height, layout);
  const regular = !screen.isCompact;

  return (
    <View style={[styles.container, { backgroundColor: t.background }]}>
      <StatusBar style={t.statusBar} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.xs, paddingHorizontal: column.margin }]}>
        <View style={[styles.headerRow, { maxWidth: column.maxWidth }]}>
          <IconButton onPress={handleClose} accessibilityLabel={tr('reader.closeBook')} variant="outline" borderColor={t.border}>
            <X size={20} color={t.text} strokeWidth={2} />
          </IconButton>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, regular && styles.headerTitleRegular, { color: t.text }]} numberOfLines={1}>
              {story.title.en}
            </Text>
            <Text style={[styles.headerSubtitle, { color: t.textMuted }]} numberOfLines={2}>
              {modeBadgeText}
            </Text>
          </View>

          <IconButton
            onPress={handleOpenSettings}
            accessibilityLabel={tr('reader.settings')}
            variant="outline"
            borderColor={t.border}
          >
            <SlidersHorizontal size={18} color={t.text} strokeWidth={2} />
          </IconButton>
        </View>
      </View>

      {sleepTimerEnded && status !== 'playing' && (
        <View style={[styles.sleepBanner, { backgroundColor: t.highlightBg }]} accessibilityLiveRegion="polite">
          <MoonStar size={14} color={t.highlightBar} />
          <Text style={[styles.sleepBannerText, { color: t.textSecondary }]}>
            {tr('reader.sleepEnded')}
          </Text>
        </View>
      )}

      {/* Reader Area */}
      <View style={styles.readerArea}>
        {layout === 'horizontal' ? (
          <HorizontalReader
            ref={flatListRef}
            pages={story.pages}
            currentPageIndex={currentPageIndex}
            activeSentenceIndex={currentSentenceIndex}
            activeBilingualPhase={bilingualPhase}
            readingMode={readingMode}
            readerTheme={t}
            isLearningMode={isLearningMode}
            isNarrating={isNarrating}
            maxPageWidth={column.maxWidth}
            margin={column.margin}
            onPageChange={handleManualPageChange}
            onWordSelect={(def) => setSelectedWord(def)}
            onReplaySentence={handleReplaySentence}
          />
        ) : (
          <VerticalReader
            pages={story.pages}
            currentPageIndex={currentPageIndex}
            activeSentenceIndex={currentSentenceIndex}
            activeBilingualPhase={bilingualPhase}
            readingMode={readingMode}
            readerTheme={t}
            isLearningMode={isLearningMode}
            isNarrating={isNarrating}
            maxPageWidth={column.maxWidth}
            margin={column.margin}
            onWordSelect={(def) => setSelectedWord(def)}
            onReplaySentence={handleReplaySentence}
          />
        )}
      </View>

      {/* Controls */}
      <ReaderControls
        status={status}
        currentPageIndex={currentPageIndex}
        totalPages={story.pages.length}
        readerTheme={t}
        narrationLanguage={narrationLanguage}
        columnWidth={regular ? column.width : undefined}
        onPlay={handlePlay}
        onPause={handlePause}
        onReplay={handleReplay}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />

      {/* Finished */}
      {status === 'finished' && (
        <ScrollView
          style={[styles.finishedOverlay, { backgroundColor: t.scrim }]}
          contentContainerStyle={[
            styles.finishedContent,
            { paddingTop: insets.top + Spacing.lg, paddingBottom: insets.bottom + Spacing.lg },
          ]}
          bounces={false}
        >
          <View style={[styles.finishedCard, regular && styles.finishedCardRegular, { backgroundColor: t.name === 'paper' ? Palette.night : t.surface }]}>
            <MoonMark size={64} color={Palette.moonGlow} halo="rgba(243,227,181,0.12)" />
            <Text style={styles.finishedTitle} accessibilityRole="header">
              {tr('reader.theEnd')}
            </Text>
            <Text style={styles.finishedVi}>{tr('reader.theEndAlt')}</Text>
            <Text style={styles.finishedStory} numberOfLines={2}>
              {story.title.en}
            </Text>
            <Text style={styles.finishedSubtitle}>{tr('reader.goodnight')}</Text>
            <Button
              label={tr('reader.readAgain')}
              onPress={handlePlay}
              color={Palette.moonGlow}
              textColor={Palette.night}
              icon={<RotateCcw size={16} color={Palette.night} strokeWidth={2.4} />}
              style={styles.finishedBtn}
            />
            {!isPremiumUser ? (
              <Button
                label={tr('reader.morePremium')}
                variant="ghost"
                textColor={Palette.moonGlow}
                icon={<Sparkles size={15} color={Palette.moonGlow} strokeWidth={2.2} />}
                onPress={handleExplorePremium}
              />
            ) : null}
            <Button
              label={tr('reader.closeTheBook')}
              variant="ghost"
              textColor="rgba(243,236,219,0.82)"
              onPress={handleClose}
            />
          </View>
        </ScrollView>
      )}

      {/* Word Definition Modal */}
      <WordModal definition={selectedWord} onClose={() => setSelectedWord(null)} readerTheme={t} />
    </View>
  );
}

// The end-of-story card is always a night card (night ink on Paper, the Moonlight
// surface in Moonlight), so its text is candle-lit in both appearances.
const NIGHT_CARD_TEXT_SECONDARY = ReaderThemes.moonlight.textSecondary;

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  loadingText: { fontFamily: Typography.serif, fontSize: Typography.md, fontStyle: 'italic' },
  // Padded by the reading column's margin; the row is as wide as the page below it.
  header: { paddingBottom: Spacing.xs },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: '100%',
    alignSelf: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center', paddingHorizontal: Spacing.xs },
  headerTitle: { fontFamily: Typography.serif, fontSize: Typography.md, fontWeight: '700' },
  headerTitleRegular: { fontSize: Typography.lg },
  headerSubtitle: { fontSize: Typography.xs, marginTop: 2, fontWeight: '600', textAlign: 'center' },
  sleepBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.pill,
    marginTop: 4,
  },
  sleepBannerText: { fontSize: Typography.xs, fontWeight: '600' },
  readerArea: { flex: 1 },
  finishedOverlay: { ...StyleSheet.absoluteFill, zIndex: 100 },
  // Scrolls when the card is taller than the screen (small phones, large text),
  // so "Close the book" is always reachable.
  finishedContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  finishedCard: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    gap: 4,
    borderWidth: 1,
    borderColor: PremiumColors.borderMoon,
    ...ReaderShadow.page,
  },
  finishedCardRegular: { maxWidth: 440, paddingVertical: Spacing.xxl, paddingHorizontal: Spacing.xl },
  finishedTitle: {
    fontFamily: Typography.serif,
    fontSize: Typography.display,
    fontWeight: '700',
    color: Palette.moonGlow,
    marginTop: Spacing.sm,
  },
  finishedVi: { fontSize: Typography.base, color: PremiumColors.moonDim, fontWeight: '600', letterSpacing: 2 },
  finishedStory: {
    fontFamily: Typography.serif,
    fontSize: Typography.md,
    color: Palette.candle,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  finishedSubtitle: {
    fontSize: Typography.sm,
    color: NIGHT_CARD_TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    marginTop: 4,
  },
  finishedBtn: { alignSelf: 'stretch' },
});
