import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaMinus, FaPlus } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
// import PriceTag from "./PriceTag";
import { store } from "../../lib/store";

const AddToCartBtn = ({ className, title, product, showPrice = true }) => {
  const [existingProduct, setExistingProduct] = useState(null);
  const { addToCart, cartProduct, decreaseQuantity } = store();

  useEffect(() => {
    const availableItem = cartProduct.find((item) => item?.id === product?.id);
    setExistingProduct(availableItem || null);
  }, [product, cartProduct]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success(`${product?.name.substring(0, 10)} añadido con éxito!`);
    } else {
      toast.error("No se ha añadido el producto");
    }
  };

  const handleDeleteProduct = () => {
    if (existingProduct) {
      if (existingProduct?.quantity > 1) {
        decreaseQuantity(existingProduct?.id);
        toast.success(`${product?.name.substring(0, 10)} reducido con éxito`);
      } else {
        toast.error("No puedes reducir menos de 1");
      }
    }
  };

  const newClassName = twMerge(
    "bg-[#f7f7f7] uppercase text-xs py-3 text-center rounded-full font-semibold hover:bg-black hover:text-white hover:scale-105 duration-200 cursor-pointer",
    className
  );

  //   const getRegularPrice = () => {
  //     if (existingProduct) {
  //       return existingProduct?.quantity * (product?.price || 0);
  //     } else {
  //       return product?.price || 0;
  //     }
  //   };

  return (
    <>
      {/* {showPrice && (
        <div>
          <PriceTag
            regularPrice={getRegularPrice()}
          />
        </div>
      )} */}
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
