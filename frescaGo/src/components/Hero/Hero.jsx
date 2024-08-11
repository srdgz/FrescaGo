import React from "react";
import heroEnsalada from "../../assets/hero-ensalada.png";
import heroHoja from "../../assets/hero-hoja.png";
import Button from "../Utils/Button";
import { RiShoppingBasketLine } from "react-icons/ri";
import { motion } from "framer-motion";
import { FadeRight } from "../../utility/animation";

const Hero = () => {
  return (
    <section>
      <div className="container grid grid-cols-1 md:grid-cols-2 min-h-[650px] relative">
        <div className="flex flex-col justify-center py-14 md:py-0 relative z-10">
          <div className="text-center md:text-left spacy-y-6 lg:max-w-[400px]">
            <motion.h1
              variants={FadeRight(0.6)}
              initial="hidden"
              animate="visible"
              className="text-5xl lg:text-6xl font-bold leading-snug xl:leading-normal font-averia"
            >
              <span className="text-secondary">Frescura</span>
              <br />
              directa
              <br />a tu puerta
            </motion.h1>
            <motion.p
              variants={FadeRight(0.9)}
              initial="hidden"
              animate="visible"
              className="text-2xl tracking-wide py-6"
            >
              ¡No esperes más para disfrutar de lo más fresco!
            </motion.p>
            <motion.p
              variants={FadeRight(1.2)}
              initial="hidden"
              animate="visible"
              className="text-gray-400 pb-6"
            >
              Compra en FrescaGo y recibe frutas y verduras directamente en tu
              puerta. Calidad, frescura y sabor en cada bocado. Haz tu pedido
              ahora y descubre la diferencia!
            </motion.p>
            <motion.div
              variants={FadeRight(1.5)}
              initial="hidden"
              animate="visible"
              className="flex justify-center md:justify-start"
            >
              <Button text="Pide ahora" icon={<RiShoppingBasketLine />} />
            </motion.div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <motion.img
            initial={{ opacity: 0, x: 200, rotate: 75 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            src={heroEnsalada}
            alt="FrescaGo ensalada"
            className="w-[350px] md:w-[550px] drop-shadow"
          />
        </div>
        <div className="absolute top-14 md:top-0 right-1/2 blur-sm opacity-80 rotate-[40deg]">
          <motion.img
            initial={{ opacity: 0, x: -200, rotate: 75 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            src={heroHoja}
            alt="FrescaGo hoja"
            className="w-full md:max-w-[300px]"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
