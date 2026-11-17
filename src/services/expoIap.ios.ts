// iOS: the real StoreKit 2 bridge (expo-iap). Metro picks this file on iOS;
// every other platform gets ./expoIap.ts, which never loads the native module.
import * as ExpoIapModule from 'expo-iap';

export const ExpoIap: typeof ExpoIapModule | null = ExpoIapModule;
