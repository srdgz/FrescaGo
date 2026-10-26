import { createContext, useCallback, useContext, useLayoutEffect } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Locale } from "../domain/locale";
import { LOCALES } from "../domain/locale";
import { buildPath, switchLocalePath } from "./routes/paths";
import type { RouteKey } from "./routes/paths";

const LocaleContext = createContext<Locale>("es");

const setMeta = (
  selector: string,
  attributes: Record<string, string>,
  content: string
) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) =>
      element!.setAttribute(key, value)
    );
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const setLink = (rel: string, hreflang: string | undefined, href: string) => {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    if (hreflang) element.setAttribute("hreflang", hreflang);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
};

interface LocaleProviderProps {
  locale: Locale;
  children: ReactNode;
}

export const LocaleProvider = ({ locale, children }: LocaleProviderProps) => {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const fixedT = i18n.getFixedT(locale);
    const description = fixedT("meta.description");
    setMeta('meta[name="description"]', { name: "description" }, description);
    setMeta('meta[property="og:description"]', { property: "og:description" }, description);
    setMeta('meta[property="og:locale"]', { property: "og:locale" }, locale === "es" ? "es_ES" : "en_US");
    setLink("canonical", undefined, `${window.location.origin}${pathname}`);
    LOCALES.forEach((code) =>
      setLink("alternate", code, `${window.location.origin}${switchLocalePath(pathname, code)}`)
    );
    setLink(
      "alternate",
      "x-default",
      `${window.location.origin}${switchLocalePath(pathname, "es")}`
    );
  }, [i18n, locale, pathname]);

  useLayoutEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
    document.documentElement.lang = locale;
    document.title = i18n.getFixedT(locale)("meta.title");
  }, [i18n, locale]);

  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
};

export const useLocale = (): Locale => useContext(LocaleContext);

export const useLocalePath = () => {
  const locale = useLocale();
  return useCallback(
    (key: RouteKey, productId?: string | number) =>
      buildPath(locale, key, productId),
    [locale]
  );
};
