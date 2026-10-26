import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStripeCheckoutGateway } from "../StripeCheckoutGateway";
import {
  OrderNotFoundError,
  PaymentNotCompletedError,
} from "../../../domain/order";
import { apple } from "../../../test/fixtures";

const redirect = vi.fn();
const gateway = createStripeCheckoutGateway("https://api.test", redirect);
const options = {
  currency: "USD" as const,
  locale: "en" as const,
  shipping: {
    recipient: "Ana Pérez",
    phone: "600123123",
    address: {
      street: "Calle Mayor 12",
      postalCode: "28013",
      city: "Madrid",
      country: "ES" as const,
    },
  },
};

const respond = (ok: boolean, status: number, body: unknown) =>
  vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  });

const PAYMENT_PAGE = "https://checkout.stripe.com/c/pay/cs_test_1";

describe("StripeCheckoutGateway", () => {
  beforeEach(() => {
    redirect.mockReset();
  });

  it("sends only ids, quantities, email, currency, language and shipping", async () => {
    globalThis.fetch = respond(true, 200, { id: "cs_test_1", url: PAYMENT_PAGE });

    await gateway.start([{ ...apple, quantity: 3 }], "buyer@example.com", options);

    const [url, init] = vi.mocked(globalThis.fetch).mock.calls[0];
    expect(url).toBe("https://api.test/checkout");
    expect(JSON.parse(init?.body as string)).toEqual({
      items: [{ id: apple.id, quantity: 3 }],
      email: "buyer@example.com",
      currency: "USD",
      locale: "en",
      shipping: {
        recipient: "Ana Pérez",
        phone: "600123123",
        street: "Calle Mayor 12",
        postalCode: "28013",
        city: "Madrid",
        country: "ES",
      },
    });
  });

  it("sends the shopper to the Stripe payment page", async () => {
    globalThis.fetch = respond(true, 200, { id: "cs_test_1", url: PAYMENT_PAGE });

    await gateway.start([apple], "buyer@example.com", options);

    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith(PAYMENT_PAGE);
  });

  it("fails with the server message when the backend rejects the cart", async () => {
    globalThis.fetch = respond(false, 400, { error: "Carrito no válido." });

    await expect(
      gateway.start([apple], "buyer@example.com", options)
    ).rejects.toThrow("Carrito no válido.");
    expect(redirect).not.toHaveBeenCalled();
  });

  it("fails when the backend answers 500 without a payment page", async () => {
    globalThis.fetch = respond(false, 500, {
      error: "No se pudo crear la sesión de pago.",
    });

    await expect(
      gateway.start([apple], "buyer@example.com", options)
    ).rejects.toThrow("No se pudo crear la sesión de pago.");
    expect(redirect).not.toHaveBeenCalled();
  });

  it("fails when the response is not json", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => {
        throw new Error("bad json");
      },
    });

    await expect(
      gateway.start([apple], "buyer@example.com", options)
    ).rejects.toThrow("Checkout request failed (502)");
  });

  it.each([
    ["no url", { id: "cs_test_1" }],
    ["an empty url", { id: "cs_test_1", url: "" }],
    ["an insecure url", { id: "cs_test_1", url: "http://evil.example/pay" }],
    ["a javascript url", { id: "cs_test_1", url: "javascript:alert(1)" }],
  ])("never redirects with %s", async (_label, body) => {
    globalThis.fetch = respond(true, 200, body);

    await expect(
      gateway.start([apple], "buyer@example.com", options)
    ).rejects.toThrow();
    expect(redirect).not.toHaveBeenCalled();
  });

  describe("confirm", () => {
    const confirmation = {
      paymentId: "cs_test_a1B2c3D4e5F6g7H8",
      email: "buyer@example.com",
      items: [],
    };

    it("asks the backend about the session and returns the confirmed order", async () => {
      globalThis.fetch = respond(true, 200, confirmation);

      const result = await gateway.confirm("cs_test_a1B2c3D4e5F6g7H8");

      expect(result).toEqual(confirmation);
      expect(vi.mocked(globalThis.fetch).mock.calls[0][0]).toBe(
        "https://api.test/checkout/sessions/cs_test_a1B2c3D4e5F6g7H8"
      );
    });

    it("encodes the session id", async () => {
      globalThis.fetch = respond(true, 200, confirmation);

      await gateway.confirm("a/b?c");

      expect(vi.mocked(globalThis.fetch).mock.calls[0][0]).toBe(
        "https://api.test/checkout/sessions/a%2Fb%3Fc"
      );
    });

    it("tells apart a payment that is not completed", async () => {
      globalThis.fetch = respond(false, 402, { error: "unpaid" });

      await expect(gateway.confirm("cs_test_x")).rejects.toThrow(
        PaymentNotCompletedError
      );
    });

    it.each([404, 400])("treats a %s as an unknown order", async (status) => {
      globalThis.fetch = respond(false, status, { error: "nope" });

      await expect(gateway.confirm("cs_test_x")).rejects.toThrow(OrderNotFoundError);
    });

    it("fails with a generic error otherwise", async () => {
      globalThis.fetch = respond(false, 500, { error: "boom" });

      await expect(gateway.confirm("cs_test_x")).rejects.toThrow(
        "Order confirmation failed (500)"
      );
    });
  });
});
