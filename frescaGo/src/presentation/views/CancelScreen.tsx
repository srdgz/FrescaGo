import Button from "../components/Utils/Button";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "../LocaleContext";

const CancelScreen = () => {
  const { t } = useTranslation();
  const path = useLocalePath();
  return (
    <main className="overflow-x-hidden">
      <section className="container py-12 md:py-24">
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-y-8 my-12">
          <h1 className="text-2xl md:text-4xl font-bold text-center text-brand">
            {t("cancel.tuPagoHaSido")}
          </h1>
          <p className="text-gray-600">
            {t("cancel.lamentablementeTuPagoNo")}
          </p>
          <div className="flex items-center gap-x-8">
            <Button text={t("cancel.volverAlInicio")} to={path("home")} />
            <Button text={t("cancel.volverAComprar")} to={path("products")} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default CancelScreen;
