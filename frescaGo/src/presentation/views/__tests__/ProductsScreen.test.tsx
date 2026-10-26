import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductsScreen from "../ProductsScreen";
import { renderWithApp } from "../../../test/renderWithApp";
import { apple, pear } from "../../../test/fixtures";

const categories = [
  { id: 1001, base: "Fruta", title: "Fruta", image: "f.png" },
  { id: 1002, base: "Verdura", title: "Verdura", image: "v.png" },
];

const setup = () =>
  renderWithApp(<ProductsScreen />, {
    listCategories: vi.fn().mockResolvedValue(categories),
    listProducts: vi.fn().mockResolvedValue([apple, pear]),
  });

describe("ProductsScreen", () => {
  it("lists the products of every category that has some", async () => {
    setup();

    expect(await screen.findByText("Manzana")).toBeInTheDocument();
    expect(screen.getByText("Pera")).toBeInTheDocument();
    expect(screen.queryByText("Verdura")).not.toBeInTheDocument();
  });

  it("filters the products with the search box", async () => {
    setup();
    await screen.findByText("Manzana");

    await userEvent.click(screen.getAllByRole("button")[0]);
    await userEvent.type(screen.getByRole("textbox"), "per");

    expect(screen.queryByText("Manzana")).not.toBeInTheDocument();
    expect(screen.getByText("Pera")).toBeInTheDocument();
  });
});
