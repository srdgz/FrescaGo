import { beforeEach, describe, expect, it, vi } from "vitest";
import { waitFor } from "@testing-library/react";
import toast from "react-hot-toast";
import SuccessScreen from "../SuccessScreen";
import { renderWithApp } from "../../../test/renderWithApp";
import { apple, buyer } from "../../../test/fixtures";

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

const cart = [{ ...apple, quantity: 2 }];

describe("SuccessScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("saves the order and empties the cart", async () => {
    const saveOrder = vi.fn().mockResolvedValue(undefined);
    const { store } = renderWithApp(
      <SuccessScreen />,
      { saveOrder },
      "/success?session_id=cs_test_1"
    );
    store.setState({ currentUser: buyer, cartProduct: cart });

    await waitFor(() =>
      expect(saveOrder).toHaveBeenCalledWith(buyer, "cs_test_1", cart)
    );
    await waitFor(() => expect(store.getState().cartProduct).toEqual([]));
    expect(toast.success).toHaveBeenCalled();
  });

  it("keeps the cart when saving fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const saveOrder = vi.fn().mockRejectedValue(new Error("offline"));
    const { store } = renderWithApp(
      <SuccessScreen />,
      { saveOrder },
      "/success?session_id=cs_test_1"
    );
    store.setState({ currentUser: buyer, cartProduct: cart });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(store.getState().cartProduct).toEqual(cart);
  });

  it("saves nothing without a signed in user", async () => {
    const saveOrder = vi.fn();
    const { store } = renderWithApp(
      <SuccessScreen />,
      { saveOrder },
      "/success?session_id=cs_test_1"
    );
    store.setState({ currentUser: null, cartProduct: cart });

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(saveOrder).not.toHaveBeenCalled();
    expect(store.getState().cartProduct).toEqual(cart);
  });
});
