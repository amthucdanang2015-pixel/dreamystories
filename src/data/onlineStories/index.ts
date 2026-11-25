// ============================================================
// Online story catalogue
//
// Kept apart from the bundled catalogue (src/data/stories): bilingual text,
// metadata and covers are local (./content/*.json, assets/images/online-stories),
// so the Library shows these stories offline. Sentence MP3s are NOT bundled.
// Each sentence stores `audioUrl` (the exact Cloudinary Secure URL, played
// verbatim) and `audio` (the path relative to the online-stories upload
// folder). HOST_ONLINE + `audio` is only a fallback for sentences that have
// no `audioUrl` (see src/utils/onlineAudioUrl.ts).
//
// Add a story: see docs/ONLINE_STORIES.md, then run node scripts/online-stories.mjs
// ============================================================

import type { BilingualText, SentenceAudio, Story, StoryPalette } from '../../types/story';
import { HOST_ONLINE, HOST_ONLINE_PLACEHOLDER } from '../../constants/onlineStories';
import { buildOnlineAudioUrl, checkOnlineHost, exactAudioUrl } from '../../utils/onlineAudioUrl';
import { ONLINE_STORY_CONTENT, ONLINE_STORY_COVERS } from './catalog.generated';

/** Shape of src/data/onlineStories/content/<id>.json */
export interface OnlineStoryContent {
  id: string;
  title: BilingualText;
  description: BilingualText;
  theme?: BilingualText;
  category: string;
  ageRange: string;
  duration: string;
  estimatedDurationSec?: number | null;
  requiresInternet?: boolean;
  artDirection?: { palette?: StoryPalette };
  pages: Array<{
    sentences: Array<{
      en: string;
      vi: string;
      /** Relative to the upload folder, e.g. "<id>/page-01/sentence-01-en.mp3". */
      audio?: { en?: string; vi?: string };
      /** Exact full URLs copied from the host (Cloudinary Secure URL). Preferred. */
      audioUrl?: { en?: string; vi?: string };
    }>;
  }>;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** HOST_ONLINE checked once; used only for sentences without an exact audioUrl. */
export const ONLINE_HOST = checkOnlineHost(HOST_ONLINE, HOST_ONLINE_PLACEHOLDER);

type LangPaths = { en?: string; vi?: string };

/** Exact URL when the metadata has one; otherwise the HOST_ONLINE fallback. */
function sentenceUrl(lang: 'en' | 'vi', exact?: LangPaths, rel?: LangPaths): string | null {
  return exactAudioUrl(exact?.[lang]) ?? buildOnlineAudioUrl(ONLINE_HOST, rel?.[lang]);
}

function remoteAudio(exact?: LangPaths, rel?: LangPaths): SentenceAudio | undefined {
  const en = sentenceUrl('en', exact, rel);
  const vi = sentenceUrl('vi', exact, rel);
  if (!en && !vi) return undefined;
  return { ...(en ? { en: { uri: en } } : null), ...(vi ? { vi: { uri: vi } } : null) };
}

function buildOnlineStory(content: OnlineStoryContent): Story {
  const palette = content.artDirection?.palette;
  const pages = content.pages.map((page, pi) => ({
    id: `page-${pad(pi + 1)}`,
    image: `${content.id}/page-${pad(pi + 1)}`,
    sentences: page.sentences.map((s, si) => ({
      id: `p${pad(pi + 1)}-s${pad(si + 1)}`,
      en: s.en,
      vi: s.vi,
      audio: remoteAudio(s.audioUrl, s.audio),
    })),
  }));
  // Playable when every sentence has a URL in both languages.
  const audioReady = pages.every((p) => p.sentences.every((s) => !!s.audio?.en && !!s.audio?.vi));
  return {
    id: content.id,
    title: content.title,
    description: content.description,
    theme: content.theme,
    coverImage: `${content.id}/cover`,
    coverImageSource: ONLINE_STORY_COVERS[content.id],
    duration: content.duration,
    ageRange: content.ageRange,
    category: content.category,
    languages: ['en', 'vi'],
    art: palette ? { mood: '', setting: '', light: '', motifs: [], avoid: [], palette } : undefined,
    online: {
      requiresInternet: true,
      audioReady,
      hostProblem: audioReady ? undefined : ONLINE_HOST.ok ? 'missing' : ONLINE_HOST.reason,
      estimatedDurationSec: content.estimatedDurationSec ?? null,
    },
    pages,
  };
}

export const ONLINE_STORIES: Story[] = (ONLINE_STORY_CONTENT as OnlineStoryContent[]).map(buildOnlineStory);

export function isOnlineStory(story: Pick<Story, 'online'> | null | undefined): boolean {
  return !!story?.online;
}
