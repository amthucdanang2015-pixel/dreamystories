import { create } from 'zustand';
import { Language, ReadingMode, ReaderLayout, Story, Sentence } from '../types/story';
import type { ReadingAppearance } from '../constants/theme';

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'finished';

// Represents what we're currently narrating in bilingual parallel
export type BilingualPhase = 'en' | 'vi';

interface PlaybackStore {
  // Story context
  story: Story | null;
  storyId: string | null;

  // Reader settings
  language: Language;
  readingMode: ReadingMode;
  layout: ReaderLayout;
  readingAppearance: ReadingAppearance;
  isLearningMode: boolean;
  speed: number;

  // Playback
  status: PlaybackStatus;
  currentPageIndex: number;
  currentSentenceIndex: number;
  bilingualPhase: BilingualPhase; // which language in bilingual_parallel
  viFirstPhase: 'vi' | 'en';     // for vi_first_en_second mode
  autoTurnPage: boolean;
  pageSoundEnabled: boolean;

  // Actions
  setStory: (story: Story, initialPage?: number) => void;
  setLanguage: (lang: Language) => void;
  setReadingMode: (mode: ReadingMode) => void;
  setLayout: (layout: ReaderLayout) => void;
  setReadingAppearance: (v: ReadingAppearance) => void;
  setIsLearningMode: (v: boolean) => void;
  setSpeed: (speed: number) => void;
  setStatus: (status: PlaybackStatus) => void;
  setCurrentPage: (index: number) => void;
  setCurrentSentence: (index: number) => void;
  setBilingualPhase: (phase: BilingualPhase) => void;
  setViFirstPhase: (phase: 'vi' | 'en') => void;
  setAutoTurnPage: (v: boolean) => void;
  setPageSoundEnabled: (v: boolean) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
  initFromPrefs: (prefs: {
    language: Language;
    readingMode: ReadingMode;
    layout: ReaderLayout;
    speed: number;
    autoTurnPage: boolean;
    pageSoundEnabled: boolean;
    readingAppearance: ReadingAppearance;
  }) => void;
}

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  story: null,
  storyId: null,
  language: 'en',
  readingMode: 'bilingual_parallel',
  layout: 'horizontal',
  readingAppearance: 'paper',
  isLearningMode: false,
  speed: 0.9,
  status: 'idle',
  currentPageIndex: 0,
  currentSentenceIndex: 0,
  bilingualPhase: 'en',
  viFirstPhase: 'vi',
  autoTurnPage: true,
  pageSoundEnabled: true,

  setStory: (story, initialPage = 0) => set({ story, storyId: story.id, currentPageIndex: initialPage, currentSentenceIndex: 0, status: 'idle' }),
  setLanguage: (language) => set({ language }),
  setReadingMode: (readingMode) => set({ readingMode }),
  setLayout: (layout) => set({ layout }),
  setReadingAppearance: (readingAppearance) => set({ readingAppearance }),
  setIsLearningMode: (isLearningMode) => set({ isLearningMode }),
  setSpeed: (speed) => set({ speed }),
  setStatus: (status) => set({ status }),
  setCurrentPage: (currentPageIndex) => set({ currentPageIndex, currentSentenceIndex: 0, bilingualPhase: 'en' }),
  setCurrentSentence: (currentSentenceIndex) => set({ currentSentenceIndex }),
  setBilingualPhase: (bilingualPhase) => set({ bilingualPhase }),
  setViFirstPhase: (viFirstPhase) => set({ viFirstPhase }),
  setAutoTurnPage: (autoTurnPage) => set({ autoTurnPage }),
  setPageSoundEnabled: (pageSoundEnabled) => set({ pageSoundEnabled }),

  nextPage: () => {
    const { story, currentPageIndex } = get();
    if (!story) return;
    const next = currentPageIndex + 1;
    if (next < story.pages.length) {
      set({ currentPageIndex: next, currentSentenceIndex: 0, bilingualPhase: 'en' });
    } else {
      set({ status: 'finished' });
    }
  },

  prevPage: () => {
    const { currentPageIndex } = get();
    if (currentPageIndex > 0) {
      set({ currentPageIndex: currentPageIndex - 1, currentSentenceIndex: 0, bilingualPhase: 'en' });
    }
  },

  reset: () => set({
    story: null,
    storyId: null,
    status: 'idle',
    currentPageIndex: 0,
    currentSentenceIndex: 0,
    bilingualPhase: 'en',
    viFirstPhase: 'vi',
  }),

  initFromPrefs: (prefs) => set({
    language: prefs.language,
    readingMode: prefs.readingMode,
    layout: prefs.layout,
    speed: prefs.speed,
    autoTurnPage: prefs.autoTurnPage,
    pageSoundEnabled: prefs.pageSoundEnabled,
    readingAppearance: prefs.readingAppearance,
  }),
}));

