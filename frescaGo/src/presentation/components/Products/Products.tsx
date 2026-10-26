import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { FeaturedProduct } from "../../../domain/catalog";
import { useUseCases } from "../../AppContext";
import { useLocale, useLocalePath } from "../../LocaleContext";
import { FadeLeft } from "../../utility/animation";

const Products = () => {
  const { t } = useTranslation();
  const path = useLocalePath();
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

  return (
    <section aria-labelledby="featured-title">
      <div className="container pb-20 pt-12">
        <h2
          id="featured-title"
          className="pb-10 text-left text-3xl font-bold tracking-tight"
        >
          {t("featured.algunosDeNuestrosProductos")}
        </h2>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {generalProductsData.map((product) => (
            <motion.li
              key={product.id}
              variants={FadeLeft(product.delay)}
              initial="hidden"
              whileInView="visible"
            >
              <Link
                to={path("products")}
                className="card flex h-full items-center gap-4 p-4 transition duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <span className="flex h-20 w-20 flex-none items-center justify-center rounded-2xl bg-photo">
                  <img
                    src={product.img}
                    alt=""
                    className="h-14 w-14 object-contain mix-blend-multiply"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-lg font-bold leading-tight">
                    {product.title}
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-accent">
                    {product.price}
                  </span>
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Products;
