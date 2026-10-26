import Stripe from "stripe";
import type { CheckoutRecord, PaymentGateway } from "../../application/ports.js";
import { parseCurrency } from "../../domain/currency.js";
import { parseLocale } from "../../domain/locale.js";
import { parseShippingInfo } from "../../domain/shipping.js";

export const createStripePaymentGateway = (
  getSecretKey: () => string | undefined
): PaymentGateway => ({
  async createCheckoutSession({
    lines,
    email,
    currency,
    locale,
    shipping,
    shippingCents,
    usdPerEur,
    successUrl,
    cancelUrl,
  }) {
    const stripe = new Stripe(getSecretKey() as string);

    const session = await stripe.checkout.sessions.create({
      allowed_payment_method_types: ["card"],
      locale,
      line_items: [
        ...lines.map(({ product, quantity, unitAmountCents }) => ({
          quantity,
          price_data: {
            currency: currency.toLowerCase(),
            unit_amount: unitAmountCents,
            product_data: {
              name: product.title,
              description: product.categoryLabel,
              images: [product.image],
            },
          },
        })),
        ...(shippingCents > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: currency.toLowerCase(),
                  unit_amount: shippingCents,
                  product_data: {
                    name: locale === "en" ? "Shipping" : "Envío",
                  },
                },
              },
            ]
          : []),
      ],
      mode: "payment",
      payment_intent_data: {
        shipping: {
          name: shipping.recipient,
          phone: shipping.phone,
          address: {
            line1: shipping.street,
            postal_code: shipping.postalCode,
            city: shipping.city,
            country: shipping.country,
          },
        },
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        email,
        currency,
        locale,
        usdPerEur: String(usdPerEur),
        items: JSON.stringify(lines.map((line) => [line.product.id, line.quantity])),
        ship_recipient: shipping.recipient,
        ship_phone: shipping.phone ?? "",
        ship_street: shipping.street,
        ship_postalCode: shipping.postalCode,
        ship_city: shipping.city,
        ship_country: shipping.country,
      },
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout url");
    }

    return { id: session.id, url: session.url };
  },

  async retrieveCheckout(sessionId): Promise<CheckoutRecord | null> {
    const stripe = new Stripe(getSecretKey() as string);

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      if ((error as { code?: string }).code === "resource_missing") {
        return null;
      }
      throw error;
    }

    const metadata = session.metadata ?? {};
    const rate = Number(metadata.usdPerEur);

    return {
      id: session.id,
      paid: session.payment_status === "paid",
      email: metadata.email ?? "",
      currency: parseCurrency(metadata.currency),
      locale: parseLocale(metadata.locale),
      usdPerEur: rate > 0 ? rate : 1,
      items: parseItems(metadata.items),
      amountTotalCents: session.amount_total ?? 0,
      shipping: parseShipping(metadata),
      createdAtSeconds: session.created,
    };
  },
});

const parseItems = (raw: string | undefined): { id: number; quantity: number }[] => {
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((entry) => ({
      id: Number(entry?.[0]),
      quantity: Number(entry?.[1]),
    }));
  } catch {
    return [];
  }
};

const parseShipping = (metadata: Stripe.Metadata) => {
  try {
    return parseShippingInfo({
      recipient: metadata.ship_recipient,
      phone: metadata.ship_phone,
      street: metadata.ship_street,
      postalCode: metadata.ship_postalCode,
      city: metadata.ship_city,
      country: metadata.ship_country,
    });
  } catch {
    return null;
  }
};
