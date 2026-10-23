import { describe, expect, it } from "vitest";
import {
  SHIPPING_AMOUNT,
  addItem,
  cartSubtotal,
  cartTotal,
  decreaseItem,
  itemTotal,
  removeItem,
} from "../cart";
import { apple, pear } from "../../test/fixtures";

describe("cart", () => {
  it("adds a new product with quantity 1", () => {
    expect(addItem([], apple)).toEqual([{ ...apple, quantity: 1 }]);
  });

  it("increments an existing product without mutating the input", () => {
    const items = [{ ...apple, quantity: 1 }];
    const next = addItem(items, apple);
    expect(next[0].quantity).toBe(2);
    expect(items[0].quantity).toBe(1);
  });

  it("decreases quantity but never below 1", () => {
    const items = [{ ...apple, quantity: 2 }];
    const once = decreaseItem(items, apple.id);
    expect(once[0].quantity).toBe(1);
    expect(decreaseItem(once, apple.id)[0].quantity).toBe(1);
  });

  it("ignores decreasing an unknown product", () => {
    const items = [{ ...apple, quantity: 2 }];
    expect(decreaseItem(items, 99)).toEqual(items);
  });

  it("removes a product", () => {
    const items = [
      { ...apple, quantity: 1 },
      { ...pear, quantity: 1 },
    ];
    expect(removeItem(items, apple.id).map((item) => item.id)).toEqual([
      pear.id,
    ]);
  });

  it("computes line, sub and grand totals", () => {
    const items = [
      { ...apple, quantity: 3 },
      { ...pear, quantity: 2 },
    ];
    expect(itemTotal(items[0])).toBe(6);
    expect(cartSubtotal(items)).toBe(13);
    expect(cartTotal(items)).toBeCloseTo(13 + SHIPPING_AMOUNT);
  });

  it("has a zero subtotal for an empty cart", () => {
    expect(cartSubtotal([])).toBe(0);
  });
});
