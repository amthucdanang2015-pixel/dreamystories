// ============================================================
// Online stories — remote narration host
//
// Online stories keep their text, metadata and cover in the app (they browse
// and display offline); only their sentence MP3s are streamed.
//
// The shipped stories play the exact Cloudinary Secure URLs stored as
// `audioUrl` in src/data/onlineStories/content/*.json. HOST_ONLINE is only a
// FALLBACK for a sentence that has no `audioUrl`.
//
// Optional: set HOST_ONLINE to the https URL of the folder you uploaded
//   /Users/Work/Manh/StoryMoon/online-stories to. Each sentence's relative
//   audio path (e.g. "chiec-o-mau-vang/page-01/sentence-01-en.mp3") is joined
//   to it in exactly one place: src/utils/onlineAudioUrl.ts.
//
//   Example: HOST_ONLINE = 'https://cdn.example.org/storymoon/online-stories'
//   → https://cdn.example.org/storymoon/online-stories/chiec-o-mau-vang/page-01/sentence-01-en.mp3
//
// Use https: iOS App Transport Security blocks plain http by default.
// While this is still the placeholder, online stories stay visible and
// readable, and Play shows a clear "audio not set up" message instead.
// ============================================================

/** The placeholder shipped in the repo. Treated as "not configured". */
export const HOST_ONLINE_PLACEHOLDER = 'https://REPLACE-WITH-YOUR-HOST.example.com/online-stories';

/** Base URL of the uploaded online-stories folder. Replace the placeholder. */
export const HOST_ONLINE: string = HOST_ONLINE_PLACEHOLDER;
