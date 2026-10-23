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

const ProductsScreen = () => {
  const { listCategories, listProducts } = useUseCases();
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
          listCategories(),
          listProducts(),
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
  }, [listCategories, listProducts]);

  const categorizedProducts = useMemo(
    () =>
      groupProductsByCategory(
        categories,
        filterProductsByTitle(products, searchProduct)
      ),
    [categories, products, searchProduct]
  );

  if (loading) return <Loading />;

  return (
    <main className="overflow-x-hidden min-h-screen">
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
                placeholder="Buscar productos..."
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                onBlur={() => !searchProduct && setIsExpanded(false)}
                className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              {!isExpanded && (
                <IoSearchOutline
                  onClick={() => setIsExpanded(true)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xl text-gray-600 hover:text-secondary cursor-pointer duration-200"
                />
              )}
              {isExpanded && (
                <IoClose
                  onClick={() => {
                    setSearchProduct("");
                    setIsExpanded(false);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xl text-gray-600 hover:text-primary cursor-pointer duration-200"
                />
              )}
            </div>
          </motion.div>
        </div>
        {categorizedProducts.map((category) => (
          <div key={category.id} className="mb-14">
            <h2 className="text-4xl font-bold text-secondary my-4">
              {category.title}
            </h2>
            <CategoryPagination
              products={category.products}
              itemsPerPage={itemsPerPage}
            />
          </div>
        ))}
      </section>
    </main>
  );
};

export default ProductsScreen;
