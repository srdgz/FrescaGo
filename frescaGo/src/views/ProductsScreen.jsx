import React, { useState, useEffect } from "react";
import AddToCartBtn from "../components/Utils/AddToCartBtn";
import Loading from "../components/Utils/Loading";
import { config } from "../../config";
import { getData } from "../lib";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ProductsScreen = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

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
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const categorizedProducts = categories.map((category) => {
    return {
      ...category,
      products: products.filter(
        (product) => product.category === category.base
      ),
    };
  });

  const handleProduct = (id) => {
    navigate(`/productos/${id}`);
  };

  if (loading) return <Loading />;

  return (
    <main className="overflow-x-hidden">
      <section className="container py-12 md:py-24">
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
                        {product.price}€/Kg
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
