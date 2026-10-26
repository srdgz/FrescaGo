export const LOCALES = ["es", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

export const parseLocale = (value: unknown): Locale =>
  LOCALES.find((locale) => locale === value) ?? DEFAULT_LOCALE;
