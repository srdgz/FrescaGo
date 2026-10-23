import type { Category, FeaturedProduct, Product } from "../domain/catalog.js";
import type { OrderLine } from "../domain/order.js";

export interface CatalogRepository {
  listProducts(): Product[];
  findProduct(id: number): Product | undefined;
  listCategories(): Category[];
  findCategories(id: number): Category[];
  listFeatured(): FeaturedProduct[];
}

export interface CheckoutSessionRequest {
  lines: OrderLine[];
  email: string;
  successUrl: string;
  cancelUrl: string;
}

export interface PaymentGateway {
  createCheckoutSession(request: CheckoutSessionRequest): Promise<string>;
}
