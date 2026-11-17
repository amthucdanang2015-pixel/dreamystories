// ============================================================
// Platform-specific arguments for React Native `Share.share` — pure
// logic (no React Native imports, so it runs under `node --test`).
//
// iOS: `url` is a separate activity item, so targets (Messages, Mail,
//      Notes…) get a real link with a rich preview; `message` stays
//      plain text. `title` is ignored on iOS, `subject` is the email
//      subject line.
// Android: only `message` reaches the target app, so the link is
//      appended to it; `title` / `dialogTitle` title the chooser.
// Web: navigator.share accepts title, text and url.
// ============================================================

export interface ShareInput {
  title: string;
  message: string;
  url: string | null;
}

export interface ShareArgs {
  content: { title?: string; message: string; url?: string };
  options: { subject?: string; dialogTitle?: string };
}

const HTTPS_URL = /^https:\/\/[^\s]+$/i;

export function isShareableUrl(url: string | null | undefined): url is string {
  return !!url && HTTPS_URL.test(url);
}

export function buildShareArgs(platform: string, input: ShareInput): ShareArgs {
  const message = input.message.trim();
  const url = isShareableUrl(input.url) ? input.url : null;

  if (platform === 'ios') {
    return url
      ? { content: { message, url }, options: { subject: input.title } }
      : { content: { message }, options: { subject: input.title } };
  }
  if (platform === 'web') {
    return { content: { title: input.title, message, ...(url ? { url } : {}) }, options: {} };
  }
  // Android (and anything else): the link must be inside the text.
  return {
    content: { title: input.title, message: url ? `${message}\n${url}` : message },
    options: { dialogTitle: input.title, subject: input.title },
  };
}
