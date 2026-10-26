import type { CartItem } from "./cart";
import { itemTotal } from "./cart";
import type { Currency } from "./currency";
import type { ShippingDetails } from "./user";

export interface Order {
  userEmail: string;
  paymentId: string;
  orderItems: CartItem[];
  paymentMethod: "stripe";
  userId?: string;
  currency?: Currency;
  exchangeRate?: number;
  shipping?: ShippingDetails;
  createdAt?: string;
}

export const orderTotal = (order: Order): number =>
  order.orderItems.reduce((sum, item) => sum + (itemTotal(item) || 0), 0);

export const orderReference = (paymentId: string): string =>
  `FG-${paymentId.slice(-8).toUpperCase()}`;

export const orderCurrency = (order: Order): Currency =>
  order.currency ?? "EUR";

export const orderRate = (order: Order): number => order.exchangeRate ?? 1;
