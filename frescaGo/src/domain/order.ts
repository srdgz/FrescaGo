import type { CartItem } from "./cart";
import { itemTotal } from "./cart";
import type { ShippingCountry } from "./countries";
import type { Currency } from "./currency";
import type { Locale } from "./locale";
import type { ShippingDetails, User } from "./user";

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
  shippingCost?: number;
  amountPaid?: number;
}

export interface OrderConfirmation {
  paymentId: string;
  email: string;
  currency: Currency;
  exchangeRate: number;
  locale: Locale;
  createdAt: string;
  items: CartItem[];
  shippingCost: number;
  amountPaid: number;
  shipping: {
    recipient: string;
    phone?: string;
    street: string;
    postalCode: string;
    city: string;
    country: ShippingCountry;
  } | null;
}

export class PaymentNotCompletedError extends Error {}

export class OrderNotFoundError extends Error {}

export class OrderOwnerMismatchError extends Error {}

export const orderTotal = (order: Order): number =>
  order.orderItems.reduce((sum, item) => sum + (itemTotal(item) || 0), 0) +
  (order.shippingCost ?? 0);

export const orderReference = (paymentId: string): string =>
  `FG-${paymentId.slice(-8).toUpperCase()}`;

export const orderCurrency = (order: Order): Currency =>
  order.currency ?? "EUR";

export const orderRate = (order: Order): number => order.exchangeRate ?? 1;

export const orderFromConfirmation = (
  confirmation: OrderConfirmation,
  user: Pick<User, "id" | "email">
): Order => {
  const { shipping } = confirmation;
  return {
    userEmail: user.email,
    paymentId: confirmation.paymentId,
    orderItems: confirmation.items,
    paymentMethod: "stripe",
    userId: user.id,
    currency: confirmation.currency,
    exchangeRate: confirmation.exchangeRate,
    createdAt: confirmation.createdAt,
    shippingCost: confirmation.shippingCost,
    amountPaid: confirmation.amountPaid,
    ...(shipping
      ? {
          shipping: {
            recipient: shipping.recipient,
            ...(shipping.phone ? { phone: shipping.phone } : {}),
            address: {
              street: shipping.street,
              postalCode: shipping.postalCode,
              city: shipping.city,
              country: shipping.country,
            },
          },
        }
      : {}),
  };
};
