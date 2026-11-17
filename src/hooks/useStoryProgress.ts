import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { useProgressStore, StoryProgress } from '../store/progressStore';
import type { Story } from '../types/story';

export type ReadingState = 'new' | 'reading' | 'finished';

export interface StoryProgressInfo {
  progress: StoryProgress | null;
  state: ReadingState;
  /** 0..1 — pages reached, 1 when finished */
  fraction: number;
  /** 1-based page reached, and the story's page count (reading state only). */
  page: number | null;
  total: number;
  /** "Page 3 of 8" / "Trang 3 / 8", "Finished", or null for unread stories
   *  (in the current UI language). */
  label: string | null;
}

/** Pure; callers re-render on language change through useTranslation(). */
export function describeProgress(story: Story, progress: StoryProgress | null): StoryProgressInfo {
  const total = story.pages.length;
  if (!progress) return { progress, state: 'new', fraction: 0, page: null, total, label: null };
  if (progress.completed)
    return { progress, state: 'finished', fraction: 1, page: null, total, label: i18n.t('progress.finished') };
  if (progress.pageIndex <= 0) return { progress, state: 'new', fraction: 0, page: null, total, label: null };
  const page = progress.pageIndex + 1;
  return {
    progress,
    state: 'reading',
    fraction: Math.min(1, page / total),
    page,
    total,
    label: i18n.t('progress.pageOf', { page, total }),
  };
}

/** Live reading progress for one story (re-renders when it, or the UI language, changes). */
export function useStoryProgress(story: Story): StoryProgressInfo {
  useTranslation();
  const progress = useProgressStore((s) => s.progressMap[story.id] ?? null);
  return describeProgress(story, progress);
}
