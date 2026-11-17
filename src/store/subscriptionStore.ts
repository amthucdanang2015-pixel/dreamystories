// ============================================================
// Subscription store — products, selected plan, purchase / restore
// state and the user's entitlement. UI reads from here; only this
// store calls iapService.
// ============================================================

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_PLAN, PLAN_PRODUCT_ID, PlanId } from '../constants/iap';
import { iapService } from '../services/iapService';
import i18n from '../i18n';
import {
  Entitlement,
  NO_ENTITLEMENT,
  ProductsState,
  PurchaseState,
  RestoreState,
  SubscriptionProduct,
} from '../types/subscription';

/** Cached entitlement (offline fallback; the store is the source of truth). */
const CACHE_KEY = '@storymoon_subscription_v1';

interface PersistedSubscription {
  entitlement: Entitlement;
  completionPaywallShown: boolean;
}

const IDLE_PURCHASE: PurchaseState = { status: 'idle', plan: null, error: null };
const IDLE_RESTORE: RestoreState = { status: 'idle', error: null };

interface SubscriptionStore {
  isHydrated: boolean;
  isInitialized: boolean;
  entitlement: Entitlement;
  products: SubscriptionProduct[];
  productsState: ProductsState;
  selectedPlan: PlanId;
  purchaseState: PurchaseState;
  restoreState: RestoreState;
  /** The soft paywall after finishing a free story is shown once. */
  completionPaywallShown: boolean;

  hydrate: () => Promise<void>;
  initialize: () => Promise<void>;
  loadProducts: (force?: boolean) => Promise<void>;
  selectPlan: (plan: PlanId) => void;
  purchaseSelected: () => Promise<void>;
  restore: () => Promise<void>;
  /** Re-read the entitlement from the App Store (app foregrounded, after Manage Subscription…). */
  refreshEntitlement: () => Promise<void>;
  /** Open Apple's subscription management page. */
  manageSubscription: () => Promise<boolean>;
  resetTransientState: () => void;
  markCompletionPaywallShown: () => void;
  getProduct: (plan: PlanId) => SubscriptionProduct | undefined;
}

function stillActive(e: Entitlement, now = Date.now()): Entitlement {
  return e.isPremium && e.expiresAt !== null && e.expiresAt <= now ? NO_ENTITLEMENT : e;
}

