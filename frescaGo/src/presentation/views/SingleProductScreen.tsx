import { useEffect, useState } from "react";
import Loading from "../components/Utils/Loading";
import AddToCartBtn from "../components/Utils/AddToCartBtn";
import { useParams, useNavigate } from "react-router-dom";
import { RiArrowLeftCircleLine } from "react-icons/ri";
import type { Product } from "../../domain/catalog";
import { useUseCases } from "../AppContext";
import { useLocale } from "../LocaleContext";
import { useMoney } from "../hooks/useMoney";
import { useTranslation } from "react-i18next";

const emptyProduct: Product = {
  id: 0,
  title: "",
  price: 0,
  image: "",
  category: "",
  base: "",
  quantity: 1,
};

const SingleProductScreen = () => {
  const { t } = useTranslation();
  const { getProduct } = useUseCases();
  const locale = useLocale();
  const { format } = useMoney();
  const [productData, setProductData] = useState<Product>(emptyProduct);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        setProductData(await getProduct(id, locale));
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, getProduct, locale]);

  if (loading) return <Loading />;

  return (
    <main className="overflow-x-hidden">
      <section className="container py-12 md:py-40 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 lg:top-12 lg:left-24 flex items-center text-gray-600 hover:text-secondary transition duration-200"
        >
          <RiArrowLeftCircleLine className="text-3xl mr-2" /> {t("product.volverAtras")}
        </button>

        {productData && productData.id && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
            <div className="flex items-center justify-center rounded-card bg-photo p-8">
              <img
                src={productData.image}
                alt={productData.title}
                className="w-auto max-w-xs object-contain mix-blend-multiply"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {productData.title}
                </h1>
                <p className="mt-4 text-2xl font-semibold text-accent">
                  {t("common.perKg", { price: format(productData.price) })}
                </p>
                <p className="text-gray-500 mt-2">
                  {t("product.categoria")}{" "}
                  <span className="font-medium text-gray-700">
                    {productData.categoryLabel ?? productData.category}
                  </span>
                </p>
              </div>
              <div className="my-6">
                <AddToCartBtn
                  product={productData}
                  title={t("product.anadirAlCarrito")}
                  className="primary-btn text-lg"
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-2 rounded-card bg-soft p-5">
                <p className="font-semibold">{t("product.pagosSeguros")}</p>
                <img
                  src="https://www.freshlycosmetics.com/img/paymentlogos/imatge_es.png"
                  alt={t("product.pagoSeguro")}
                  className="w-auto rounded-lg bg-white object-cover p-2"
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
