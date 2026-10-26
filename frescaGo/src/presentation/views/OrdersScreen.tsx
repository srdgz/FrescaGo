import Loading from "../components/Utils/Loading";
import Button from "../components/Utils/Button";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { Order } from "../../domain/order";
import {
  orderCurrency,
  orderRate,
  orderReference,
  orderTotal,
} from "../../domain/order";
import { SHIPPING_AMOUNT } from "../../domain/cart";
import { intlLocale } from "../../domain/locale";
import { formatShippingAddress } from "../../domain/user";
import { useMoney } from "../hooks/useMoney";
import { useAppStore, useUseCases } from "../AppContext";
import { useTranslation } from "react-i18next";
import { useLocale, useLocalePath } from "../LocaleContext";

const Orders = () => {
  const { t } = useTranslation();
  const path = useLocalePath();
  const locale = useLocale();
  const { currentUser } = useAppStore();
  const { listOrders } = useUseCases();
  const { format } = useMoney();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const loadOrders = async () => {
      setLoading(true);
      try {
        setOrders(await listOrders(currentUser.email));
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [currentUser, listOrders]);

  return (
    <main className="overflow-x-hidden min-h-screen">
      <section className="container py-12 md:py-24">
        {loading ? (
          <Loading />
        ) : orders.length > 0 ? (
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-3xl text-secondary font-bold my-2">
              {t("orders.detallesDelPedido")}
            </h1>
            <p className="text-gray-600 mb-2">
              {t("orders.nombreDelCliente")}{" "}
              <span className="text-ink font-semibold">
                {currentUser?.firstName} {currentUser?.lastName}
              </span>
            </p>
            <p className="text-gray-600">
              {t("orders.totalDePedidos")}{" "}
              <span className="text-ink font-semibold">{orders.length}</span>
            </p>
            <p className="text-sm max-w-[600px] tracking-wide text-gray-500">
              {t("orders.aquiPuedesVerLos")}
            </p>
            <div className="flex flex-col gap-3">
              <div className="space-y-6 divide-y divide-gray-900/10">
                {orders.map((order) => {
                  const totalProducts = orderTotal(order);
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
                                {t("orders.numeroDeSeguimiento")}{" "}
                                <span className="font-normal break-words">
                                  {orderReference(order.paymentId)}
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
                            <div className="flex flex-col gap-2 rounded-card border border-line bg-surface p-4 sm:p-5 md:p-6">
                              <p className="text-sm sm:text-base font-semibold">
                                {t("orders.tuPedido")}{" "}
                                <span className="text-secondary">
                                  {orderReference(order.paymentId)}
                                </span>{" "}
                                {t("orders.haSidoEnviadoY")}
                              </p>
                              <div className="flex flex-col gap-1">
                                <p className="text-sm sm:text-base text-gray-600">
                                  {t("orders.cantidadDeArticulosEn")}{" "}
                                  <span className="text-ink font-medium">
                                    {order?.orderItems?.length}
                                  </span>
                                </p>
                                <p className="text-sm sm:text-base text-gray-600">
                                  {t("orders.estadoDelPago")}{" "}
                                  <span className="text-ink font-medium">
                                    {t("orders.pagadoPorStripe")}
                                  </span>
                                </p>
                                <p className="text-sm sm:text-base text-gray-600">
                                  {t("orders.importeDelPedido")}{" "}
                                  <span className="text-ink font-medium">
                                    {format(totalProducts, orderCurrency(order), orderRate(order))}
                                  </span>
                                </p>
                                <p className="text-sm sm:text-base text-gray-600">
                                  {t("orders.importeDelEnvio")}{" "}
                                  <span className="text-ink font-medium">
                                    {format(SHIPPING_AMOUNT, orderCurrency(order), orderRate(order))}
                                  </span>
                                </p>
                                {order.createdAt && (
                                  <p className="text-sm sm:text-base text-gray-600">
                                    {t("orders.orderDate")}{" "}
                                    <span className="text-ink font-medium">
                                      {new Date(order.createdAt).toLocaleDateString(
                                        intlLocale(locale),
                                        { dateStyle: "long" }
                                      )}
                                    </span>
                                  </p>
                                )}
                                {order.shipping && (
                                  <p className="text-sm sm:text-base text-gray-600">
                                    {t("orders.shippingAddress")}{" "}
                                    <span className="text-ink font-medium">
                                      {order.shipping.recipient},{" "}
                                      {formatShippingAddress(
                                        order.shipping.address,
                                        locale
                                      )}
                                    </span>
                                  </p>
                                )}
                              </div>
                              {order?.orderItems?.map((item) => (
                                <div
                                  key={item?.id}
                                  className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 border-b border-gray-200 py-3"
                                >
                                  <Link
                                    to={path("products", item?.id)}
                                    className="h-20 w-20 sm:h-32 sm:w-32 md:h-40 md:w-40 flex-none rounded-2xl bg-photo border border-line hover:border-brand overflow-hidden"
                                  >
                                    <img
                                      src={item?.image}
                                      alt={t("orders.imagenDelProducto")}
                                      className="h-full w-full object-contain mix-blend-multiply p-2"
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
                                        {item?.categoryLabel ?? item?.category}
                                      </p>
                                    </div>
                                    <div className="mt-4 sm:mt-6 flex flex-1 items-end">
                                      <dl className="flex flex-wrap space-x-4 divide-x divide-gray-200 text-xs sm:text-sm md:text-base">
                                        <div className="flex">
                                          <dt className="font-medium text-gray-900">
                                            {t("orders.cantidad")}
                                          </dt>
                                          <dd className="ml-2 text-gray-700">
                                            {item?.quantity}
                                          </dd>
                                        </div>
                                        <div className="flex pl-4 sm:pl-6">
                                          <dt className="font-medium text-gray-900">
                                            {t("orders.precio")}
                                          </dt>
                                          <dd className="ml-2 text-gray-700">
                                            <span>
                                              {format(item.price, orderCurrency(order), orderRate(order))}
                                            </span>
                                          </dd>
                                        </div>
                                        <div className="flex pl-4 sm:pl-6">
                                          <dt className="font-medium text-gray-900">
                                            {t("orders.subtotal")}
                                          </dt>
                                          <dd className="ml-2 text-gray-700">
                                            <span>
                                              {format(item.price * item.quantity, orderCurrency(order), orderRate(order))}
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
          <main className="overflow-x-hidden">
            <section className="container py-12 md:py-24">
              <div className="min-h-[400px] flex flex-col items-center justify-center gap-y-8 my-12">
                <h1 className="text-2xl md:text-4xl font-bold text-center text-secondary">
                  {t("orders.aunNoTienesPedidos")}
                </h1>
                <p>{t("orders.noHasRealizadoNinguna")}</p>
                <Button text={t("orders.irDeCompras")} to={path("products")} />
              </div>
            </section>
          </main>
        )}
      </section>
    </main>
  );
};

export default Orders;
