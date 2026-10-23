import type { CartItem } from "../../../domain/cart";
import { useAppStore, useUseCases } from "../../AppContext";

interface CheckoutBtnProps {
  products: CartItem[];
}

const CheckoutBtn = ({ products }: CheckoutBtnProps) => {
  const { currentUser } = useAppStore();
  const { startCheckout } = useUseCases();

  const handleCheckout = async () => {
    if (!currentUser) return;
    try {
      await startCheckout(products, currentUser.email);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div className="mt-6">
      {currentUser ? (
        <button
          onClick={handleCheckout}
          type="submit"
          className="w-full rounded-md border border-transparent bg-gray-800 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-50 duration-200"
        >
          Pagar
        </button>
      ) : (
        <button className="w-full text-base text-white text-center rounded-md border border-transparent bg-gray-500 px-4 py-3 cursor-not-allowed">
          Pagar
        </button>
      )}
      {!currentUser && (
        <p className="mt-2 text-sm font-medium text-red-500 text-center">
          Necesitas iniciar sesión para completar la compra
        </p>
      )}
    </div>
  );
};

export default CheckoutBtn;
