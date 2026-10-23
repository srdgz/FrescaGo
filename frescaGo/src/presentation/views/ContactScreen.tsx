import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const ContactScreen = () => {
  const { t } = useTranslation();
  return (
    <main className="overflow-x-hidden">
      <section className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-secondary">{t("contact.contactanos")}</h2>
          <p className="mt-4 text-lg text-gray-600">
            {t("contact.estamosAquiParaAyudarte")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {t("contact.informacionDeContacto")}
            </h3>
            <ul className="mt-6 space-y-4">
              <li>
                <strong className="text-gray-700">{t("contact.direccion")}</strong>
                <p className="text-gray-600">{t("contact.1234CalleFalsaCiudad")}</p>
              </li>
              <li>
                <strong className="text-gray-700">{t("contact.telefono")}</strong>
                <p className="text-gray-600">+123 456 7890</p>
              </li>
              <li>
                <strong className="text-gray-700">{t("contact.email")}</strong>
                <p className="text-gray-600">{t("contact.contactoFrescagoCom")}</p>
              </li>
              <li>
                <strong className="text-gray-700">{t("contact.horarioDeAtencion")}</strong>
                <p className="text-gray-600">
                  {t("contact.lunesAViernes9")} <br />
                  {t("contact.sabado1000Am")} <br />
                  {t("contact.domingoCerrado")}
                </p>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {t("contact.envianosUnMensaje")}
            </h3>
            <form className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("contact.nombreCompleto")}
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
                  {t("contact.email2")}
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
                  {t("contact.mensaje")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                ></textarea>
              </div>

              <div>
                <button type="submit" className="w-full primary-btn">
                  {t("contact.enviar")}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-800 text-center">
            {t("contact.visitanosEnNuestraOficina")}
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
                allowFullScreen
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
