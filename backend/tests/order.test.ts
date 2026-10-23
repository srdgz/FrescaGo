import { describe, expect, it } from "vitest";
import {
  InvalidCartError,
  InvalidEmailError,
  assertValidEmail,
  buildOrderLines,
  toCents,
} from "../src/domain/order.js";
import type { Product } from "../src/domain/catalog.js";

const apple: Product = {
  id: 1,
  title: "Manzana",
  price: 1.15,
  image: "x.png",
  quantity: 1,
  category: "Fruta",
  base: "Fruta",
};

const find = (id: number) => (id === apple.id ? apple : undefined);

describe("order domain", () => {
  it("converts prices to cents without floating point drift", () => {
    expect(toCents(1.15)).toBe(115);
    expect(toCents(19.99)).toBe(1999);
  });

  it("builds lines priced from the catalog", () => {
    const [line] = buildOrderLines([{ id: 1, quantity: 3 }], find);
    expect(line).toEqual({ product: apple, quantity: 3, unitAmountCents: 115 });
  });

  it.each([
    ["not an array", "nope"],
    ["an empty cart", []],
    ["an unknown product", [{ id: 2, quantity: 1 }]],
    ["a zero quantity", [{ id: 1, quantity: 0 }]],
    ["a negative quantity", [{ id: 1, quantity: -1 }]],
    ["a quantity over the limit", [{ id: 1, quantity: 100 }]],
    ["a null item", [null]],
  ])("rejects %s", (_label, items) => {
    expect(() => buildOrderLines(items, find)).toThrow(InvalidCartError);
  });

  it("validates emails", () => {
    expect(assertValidEmail("a@b.co")).toBe("a@b.co");
    expect(() => assertValidEmail("nope")).toThrow(InvalidEmailError);
    expect(() => assertValidEmail(undefined)).toThrow(InvalidEmailError);
  });
});
