// ============================================================
// Derived pricing — always computed at runtime from the App Store's
// localized product data.
// ============================================================

import type { SubscriptionProduct } from '../types/subscription';
import { formattingLocale } from '../i18n';

/** Weeks per period unit. 52 weeks a year keeps the per-week figure
 *  slightly conservative (365 / 7 ≈ 52.14); 4 weeks a month likewise. */
const WEEKS_PER_UNIT = { day: 1 / 7, week: 1, month: 4, year: 52 } as const;

/** Formats an amount in the product's currency, in the UI language (+ device region). */
export function formatPrice(amount: number, currency: string, locale = formattingLocale()): string {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function perWeekAmount(product: SubscriptionProduct): number | null {
  if (!(product.price > 0) || product.period.count <= 0) return null;
  const weeks = WEEKS_PER_UNIT[product.period.unit] * product.period.count;
  return product.price / weeks;
}

/**
 * Effective weekly cost of a plan, formatted in its currency
 * (e.g. yearly $29.99 → "$0.58"). Null when it can't be computed.
 */
export function effectiveWeeklyPrice(product: SubscriptionProduct | undefined): string | null {
  if (!product) return null;
  const amount = perWeekAmount(product);
  return amount === null ? null : formatPrice(amount, product.currency);
}

/**
 * Whole-percent saving of the yearly plan against paying weekly for a
 * year. Only computed when both products are loaded, share a currency
 * and the saving is real; rounded down so it is never overstated.
 */
export function yearlySavingsPercent(
  yearly: SubscriptionProduct | undefined,
  weekly: SubscriptionProduct | undefined
): number | null {
  if (!yearly || !weekly || yearly.currency !== weekly.currency) return null;
  const y = perWeekAmount(yearly);
  const w = perWeekAmount(weekly);
  if (y === null || w === null || y >= w) return null;
  const pct = Math.floor((1 - y / w) * 100);
  return pct >= 1 ? pct : null;
}
