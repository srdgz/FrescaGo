import { convertToCents } from "./currency.js";
import type { OrderLine, Pricing } from "./order.js";

export const SHIPPING_FEE_EUR = 4.99;

export const FREE_SHIPPING_ABOVE_EUR = 30;

export const orderSubtotalEurCents = (lines: OrderLine[]): number =>
  lines.reduce(
    (sum, line) => sum + Math.round(line.product.price * 100) * line.quantity,
    0
  );

export const shippingFeeCents = (
  lines: OrderLine[],
  pricing: Pricing
): number =>
  orderSubtotalEurCents(lines) > FREE_SHIPPING_ABOVE_EUR * 100
    ? 0
    : convertToCents(SHIPPING_FEE_EUR, pricing.currency, pricing.usdPerEur);
