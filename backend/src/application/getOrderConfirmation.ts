import { buildOrderLines } from "../domain/order.js";
import {
  InvalidSessionError,
  PaymentNotCompletedError,
  SESSION_ID_PATTERN,
  SessionNotFoundError,
} from "../domain/orderConfirmation.js";
import type { OrderConfirmation } from "../domain/orderConfirmation.js";
import { shippingFeeCents } from "../domain/shippingFee.js";
import type { CatalogRepository, PaymentGateway } from "./ports.js";

interface Dependencies {
  catalog: CatalogRepository;
  payments: PaymentGateway;
}

export const makeGetOrderConfirmation =
  ({ catalog, payments }: Dependencies) =>
  async (sessionId: unknown): Promise<OrderConfirmation> => {
    if (typeof sessionId !== "string" || !SESSION_ID_PATTERN.test(sessionId)) {
      throw new InvalidSessionError();
    }

    const record = await payments.retrieveCheckout(sessionId);
    if (!record) {
      throw new SessionNotFoundError();
    }
    if (record.items.length === 0) {
      throw new SessionNotFoundError();
    }
    if (!record.paid) {
      throw new PaymentNotCompletedError();
    }

    const lines = buildOrderLines(
      record.items,
      (id) => catalog.findProduct(id, record.locale),
      { currency: "EUR", usdPerEur: 1 }
    );

    return {
      paymentId: record.id,
      email: record.email,
      currency: record.currency,
      exchangeRate: record.usdPerEur,
      locale: record.locale,
      createdAt: new Date(record.createdAtSeconds * 1000).toISOString(),
      items: lines.map(({ product, quantity }) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity,
        category: product.category,
        categoryLabel: product.categoryLabel,
        base: product.base,
      })),
      shippingCost:
        shippingFeeCents(lines, { currency: "EUR", usdPerEur: 1 }) / 100,
      amountPaid: record.amountTotalCents / 100,
      shipping: record.shipping,
    };
  };

export type GetOrderConfirmation = ReturnType<typeof makeGetOrderConfirmation>;
