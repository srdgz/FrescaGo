import { makeCatalogUseCases } from "../application/catalog.js";
import { makeCreateCheckout } from "../application/createCheckout.js";
import { createInMemoryCatalog } from "./catalog/InMemoryCatalogRepository.js";
import { createStripePaymentGateway } from "./payments/StripePaymentGateway.js";

export const createContainer = () => {
  const catalog = createInMemoryCatalog();
  const payments = createStripePaymentGateway(
    () => process.env.STRIPE_SECRET_KEY
  );

  return {
    catalog: makeCatalogUseCases(catalog),
    createCheckout: makeCreateCheckout({
      catalog,
      payments,
      getFrontendUrl: () =>
        process.env.FRONTEND_URL || "https://frescago.vercel.app",
    }),
  };
};

export type Container = ReturnType<typeof createContainer>;
