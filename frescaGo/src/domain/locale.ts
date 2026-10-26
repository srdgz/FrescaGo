export const LOCALES = ["es", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

export const isLocale = (value: unknown): value is Locale =>
  LOCALES.some((locale) => locale === value);

export const parseLocale = (value: unknown): Locale =>
  isLocale(value) ? value : DEFAULT_LOCALE;

export const intlLocale = (locale: Locale): string =>
  locale === "es" ? "es-ES" : "en-US";
