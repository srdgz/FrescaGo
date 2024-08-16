import React from "react";
import AddToCartBtn from "../Utils/AddToCartBtn";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { store } from "../../lib/store";
import { RiCloseCircleLine } from "react-icons/ri";

const CartProduct = ({ product }) => {
  const { removeFromCart } = store();

  const handleRemoveProduct = () => {
    if (product) {
      removeFromCart(product?.id);
      toast.success(`${product?.title} eliminado con éxito!`);
    }
  };

  return (
    <div className="flex py-6 sm:py-10">
      <Link to={`/productos/${product?.id}`}>
        <img
          src={product?.image}
          alt="productImage"
          className="h-24 w-24 object-cover object-center sm:h-48 sm:w-48"
        />
      </Link>
      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:pr-0">
          <div className="flex flex-col gap-1 col-span-3">
            <h3 className="text-lg font-semibold w-full text-gray-800">
              {product?.title}
            </h3>
            <p className="text-sm text-gray-600">
              Categoría:{" "}
              <span className="font-medium">{product?.category}</span>
            </p>
            <div className="flex items-center gap-6 mt-2">
              <p className="text-lg font-semibold text-gray-800">
                {(product?.price * product?.quantity).toFixed(2)}€
              </p>
              <AddToCartBtn product={product} />
            </div>
          </div>
          <div className="mt-4 sm:mt-0 sm:pr-9">
            <div className="absolute right-0 top-0">
              <button
                onClick={handleRemoveProduct}
                className="-m2 inline-flex p-2 text-gray-600 hover:text-primary"
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
