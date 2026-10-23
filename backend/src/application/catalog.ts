import type { CatalogRepository } from "./ports.js";

export const makeCatalogUseCases = (catalog: CatalogRepository) => ({
  listProducts: () => catalog.listProducts(),
  getProduct: (id: number) => catalog.findProduct(id),
  listCategories: () => catalog.listCategories(),
  getCategories: (id: number) => catalog.findCategories(id),
  listFeatured: () => catalog.listFeatured(),
});

export type CatalogUseCases = ReturnType<typeof makeCatalogUseCases>;
