import { useTranslation } from "react-i18next";

const SkipLink = () => {
  const { t } = useTranslation();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:font-semibold focus:text-white focus:shadow-lg"
    >
      {t("nav.skipToContent")}
    </a>
  );
};

export default SkipLink;
