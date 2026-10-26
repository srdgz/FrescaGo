import { LOCALES, isLocale } from "../../domain/locale";
import type { Locale } from "../../domain/locale";

export const ROUTE_SLUGS = {
  home: { es: "", en: "" },
  products: { es: "productos", en: "products" },
  about: { es: "nosotros", en: "about" },
  contact: { es: "contacto", en: "contact" },
  shop: { es: "tienda", en: "cart" },
  user: { es: "usuario", en: "account" },
  editProfile: { es: "editar", en: "edit-profile" },
  orders: { es: "pedidos", en: "orders" },
  success: { es: "success", en: "success" },
  cancel: { es: "cancel", en: "cancel" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof ROUTE_SLUGS;

export const buildPath = (
  locale: Locale,
  key: RouteKey,
  productId?: string | number
): string => {
  const slug = ROUTE_SLUGS[key][locale];
  const base = slug ? `/${locale}/${slug}` : `/${locale}`;
  return productId === undefined ? base : `${base}/${productId}`;
};

export const localeFromPathname = (pathname: string): Locale | null => {
  const [, first] = pathname.split("/");
  return isLocale(first) ? first : null;
};

export const switchLocalePath = (pathname: string, target: Locale): string => {
  const [, first, slug = "", ...rest] = pathname.split("/");
  if (!isLocale(first)) {
    return `/${target}`;
  }
  const entry = (Object.keys(ROUTE_SLUGS) as RouteKey[]).find(
    (key) => ROUTE_SLUGS[key][first] === slug
  );
  if (!entry) {
    return `/${target}`;
  }
  const targetSlug = ROUTE_SLUGS[entry][target];
  const tail = rest.filter(Boolean).join("/");
  return [`/${target}`, targetSlug, tail].filter(Boolean).join("/");
};

export const detectBrowserLocale = (languages: readonly string[]): Locale => {
  const preferred = languages.find((language) =>
    LOCALES.some((locale) => language.toLowerCase().startsWith(locale))
  );
  return preferred?.toLowerCase().startsWith("en") ? "en" : "es";
};
