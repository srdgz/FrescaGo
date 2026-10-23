import { assertValidEmail, buildOrderLines } from "../domain/order.js";
import type { CatalogRepository, PaymentGateway } from "./ports.js";

interface Dependencies {
  catalog: CatalogRepository;
  payments: PaymentGateway;
  getFrontendUrl: () => string;
}

export const makeCreateCheckout =
  ({ catalog, payments, getFrontendUrl }: Dependencies) =>
  async (input: { items: unknown; email: unknown }): Promise<string> => {
    const email = assertValidEmail(input.email);
    const lines = buildOrderLines(input.items, (id) => catalog.findProduct(id));
    const frontendUrl = getFrontendUrl();

    return payments.createCheckoutSession({
      lines,
      email,
      successUrl: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${frontendUrl}/cancel`,
    });
  };

export type CreateCheckout = ReturnType<typeof makeCreateCheckout>;
