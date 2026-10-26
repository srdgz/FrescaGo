export const CURRENCIES = ["EUR", "USD"] as const;

export type Currency = (typeof CURRENCIES)[number];

export const DEFAULT_CURRENCY: Currency = "EUR";

export interface ExchangeRate {
  usdPerEur: number;
  date: string;
  source: "ecb" | "fallback";
}

export const parseCurrency = (value: unknown): Currency =>
  CURRENCIES.find((currency) => currency === value) ?? DEFAULT_CURRENCY;

export const convertToCents = (
  priceEur: number,
  currency: Currency,
  usdPerEur: number
): number =>
  Math.round(priceEur * (currency === "USD" ? usdPerEur : 1) * 100);
