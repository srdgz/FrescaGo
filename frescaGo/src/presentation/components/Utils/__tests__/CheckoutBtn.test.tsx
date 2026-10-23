import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CheckoutBtn from "../CheckoutBtn";
import { renderWithApp } from "../../../../test/renderWithApp";
import { apple, buyer } from "../../../../test/fixtures";

const products = [{ ...apple, quantity: 3 }];

describe("CheckoutBtn", () => {
  it("asks the user to sign in when there is no session", () => {
    renderWithApp(<CheckoutBtn products={products} />);

    expect(screen.getByText(/necesitas iniciar sesión/i)).toBeInTheDocument();
  });

  it("starts the checkout with the cart and the user email", async () => {
    const startCheckout = vi.fn().mockResolvedValue(undefined);
    const { store } = renderWithApp(<CheckoutBtn products={products} />, {
      startCheckout,
    });
    store.setState({ currentUser: buyer });

    await userEvent.click(await screen.findByRole("button", { name: /pagar/i }));

    expect(startCheckout).toHaveBeenCalledWith(products, buyer.email, {
      currency: "EUR",
      locale: "es",
    });
  });

  it("alerts the user when the checkout fails", async () => {
    const alert = vi.spyOn(window, "alert").mockImplementation(() => {});
    const startCheckout = vi.fn().mockRejectedValue(new Error("Tarjeta rechazada"));
    const { store } = renderWithApp(<CheckoutBtn products={products} />, {
      startCheckout,
    });
    store.setState({ currentUser: buyer });

    await userEvent.click(await screen.findByRole("button", { name: /pagar/i }));

    expect(alert).toHaveBeenCalledWith("Tarjeta rechazada");
  });
});
