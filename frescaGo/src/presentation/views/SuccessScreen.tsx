import { useEffect, useState } from "react";
import Loading from "../components/Utils/Loading";
import Button from "../components/Utils/Button";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppStore, useUseCases } from "../AppContext";
import { useMoney } from "../hooks/useMoney";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "../LocaleContext";

const SuccessScreen = () => {
  const { t } = useTranslation();
  const path = useLocalePath();
  const location = useLocation();
  const navigate = useNavigate();
  const { saveOrder } = useUseCases();
  const { currency, usdPerEur } = useMoney();
  const { currentUser, cartProduct, resetCart } = useAppStore();
  const [loading, setLoading] = useState(false);
  const sessionId = new URLSearchParams(location.search).get("session_id");

  useEffect(() => {
    if (!sessionId) {
      navigate(path("home"));
    } else if (currentUser && cartProduct.length > 0) {
      const persistOrder = async () => {
        try {
          setLoading(true);
          await saveOrder(currentUser, sessionId, cartProduct, {
            currency,
            usdPerEur,
          });
          toast.success(t("success.paid"));
          resetCart();
        } catch (error) {
          console.error(error);
          toast.error(t("success.saveError"));
        } finally {
          setLoading(false);
        }
      };
      persistOrder();
    }
  }, [
    sessionId,
    navigate,
    currentUser,
    cartProduct,
    resetCart,
    saveOrder,
    currency,
    usdPerEur,
    path,
    t,
  ]);

  return (
    <main className="overflow-x-hidden">
      <section className="container py-12 md:py-24">
        {loading && <Loading />}
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-y-8 my-12">
          <h1 className="text-2xl md:text-4xl font-bold text-center text-secondary">
            {loading ? t("success.processing") : t("success.accepted")}
          </h1>
          <p>
            {loading ? t("success.onceDone") : t("success.now")} {t("success.puedesVerTusPedidos")}
          </p>
          <div className="flex items-center gap-x-8">
            <Button text={t("success.misPedidos")} to={path("orders")} />
            <Button text={t("success.seguirComprando")} to={path("products")} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default SuccessScreen;
