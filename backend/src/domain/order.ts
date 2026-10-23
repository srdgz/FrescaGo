import { convertToCents } from "./currency.js";
import type { Currency } from "./currency.js";
import type { LocalizedProduct } from "./catalog.js";

export const MAX_QUANTITY = 99;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface CartItemRequest {
  id: number;
  quantity: number;
}

export interface Pricing {
  currency: Currency;
  usdPerEur: number;
}

export interface OrderLine {
  product: LocalizedProduct;
  quantity: number;
  unitAmountCents: number;
}

export class InvalidEmailError extends Error {
  constructor() {
    super("Faltan parámetros requeridos.");
  }
}

export class InvalidCartError extends Error {
  constructor() {
    super("Carrito no válido.");
  }
}

export const assertValidEmail = (email: unknown): string => {
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email)) {
    throw new InvalidEmailError();
  }
  return email;
};

export const toCents = (price: number): number => Math.round(price * 100);

export const buildOrderLines = (
  items: unknown,
  findProduct: (id: number) => LocalizedProduct | undefined,
  pricing: Pricing = { currency: "EUR", usdPerEur: 1 }
): OrderLine[] => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new InvalidCartError();
  }

  return items.map((item: Partial<CartItemRequest> | null) => {
    const product = findProduct(Number(item?.id));
    const quantity = Number(item?.quantity);

    if (
      !product ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_QUANTITY
    ) {
      throw new InvalidCartError();
    }

    return {
      product,
      quantity,
      unitAmountCents: convertToCents(
        product.price,
        pricing.currency,
        pricing.usdPerEur
      ),
    };
  });
};
