import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const SITE_NAME = "FrescaGo";

export const usePageTitle = (title?: string | null) => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : t("meta.title");
  }, [title, t]);
};
