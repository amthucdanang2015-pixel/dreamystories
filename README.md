# StoryMoon — Premium Bilingual Children's Storybook Mobile App

> *"A little story every night. A little language every day."*

StoryMoon is a production-minded digital storybook for iOS, Android, and Web built with **React Native**, **Expo SDK 57**, **Expo Router**, and **TypeScript**. It offers an editorial, physical storybook aesthetic designed for bedtime storytelling and natural bilingual English & Vietnamese language learning.

---

## 🌟 Key Features

### 1. Three Reading Modes
- **Bilingual Parallel Mode**: Speaks and highlights each English sentence followed immediately by its Vietnamese translation.
- **Vietnamese First, English Second Mode**: Reads the entire story in natural Vietnamese first, then reloads and narrates the entire story in English.
- **Single Language Mode**: Read exclusively in English or exclusively in Vietnamese.

### 2. Dual Reading Layouts
- **Horizontal Book Mode**: Realistic physical book layout with inner spine gutter shadows, horizontal page swiping, page counter, and page indicators.
- **Vertical Scroll Mode**: Continuous editorial story flow with auto-scroll that advances smoothly to each page as narration proceeds.

### 3. Physical Book Page-Turning Experience
- Realistic organic paper rustle sound effect synthesized in real time (zero external sound file latency or missing asset risks).
- Tactile haptic feedback on page turns via `expo-haptics`.
- 700ms natural reading pause after each page narration completes before automatically turning the page.
- Prevention of duplicate playback when swipe gestures and auto-transitions occur simultaneously.
- Configurable **Auto-Turn Pages** and **Page-Turn Sound** toggles.

### 4. Interactive Learning Mode
- English sentences have interactive, tappable vocabulary words with subtle dotted underlines.
- Tapping any word opens the **WordModal** with Vietnamese translation, phonetics, part of speech, and contextual story example sentences.
- **Per-sentence replay button** next to each sentence for on-demand pronunciation practice.
- Distinct typographical hierarchy: elegant editorial English contrasted with gentle earthy Vietnamese companion text.

### 5. Bedtime Mode
- A designed "moonlit nursery" palette (`ReaderThemes.bedtime` in `src/constants/theme.ts`): deep indigo ink (`#12151F`), warm candle-coloured text (`#E8DFC8`, never pure white), moon-gold Vietnamese lines and highlights (`#D9BC85` / `#D4B47A`).
- Illustrations are gently dimmed and page shadows removed so no bright surface flashes in a dark room.
- Minimal, unobtrusive controls.
- Configurable sleep timer (15m, 30m, 60m).
- Soft golden highlights to avoid blue light before sleep.

### 6. Original Playable Bilingual Demo Story
- **Title**: *"The Little Rabbit and the Moon"* / *"Chú Thỏ Nhỏ và Mặt Trăng"*
- 6 illustrated pages with aligned English and Vietnamese sentences.
- Custom vector SVG illustrations for every single page depicting Mochi the rabbit, the meadow, the ancient oak, and the golden moon.
- Playable immediately from start to finish without any signup or external backend.

---

## 🏗️ Architecture & Project Structure

```
/Users/matyno/StoryMoon/
├── app/
│   ├── _layout.tsx              # Root Expo Router layout & provider
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Bottom tab navigation
│   │   ├── index.tsx            # Home screen (Featured, Bedtime collection)
│   │   ├── library.tsx          # Story library & category filters
│   │   └── settings.tsx         # User preferences & sleep timer
│   ├── story/
│   │   └── [id].tsx             # Story detail & configuration screen
│   └── reader/
│       └── [id].tsx             # Fullscreen story reader (Horizontal & Vertical)
├── src/
│   ├── assets/
│   │   └── illustrations/
│   │       └── registry.ts      # Page palettes and illustration mappings
│   ├── components/
│   │   ├── illustrations/
│   │   │   ├── StoryIllustration.tsx  # PNG if bundled, else the story's vector scene
│   │   │   ├── kit.tsx                # Shared vector primitives + brand Finish
│   │   │   └── scenes/                # One file per folk tale (cover + every page)
│   │   ├── ui/                        # Design-system primitives (Button, Chip, IconButton, …)
│   │   ├── reader/
│   │   │   ├── HorizontalReader.tsx   # Paged horizontal book mode
│   │   │   ├── VerticalReader.tsx     # Vertically scrolling book mode
│   │   │   ├── StoryPage.tsx          # Physical page with spine gutter shadow
│   │   │   ├── ReaderControls.tsx     # Play/pause, speed, page controls
│   │   │   ├── SentenceHighlight.tsx  # Bilingual sentence highlighting
│   │   │   └── WordModal.tsx          # Learning mode vocabulary popover
│   │   └── story/
│   │       └── StoryCard.tsx          # Featured, Default, & Compact cards
│   ├── constants/
│   │   └── theme.ts             # Premium storybook color & type tokens
│   ├── data/
│   │   ├── stories/
│   │   │   └── littleRabbit.ts  # Demo story data (EN + VI)
│   │   └── vocabulary.ts        # Bilingual dictionary for Learning Mode
│   ├── services/
│   │   ├── playbackController.ts# Orchestrates narration & page advances
│   │   ├── speechService.ts     # Abstract TTS narration layer
│   │   └── soundEffectService.ts# Real-time synthesized paper rustle & haptics
│   ├── store/
│   │   ├── playbackStore.ts     # Zustand reader playback state
│   │   └── preferencesStore.ts  # AsyncStorage persistent preferences
│   └── types/
│       └── story.ts             # TypeScript definitions & data contracts
├── app.json                     # Expo configuration
├── babel.config.js              # Babel & Reanimated configuration
└── package.json
```

