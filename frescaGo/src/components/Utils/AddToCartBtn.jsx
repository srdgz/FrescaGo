import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaMinus, FaPlus } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { store } from "../../lib/store";

const AddToCartBtn = ({ className, title, product }) => {
  const [existingProduct, setExistingProduct] = useState(null);
  const { addToCart, cartProduct, decreaseQuantity } = store();

  useEffect(() => {
    const availableItem = cartProduct.find((item) => item?.id === product?.id);
    setExistingProduct(availableItem || null);
  }, [product, cartProduct]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success(`${product?.title} añadido con éxito!`);
    } else {
      toast.error("No se ha añadido el producto");
    }
  };

  const handleDeleteProduct = () => {
    if (existingProduct) {
      if (existingProduct?.quantity > 1) {
        decreaseQuantity(existingProduct?.id);
        toast.success(`${product?.title} eliminado con éxito`);
      } else {
        toast.error("No puedes eliminar más productos");
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
            className="bg-[#f7f7f7] text-black p-2 border-[1px] border-gray-200 hover:border-skyText rounded-full text-sm hover:bg-white duration-200 cursor-pointer"
          >
            <FaMinus />
          </button>
          <p className="text-base font-semibold w-10 text-center">
            {existingProduct?.quantity}
          </p>
          <button
            onClick={handleAddToCart}
            className="bg-[#f7f7f7] text-black p-2 border-[1px] border-gray-200 hover:border-skyText rounded-full text-sm hover:bg-white duration-200 cursor-pointer"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button onClick={handleAddToCart} className={newClassName}>
          {title ? title : "Comprar"}
        </button>
      )}
    </>
  );
};

export default AddToCartBtn;
