const env = import.meta.env;

export const apiBaseUrl: string =
  env.VITE_USE_LOCAL_API === "true"
    ? env.VITE_BASE_URL_LOCAL
    : env.VITE_BASE_URL_PRODUCTION;

export const stripePublishableKey: string = env.VITE_STRIPE_PUBLIC;
