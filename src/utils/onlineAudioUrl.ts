// ============================================================
// Online audio URLs. Each sentence prefers an exact, full URL copied from
// the hosting service (e.g. a Cloudinary Secure URL, stored as `audioUrl`
// in the story JSON) and used verbatim. Only a sentence without one falls
// back to HOST_ONLINE + "/" + relative path, built here and nowhere else.
// Pure (no React Native imports) so it is unit-tested with `node --test`.
// ============================================================

/**
 * An exact audio URL from metadata, returned unchanged (never rewritten,
 * re-encoded or re-versioned). Must be a single-line https URL; anything
 * else is rejected so the sentence is reported instead of requested.
 */
export function exactAudioUrl(url: string | null | undefined): string | null {
  if (typeof url !== 'string') return null;
  return /^https:\/\/[^\s/?#]+\/[^\s]*$/.test(url) ? url : null;
}

export type OnlineHostCheck =
  | { ok: true; base: string }
  | { ok: false; reason: 'missing' | 'placeholder' | 'invalid' };

/**
 * Validate the configured host. Accepts http(s) URLs with a host name and an
 * optional path; strips trailing slashes, query and fragment are rejected
 * (they would end up in the middle of every joined URL).
 */
export function checkOnlineHost(host: string | null | undefined, placeholder?: string): OnlineHostCheck {
  const raw = (host ?? '').trim();
  if (!raw) return { ok: false, reason: 'missing' };
  if (placeholder && raw === placeholder) return { ok: false, reason: 'placeholder' };
  const m = /^(https?):\/\/([^/?#\s]+)(\/[^?#\s]*)?$/i.exec(raw);
  if (!m) return { ok: false, reason: 'invalid' };
  const hostname = m[2].replace(/^[^@]*@/, '').replace(/:\d+$/, '');
  if (!hostname || hostname.startsWith('.') || hostname.endsWith('.')) return { ok: false, reason: 'invalid' };
  const pathPart = (m[3] ?? '').replace(/\/+$/, '');
  return { ok: true, base: `${m[1].toLowerCase()}://${m[2]}${pathPart}` };
}

/**
 * Normalise a relative audio path from story metadata: no leading slashes,
 * no empty, "." or ".." segments, never an absolute URL. Each segment is
 * URL-encoded (paths are ASCII by convention, but this stays safe).
 * Returns null for a path that must not be requested.
 */
export function normaliseRelativeAudioPath(rel: string | null | undefined): string | null {
  const raw = (rel ?? '').trim();
  // Leading slashes are stripped below, so the path always stays under HOST_ONLINE.
  if (!raw || /^[a-z][a-z0-9+.-]*:/i.test(raw)) return null;
  // Validate the decoded segments, so "%2e%2e" or "%2F" can't sneak past.
  const segments = raw.replace(/\\/g, '/').replace(/^\/+/, '').split('/').map(decodeSafe);
  if (segments.some((s) => s === '' || s === '.' || s === '..' || /[\\/]/.test(s))) return null;
  return segments.map((s) => encodeURIComponent(s)).join('/');
}

/** Join a validated base and a relative path. Null when either is unusable. */
export function buildOnlineAudioUrl(host: OnlineHostCheck, rel: string | null | undefined): string | null {
  if (!host.ok) return null;
  const path = normaliseRelativeAudioPath(rel);
  return path ? `${host.base}/${path}` : null;
}

function decodeSafe(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}
