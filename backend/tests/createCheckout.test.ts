import { describe, expect, it, vi } from "vitest";
import { makeCreateCheckout } from "../src/application/createCheckout.js";
import { createInMemoryCatalog } from "../src/infrastructure/catalog/InMemoryCatalogRepository.js";
import { products } from "../src/infrastructure/catalog/data.js";

const setup = () => {
  const payments = {
    createCheckoutSession: vi.fn().mockResolvedValue("cs_test_1"),
  };
  const rates = {
    getRate: vi
      .fn()
      .mockResolvedValue({ usdPerEur: 1.1, date: "2026-10-23", source: "ecb" }),
  };
  const createCheckout = makeCreateCheckout({
    catalog: createInMemoryCatalog(),
    payments,
    rates,
    getFrontendUrl: () => "https://shop.test",
  });
  return { payments, createCheckout };
};

const input = (extra = {}) => ({
  items: [{ id: products[0].id, quantity: 2 }],
  email: "buyer@example.com",
  ...extra,
});

describe("createCheckout use case", () => {
  it("prices in euros and returns to the Spanish site by default", async () => {
    const { payments, createCheckout } = setup();

    const id = await createCheckout(input());

    expect(id).toBe("cs_test_1");
    const request = payments.createCheckoutSession.mock.calls[0][0];
    expect(request.currency).toBe("EUR");
    expect(request.locale).toBe("es");
    expect(request.lines[0].unitAmountCents).toBe(
      Math.round(products[0].price * 100)
    );
    expect(request.successUrl).toBe(
      "https://shop.test/es/success?session_id={CHECKOUT_SESSION_ID}"
    );
    expect(request.cancelUrl).toBe("https://shop.test/es/cancel");
  });

  it("charges in dollars and returns to the English site when asked", async () => {
    const { payments, createCheckout } = setup();

    await createCheckout(input({ currency: "USD", locale: "en" }));

    const request = payments.createCheckoutSession.mock.calls[0][0];
    expect(request.currency).toBe("USD");
    expect(request.lines[0].unitAmountCents).toBe(
      Math.round(products[0].price * 1.1 * 100)
    );
    expect(request.lines[0].product.title).toBe("Canary Islands bananas");
    expect(request.cancelUrl).toBe("https://shop.test/en/cancel");
  });

  it("falls back to euros and Spanish for unknown values", async () => {
    const { payments, createCheckout } = setup();

    await createCheckout(input({ currency: "GBP", locale: "fr" }));

    const request = payments.createCheckoutSession.mock.calls[0][0];
    expect(request.currency).toBe("EUR");
    expect(request.locale).toBe("es");
  });

  it("never reaches the gateway with an invalid cart", async () => {
    const { payments, createCheckout } = setup();

    await expect(
      createCheckout({ items: [], email: "buyer@example.com" })
    ).rejects.toThrow();
    expect(payments.createCheckoutSession).not.toHaveBeenCalled();
  });
});
