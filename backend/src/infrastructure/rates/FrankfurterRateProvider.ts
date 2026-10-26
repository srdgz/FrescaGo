import type { ExchangeRateProvider } from "../../application/ports.js";
import type { ExchangeRate } from "../../domain/currency.js";

const TTL_MS = 12 * 60 * 60 * 1000;
const DEFAULT_FALLBACK = 1.08;
const ENDPOINT = "https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD";

interface Options {
  fetchImpl?: typeof fetch;
  now?: () => number;
  getFallbackRate?: () => number;
}

const envFallback = (): number => {
  const parsed = Number(process.env.FALLBACK_EUR_USD_RATE);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_FALLBACK;
};

export const createFrankfurterRateProvider = ({
  fetchImpl = fetch,
  now = Date.now,
  getFallbackRate = envFallback,
}: Options = {}): ExchangeRateProvider => {
  let cached: { rate: ExchangeRate; fetchedAt: number } | null = null;

  const fetchLive = async (): Promise<ExchangeRate> => {
    const response = await fetchImpl(ENDPOINT, {
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) {
      throw new Error(`Rate request failed: ${response.status}`);
    }
    const body = (await response.json()) as {
      date?: string;
      rates?: { USD?: number };
    };
    const usdPerEur = body.rates?.USD;
    if (typeof usdPerEur !== "number" || !(usdPerEur > 0)) {
      throw new Error("Rate response has no USD value");
    }
    return {
      usdPerEur,
      date: body.date ?? new Date(now()).toISOString().slice(0, 10),
      source: "ecb",
    };
  };

  return {
    async getRate() {
      if (cached && now() - cached.fetchedAt < TTL_MS) {
        return cached.rate;
      }
      try {
        const rate = await fetchLive();
        cached = { rate, fetchedAt: now() };
        return rate;
      } catch (error) {
        console.error("Exchange rate error:", (error as Error).message);
        if (cached) {
          return cached.rate;
        }
        return {
          usdPerEur: getFallbackRate(),
          date: new Date(now()).toISOString().slice(0, 10),
          source: "fallback",
        };
      }
    },
  };
};
