import type { Product } from "./catalog";

export type CartItem = Product;

export const SHIPPING_AMOUNT = 4.99;

export const FREE_SHIPPING_ABOVE = 30;

export const addItem = (items: CartItem[], product: Product): CartItem[] => {
  const existing = items.find((item) => item.id === product.id);
  if (existing) {
    return items.map((item) =>
      item.id === product.id
        ? { ...item, quantity: (item.quantity || 0) + 1 }
        : item
    );
  }
  return [...items, { ...product, quantity: 1 }];
};

export const decreaseItem = (items: CartItem[], id: number): CartItem[] =>
  items.map((item) =>
    item.id === id ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
  );

export const removeItem = (items: CartItem[], id: number): CartItem[] =>
  items.filter((item) => item.id !== id);

export const itemTotal = (item: CartItem): number => item.price * item.quantity;

export const cartSubtotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + itemTotal(item), 0);

const subtotalCents = (items: CartItem[]): number =>
  items.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
    0
  );

export const shippingCost = (items: CartItem[]): number =>
  items.length === 0 || subtotalCents(items) > FREE_SHIPPING_ABOVE * 100
    ? 0
    : SHIPPING_AMOUNT;

export const cartTotal = (items: CartItem[]): number =>
  cartSubtotal(items) + shippingCost(items);
