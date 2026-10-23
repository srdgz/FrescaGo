import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FadeLeft } from "../../utility/animation";
import { useNavigate } from "react-router-dom";
import type { FeaturedProduct } from "../../../domain/catalog";
import { useUseCases } from "../../AppContext";
import { useLocale } from "../../LocaleContext";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "../../LocaleContext";

const Products = () => {
  const { t } = useTranslation();
  const path = useLocalePath();
  const navigate = useNavigate();
  const { listFeatured } = useUseCases();
  const locale = useLocale();
  const [generalProductsData, setGeneralProductsData] = useState<
    FeaturedProduct[]
  >([]);

  useEffect(() => {
    listFeatured(locale)
      .then(setGeneralProductsData)
      .catch((error) => console.error("Error fetching data: ", error));
  }, [listFeatured, locale]);

  const handleProducts = () => {
    navigate(path("products"));
  };

  return (
    <section>
      <div className="container pt-12 pb-20">
        <motion.h1
          initial={{ opacity: 0, x: -200 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-2xl font-bold text-left pb-10"
        >
          {t("featured.algunosDeNuestrosProductos")}
        </motion.h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {generalProductsData.map((product) => (
            <motion.div
              onClick={handleProducts}
              key={product.id}
              variants={FadeLeft(product.delay)}
              initial="hidden"
              whileInView="visible"
              whileHover={{ scale: 1.1 }}
              className="bg-white rounded-3xl px-4 py-4 shadow-[0_0_22px_0_rgba(0,0,0,0.15)] flex flex-row justify-around items-center gap-3"
            >
              <img
                src={product.img}
                alt="FrescaGo producto"
                className="w-[60px] mb-4 scale-110 transform justify-center"
              />
              <div>
                <h1 className="text-lg font-semibold">{product.title}</h1>
                <p className="text-lg font-semibold text-secondary">
                  {product.price}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
