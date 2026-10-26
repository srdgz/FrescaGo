import toast from "react-hot-toast";
import { FaMinus, FaPlus } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import type { Product } from "../../../domain/catalog";
import { useAppStore } from "../../AppContext";

interface AddToCartBtnProps {
  className?: string;
  title?: string;
  product: Product;
}

const AddToCartBtn = ({ className, title, product }: AddToCartBtnProps) => {
  const { t } = useTranslation();
  const { addToCart, cartProduct, decreaseQuantity } = useAppStore();
  const existingProduct =
    cartProduct.find((item) => item.id === product?.id) ?? null;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success(t("toast.added", { title: product?.title }));
    } else {
      toast.error(t("toast.notAdded"));
    }
  };

  const handleDeleteProduct = () => {
    if (existingProduct) {
      if (existingProduct?.quantity > 1) {
        decreaseQuantity(existingProduct?.id);
        toast.success(t("toast.removed", { title: product?.title }));
      } else {
        toast.error(t("toast.minimum"));
      }
    }
  };

  const newClassName = twMerge(className);

  return (
    <>
      {existingProduct ? (
        <div className="flex items-center justify-start gap-2 mt-2">
          <button
            onClick={handleDeleteProduct}
            aria-label={t("toast.decrease", { title: product?.title })}
            className="rounded-full border border-gray-400 bg-surface p-2 text-sm text-ink transition-colors duration-200 hover:border-brand hover:text-brand"
          >
            <FaMinus />
          </button>
          <p className="text-base font-semibold w-10 text-center">
            {existingProduct?.quantity}
          </p>
          <button
            onClick={handleAddToCart}
            aria-label={t("toast.increase", { title: product?.title })}
            className="rounded-full border border-gray-400 bg-surface p-2 text-sm text-ink transition-colors duration-200 hover:border-brand hover:text-brand"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button onClick={handleAddToCart} className={newClassName}>
          {title ? title : t("pagination.comprar")}
        </button>
      )}
    </>
  );
};

export default AddToCartBtn;
