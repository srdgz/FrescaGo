import React from "react";
import BannerBg from "../../assets/banner-bg.jpg";
import Button from "../Utils/Button";
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
    <section className="container mb-12 relative">
      <div
        style={bgStyle}
        className="absolute inset-0 rounded-3xl mx-4 md:mx-0 opacity-40 md:opacity-100 z-0"
      ></div>
      <div className="relative z-10 container grid grid-cols-1 md:grid-cols-2 space-y-6 md:space-y-0 py-14 rounded-3xl">
        <div></div>
        <div className="flex flex-col justify-center">
          <div className="text-center md:text-left space-y-4 md:ms-14 lg:max-w-[400px]">
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
              <Button
                text="Haz tu pedido"
                to="/tienda"
                icon={<RiShoppingBasketLine />}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerThird;
