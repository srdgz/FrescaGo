import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CheckoutBtn from "../CheckoutBtn";
import { renderWithApp } from "../../../../test/renderWithApp";
import { apple, buyer, newcomer } from "../../../../test/fixtures";

const products = [{ ...apple, quantity: 3 }];

describe("CheckoutBtn", () => {
  it("asks the user to sign in when there is no session", () => {
    renderWithApp(<CheckoutBtn products={products} />);

    expect(screen.getByText(/necesitas iniciar sesión/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /pagar/i })).toBeDisabled();
  });

  it("blocks the payment until there is a shipping address", async () => {
    const startCheckout = vi.fn();
    renderWithApp(
      <CheckoutBtn products={products} />,
      { startCheckout },
      { state: { currentUser: newcomer } }
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Añade tu dirección de envío para poder pagar."
    );
    expect(screen.getByRole("button", { name: /pagar/i })).toBeDisabled();
    expect(
      screen.getByRole("link", { name: "Añadir dirección de envío" })
    ).toHaveAttribute("href", "/es/editar");

    await userEvent.click(screen.getByRole("button", { name: /pagar/i }));
    expect(startCheckout).not.toHaveBeenCalled();
  });

  it("blocks the payment when the saved address is incomplete", async () => {
    renderWithApp(
      <CheckoutBtn products={products} />,
      {},
      {
        state: {
          currentUser: {
            ...buyer,
            shippingAddress: { ...buyer.shippingAddress!, city: "" },
          },
        },
      }
    );

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /pagar/i })).toBeDisabled();
  });

  it("shows where the order will be shipped", async () => {
    renderWithApp(
      <CheckoutBtn products={products} />,
      {},
      { state: { currentUser: buyer } }
    );

    expect(await screen.findByText("Enviar a:")).toBeInTheDocument();
    expect(screen.getByText("Ana Pérez")).toBeInTheDocument();
    expect(
      screen.getByText("Calle Mayor 12, 3ºB, 28013 Madrid, España")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cambiar dirección" })).toHaveAttribute(
      "href",
      "/es/editar"
    );
  });

  it("starts the checkout with the cart, the email and the shipping details", async () => {
    const startCheckout = vi.fn().mockResolvedValue(undefined);
    renderWithApp(
      <CheckoutBtn products={products} />,
      { startCheckout },
      { state: { currentUser: buyer } }
    );

    await userEvent.click(await screen.findByRole("button", { name: /pagar/i }));

    expect(startCheckout).toHaveBeenCalledWith(products, buyer.email, {
      currency: "EUR",
      locale: "es",
      shipping: {
        recipient: "Ana Pérez",
        phone: "600123123",
        address: buyer.shippingAddress,
      },
    });
  });

  it("alerts the user when the checkout fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const alert = vi.spyOn(window, "alert").mockImplementation(() => {});
    const startCheckout = vi.fn().mockRejectedValue(new Error("Tarjeta rechazada"));
    renderWithApp(
      <CheckoutBtn products={products} />,
      { startCheckout },
      { state: { currentUser: buyer } }
    );

    await userEvent.click(await screen.findByRole("button", { name: /pagar/i }));

    expect(alert).toHaveBeenCalledWith(
      "No se pudo iniciar el pago. Inténtalo de nuevo en unos minutos."
    );
  });
});
