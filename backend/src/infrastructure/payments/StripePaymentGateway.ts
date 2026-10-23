import Stripe from "stripe";
import type { PaymentGateway } from "../../application/ports.js";

export const createStripePaymentGateway = (
  getSecretKey: () => string | undefined
): PaymentGateway => ({
  async createCheckoutSession({ lines, email, successUrl, cancelUrl }) {
    const stripe = new Stripe(getSecretKey() as string);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lines.map(({ product, quantity, unitAmountCents }) => ({
        quantity,
        price_data: {
          currency: "eur",
          unit_amount: unitAmountCents,
          product_data: {
            name: product.title,
            description: product.category,
            images: [product.image],
          },
        },
      })),
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { email },
    });

    return session.id;
  },
});
