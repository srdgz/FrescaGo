import { intlLocale } from "./locale";
import type { Locale } from "./locale";

export const SHIPPING_COUNTRIES = [
  "ES",
  "PT",
  "FR",
  "IT",
  "DE",
  "GB",
  "US",
] as const;

export type ShippingCountry = (typeof SHIPPING_COUNTRIES)[number];

export const DEFAULT_COUNTRY: ShippingCountry = "ES";

export const isShippingCountry = (value: unknown): value is ShippingCountry =>
  SHIPPING_COUNTRIES.some((country) => country === value);

export const countryName = (code: string, locale: Locale): string => {
  try {
    return (
      new Intl.DisplayNames([intlLocale(locale)], { type: "region" }).of(code) ??
      code
    );
  } catch {
    return code;
  }
};
