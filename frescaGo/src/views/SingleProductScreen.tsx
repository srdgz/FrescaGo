import React, { useEffect, useState } from "react";
import Loading from "../components/Utils/Loading";
import AddToCartBtn from "../components/Utils/AddToCartBtn";
import { useParams } from "react-router-dom";
import { config } from "../../config";
import { getData } from "../lib";

const SingleProductScreen = () => {
  const [productData, setProductData] = useState({
    id: null,
    title: "",
    price: "",
    image: "",
    category: "",
    base: "",
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getData(`${config?.baseUrl}/productos/${id}`);
        if (id) {
          setProductData(data);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Loading />;

  return (
    <main className="overflow-x-hidden">
      <section className="container py-12 md:py-40">
        {productData && productData.id && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
            <div className="flex justify-center">
              <img
                src={productData.image}
                alt={productData.title}
                className="w-auto max-w-xs object-cover"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {productData.title}
                </h1>
                <p className="text-2xl font-semibold text-secondary mt-4">
                  {productData.price}€/Kg
                </p>
                <p className="text-gray-500 mt-2">
                  Categoría:{" "}
                  <span className="font-medium text-gray-700">
                    {productData.category}
                  </span>
                </p>
              </div>
              <div className="my-6">
                <AddToCartBtn
                  product={productData}
                  title="Añadir al carrito"
                  className="bg-primary hover:bg-primary text-white p-3 text-lg rounded-full shadow-lg transition duration-200"
                />
              </div>
              <div className="bg-slate-100 p-5 rounded-md flex flex-col items-center justify-center gap-2">
                <p className="font-semibold">PAGOS SEGUROS</p>
                <img
                  src="https://www.freshlycosmetics.com/img/paymentlogos/imatge_es.png"
                  alt="pago seguro"
                  className="w-auto object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default SingleProductScreen;
