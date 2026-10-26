import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LOCALE } from "../../domain/locale";
import type { Locale } from "../../domain/locale";
import en from "./messages/en.json";
import es from "./messages/es.json";

export const setupI18n = (locale: Locale = DEFAULT_LOCALE) => {
  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      resources: { es: { translation: es }, en: { translation: en } },
      lng: locale,
      fallbackLng: DEFAULT_LOCALE,
      interpolation: { escapeValue: false },
      returnNull: false,
    });
  } else if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }
  return i18n;
};

export default i18n;
