import type { CheckoutGateway } from "../../application/ports";
import {
  OrderNotFoundError,
  PaymentNotCompletedError,
} from "../../domain/order";
import type { OrderConfirmation } from "../../domain/order";

export const createStripeCheckoutGateway = (
  baseUrl: string,
  redirect: (url: string) => void = (url) => window.location.assign(url)
): CheckoutGateway => ({
  async start(items, email, { currency, locale, shipping }) {
    const response = await fetch(`${baseUrl}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map(({ id, quantity }) => ({ id, quantity })),
        email,
        currency,
        locale,
        shipping: {
          recipient: shipping.recipient,
          phone: shipping.phone,
          ...shipping.address,
        },
      }),
    });
    const session = await response.json().catch(() => null);
    if (!response.ok || !session?.id) {
      throw new Error(
        session?.error ?? `Checkout request failed (${response.status})`
      );
    }
    if (typeof session.url !== "string" || !session.url.startsWith("https://")) {
      throw new Error("The checkout session has no payment page");
    }
    redirect(session.url);
  },

  async confirm(sessionId) {
    const response = await fetch(
      `${baseUrl}/checkout/sessions/${encodeURIComponent(sessionId)}`,
      { headers: { "Cache-Control": "no-cache" } }
    );
    if (response.status === 402) {
      throw new PaymentNotCompletedError();
    }
    if (response.status === 404 || response.status === 400) {
      throw new OrderNotFoundError();
    }
    if (!response.ok) {
      throw new Error(`Order confirmation failed (${response.status})`);
    }
    return (await response.json()) as OrderConfirmation;
  },
});
