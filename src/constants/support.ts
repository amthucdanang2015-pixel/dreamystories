// ============================================================
// Support configuration — Dreamy Stories
//
// SUPPORT_URL is null until the real support page exists. While it is
// null (or not a valid https:// or mailto: link), Settings → General
// shows the Support row as unavailable and never tries to open it.
//
//   SUPPORT_URL   e.g. https://<domain>/support  or  mailto:<address>
// ============================================================

export const SUPPORT_URL: string | null = null;

/** The URL to open, or null when it is unset or not a link we should open. */
export function resolveSupportUrl(url: string | null = SUPPORT_URL): string | null {
  const value = url?.trim();
  if (!value) return null;
  return /^https:\/\/[^\s/]+\.[^\s]+$/i.test(value) || /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+/i.test(value)
    ? value
    : null;
}
