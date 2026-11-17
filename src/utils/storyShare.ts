// ============================================================
// Share-message builders — pure functions, no side effects.
//
// Messages contain only public catalogue text (title, theme, age
// range) and configured public URLs. Never reading progress, purchase
// state, preferences, narration settings or device identifiers.
// ============================================================

import { Platform } from 'react-native';
import type { TFunction } from 'i18next';
import type { Story } from '../types/story';
import type { UILanguage } from '../i18n';
import { storyAge, storyTitleFor } from '../i18n/storyMeta';
import { SHARE_CONFIG } from '../constants/sharing';
import { isShareableUrl } from './sharePayload';

export interface ShareContent {
  /** Dialog title on Android, subject line for email targets. */
  title: string;
  /** Body text, without the link. */
  message: string;
  /** Public https link, or null when none is configured. */
  url: string | null;
}

const isHttps = isShareableUrl;

/**
 * Best public link for the app: the landing page (works on any device),
 * else the sharer's own store, else the other store, else nothing.
 */
export function appShareUrl(): string | null {
  const { publicLandingUrl, appStoreUrl, googlePlayUrl } = SHARE_CONFIG;
  const own = Platform.OS === 'android' ? googlePlayUrl : appStoreUrl;
  const other = Platform.OS === 'android' ? appStoreUrl : googlePlayUrl;
  return [publicLandingUrl, own, other].find(isHttps) ?? null;
}

/**
 * Public link that opens the story's detail screen when StoryMoon is
 * installed (universal / app link). Falls back to the app link.
 */
export function storyShareUrl(storyId: string): string | null {
  const base = SHARE_CONFIG.storyLinkBaseUrl;
  if (isHttps(base) && /^[a-z0-9-]+$/.test(storyId)) {
    return `${base.replace(/\/+$/, '')}/story/${encodeURIComponent(storyId)}`;
  }
  return appShareUrl();
}

export function buildAppShare(t: TFunction): ShareContent {
  return { title: t('share.appTitle'), message: t('share.appMessage'), url: appShareUrl() };
}

export function buildStoryShare(t: TFunction, story: Story, lng: UILanguage): ShareContent {
  const title = storyTitleFor(story, lng);
  const theme = story.theme?.[lng] ?? '';
  const intro = t('share.storyMessage', { title, age: storyAge(t, story.ageRange) });
  return {
    title: t('share.storyTitle', { title }),
    message: theme ? `${intro}\n${theme}` : intro,
    url: storyShareUrl(story.id),
  };
}
