import { parseCurrency } from "../domain/currency.js";
import { parseLocale } from "../domain/locale.js";
import { assertValidEmail, buildOrderLines } from "../domain/order.js";
import { parseShippingInfo } from "../domain/shipping.js";
import { shippingFeeCents } from "../domain/shippingFee.js";
import type {
  CatalogRepository,
  ExchangeRateProvider,
  PaymentGateway,
} from "./ports.js";

interface Dependencies {
  catalog: CatalogRepository;
  payments: PaymentGateway;
  rates: ExchangeRateProvider;
  getFrontendUrl: () => string;
}

interface CheckoutInput {
  items: unknown;
  email: unknown;
  currency?: unknown;
  locale?: unknown;
  shipping?: unknown;
}

export const makeCreateCheckout =
  ({ catalog, payments, rates, getFrontendUrl }: Dependencies) =>
  async (input: CheckoutInput): Promise<{ id: string; url: string }> => {
    const email = assertValidEmail(input.email);
    const currency = parseCurrency(input.currency);
    const locale = parseLocale(input.locale);
    const shipping = parseShippingInfo(input.shipping);
    const { usdPerEur } = await rates.getRate();
    const lines = buildOrderLines(
      input.items,
      (id) => catalog.findProduct(id, locale),
      { currency, usdPerEur }
    );
    const shippingCents = shippingFeeCents(lines, { currency, usdPerEur });
    const frontendUrl = getFrontendUrl();

    return payments.createCheckoutSession({
      lines,
      email,
      currency,
      locale,
      shipping,
      shippingCents,
      usdPerEur,
      successUrl: `${frontendUrl}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${frontendUrl}/${locale}/cancel`,
    });
  };

export type CreateCheckout = ReturnType<typeof makeCreateCheckout>;
