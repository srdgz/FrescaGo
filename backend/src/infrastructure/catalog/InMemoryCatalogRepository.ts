import type { CatalogRepository } from "../../application/ports.js";
import type {
  Category,
  FeaturedProduct,
  LocalizedProduct,
  Product,
} from "../../domain/catalog.js";
import type { Locale } from "../../domain/locale.js";
import { categories, generalProductsData, products } from "./data.js";
import {
  categoryLabelsEn,
  featuredTitlesEn,
  localizeFeaturedPrice,
  productTitlesEn,
} from "./translations.js";

const categoryLabel = (key: string, locale: Locale): string =>
  locale === "en" ? (categoryLabelsEn[key] ?? key) : key;

const localizeProduct = (product: Product, locale: Locale): LocalizedProduct => ({
  ...product,
  title: locale === "en" ? (productTitlesEn[product.id] ?? product.title) : product.title,
  categoryLabel: categoryLabel(product.category, locale),
});

const localizeCategory = (category: Category, locale: Locale): Category => ({
  ...category,
  title: categoryLabel(category.base, locale),
});

const localizeFeatured = (
  item: FeaturedProduct,
  locale: Locale
): FeaturedProduct =>
  locale === "en"
    ? {
        ...item,
        title: featuredTitlesEn[item.id] ?? item.title,
        category: categoryLabel(item.category, locale),
        price: localizeFeaturedPrice(item.price),
      }
    : item;

export const createInMemoryCatalog = (): CatalogRepository => ({
  listProducts: (locale) =>
    products.map((product) => localizeProduct(product, locale)),
  findProduct: (id, locale = "es") => {
    const product = products.find((item) => item.id === id);
    return product ? localizeProduct(product, locale) : undefined;
  },
  listCategories: (locale) =>
    categories.map((category) => localizeCategory(category, locale)),
  findCategories: (id, locale) =>
    categories
      .filter((item) => item.id === id)
      .map((category) => localizeCategory(category, locale)),
  listFeatured: (locale) =>
    generalProductsData.map((item) => localizeFeatured(item, locale)),
});
