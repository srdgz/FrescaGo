import { describe, expect, it } from "vitest";
import {
  buildPath,
  detectBrowserLocale,
  localeFromPathname,
  switchLocalePath,
} from "../paths";

describe("route paths", () => {
  it("builds localized paths", () => {
    expect(buildPath("es", "home")).toBe("/es");
    expect(buildPath("en", "home")).toBe("/en");
    expect(buildPath("es", "products")).toBe("/es/productos");
    expect(buildPath("en", "products")).toBe("/en/products");
    expect(buildPath("en", "shop")).toBe("/en/cart");
    expect(buildPath("es", "products", 2001)).toBe("/es/productos/2001");
    expect(buildPath("en", "products", "2001")).toBe("/en/products/2001");
  });

  it("reads the locale from a pathname", () => {
    expect(localeFromPathname("/en/products")).toBe("en");
    expect(localeFromPathname("/es")).toBe("es");
    expect(localeFromPathname("/productos")).toBeNull();
    expect(localeFromPathname("/")).toBeNull();
  });

  it("switches language keeping the page", () => {
    expect(switchLocalePath("/es/productos", "en")).toBe("/en/products");
    expect(switchLocalePath("/en/products", "es")).toBe("/es/productos");
    expect(switchLocalePath("/es/productos/2001", "en")).toBe(
      "/en/products/2001"
    );
    expect(switchLocalePath("/en/account", "es")).toBe("/es/usuario");
    expect(switchLocalePath("/es", "en")).toBe("/en");
    expect(switchLocalePath("/es/success", "en")).toBe("/en/success");
  });

  it("falls back to the home page for unknown paths", () => {
    expect(switchLocalePath("/es/no-existe", "en")).toBe("/en");
    expect(switchLocalePath("/otra-cosa", "en")).toBe("/en");
  });

  it("detects the browser language", () => {
    expect(detectBrowserLocale(["en-GB", "es"])).toBe("en");
    expect(detectBrowserLocale(["es-ES"])).toBe("es");
    expect(detectBrowserLocale(["fr-FR"])).toBe("es");
    expect(detectBrowserLocale([])).toBe("es");
  });
});
