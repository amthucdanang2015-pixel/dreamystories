# Dreamy Stories Premium: App Store subscriptions

Dreamy Stories sells Premium as two auto-renewable App Store subscriptions, bought through StoreKit 2 with [`expo-iap`](https://github.com/hyochan/expo-iap) (pinned to `6.4.1`). There is no mock store and no simulated purchase anywhere in the app.

| | |
| --- | --- |
| iOS bundle ID | `com.lwl.storymoon` |
| Weekly product ID | `com.lwl.storymoon.weekly` |
| Yearly product ID | `com.lwl.storymoon.yearly` |
| Platforms | iOS / iPadOS. Web and Android show "not available" and never sell anything. |

The product IDs live in `src/constants/iap.ts` (`IAP_PRODUCT_IDS`) and must match App Store Connect character for character.

## How the pieces fit

| Layer | File | Job |
| --- | --- | --- |
| Config | `src/constants/iap.ts` | Product IDs, plan ↔ product mapping, legal URLs, parental-gate switch |
| Rules | `src/constants/entitlements.ts` | Which stories are free; what Premium unlocks |
| Types | `src/types/subscription.ts` | Products, entitlement, purchase / restore / loading states |
| Native bridge | `src/services/expoIap.ios.ts` / `expoIap.ts` | Loads `expo-iap` on iOS only; `null` elsewhere, so web never bundles it |
| Adapter | `src/services/iapService.ts` | `StoreIAPService` (iOS, StoreKit 2) and `UnavailableIAPService` (web / Android) |
| State | `src/store/subscriptionStore.ts` | Products, selected plan, purchase / restore state, cached entitlement |
| Pricing | `src/utils/subscriptionPricing.ts` | Effective weekly price and yearly savings, derived from store prices |
| Gate | `src/hooks/usePremiumGate.ts` | `useStoryAccess`, `usePremiumGate`, `paywallHref` |
| UI | `app/paywall.tsx`, `src/components/payment/*` | Paywall, plan cards, Settings → Premium |

## What the app does

**Connection.** `subscriptionStore.initialize()` runs at launch (after the cached entitlement is loaded, so locks don't flicker). It registers `purchaseUpdatedListener` and `purchaseErrorListener`, then calls `initConnection()`, then reads the entitlement. If StoreKit can't be reached, the cached entitlement is kept and a later call retries.

**Products.** `fetchProducts({ skus, type: 'subs' })`. Each product's `displayPrice` (the App Store's localized string), numeric `price`, `currency`, `displayNameIOS` and `subscriptionPeriodUnitIOS` / `subscriptionPeriodNumberIOS` are mapped into `SubscriptionProduct`. The paywall shows `displayPrice` as is; the "ONLY $x / WEEK" figure and the "Save N%" badge are derived from `price` and only appear when both products share a currency. In development, a console warning names any product ID the App Store didn't return.

**Purchase.** `requestPurchase({ request: { apple: { sku } }, type: 'subs' })`, behind the parental gate. The outcome comes from the listeners:

| StoreKit outcome | App behaviour |
| --- | --- |
| Verified transaction, `purchaseState: 'purchased'` | Entitlement is derived (from `getActiveSubscriptions`, falling back to the transaction's own expiry), **then** `finishTransaction({ purchase, isConsumable: false })` is called, then the paywall shows the welcome card. If finishing fails, StoreKit re-delivers the transaction at next launch and it is processed again. |
| User cancelled | "Purchase cancelled. You have not been charged." |
| Pending (Ask to Buy, SCA) / `deferred-payment` | "Waiting for approval…". Nothing is unlocked or finished. When approved, StoreKit delivers the transaction through the same listener and Premium unlocks. |
| `already-owned` | The entitlement is re-read; if active, it is treated as purchased. |
| StoreKit / billing unavailable | "The App Store isn't available right now…" |
| Network error / anything else | A clear error; "You have not been charged." |

Transactions that arrive outside a purchase flow (renewals, Ask to Buy approvals, unfinished transactions replayed at launch, purchases on another device) are processed and finished the same way and update the entitlement through `iapService.onEntitlementChange`.

**Restore.** `restorePurchases()` (`AppStore.sync()`, which may ask for the Apple ID password), then finishes any verified transaction left in the queue, then reads `getActiveSubscriptions(ALL_PRODUCT_IDS)`. Behind the parental gate on both the paywall and Settings.

**Entitlement refresh.** On launch and every time the app returns to the foreground, `getActiveSubscriptions(ALL_PRODUCT_IDS)` (StoreKit's `Transaction.currentEntitlements`: verified, unrevoked, unexpired) decides Premium. The result is cached in AsyncStorage as an offline fallback; any cached entitlement whose `source` isn't `'store'` (for example, left over from the old development mock) is discarded.

**Manage subscription.** Settings → Premium → *Manage subscription* (behind the parental gate) calls `deepLinkToSubscriptions()`, which shows StoreKit's in-app Manage Subscriptions sheet. If that fails it opens `https://apps.apple.com/account/subscriptions`. On web and Android the row is shown as unavailable.

**Web and Android.** `UnavailableIAPService`: the plan cards show "Subscriptions are available in the Dreamy Stories app for iPhone and iPad…", purchase returns `unavailable`, restore returns an error. Nothing is ever simulated. (Android with Google Play Billing is not wired up; `expo-iap` supports it, but it needs Play Console products, `subscriptionOffers` offer tokens and testing.)

### Receipt validation

StoreKit 2 only delivers transactions whose JWS signature it has verified on the device, and the app reads entitlement from `Transaction.currentEntitlements`. That is sufficient for an app with no accounts or server content. If you later add a backend, verify `purchase.purchaseToken` (the JWS) with the App Store Server API and subscribe to App Store Server Notifications v2 before finishing the transaction.

## Build

`expo-iap` is a native module: it doesn't run in Expo Go or on web. The `expo-iap` config plugin is listed in `app.json`, and the committed `ios/` project already has the pod installed. After changing native dependencies:

```bash
cd ios && LANG=en_US.UTF-8 pod install
```

```bash
npx expo run:ios
```

## App Store Connect checklist

1. The app record uses bundle ID **`com.lwl.storymoon`**, and the App ID has the In-App Purchase capability (on by default).
2. **Agreements, Tax, and Banking**: the Paid Apps agreement is active. Products are not returned to the app until it is.
3. One subscription group (for example "Dreamy Stories Premium") contains exactly:
   - `com.lwl.storymoon.weekly`, duration 1 week
   - `com.lwl.storymoon.yearly`, duration 1 year
4. Each has a price, at least one localization (display name and description, which the app shows as the product title), and a review screenshot. Status should be "Ready to Submit" (or approved).
5. Rank yearly above weekly in the group so a switch is an upgrade/downgrade, not a second subscription.
6. Attach both subscriptions to the app version you submit (first submission: in the version's *In-App Purchases and Subscriptions* section).
7. Subscription group localization shows the app name **Dreamy Stories**.
8. Create Sandbox testers (Users and Access → Sandbox).

## Testing

- **Sandbox (real device):** sign in under Settings → App Store → Sandbox Account, run a development or TestFlight build, and check: products and localized prices load; weekly and yearly purchase; cancel at the payment sheet; restore on a fresh install; *Manage subscription* opens Apple's sheet; switching weekly ↔ yearly; expiry (Sandbox renews weekly plans every few minutes); Ask to Buy (enable "Interrupted purchases"/Ask to Buy on the Sandbox tester) shows the pending note and unlocks after approval.
- **Simulator / Xcode StoreKit testing (optional):** add a `.storekit` configuration file (File → New → StoreKit Configuration File, "Sync with App Store Connect") and select it in the scheme's Run options. Without one, the simulator returns no products and the paywall shows "Plans couldn't be loaded".
- **TestFlight** uses the Sandbox environment; no real charges.

## Before submission

- **Parental gate (built):** `src/components/payment/ParentalGate.tsx` sits in front of purchase, restore (paywall and Settings), Manage subscription, and Terms / Privacy once they point outside the app. Switch: `PARENTAL_GATE_ENABLED` in `src/constants/iap.ts`; keep it on for the Kids Category (Guidelines 1.3 and 5.1.4).
- Publish Terms of Use (or use Apple's standard EULA) and a Privacy Policy, then set `LEGAL_URLS` in `src/constants/iap.ts`. Until then the in-app `/legal` page shows a draft summary. App Review requires working links to both on the paywall and in the App Store metadata.
- The paywall shows the billed amount, billing period and auto-renewal terms next to the CTA, from store data.
