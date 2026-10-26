import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "../hooks/usePageTitle";
import { useLocalePath } from "../LocaleContext";

const ErrorScreen = () => {
  const { t } = useTranslation();
  usePageTitle(t("pageTitle.notFound"));
  const path = useLocalePath();
  return (
    <div className="overflow-x-hidden flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <p className="text-4xl font-semibold text-brand">{t("notFound.error")}</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {t("notFound.estaPaginaNoExiste")}
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          {t("notFound.pareceQueNoPodemos")}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link to={path("home")} className="primary-btn flex items-center gap-2 mb-6">
            {t("notFound.volverAtras")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;
