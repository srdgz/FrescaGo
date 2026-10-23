import type { CartItem } from "./cart";
import { itemTotal } from "./cart";

export interface Order {
  userEmail: string;
  paymentId: string;
  orderItems: CartItem[];
  paymentMethod: "stripe";
  userId?: string;
}

export const orderTotal = (order: Order): number =>
  order.orderItems.reduce((sum, item) => sum + (itemTotal(item) || 0), 0);
