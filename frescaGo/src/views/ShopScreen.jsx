import { useEffect, useState } from "react";
import CartProduct from "../components/Products/CartProduct";
import CheckoutBtn from "../components/Utils/CheckoutBtn";
import Button from "../components/Utils/Button";
import { useNavigate } from "react-router-dom";
import { store } from "../lib/store";
import { RiQuestionLine } from "react-icons/ri";

const ShopScreen = () => {
  const [totalAmt, setTotalAmt] = useState(0);
  const { cartProduct } = store();
  const navigate = useNavigate();

  const shippingAmt = 4.99;

  useEffect(() => {
    const total = cartProduct.reduce((sum, product) => {
      return sum + product?.price * product?.quantity;
    }, 0);
    setTotalAmt(total);
  }, [cartProduct]);

  const handleProductClick = (id) => {
    navigate(`/productos/${id}`);
  };

  return (
    <main className="overflow-x-hidden">
      <section className="container py-12 md:py-24">
        {cartProduct.length > 0 ? (
          <>
            <h1 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
              Tu cesta de la compra
            </h1>

            <div className="mt-10 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
              <section className="lg:col-span-7">
                <div className="divide-y divide-gray-200 border-b border-t border-gray-200">
                  {cartProduct.map((product) => (
                    <CartProduct
                      product={product}
                      key={product?.id}
                      onClick={() => handleProductClick(product?.id)}
                    />
                  ))}
                </div>
              </section>
              <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                <h2 className="text-lg font-medium text-gray-900">Tu pedido</h2>
                <dl className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {totalAmt.toFixed(2)}€
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="flex items-center text-sm text-gray-600">
                      <span>Envío</span>
                      <RiQuestionLine
                        className="h-5 w-5 text-gray-400 ml-2"
                        aria-hidden="true"
                      />
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {shippingAmt}€
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="text-base font-medium text-gray-900">
                      TOTAL
                    </dt>
                    <dd className="text-lg font-bold text-gray-900">
                      {(totalAmt + shippingAmt).toFixed(2)}€
                    </dd>
                  </div>
                </dl>
                <CheckoutBtn products={cartProduct} />
              </section>
            </div>
          </>
        ) : (
          <div className="bg-white h-96 flex flex-col gap-2 items-center justify-center py-5 my-14 rounded-lg border border-gray-200 drop-shadow-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
              Tu cesta de la compra
            </h1>
            <p className="text-lg max-w-[600px] text-center text-gray-600 tracking-wide leading-6 py-8">
              Tu carrito está vacío. Empieza a añadir productos frescos y
              saludables.
            </p>
            <Button text="Hacer la compra" to="/productos" />
          </div>
        )}
      </section>
    </main>
  );
};

export default ShopScreen;
