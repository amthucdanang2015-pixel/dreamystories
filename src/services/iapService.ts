// ============================================================
// IAPService — the only module that talks to a purchase backend.
//
//   iOS            → StoreIAPService: StoreKit 2 through `expo-iap`.
//   web / Android  → UnavailableIAPService: shows plans as unavailable,
//                    never simulates a purchase.
//
// Rules the UI relies on:
//   • Prices, currency and billing period come from the App Store's
//     localized product metadata. Nothing is hardcoded.
//   • A purchase is reported as 'purchased' only after StoreKit delivered
//     a verified transaction, the entitlement was derived from it, and
//     the transaction was finished.
//   • Transactions that arrive outside a purchase flow (Ask to Buy
//     approvals, renewals, purchases replayed at launch, other devices)
//     are processed and finished the same way and reported through
//     onEntitlementChange().
//
// See docs/IAP_INTEGRATION.md.
// ============================================================

import { Linking, Platform } from 'react-native';
import type { ActiveSubscription, Purchase, PurchaseIOS, ProductSubscription } from 'expo-iap';
import { ALL_PRODUCT_IDS, IAPProductId, PRODUCT_PLAN } from '../constants/iap';
import {
  Entitlement,
  NO_ENTITLEMENT,
  PurchaseResult,
  RestoreResult,
  SubscriptionPeriod,
  SubscriptionProduct,
} from '../types/subscription';
import { ExpoIap } from './expoIap';
// User-facing messages are created in the UI language at the time of the error.
import i18n from '../i18n';

export interface IAPService {
  readonly mode: 'store' | 'unavailable';
  /** Whether this platform can start a purchase at all. */
  readonly canPurchase: boolean;
  /** Whether a "Manage subscription" action can open the platform page. */
  readonly canManageSubscriptions: boolean;
  /** Open the store connection. Safe to call more than once; rejects if StoreKit is unavailable. */
  initialize(): Promise<void>;
  /** Localized products for the given IDs (IDs the store doesn't know are simply absent). */
  loadProducts(ids?: IAPProductId[]): Promise<SubscriptionProduct[]>;
  purchase(productId: IAPProductId): Promise<PurchaseResult>;
  /** Sync with the App Store (may ask for the Apple ID password), then read the entitlement. */
  restorePurchases(): Promise<RestoreResult>;
  /** The active entitlement according to the store. Rejects when the store can't be reached. */
  getCurrentEntitlement(): Promise<Entitlement>;
  /** Open Apple's subscription management page. Resolves false if nothing could be opened. */
  openManageSubscriptions(): Promise<boolean>;
  /** Called whenever a transaction processed outside purchase() changes the entitlement. */
  onEntitlementChange(listener: (entitlement: Entitlement) => void): () => void;
  /** Close the store connection. */
  dispose(): Promise<void>;
}

/** Apple's subscription management page (fallback when the in-app sheet can't be shown). */
const APPLE_SUBSCRIPTIONS_URL = 'https://apps.apple.com/account/subscriptions';

const isOurProduct = (id: string): id is IAPProductId => (ALL_PRODUCT_IDS as string[]).includes(id);

// ─── Mapping helpers ──────────────────────────────────────────

function periodFrom(product: ProductSubscription): SubscriptionPeriod | null {
  if (product.platform !== 'ios') return null;
  const unit = product.subscriptionPeriodUnitIOS;
  const count = Number(product.subscriptionPeriodNumberIOS ?? 1) || 1;
  if (unit === 'day' || unit === 'week' || unit === 'month' || unit === 'year') return { unit, count };
  return null;
}

function toProduct(p: ProductSubscription): SubscriptionProduct | null {
  if (!isOurProduct(p.id)) return null;
  const period = periodFrom(p);
  if (!period) {
    if (__DEV__) console.warn(`[IAP] ${p.id} has no subscription period; is it an auto-renewable subscription?`);
    return null;
  }
  const displayName = p.platform === 'ios' ? p.displayNameIOS : p.displayName;
  return {
    id: p.id,
    plan: PRODUCT_PLAN[p.id],
    title: displayName || p.title,
    description: p.description,
    displayPrice: p.displayPrice,
    price: typeof p.price === 'number' && Number.isFinite(p.price) ? p.price : 0,
    currency: p.currency,
    period,
    source: 'store',
  };
}

