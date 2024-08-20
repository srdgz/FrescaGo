import React, { useEffect, useState } from "react";
import Loading from "../components/Utils/Loading";
import AddToCartBtn from "../components/Utils/AddToCartBtn";
import { useParams, useNavigate } from "react-router-dom";
import { config } from "../../config";
import { getData } from "../lib";
import { RiArrowLeftCircleLine } from "react-icons/ri";

const SingleProductScreen = () => {
  const [productData, setProductData] = useState({
    id: null,
    title: "",
    price: 0,
    image: "",
    category: "",
    base: "",
    quantity: 1,
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

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
      <section className="container py-12 md:py-40 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 lg:top-12 lg:left-24 flex items-center text-gray-600 hover:text-secondary transition duration-200"
        >
          <RiArrowLeftCircleLine className="text-3xl mr-2" /> Volver atrás
        </button>

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
                  {productData.price.toFixed(2)}€/Kg
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
