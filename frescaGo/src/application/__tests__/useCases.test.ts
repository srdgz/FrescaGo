import { describe, expect, it, vi } from "vitest";
import { makeUseCases } from "../useCases";
import {
  OrderOwnerMismatchError,
  PaymentNotCompletedError,
} from "../../domain/order";
import type { OrderConfirmation } from "../../domain/order";
import type { Dependencies } from "../useCases";
import { apple, buyer } from "../../test/fixtures";

const setup = () => {
  const deps = {
    catalog: {} as Dependencies["catalog"],
    rates: {
      getRate: vi
        .fn()
        .mockResolvedValue({ usdPerEur: 1.1, date: "2026-10-23", source: "ecb" }),
    },
    auth: {
      signIn: vi.fn(),
      register: vi.fn().mockResolvedValue("uid-9"),
      signOut: vi.fn(),
      setPhoto: vi.fn(),
      onChange: vi.fn(),
    },
    users: { get: vi.fn(), create: vi.fn(), update: vi.fn() },
    orders: { list: vi.fn(), add: vi.fn() },
    images: { upload: vi.fn().mockResolvedValue("https://img/avatar.png") },
    checkout: { start: vi.fn(), confirm: vi.fn() },
  };
  return { deps, useCases: makeUseCases(deps as unknown as Dependencies) };
};

const registration = {
  firstName: "Ana",
  lastName: "Pérez",
  email: "ana@example.com",
  password: "secret1",
};

describe("register", () => {
  it("creates the account, uploads the avatar and saves the profile", async () => {
    const { deps, useCases } = setup();
    const file = new File(["x"], "avatar.png");

    await useCases.register(registration, file);

    expect(deps.auth.register).toHaveBeenCalledWith(
      "ana@example.com",
      "secret1"
    );
    expect(deps.images.upload).toHaveBeenCalledWith(file);
    expect(deps.users.create).toHaveBeenCalledWith({
      id: "uid-9",
      firstName: "Ana",
      lastName: "Pérez",
      email: "ana@example.com",
      avatar: "https://img/avatar.png",
    });
  });

  it("stores a null avatar when none is provided", async () => {
    const { deps, useCases } = setup();

    await useCases.register(registration, null);

    expect(deps.images.upload).not.toHaveBeenCalled();
    expect(deps.users.create.mock.calls[0][0].avatar).toBeNull();
  });

  it("does not save a profile when account creation fails", async () => {
    const { deps, useCases } = setup();
    deps.auth.register.mockRejectedValue(new Error("email-already-in-use"));

    await expect(useCases.register(registration, null)).rejects.toThrow();
    expect(deps.users.create).not.toHaveBeenCalled();
  });
});

describe("updateProfile", () => {
  const form = {
    avatar: "old.png",
    firstName: "Ana",
    lastName: "López",
    phone: " 600 ",
    street: " Calle 1 ",
    postalCode: "28001",
    city: "Madrid",
    country: "ES" as const,
  };

  it("keeps the current avatar and saves a trimmed shipping address", async () => {
    const { deps, useCases } = setup();

    await useCases.updateProfile(buyer, form, null);

    expect(deps.images.upload).not.toHaveBeenCalled();
    expect(deps.auth.setPhoto).toHaveBeenCalledWith("old.png");
    expect(deps.users.update).toHaveBeenCalledWith(buyer.id, {
      firstName: "Ana",
      lastName: "López",
      phone: "600",
      shippingAddress: {
        street: "Calle 1",
        postalCode: "28001",
        city: "Madrid",
        country: "ES",
      },
      avatar: "old.png",
    });
  });

  it("uploads a new avatar when a file is chosen", async () => {
    const { deps, useCases } = setup();

    await useCases.updateProfile(buyer, form, new File(["x"], "new.png"));

    expect(deps.users.update.mock.calls[0][1].avatar).toBe(
      "https://img/avatar.png"
    );
  });
});

