import type { Currency, ExchangeRate } from "../domain/currency.js";
import type { Category, FeaturedProduct, LocalizedProduct } from "../domain/catalog.js";
import type { Locale } from "../domain/locale.js";
import type { OrderLine } from "../domain/order.js";
import type { ShippingInfo } from "../domain/shipping.js";

export interface CatalogRepository {
  listProducts(locale: Locale): LocalizedProduct[];
  findProduct(id: number, locale?: Locale): LocalizedProduct | undefined;
  listCategories(locale: Locale): Category[];
  findCategories(id: number, locale: Locale): Category[];
  listFeatured(locale: Locale): FeaturedProduct[];
}

export interface CheckoutSessionRequest {
  lines: OrderLine[];
  email: string;
  currency: Currency;
  locale: Locale;
  shipping: ShippingInfo;
  successUrl: string;
  cancelUrl: string;
}

export interface PaymentGateway {
  createCheckoutSession(request: CheckoutSessionRequest): Promise<string>;
}

export interface ExchangeRateProvider {
  getRate(): Promise<ExchangeRate>;
}
