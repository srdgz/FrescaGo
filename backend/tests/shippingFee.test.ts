import { describe, expect, it } from "vitest";
import {
  FREE_SHIPPING_ABOVE_EUR,
  SHIPPING_FEE_EUR,
  orderSubtotalEurCents,
  shippingFeeCents,
} from "../src/domain/shippingFee.js";
import type { LocalizedProduct } from "../src/domain/catalog.js";
import type { OrderLine } from "../src/domain/order.js";

const line = (price: number, quantity: number): OrderLine => ({
  product: {
    id: 1,
    title: "Item",
    price,
    image: "x.png",
    quantity: 1,
    category: "Fruta",
    categoryLabel: "Fruta",
    base: "Fruta",
  } as LocalizedProduct,
  quantity,
  unitAmountCents: Math.round(price * 100),
});

const eur = { currency: "EUR" as const, usdPerEur: 1.1 };
const usd = { currency: "USD" as const, usdPerEur: 1.1 };

describe("shipping fee", () => {
  it("is 4.99 euros up to 30 euros", () => {
    expect(SHIPPING_FEE_EUR).toBe(4.99);
    expect(shippingFeeCents([line(10, 1)], eur)).toBe(499);
    expect(shippingFeeCents([line(2.5, 4)], eur)).toBe(499);
  });

  it("is still charged at exactly 30 euros", () => {
    expect(FREE_SHIPPING_ABOVE_EUR).toBe(30);
    expect(shippingFeeCents([line(15, 2)], eur)).toBe(499);
    expect(shippingFeeCents([line(10, 3)], eur)).toBe(499);
  });

  it("is free above 30 euros", () => {
    expect(shippingFeeCents([line(30.01, 1)], eur)).toBe(0);
    expect(shippingFeeCents([line(2, 16)], eur)).toBe(0);
    expect(shippingFeeCents([line(10, 2), line(11, 1)], eur)).toBe(0);
  });

  it("is charged in the chosen currency", () => {
    expect(shippingFeeCents([line(10, 1)], usd)).toBe(549);
  });

  it("decides on the euro price, not on the converted amount", () => {
    expect(shippingFeeCents([line(28, 1)], usd)).toBe(549);
    expect(shippingFeeCents([line(30.01, 1)], usd)).toBe(0);
  });

  it("adds up the subtotal in euro cents without float drift", () => {
    expect(orderSubtotalEurCents([line(1.15, 3)])).toBe(345);
    expect(orderSubtotalEurCents([line(0.1, 3), line(0.2, 1)])).toBe(50);
  });
});
