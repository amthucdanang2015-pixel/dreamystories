// ============================================================
// App rating — react-native-in-app-review, with a store-page fallback.
//
// iOS uses StoreKit's review prompt, Android the Google Play In-App
// Review API. Both are rate-limited by the OS/store and never say
// whether a prompt was actually shown, so a resolved request is
// treated as done and gets no message of its own. Only when the native
// prompt is not available (web, module not linked, no active scene)
// do we open the store's review page instead; if there is no store
// URL for this platform the caller is told it is unavailable.
// ============================================================

import { Linking, Platform } from 'react-native';
import InAppReview from 'react-native-in-app-review';
import { SHARE_CONFIG } from '../constants/sharing';

export type ReviewOutcome = 'requested' | 'openedStore' | 'unavailable' | 'error';

function storeReviewUrl(): string | null {
  if (Platform.OS === 'android') return SHARE_CONFIG.googlePlayUrl;
  if (!SHARE_CONFIG.appStoreUrl) return null;
  // iOS opens the App Store straight on the "Write a Review" sheet.
  return Platform.OS === 'ios' ? `${SHARE_CONFIG.appStoreUrl}?action=write-review` : SHARE_CONFIG.appStoreUrl;
}

async function requestNativeReview(): Promise<boolean> {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return false;
  try {
    if (!InAppReview.isAvailable()) return false;
    await InAppReview.RequestInAppReview();
    return true;
  } catch (e) {
    // Thrown when the native module isn't linked, or rejected (e.g. no
    // foreground scene on iOS). Fall back to the store page.
    if (__DEV__) console.warn('[review] in-app review failed', e);
    return false;
  }
}

export async function requestAppReview(): Promise<ReviewOutcome> {
  if (await requestNativeReview()) return 'requested';
  const url = storeReviewUrl();
  if (!url) return 'unavailable';
  try {
    await Linking.openURL(url);
    return 'openedStore';
  } catch (e) {
    if (__DEV__) console.warn('[review] could not open store page', e);
    return 'error';
  }
}
