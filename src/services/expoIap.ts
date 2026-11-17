// Web and Android: no App Store here. The type-only import is erased at build
// time, so expo-iap is not bundled for these platforms. On iOS Metro resolves
// ./expoIap.ios.ts instead.
//
// Android (Google Play Billing) is not wired up yet: the paywall shows a clear
// "not available" message there and never simulates a purchase.
import type * as ExpoIapModule from 'expo-iap';

export const ExpoIap: typeof ExpoIapModule | null = null;
