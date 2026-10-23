import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../firebase", () => ({ db: {} }));
vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
}));

const { store } = await import("../store");

const apple = { id: 1, title: "Manzana", price: 2 };
const pear = { id: 2, title: "Pera", price: 3 };

describe("cart store", () => {
  beforeEach(() => {
    store.setState({ cartProduct: [], currentUser: null });
  });

  it("adds a new product with quantity 1", async () => {
    await store.getState().addToCart(apple);
    expect(store.getState().cartProduct).toEqual([{ ...apple, quantity: 1 }]);
  });

  it("increments the quantity of an existing product", async () => {
    await store.getState().addToCart(apple);
    await store.getState().addToCart(apple);
    expect(store.getState().cartProduct).toHaveLength(1);
    expect(store.getState().cartProduct[0].quantity).toBe(2);
  });

  it("decreases the quantity but never below 1", async () => {
    await store.getState().addToCart(apple);
    await store.getState().addToCart(apple);
    store.getState().decreaseQuantity(apple.id);
    expect(store.getState().cartProduct[0].quantity).toBe(1);
    store.getState().decreaseQuantity(apple.id);
    expect(store.getState().cartProduct[0].quantity).toBe(1);
  });

  it("ignores decreasing a product that is not in the cart", () => {
    store.getState().decreaseQuantity(99);
    expect(store.getState().cartProduct).toEqual([]);
  });

  it("removes a single product", async () => {
    await store.getState().addToCart(apple);
    await store.getState().addToCart(pear);
    store.getState().removeFromCart(apple.id);
    expect(store.getState().cartProduct.map((p) => p.id)).toEqual([pear.id]);
  });

  it("resets the cart", async () => {
    await store.getState().addToCart(apple);
    store.getState().resetCart();
    expect(store.getState().cartProduct).toEqual([]);
  });

  it("clears the user when there is no uid", async () => {
    store.setState({ currentUser: { email: "a@b.co" } });
    await store.getState().getUserInfo(undefined);
    expect(store.getState().currentUser).toBeNull();
    expect(store.getState().isLoading).toBe(false);
  });
});
