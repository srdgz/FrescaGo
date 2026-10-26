import CartProduct from "../components/Products/CartProduct";
import CheckoutBtn from "../components/Utils/CheckoutBtn";
import Button from "../components/Utils/Button";
import Tooltip from "../components/Utils/Tooltip";
import { SHIPPING_AMOUNT, cartSubtotal } from "../../domain/cart";
import { useAppStore } from "../AppContext";
import { useMoney } from "../hooks/useMoney";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "../LocaleContext";

const ShopScreen = () => {
  const { t } = useTranslation();
  const path = useLocalePath();
  const { cartProduct } = useAppStore();
  const { format } = useMoney();

  const totalAmt = cartSubtotal(cartProduct);
  const shippingAmt = SHIPPING_AMOUNT;

  return (
    <main className="overflow-x-hidden">
      <section className="container py-12 md:py-24">
        {cartProduct.length > 0 ? (
          <>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("shop.tuCestaDeLa")}
            </h1>

            <div className="mt-10 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
              <section className="lg:col-span-7">
                <div className="divide-y divide-gray-200 border-b border-t border-gray-200">
                  {cartProduct.map((product) => (
                    <CartProduct
                      product={product}
                      key={product?.id}
                    />
                  ))}
                </div>
              </section>
              <section className="card mt-16 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                <h2 className="text-lg font-medium text-gray-900">{t("shop.tuPedido")}</h2>
                <dl className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">{t("shop.subtotal")}</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {format(totalAmt)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="flex items-center text-sm text-gray-600">
                      <span>{t("shop.envio")}</span>
                      <Tooltip label={t("shop.shippingInfoLabel")}>
                        {t("shop.shippingInfo")}
                      </Tooltip>
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {format(shippingAmt)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="text-base font-medium text-gray-900">
                      {t("shop.total")}
                    </dt>
                    <dd className="text-lg font-bold text-gray-900">
                      {format(totalAmt + shippingAmt)}
                    </dd>
                  </div>
                </dl>
                <CheckoutBtn products={cartProduct} />
              </section>
            </div>
          </>
        ) : (
          <div className="card my-14 flex h-96 flex-col items-center justify-center gap-2 py-5">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("shop.tuCestaDeLa")}
            </h1>
            <p className="text-lg max-w-[600px] text-center text-gray-600 tracking-wide leading-6 py-8">
              {t("shop.tuCarritoEstaVacio")}
            </p>
            <Button text={t("shop.hacerLaCompra")} to={path("products")} />
          </div>
        )}
      </section>
    </main>
  );
};

export default ShopScreen;
