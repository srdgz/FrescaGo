import { parseCurrency } from "../domain/currency.js";
import { parseLocale } from "../domain/locale.js";
import { assertValidEmail, buildOrderLines } from "../domain/order.js";
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
}

export const makeCreateCheckout =
  ({ catalog, payments, rates, getFrontendUrl }: Dependencies) =>
  async (input: CheckoutInput): Promise<string> => {
    const email = assertValidEmail(input.email);
    const currency = parseCurrency(input.currency);
    const locale = parseLocale(input.locale);
    const { usdPerEur } = await rates.getRate();
    const lines = buildOrderLines(
      input.items,
      (id) => catalog.findProduct(id, locale),
      { currency, usdPerEur }
    );
    const frontendUrl = getFrontendUrl();

    return payments.createCheckoutSession({
      lines,
      email,
      currency,
      locale,
      successUrl: `${frontendUrl}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${frontendUrl}/${locale}/cancel`,
    });
  };

export type CreateCheckout = ReturnType<typeof makeCreateCheckout>;
