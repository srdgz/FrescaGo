import { describe, expect, it } from "vitest";
import { orderTotal } from "../order";
import type { Order } from "../order";
import { apple, pear } from "../../test/fixtures";

describe("order", () => {
  it("adds up the order items", () => {
    const order: Order = {
      userEmail: "buyer@example.com",
      paymentId: "cs_1",
      paymentMethod: "stripe",
      orderItems: [
        { ...apple, quantity: 2 },
        { ...pear, quantity: 1 },
      ],
    };
    expect(orderTotal(order)).toBe(7.5);
  });
});
