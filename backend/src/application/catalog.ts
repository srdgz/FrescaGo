import type { Locale } from "../domain/locale.js";
import type { CatalogRepository } from "./ports.js";

export const makeCatalogUseCases = (catalog: CatalogRepository) => ({
  listProducts: (locale: Locale) => catalog.listProducts(locale),
  getProduct: (id: number, locale: Locale) => catalog.findProduct(id, locale),
  listCategories: (locale: Locale) => catalog.listCategories(locale),
  getCategories: (id: number, locale: Locale) =>
    catalog.findCategories(id, locale),
  listFeatured: (locale: Locale) => catalog.listFeatured(locale),
});

export type CatalogUseCases = ReturnType<typeof makeCatalogUseCases>;
