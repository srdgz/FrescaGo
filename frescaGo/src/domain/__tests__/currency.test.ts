import { describe, expect, it } from "vitest";
import {
  convertAmount,
  defaultCurrencyFor,
  formatMoney,
  isCurrency,
} from "../currency";
import { parseLocale } from "../locale";

describe("currency", () => {
  it("keeps euro amounts and converts dollar amounts", () => {
    expect(convertAmount(10, "EUR", 1.1)).toBe(10);
    expect(convertAmount(10, "USD", 1.1)).toBeCloseTo(11);
  });

  it("defaults the currency by language", () => {
    expect(defaultCurrencyFor("es")).toBe("EUR");
    expect(defaultCurrencyFor("en")).toBe("USD");
  });

  it("validates currency codes", () => {
    expect(isCurrency("EUR")).toBe(true);
    expect(isCurrency("USD")).toBe(true);
    expect(isCurrency("GBP")).toBe(false);
    expect(isCurrency(null)).toBe(false);
  });

  it("formats amounts for each language", () => {
    const spanish = formatMoney(1234.5, "EUR", 1.1, "es").replace(/\s/g, " ");
    expect(spanish).toBe("1234,50 €");

    expect(formatMoney(1234.5, "USD", 1.1, "en")).toBe("$1,357.95");
    expect(formatMoney(2, "EUR", 1.1, "en")).toBe("€2.00");
  });

  it("falls back to Spanish for unknown languages", () => {
    expect(parseLocale("fr")).toBe("es");
    expect(parseLocale("en")).toBe("en");
    expect(parseLocale(undefined)).toBe("es");
  });
});
