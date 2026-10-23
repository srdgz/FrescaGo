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
