import Loading from "../components/Utils/Loading";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { db } from "../lib/firebase";
import { store } from "../lib/store";

const Orders = () => {
  const { currentUser } = store();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "orders", currentUser?.email || "");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const orderData = docSnap.data()?.orders || [];
          setOrders(orderData);
        } else {
          console.log("¡Aún no tienes pedidos!");
        }
      } catch (error) {
        console.log("Error al obtener los datos", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [currentUser]);

  return (
    <main className="overflow-x-hidden min-h-screen">
      <section className="container py-12 md:py-24">
        {loading ? (
          <Loading />
        ) : orders.length > 0 ? (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl text-secondary font-bold my-2">
              Detalles del pedido
            </h2>
            <p className="text-gray-600 mb-2">
              Nombre del cliente:{" "}
              <span className="text-black font-semibold">
                {currentUser?.firstName} {currentUser?.lastName}
              </span>
            </p>
            <p className="text-gray-600">
              Total de pedidos:{" "}
              <span className="text-black font-semibold">{orders.length}</span>
            </p>
            <p className="text-sm max-w-[600px] tracking-wide text-gray-500">
              Aquí puedes ver los detalles de tus pedidos anteriores. Si tienes
              alguna pregunta, no dudes en contactarnos.
            </p>
            <div className="flex flex-col gap-3">
              <div className="space-y-6 divide-y divide-gray-900/10">
                {orders.map((order) => {
                  const totalProducts = order?.orderItems.reduce(
                    (acc, item) => acc + (item?.price * item?.quantity || 0),
                    0
                  );
                  return (
                    <Disclosure
                      as="div"
                      key={order?.paymentId}
                      className="pt-6"
                    >
                      {({ open }) => (
                        <>
                          <dt>
                            <DisclosureButton className="flex w-full items-center justify-between text-left text-gray-900">
                              <span className="flex-1 text-sm sm:text-base md:text-lg lg:text-xl font-semibold leading-7 truncate">
                                Número de seguimiento:{" "}
                                <span className="font-normal break-words">
                                  {order?.paymentId}
                                </span>
                              </span>
                              <span className="ml-4 sm:ml-6">
                                {open ? (
                                  <FaMinus className="text-secondary text-sm sm:text-base md:text-lg" />
                                ) : (
                                  <FaPlus className="text-secondary text-sm sm:text-base md:text-lg" />
                                )}
                              </span>
                            </DisclosureButton>
                          </dt>

                          <DisclosurePanel
                            as="dd"
                            className="mt-5 pr-4 sm:pr-6 md:pr-8 lg:pr-12"
                          >
                            <div className="flex flex-col gap-2 bg-[#f4f4f480] p-4 sm:p-5 md:p-6 border border-gray-200">
                              <p className="text-sm sm:text-base font-semibold">
                                Tu pedido{" "}
                                <span className="text-secondary">
                                  #{order?.paymentId.substring(0, 20)}...
                                </span>{" "}
                                ha sido enviado y estará contigo pronto.
                              </p>
                              <div className="flex flex-col gap-1">
                                <p className="text-sm sm:text-base text-gray-600">
                                  Cantidad de artículos en el pedido:{" "}
                                  <span className="text-black font-medium">
                                    {order?.orderItems?.length}
                                  </span>
                                </p>
                                <p className="text-sm sm:text-base text-gray-600">
                                  Estado del pago:{" "}
                                  <span className="text-black font-medium">
                                    Pagado por Stripe
                                  </span>
                                </p>
                                <p className="text-sm sm:text-base text-gray-600">
                                  Importe del pedido:{" "}
                                  <span className="text-black font-medium">
                                    {totalProducts.toFixed(2)}€
                                  </span>
                                </p>
                                <p className="text-sm sm:text-base text-gray-600">
                                  Importe del envío:{" "}
                                  <span className="text-black font-medium">
                                    4.99€
                                  </span>
                                </p>
                              </div>
                              {order?.orderItems?.map((item) => (
                                <div
                                  key={item?.id}
                                  className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 border-b border-gray-200 py-3"
                                >
                                  <Link
                                    to={`/productos/${item?.id}`}
                                    className="h-20 w-20 sm:h-32 sm:w-32 md:h-40 md:w-40 flex-none rounded-lg bg-gray-100 border border-gray-300 hover:border-skyText overflow-hidden"
                                  >
                                    <img
                                      src={item?.image}
                                      alt="Imagen del producto"
                                      className="h-full w-full object-cover object-center hover:scale-110 duration-300"
                                    />
                                  </Link>
                                  <div className="flex flex-auto flex-col">
                                    <div>
                                      <Link
                                        to={`/productos/${item?.id}`}
                                        className="font-medium text-gray-900 text-sm sm:text-base"
                                      >
                                        {item?.title}
                                      </Link>
                                      <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-900">
                                        {item?.category}
                                      </p>
                                    </div>
                                    <div className="mt-4 sm:mt-6 flex flex-1 items-end">
                                      <dl className="flex flex-wrap space-x-4 divide-x divide-gray-200 text-xs sm:text-sm md:text-base">
                                        <div className="flex">
                                          <dt className="font-medium text-gray-900">
                                            Cantidad
                                          </dt>
                                          <dd className="ml-2 text-gray-700">
                                            {item?.quantity}
                                          </dd>
                                        </div>
                                        <div className="flex pl-4 sm:pl-6">
                                          <dt className="font-medium text-gray-900">
                                            Precio
                                          </dt>
                                          <dd className="ml-2 text-gray-700">
                                            <span>
                                              {item.price.toFixed(2)}€
                                            </span>
                                          </dd>
                                        </div>
                                        <div className="flex pl-4 sm:pl-6">
                                          <dt className="font-medium text-gray-900">
                                            Subtotal
                                          </dt>
                                          <dd className="ml-2 text-gray-700">
                                            <span>
                                              {(
                                                item?.price * item?.quantity
                                              ).toFixed(2)}
                                              €
                                            </span>
                                          </dd>
                                        </div>
                                      </dl>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </DisclosurePanel>
                        </>
                      )}
                    </Disclosure>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-2xl font-semibold">Aún no tienes pedidos</p>
            <p>No has realizado ninguna compra con nosotros</p>
            <Link
              to={"/product"}
              className="mt-2 bg-gray-800 text-gray-100 px-6 py-2 rounded-md hover:bg-black hover:text-white duration-200"
            >
              Ir de compras
            </Link>
          </div>
        )}
      </section>
    </main>
  );
};

export default Orders;
