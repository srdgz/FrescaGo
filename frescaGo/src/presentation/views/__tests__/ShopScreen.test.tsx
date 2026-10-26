import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShopScreen from "../ShopScreen";
import { renderWithApp } from "../../../test/renderWithApp";
import { apple, buyer } from "../../../test/fixtures";

const cartOf = (euros: number) => [{ ...apple, price: euros, quantity: 1 }];

const setup = (euros: number, locale: "es" | "en" = "es") =>
  renderWithApp(
    <ShopScreen />,
    {},
    { locale, state: { currentUser: buyer, cartProduct: cartOf(euros) } }
  );

const row = (label: string) => screen.getByText(label).closest("div") as HTMLElement;

describe("ShopScreen summary", () => {
  it("adds the shipping fee to orders up to 30 euros", () => {
    setup(20);

    expect(within(row("Envío")).getByText(/4,99/)).toBeInTheDocument();
    expect(within(row("Subtotal")).getByText(/20,00/)).toBeInTheDocument();
    expect(within(row("TOTAL")).getByText(/24,99/)).toBeInTheDocument();
  });

  it("still charges the fee at exactly 30 euros", () => {
    setup(30);

    expect(within(row("TOTAL")).getByText(/34,99/)).toBeInTheDocument();
  });

  it("shows free shipping above 30 euros", () => {
    setup(30.01);

    expect(within(row("Envío")).getByText("Gratis")).toBeInTheDocument();
    expect(within(row("TOTAL")).getByText(/30,01/)).toBeInTheDocument();
  });

  it("explains the fee and the free shipping limit in the tooltip", async () => {
    setup(20);

    await userEvent.hover(
      screen.getByRole("button", { name: "Más información sobre el envío" })
    );

    expect(screen.getByRole("tooltip")).toHaveTextContent(
      "Coste de envío de 4,99 € por pedido. Es gratis en pedidos superiores a 30,00 €."
    );
  });

  it("converts the fee and the limit when the shop is in dollars", async () => {
    renderWithApp(
      <ShopScreen />,
      {},
      {
        locale: "en",
        state: {
          currentUser: buyer,
          cartProduct: cartOf(20),
          currency: "USD",
          usdPerEur: 1.1,
        },
      }
    );

    expect(within(row("Shipping")).getByText("$5.49")).toBeInTheDocument();
    expect(within(row("TOTAL")).getByText("$27.49")).toBeInTheDocument();

    await userEvent.hover(
      screen.getByRole("button", { name: "More information about shipping" })
    );
    expect(screen.getByRole("tooltip")).toHaveTextContent(
      "Shipping costs $5.49 per order. It is free on orders over $33.00."
    );
  });

  it("invites the shopper to buy when the cart is empty", () => {
    renderWithApp(<ShopScreen />, {}, { state: { currentUser: buyer, cartProduct: [] } });

    expect(screen.getByText(/Tu carrito está vacío/)).toBeInTheDocument();
  });
});
