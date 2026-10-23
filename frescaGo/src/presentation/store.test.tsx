import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAppStore } from "./store";
import { apple, buyer, pear } from "../test/fixtures";

const loadUser = vi.fn();
const getExchangeRate = vi.fn();

describe("app store", () => {
  let store: ReturnType<typeof createAppStore>;

  beforeEach(() => {
    loadUser.mockReset();
    getExchangeRate.mockReset();
    store = createAppStore({ loadUser, getExchangeRate });
  });

  it("adds products and increments repeated ones", async () => {
    await store.getState().addToCart(apple);
    await store.getState().addToCart(apple);
    await store.getState().addToCart(pear);

    const items = store.getState().cartProduct;
    expect(items).toHaveLength(2);
    expect(items.find((item) => item.id === apple.id)?.quantity).toBe(2);
  });

  it("decreases, removes and resets", async () => {
    await store.getState().addToCart(apple);
    await store.getState().addToCart(apple);
    store.getState().decreaseQuantity(apple.id);
    expect(store.getState().cartProduct[0].quantity).toBe(1);

    store.getState().removeFromCart(apple.id);
    expect(store.getState().cartProduct).toEqual([]);

    await store.getState().addToCart(pear);
    store.getState().resetCart();
    expect(store.getState().cartProduct).toEqual([]);
  });

  it("loads the user by uid", async () => {
    loadUser.mockResolvedValue(buyer);

    await store.getState().getUserInfo(buyer.id);

    expect(loadUser).toHaveBeenCalledWith(buyer.id);
    expect(store.getState().currentUser).toEqual(buyer);
    expect(store.getState().isLoading).toBe(false);
  });

  it("clears the user when there is no uid", async () => {
    store.setState({ currentUser: buyer });

    await store.getState().getUserInfo(undefined);

    expect(store.getState().currentUser).toBeNull();
    expect(store.getState().isLoading).toBe(false);
  });

  it("stops loading when the profile document does not exist", async () => {
    loadUser.mockResolvedValue(null);

    await store.getState().getUserInfo("uid-without-profile");

    expect(store.getState().currentUser).toBeNull();
    expect(store.getState().isLoading).toBe(false);
  });

  it("stops loading when the lookup fails", async () => {
    loadUser.mockRejectedValue(new Error("offline"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    await store.getState().getUserInfo(buyer.id);

    expect(store.getState().currentUser).toBeNull();
    expect(store.getState().isLoading).toBe(false);
  });
});
