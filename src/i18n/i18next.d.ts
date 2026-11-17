// Typed translation keys: t('library.title') is checked at compile time,
// and a typo or a removed key fails `tsc`.
import 'i18next';
import type { resources } from './index';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: (typeof resources)['en'];
  }
}
