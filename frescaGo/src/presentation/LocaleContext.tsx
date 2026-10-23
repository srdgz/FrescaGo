import { createContext, useCallback, useContext, useLayoutEffect } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { Locale } from "../domain/locale";
import { buildPath } from "./routes/paths";
import type { RouteKey } from "./routes/paths";

const LocaleContext = createContext<Locale>("es");

interface LocaleProviderProps {
  locale: Locale;
  children: ReactNode;
}

export const LocaleProvider = ({ locale, children }: LocaleProviderProps) => {
  const { i18n } = useTranslation();

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
