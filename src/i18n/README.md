# UI localisation

```text
src/i18n/
  index.ts        i18next setup, device-language detection, applyUILanguage()
  i18next.d.ts    typed keys: t('library.title') is checked by tsc
  parity.ts       tsc fails if a locale is missing (or has extra) keys vs en.json
  format.ts       Intl formatting in the UI language: dates, percent, speed
  storyMeta.ts    shows story metadata (category, duration, age) in the UI language
  locales/
    en.json       source of truth for keys
    vi.json
```

## Two independent languages

| | UI language | Story reading language |
|---|---|---|
| Controls | menus, buttons, settings, paywall, a11y labels | the story text and narration |
| Preference | `prefs.uiLanguage`: `'system' \| 'en' \| 'vi'` | `prefs.defaultLanguage` + `prefs.defaultReadingMode` |
| Source | `locales/*.json` | each story's `en` / `vi` fields |
| Set in | Settings → Language → App Language | Settings → Reading |

Changing one never changes the other. Story titles keep their bilingual
English + Vietnamese presentation. Only a title quoted *inside* a UI
sentence (e.g. on the paywall) uses the UI language's title.

## Fallback

- `'system'`: the first of the device's preferred languages that StoryMoon
  supports (`en-GB` → `en`, `vi-VN` → `vi`, `[fr-FR, vi-VN]` → `vi`).
  If none is supported (e.g. only `fr-FR`), it uses English.
- A key missing in `vi.json` falls back to English at runtime, and fails
  `tsc` at build time (`parity.ts`). A key missing everywhere renders as
  empty text, never as the raw key, and logs a warning in development.

## Plurals and interpolation

Plural keys use i18next suffixes. English needs `_one` and `_other`;
Vietnamese has a single plural form, so it only needs `_other`. Values
are interpolated (`"Page {{page}} of {{total}}"`): never join translated
fragments in code. A styled part of a sentence uses `<Trans>` with a tag in
the string (see `controls.pageOf`).

## Adding a UI language (e.g. French)

1. Copy `locales/en.json` to `locales/fr.json` and translate the values.
   Keep the keys and `{{placeholders}}` unchanged, and add the plural forms
   French needs (`_one`, `_other`; and `_many` for large numbers).
2. In `index.ts`, import it, add `fr: { translation: fr }` to `resources`,
   and add `'fr'` to `SUPPORTED_UI_LANGUAGES`.
3. In `parity.ts`, add the same two `Assert` lines for `fr`.
4. Add `"fr"` to `languageNames` and `narrationLanguages` in **every**
   locale file.
5. Add `"fr"` to `supportedLocales` of the `expo-localization` plugin in
   `app.json` (and `CFBundleLocalizations` in `ios/StoryMoon/Info.plist`
   if the native project is committed), then rebuild the native app.
6. Run `npx tsc --noEmit`: it lists anything missing.

Story content is unaffected: the story data stays bilingual EN/VI.
