import { describe, expect, it, vi } from "vitest";
import { makeUseCases } from "../useCases";
import type { Dependencies } from "../useCases";
import { apple, buyer } from "../../test/fixtures";

const setup = () => {
  const deps = {
    catalog: {} as Dependencies["catalog"],
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
    checkout: { start: vi.fn() },
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
    address: "Calle 1",
    phone: "600",
  };

  it("keeps the current avatar when no file is chosen", async () => {
    const { deps, useCases } = setup();

    await useCases.updateProfile(buyer, form, null);

    expect(deps.images.upload).not.toHaveBeenCalled();
    expect(deps.auth.setPhoto).toHaveBeenCalledWith("old.png");
    expect(deps.users.update).toHaveBeenCalledWith(buyer.id, {
      firstName: "Ana",
      lastName: "López",
      address: "Calle 1",
      phone: "600",
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

describe("saveOrder", () => {
  it("stores a Stripe order under the buyer email", async () => {
    const { deps, useCases } = setup();
    const items = [{ ...apple, quantity: 2 }];

    await useCases.saveOrder(buyer, "cs_123", items);

    expect(deps.orders.add).toHaveBeenCalledWith(buyer.email, {
      userEmail: buyer.email,
      paymentId: "cs_123",
      orderItems: items,
      paymentMethod: "stripe",
      userId: buyer.id,
    });
  });
});

describe("startCheckout", () => {
  it("delegates to the checkout gateway", async () => {
    const { deps, useCases } = setup();

    await useCases.startCheckout([apple], buyer.email);

    expect(deps.checkout.start).toHaveBeenCalledWith([apple], buyer.email);
  });
});