describe("confirmOrder", () => {
  const confirmation: OrderConfirmation = {
    paymentId: "cs_test_a1B2c3D4e5F6g7H8",
    email: buyer.email,
    currency: "USD",
    exchangeRate: 1.1,
    locale: "en",
    createdAt: "2026-10-26T10:15:00.000Z",
    items: [{ ...apple, quantity: 2 }],
    shippingCost: 4.99,
    amountPaid: 9.89,
    shipping: {
      recipient: "Ana Pérez",
      phone: "600123123",
      street: "Calle Mayor 12, 3ºB",
      postalCode: "28013",
      city: "Madrid",
      country: "ES",
    },
  };

  const confirmed = (overrides: Partial<OrderConfirmation> = {}) => {
    const view = setup();
    view.deps.checkout.confirm.mockResolvedValue({ ...confirmation, ...overrides });
    view.deps.orders.list.mockResolvedValue([]);
    return view;
  };

  it("saves the order exactly as Stripe confirmed it", async () => {
    const { deps, useCases } = confirmed();

    const result = await useCases.confirmOrder(buyer, confirmation.paymentId);

    expect(deps.checkout.confirm).toHaveBeenCalledWith(confirmation.paymentId);
    expect(deps.orders.add).toHaveBeenCalledWith(buyer.email, {
      userEmail: buyer.email,
      paymentId: confirmation.paymentId,
      orderItems: confirmation.items,
      paymentMethod: "stripe",
      userId: buyer.id,
      currency: "USD",
      exchangeRate: 1.1,
      createdAt: "2026-10-26T10:15:00.000Z",
      shippingCost: 4.99,
      amountPaid: 9.89,
      shipping: {
        recipient: "Ana Pérez",
        phone: "600123123",
        address: {
          street: "Calle Mayor 12, 3ºB",
          postalCode: "28013",
          city: "Madrid",
          country: "ES",
        },
      },
    });
    expect(result.alreadySaved).toBe(false);
    expect(result.order.paymentId).toBe(confirmation.paymentId);
  });

  it("ignores whatever is in the cart or the profile when building the order", async () => {
    const { deps, useCases } = confirmed();

    await useCases.confirmOrder(
      { ...buyer, shippingAddress: undefined, phone: undefined },
      confirmation.paymentId
    );

    const order = deps.orders.add.mock.calls[0][1];
    expect(order.shipping.address.street).toBe("Calle Mayor 12, 3ºB");
    expect(order.orderItems).toEqual(confirmation.items);
  });

  it("accepts the buyer email whatever its case", async () => {
    const { deps, useCases } = confirmed({ email: "BUYER@Example.com" });

    await useCases.confirmOrder(buyer, confirmation.paymentId);

    expect(deps.orders.add).toHaveBeenCalledTimes(1);
  });

  it("refuses an order that belongs to another account", async () => {
    const { deps, useCases } = confirmed({ email: "someone@else.com" });

    await expect(
      useCases.confirmOrder(buyer, confirmation.paymentId)
    ).rejects.toThrow(OrderOwnerMismatchError);
    expect(deps.orders.list).not.toHaveBeenCalled();
    expect(deps.orders.add).not.toHaveBeenCalled();
  });

  it("does not save the same payment twice", async () => {
    const { deps, useCases } = confirmed();
    deps.orders.list.mockResolvedValue([
      { paymentId: confirmation.paymentId, userEmail: buyer.email },
    ]);

    const result = await useCases.confirmOrder(buyer, confirmation.paymentId);

    expect(result.alreadySaved).toBe(true);
    expect(deps.orders.add).not.toHaveBeenCalled();
  });

  it("saves nothing when the payment cannot be confirmed", async () => {
    const { deps, useCases } = setup();
    deps.checkout.confirm.mockRejectedValue(new PaymentNotCompletedError());

    await expect(
      useCases.confirmOrder(buyer, confirmation.paymentId)
    ).rejects.toThrow(PaymentNotCompletedError);
    expect(deps.orders.add).not.toHaveBeenCalled();
  });

  it("never sends undefined fields to the database", async () => {
    const { deps, useCases } = confirmed({ shipping: null });

    await useCases.confirmOrder(buyer, confirmation.paymentId);

    const order = deps.orders.add.mock.calls[0][1];
    expect(Object.values(order)).not.toContain(undefined);
    expect("shipping" in order).toBe(false);
  });

  it("leaves out the phone when the buyer gave none", async () => {
    const { deps, useCases } = confirmed({
      shipping: { ...confirmation.shipping!, phone: undefined },
    });

    await useCases.confirmOrder(buyer, confirmation.paymentId);

    expect("phone" in deps.orders.add.mock.calls[0][1].shipping).toBe(false);
  });
});

describe("startCheckout", () => {
  it("delegates to the checkout gateway with currency, language and shipping", async () => {
    const { deps, useCases } = setup();
    const options = {
      currency: "USD" as const,
      locale: "en" as const,
      shipping: {
        recipient: "Ana Pérez",
        address: buyer.shippingAddress!,
      },
    };

    await useCases.startCheckout([apple], buyer.email, options);

    expect(deps.checkout.start).toHaveBeenCalledWith(
      [apple],
      buyer.email,
      options
    );
  });
});

describe("getExchangeRate", () => {
  it("returns the rate from the gateway", async () => {
    const { useCases } = setup();

    expect(await useCases.getExchangeRate()).toMatchObject({ usdPerEur: 1.1 });
  });
});