function entitlementFromSubscriptions(subs: ActiveSubscription[], now = Date.now()): Entitlement {
  const active = subs
    .filter((s) => s.isActive && isOurProduct(s.productId))
    .filter((s) => s.expirationDateIOS == null || s.expirationDateIOS > now)
    // The subscription that runs longest decides the plan shown.
    .sort((a, b) => (b.expirationDateIOS ?? Infinity) - (a.expirationDateIOS ?? Infinity));
  const best = active[0];
  if (!best || !isOurProduct(best.productId)) return NO_ENTITLEMENT;
  return {
    isPremium: true,
    plan: PRODUCT_PLAN[best.productId],
    productId: best.productId,
    expiresAt: best.expirationDateIOS ?? null,
    purchasedAt: best.transactionDate ?? null,
    source: 'store',
  };
}

/** StoreIAPService only runs on iOS, so every Purchase it sees is a PurchaseIOS. */
const asIOS = (p: Purchase) => p as PurchaseIOS;

function entitlementFromPurchase(purchase: Purchase, now = Date.now()): Entitlement | null {
  if (!isOurProduct(purchase.productId) || purchase.purchaseState !== 'purchased') return null;
  const expiresAt = asIOS(purchase).expirationDateIOS ?? null;
  const revoked = asIOS(purchase).revocationDateIOS != null;
  if (revoked || (expiresAt !== null && expiresAt <= now)) return null;
  return {
    isPremium: true,
    plan: PRODUCT_PLAN[purchase.productId],
    productId: purchase.productId,
    expiresAt,
    purchasedAt: purchase.transactionDate ?? null,
    source: 'store',
  };
}

function errorCode(e: unknown): string | undefined {
  return e && typeof e === 'object' && 'code' in e ? String((e as { code: unknown }).code) : undefined;
}

type InFlight = {
  productId: IAPProductId;
  resolve: (result: PurchaseResult) => void;
};

// ─── App Store adapter (iOS) ──────────────────────────────────

type ExpoIapApi = NonNullable<typeof ExpoIap>;

class StoreIAPService implements IAPService {
  readonly mode = 'store' as const;
  readonly canPurchase = true;
  readonly canManageSubscriptions = true;

  private connecting: Promise<void> | null = null;
  private subscriptions: { remove: () => void }[] = [];
  private inFlight: InFlight | null = null;
  private products = new Map<IAPProductId, SubscriptionProduct>();
  private entitlementListeners = new Set<(e: Entitlement) => void>();

  constructor(private readonly iap: ExpoIapApi) {}

  initialize(): Promise<void> {
    if (!this.connecting) {
      this.connecting = (async () => {
        // Listeners first, so transactions StoreKit replays right after
        // connecting (unfinished purchases, Ask to Buy approvals) are caught.
        this.subscriptions.push(
          this.iap.purchaseUpdatedListener((p) => void this.handlePurchase(p)),
          this.iap.purchaseErrorListener((e) => this.handlePurchaseError(e))
        );
        const ok = await this.iap.initConnection();
        if (ok === false) throw new Error(i18n.t('errors.storeUnreachable'));
      })().catch((e) => {
        // Allow a later call to retry from scratch.
        this.removeListeners();
        this.connecting = null;
        throw e;
      });
    }
    return this.connecting;
  }

  async loadProducts(ids: IAPProductId[] = ALL_PRODUCT_IDS): Promise<SubscriptionProduct[]> {
    try {
      await this.initialize();
    } catch {
      throw new Error(i18n.t('errors.storeUnreachable'));
    }
    let raw: unknown[];
    try {
      raw = ((await this.iap.fetchProducts({ skus: ids, type: 'subs' })) ?? []) as unknown[];
    } catch {
      throw new Error(i18n.t('errors.storeUnreachable'));
    }
    const products = (raw as ProductSubscription[])
      .filter((p) => p && p.type === 'subs')
      .map(toProduct)
      .filter((p): p is SubscriptionProduct => p !== null);
    if (__DEV__) {
      const missing = ids.filter((id) => !products.some((p) => p.id === id));
      if (missing.length) {
        console.warn(
          `[IAP] App Store returned no product for: ${missing.join(', ')}. ` +
            'Check the IDs in App Store Connect, the Paid Apps agreement, and the bundle ID (com.lwl.storymoon).'
        );
      }
    }
    products.forEach((p) => this.products.set(p.id, p));
    return products;
  }

