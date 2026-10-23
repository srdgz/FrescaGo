import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const redirectToCheckout = vi.fn().mockResolvedValue({});

vi.mock("@stripe/stripe-js", () => ({
  loadStripe: vi.fn(() => Promise.resolve({ redirectToCheckout })),
}));
vi.mock("../../../lib/firebase", () => ({ db: {} }));
vi.mock("firebase/firestore", () => ({ doc: vi.fn(), getDoc: vi.fn() }));
vi.mock("../../../../config", () => ({
  config: { baseUrl: "https://api.test" },
}));

const { store } = await import("../../../lib/store");
const { default: CheckoutBtn } = await import("../CheckoutBtn");

const products = [
  {
    id: 2001,
    title: "Manzana",
    price: 2,
    quantity: 3,
    image: "x.png",
    category: "Fruta",
  },
];

describe("CheckoutBtn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    store.setState({ currentUser: null });
  });

  it("asks the user to sign in and does not enable payment", () => {
    render(<CheckoutBtn products={products} />);

    expect(
      screen.getByText(/necesitas iniciar sesión/i)
    ).toBeInTheDocument();
  });

  it("creates a session and redirects to Stripe Checkout", async () => {
    store.setState({ currentUser: { email: "buyer@example.com" } });
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ id: "cs_test_1" }),
    });

    render(<CheckoutBtn products={products} />);
    await userEvent.click(screen.getByRole("button", { name: /pagar/i }));

    const [url, options] = globalThis.fetch.mock.calls[0];
    expect(url).toBe("https://api.test/checkout");
    expect(JSON.parse(options.body)).toEqual({
      items: products,
      email: "buyer@example.com",
    });
    expect(redirectToCheckout).toHaveBeenCalledWith({ sessionId: "cs_test_1" });
  });
});
