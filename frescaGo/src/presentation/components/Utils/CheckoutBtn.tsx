import type { CartItem } from "../../../domain/cart";
import { useAppStore, useUseCases } from "../../AppContext";
import { useTranslation } from "react-i18next";
import { useMoney } from "../../hooks/useMoney";
import { useLocale } from "../../LocaleContext";

interface CheckoutBtnProps {
  products: CartItem[];
}

const CheckoutBtn = ({ products }: CheckoutBtnProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAppStore();
  const { startCheckout } = useUseCases();
  const locale = useLocale();
  const { currency } = useMoney();

  const handleCheckout = async () => {
    if (!currentUser) return;
    try {
      await startCheckout(products, currentUser.email, { currency, locale });
    } catch (error) {
      console.error("Checkout error:", error);
      window.alert(t("checkout.error"));
    }
  };

  return (
    <div className="mt-6">
      {currentUser ? (
        <button
          onClick={handleCheckout}
          type="submit"
          className="primary-btn w-full"
        >
          {t("checkout.pagar")}
        </button>
      ) : (
        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed rounded-full bg-gray-300 px-6 py-3 text-center font-semibold text-gray-700"
        >
          {t("checkout.pagar")}
        </button>
      )}
      {!currentUser && (
        <p className="mt-2 text-sm font-medium text-danger text-center">
          {t("checkout.necesitasIniciarSesionPara")}
        </p>
      )}
    </div>
  );
};

export default CheckoutBtn;
