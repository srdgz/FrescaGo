import React from "react";
import BannerSplash from "../../assets/banner-frutas.png";
import { motion } from "framer-motion";
import { FadeUp } from "../../utility/animation";

const Banner = () => {
  return (
    <section className="bg-secondary/10">
      <div className="container grid grid-cols-1 md:grid-cols-2 space-y-6 md:space-y-0 py-14">
        <div className="flex justify-center items-center">
          <motion.img
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            viewport={{ once: true }}
            src={BannerSplash}
            alt=""
            className="w-[300px] md:max-w-[400px] h-full object-cover drop-shadow"
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-center md:text-left space-y-4 lg:max-w-[400px]">
            <motion.h1
              variants={FadeUp(0.5)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl lg:text-6xl font-bold"
            >
              Sobre nosotros
            </motion.h1>
            <motion.p
              variants={FadeUp(0.7)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              En FrescaGo, nos apasiona llevar la frescura del campo
              directamente a tu mesa. Somos una tienda online de frutas y
              verduras comprometida con ofrecer productos de la más alta
              calidad, cultivados de manera sostenible por agricultores locales.
            </motion.p>
            <motion.p
              variants={FadeUp(0.9)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Creemos en la importancia de una alimentación saludable y en el
              poder de la naturaleza para nutrirnos.
            </motion.p>
            <motion.p
              variants={FadeUp(1.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Cada pedido es cuidadosamente seleccionado para garantizar que
              recibas solo lo mejor. FrescaGo no es solo una tienda, es un
              puente entre el campo y tu hogar, asegurando que disfrutes de
              alimentos frescos, nutritivos y llenos de sabor todos los días.
            </motion.p>
            <motion.p
              variants={FadeUp(1.3)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {" "}
              ¡Confía en nosotros para llevar la frescura a tu vida!
            </motion.p>
            <motion.div
              variants={FadeUp(1.5)}
              initial="hidden"
              animate="visible"
              className="flex justify-center md:justify-start"
            >
              <button className="primary-btn ">Saber más</button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
