import type { CatalogRepository } from "../../application/ports.js";
import { categories, generalProductsData, products } from "./data.js";

export const createInMemoryCatalog = (): CatalogRepository => ({
  listProducts: () => products,
  findProduct: (id) => products.find((item) => item.id === id),
  listCategories: () => categories,
  findCategories: (id) => categories.filter((item) => item.id === id),
  listFeatured: () => generalProductsData,
});
