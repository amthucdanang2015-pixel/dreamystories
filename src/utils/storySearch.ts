// ============================================================
// Story search — pure, case- and accent-insensitive matching.
// "son tinh", "Sơn Tinh" and "SON TINH" all find the same story,
// so children and parents can type Vietnamese with or without
// diacritics.
// ============================================================

import type { Story } from '../types/story';
import i18n, { SUPPORTED_UI_LANGUAGES } from '../i18n';
import { storyCategory } from '../i18n/storyMeta';

/** Lower-case, strip diacritics (incl. đ → d) and collapse whitespace. */
export function normalizeForSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

const indexCache = new WeakMap<Story, string>();

/** Every searchable field of a story, normalised once and cached. */
function searchIndex(story: Story): string {
  let idx = indexCache.get(story);
  if (idx === undefined) {
    idx = normalizeForSearch(
      [
        story.title.en,
        story.title.vi,
        story.description.en,
        story.description.vi,
        story.category,
        // The category's name in every UI language, so "truyền thuyết" finds Legends.
        ...SUPPORTED_UI_LANGUAGES.map((lng) => storyCategory(i18n.getFixedT(lng), story.category)),
        story.theme?.en ?? '',
        story.theme?.vi ?? '',
      ].join(' \n ')
    );
    indexCache.set(story, idx);
  }
  return idx;
}

/** True when every word of the query appears somewhere in the story's text. */
export function storyMatchesQuery(story: Story, query: string): boolean {
  const q = normalizeForSearch(query);
  if (!q) return true;
  const idx = searchIndex(story);
  return q.split(' ').every((term) => idx.includes(term));
}
