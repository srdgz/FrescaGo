import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LOCALES } from "../../../domain/locale";
import { useLocale } from "../../LocaleContext";
import { switchLocalePath } from "../../routes/paths";

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const current = useLocale();
  const { pathname, search } = useLocation();

  return (
    <div
      role="group"
      aria-label={t("language.label")}
      className="inline-flex overflow-hidden rounded-full border border-gray-400 text-xs font-semibold"
    >
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          to={`${switchLocalePath(pathname, locale)}${search}`}
          hrefLang={locale}
          lang={locale}
          aria-current={locale === current ? "true" : undefined}
          aria-label={`${locale.toUpperCase()} ${t(`language.${locale}`)}`}
          className={`px-3 py-1 uppercase ${
            locale === current
              ? "bg-primary text-white"
              : "text-gray-600 hover:text-brand"
          }`}
        >
          {locale}
        </Link>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
