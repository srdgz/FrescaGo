import Loading from "../components/Utils/Loading";
import CategoryPagination from "../components/Utils/CategoryPagination";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import type { Category, Product } from "../../domain/catalog";
import {
  filterProductsByTitle,
  groupProductsByCategory,
} from "../../domain/catalog";
import { useUseCases } from "../AppContext";
import { useLocale } from "../LocaleContext";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "../hooks/usePageTitle";

const ProductsScreen = () => {
  const { t } = useTranslation();
  usePageTitle(t("pageTitle.products"));
  const { listCategories, listProducts } = useUseCases();
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchProduct, setSearchProduct] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [categoriesData, productsData] = await Promise.all([
          listCategories(locale),
          listProducts(locale),
        ]);
        setCategories(categoriesData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [listCategories, listProducts, locale]);

  const categorizedProducts = useMemo(
    () =>
      groupProductsByCategory(
        categories,
        filterProductsByTitle(products, searchProduct)
      ),
    [categories, products, searchProduct]
  );

  if (loading) return <Loading title={t("pageTitle.products")} />;

  return (
    <div className="overflow-x-hidden min-h-screen">
      <h1 className="sr-only">{t("nav.products")}</h1>
      <section className="container py-10 md:py-18">
        <div className="relative flex justify-end mb-8">
          <motion.div
            initial={{ width: "40px" }}
            animate={{ width: isExpanded ? "100%" : "40px" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative"
          >
            <div className="relative w-full flex items-center">
              <motion.input
                initial={{ width: "0px", opacity: 0 }}
                animate={{
                  width: isExpanded ? "100%" : "0px",
                  opacity: isExpanded ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                type="text"
                placeholder={t("catalog.buscarProductos")}
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                onBlur={() => !searchProduct && setIsExpanded(false)}
                aria-label={t("catalog.buscarProductos")}
                className="field rounded-full! py-2! pr-10"
              />
              {!isExpanded && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  aria-label={t("catalog.search")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-600 transition-colors hover:text-brand"
                >
                  <IoSearchOutline className="text-xl" aria-hidden="true" />
                </button>
              )}
              {isExpanded && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchProduct("");
                    setIsExpanded(false);
                  }}
                  aria-label={t("catalog.clear")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-600 transition-colors hover:text-brand"
                >
                  <IoClose className="text-xl" aria-hidden="true" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
        {categorizedProducts.map((category) => (
          <div key={category.id} className="mb-14">
            <h2 className="my-4 text-3xl font-bold tracking-tight">
              {category.title}
            </h2>
            <CategoryPagination
              products={category.products}
              itemsPerPage={itemsPerPage}
              label={category.title}
            />
          </div>
        ))}
      </section>
    </div>
  );
};

export default ProductsScreen;
