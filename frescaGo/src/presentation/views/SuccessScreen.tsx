import { useEffect, useRef, useState } from "react";
import Loading from "../components/Utils/Loading";
import Button from "../components/Utils/Button";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  OrderNotFoundError,
  OrderOwnerMismatchError,
  PaymentNotCompletedError,
  orderReference,
} from "../../domain/order";
import { useAppStore, useUseCases } from "../AppContext";
import { useLocalePath } from "../LocaleContext";

type Status =
  | "confirming"
  | "confirmed"
  | "unpaid"
  | "notFound"
  | "mismatch"
  | "error"
  | "needLogin";

const statusOf = (error: unknown): Status => {
  if (error instanceof PaymentNotCompletedError) return "unpaid";
  if (error instanceof OrderNotFoundError) return "notFound";
  if (error instanceof OrderOwnerMismatchError) return "mismatch";
  return "error";
};

const SuccessScreen = () => {
  const { t } = useTranslation();
  const path = useLocalePath();
  const location = useLocation();
  const navigate = useNavigate();
  const { confirmOrder } = useUseCases();
  const { currentUser, resetCart } = useAppStore();
  const sessionId = new URLSearchParams(location.search).get("session_id");
  const [status, setStatus] = useState<Status>("confirming");
  const [reference, setReference] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const started = useRef<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      navigate(path("home"), { replace: true });
      return;
    }
    if (!currentUser) {
      setStatus("needLogin");
      return;
    }
    const key = `${sessionId}:${currentUser.id}:${attempt}`;
    if (started.current === key) return;
    started.current = key;
    setStatus("confirming");
    confirmOrder(currentUser, sessionId)
      .then(({ order, alreadySaved }) => {
        setReference(orderReference(order.paymentId));
        resetCart();
        setStatus("confirmed");
        if (!alreadySaved) {
          toast.success(t("success.paid"));
        }
      })
      .catch((error) => {
        console.error(error);
        setStatus(statusOf(error));
      });
  }, [sessionId, currentUser, attempt, confirmOrder, resetCart, navigate, path, t]);

  const retry = (
    <button
      type="button"
      onClick={() => setAttempt((value) => value + 1)}
      className="primary-btn"
    >
      {t("success.retry")}
    </button>
  );

  return (
    <main className="overflow-x-hidden">
      <section className="container py-12 md:py-24">
        <div
          aria-live="polite"
          className="mx-auto my-12 flex min-h-[400px] max-w-2xl flex-col items-center justify-center gap-y-6 text-center"
        >
          {status === "confirming" && <Loading />}
          <h1 className="text-2xl font-bold md:text-4xl">
            {t(`success.title.${status}`)}
          </h1>
          <p className="text-gray-700">{t(`success.body.${status}`)}</p>
          {status === "confirmed" && reference && (
            <p className="rounded-full bg-soft px-5 py-2 text-sm">
              {t("success.orderNumber")}{" "}
              <strong className="font-bold text-brand">{reference}</strong>
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {status === "confirmed" && (
              <>
                <Button
                  text={t("success.misPedidos")}
                  to={path("orders")}
                  className="!mb-0"
                />
                <Button
                  text={t("success.seguirComprando")}
                  to={path("products")}
                  variant="outline"
                  className="!mb-0"
                />
              </>
            )}
            {(status === "unpaid" || status === "error") && (
              <>
                {retry}
                <Button
                  text={t("cancel.volverAlInicio")}
                  to={path("home")}
                  variant="outline"
                  className="!mb-0"
                />
              </>
            )}
            {(status === "notFound" || status === "mismatch") && (
              <>
                <Button
                  text={t("success.misPedidos")}
                  to={path("orders")}
                  className="!mb-0"
                />
                <Button
                  text={t("cancel.volverAlInicio")}
                  to={path("home")}
                  variant="outline"
                  className="!mb-0"
                />
              </>
            )}
            {status === "needLogin" && (
              <Button
                text={t("nav.account")}
                to={path("user")}
                className="!mb-0"
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default SuccessScreen;
