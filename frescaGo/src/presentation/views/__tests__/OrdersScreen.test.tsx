import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrdersScreen from "../OrdersScreen";
import { renderWithApp } from "../../../test/renderWithApp";
import { apple, buyer } from "../../../test/fixtures";
import type { Order } from "../../../domain/order";

const paymentId = "cs_test_b1snxm19HPOxDYkZJNn8Hw0320r8dC1AZtNsJ3IR4rglOdW8WcSaoZ";

const order: Order = {
  userEmail: buyer.email,
  paymentId,
  paymentMethod: "stripe",
  orderItems: [{ ...apple, quantity: 2 }],
  currency: "USD",
  exchangeRate: 1.1,
  createdAt: "2026-10-26T10:15:00.000Z",
  shippingCost: 4.99,
  shipping: {
    recipient: "Ana Pérez",
    address: buyer.shippingAddress!,
  },
};

const setup = (orders: Order[], locale: "es" | "en" = "es") => {
  const view = renderWithApp(
    <OrdersScreen />,
    { listOrders: vi.fn().mockResolvedValue(orders) },
    { locale }
  );
  view.store.setState({ currentUser: buyer, isLoading: false });
  return view;
};

describe("OrdersScreen", () => {
  it("shows a short order number instead of the Stripe session id", async () => {
    setup([order]);

    expect(await screen.findByText("FG-W8WCSAOZ")).toBeInTheDocument();
    expect(screen.getByText("Número de pedido:")).toBeInTheDocument();
    expect(screen.queryByText(new RegExp(paymentId))).not.toBeInTheDocument();
    expect(screen.queryByText(/cs_test_/)).not.toBeInTheDocument();
  });

  it("shows the date and the shipping address when the order is opened", async () => {
    setup([order]);

    await userEvent.click(await screen.findByRole("button", { name: /FG-W8WCSAOZ/ }));

    expect(await screen.findByText(/26 de octubre de 2026/)).toBeInTheDocument();
    expect(
      screen.getByText(/Ana Pérez, Calle Mayor 12, 3ºB, 28013 Madrid, España/)
    ).toBeInTheDocument();
  });

  it("uses the language of the page for dates and countries", async () => {
    setup([order], "en");

    await userEvent.click(await screen.findByRole("button", { name: /FG-W8WCSAOZ/ }));

    expect(await screen.findByText(/October 26, 2026/)).toBeInTheDocument();
    expect(screen.getByText(/28013 Madrid, Spain/)).toBeInTheDocument();
  });

  it("shows the amounts and the shipping that was charged, in the currency of the order", async () => {
    setup([order]);

    await userEvent.click(await screen.findByRole("button", { name: /FG-W8WCSAOZ/ }));

    expect(await screen.findByText("Importe del envío:")).toBeInTheDocument();
    expect(screen.getAllByText(/5,49 US[$]/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/9,89 US[$]/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/€/)).not.toBeInTheDocument();
  });

  it("shows free shipping when none was charged", async () => {
    setup([{ ...order, shippingCost: 0 }]);

    await userEvent.click(await screen.findByRole("button", { name: /FG-W8WCSAOZ/ }));

    expect(await screen.findByText("Importe del envío:")).toBeInTheDocument();
    expect(screen.getByText("Gratis")).toBeInTheDocument();
    expect(screen.queryByText(/5,49 US[$]/)).not.toBeInTheDocument();
  });

  it("does not show a shipping cost for orders that were not charged any", async () => {
    setup([{ ...order, shippingCost: undefined }]);

    await userEvent.click(await screen.findByRole("button", { name: /FG-W8WCSAOZ/ }));

    expect(await screen.findByText(/Cantidad de artículos/)).toBeInTheDocument();
    expect(screen.queryByText("Importe del envío:")).not.toBeInTheDocument();
  });

  it("still opens orders saved before the address and the date existed", async () => {
    setup([{ ...order, shipping: undefined, createdAt: undefined }]);

    await userEvent.click(await screen.findByRole("button", { name: /FG-W8WCSAOZ/ }));

    expect(await screen.findByText(/Cantidad de artículos/)).toBeInTheDocument();
    expect(screen.queryByText(/Fecha del pedido/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Dirección de envío/)).not.toBeInTheDocument();
  });

  it("invites the shopper to buy when there are no orders", async () => {
    setup([]);

    expect(await screen.findByText("Aún no tienes pedidos")).toBeInTheDocument();
  });
});
