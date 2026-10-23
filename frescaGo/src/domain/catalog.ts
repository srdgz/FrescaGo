export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  base: string;
}

export interface Category {
  id: number;
  base: string;
  title: string;
  image: string;
}

export interface FeaturedProduct {
  id: number;
  title: string;
  base: string;
  category: string;
  delay: number;
  price: string;
  img: string;
}

export interface CategoryWithProducts extends Category {
  products: Product[];
}

export const filterProductsByTitle = (
  products: Product[],
  query: string
): Product[] => {
  const normalized = query.toLowerCase();
  return products.filter((product) =>
    product.title.toLowerCase().includes(normalized)
  );
};

export const groupProductsByCategory = (
  categories: Category[],
  products: Product[]
): CategoryWithProducts[] =>
  categories
    .map((category) => ({
      ...category,
      products: products.filter((product) => product.category === category.base),
    }))
    .filter((category) => category.products.length > 0);
