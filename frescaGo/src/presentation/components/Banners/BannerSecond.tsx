import BannerPlato from "../../../assets/banner-plato.webp";
import { motion } from "framer-motion";
import { FadeUp } from "../../utility/animation";
import { useTranslation } from "react-i18next";
import { FaApple, FaGooglePlay } from "react-icons/fa";

const BannerSecond = () => {
  const { t } = useTranslation();
  return (
    <section className="">
      <div className="container grid grid-cols-1 md:grid-cols-2 space-y-6 md:space-y-0 py-14 md:py-24">
        <div className="flex flex-col justify-center">
          <div className="text-center md:text-left space-y-4 lg:max-w-[400px] z-20">
            <motion.h2
              variants={FadeUp(0.5)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl lg:text-5xl font-bold"
            >
              {t("bannerApp.descargaNuestraApp")}
            </motion.h2>
            <motion.p
              variants={FadeUp(0.7)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {t("bannerApp.llevaLaFrescuraDel")}
            </motion.p>
            <motion.p
              variants={FadeUp(0.9)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {t("bannerApp.disponibleTantoEnGoogle")}
            </motion.p>
            <motion.p
              variants={FadeUp(1.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {t("bannerApp.descubreLoFacilQue")}
            </motion.p>
            <motion.div
              variants={FadeUp(1.5)}
              initial="hidden"
              animate="visible"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-4 md:justify-start"
            >
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-xl bg-ink px-4 py-2.5 text-canvas transition-opacity hover:opacity-90"
              >
                <FaGooglePlay className="text-xl" aria-hidden="true" />
                <span className="font-semibold">{t("bannerApp.googlePlay")}</span>
                <span className="sr-only">{t("common.newTab")}</span>
              </a>
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-xl bg-ink px-4 py-2.5 text-canvas transition-opacity hover:opacity-90"
              >
                <FaApple className="text-2xl" aria-hidden="true" />
                <span className="font-semibold">{t("bannerApp.appStore")}</span>
                <span className="sr-only">{t("common.newTab")}</span>
              </a>
            </motion.div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <motion.img width={1000} height={1023} loading="lazy" decoding="async"
            initial={{ opacity: 0, x: 200, rotate: 75 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            src={BannerPlato}
            alt={t("bannerApp.imagenPromocionalDeLa")}
            className="w-[450px] md:max-w-[500px] h-auto fruit-shadow"
          />
        </div>
      </div>
    </section>
  );
};

export default BannerSecond;
