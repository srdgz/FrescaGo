import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import AddToCartBtn from "../AddToCartBtn";
import { renderWithApp } from "../../../../test/renderWithApp";
import { apple } from "../../../../test/fixtures";

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

describe("AddToCartBtn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds the product to the cart and notifies", async () => {
    const { store } = renderWithApp(
      <AddToCartBtn product={apple} title="Añadir" />
    );

    await userEvent.click(screen.getByRole("button", { name: /añadir/i }));

    expect(store.getState().cartProduct).toEqual([{ ...apple, quantity: 1 }]);
    expect(toast.success).toHaveBeenCalled();
  });

  it("shows quantity controls once the product is in the cart", async () => {
    const { store } = renderWithApp(
      <AddToCartBtn product={apple} title="Añadir" />
    );
    store.setState({ cartProduct: [{ ...apple, quantity: 2 }] });

    expect(await screen.findByText("2")).toBeInTheDocument();
  });

  it("refuses to go below one unit", async () => {
    const { store } = renderWithApp(
      <AddToCartBtn product={apple} title="Añadir" />
    );
    store.setState({ cartProduct: [{ ...apple, quantity: 1 }] });

    await screen.findByText("1");
    const [decrease] = screen.getAllByRole("button");
    await userEvent.click(decrease);

    expect(store.getState().cartProduct[0].quantity).toBe(1);
    expect(toast.error).toHaveBeenCalled();
  });
});
