import React from "react";
import BannerBg from "../../assets/banner-bg.jpg";
import { motion } from "framer-motion";
import { FadeLeft } from "../../utility/animation";
import { RiShoppingBasketLine } from "react-icons/ri";

const bgStyle = {
  backgroundImage: `url(${BannerBg})`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

const BannerThird = () => {
  return (
    <section className="">
      <div
        style={bgStyle}
        className="container grid grid-cols-1 md:grid-cols-2 space-y-6 md:space-y-0 py-14 rounded-3xl"
      >
        <div></div>
        <div className="flex flex-col justify-center">
          <div className="text-center md:text-left space-y-4 ms-14 lg:max-w-[400px]">
            <motion.h1
              variants={FadeLeft(0.5)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl lg:text-6xl font-bold"
            >
              Haz tu pedido hoy
            </motion.h1>
            <motion.p
              variants={FadeLeft(0.7)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Haz tu pedido ahora y recibe frutas y verduras de la mejor
              calidad, cultivadas de manera sostenible por agricultores locales.
              ¡Disfruta de alimentos nutritivos y llenos de sabor en cada
              bocado!
            </motion.p>
            <motion.div
              variants={FadeLeft(0.9)}
              initial="hidden"
              animate="visible"
              className="flex justify-center md:justify-start"
            >
              <button className="primary-btn flex items-center gap-2 mb-6">
                <span>
                  <RiShoppingBasketLine />
                </span>
                Haz tu pedido
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerThird;
