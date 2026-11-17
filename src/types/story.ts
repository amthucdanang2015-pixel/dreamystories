// ============================================================
// Story Data Types
// ============================================================

import type { ImageSourcePropType } from 'react-native';
import type { AudioSource } from 'expo-audio';
import type { UILanguagePreference } from '../i18n';
import type { AppAppearance, ReadingAppearance } from '../constants/theme';

export type Language = 'en' | 'vi';

/** A bundled audio asset from a static require('...mp3') (module id on native). */
export type AudioAssetSource = NonNullable<AudioSource>;

export interface SentenceAudio {
  en?: AudioAssetSource;
  vi?: AudioAssetSource;
}

export type ReadingMode =
  | 'bilingual_parallel'   // EN then VI sentence by sentence
  | 'vi_first_en_second'   // Full VI story then full EN story
  | 'single_en'            // English only
  | 'single_vi';           // Vietnamese only

export type ReaderLayout = 'horizontal' | 'vertical';

export interface BilingualText {
  en: string;
  vi: string;
}

export interface Sentence {
  id: string;
  en: string;
  vi: string;
  /** Pre-recorded narration per language. Missing entries fall back to TTS. */
  audio?: SentenceAudio;
}

export interface StoryPage {
  id: string;
  image: string; // illustration key (SVG registry key or '<storyId>/page-NN')
  /** Bundled PNG illustration, when one exists. */
  imageSource?: ImageSourcePropType;
  sentences: Sentence[];
}

/** Shape of the generated asset registry (src/data/stories/storyAssets.generated.ts). */
export interface StoryAssetEntry {
  cover?: ImageSourcePropType;
  pages: Array<{
    image?: ImageSourcePropType;
    sentences: SentenceAudio[];
  }>;
}

/** Named colour roles of a story's illustration palette. */
export interface StoryPalette {
  /** Upper sky / dominant backdrop */
  sky: string;
  /** Horizon / lower sky */
  skyLow: string;
  ground: string;
  groundDeep: string;
  /** The story's signature colour (used sparingly in the UI too). */
  accent: string;
  /** Light source: moon, lamp, sun, magic */
  glow: string;
  /** Darkest line / silhouette colour */
  ink: string;
  /** Pale tint of the palette, for card backgrounds */
  paper: string;
}

/** Visual identity of one story (source: content JSON `artDirection`). */
export interface StoryArtDirection {
  mood: string;
  setting: string;
  light: string;
  motifs: string[];
  avoid: string[];
  palette: StoryPalette;
}

export interface Story {
  id: string;
  title: BilingualText;
  description: BilingualText;
  coverImage: string; // illustration key (SVG registry key or '<storyId>/cover')
  /** Bundled PNG cover, when one exists. */
  coverImageSource?: ImageSourcePropType;
  /** Short positive theme of the tale. */
  theme?: BilingualText;
  duration: string;   // e.g. "5 min"
  ageRange: string;   // e.g. "3–8 years"
  category: string;
  languages: Language[];
  pages: StoryPage[];
  /** Story-specific art direction; drives the vector illustrations and UI accents. */
  art?: StoryArtDirection;
}

// ============================================================
// Playback State Types
// ============================================================

export interface PlaybackState {
  isPlaying: boolean;
  currentPageIndex: number;
  currentSentenceIndex: number;
  language: Language;
  readingMode: ReadingMode;
  speed: number;
  layout: ReaderLayout;
  readingAppearance: ReadingAppearance;
  isLearningMode: boolean;
  autoTurnPage: boolean;
  pageSoundEnabled: boolean;
  storyId: string | null;
}

// ============================================================
// User Preferences
// ============================================================

export interface UserPreferences {
  /** Language of the app's menus and buttons ('system' follows the device).
   *  Independent of defaultLanguage, which is the *story reading* language. */
  uiLanguage: UILanguagePreference;
  defaultLanguage: Language;
  defaultReadingMode: ReadingMode;
  defaultLayout: ReaderLayout;
  narrationSpeed: number;
  /** Whole-app chrome: Follow System / Light / Dark. */
  appAppearance: AppAppearance;
  /** Reading canvas only: Paper / Moonlight. Independent of appAppearance. */
  readingAppearance: ReadingAppearance;
  learningMode: boolean;
  autoTurnPage: boolean;
  pageSoundEnabled: boolean;
  sleepTimerMinutes: number; // 0 = off
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  uiLanguage: 'system',
  defaultLanguage: 'en',
  defaultReadingMode: 'bilingual_parallel',
  defaultLayout: 'horizontal',
  narrationSpeed: 0.9,
  appAppearance: 'system',
  readingAppearance: 'paper',
  learningMode: false,
  autoTurnPage: true,
  pageSoundEnabled: true,
  sleepTimerMinutes: 0,
};

