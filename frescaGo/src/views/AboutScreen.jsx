import AboutImage from "../assets/nosotros.jpg";
import { motion } from "framer-motion";
import { FadeLeft } from "../utility/animation";

const AboutScreen = () => {
  return (
    <main className="overflow-x-hidden">
      <section className="container py-12 md:py-24">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Sobre Fresca<span className="text-secondary">Go</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
            En FrescaGo, nos dedicamos a llevar la frescura del campo
            directamente a tu mesa. Nuestro objetivo es ofrecerte productos de
            la más alta calidad, cultivados de manera sostenible por
            agricultores locales, para que disfrutes de frutas y verduras
            frescas todos los días.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-semibold text-secondary mb-4">
              Nuestra Misión
            </h2>
            <p className="text-gray-600 mb-6">
              La misión de FrescaGo es facilitar el acceso a alimentos frescos,
              nutritivos y sostenibles, fortaleciendo el vínculo entre el campo
              y la ciudad. Creemos en la importancia de una alimentación
              saludable y estamos comprometidos con la sostenibilidad y el apoyo
              a los agricultores locales.
            </p>
            <h2 className="text-3xl font-semibold text-secondary mb-4">
              Nuestra Visión
            </h2>
            <p className="text-gray-600 mb-6">
              Nuestra visión es ser la tienda online de referencia para la
              compra de productos frescos, fomentando un estilo de vida
              saludable y sostenible en todo el país.
            </p>
            <h2 className="text-3xl font-semibold text-secondary mb-4">
              Nuestros Valores
            </h2>
            <ul className="text-gray-600 list-disc list-inside">
              <li className="mb-2">
                <strong>Calidad:</strong> Ofrecer productos de la más alta
                calidad, frescos y nutritivos.
              </li>
              <li className="mb-2">
                <strong>Sostenibilidad:</strong> Fomentar prácticas agrícolas
                sostenibles y apoyar a los agricultores locales.
              </li>
              <li className="mb-2">
                <strong>Confianza:</strong> Ser un puente de confianza entre los
                productores y los consumidores.
              </li>
              <li>
                <strong>Innovación:</strong> Utilizar tecnología para mejorar la
                experiencia de compra y la eficiencia en la entrega.
              </li>
            </ul>
          </div>
          <div className="flex justify-center items-center">
            <motion.img
              variants={FadeLeft(0.5)}
              initial="hidden"
              whileInView="visible"
              src={AboutImage}
              alt="Sobre FrescaGo"
              className="rounded-3xl shadow-lg w-full object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutScreen;
