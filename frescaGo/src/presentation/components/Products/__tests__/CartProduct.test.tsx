import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartProduct from "../CartProduct";
import { renderWithApp } from "../../../../test/renderWithApp";
import { apple } from "../../../../test/fixtures";

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

const item = { ...apple, quantity: 2, categoryLabel: "Fruta" };

describe("CartProduct", () => {
  it("names the remove button after the product", () => {
    renderWithApp(<CartProduct product={item} />);

    expect(
      screen.getByRole("button", { name: "Quitar Manzana del carrito" })
    ).toBeInTheDocument();
  });

  it("removes the product from the cart", async () => {
    const { store } = renderWithApp(<CartProduct product={item} />, {}, {
      state: { cartProduct: [item] },
    });

    await userEvent.click(
      screen.getByRole("button", { name: "Quitar Manzana del carrito" })
    );

    expect(store.getState().cartProduct).toEqual([]);
  });

  it("keeps the duplicate image link out of the accessibility tree and tab order", () => {
    renderWithApp(<CartProduct product={item} />);

    expect(screen.queryAllByRole("link")).toEqual([]);
    for (const link of document.querySelectorAll("a")) {
      expect(link).toHaveAttribute("aria-hidden", "true");
      expect(link).toHaveAttribute("tabindex", "-1");
    }
  });

  it("titles the item with a second level heading under the cart title", () => {
    renderWithApp(<CartProduct product={item} />);

    expect(screen.getByRole("heading", { level: 2, name: "Manzana" })).toBeInTheDocument();
  });

  it("speaks English", () => {
    renderWithApp(<CartProduct product={item} />, {}, { locale: "en" });

    expect(
      screen.getByRole("button", { name: "Remove Manzana from the cart" })
    ).toBeInTheDocument();
  });
});
