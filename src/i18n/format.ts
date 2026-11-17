// Locale-aware formatting through Intl, in the current UI language.
import { formattingLocale } from './index';

export function formatDate(timestamp: number): string {
  try {
    return new Intl.DateTimeFormat(formattingLocale(), { dateStyle: 'medium' }).format(new Date(timestamp));
  } catch {
    return new Date(timestamp).toDateString();
  }
}

/** 0.9 → "90%" (vi: "90%"). */
export function formatPercent(fraction: number): string {
  try {
    return new Intl.NumberFormat(formattingLocale(), { style: 'percent', maximumFractionDigits: 0 }).format(fraction);
  } catch {
    return `${Math.round(fraction * 100)}%`;
  }
}

/** Narration speed multiplier: 0.9 → "0.9×" (vi: "0,9×"). */
export function formatSpeed(multiplier: number): string {
  try {
    return `${new Intl.NumberFormat(formattingLocale(), { maximumFractionDigits: 2 }).format(multiplier)}×`;
  } catch {
    return `${multiplier}×`;
  }
}
