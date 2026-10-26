import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import SuccessScreen from "../SuccessScreen";
import { renderWithApp } from "../../../test/renderWithApp";
import { apple, buyer } from "../../../test/fixtures";
import {
  OrderNotFoundError,
  OrderOwnerMismatchError,
  PaymentNotCompletedError,
  orderFromConfirmation,
} from "../../../domain/order";
import type { OrderConfirmation } from "../../../domain/order";

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

const sessionId = "cs_test_b1snxm19HPOxDYkZJNn8Hw0320r8dC1AZtNsJ3IR4rglOdW8WcSaoZ";
const route = `/es/success?session_id=${sessionId}`;
const cart = [{ ...apple, quantity: 2 }];

const confirmation: OrderConfirmation = {
  paymentId: sessionId,
  email: buyer.email,
  currency: "EUR",
  exchangeRate: 1,
  locale: "es",
  createdAt: "2026-10-26T10:15:00.000Z",
  items: cart,
  shippingCost: 4.99,
  amountPaid: 8.99,
  shipping: null,
};

const Where = () => <p data-testid="where">{useLocation().pathname}</p>;

const setup = (
  confirmOrder: ReturnType<typeof vi.fn>,
  { user = buyer, at = route }: { user?: typeof buyer | null; at?: string } = {}
) =>
  renderWithApp(
    <>
      <SuccessScreen />
      <Where />
    </>,
    { confirmOrder } as never,
    { route: at, state: { currentUser: user, cartProduct: cart } }
  );

const resolved = (alreadySaved = false) =>
  vi.fn().mockResolvedValue({
    order: orderFromConfirmation(confirmation, buyer),
    alreadySaved,
  });

describe("SuccessScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("confirms the payment with the backend and empties the cart", async () => {
    const confirmOrder = resolved();
    const { store } = setup(confirmOrder);

    expect(await screen.findByText("Pago aceptado en FrescaGo")).toBeInTheDocument();
    expect(confirmOrder).toHaveBeenCalledTimes(1);
    expect(confirmOrder).toHaveBeenCalledWith(buyer, sessionId);
    expect(store.getState().cartProduct).toEqual([]);
    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  it("shows the short order number", async () => {
    setup(resolved());

    expect(await screen.findByText("FG-W8WCSAOZ")).toBeInTheDocument();
    expect(screen.queryByText(new RegExp(sessionId))).not.toBeInTheDocument();
  });

  it("links to the orders and back to the shop once confirmed", async () => {
    setup(resolved());

    expect(await screen.findByRole("link", { name: "Mis pedidos" })).toHaveAttribute(
      "href",
      "/es/pedidos"
    );
    expect(screen.getByRole("link", { name: "Seguir comprando" })).toHaveAttribute(
      "href",
      "/es/productos"
    );
  });

  it("does not announce a new order when it was already saved", async () => {
    const { store } = setup(resolved(true));

    expect(await screen.findByText("Pago aceptado en FrescaGo")).toBeInTheDocument();
    expect(toast.success).not.toHaveBeenCalled();
    expect(store.getState().cartProduct).toEqual([]);
  });

  it("shows progress while Stripe is being asked", async () => {
    setup(vi.fn(() => new Promise(() => {})));

    expect(await screen.findByText("Estamos confirmando tu pago")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("keeps the cart and offers a retry when the payment is not completed", async () => {
    const confirmOrder = vi
      .fn()
      .mockRejectedValueOnce(new PaymentNotCompletedError())
      .mockResolvedValueOnce({
        order: orderFromConfirmation(confirmation, buyer),
        alreadySaved: false,
      });
    const { store } = setup(confirmOrder);

    expect(
      await screen.findByText("Todavía no hemos recibido tu pago")
    ).toBeInTheDocument();
    expect(store.getState().cartProduct).toEqual(cart);

    await userEvent.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(await screen.findByText("Pago aceptado en FrescaGo")).toBeInTheDocument();
    expect(confirmOrder).toHaveBeenCalledTimes(2);
    expect(store.getState().cartProduct).toEqual([]);
  });

  it("explains when the order cannot be found", async () => {
    const { store } = setup(vi.fn().mockRejectedValue(new OrderNotFoundError()));

    expect(await screen.findByText("No encontramos este pedido")).toBeInTheDocument();
    expect(store.getState().cartProduct).toEqual(cart);
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("explains when the order belongs to another account", async () => {
    const { store } = setup(
      vi.fn().mockRejectedValue(new OrderOwnerMismatchError())
    );

    expect(await screen.findByText("Este pedido es de otra cuenta")).toBeInTheDocument();
    expect(store.getState().cartProduct).toEqual(cart);
  });

  it("keeps the cart and offers a retry on unexpected errors", async () => {
    const { store } = setup(vi.fn().mockRejectedValue(new Error("offline")));

    expect(await screen.findByText("No pudimos confirmar tu pedido")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
    expect(store.getState().cartProduct).toEqual(cart);
  });

  it("asks to sign in and confirms nothing without a session", async () => {
    const confirmOrder = vi.fn();
    setup(confirmOrder, { user: null });

    expect(await screen.findByText("Inicia sesión para ver tu pedido")).toBeInTheDocument();
    expect(confirmOrder).not.toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "Mi cuenta" })).toHaveAttribute(
      "href",
      "/es/usuario"
    );
  });

  it("goes home when there is no session id in the address", async () => {
    const confirmOrder = vi.fn();
    setup(confirmOrder, { at: "/es/success" });

    await waitFor(() => expect(screen.getByTestId("where")).toHaveTextContent("/es"));
    expect(screen.getByTestId("where").textContent).toBe("/es");
    expect(confirmOrder).not.toHaveBeenCalled();
  });

  it("speaks English on the English site", async () => {
    renderWithApp(
      <SuccessScreen />,
      { confirmOrder: resolved() } as never,
      {
        route: `/en/success?session_id=${sessionId}`,
        locale: "en",
        state: { currentUser: buyer, cartProduct: cart },
      }
    );

    expect(await screen.findByText("Payment accepted at FrescaGo")).toBeInTheDocument();
    expect(screen.getByText("Your order number is")).toBeInTheDocument();
  });
});
