// ============================================================
// Free vs Premium access rules
//
// Free forever (no account, no purchase):
//   • browse the whole library, story details, covers, descriptions
//     and the page-preview strip of every story
//   • read three complete stories, with every reader feature
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

/** Stories that are always free. Chosen to show the range of the app:
 *  an original bedtime story, the moon legend that gives StoryMoon its
 *  name, and a classic folk tale. Newer additions (e.g. so-dua,
 *  su-tich-trau-cau, nang-tien-oc, rua-va-tho, su-tu-va-chuot,
 *  qua-va-binh-nuoc) are premium by default. */
export const FREE_STORY_IDS: readonly string[] = ['little-rabbit-moon', 'chu-cuoi', 'cay-khe'];

export function isFreeStory(storyId: string): boolean {
  return FREE_STORY_IDS.includes(storyId);
}

export function isPremiumStory(storyId: string): boolean {
  return !isFreeStory(storyId);
}

/** True when the user may open this story. */
export function canAccessStory(storyId: string, isPremium: boolean): boolean {
  return isPremium || isFreeStory(storyId);
}
