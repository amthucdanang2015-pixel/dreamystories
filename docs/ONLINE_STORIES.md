# Online stories

Online stories show up in the **Library → Online Stories** section, between Free and Premium. They get no tab of their own.
Their **text, metadata and cover live in the app**, so the title, description, cover, page text and
details still show offline. Only the **sentence narration MP3s** are streamed.

**Current setup:** every sentence plays the **exact Cloudinary Secure URL** stored as `audioUrl` in its
story JSON. These URLs were copied from the Cloudinary Media Library ("Copy Url") and are used verbatim.
They are never built from `HOST_ONLINE`, and their version (`v…`) and filename suffix (`_xxxxxx`) are
never inferred. `HOST_ONLINE` is only a fallback for a sentence that has no `audioUrl`.

Bundled stories are unchanged. They still use `src/data/stories`, `assets/audio` and
`storyAssets.generated.ts`, and they still fall back to on-device TTS when a clip fails.

## Where things live

| What | Where |
| --- | --- |
| Host URL (**replace this**) | `src/constants/onlineStories.ts` → `HOST_ONLINE` |
| The only place URLs are built | `src/utils/onlineAudioUrl.ts` (`checkOnlineHost`, `buildOnlineAudioUrl`) |
| Story metadata (one JSON per story) | `src/data/onlineStories/content/<story-id>.json` |
| Cover art | `assets/images/online-stories/<story-id>/cover.svg` (source) → `cover.png` (bundled) |
| Generated registry (do not edit) | `src/data/onlineStories/catalog.generated.ts` |
| Catalogue → `Story` objects | `src/data/onlineStories/index.ts` |
| Who may open them | `src/constants/entitlements.ts` → `FREE_ONLINE_STORY_IDS` |
| MP3 upload folder (not in the app) | `/Users/Work/Manh/StoryMoon/online-stories/` |
| Narration provenance log | `src/data/onlineStories/narration-log.json` |

The MP3s are **not** in `assets/audio`, not `require()`d, and not in `storyAssets.generated.ts`.
`test/onlineStories.test.ts` fails if that ever changes.

## Exact URLs (`audioUrl`)

```json
{ "en": "…", "vi": "…",
  "audio":    { "en": "chiec-o-mau-vang/page-01/sentence-01-en.mp3", "vi": "…" },
  "audioUrl": { "en": "https://res.cloudinary.com/dpmczirwo/video/upload/v1795350382/chiec-o-mau-vang/page-01/sentence-01-en_jmyze9.mp3", "vi": "…" } }
```

- `audioUrl.<lang>` is played as-is when it is a single-line https URL (`exactAudioUrl` in
  `src/utils/onlineAudioUrl.ts`).
- `audio.<lang>` stays as the local / upload-folder path. It is used for the MP3 audit, and with
  `HOST_ONLINE` only when `audioUrl` is missing.
- `node scripts/online-stories.mjs` fails if an `audioUrl`'s public ID isn't that sentence's
  `<story-id>/page-NN/sentence-NN-<lang>`, and lists sentences that have no `audioUrl`.
- To add a clip: upload it to Cloudinary under `<story-id>/page-NN/`, open the asset → Download →
  **Copy Url**, and paste that URL into `audioUrl`. Never type or edit the version or suffix by hand.

## How relative paths map to URLs (HOST_ONLINE fallback)

Every sentence in the JSON stores its audio path **relative to the upload folder**:

```json
{ "en": "…", "vi": "…",
  "audio": { "en": "chiec-o-mau-vang/page-01/sentence-01-en.mp3",
             "vi": "chiec-o-mau-vang/page-01/sentence-01-vi.mp3" } }
```

The convention matches the bundled audio: `<story-id>/page-NN/sentence-NN-<en|vi>.mp3`.

At runtime: `HOST_ONLINE` + `/` + relative path. Trailing slashes on the host and leading slashes on
the path are removed, so there is always exactly one `/` between them. Each path segment is URL-encoded.
Paths with `..`, empty segments or a URL scheme are rejected.

```
HOST_ONLINE = https://cdn.example.org/storymoon/online-stories
file        = /Users/Work/Manh/StoryMoon/online-stories/chiec-o-mau-vang/page-01/sentence-01-en.mp3
URL         = https://cdn.example.org/storymoon/online-stories/chiec-o-mau-vang/page-01/sentence-01-en.mp3
```

