import React from "react";
import { motion } from "framer-motion";

const ContactScreen = () => {
  return (
    <main className="overflow-x-hidden">
      <section className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-secondary">Contáctanos</h2>
          <p className="mt-4 text-lg text-gray-600">
            ¡Estamos aquí para ayudarte! Si tienes alguna pregunta o necesitas
            asistencia, no dudes en contactarnos.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              Información de Contacto
            </h3>
            <ul className="mt-6 space-y-4">
              <li>
                <strong className="text-gray-700">Dirección:</strong>
                <p className="text-gray-600">1234 Calle Falsa, Ciudad, País</p>
              </li>
              <li>
                <strong className="text-gray-700">Teléfono:</strong>
                <p className="text-gray-600">+123 456 7890</p>
              </li>
              <li>
                <strong className="text-gray-700">Email:</strong>
                <p className="text-gray-600">contacto@frescago.com</p>
              </li>
              <li>
                <strong className="text-gray-700">Horario de Atención:</strong>
                <p className="text-gray-600">
                  Lunes a Viernes: 9:00 AM - 6:00 PM <br />
                  Sábado: 10:00 AM - 4:00 PM <br />
                  Domingo: Cerrado
                </p>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              Envíanos un mensaje
            </h3>
            <form className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                ></textarea>
              </div>

              <div>
                <button type="submit" className="w-full primary-btn">
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-800 text-center">
            Visítanos en nuestra oficina
          </h3>
          <div className="mt-6 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
              viewport={{ once: true }}
              className="w-full h-64 bg-gray-200 rounded-lg shadow-md flex items-center justify-center"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d80175.97260231685!2d-3.711652068027487!3d40.42032725353461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2ses!4v1723456021733!5m2!1ses!2ses"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full border-0 rounded-xl"
                title="FrescaGo Location"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactScreen;
