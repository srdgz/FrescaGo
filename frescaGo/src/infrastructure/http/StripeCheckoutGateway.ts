import { loadStripe } from "@stripe/stripe-js";
import type { CheckoutGateway } from "../../application/ports";
import {
  OrderNotFoundError,
  PaymentNotCompletedError,
} from "../../domain/order";
import type { OrderConfirmation } from "../../domain/order";

export const createStripeCheckoutGateway = (
  baseUrl: string,
  publishableKey: string
): CheckoutGateway => ({
  async start(items, email, { currency, locale, shipping }) {
    const stripe = await loadStripe(publishableKey);
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
    const result = await stripe?.redirectToCheckout({ sessionId: session.id });
    if (result?.error) {
      throw new Error(result.error.message);
    }
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
