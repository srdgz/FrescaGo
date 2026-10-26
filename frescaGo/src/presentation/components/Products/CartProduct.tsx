import type { CartItem } from "../../../domain/cart";
import { itemTotal } from "../../../domain/cart";
import AddToCartBtn from "../Utils/AddToCartBtn";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAppStore } from "../../AppContext";
import { useMoney } from "../../hooks/useMoney";
import { useLocalePath } from "../../LocaleContext";
import { RiCloseCircleLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";

interface CartProductProps {
  product: CartItem;
}

const CartProduct = ({ product }: CartProductProps) => {
  const { t } = useTranslation();
  const { removeFromCart } = useAppStore();
  const { format } = useMoney();
  const path = useLocalePath();

  const handleRemoveProduct = () => {
    if (product) {
      removeFromCart(product?.id);
      toast.success(t("toast.removedFromCart", { title: product?.title }));
    }
  };

  return (
    <div className="flex py-6 sm:py-10">
      <Link
        to={path("products", product?.id)}
        tabIndex={-1}
        aria-hidden="true"
        className="flex-none self-start rounded-2xl bg-photo p-2"
      >
        <img width={160} height={160} loading="lazy" decoding="async"
          src={product?.image}
          alt=""
          className="h-24 w-24 object-contain mix-blend-multiply sm:h-40 sm:w-40"
        />
      </Link>
      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:pr-0">
          <div className="flex flex-col gap-1 col-span-3">
            <h2 className="text-lg font-semibold w-full text-gray-800">
              {product?.title}
            </h2>
            <p className="text-sm text-gray-600">
              {t("cartItem.categoria")}{" "}
              <span className="font-medium">{product?.categoryLabel ?? product?.category}</span>
            </p>
            <div className="flex items-center gap-6 mt-2">
              <p className="text-lg font-semibold text-gray-800">
                {format(itemTotal(product))}
              </p>
              <AddToCartBtn product={product} />
            </div>
          </div>
          <div className="mt-4 sm:mt-0 sm:pr-9">
            <div className="absolute right-0 top-0">
              <button
                onClick={handleRemoveProduct}
                aria-label={t("cartItem.remove", { title: product?.title })}
                className="-m2 inline-flex p-2 text-gray-600 hover:text-brand"
              >
                <RiCloseCircleLine className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
