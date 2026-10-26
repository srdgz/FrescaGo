import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { UseCases } from "../../application/useCases";
import { AppProvider } from "../AppContext";
import { createAppStore } from "../store";
import type { AppState } from "../store";
import { AppRoutes } from "../routes/Router";
import { apple, buyer, newcomer } from "../../test/fixtures";
import { accessibilityViolations } from "../../test/axe";

const categories = [
  { id: 1001, base: "Fruta", title: "Fruta", image: "f.png" },
  { id: 1002, base: "Verdura", title: "Verdura", image: "v.png" },
];

const manyProducts = Array.from({ length: 14 }, (_, index) => ({
  ...apple,
  id: 2000 + index,
  title: `Producto ${index + 1}`,
}));

const featured = [
  {
    id: 3001,
    title: "Manzanas variadas",
    base: "Frutas",
    category: "Frutas",
    delay: 0.3,
    price: "desde 2,35€/Kg",
    img: "https://example.com/a.webp",
  },
];

const order = {
  userEmail: buyer.email,
  paymentId: "cs_test_b1snxm19HPOxDYkZJNn8Hw0320r8dC1AZtNsJ3IR4rglOdW8WcSaoZ",
  paymentMethod: "stripe" as const,
  orderItems: [{ ...apple, quantity: 2 }],
  currency: "EUR" as const,
  exchangeRate: 1,
  createdAt: "2026-10-26T10:15:00.000Z",
  shippingCost: 4.99,
  shipping: { recipient: "Ana Pérez", address: buyer.shippingAddress! },
};

const setup = (route: string, state: Partial<AppState> = {}) => {
  const useCases = {
    loadUser: async () => null,
    observeAuth: () => () => {},
    getExchangeRate: async () => ({ usdPerEur: 1.1, date: "2026-10-26", source: "ecb" }),
    listCategories: async () => categories,
    listProducts: async () => manyProducts,
    listFeatured: async () => featured,
    getProduct: async () => ({ ...apple, categoryLabel: "Fruta" }),
    listOrders: async () => [order],
    confirmOrder: async () => ({ order, alreadySaved: true }),
  } as unknown as UseCases;
  const store = createAppStore(useCases);
  store.setState({ isLoading: false, ...state });

  return render(
    <AppProvider useCases={useCases} store={store}>
      <MemoryRouter initialEntries={[route]}>
        <AppRoutes />
      </MemoryRouter>
    </AppProvider>
  );
};

const cart = [{ ...apple, quantity: 2 }];

