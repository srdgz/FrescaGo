import { describe, expect, it } from "vitest";
import {
  FREE_SHIPPING_ABOVE,
  SHIPPING_AMOUNT,
  addItem,
  cartSubtotal,
  cartTotal,
  decreaseItem,
  itemTotal,
  removeItem,
  shippingCost,
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

  describe("shipping", () => {
    const worth = (euros: number) => [{ ...apple, price: euros, quantity: 1 }];

    it("costs the flat fee up to 30 euros", () => {
      expect(SHIPPING_AMOUNT).toBe(4.99);
      expect(shippingCost(worth(10))).toBe(SHIPPING_AMOUNT);
      expect(shippingCost(worth(29.99))).toBe(SHIPPING_AMOUNT);
    });

    it("is still charged at exactly 30 euros", () => {
      expect(FREE_SHIPPING_ABOVE).toBe(30);
      expect(shippingCost(worth(30))).toBe(SHIPPING_AMOUNT);
      expect(shippingCost([{ ...apple, price: 10, quantity: 3 }])).toBe(SHIPPING_AMOUNT);
    });

    it("is free above 30 euros", () => {
      expect(shippingCost(worth(30.01))).toBe(0);
      expect(shippingCost([{ ...apple, quantity: 16 }])).toBe(0);
    });

    it("counts every line of the cart", () => {
      expect(
        shippingCost([
          { ...apple, price: 12, quantity: 1 },
          { ...pear, price: 9.5, quantity: 2 },
        ])
      ).toBe(0);
    });

    it("is zero for an empty cart", () => {
      expect(shippingCost([])).toBe(0);
    });

    it("is added to the total only when it applies", () => {
      expect(cartTotal(worth(20))).toBeCloseTo(24.99);
      expect(cartTotal(worth(40))).toBe(40);
    });
  });
});
