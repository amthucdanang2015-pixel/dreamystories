// ============================================================
// Presenting story metadata in the UI language.
//
// Story data is never rewritten: category, duration and age range
// stay as authored in src/data/stories (e.g. "Folk Tale", "5 min",
// "3–8 years"). These helpers only *display* them in the current UI
// language, falling back to the original text for anything unknown.
// ============================================================

import type { TFunction } from 'i18next';
import type { Story } from '../types/story';
import type { UILanguage } from './index';

const CATEGORY_KEYS = {
  'Folk Tale': 'categories.folkTale',
  Legend: 'categories.legend',
  'Tết Tale': 'categories.tetTale',
  'Animal Tale': 'categories.animalTale',
  'Family Tale': 'categories.familyTale',
  Bedtime: 'categories.bedtime',
  Fable: 'categories.fable',
} as const;

export function storyCategory(t: TFunction, category: string): string {
  const key = CATEGORY_KEYS[category as keyof typeof CATEGORY_KEYS];
  return key ? t(key) : category;
}

/** "5 min" → "5 min" / "5 phút". */
export function storyDuration(t: TFunction, duration: string): string {
  const minutes = parseInt(duration, 10);
  return Number.isFinite(minutes) ? t('story.minutes', { count: minutes }) : duration;
}

/** "3–8 years" → "3–8 years" / "3–8 tuổi" (short: "3–8 yrs"). */
export function storyAge(t: TFunction, ageRange: string, short = false): string {
  const range = ageRange.match(/^\s*([\d\s–-]+?)\s*(years?|yrs?)?\s*$/i)?.[1];
  if (!range) return ageRange;
  return short ? t('story.ageShort', { range }) : t('story.age', { range });
}

export function storyPages(t: TFunction, story: Story): string {
  return t('story.pages', { count: story.pages.length });
}

/**
 * A story title for use *inside* a UI sentence ("“Thánh Gióng” và 8 truyện
 * khác…"). Standalone titles keep the app's bilingual English + Vietnamese
 * presentation; only embedded ones follow the UI language.
 */
export function storyTitleFor(story: Pick<Story, 'title'>, lng: UILanguage): string {
  return story.title[lng];
}
