import { describe, expect, it, vi } from "vitest";
import { makeGetOrderConfirmation } from "../src/application/getOrderConfirmation.js";
import type { CheckoutRecord } from "../src/application/ports.js";
import { createInMemoryCatalog } from "../src/infrastructure/catalog/InMemoryCatalogRepository.js";
import {
  InvalidSessionError,
  PaymentNotCompletedError,
  SessionNotFoundError,
} from "../src/domain/orderConfirmation.js";
import { products } from "../src/infrastructure/catalog/data.js";

const sessionId = "cs_test_a1B2c3D4e5F6g7H8";

const record = (overrides: Partial<CheckoutRecord> = {}): CheckoutRecord => ({
  id: sessionId,
  paid: true,
  email: "buyer@example.com",
  currency: "EUR",
  locale: "es",
  usdPerEur: 1.1,
  items: [{ id: products[0].id, quantity: 2 }],
  amountTotalCents: 877,
  shipping: {
    recipient: "Ana Pérez",
    street: "Calle Mayor 12",
    postalCode: "28013",
    city: "Madrid",
    country: "ES",
  },
  createdAtSeconds: 1_790_000_000,
  ...overrides,
});

const setup = (found: CheckoutRecord | null) => {
  const payments = {
    createCheckoutSession: vi.fn(),
    retrieveCheckout: vi.fn().mockResolvedValue(found),
  };
  const getOrderConfirmation = makeGetOrderConfirmation({
    catalog: createInMemoryCatalog(),
    payments,
  });
  return { payments, getOrderConfirmation };
};

describe("getOrderConfirmation", () => {
  it("rebuilds a paid order from the catalog and what Stripe charged", async () => {
    const { getOrderConfirmation } = setup(record());

    const confirmation = await getOrderConfirmation(sessionId);

    expect(confirmation).toMatchObject({
      paymentId: sessionId,
      email: "buyer@example.com",
      currency: "EUR",
      exchangeRate: 1.1,
      locale: "es",
      amountPaid: 8.77,
      shippingCost: 4.99,
    });
    expect(confirmation.items[0]).toMatchObject({
      id: products[0].id,
      price: products[0].price,
      quantity: 2,
    });
  });

  it("reports free shipping for big orders", async () => {
    const { getOrderConfirmation } = setup(
      record({
        items: [{ id: products[0].id, quantity: 20 }],
        amountTotalCents: 3780,
      })
    );

    expect((await getOrderConfirmation(sessionId)).shippingCost).toBe(0);
  });

  it("keeps the amount in the currency that was charged", async () => {
    const { getOrderConfirmation } = setup(
      record({ currency: "USD", amountTotalCents: 983 })
    );

    const confirmation = await getOrderConfirmation(sessionId);

    expect(confirmation.currency).toBe("USD");
    expect(confirmation.amountPaid).toBe(9.83);
  });

  it("uses the date of the Stripe session", async () => {
    const { getOrderConfirmation } = setup(record());

    expect((await getOrderConfirmation(sessionId)).createdAt).toBe(
      new Date(1_790_000_000 * 1000).toISOString()
    );
  });

  it.each([
    undefined,
    null,
    42,
    "abc",
    "cs_test_",
    "cs_test_a b",
    "pi_test_a1B2c3D4e5F6",
  ])("rejects the session id %s without calling Stripe", async (id) => {
    const { payments, getOrderConfirmation } = setup(record());

    await expect(getOrderConfirmation(id)).rejects.toThrow(InvalidSessionError);
    expect(payments.retrieveCheckout).not.toHaveBeenCalled();
  });

  it("fails when the session does not exist", async () => {
    const { getOrderConfirmation } = setup(null);

    await expect(getOrderConfirmation(sessionId)).rejects.toThrow(
      SessionNotFoundError
    );
  });

  it("fails when the order was not paid", async () => {
    const { getOrderConfirmation } = setup(record({ paid: false }));

    await expect(getOrderConfirmation(sessionId)).rejects.toThrow(
      PaymentNotCompletedError
    );
  });

  it("cannot rebuild sessions without order data", async () => {
    const { getOrderConfirmation } = setup(record({ items: [] }));

    await expect(getOrderConfirmation(sessionId)).rejects.toThrow(
      SessionNotFoundError
    );
  });
});
