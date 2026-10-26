import heroEnsalada from "../../../assets/hero-ensalada.png";
import heroHoja from "../../../assets/hero-hoja.png";
import Button from "../Utils/Button";
import { RiShoppingBasketLine } from "react-icons/ri";
import { motion } from "framer-motion";
import { FadeRight } from "../../utility/animation";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "../../LocaleContext";

const Hero = () => {
  const { t } = useTranslation();
  const path = useLocalePath();
  return (
    <section>
      <div className="container grid grid-cols-1 md:grid-cols-2 min-h-[650px] relative">
        <div className="flex flex-col justify-center py-14 md:py-0 relative z-10">
          <div className="text-center md:text-left spacy-y-6 lg:max-w-[400px]">
            <motion.h1
              variants={FadeRight(0.6)}
              initial="hidden"
              animate="visible"
              className="font-display text-5xl font-bold leading-tight tracking-tight lg:text-6xl"
            >
              <span className="text-accent">{t("hero.frescura")}</span>
              <br />
              {t("hero.directa")}
              <br />{t("hero.aTuPuerta")}
            </motion.h1>
            <motion.p
              variants={FadeRight(0.9)}
              initial="hidden"
              animate="visible"
              className="py-6 text-xl font-medium text-gray-800 md:text-2xl"
            >
              {t("hero.noEsperesMasPara")}
            </motion.p>
            <motion.p
              variants={FadeRight(1.2)}
              initial="hidden"
              animate="visible"
              className="pb-6 text-gray-600"
            >
              {t("hero.compraEnFrescagoY")}
            </motion.p>
            <motion.div
              variants={FadeRight(1.5)}
              initial="hidden"
              animate="visible"
              className="flex justify-center md:justify-start"
            >
              <Button
                text={t("hero.pideAhora")}
                to={path("shop")}
                icon={<RiShoppingBasketLine />}
              />
            </motion.div>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <motion.img
            initial={{ opacity: 0, x: 200, rotate: 75 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            src={heroEnsalada}
            alt=""
            className="relative z-10 w-[300px] fruit-shadow sm:w-[380px] md:w-[500px]"
          />
        </div>
        <div aria-hidden="true" className="absolute right-1/2 top-14 rotate-[40deg] opacity-60 blur-xs md:top-0">
          <motion.img
            initial={{ opacity: 0, x: -200, rotate: 75 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            src={heroHoja}
            alt=""
            className="w-full md:max-w-[300px]"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
