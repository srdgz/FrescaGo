import BannerPlato from "../../assets/banner-plato.png";
import { motion } from "framer-motion";
import { FadeUp } from "../../utility/animation";

const BannerSecond = () => {
  return (
    <section className="">
      <div className="container grid grid-cols-1 md:grid-cols-2 space-y-6 md:space-y-0 py-14 md:py-24">
        <div className="flex flex-col justify-center">
          <div className="text-center md:text-left space-y-4 lg:max-w-[400px] z-20">
            <motion.h1
              variants={FadeUp(0.5)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl lg:text-6xl font-bold"
            >
              Descarga nuestra App
            </motion.h1>
            <motion.p
              variants={FadeUp(0.7)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Lleva la frescura del campo a tu bolsillo. Con nuestra app, podrás
              hacer pedidos de frutas y verduras frescas en cualquier momento,
              directamente desde tu teléfono.
            </motion.p>
            <motion.p
              variants={FadeUp(0.9)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Disponible tanto en Google Play como en App Store, nuestra
              aplicación te ofrece una experiencia de compra rápida y
              conveniente.
            </motion.p>
            <motion.p
              variants={FadeUp(1.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Descubre lo fácil que es mantener una alimentación saludable con
              productos frescos de alta calidad, seleccionados especialmente
              para ti.
            </motion.p>
            <motion.div
              variants={FadeUp(1.5)}
              initial="hidden"
              animate="visible"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex justify-center md:justify-start space-x-4"
            >
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://cdn1.bodas.net/assets/img/footer/googleplay.png"
                  srcSet="https://cdn1.bodas.net/assets/img/footer/googleplay@2x.png"
                  loading="lazy"
                  className="mx-auto md:mx-0 max-h-12"
                />
              </a>
              <a
                href={"https://www.apple.com/app-store/"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://cdn1.bodas.net/assets/img/footer/appstore.png"
                  srcSet="https://cdn1.bodas.net/assets/img/footer/appstore@2x.png"
                  loading="lazy"
                  className="mx-auto md:mx-0 max-h-12"
                />
              </a>
            </motion.div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <motion.img
            initial={{ opacity: 0, x: 200, rotate: 75 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            src={BannerPlato}
            alt="Imagen promocional de la app FrescaGo"
            className="w-[450px] md:max-w-[500px] h-full object-cover drop-shadow"
          />
        </div>
      </div>
    </section>
  );
};

export default BannerSecond;
