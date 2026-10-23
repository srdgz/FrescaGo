import type { Product } from "./catalog.js";

export const MAX_QUANTITY = 99;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface CartItemRequest {
  id: number;
  quantity: number;
}

export interface OrderLine {
  product: Product;
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
  findProduct: (id: number) => Product | undefined
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

    return { product, quantity, unitAmountCents: toCents(product.price) };
  });
};
