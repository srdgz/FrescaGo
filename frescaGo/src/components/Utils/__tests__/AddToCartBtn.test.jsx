import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../../../lib/firebase", () => ({ db: {} }));
vi.mock("firebase/firestore", () => ({ doc: vi.fn(), getDoc: vi.fn() }));
vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

const { store } = await import("../../../lib/store");
const { default: AddToCartBtn } = await import("../AddToCartBtn");
const { default: toast } = await import("react-hot-toast");

const product = { id: 1, title: "Manzana", price: 2 };

describe("AddToCartBtn", () => {
  beforeEach(() => {
    store.setState({ cartProduct: [] });
    vi.clearAllMocks();
  });

  it("adds the product to the cart and notifies", async () => {
    render(<AddToCartBtn product={product} title="Añadir" />);

    await userEvent.click(screen.getByRole("button", { name: /añadir/i }));

    expect(store.getState().cartProduct).toEqual([{ ...product, quantity: 1 }]);
    expect(toast.success).toHaveBeenCalled();
  });

  it("shows quantity controls once the product is in the cart", async () => {
    store.setState({ cartProduct: [{ ...product, quantity: 2 }] });
    render(<AddToCartBtn product={product} title="Añadir" />);

    expect(await screen.findByText("2")).toBeInTheDocument();
  });
});
