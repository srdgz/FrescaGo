import { describe, expect, it } from "vitest";
import { pageItems } from "../pagination";

const shape = (current: number, count: number) =>
  pageItems(current, count).map((item) =>
    item.type === "gap" ? "…" : String(item.page + 1)
  );

describe("page items", () => {
  it("lists every page when there are few", () => {
    expect(shape(0, 1)).toEqual(["1"]);
    expect(shape(0, 3)).toEqual(["1", "2", "3"]);
    expect(shape(2, 5)).toEqual(["1", "2", "3", "4", "5"]);
  });

  it("collapses the middle of a long list", () => {
    expect(shape(0, 10)).toEqual(["1", "2", "…", "9", "10"]);
    expect(shape(9, 10)).toEqual(["1", "2", "…", "9", "10"]);
  });

  it("keeps the neighbours of the current page", () => {
    expect(shape(5, 12)).toEqual(["1", "2", "…", "5", "6", "7", "…", "11", "12"]);
    expect(shape(3, 12)).toEqual(["1", "2", "3", "4", "5", "…", "11", "12"]);
  });

  it("never repeats a page or starts with a gap", () => {
    for (let count = 1; count <= 15; count++) {
      for (let current = 0; current < count; current++) {
        const items = pageItems(current, count);
        const pages = items.flatMap((item) => (item.type === "page" ? [item.page] : []));
        expect(new Set(pages).size).toBe(pages.length);
        expect(items[0].type).toBe("page");
        expect(items[items.length - 1].type).toBe("page");
        expect(pages).toContain(current);
      }
    }
  });

  it("gives every gap its own key", () => {
    const keys = pageItems(7, 20).flatMap((item) => (item.type === "gap" ? [item.key] : []));
    expect(new Set(keys).size).toBe(keys.length);
  });
});
