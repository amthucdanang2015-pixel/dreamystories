// ============================================================
// Premium content gate
//   • free stories open normally
//   • premium stories send non-subscribers to the paywall
//   • subscribers open everything
// ============================================================

import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { canAccessStory, isPremiumStory } from '../constants/entitlements';
import { useSubscriptionStore } from '../store/subscriptionStore';
import type { PaywallSource } from '../types/subscription';

export interface StoryAccess {
  /** Story is part of Premium (regardless of the user's subscription). */
  premium: boolean;
  /** User can't open it right now. */
  locked: boolean;
}

export function getStoryAccess(storyId: string, isPremiumUser: boolean): StoryAccess {
  const premium = isPremiumStory(storyId);
  return { premium, locked: !canAccessStory(storyId, isPremiumUser) };
}

export function useStoryAccess(storyId: string | undefined): StoryAccess {
  const isPremiumUser = useSubscriptionStore((s) => s.entitlement.isPremium);
  return storyId ? getStoryAccess(storyId, isPremiumUser) : { premium: false, locked: false };
}

export function paywallHref(source: PaywallSource, storyId?: string) {
  return `/paywall?source=${source}${storyId ? `&storyId=${encodeURIComponent(storyId)}` : ''}` as const;
}

/** Returns `guard(storyId, open)`: runs `open` when allowed, otherwise shows the paywall. */
export function usePremiumGate() {
  const router = useRouter();
  const isPremiumUser = useSubscriptionStore((s) => s.entitlement.isPremium);
  return useCallback(
    (storyId: string, open: () => void) => {
      if (canAccessStory(storyId, isPremiumUser)) open();
      else router.push(paywallHref('premium_story', storyId));
    },
    [isPremiumUser, router]
  );
}
