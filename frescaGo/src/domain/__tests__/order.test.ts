import { describe, expect, it } from "vitest";
import { orderReference, orderTotal } from "../order";
import type { Order } from "../order";
import { apple, pear } from "../../test/fixtures";

describe("order", () => {
  it("adds up the order items", () => {
    const order: Order = {
      userEmail: "buyer@example.com",
      paymentId: "cs_1",
      paymentMethod: "stripe",
      orderItems: [
        { ...apple, quantity: 2 },
        { ...pear, quantity: 1 },
      ],
    };
    expect(orderTotal(order)).toBe(7.5);
  });
});

describe("order total", () => {
  const base: Order = {
    userEmail: "buyer@example.com",
    paymentId: "cs_1",
    paymentMethod: "stripe",
    orderItems: [{ ...apple, quantity: 2 }],
  };

  it("adds the shipping that was charged", () => {
    expect(orderTotal({ ...base, shippingCost: 4.99 })).toBeCloseTo(8.99);
  });

  it("does not invent shipping for orders saved without it", () => {
    expect(orderTotal(base)).toBe(4);
    expect(orderTotal({ ...base, shippingCost: 0 })).toBe(4);
  });
});

describe("order reference", () => {
  it("builds a short readable reference from the payment id", () => {
    expect(orderReference("cs_test_b1snxm19HPOxDYkZJNn8Hw0320r8dC1AZtNsJ3IR4rglOdW8WcSaoZ")).toBe(
      "FG-W8WCSAOZ"
    );
  });

  it("is stable for the same payment", () => {
    expect(orderReference("cs_test_abcdefgh12345678")).toBe(
      orderReference("cs_test_abcdefgh12345678")
    );
  });

  it("copes with short ids", () => {
    expect(orderReference("abc")).toBe("FG-ABC");
  });
});
