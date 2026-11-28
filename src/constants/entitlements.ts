// ============================================================
// Free vs Premium access rules
//
// Free forever (no account, no purchase):
//   • browse the whole library, story details, covers, descriptions
//     and the page-preview strip of every story
//   • read ten complete stories, with every reader feature
//     (bilingual modes, narration, learning mode, bedtime mode)
//
// Premium (any active subscription):
//   • every other story in the library
//   • recorded narration on stories as MP3s are added (others use on-device TTS)
//   • new stories and collections as they are released
//
// The rules live here, not in the story data, so story content and
// the generated asset registry stay untouched.
// ============================================================

/** Stories that are always free (10). The first four show the range of the
 *  app: a conversation phrase collection, an original bedtime story, the moon
 *  legend that gives StoryMoon its name, and a classic folk tale. The other
 *  six are original StoryMoon stories written for the free shelf. Every other
 *  story (e.g. so-dua, su-tich-trau-cau, nang-tien-oc, rua-va-tho,
 *  su-tu-va-chuot, qua-va-binh-nuoc) is premium by default.
 *  Order here is the order of the Library's Free Stories section. */
export const FREE_STORY_IDS: readonly string[] = [
  '100-everyday-conversations',
  'little-rabbit-moon',
  'chu-cuoi',
  'cay-khe',
  'ech-con-hat-ru',
  'den-ong-sao-cua-ba',
  'voi-con-ban-don',
  'hat-bi-cua-be-su',
  'canh-dieu-cua-na',
  'rua-con-ra-bien',
];

/** Online stories (src/data/onlineStories) anyone may open. Kept apart from
 *  FREE_STORY_IDS so the Free Stories shelf and the paywall's bundled-story
 *  counts are unchanged. An online story not listed here is premium. */
export const FREE_ONLINE_STORY_IDS: readonly string[] = [
  'meo-con-chuc-ngu-ngon',
  'chiec-o-mau-vang',
  'ca-vang-dem-sao',
  'gio-bac-va-mat-troi',
  'vit-con-xau-xi',
  'cay-tre-tram-dot',
];

export function isFreeStory(storyId: string): boolean {
  return FREE_STORY_IDS.includes(storyId) || FREE_ONLINE_STORY_IDS.includes(storyId);
}

export function isPremiumStory(storyId: string): boolean {
  return !isFreeStory(storyId);
}

/** True when the user may open this story. */
export function canAccessStory(storyId: string, isPremium: boolean): boolean {
  return isPremium || isFreeStory(storyId);
}