So: upload the **contents** of `online-stories/` so that `HOST_ONLINE/<story-id>/page-01/…` resolves.

## Setting up the host

1. Upload everything inside `/Users/Work/Manh/StoryMoon/online-stories/` to your server or CDN,
   keeping the folder structure. Serve `.mp3` as `audio/mpeg` and allow HTTP range requests
   (static hosts such as S3/CloudFront, Cloudflare R2 and Firebase Hosting do both).
2. In `src/constants/onlineStories.ts`, replace the placeholder:
   ```ts
   export const HOST_ONLINE: string = 'https://cdn.example.org/storymoon/online-stories';
   ```
   Use **https**. iOS App Transport Security blocks plain http.
3. Check one URL in a browser, then rebuild the app.

If `HOST_ONLINE` is missing, still the placeholder, or not a valid http(s) URL:

- the stories stay visible and readable;
- Story Detail says online narration isn't available;
- Play in the reader shows the same message and doesn't narrate;
- the console logs `[online] narration unavailable (HOST_ONLINE …)`.

## Playback behaviour

- Online clips play through the existing `narrationAudioService` (the same `expo-audio` player) with a
  `{ uri }` source. There is no second player.
- The watchdog allows streaming: 15 s to start and 10 s of stall, against 3.5 s / 2 s for bundled clips.
- A failed online clip (offline, 404, timeout) **does not** fall back to TTS. Narration stops on that
  sentence and the reader shows "Couldn't play the narration…" with **Try again**. Retry resumes at the
  same sentence and language.
- Reading modes (bilingual, Vietnamese-first, single-language), sentence highlighting, page turning,
  per-sentence replay and progress all work as for bundled stories.
- Covers and cards carry an **ONLINE** badge. The Library section and Story Detail say the narration
  needs internet.

## Adding an online story

1. **Metadata:** add `src/data/onlineStories/content/<story-id>.json`. Copy an existing file. The id is
   kebab-case ASCII and must not match a bundled story. Fill in `title`, `description`, `theme`,
   `category` (use an existing one, such as `Bedtime` or `Animal Tale`, so it gets translated), `ageRange`,
   `duration`, `artDirection.palette`, and `pages[].sentences[]` with `en`, `vi` and the `audio`
   paths in the convention above.
2. **Cover:** add `assets/images/online-stories/<story-id>/cover.svg` (360×360 viewBox, subject centred,
   since shelf cards crop the sides), or drop in a square `cover.png` directly.
3. **Access:** add the id to `FREE_ONLINE_STORY_IDS` in `src/constants/entitlements.ts` if it should
   be free. Otherwise it is premium.
4. **Narration:** generate it into the upload folder with VoiceStudio (local authoring tool, see README):
   ```bash
   node scripts/voicestudio/generate-narration.mjs --online --story <story-id> --voice-en demo0001 --voice-vi abf73455 --model omnivoice
   ```
   Use the **`abf73455` ("Vietnamese-voice-clean")** profile for Vietnamese. Its reference is a 4.8 s clip
   with matching text. **Don't use `746d2063` ("Vietnamese-voice"):** its 67 s reference reads the
   *Tích Chu* tale ("Tích Chu" 16 times, ending "…Tích Chu ơi, cho bà ngụm nước nào."). The model leaks
   the end of that reference into new clips, so they start with a spoken "Chu". The generator refuses it
   unless you pass `--allow-voice 746d2063`. Spot-check a clip with local speech-to-text, which should
   start with the sentence's first word:
   ```bash
   curl -s http://127.0.0.1:3900/v1/audio/transcriptions -F model=whisper-1 -F language=vi -F file=@<clip>.mp3
   ```
   Or record the MP3s yourself and save them at the exact relative paths.
5. **Registry + audit:** this renders the cover, regenerates `catalog.generated.ts`, checks every MP3
   with `ffprobe`, and writes `estimatedDurationSec`:
   ```bash
   node scripts/online-stories.mjs          # report
   node scripts/online-stories.mjs --check  # exit 1 if any MP3 or cover is missing
   ```
6. Upload the new `online-stories/<story-id>/` folder to the host.
7. `npm run typecheck && npm test`.