let entitlementListenerAttached = false;

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => {
  const persist = () => {
    const { entitlement, completionPaywallShown } = get();
    const data: PersistedSubscription = { entitlement, completionPaywallShown };
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data)).catch(() => {});
  };

  const setEntitlement = (entitlement: Entitlement) => {
    set({ entitlement });
    persist();
  };

  return {
    isHydrated: false,
    isInitialized: false,
    entitlement: NO_ENTITLEMENT,
    products: [],
    productsState: { status: 'idle', error: null },
    selectedPlan: DEFAULT_PLAN,
    purchaseState: IDLE_PURCHASE,
    restoreState: IDLE_RESTORE,
    completionPaywallShown: false,

    hydrate: async () => {
      try {
        const raw = await AsyncStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<PersistedSubscription>;
          const cached = { ...NO_ENTITLEMENT, ...parsed.entitlement };
          set({
            // Only App Store entitlements count; anything else (e.g. left
            // over from the old development mock) is discarded.
            entitlement: cached.source === 'store' ? stillActive(cached) : NO_ENTITLEMENT,
            completionPaywallShown: !!parsed.completionPaywallShown,
          });
        }
      } catch {
        // A broken cache just means "not premium" until the store answers.
      }
      set({ isHydrated: true });
    },

    initialize: async () => {
      if (get().isInitialized) return;
      if (!entitlementListenerAttached) {
        entitlementListenerAttached = true;
        // Transactions finished outside a purchase flow: Ask to Buy approvals,
        // renewals, purchases replayed at launch or made on another device.
        iapService.onEntitlementChange((entitlement) => {
          setEntitlement(entitlement);
          if (get().purchaseState.status === 'pending') {
            set({ purchaseState: { status: 'purchased', plan: entitlement.plan, error: null } });
          }
        });
      }
      try {
        await iapService.initialize();
        const current = await iapService.getCurrentEntitlement();
        setEntitlement(current);
        set({ isInitialized: true });
      } catch {
        // Keep the cached entitlement; a later initialize() can retry.
      }
    },

    refreshEntitlement: async () => {
      if (!get().isInitialized) return get().initialize();
      try {
        setEntitlement(await iapService.getCurrentEntitlement());
      } catch {
        // Offline or StoreKit busy: keep what we have.
      }
    },

    manageSubscription: () => iapService.openManageSubscriptions(),

    loadProducts: async (force = false) => {
      const { productsState } = get();
      if (productsState.status === 'loading') return;
      if (productsState.status === 'ready' && !force) return;
      set({ productsState: { status: 'loading', error: null } });
      try {
        const products = await iapService.loadProducts();
        set({
          products,
          productsState: products.length
            ? { status: 'ready', error: null }
            : { status: 'error', error: i18n.t('errors.noPlans') },
        });
      } catch (e) {
        set({
          productsState: {
            status: 'error',
            error: e instanceof Error ? e.message : i18n.t('errors.plansFailed'),
          },
        });
      }
    },

    selectPlan: (selectedPlan) =>
      set((s) => ({
        selectedPlan,
        // A new choice clears an old error / cancellation message.
        purchaseState: s.purchaseState.status === 'purchasing' ? s.purchaseState : IDLE_PURCHASE,
      })),

    purchaseSelected: async () => {
      const { selectedPlan, purchaseState, getProduct } = get();
      if (purchaseState.status === 'purchasing') return;
      if (!getProduct(selectedPlan)) {
        set({ purchaseState: { ...IDLE_PURCHASE, status: 'error', plan: selectedPlan, error: i18n.t('errors.planUnavailable') } });
        return;
      }
      set({ purchaseState: { ...IDLE_PURCHASE, status: 'purchasing', plan: selectedPlan }, restoreState: IDLE_RESTORE });
      const result = await iapService.purchase(PLAN_PRODUCT_ID[selectedPlan]).catch(
        (): { status: 'error'; message: string } => ({ status: 'error', message: i18n.t('errors.purchaseFailed') })
      );
      switch (result.status) {
        case 'purchased':
          setEntitlement(result.entitlement);
          set({ purchaseState: { status: 'purchased', plan: selectedPlan, error: null } });
          break;
        case 'pending':
          set({ purchaseState: { ...IDLE_PURCHASE, status: 'pending', plan: selectedPlan } });
          break;
        case 'cancelled':
          set({ purchaseState: { ...IDLE_PURCHASE, status: 'cancelled', plan: selectedPlan } });
          break;
        case 'unavailable':
          set({ purchaseState: { ...IDLE_PURCHASE, status: 'unavailable', plan: selectedPlan, error: result.message } });
          break;
        case 'error':
          set({ purchaseState: { ...IDLE_PURCHASE, status: 'error', plan: selectedPlan, error: result.message } });
          break;
      }
    },

    restore: async () => {
      if (get().restoreState.status === 'restoring') return;
      set({ restoreState: { status: 'restoring', error: null } });
      const result = await iapService.restorePurchases().catch(
        (): { status: 'error'; message: string } => ({ status: 'error', message: i18n.t('errors.restoreFailed') })
      );
      if (result.status === 'restored') {
        setEntitlement(result.entitlement);
        set({ restoreState: { status: 'restored', error: null } });
      } else if (result.status === 'nothing_to_restore') {
        set({ restoreState: { status: 'nothing_to_restore', error: null } });
      } else {
        set({ restoreState: { status: 'error', error: result.message } });
      }
    },

    resetTransientState: () => set({ purchaseState: IDLE_PURCHASE, restoreState: IDLE_RESTORE }),

    markCompletionPaywallShown: () => {
      set({ completionPaywallShown: true });
      persist();
    },

    getProduct: (plan) => get().products.find((p) => p.plan === plan),
  };
});

/** True when the user has an active Premium entitlement. */
export const useIsPremium = () => useSubscriptionStore((s) => s.entitlement.isPremium);
