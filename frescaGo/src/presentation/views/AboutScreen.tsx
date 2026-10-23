import AboutImage from "../../assets/nosotros.jpg";
import { motion } from "framer-motion";
import { FadeLeft } from "../utility/animation";
import { useTranslation } from "react-i18next";

const AboutScreen = () => {
  const { t } = useTranslation();
  return (
    <main className="overflow-x-hidden">
      <section className="container py-12 md:py-24">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            {t("about.sobreFresca")}<span className="text-secondary">Go</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
            {t("about.enFrescagoNosDedicamos")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-semibold text-secondary mb-4">
              {t("about.nuestraMision")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("about.laMisionDeFrescago")}
            </p>
            <h2 className="text-3xl font-semibold text-secondary mb-4">
              {t("about.nuestraVision")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("about.nuestraVisionEsSer")}
            </p>
            <h2 className="text-3xl font-semibold text-secondary mb-4">
              {t("about.nuestrosValores")}
            </h2>
            <ul className="text-gray-600 list-disc list-inside">
              <li className="mb-2">
                <strong>{t("about.calidad")}</strong> {t("about.ofrecerProductosDeLa")}
              </li>
              <li className="mb-2">
                <strong>{t("about.sostenibilidad")}</strong> {t("about.fomentarPracticasAgricolasSostenibles")}
              </li>
              <li className="mb-2">
                <strong>{t("about.confianza")}</strong> {t("about.serUnPuenteDe")}
              </li>
              <li>
                <strong>{t("about.innovacion")}</strong> {t("about.utilizarTecnologiaParaMejorar")}
              </li>
            </ul>
          </div>
          <div className="flex justify-center items-center">
            <motion.img
              variants={FadeLeft(0.5)}
              initial="hidden"
              whileInView="visible"
              src={AboutImage}
              alt={t("about.sobreFrescago")}
              className="rounded-3xl shadow-lg w-full object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutScreen;
