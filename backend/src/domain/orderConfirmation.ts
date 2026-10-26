import type { Currency } from "./currency.js";
import type { Locale } from "./locale.js";
import type { ShippingInfo } from "./shipping.js";

export const SESSION_ID_PATTERN = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/;

export class InvalidSessionError extends Error {
  constructor() {
    super("Sesión de pago no válida.");
  }
}

export class SessionNotFoundError extends Error {
  constructor() {
    super("No se encontró la sesión de pago.");
  }
}

export class PaymentNotCompletedError extends Error {
  constructor() {
    super("El pago todavía no se ha completado.");
  }
}

export interface ConfirmedItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  categoryLabel: string;
  base: string;
}

export interface OrderConfirmation {
  paymentId: string;
  email: string;
  currency: Currency;
  exchangeRate: number;
  locale: Locale;
  createdAt: string;
  items: ConfirmedItem[];
  shippingCost: number;
  amountPaid: number;
  shipping: ShippingInfo | null;
}
