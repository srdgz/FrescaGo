import { makeCatalogUseCases } from "../application/catalog.js";
import { makeCreateCheckout } from "../application/createCheckout.js";
import { makeGetExchangeRate } from "../application/getExchangeRate.js";
import { makeGetOrderConfirmation } from "../application/getOrderConfirmation.js";
import { createInMemoryCatalog } from "./catalog/InMemoryCatalogRepository.js";
import { createStripePaymentGateway } from "./payments/StripePaymentGateway.js";
import { createFrankfurterRateProvider } from "./rates/FrankfurterRateProvider.js";

export const createContainer = () => {
  const catalog = createInMemoryCatalog();
  const rates = createFrankfurterRateProvider();
  const payments = createStripePaymentGateway(
    () => process.env.STRIPE_SECRET_KEY
  );

  return {
    catalog: makeCatalogUseCases(catalog),
    getExchangeRate: makeGetExchangeRate(rates),
    getOrderConfirmation: makeGetOrderConfirmation({ catalog, payments }),
    createCheckout: makeCreateCheckout({
      catalog,
      payments,
      rates,
      getFrontendUrl: () =>
        process.env.FRONTEND_URL || "https://frescago.vercel.app",
    }),
  };
};

export type Container = ReturnType<typeof createContainer>;
