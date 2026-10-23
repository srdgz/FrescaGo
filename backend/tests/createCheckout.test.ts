import { describe, expect, it, vi } from "vitest";
import { makeCreateCheckout } from "../src/application/createCheckout.js";
import { createInMemoryCatalog } from "../src/infrastructure/catalog/InMemoryCatalogRepository.js";
import { products } from "../src/infrastructure/catalog/data.js";

const setup = () => {
  const payments = {
    createCheckoutSession: vi.fn().mockResolvedValue("cs_test_1"),
  };
  const createCheckout = makeCreateCheckout({
    catalog: createInMemoryCatalog(),
    payments,
    getFrontendUrl: () => "https://shop.test",
  });
  return { payments, createCheckout };
};

describe("createCheckout use case", () => {
  it("asks the gateway for a session with server prices and return urls", async () => {
    const { payments, createCheckout } = setup();

    const id = await createCheckout({
      items: [{ id: products[0].id, quantity: 2 }],
      email: "buyer@example.com",
    });

    expect(id).toBe("cs_test_1");
    const request = payments.createCheckoutSession.mock.calls[0][0];
    expect(request.lines[0].unitAmountCents).toBe(
      Math.round(products[0].price * 100)
    );
    expect(request.successUrl).toBe(
      "https://shop.test/success?session_id={CHECKOUT_SESSION_ID}"
    );
    expect(request.cancelUrl).toBe("https://shop.test/cancel");
  });

  it("never reaches the gateway with an invalid cart", async () => {
    const { payments, createCheckout } = setup();

    await expect(
      createCheckout({ items: [], email: "buyer@example.com" })
    ).rejects.toThrow();
    expect(payments.createCheckoutSession).not.toHaveBeenCalled();
  });
});
