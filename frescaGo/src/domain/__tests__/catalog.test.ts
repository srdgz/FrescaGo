import { describe, expect, it } from "vitest";
import { filterProductsByTitle, groupProductsByCategory } from "../catalog";
import type { Category, Product } from "../catalog";
import { apple, pear } from "../../test/fixtures";

const vegetable: Product = {
  ...apple,
  id: 3,
  title: "Zanahoria",
  category: "Verdura",
  base: "Verdura",
};

const categories: Category[] = [
  { id: 1001, base: "Fruta", title: "Fruta", image: "f.png" },
  { id: 1002, base: "Verdura", title: "Verdura", image: "v.png" },
  { id: 1003, base: "Cestas", title: "Cestas", image: "c.png" },
];

describe("catalog", () => {
  it("filters products by title ignoring case", () => {
    expect(filterProductsByTitle([apple, pear], "MAN")).toEqual([apple]);
    expect(filterProductsByTitle([apple, pear], "")).toHaveLength(2);
    expect(filterProductsByTitle([apple, pear], "kiwi")).toEqual([]);
  });

  it("groups products by category and drops empty categories", () => {
    const grouped = groupProductsByCategory(categories, [
      apple,
      pear,
      vegetable,
    ]);
    expect(grouped.map((category) => category.base)).toEqual([
      "Fruta",
      "Verdura",
    ]);
    expect(grouped[0].products).toEqual([apple, pear]);
  });
});
