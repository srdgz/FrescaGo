import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CurrencySwitcher from "../CurrencySwitcher";
import LanguageSwitcher from "../LanguageSwitcher";
import { renderWithApp } from "../../../../test/renderWithApp";

describe("LanguageSwitcher", () => {
  it("links to the same page in the other language", () => {
    renderWithApp(<LanguageSwitcher />, {}, { route: "/es/productos/2001?x=1" });

    const english = screen.getByRole("link", { name: "English" });
    expect(english).toHaveAttribute("href", "/en/products/2001?x=1");
    expect(english).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Español" })).toHaveAttribute(
      "aria-current",
      "true"
    );
  });

  it("marks the current language", () => {
    renderWithApp(
      <LanguageSwitcher />,
      {},
      { route: "/en/cart", locale: "en" }
    );

    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "aria-current",
      "true"
    );
    expect(screen.getByRole("link", { name: "Español" })).toHaveAttribute(
      "href",
      "/es/tienda"
    );
  });
});

describe("CurrencySwitcher", () => {
  it("defaults to euros in Spanish and dollars in English", () => {
    const { unmount } = renderWithApp(<CurrencySwitcher />);
    expect(screen.getByRole("button", { name: "Euro" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    unmount();

    renderWithApp(<CurrencySwitcher />, {}, { locale: "en" });
    expect(
      screen.getByRole("button", { name: "US dollar" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("stores the chosen currency", async () => {
    const { store } = renderWithApp(<CurrencySwitcher />);

    await userEvent.click(
      screen.getByRole("button", { name: "Dólar estadounidense" })
    );

    expect(store.getState().currency).toBe("USD");
    expect(
      screen.getByRole("button", { name: "Dólar estadounidense" })
    ).toHaveAttribute("aria-pressed", "true");
  });
});
