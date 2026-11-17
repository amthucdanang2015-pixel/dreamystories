// ============================================================
// Subscription domain types
// ============================================================

import type { IAPProductId, PlanId } from '../constants/iap';

export type { IAPProductId, PlanId };

/** Where product / entitlement data came from. Only the App Store today. */
export type IAPSource = 'store';

/** Billing period as reported by StoreKit (Product.SubscriptionPeriod). */
export interface SubscriptionPeriod {
  unit: 'day' | 'week' | 'month' | 'year';
  count: number;
}

/**
 * A subscription product as shown on the paywall.
 * Every field comes from the App Store's localized product metadata;
 * nothing here is hardcoded in purchase logic.
 */
export interface SubscriptionProduct {
  id: IAPProductId;
  plan: PlanId;
  title: string;
  description: string;
  /** Store-formatted price string, e.g. "$29.99" or "699.000 ₫". Display this as-is. */
  displayPrice: string;
  /** Numeric amount in `currency` units (e.g. 29.99). Used only for derived values; 0 when unknown. */
  price: number;
  /** ISO 4217 currency code. */
  currency: string;
  period: SubscriptionPeriod;
  source: IAPSource;
}

export interface Entitlement {
  isPremium: boolean;
  plan: PlanId | null;
  productId: IAPProductId | null;
  /** Epoch ms when the current period ends (renews or expires). */
  expiresAt: number | null;
  /** Epoch ms of the original purchase. */
  purchasedAt: number | null;
  source: IAPSource | null;
}

export const NO_ENTITLEMENT: Entitlement = {
  isPremium: false,
  plan: null,
  productId: null,
  expiresAt: null,
  purchasedAt: null,
  source: null,
};

/** Generic async status for loading-type operations. */
export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface ProductsState {
  status: LoadStatus;
  error: string | null;
}

export type PurchaseStatus =
  | 'idle'
  | 'purchasing'
  /** The App Store confirmed the purchase and the transaction was finished. */
  | 'purchased'
  /** Waiting for approval (Ask to Buy, Strong Customer Authentication…). Nothing is unlocked yet. */
  | 'pending'
  | 'cancelled'
  /** Purchases cannot be made here (web, Android, or StoreKit unavailable). */
  | 'unavailable'
  | 'error';

export interface PurchaseState {
  status: PurchaseStatus;
  plan: PlanId | null;
  error: string | null;
}

export type RestoreStatus = 'idle' | 'restoring' | 'restored' | 'nothing_to_restore' | 'error';

export interface RestoreState {
  status: RestoreStatus;
  error: string | null;
}

/** Result of IAPService.purchase(). */
export type PurchaseResult =
  | { status: 'purchased'; entitlement: Entitlement }
  | { status: 'pending' }
  | { status: 'cancelled' }
  | { status: 'unavailable'; message: string }
  | { status: 'error'; message: string };

/** Result of IAPService.restorePurchases(). */
export type RestoreResult =
  | { status: 'restored'; entitlement: Entitlement }
  | { status: 'nothing_to_restore' }
  | { status: 'error'; message: string };

/** Why the paywall was opened — used for copy and (later) analytics. */
export type PaywallSource = 'premium_story' | 'completion' | 'settings' | 'library';