  async purchase(productId: IAPProductId): Promise<PurchaseResult> {
    try {
      await this.initialize();
    } catch {
      return { status: 'unavailable', message: i18n.t('errors.storeUnavailable') };
    }
    if (this.inFlight) return { status: 'error', message: i18n.t('errors.purchaseInProgress') };
    if (!this.products.has(productId)) {
      // StoreKit needs the product loaded before it can be bought.
      const loaded = await this.loadProducts([productId]).catch(() => []);
      if (!loaded.length) return { status: 'error', message: i18n.t('errors.planUnavailable') };
    }

    return new Promise<PurchaseResult>((resolve) => {
      const inFlight: InFlight = {
        productId,
        resolve: (result) => {
          if (this.inFlight === inFlight) this.inFlight = null;
          resolve(result);
        },
      };
      this.inFlight = inFlight;

      this.iap
        .requestPurchase({ request: { apple: { sku: productId } }, type: 'subs' })
        .then((returned) => {
          // The outcome normally arrives through the listeners. If StoreKit
          // also returns the transaction here, process it the same way
          // (handlePurchase ignores transactions it has already handled).
          const list = Array.isArray(returned) ? returned : returned ? [returned] : [];
          list.forEach((p) => void this.handlePurchase(p));
        })
        .catch((e: unknown) => this.handlePurchaseError(e));
    });
  }

  async restorePurchases(): Promise<RestoreResult> {
    try {
      await this.initialize();
    } catch {
      return { status: 'error', message: i18n.t('errors.storeUnavailable') };
    }
    try {
      // AppStore.sync(): refreshes the transaction history from Apple.
      await this.iap.restorePurchases();
    } catch (e) {
      if (this.iap.isUserCancelledError(e)) return { status: 'error', message: i18n.t('errors.restoreCancelled') };
      return { status: 'error', message: i18n.t('errors.restoreFailed') };
    }
    try {
      await this.finishUnfinishedTransactions();
      const entitlement = await this.getCurrentEntitlement();
      return entitlement.isPremium ? { status: 'restored', entitlement } : { status: 'nothing_to_restore' };
    } catch {
      return { status: 'error', message: i18n.t('errors.restoreFailed') };
    }
  }

  async getCurrentEntitlement(): Promise<Entitlement> {
    await this.initialize();
    // Transaction.currentEntitlements: verified, unrevoked, unexpired.
    const subs = await this.iap.getActiveSubscriptions(ALL_PRODUCT_IDS);
    return entitlementFromSubscriptions(subs ?? []);
  }

  async openManageSubscriptions(): Promise<boolean> {
    try {
      await this.initialize();
      // StoreKit's in-app "Manage Subscriptions" sheet.
      await this.iap.deepLinkToSubscriptions();
      return true;
    } catch {
      // Fall back to Apple's account page.
      return Linking.openURL(APPLE_SUBSCRIPTIONS_URL)
        .then(() => true)
        .catch(() => false);
    }
  }

  onEntitlementChange(listener: (entitlement: Entitlement) => void) {
    this.entitlementListeners.add(listener);
    return () => {
      this.entitlementListeners.delete(listener);
    };
  }

  async dispose() {
    this.removeListeners();
    if (this.connecting) {
      this.connecting = null;
      await this.iap.endConnection().catch(() => {});
    }
  }

  // ─── Transaction handling ───

  /** Transaction IDs already processed and finished in this session. */
  private handled = new Set<string>();

  private async handlePurchase(purchase: Purchase) {
    if (!purchase || !isOurProduct(purchase.productId)) return;
    const txId = asIOS(purchase).transactionId || purchase.id;
    // The purchase() call waiting for this product, if any.
    const flow = this.inFlight?.productId === purchase.productId ? this.inFlight : null;

    if (purchase.purchaseState === 'pending') {
      // Ask to Buy / SCA: nothing to unlock or finish yet. StoreKit delivers
      // the approved transaction later through the same listener.
      flow?.resolve({ status: 'pending' });
      return;
    }
    if (purchase.purchaseState !== 'purchased') return;
    if (txId && this.handled.has(txId)) return;
    if (txId) this.handled.add(txId);

    // 1. Grant: derive the entitlement from the verified transaction
    //    (StoreKit 2 only delivers transactions that passed JWS verification).
    //    Prefer the store's full view, which accounts for every product.
    let entitlement: Entitlement | null = entitlementFromPurchase(purchase);
    try {
      const current = await this.getCurrentEntitlement();
      if (current.isPremium) entitlement = current;
    } catch {
      // Keep the entitlement read from the transaction itself.
    }

    // 2. Finish, so StoreKit stops re-delivering the transaction. Subscriptions
    //    are never consumable. If finishing fails, StoreKit replays the
    //    transaction on the next launch and it is processed again.
    try {
      await this.iap.finishTransaction({ purchase, isConsumable: false });
    } catch (e) {
      if (txId) this.handled.delete(txId);
      if (__DEV__) console.warn('[IAP] finishTransaction failed', e);
    }

    // 3. Report.
    if (flow) {
      if (entitlement?.isPremium) flow.resolve({ status: 'purchased', entitlement });
      else flow.resolve({ status: 'error', message: i18n.t('errors.purchaseNotActive') });
    } else if (entitlement?.isPremium) {
      const granted = entitlement;
      this.entitlementListeners.forEach((l) => l(granted));
    }
  }

