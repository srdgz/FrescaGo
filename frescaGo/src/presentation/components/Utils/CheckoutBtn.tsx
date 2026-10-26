import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { CartItem } from "../../../domain/cart";
import { formatShippingAddress, shippingDetailsOf } from "../../../domain/user";
import { useAppStore, useUseCases } from "../../AppContext";
import { useMoney } from "../../hooks/useMoney";
import { useLocale, useLocalePath } from "../../LocaleContext";

interface CheckoutBtnProps {
  products: CartItem[];
}

const disabledButton =
  "w-full cursor-not-allowed rounded-full bg-gray-300 px-6 py-3 text-center font-semibold text-gray-700";

const CheckoutBtn = ({ products }: CheckoutBtnProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAppStore();
  const { startCheckout } = useUseCases();
  const locale = useLocale();
  const path = useLocalePath();
  const { currency } = useMoney();
  const shipping = shippingDetailsOf(currentUser);

  const handleCheckout = async () => {
    if (!currentUser || !shipping) return;
    try {
      await startCheckout(products, currentUser.email, {
        currency,
        locale,
        shipping,
      });
    } catch (error) {
      console.error("Checkout error:", error);
      window.alert(t("checkout.error"));
    }
  };

  if (!currentUser) {
    return (
      <div className="mt-6">
        <button type="button" disabled className={disabledButton}>
          {t("checkout.pagar")}
        </button>
        <p className="mt-2 text-center text-sm font-medium text-danger">
          {t("checkout.necesitasIniciarSesionPara")}
        </p>
      </div>
    );
  }

  if (!shipping) {
    return (
      <div className="mt-6">
        <p
          role="alert"
          className="mb-4 rounded-xl bg-accent-soft px-4 py-3 text-sm font-medium text-accent"
        >
          {t("checkout.addressRequired")}
        </p>
        <Link
          to={path("editProfile")}
          state={{ returnTo: "shop" }}
          className="outline-btn mb-3 w-full"
        >
          {t("checkout.addAddress")}
        </Link>
        <button type="button" disabled className={disabledButton}>
          {t("checkout.pagar")}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-4 rounded-xl bg-soft px-4 py-3 text-sm">
        <p className="font-semibold">{t("checkout.shipTo")}</p>
        <p className="mt-1 text-gray-700">{shipping.recipient}</p>
        <p className="text-gray-700">
          {formatShippingAddress(shipping.address, locale)}
        </p>
        <Link
          to={path("editProfile")}
          state={{ returnTo: "shop" }}
          className="mt-2 inline-block font-semibold text-brand underline underline-offset-4"
        >
          {t("checkout.changeAddress")}
        </Link>
      </div>
      <button
        onClick={handleCheckout}
        type="button"
        className="primary-btn w-full"
      >
        {t("checkout.pagar")}
      </button>
    </div>
  );
};

export default CheckoutBtn;
