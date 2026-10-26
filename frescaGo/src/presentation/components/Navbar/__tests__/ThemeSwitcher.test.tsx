import { afterEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeSwitcher from "../ThemeSwitcher";
import { renderWithApp } from "../../../../test/renderWithApp";

afterEach(() => {
  document.documentElement.removeAttribute("data-theme");
});

describe("ThemeSwitcher", () => {
  it("offers the dark theme first in a light system", () => {
    renderWithApp(<ThemeSwitcher />);

    expect(
      screen.getByRole("button", { name: "Cambiar a tema oscuro" })
    ).toBeInTheDocument();
  });

  it("switches the theme and remembers the choice", async () => {
    renderWithApp(<ThemeSwitcher />);

    await userEvent.click(
      screen.getByRole("button", { name: "Cambiar a tema oscuro" })
    );

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(localStorage.getItem("frescago-theme")).toBe("dark");

    await userEvent.click(
      screen.getByRole("button", { name: "Cambiar a tema claro" })
    );

    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(localStorage.getItem("frescago-theme")).toBe("light");
  });

  it("starts from the stored theme", () => {
    localStorage.setItem("frescago-theme", "dark");

    renderWithApp(<ThemeSwitcher />);

    expect(
      screen.getByRole("button", { name: "Cambiar a tema claro" })
    ).toBeInTheDocument();
  });

  it("still works when storage is blocked", async () => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
    try {
      renderWithApp(<ThemeSwitcher />);
      await userEvent.click(
        screen.getByRole("button", { name: "Cambiar a tema oscuro" })
      );
      expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    } finally {
      Storage.prototype.setItem = original;
    }
  });
});
