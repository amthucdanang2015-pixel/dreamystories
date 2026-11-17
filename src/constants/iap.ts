// ============================================================
// In-app purchase configuration — Dreamy Stories Premium
//
// Product IDs must match the auto-renewable subscriptions configured in
// App Store Connect for bundle ID com.lwl.storymoon, character for
// character. Prices never live here: they come from the App Store's
// localized product metadata (see src/services/iapService.ts).
// ============================================================

export const IAP_PRODUCT_IDS = {
  WEEKLY: 'com.lwl.storymoon.weekly',
  YEARLY: 'com.lwl.storymoon.yearly',
} as const;

export type IAPProductId = (typeof IAP_PRODUCT_IDS)[keyof typeof IAP_PRODUCT_IDS];

/** The plans offered on the paywall, in display order. */
export type PlanId = 'weekly' | 'yearly';

export const PLAN_PRODUCT_ID: Record<PlanId, IAPProductId> = {
  weekly: IAP_PRODUCT_IDS.WEEKLY,
  yearly: IAP_PRODUCT_IDS.YEARLY,
};

export const PRODUCT_PLAN: Record<IAPProductId, PlanId> = {
  [IAP_PRODUCT_IDS.WEEKLY]: 'weekly',
  [IAP_PRODUCT_IDS.YEARLY]: 'yearly',
};

export const ALL_PRODUCT_IDS: IAPProductId[] = [IAP_PRODUCT_IDS.WEEKLY, IAP_PRODUCT_IDS.YEARLY];

/** Yearly is the value plan and is preselected on the paywall. */
export const DEFAULT_PLAN: PlanId = 'yearly';

/**
 * Legal documents. The paywall opens the in-app /legal screen, which
 * shows a draft summary until these URLs are set.
 * TODO(release): publish final Terms of Use (or Apple's standard EULA)
 * and a Privacy Policy, then set the URLs here.
 */
export const LEGAL_URLS: { terms: string | null; privacy: string | null } = {
  terms: null,
  privacy: null,
};

/**
 * Grown-up check before purchase, restore and links that leave the app
 * (Apple Kids Category 1.3 / 5.1.4, Google Play Families policy).
 * Keep enabled for a children's app.
 */
export const PARENTAL_GATE_ENABLED = true;
