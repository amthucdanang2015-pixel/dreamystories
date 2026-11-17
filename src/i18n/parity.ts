// Compile-time guarantee that every UI language has every key English has.
// `tsc` fails here, naming the missing keys, if a locale file falls behind.
// Plural forms are compared by their base key, because languages need
// different plural categories (English: _one/_other, Vietnamese: _other).
import type en from './locales/en.json';
import type vi from './locales/vi.json';

type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];

type PluralBase<K extends string> = K extends `${infer B}_${'zero' | 'one' | 'two' | 'few' | 'many' | 'other'}` ? B : K;

type MissingIn<L> = Exclude<PluralBase<Leaves<typeof en>>, PluralBase<Leaves<L>>>;
type ExtraIn<L> = Exclude<PluralBase<Leaves<L>>, PluralBase<Leaves<typeof en>>>;

type Assert<T extends true> = T;
type NoKeys<K> = [K] extends [never] ? true : { missingOrExtraKeys: K };

export type ViHasEveryKey = Assert<NoKeys<MissingIn<typeof vi>>>;
export type ViHasNoStrayKeys = Assert<NoKeys<ExtraIn<typeof vi>>>;