const screens: [string, string, Partial<AppState>, RegExp][] = [
  ["home in Spanish", "/es", {}, /Algunos de nuestros productos/],
  ["home in English", "/en", {}, /Some of our products/],
  ["catalog", "/es/productos", {}, /Producto 1$/],
  ["product", "/en/products/2001", {}, /Add to cart/],
  ["cart with items", "/es/tienda", { cartProduct: cart }, /Tu pedido/],
  ["empty cart", "/es/tienda", {}, /Tu carrito está vacío/],
  ["cart with a shopper", "/en/cart", { cartProduct: cart, currentUser: buyer }, /Ship to:/],
  ["sign up", "/es/usuario", {}, /Crear una cuenta/i],
  ["account", "/en/account", { currentUser: buyer }, /Welcome/],
  ["account without address", "/es/usuario", { currentUser: newcomer }, /Añade tu dirección/],
  ["contact", "/es/contacto", {}, /Contáctanos/],
  ["about", "/en/about", {}, /About Fresca/],
  ["orders", "/en/orders", { currentUser: buyer }, /FG-W8WCSAOZ/],
  ["edit profile", "/es/editar", { currentUser: buyer }, /Dirección de envío/],
  ["payment cancelled", "/es/cancel", {}, /Tu pago ha sido cancelado/],
  ["payment confirmed", "/es/success?session_id=cs_test_a1B2c3D4e5F6g7H8", { currentUser: buyer }, /Pago aceptado/],
  ["not found", "/en/nope", {}, /This page doesn't exist/],
];

describe("accessibility of every screen", () => {
  afterEach(() => {
    document.head.innerHTML = "";
  });

  it.each(screens)("%s has no WCAG violations", async (_name, route, state, ready) => {
    setup(route, state);
    await screen.findAllByText(ready, undefined, { timeout: 3000 });

    expect(await accessibilityViolations()).toEqual([]);
  });

  it("has exactly one main landmark and one level one heading on each screen", async () => {
    for (const [, route, state, ready] of screens) {
      localStorage.clear();
      const { unmount } = setup(route, state);
      await screen.findAllByText(ready, undefined, { timeout: 3000 });

      expect(screen.getAllByRole("main"), route).toHaveLength(1);
      expect(screen.getAllByRole("heading", { level: 1 }), route).toHaveLength(1);
      unmount();
    }
  });

  it("keeps the main landmark while a page is loading", async () => {
    setup("/es/productos");

    expect(screen.getByRole("main")).toBeInTheDocument();
    await screen.findAllByText(/Producto 1$/);
  });
});

describe("keyboard and navigation", () => {
  afterEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("offers a skip link to the main content as the first control", async () => {
    setup("/es");
    await screen.findByText(/Algunos de nuestros productos/);

    const skip = screen.getByRole("link", { name: "Saltar al contenido principal" });
    expect(skip).toHaveAttribute("href", "#main-content");
    expect(document.getElementById("main-content")).toBe(screen.getByRole("main"));
    expect(document.querySelector("a, button")).toBe(skip);
  });

  it("gives every page its own title", async () => {
    const titles: Record<string, string> = {};
    for (const [route, ready] of [
      ["/es/productos", /Producto 1$/],
      ["/es/contacto", /Contáctanos/],
      ["/en/about", /About Fresca/],
      ["/en/nope", /This page doesn't exist/],
    ] as const) {
      const { unmount } = setup(route);
      await screen.findAllByText(ready);
      await waitFor(() => expect(document.title).not.toBe(""));
      titles[route] = document.title;
      unmount();
    }

    expect(titles["/es/productos"]).toBe("Productos | FrescaGo");
    expect(titles["/es/contacto"]).toBe("Contacto | FrescaGo");
    expect(titles["/en/about"]).toBe("About us | FrescaGo");
    expect(titles["/en/nope"]).toBe("Page not found | FrescaGo");
    expect(new Set(Object.values(titles)).size).toBe(4);
  });

  it("names the product page after the product", async () => {
    setup("/en/products/2001");

    await waitFor(() => expect(document.title).toBe("Manzana | FrescaGo"));
  });

  it("describes the site in the language of the page", async () => {
    setup("/en");
    await screen.findByText(/Some of our products/);

    const description = document.head.querySelector('meta[name="description"]');
    expect(description?.getAttribute("content")).toMatch(/online shop for fresh fruit/);
    expect(document.head.querySelector('meta[property="og:locale"]')?.getAttribute("content")).toBe("en_US");
  });

  it("declares the language alternatives and the canonical url", async () => {
    setup("/es/productos");
    await screen.findAllByText(/Producto 1$/);

    const link = (selector: string) =>
      document.head.querySelector(selector)?.getAttribute("href");
    const origin = window.location.origin;
    expect(link('link[rel="alternate"][hreflang="es"]')).toBe(`${origin}/es/productos`);
    expect(link('link[rel="alternate"][hreflang="en"]')).toBe(`${origin}/en/products`);
    expect(link('link[rel="alternate"][hreflang="x-default"]')).toBe(`${origin}/es/productos`);
    expect(link('link[rel="canonical"]')).toBe(`${origin}/es/productos`);
  });

  it("sends signed out visitors of private pages to the account", async () => {
    setup("/es/pedidos", { currentUser: null });

    await screen.findByRole("heading", { level: 1, name: "Mi cuenta" });
  });

  it("sends signed out visitors of the profile to the account", async () => {
    setup("/es/editar", { currentUser: null });

    await screen.findByRole("heading", { level: 1, name: "Mi cuenta" });
  });

  it("does not leave private pages loading forever when there is no session", async () => {
    const observeAuth = vi.fn((listener: (uid: string | undefined) => void) => {
      listener(undefined);
      return () => {};
    });
    const useCases = {
      loadUser: async () => null,
      observeAuth,
      getExchangeRate: async () => ({ usdPerEur: 1.1, date: "2026-10-26", source: "ecb" }),
    } as unknown as UseCases;
    const store = createAppStore(useCases);

    render(
      <AppProvider useCases={useCases} store={store}>
        <MemoryRouter initialEntries={["/es/editar"]}>
          <AppRoutes />
        </MemoryRouter>
      </AppProvider>
    );

    await screen.findByRole("heading", { level: 1, name: "Mi cuenta" });
    expect(observeAuth).toHaveBeenCalled();
    expect(store.getState().isLoading).toBe(false);
  });
});
