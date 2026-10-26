import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import type { UseCases } from "../../../application/useCases";
import { AppProvider } from "../../AppContext";
import { createAppStore } from "../../store";
import { AppRoutes } from "../Router";
import { apple } from "../../../test/fixtures";

const categories = [{ id: 1001, base: "Fruta", title: "Fruta", image: "f.png" }];

const Where = () => <p data-testid="where">{useLocation().pathname}</p>;

const setup = (route: string) => {
  const useCases = {
    loadUser: async () => null,
    getExchangeRate: vi
      .fn()
      .mockResolvedValue({ usdPerEur: 1.1, date: "2026-10-23", source: "ecb" }),
    listCategories: vi.fn().mockResolvedValue(categories),
    listProducts: vi.fn().mockResolvedValue([apple]),
    listFeatured: vi.fn().mockResolvedValue([]),
    getProduct: vi.fn().mockResolvedValue(apple),
  } as unknown as UseCases;
  const store = createAppStore(useCases);

  render(
    <AppProvider useCases={useCases} store={store}>
      <MemoryRouter initialEntries={[route]}>
        <AppRoutes />
        <Where />
      </MemoryRouter>
    </AppProvider>
  );
  return { useCases, store };
};

describe("locale routing", () => {
  it("renders the Spanish catalog under /es/productos", async () => {
    const { useCases } = setup("/es/productos");

    expect(await screen.findByPlaceholderText("Buscar productos...")).toBeInTheDocument();
    expect(useCases.listProducts).toHaveBeenCalledWith("es");
    expect(document.documentElement.lang).toBe("es");
  });

  it("renders the English catalog under /en/products", async () => {
    const { useCases } = setup("/en/products");

    expect(await screen.findByPlaceholderText("Search products...")).toBeInTheDocument();
    expect(useCases.listProducts).toHaveBeenCalledWith("en");
    expect(document.documentElement.lang).toBe("en");
  });

  it("redirects old Spanish urls to /es", async () => {
    setup("/productos");

    expect(await screen.findByPlaceholderText("Buscar productos...")).toBeInTheDocument();
    expect(screen.getByTestId("where")).toHaveTextContent("/es/productos");
  });

  it("redirects the root to a language home", async () => {
    setup("/");

    await screen.findAllByRole("navigation");
    expect(screen.getByTestId("where").textContent).toMatch(/^\/(es|en)$/);
  });

  it("refetches the catalog in the other language when switching", async () => {
    const { useCases } = setup("/es/productos");
    await screen.findByPlaceholderText("Buscar productos...");

    const [english] = screen.getAllByRole("link", { name: "EN English" });
    await userEvent.click(english);

    expect(await screen.findByPlaceholderText("Search products...")).toBeInTheDocument();
    expect(screen.getByTestId("where")).toHaveTextContent("/en/products");
    expect(useCases.listProducts).toHaveBeenLastCalledWith("en");
  });

  it("shows the not found page for unknown routes inside a language", async () => {
    setup("/en/nope");

    expect(await screen.findByText("This page doesn't exist!")).toBeInTheDocument();
  });

  it("loads the exchange rate once the layout mounts", async () => {
    const { useCases, store } = setup("/en");

    await vi.waitFor(() => expect(store.getState().usdPerEur).toBe(1.1));
    expect(useCases.getExchangeRate).toHaveBeenCalled();
  });
});
