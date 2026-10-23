import type { RouteKey } from "../routes/paths";

export interface NavbarItem {
  id: number;
  label: string;
  route: RouteKey;
}

export const NavbarMenu: NavbarItem[] = [
  { id: 1, label: "nav.home", route: "home" },
  { id: 2, label: "nav.products", route: "products" },
  { id: 3, label: "nav.about", route: "about" },
  { id: 5, label: "nav.contact", route: "contact" },
];
