import Pagination from "./Pagination";
import AddToCartBtn from "../Utils/AddToCartBtn";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Product } from "../../../domain/catalog";
import { useMoney } from "../../hooks/useMoney";
import { useLocalePath } from "../../LocaleContext";

interface CategoryPaginationProps {
  products: Product[];
  itemsPerPage: number;
  label?: string;
}

const CategoryPagination = ({
  products,
  itemsPerPage,
  label,
}: CategoryPaginationProps) => {
  const { t } = useTranslation();
  const { format } = useMoney();
  const path = useLocalePath();
  const [currentPage, setCurrentPage] = useState(0);

  const startOffset = currentPage * itemsPerPage;
  const endOffset = startOffset + itemsPerPage;
  const currentProducts = products.slice(startOffset, endOffset);
  const pageCount = Math.ceil(products.length / itemsPerPage);

  return (
    <div>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {currentProducts.map((product) => (
          <li
            key={product.id}
            className="card flex gap-4 p-4 transition duration-200 hover:shadow-md"
          >
            <Link
              to={path("products", product.id)}
              tabIndex={-1}
              aria-hidden="true"
              className="flex h-28 w-28 flex-none items-center justify-center rounded-2xl bg-photo"
            >
              <img width={80} height={80} loading="lazy" decoding="async"
                src={product.image}
                alt=""
                className="h-20 w-20 object-contain mix-blend-multiply"
              />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
              <h3 className="font-display text-lg font-bold leading-tight">
                <Link
                  to={path("products", product.id)}
                  className="underline-offset-4 hover:underline"
                >
                  {product.title}
                </Link>
              </h3>
              <p className="font-semibold text-accent">
                {t("common.perKg", { price: format(product.price) })}
              </p>
              <AddToCartBtn
                product={product}
                title={t("pagination.comprar")}
                className="primary-btn px-5! py-2! text-sm"
              />
            </div>
          </li>
        ))}
      </ul>
      <Pagination
        page={currentPage}
        pageCount={pageCount}
        label={label}
        onChange={setCurrentPage}
      />
    </div>
  );
};

export default CategoryPagination;