---

## 🚀 Running the App

### 1. Start the development server
```bash
cd /Users/matyno/StoryMoon
npx expo start
```

### 2. Run on specific platforms
```bash
# Web browser
npx expo start --web

# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android
```

---

## 🎙️ Narration & Vietnamese Folk Tale Asset Pack

StoryMoon ships 10 gentle bilingual adaptations of Vietnamese folk tales (plus the original rabbit story). Each sentence can have its own recorded MP3 per language; anything missing falls back to on-device TTS (`expo-speech`), and missing illustrations fall back to the built-in vector art.

- **Story text:** `src/data/stories/content/<story-id>.json` (titles, descriptions, theme, character sheets, illustration prompts, `[en, vi]` sentence pairs).
- **Assets:** `assets/images/stories/<id>/cover.png`, `assets/images/stories/<id>/page-NN.png`, `assets/audio/<id>/page-NN/sentence-NN-<en|vi>.mp3`.
- **Registry:** `src/data/stories/storyAssets.generated.ts` holds static `require()` calls (Metro can only bundle static requires) and is generated from disk, so only files that exist are referenced.
- **Manifest / asset README:** `assets/stories-manifest.json` and `assets/STORY_ASSETS.md` (status of every asset, illustration style guide and prompts).

```bash
node scripts/story-assets.mjs          # validate content, regenerate registry + manifest + asset README
node scripts/story-assets.mjs --check  # same, exit 1 unless every asset is present
```

### Playback
`src/services/narrationAudioService.ts` plays clips with `expo-audio` (one reusable player, watchdog timeouts so playback can never hang). `src/services/playbackController.ts` plays EN then VI per sentence in bilingual mode, one language in single-language modes, and applies the reader speed via `setPlaybackRate` (pitch-corrected). A missing or failed clip falls back to TTS for that sentence only. The page-turn sound (`soundEffectService`) is separate and unchanged.

`expo-audio` is a native module: rebuild the dev client after pulling (`npx expo run:ios` / `npx expo run:android`).

### Generating narration with VoiceStudio (local authoring tool, not bundled)
1. Install and start [VoiceStudio](https://github.com/debpalash/VoiceStudio) (Apple Silicon macOS 13.3+). Its backend listens on `127.0.0.1:3900`.
2. Create or pick one saved voice profile per language (a gentle, clear narrator) so every sentence uses the same voice. Only clone a voice with its owner's permission.
3. Generate, then rebuild the registry:
   ```bash
   node scripts/voicestudio/generate-narration.mjs --story chu-cuoi --voice-en "<profile>" --voice-vi "<profile>"
   node scripts/story-assets.mjs
   ```
   Use `--all` for every story, `--dry-run` to preview. The script refuses to run if VoiceStudio is unreachable and verifies each MP3 with `ffprobe` before keeping it. Provenance is written to `assets/audio/narration-log.json`.

**Licensing:** the VoiceStudio app is AGPL-3.0; models carry their own terms. The default engine `k2-fsa/OmniVoice` has **CC-BY-NC (non-commercial)** weights and separate Higgs Audio 2 / Meta Llama 3 tokenizer terms; VoiceStudio's own inventory lists its commercial use as *restricted* and commercial output / redistribution rights as *unknown*. VoiceStudio also embeds an invisible provenance watermark in generated audio. Confirm the licence of the exact model and voice in VoiceStudio's Model Manager before shipping audio in a commercial app.

---

## 🔗 Sharing

"Share StoryMoon" (Settings → About) and "Share story" (Story Detail header) open the native share sheet through React Native's `Share` API, after the same grown-up check used for purchases and external links. Shared text contains only public catalogue text (title, theme, age range), never reading progress, purchases, preferences or device data.

Before release, fill in `src/constants/sharing.ts`. Every value is `null` until set, and links are left out of shared text while they are null:

- `appStoreUrl`: `https://apps.apple.com/app/id<APPLE_APP_ID>`
- `googlePlayUrl`: `https://play.google.com/store/apps/details?id=com.storymoon.app`
- `publicLandingUrl`: the public StoryMoon website, if any
- `storyLinkBaseUrl`: an https origin for universal / app links. Story links are `<base>/story/<id>`. Only set it once the domain serves `apple-app-site-association` and `assetlinks.json`, and `app.json` has `ios.associatedDomains` and `android.intentFilters` for it.

Inside the app, `storymoon://story/<id>` already opens Story Detail (Expo Router), but it is never put in share text: most messaging apps don't make it tappable, and it does nothing when the app isn't installed.

## 🎨 Design Philosophy
- **Tokens**: all colour, type, spacing, radius and shadow come from `src/constants/theme.ts`. Day = "paper by lamplight" (ivory `#F7F3E9`, ink `#26271F`, deep sage primary `#4E5B43`, moon-gold `#C6A66B`); bedtime = `ReaderThemes.bedtime`. Body text pairs meet WCAG AA (≥ 4.5:1).
- **Type**: platform serif (Georgia / Noto Serif, full Vietnamese coverage) for titles and English story text; upright system sans for Vietnamese lines so diacritics stay crisp for young readers.
- **Story identity**: each story's `artDirection` (content JSON) gives it its own palette, setting, light and motifs; the app chrome stays neutral and borrows only the story's accent dot and cover colours.
- **Icons**: 100% powered by `lucide-react-native` with consistent stroke weight. No emojis or random symbols in the UI.
- **Physical Details**: Book spine gutter shading on inner edges, subtle paper border dividers, and calm, child-friendly contrast.