  private handlePurchaseError(error: unknown) {
    const flow = this.inFlight;
    if (!flow) return;
    const productId = error && typeof error === 'object' && 'productId' in error ? (error as { productId?: unknown }).productId : null;
    if (typeof productId === 'string' && productId !== flow.productId) return;
    const code = errorCode(error);
    if (this.iap.isUserCancelledError(error) || code === this.iap.ErrorCode.UserCancelled) {
      flow.resolve({ status: 'cancelled' });
    } else if (code === this.iap.ErrorCode.DeferredPayment || code === this.iap.ErrorCode.Pending) {
      flow.resolve({ status: 'pending' });
    } else if (code === this.iap.ErrorCode.AlreadyOwned) {
      // Already subscribed on this Apple ID: refresh instead of failing.
      this.getCurrentEntitlement()
        .then((entitlement) =>
          flow.resolve(
            entitlement.isPremium
              ? { status: 'purchased', entitlement }
              : { status: 'error', message: i18n.t('errors.purchaseFailed') }
          )
        )
        .catch(() => flow.resolve({ status: 'error', message: i18n.t('errors.purchaseFailed') }));
    } else if (
      code === this.iap.ErrorCode.IapNotAvailable ||
      code === this.iap.ErrorCode.BillingUnavailable ||
      code === this.iap.ErrorCode.FeatureNotSupported
    ) {
      flow.resolve({ status: 'unavailable', message: i18n.t('errors.storeUnavailable') });
    } else if (code === this.iap.ErrorCode.NetworkError) {
      flow.resolve({ status: 'error', message: i18n.t('errors.purchaseNetwork') });
    } else {
      if (__DEV__) console.warn('[IAP] purchase error', error);
      flow.resolve({ status: 'error', message: i18n.t('errors.purchaseFailed') });
    }
  }

  /** Finish any verified transaction for our products still waiting in the queue. */
  private async finishUnfinishedTransactions() {
    const purchases = await this.iap.getAvailablePurchases({ onlyIncludeActiveItemsIOS: true }).catch(() => []);
    for (const p of purchases ?? []) {
      if (isOurProduct(p.productId) && p.purchaseState === 'purchased') {
        await this.iap.finishTransaction({ purchase: p, isConsumable: false }).catch(() => {});
      }
    }
  }

  private removeListeners() {
    this.subscriptions.forEach((s) => s.remove());
    this.subscriptions = [];
  }
}

// ─── No store on this platform (web, Android) ─────────────────

class UnavailableIAPService implements IAPService {
  readonly mode = 'unavailable' as const;
  readonly canPurchase = false;
  readonly canManageSubscriptions = false;

  private message() {
    return Platform.OS === 'web' ? i18n.t('errors.subscriptionsWeb') : i18n.t('errors.subscriptionsUnavailable');
  }

  async initialize() {}
  async loadProducts(): Promise<SubscriptionProduct[]> {
    throw new Error(this.message());
  }
  async purchase(): Promise<PurchaseResult> {
    return { status: 'unavailable', message: this.message() };
  }
  async restorePurchases(): Promise<RestoreResult> {
    return { status: 'error', message: this.message() };
  }
  async getCurrentEntitlement(): Promise<Entitlement> {
    return NO_ENTITLEMENT;
  }
  async openManageSubscriptions() {
    return false;
  }
  onEntitlementChange() {
    return () => {};
  }
  async dispose() {}
}

// ─── Active adapter ───────────────────────────────────────────

export const iapService: IAPService =
  Platform.OS === 'ios' && ExpoIap ? new StoreIAPService(ExpoIap) : new UnavailableIAPService();
