import type { ExchangeRateProvider } from "./ports.js";

export const makeGetExchangeRate = (rates: ExchangeRateProvider) => () =>
  rates.getRate();

export type GetExchangeRate = ReturnType<typeof makeGetExchangeRate>;
