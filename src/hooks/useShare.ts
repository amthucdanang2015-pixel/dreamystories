// ============================================================
// useShare — share the app or a story from any screen.
//
//   const { shareApp, shareStory, sharing, gate } = useShare();
//   ...render {gate} once in the screen.
//
// A grown-up check runs first (same gate as legal links and
// purchases); the native share sheet opens only after the gate has
// fully closed (see useParentalGate). Only a real API failure shows a
// message; opening or cancelling the sheet does not.
//
// The double-tap lock is released after SHARE_LOCK_MS even if the
// Share.share promise never settles: on iOS React Native resolves it
// only when the sheet finishes, and not at all when the user opens a
// target (e.g. Messages) and cancels inside it. Without the timeout the
// Share button would stay disabled for the rest of the session.
// ============================================================

import { useCallback, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Story } from '../types/story';
import { useParentalGate } from '../components/payment/ParentalGate';
import { SHARE_REQUIRES_PARENTAL_GATE } from '../constants/sharing';
import { openShareSheet } from '../services/shareService';
import { buildAppShare, buildStoryShare, type ShareContent } from '../utils/storyShare';
import { FALLBACK_UI_LANGUAGE, toSupportedLanguage } from '../i18n';

function notify(title: string, message: string) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

const SHARE_LOCK_MS = 1500;

export function useShare() {
  const { t, i18n } = useTranslation();
  const { guard, gate } = useParentalGate();
  const [sharing, setSharing] = useState(false);
  const busy = useRef(false);

  const run = useCallback(
    (build: () => ShareContent) => {
      const open = async () => {
        if (busy.current) return; // ignore double taps while the sheet is opening
        busy.current = true;
        setSharing(true);
        let released = false;
        const release = () => {
          if (released) return;
          released = true;
          busy.current = false;
          setSharing(false);
        };
        const timer = setTimeout(release, SHARE_LOCK_MS);
        try {
          const outcome = await openShareSheet(build());
          if (outcome === 'unavailable') notify(t('share.unavailableTitle'), t('share.unavailableMessage'));
          else if (outcome === 'error') notify(t('share.errorTitle'), t('share.errorMessage'));
        } catch {
          notify(t('share.errorTitle'), t('share.errorMessage'));
        } finally {
          clearTimeout(timer);
          release();
        }
      };
      if (SHARE_REQUIRES_PARENTAL_GATE) guard(open, t('parentalGate.reasonShare'));
      else open();
    },
    [guard, t]
  );

  const shareApp = useCallback(() => run(() => buildAppShare(t)), [run, t]);

  const shareStory = useCallback(
    (story: Story) => {
      const lng = toSupportedLanguage(i18n.language) ?? FALLBACK_UI_LANGUAGE;
      run(() => buildStoryShare(t, story, lng));
    },
    [run, t, i18n.language]
  );

  return { shareApp, shareStory, sharing, gate };
}
