import { intlLocale } from "./locale";
import type { Locale } from "./locale";

export const CURRENCIES = ["EUR", "USD"] as const;

export type Currency = (typeof CURRENCIES)[number];

export interface ExchangeRate {
  usdPerEur: number;
  date: string;
  source: "ecb" | "fallback";
}

export const FALLBACK_USD_PER_EUR = 1.08;

export const defaultCurrencyFor = (locale: Locale): Currency =>
  locale === "es" ? "EUR" : "USD";

export const isCurrency = (value: unknown): value is Currency =>
  CURRENCIES.some((currency) => currency === value);

export const convertAmount = (
  amountEur: number,
  currency: Currency,
  usdPerEur: number
): number => (currency === "USD" ? amountEur * usdPerEur : amountEur);

export const formatMoney = (
  amountEur: number,
  currency: Currency,
  usdPerEur: number,
  locale: Locale
): string =>
  new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency,
  }).format(convertAmount(amountEur, currency, usdPerEur));
