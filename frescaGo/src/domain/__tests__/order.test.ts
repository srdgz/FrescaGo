import { describe, expect, it } from "vitest";
import {
  orderFromConfirmation,
  orderReference,
  orderTotal,
} from "../order";
import type { Order, OrderConfirmation } from "../order";
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

describe("order from a confirmation", () => {
  const confirmation: OrderConfirmation = {
    paymentId: "cs_test_abcdefgh12345678",
    email: "buyer@example.com",
    currency: "EUR",
    exchangeRate: 1.1,
    locale: "es",
    createdAt: "2026-10-26T10:15:00.000Z",
    items: [{ ...apple, quantity: 3 }],
    shippingCost: 0,
    amountPaid: 6,
    shipping: {
      recipient: "Ana Pérez",
      street: "Calle Mayor 12",
      postalCode: "28013",
      city: "Madrid",
      country: "ES",
    },
  };
  const user = { id: "uid-1", email: "buyer@example.com" };

  it("keeps everything Stripe confirmed", () => {
    expect(orderFromConfirmation(confirmation, user)).toEqual({
      userEmail: "buyer@example.com",
      paymentId: "cs_test_abcdefgh12345678",
      orderItems: confirmation.items,
      paymentMethod: "stripe",
      userId: "uid-1",
      currency: "EUR",
      exchangeRate: 1.1,
      createdAt: "2026-10-26T10:15:00.000Z",
      shippingCost: 0,
      amountPaid: 6,
      shipping: {
        recipient: "Ana Pérez",
        address: {
          street: "Calle Mayor 12",
          postalCode: "28013",
          city: "Madrid",
          country: "ES",
        },
      },
    });
  });

  it("keeps the buyer phone only when there is one", () => {
    const withPhone = orderFromConfirmation(
      { ...confirmation, shipping: { ...confirmation.shipping!, phone: "600" } },
      user
    );
    expect(withPhone.shipping?.phone).toBe("600");
    expect(
      "phone" in orderFromConfirmation(confirmation, user).shipping!
    ).toBe(false);
  });

  it("omits the shipping details when there are none", () => {
    expect("shipping" in orderFromConfirmation({ ...confirmation, shipping: null }, user)).toBe(
      false
    );
  });
});
