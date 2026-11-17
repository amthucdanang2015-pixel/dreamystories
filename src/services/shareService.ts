// ============================================================
// Native share sheet (React Native `Share`), no extra dependency.
//
// The payload per platform is built in ../utils/sharePayload.ts (iOS
// gets the link as its own `url` item; Android only reads `message`,
// so the link is appended there). Opening or dismissing the sheet is
// not an error and gets no message; a real failure is reported back.
//
// Must not be called while another modal (e.g. the parental gate) is
// still closing — on iOS that presentation is dropped silently. The
// gate takes care of that (see useParentalGate).
// ============================================================

import { Platform, Share } from 'react-native';
import type { ShareContent } from '../utils/storyShare';
import { buildShareArgs } from '../utils/sharePayload';

export type ShareOutcome = 'shared' | 'dismissed' | 'unavailable' | 'error';

export async function openShareSheet(content: ShareContent): Promise<ShareOutcome> {
  if (Platform.OS === 'web' && (typeof navigator === 'undefined' || !('share' in navigator))) {
    return 'unavailable';
  }
  const { content: payload, options } = buildShareArgs(Platform.OS, content);
  try {
    const result = await Share.share(payload, options);
    return result.action === Share.dismissedAction ? 'dismissed' : 'shared';
  } catch (e) {
    // A user cancel reported as an AbortError (web) is not an error.
    const name = (e as { name?: string } | null)?.name;
    if (name === 'AbortError') return 'dismissed';
    if (__DEV__) console.warn('[share] Share.share failed', e);
    return 'error';
  }
}
