// ============================================================
// Sharing configuration — StoryMoon
//
// Every public URL is null until a real one exists. Share messages
// simply leave the link out while a value is null, so nothing broken
// or invented is ever sent. Fill these in before release:
//
//   APP_STORE_URL        https://apps.apple.com/app/id<APPLE_APP_ID>
//                        (App Store Connect → App Information → Apple ID)
//   GOOGLE_PLAY_URL      https://play.google.com/store/apps/details?id=com.storymoon.app
//                        (only once the Play listing is published)
//   PUBLIC_LANDING_URL   the public StoryMoon website, if there is one
//   STORY_LINK_BASE_URL  https origin for universal / app links, e.g. https://<domain>
//                        Story links are `${STORY_LINK_BASE_URL}/story/<id>`,
//                        the same path as the Expo Router route app/story/[id].tsx.
//                        Only set this after the domain serves
//                        /.well-known/apple-app-site-association and
//                        /.well-known/assetlinks.json, and app.json has
//                        ios.associatedDomains + android.intentFilters for it.
//                        The page at that URL should also work in a browser
//                        (story preview + store badges) for people without the app.
//
// The custom scheme (storymoon://story/<id>) is never put in share text:
// it is not tappable in most messaging apps and does nothing when the
// app is not installed.
// ============================================================

export const SHARE_CONFIG: {
  appStoreUrl: string | null;
  googlePlayUrl: string | null;
  publicLandingUrl: string | null;
  storyLinkBaseUrl: string | null;
} = {
  appStoreUrl: 'https://apps.apple.com/app/id6834674576',
  googlePlayUrl: null,
  publicLandingUrl: null,
  storyLinkBaseUrl: null,
};

/**
 * Sharing opens the system share sheet, which can send content out of
 * the app, so it sits behind the same grown-up check as external links
 * (see PARENTAL_GATE_ENABLED in ./iap.ts).
 */
export const SHARE_REQUIRES_PARENTAL_GATE = true;
