import { loadStripe } from "@stripe/stripe-js";
import type { CheckoutGateway } from "../../application/ports";

export const createStripeCheckoutGateway = (
  baseUrl: string,
  publishableKey: string
): CheckoutGateway => ({
  async start(items, email, { currency, locale }) {
    const stripe = await loadStripe(publishableKey);
    const response = await fetch(`${baseUrl}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map(({ id, quantity }) => ({ id, quantity })),
        email,
        currency,
        locale,
      }),
    });
    const session = await response.json();
    const result = await stripe?.redirectToCheckout({ sessionId: session.id });
    if (result?.error) {
      throw new Error(result.error.message);
    }
  },
});
