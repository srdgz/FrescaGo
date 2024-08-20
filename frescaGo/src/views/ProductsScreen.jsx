import AddToCartBtn from "../components/Utils/AddToCartBtn";
import Loading from "../components/Utils/Loading";
import { useState, useEffect } from "react";
import { config } from "../../config";
import { getData } from "../lib";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoClose, IoSearchOutline } from "react-icons/io5";

const ProductsScreen = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getData(`${config?.baseUrl}/categorias`);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await getData(`${config?.baseUrl}/productos`);
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchProduct.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchProduct, products]);

  const categorizedProducts = categories
    .map((category) => {
      const filteredCategoryProducts = filteredProducts.filter(
        (product) => product.category === category.base
      );
      return {
        ...category,
        products: filteredCategoryProducts,
      };
    })
    .filter((category) => category.products.length > 0);

  const handleProduct = (id) => {
    navigate(`/productos/${id}`);
  };

  if (loading) return <Loading />;

  return (
    <main className="overflow-x-hidden min-h-screen">
      <section className="container py-10 md:py-18">
        <div className="relative flex justify-end">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.products.map((product) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleProduct(product.id)}
                  key={product.id}
                  className="bg-white rounded-3xl px-4 py-4 shadow-[0_0_22px_0_rgba(0,0,0,0.15)] cursor-pointer"
                >
                  <div className="flex flex-row gap-6 justify-evenly">
                    <div className="flex justify-center items-center">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-[100px] object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <h3 className="text-lg font-semibold">{product.title}</h3>
                      <p className="text-lg font-semibold text-secondary">
                        {product.price.toFixed(2)}€/Kg
                      </p>
                      <AddToCartBtn
                        product={product}
                        title="Comprar"
                        className="bg-primary hover:bg-primary text-white h-[40px] w-[120px] flex items-center justify-center text-md rounded-full shadow-lg transition duration-200 mt-2"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default ProductsScreen;
