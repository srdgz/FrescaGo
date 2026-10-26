import type { Product } from "../domain/catalog";
import type { User } from "../domain/user";

export const apple: Product = {
  id: 1,
  title: "Manzana",
  price: 2,
  image: "apple.png",
  quantity: 1,
  category: "Fruta",
  base: "Fruta",
};

export const pear: Product = {
  id: 2,
  title: "Pera",
  price: 3.5,
  image: "pear.png",
  quantity: 1,
  category: "Fruta",
  base: "Fruta",
};

export const buyer: User = {
  id: "uid-1",
  email: "buyer@example.com",
  firstName: "Ana",
  lastName: "Pérez",
  avatar: null,
  phone: "600123123",
  shippingAddress: {
    street: "Calle Mayor 12, 3ºB",
    postalCode: "28013",
    city: "Madrid",
    country: "ES",
  },
};

export const newcomer: User = {
  id: "uid-2",
  email: "new@example.com",
  firstName: "Luis",
  lastName: "Gómez",
  avatar: null,
};
